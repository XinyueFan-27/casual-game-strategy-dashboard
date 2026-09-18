import Link from "next/link";
import { formatChange, formatCompact, Game, relationForCategory } from "../lib/data";
import { GameAvatar, StatusPill } from "./GameUI";

type MetricSource = {
  name: "Sensor Tower" | "AppMagic";
  period: string | null;
  rank: number | string | null;
  dau: number | string | null;
  iap: number | string | null;
  iapChange: number | string | null;
  downloads: number | string | null;
  downloadsChange: number | string | null;
};

type TestingProfile = { testDate: string; markets: string; latestRevenue: number; mom: number; peakRevenue: number; status: string };

const testProfileOverrides: Record<string, TestingProfile> = {
  "match-villains": { testDate: "2025.09", markets: "加拿大／英国", latestRevenue: 3700000, mom: .148, peakRevenue: 4100000, status: "加速测试" },
  "match-squad": { testDate: "2026.01", markets: "加拿大／英国", latestRevenue: 620000, mom: .385, peakRevenue: 620000, status: "加速测试" },
  "monopoly-match": { testDate: "2025.12", markets: "美国／澳洲", latestRevenue: 280000, mom: .096, peakRevenue: 310000, status: "稳定验证" },
  roomscapes: { testDate: "2026.03", markets: "加拿大", latestRevenue: 180000, mom: .312, peakRevenue: 180000, status: "达标新品" },
  "merge-prison-hidden-puzzle": { testDate: "2025.09", markets: "加拿大／英国", latestRevenue: 7500000, mom: .28, peakRevenue: 7500000, status: "突破型新品" },
  "mystery-town-merge-and-cases": { testDate: "2026.02", markets: "加拿大／美国", latestRevenue: 440000, mom: 1.087, peakRevenue: 440000, status: "加速测试" },
  "haunted-merge-horror-story": { testDate: "2026.01", markets: "日本／韩国", latestRevenue: 510000, mom: .28, peakRevenue: 510000, status: "达标新品" },
  "whisper-castle-merge-and-story": { testDate: "2026.04", markets: "英国／澳洲", latestRevenue: 160000, mom: .425, peakRevenue: 160000, status: "达标新品" },
};

function testingProfile(game: Game, index: number): TestingProfile {
  if (testProfileOverrides[game.id]) return testProfileOverrides[game.id];
  const revenue = typeof game.monthlyIap === "number" && game.monthlyIap >= 100000 ? game.monthlyIap : 120000 + ((index * 73000 + game.id.length * 19000) % 760000);
  const change = typeof game.monthlyIapChange === "number" ? game.monthlyIapChange : .08 + ((index * 13 + game.id.length) % 37) / 100;
  const dates = ["2024.10", "2025.02", "2025.06", "2025.11", "2026.01", "2026.03", "2026.05"];
  const markets = ["加拿大", "澳洲／新西兰", "英国／加拿大", "美国／澳洲", "日本／韩国"];
  return { testDate: dates[(index + game.id.length) % dates.length], markets: markets[(index * 2 + game.id.length) % markets.length], latestRevenue: revenue, mom: change, peakRevenue: Math.round(revenue * (1.08 + (index % 4) * .07)), status: change >= .3 ? "加速测试" : revenue >= 500000 ? "达标新品" : "稳定验证" };
}

type AnomalySignal = {
  kind: "收入异动" | "下载异动";
  label: string;
  value: number;
  change: number;
  delta: number;
  currency?: boolean;
  strength?: number;
};

type AnomalyRow = {
  game: Game;
  main: AnomalySignal;
  related: AnomalySignal[];
  score: number;
  status: "双指标验证" | "单指标待验";
};

function metricDelta(value: number, change: number) {
  if (change <= -1) return value * change;
  const previous = value / (1 + change);
  return value - previous;
}

function signalsFor(game: Game): AnomalySignal[] {
  const candidates = [
    { kind: "收入异动" as const, label: "收入", value: game.monthlyIap, change: game.monthlyIapChange, currency: true },
    { kind: "下载异动" as const, label: "下载", value: game.monthlyDownloads, change: game.monthlyDownloadsChange },
  ];
  return candidates
    .filter((item): item is typeof item & { value: number; change: number } => typeof item.value === "number" && typeof item.change === "number")
    .map((item) => ({ ...item, delta: metricDelta(item.value, item.change) }));
}

function anomalyRows(categoryId: string, games: Game[]): AnomalyRow[] {
  const candidates = games
    .filter((game) => ["头部产品", "规模产品"].includes(relationForCategory(game, categoryId)?.group ?? ""))
    .map((game) => ({ game, signals: signalsFor(game) }))
    .filter((item) => item.signals.some((signal) => signal.change > 0));
  const maxDeltaByKind = new Map<AnomalySignal["kind"], number>();
  candidates.forEach(({ signals }) => signals.filter((signal) => signal.change > 0).forEach((signal) => {
    maxDeltaByKind.set(signal.kind, Math.max(maxDeltaByKind.get(signal.kind) ?? 0, Math.abs(signal.delta)));
  }));

  return candidates.map(({ game, signals }) => {
    const positiveSignals = signals.filter((signal) => signal.change > 0).map((signal) => {
      const relativeStrength = Math.min(signal.change, 1);
      const absoluteStrength = Math.abs(signal.delta) / Math.max(maxDeltaByKind.get(signal.kind) ?? 1, 1);
      return { ...signal, strength: relativeStrength * .55 + absoluteStrength * .45 };
    }).sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0));
    const main = positiveSignals[0];
    const related = signals.filter((signal) => signal.kind !== main.kind).sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    const sameDirection = signals.filter((signal) => signal.change >= .03).length;
    const status: AnomalyRow["status"] = sameDirection >= 2 ? "双指标验证" : "单指标待验";
    const confirmation = Math.min(Math.max(sameDirection - 1, 0), 2) * .07;
    return { game, main, related, status, score: (main.strength ?? 0) + confirmation };
  }).sort((a, b) => b.score - a.score).slice(0, 8);
}

function sourceFor(game: Game, preferAppMagic = false): MetricSource | null {
  const hasAppMagic = [game.appMagicIap, game.appMagicDownloads].some((value) => typeof value === "number");
  if (preferAppMagic && hasAppMagic) {
    return {
      name: "AppMagic",
      period: game.appMagicPeriod,
      rank: game.appMagicRank,
      dau: null,
      iap: game.appMagicIap,
      iapChange: null,
      downloads: game.appMagicDownloads,
      downloadsChange: null,
    };
  }

  const hasSensorTower = [game.dau, game.monthlyIap, game.monthlyDownloads].some((value) => typeof value === "number");
  if (hasSensorTower) {
    return {
      name: "Sensor Tower",
      period: game.sensorPeriod,
      rank: game.sensorRank,
      dau: game.dau,
      iap: game.monthlyIap,
      iapChange: game.monthlyIapChange,
      downloads: game.monthlyDownloads,
      downloadsChange: game.monthlyDownloadsChange,
    };
  }

  if (!hasAppMagic) return null;
  return {
    name: "AppMagic",
    period: game.appMagicPeriod,
    rank: game.appMagicRank,
    dau: null,
    iap: game.appMagicIap,
    iapChange: null,
    downloads: game.appMagicDownloads,
    downloadsChange: null,
  };
}

function topGames(categoryId: string, games: Game[]) {
  const simulationCategories = ["farming", "life-sim", "time-management"];
  const preferAppMagic = simulationCategories.includes(categoryId) || categoryId === "social-casino";
  return games
    .map((game) => ({ game, source: sourceFor(game, preferAppMagic) }))
    .filter((item): item is { game: Game; source: MetricSource } => item.source !== null)
    .sort((a, b) => {
      if (categoryId === "merge" || simulationCategories.includes(categoryId) || categoryId === "social-casino") {
        const rankA = typeof a.source.rank === "number" ? a.source.rank : Number.MAX_SAFE_INTEGER;
        const rankB = typeof b.source.rank === "number" ? b.source.rank : Number.MAX_SAFE_INTEGER;
        if (rankA !== rankB) return rankA - rankB;
      }
      const iapA = typeof a.source.iap === "number" ? a.source.iap : -1;
      const iapB = typeof b.source.iap === "number" ? b.source.iap : -1;
      return iapB - iapA;
    })
    .slice(0, 10);
}

function orderedHeadGames(games: Game[]) {
  return [...games].sort((a, b) => {
    const rankA = a.sensorRank ?? a.appMagicRank;
    const rankB = b.sensorRank ?? b.appMagicRank;
    const numericA = typeof rankA === "number" ? rankA : Number.MAX_SAFE_INTEGER;
    const numericB = typeof rankB === "number" ? rankB : Number.MAX_SAFE_INTEGER;
    if (numericA !== numericB) return numericA - numericB;
    const revenueA = typeof a.monthlyIap === "number" ? a.monthlyIap : typeof a.appMagicIap === "number" ? a.appMagicIap : -1;
    const revenueB = typeof b.monthlyIap === "number" ? b.monthlyIap : typeof b.appMagicIap === "number" ? b.appMagicIap : -1;
    if (revenueA !== revenueB) return revenueB - revenueA;
    return a.name.localeCompare(b.name);
  });
}

function MetricCell({ value, change, currency = false }: { value: number | string | null; change: number | string | null; currency?: boolean }) {
  const changeText = formatChange(change);
  return (
    <div className="snapshot-metric">
      <b>{value === null || value === "" ? "—" : formatCompact(value, currency)}</b>
      {changeText && <small className={typeof change === "number" && change >= 0 ? "up" : "down"}>{changeText}</small>}
    </div>
  );
}

function compactSubtype(subtype: string | null) {
  return subtype?.replace(/（.*?）/g, "").trim() || "机制待核验";
}

export function CategorySnapshot({ categoryId, allGames, headGames, scaleGames = [], testingGames }: { categoryId: string; allGames: Game[]; headGames: Game[]; scaleGames?: Game[]; testingGames: Game[] }) {
  const ranking = topGames(categoryId, [...headGames, ...scaleGames]);
  const anomalies = anomalyRows(categoryId, allGames);
  const testingEntries = testingGames.map((game, index) => ({ game, profile: testingProfile(game, index) })).filter((item) => item.profile.latestRevenue >= 100000).sort((a, b) => b.profile.latestRevenue - a.profile.latestRevenue);
  const featuredTests = testingEntries.slice(0, 4);
  const remainingTests = testingEntries.slice(4);
  const isMatch3 = categoryId === "match3";
  const isSimulation = ["farming", "life-sim", "time-management"].includes(categoryId);
  const isSocialCasino = categoryId === "social-casino";
  const usesAnnualMetrics = isSimulation || isSocialCasino;
  const sources = Array.from(new Set(ranking.map((item) => item.source.name)));

  function WatchCard({ game }: { game: Game }) {
    const relation = relationForCategory(game, categoryId);
    return (
      <Link className="emerging-watch-card head-product-card" href={`/games/${game.id}/overview`}>
        <GameAvatar game={game} size="medium" />
        <div><div className="emerging-watch-name"><h4>{game.name}</h4><span>↗</span></div><small>{game.publisher ?? "厂商待补"}</small><div className="emerging-watch-tags"><StatusPill tone="green">头部产品</StatusPill><StatusPill>{relation?.researchRole ?? "研究样本"}</StatusPill></div><p>{relation?.reason ?? game.reason ?? "已纳入头部产品池，后续补充市场与产品证据。"}</p></div>
      </Link>
    );
  }

  function TestingCard({ game, profile }: { game: Game; profile: TestingProfile }) {
    return <Link className="testing-product-card" href={`/games/${game.id}/overview`}>
      <header><GameAvatar game={game} size="medium" /><div><h4>{game.name}</h4><small>{game.publisher ?? "厂商待补"}</small></div></header>
      <div className="testing-product-meta"><span>测试市场<b>{profile.markets}</b></span><span>首次监测<b>{profile.testDate}</b></span></div>
      <div className="testing-product-metrics"><span>近月收入<b>{formatCompact(profile.latestRevenue, true)}</b><small className={profile.mom >= 0 ? "up" : "down"}>{formatChange(profile.mom)}</small></span><span>峰值收入<b>{formatCompact(profile.peakRevenue, true)}</b></span></div>
    </Link>;
  }

  function RankingRows({ items, offset = 0 }: { items: typeof ranking; offset?: number }) {
    return items.map(({ game, source }, index) => {
      const displayRank = offset + index + 1;
      const relation = relationForCategory(game, categoryId);
      return (
        <tr className={isSocialCasino && relation?.group === "头部产品" ? "snapshot-head-row" : undefined} key={game.id}>
          <td><span className={`snapshot-rank rank-${displayRank}`}>{displayRank}</span></td>
          <td><Link className="snapshot-game" href={`/games/${game.id}/overview`}><GameAvatar game={game} size="small" /><span><span className="snapshot-game-name-line"><b>{game.name}</b><em className="snapshot-subtype">{compactSubtype(relation?.subtype ?? null)}</em></span><small>{game.publisher ?? "厂商待补"}</small><i>{source.name} · {source.period ?? "周期待补"}</i></span></Link></td>
          <td><MetricCell value={source.iap} change={source.iapChange} currency /></td>
          <td><MetricCell value={source.downloads} change={source.downloadsChange} /></td>
          <td><Link className="snapshot-open" href={`/games/${game.id}/overview`} aria-label={`进入${game.name}游戏看板`}>↗</Link></td>
        </tr>
      );
    });
  }

  return (
    <section className="content-card category-market-snapshot">
      <div className="section-title snapshot-title">
        <div>
          <span>当前证据 · CATEGORY EVIDENCE</span>
          <h2>头部格局与关键异动</h2>
          <p>用头部榜确认当前市场主体，再用异动榜发现值得追踪的产品信号。</p>
        </div>
        {sources.length > 0 && <div className="snapshot-source-note"><span>数据口径</span><b>{sources.join(" · ")}</b></div>}
      </div>

      <div className="snapshot-dual-layout">
        <section className="snapshot-panel snapshot-head-panel">
          <div className="snapshot-subsection-heading"><div><span>{isSocialCasino ? "市场梯队" : "头部产品"}</span><h3>{isSocialCasino ? "社交博彩收入 Top10" : isSimulation ? `${categoryId === "farming" ? "农场" : categoryId === "life-sim" ? "生活模拟" : "时间管理"}收入 Top10` : isMatch3 ? "三消收入 Top10" : `${categoryId === "merge" ? "二合" : "品类"}收入 Top10`}</h3><p>{usesAnnualMetrics ? "按全年IAP收入排序。" : "按最新完整月IAP收入排序。"}</p></div><Link href={`/games?category=${categoryId}`}>完整样本库 →</Link></div>
          <div className="category-ranking-list">
            <div className="category-list-header category-head-header"><span>#</span><span>游戏</span><span>{usesAnnualMetrics ? "2025收入" : "月收入"}</span><span>{usesAnnualMetrics ? "2025下载" : "月下载"}</span></div>
            <div className="category-list-scroll">{ranking.length > 0 ? ranking.map(({ game, source }, index) => {
              const relation = relationForCategory(game, categoryId);
              const revenueChange = formatChange(source.iapChange);
              const downloadsChange = formatChange(source.downloadsChange);
              return <Link className="category-list-row category-head-row" href={`/games/${game.id}/overview`} key={game.id}>
                <i className={`snapshot-rank rank-${index + 1}`}>{index + 1}</i>
                <div className="category-list-game"><GameAvatar game={game} size="small" /><span><span className="category-list-name"><b>{game.name}</b><em>{compactSubtype(relation?.subtype ?? null)}</em></span><small>{game.publisher ?? "厂商待补"}</small></span></div>
                <div className="category-list-metric"><b>{formatCompact(source.iap, true)}</b>{revenueChange && <small className={typeof source.iapChange === "number" && source.iapChange >= 0 ? "up" : "down"}>{revenueChange}</small>}</div>
                <div className="category-list-metric"><b>{formatCompact(source.downloads)}</b>{downloadsChange && <small className={typeof source.downloadsChange === "number" && source.downloadsChange >= 0 ? "up" : "down"}>{downloadsChange}</small>}</div>
              </Link>;
            }) : <div className="category-anomaly-empty snapshot-data-empty"><b>Top10数据待接入</b><span>版位已保留，将按统一收入口径自动生成完整榜单。</span></div>}</div>
          </div>
        </section>
        <section className="snapshot-panel snapshot-anomaly-panel">
          <div className="anomaly-table-heading"><div><span>市场信号雷达</span><h3>关键异动榜</h3><p>仅监测已正式发行产品的收入／下载正向异动；关联信号用于后续核对策略效果。</p></div><div className="anomaly-legend"><span>监测口径</span><b>7日正向异动</b></div></div>
          <div className="category-anomaly-table">
            <div className="category-list-header category-anomaly-header"><span>#</span><span>游戏</span><span>主要异动</span><span>关联信号</span></div>
            <div className="category-list-scroll">{anomalies.length > 0 ? anomalies.map((item, index) => <Link className="category-list-row category-anomaly-row" href={`/games/${item.game.id}/overview`} key={item.game.id}>
              <i className={`snapshot-rank rank-${index + 1}`}>{index + 1}</i>
              <div className="category-list-game"><GameAvatar game={item.game} size="small" /><span><span className="category-list-name"><b>{item.game.name}</b><em>{item.status}</em></span><small>{item.game.publisher ?? "厂商待补"}</small></span></div>
              <div className="category-anomaly-main"><span>{item.main.kind}</span><strong>+{formatCompact(item.main.delta, item.main.currency)}</strong><small>{formatChange(item.main.change)}</small></div>
              <div className="anomaly-related">{item.related.length > 0 ? item.related.slice(0, 2).map((signal) => <span className={signal.change >= 0 ? "up" : "down"} key={signal.kind}>{signal.label}{signal.change >= 0 ? "↑" : "↓"} {formatChange(signal.change)}</span>) : <small>暂无可比指标</small>}</div>
            </Link>) : <div className="category-anomaly-empty">当前周期暂无可信的正向异动</div>}</div>
          </div>
        </section>
      </div>

      <div className="emerging-watch-heading"><div><span>新品测试</span><h3>近24个月尚未全球发行的达标测试产品</h3><p>仅纳入区域测试／软启动产品，最新完整月IAP收入超过10万美元；前四款用卡片展示，其余进入明细榜。</p></div><span className="simulation-pill">模拟数据</span></div>
      {featuredTests.length > 0 ? <div className="testing-product-grid">{featuredTests.map(({ game, profile }) => <TestingCard game={game} profile={profile} key={game.id} />)}</div> : <div className="testing-product-empty"><b>当前样本库暂无达标测试产品</b><span>接入后将按首次测试时间、全球发行状态与月收入门槛自动筛选。</span></div>}
      {remainingTests.length > 0 && <div className="testing-product-table"><header><span>产品／发行商</span><span>测试市场</span><span>首次监测</span><span>近月收入</span><span>环比</span><span>峰值</span></header>{remainingTests.map(({ game, profile }) => <Link href={`/games/${game.id}/overview`} key={game.id}><span className="testing-product-name"><GameAvatar game={game} size="tiny" /><b>{game.name}<small>{game.publisher ?? "厂商待补"}</small></b></span><span>{profile.markets}</span><span>{profile.testDate}</span><strong>{formatCompact(profile.latestRevenue, true)}</strong><span className={profile.mom >= 0 ? "up" : "down"}>{formatChange(profile.mom)}</span><span>{formatCompact(profile.peakRevenue, true)}</span></Link>)}</div>}

      <div className="snapshot-research-strip"><p><b>数据</b>①产品月收入、下载及同比／环比；②7日收入与下载；③MAU、D30、首次测试、测试市场、全球发行状态与统一产品ID。</p><p><b>难点</b>需区分正式发行与区域测试，并确认活跃和留存覆盖可与收入产品池对齐。</p><p><b>替代方案</b>活跃不足时展示覆盖样本中位数；无法完整识别新品母池时只列可观测测试产品，不计算成功率。</p></div>
    </section>
  );
}

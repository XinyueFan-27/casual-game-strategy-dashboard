import Link from "next/link";
import { notFound } from "next/navigation";
import { GameAvatar, StatusPill } from "../../../_components/GameUI";
import { PlanModule, TrendPlan } from "../../../_components/Planning";
import { categoryPath, formatChange, formatCompact, gameSections, getCategory, getFamily, getGame, topics } from "../../../lib/data";

const validSections = new Set(gameSections.map(([id]) => id));

const toonBlastRevenue = [
  { period: "H1 2021", value: 223.4 },
  { period: "H1 2022", value: 188.3 },
  { period: "H1 2023", value: 135.0 },
  { period: "H1 2024", value: 212.7 },
];

const toonBlastStages = [
  { period: "2021—H1 2023", phase: "成熟期衰退", action: "原有玩法与活动结构进入存量期。", evidence: "H1收入从$223.4M降至$135M。", tone: "gray" },
  { period: "2023 Q4", phase: "核心机制转折", action: "约三个月内跟进Royal Match的Super Light Ball，形成Magic Disco。", evidence: "收入自2023年10月前后开始反弹。", tone: "blue" },
  { period: "2024", phase: "存量价值提升", action: "强道具提高连胜资产、续关确定性和难度空间。", evidence: "2024年1月收入$37.6M，之后稳定在月收入$35M以上。", tone: "green" },
  { period: "2025—2026", phase: "LiveOps系统化", action: "收藏、Wild Journey、三档通行证及2—6天重叠活动形成复合目标。", evidence: "下载较峰值下降90%以上，但收入与ARPDAU保持高位。", tone: "orange" },
] as const;

function ToonBlastEvidence({ compact = false }: { compact?: boolean }) {
  const maxRevenue = Math.max(...toonBlastRevenue.map((item) => item.value));
  return <section className={`content-card toon-evidence${compact ? " compact" : ""}`}>
    <div className="section-title"><div><span>{compact ? "策略证据 · SELECTED DATA" : "连续结果 · EXTERNAL ESTIMATES"}</span><h2>收入恢复并非来自下载恢复</h2><p>{compact ? "只保留能够支撑当前策略判断的指标；完整口径仍在数据表现页。" : "将收入、下载和单用户价值与关键产品节点对齐，区分结果事实与策略解释。"}</p></div>{compact && <Link href="/games/toon-blast/data">查看完整数据 →</Link>}</div>
    <div className="toon-evidence-layout">
      <div className="toon-bar-panel"><header><b>H1 IAP收入估算</b><small>单位：百万美元</small></header><div className="toon-bars">{toonBlastRevenue.map((item) => <div key={item.period}><div className="toon-bar-track"><i style={{ height: `${Math.max(12, item.value / maxRevenue * 100)}%` }}><span>${item.value}M</span></i></div><b>{item.period}</b></div>)}</div></div>
      <div className="toon-evidence-metrics">
        <article><span>2023年月均收入</span><b>$16.6M</b><small>转折前基准</small></article>
        <article><span>2024年1月收入</span><b>$37.6M</b><small>机制上线后的峰值</small></article>
        <article><span>下载变化</span><b>较峰值 −90%+</b><small>收入恢复并非新增驱动</small></article>
        <article><span>美国ARPDAU</span><b>$0.17—0.38 → $2—3</b><small>文章整理的第三方估算</small></article>
      </div>
    </div>
    <footer className="toon-source"><span>来源：Deconstructor of Fun；收入、下载与ARPDAU均为第三方估算。</span><a href="https://www.deconstructoroffun.com/blog/how-toon-blast-became-the-best-business-in-puzzle" target="_blank" rel="noreferrer">查看原始分析 ↗</a></footer>
  </section>;
}

function ToonBlastStrategyTimeline() {
  return <section className="content-card game-strategy-stages"><div className="section-title"><div><span>02 · STRATEGY INFLECTION</span><h2>从衰退老产品到存量价值再增长</h2><p>时间轴只保留改变经营结果的节点，不替代产品页中的完整版本记录。</p></div></div><div className="game-strategy-timeline">{toonBlastStages.map((stage, index) => <article className={`tone-${stage.tone}`} key={stage.period}><div className="game-stage-top"><span>{index + 1}</span><b>{stage.period}</b></div><h3>{stage.phase}</h3><p>{stage.action}</p><small>{stage.evidence}</small></article>)}</div></section>;
}

function ToonBlastStrategyResearch() {
  return <>
    <header className="section-page-heading"><div><span className="eyebrow">STRATEGY RESEARCH</span><h2>Toon Blast策略研究</h2><p>把数据转折、产品动作和商业逻辑放在同一条证据链中，区分事实、外部解释与我们的判断。</p></div><StatusPill tone="green">示范分析</StatusPill></header>
    <section className="strategy-quote"><span>当前策略判断</span><h2>Toon Blast的增长引擎已经从新增用户驱动转向存量用户价值驱动：Magic Disco制造转折，重叠LiveOps将一次功能提升扩展为长期商业引擎。</h2></section>
    <ToonBlastEvidence compact />
    <ToonBlastStrategyTimeline />
    <section className="content-card"><div className="section-title"><div><span>03 · CAUSAL CHAIN</span><h2>产品动作为什么可能带来商业结果</h2><p>这里是策略解释，不把功能上线与收入变化之间的相关性直接写成官方因果结论。</p></div></div><div className="strategy-causal-grid">
      <article><span>强道具链</span><h3>Magic Disco：把连胜变成需要保护的资产</h3><div>{["连胜获得强力状态", "失败意味着失去已拥有资产", "额外步数更像确定的收尾工具", "允许提高难度并增加转化机会"].map((item, index) => <p key={item}><b>{index + 1}</b>{item}</p>)}</div><footer>主要作用：提高续关价值和单局付费确定性；单一功能本身仍有上限。</footer></article>
      <article><span>系统复利链</span><h3>重叠LiveOps：让同一关同时推进多个目标</h3><div>{["收藏、通行证和竞赛同时运行", "每局关卡承载多个进度目标", "失败影响的不再只有当前关", "回访、续关与礼包价值共同提高"].map((item, index) => <p key={item}><b>{index + 1}</b>{item}</p>)}</div><footer>主要作用：在新增放缓后持续提升存量价值；依赖活动、经济和内容运营能力。</footer></article>
    </div></section>
    <section className="content-card"><div className="section-title"><div><span>04 · EVIDENCE LADDER</span><h2>哪些是事实，哪些仍是策略推断</h2></div></div><div className="evidence-ladder">
      <article><StatusPill tone="green">第三方数据事实</StatusPill><p>收入下降后恢复、下载较峰值明显下降、美国ARPDAU提升。</p></article>
      <article><StatusPill tone="blue">产品观察</StatusPill><p>Magic Disco上线；活动从单日独立形式转向2—6天重叠形式，并加入收藏与三档通行证。</p></article>
      <article><StatusPill tone="purple">外部分析观点</StatusPill><p>强道具约解释三分之一转折、其他系统约解释三分之二——属于作者判断，并非Peak官方归因。</p></article>
      <article><StatusPill tone="orange">我们的推断</StatusPill><p>增长引擎由获量转向存量提效；不等同于已经证明Peak完全停止UA投放。</p></article>
    </div></section>
    <section className="content-card"><div className="section-title"><div><span>05 · STRATEGIC TAKEAWAY</span><h2>它验证了什么，以及为什么不能表面复制</h2></div></div><div className="mechanism-two-column"><div><span>可迁移经验</span><p>✓ 成熟用户池可以被重新视为资产，而不是只看新增规模。</p><p>✓ 强功能负责制造转折，系统化LiveOps负责形成长期复利。</p><p>✓ 先提高用户价值，再重新评估UA，可能形成第二增长曲线。</p></div><div className="limits"><span>成立条件与风险</span><p>! Blast的低策略、强随机核心放大了强道具效果。</p><p>! 需要足够大的存量用户、持续关卡和经济调优能力。</p><p>! 缺少真实UA支出、留存、转化和A/B数据，因果仍需验证。</p></div></div></section>
    <div className="weak-note warning"><b>策略边界</b><span>“停止成为UA故事”是对增长来源的判断，不等于公司官方宣布停止获量；文章最后反而提出高RPD是否支持重新扩大投放。</span></div>
  </>;
}

export default async function GameSectionPage({ params }: { params: Promise<{ gameId: string; section: string }> }) {
  const { gameId, section } = await params;
  const game = getGame(gameId);
  if (!game || !validSections.has(section as never)) notFound();
  const relatedTopics = topics.filter((topic) => game.relations.some((relation) => topic.linkedCategories.includes(relation.categoryId)));
  const rpd = typeof game.monthlyIap === "number" && typeof game.monthlyDownloads === "number" && game.monthlyDownloads ? game.monthlyIap / game.monthlyDownloads : null;

  return <><header className="entity-header game-header"><div className="breadcrumb"><Link href="/games">游戏样本库</Link><span>›</span><b>{game.name}</b></div><div className="game-identity"><GameAvatar game={game} size="large" /><div><div className="pill-row"><StatusPill>{game.productType ?? "形态待补"}</StatusPill><StatusPill tone={game.group === "新兴关注" ? "orange" : game.group === "头部产品" ? "green" : "gray"}>{game.group ?? "待分组"}</StatusPill></div><h1>{game.name}</h1><p>{game.publisher ?? "厂商待补"} · {game.region ?? "地区待补"}</p></div><div className="game-context"><span>研究角色</span><b>{game.researchRole ?? "待定义"}</b><small>{game.relations.length > 1 ? `${game.relations.length}个品类关系` : categoryPath(game)[0]}</small></div></div></header><nav className="subnav game-subnav" aria-label="游戏子看板导航">{gameSections.map(([id, label]) => <Link className={section === id ? "active" : ""} href={`/games/${game.id}/${id}`} key={id}>{label}</Link>)}</nav>
    {section === "overview" && <GameOverview />}
    {section === "data" && <GameData />}
    {section === "product" && <GameProduct />}
    {section === "insights" && <GameInsights />}
  </>;

  function GameOverview() {
    return <><section className="game-overview-grid"><div className="content-card game-basic"><div className="section-title"><div><span>01 · BASIC INFO</span><h2>游戏基本信息</h2></div></div><dl className="info-grid"><div><dt>发行商/开发商</dt><dd>{game.publisher ?? "待补充"}</dd></div><div><dt>主要地区</dt><dd>{game.region ?? "待补充"}</dd></div><div><dt>产品形态</dt><dd>{game.productType ?? "待核验"}</dd></div><div><dt>候选分组</dt><dd>{game.group ?? "待分组"}</dd></div><div><dt>研究角色</dt><dd>{game.researchRole ?? "待定义"}</dd></div><div><dt>建议池层级</dt><dd>{game.poolLevel ?? "待定义"}</dd></div></dl><div className="category-relations"><span>分类路径</span>{game.relations.map((relation) => { const category = getCategory(relation.categoryId); const family = getFamily(relation.familyId); return <Link href={`/categories/${relation.categoryId}/overview`} key={relation.candidateId}><small>{family?.name}</small><b>{category?.name}</b><i>{relation.subtype ?? "三级机制待补"}</i></Link>; })}</div></div><aside className="content-card overview-side"><span>选择理由</span><p>{game.reason ?? "当前仅完成样本入池，选择理由待进一步补充。"}</p><div className="small-callout"><b>核心玩法核验</b><p>{game.gameplaySummary ?? game.notes ?? "待实测补充"}</p></div></aside></section><section className="content-card compact-card"><div className="section-title"><div><span>02 · PRODUCT SNAPSHOT</span><h2>产品结构速览</h2></div><Link href={`/games/${game.id}/product`}>进入产品拆解 →</Link></div><div className="snapshot-grid"><div><span>核心机制</span><b>{game.relations[0]?.subtype ?? "待核验"}</b><p>{game.notes ?? "待实测补充"}</p></div><div><span>Meta与长期驱动</span><b>{game.metaTags ?? "待实测"}</b><p>详细成长、收集和活动结构将在产品拆解页展开。</p></div><div><span>主要变现</span><b>规划拆解</b><p>将结合续关、道具、礼包、广告和通行证等触发点分析。</p></div></div></section><div className="weak-note"><b>来源与开放问题</b><span>{game.evidenceRisk ?? "当前边角信息已弱化；完整来源和风险将在对应数据或观点旁按需展开。"}</span>{game.sourceUrl && <a href={game.sourceUrl} target="_blank" rel="noreferrer">商店/线索来源 ↗</a>}</div></>;
  }

  function GameData() {
    const isToonBlast = game.id === "toon-blast";
    const metrics = isToonBlast ? [
      ["2024年1月收入", "$37.6M", "+126% vs 2023月均", "外部估算"],
      ["2024稳定月收入", "$35M+", null, "外部估算"],
      ["美国ARPDAU", "$2—3", null, "机制上线后区间"],
      ["下载较峰值", "−90%+", null, "收入未同步回落"],
    ] : [
      ["月IAP收入", formatCompact(game.monthlyIap, true), formatChange(game.monthlyIapChange), game.sensorPeriod],
      ["月下载量", formatCompact(game.monthlyDownloads), formatChange(game.monthlyDownloadsChange), game.sensorPeriod],
      ["RPD", rpd ? `$${rpd.toFixed(2)}` : "待补", null, "同口径收入÷下载"],
      ["月均日活", formatCompact(game.dau), formatChange(game.dauChange), game.sensorPeriod],
    ];
    return <><header className="section-page-heading"><div><span className="eyebrow">GAME PERFORMANCE</span><h2>{game.name}数据表现</h2><p>{isToonBlast ? "展示完整结果底稿，并将关键机制与LiveOps节点对齐；策略页只抽取支撑结论的证据。" : "当前展示Excel已有单期数据；连续时间变化将在下方独立趋势区接入。"}</p></div><StatusPill tone={isToonBlast ? "green" : "orange"}>{isToonBlast ? "外部数据示范" : "连续数据待接入"}</StatusPill></header><section className="metric-row game-metrics">{metrics.map(([label, value, change, period]) => <div key={label}><span>{label}</span><b>{value}</b>{change && <i className={String(change).startsWith("+") ? "positive" : "negative"}>{change}</i>}<small>{period ?? "数据期待补"}</small></div>)}</section>{isToonBlast ? <ToonBlastEvidence /> : <TrendPlan scope="游戏" />}<div className="planning-grid three"><PlanModule title="地区与平台分布" compact plan="收入、下载与活跃的国家/地区和平台拆分" data="地区、iOS与Android连续数据" question="规模主要来自哪里，区域结构是否变化？" /><PlanModule title="品类排名变化" compact plan="收入、下载和活跃排名的时间趋势" data="同品类月度排名" question="产品是在提升份额还是随市场波动？" /><PlanModule title="竞品对比" compact plan="与同机制头部和新兴产品并列比较" data="统一周期、统一口径的竞品数据" question="增长差异来自产品还是市场结构？" /></div><div className="weak-note"><b>数据口径</b><span>{isToonBlast ? "当前示范数据来自Deconstructor of Fun对第三方数据的整理；仍需补充连续月度原始数据、平台地区拆分、UA支出与内部行为指标。" : `Sensor Tower数据期：${game.sensorPeriod ?? "待补"}；AppMagic数据期：${game.appMagicPeriod ?? "待补"}。第三方数据均按估算口径使用。`}</span></div></>;
  }

  function GameProduct() {
    const loop = (game.gameplaySummary ?? game.notes ?? "核心玩法待实测补充").split(/[；;]/).filter(Boolean).slice(0, 5);
    return <><header className="section-page-heading"><div><span className="eyebrow">PRODUCT DECONSTRUCTION</span><h2>{game.name}产品拆解</h2><p>把产品事实和策略观点分开，集中解释“为什么会形成这样的表现”。</p></div><StatusPill tone="orange">实测补充中</StatusPill></header><section className="content-card"><div className="section-title"><div><span>核心循环</span><h2>玩法与长期目标如何连接</h2></div></div><div className="loop-flow">{loop.map((item, index) => <div key={`${item}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b>{index < loop.length - 1 && <i>→</i>}</div>)}</div><div className="product-facts"><div><span>三级机制</span><b>{game.relations.map((relation) => relation.subtype).filter(Boolean).join(" / ") || "待核验"}</b></div><div><span>Meta标签</span><b>{game.metaTags ?? "待实测"}</b></div><div><span>玩法摘要</span><b>{game.notes ?? "待实测"}</b></div></div></section><div className="planning-grid three"><PlanModule title="LiveOps结构" plan="活动类型、开放节奏、目标层级与核心循环连接" data="游戏内实测、活动日历和版本记录" question="活动是否真正提高核心循环价值？" /><PlanModule title="产品迭代时间线" plan="功能、活动、商业化与内容节点" data="版本历史、收入下载变化和外部分析" question="关键增长由哪个产品动作驱动？" /><PlanModule title="广告素材角度" plan="高频玩法画面、失败点、题材与承诺" data="投放素材样本与落地产品体验" question="获客表达与真实产品价值是否一致？" /></div><div className="weak-note"><b>研究边界</b><span>当前产品拆解优先标记已有事实与待实测模块，不用通用模板替代真实产品结构。</span></div></>;
  }

  function GameInsights() {
    if (game.id === "toon-blast") return <ToonBlastStrategyResearch />;
    return <><header className="section-page-heading"><div><span className="eyebrow">STRATEGY RESEARCH</span><h2>{game.name}策略研究</h2><p>单品页面用关键数据、转折节点和产品证据回答“它验证了什么”，品类页面负责形成更大的市场判断。</p></div><StatusPill tone={game.reason ? "orange" : "gray"}>{game.reason ? "待验证观点" : "规划模块"}</StatusPill></header><section className="strategy-quote"><span>当前一句话判断</span><h2>{game.reason ?? "当前仅完成样本入池，策略判断待产品实测和数据证据补充。"}</h2></section><section className="content-card strategy-chart-plan"><div className="section-title"><div><span>策略转折证据图</span><h2>关键数据与产品节点将在这里对齐</h2><p>上层展示收入与下载，下层展示RPD／ARPDAU，并标注3—5个真正改变经营结果的版本与运营节点。</p></div><Link href={`/games/${game.id}/data`}>进入完整数据 →</Link></div><TrendPlan scope="游戏" /></section><div className="insight-columns"><section className="content-card"><div className="section-title"><div><span>它验证了什么</span><h2>策略假设</h2></div></div><div className="hypothesis-list"><div><span>01</span><p>核心机制是否具备清晰、低门槛和可传播的价值。</p></div><div><span>02</span><p>Meta、内容与LiveOps是否有效延长生命周期。</p></div><div><span>03</span><p>商业化是否出现在自然且可感知的问题点。</p></div></div><PlanModule title="策略转折" compact plan="经营问题、关键动作、数据结果与因果解释" data="连续数据、版本节点、产品实测和外部研究" question="增长究竟由什么产品动作推动？" /></section><aside className="content-card evidence-links"><span>用于哪些分析</span>{game.relations.map((relation) => { const category = getCategory(relation.categoryId); return <Link href={`/categories/${relation.categoryId}/strategy`} key={relation.candidateId}><b>{category?.name}策略判断</b><small>{relation.researchRole ?? "代表样本"}</small><i>↗</i></Link>; })}{relatedTopics.slice(0, 4).map((topic) => <Link href={`/topics/${topic.id}`} key={topic.id}><b>{topic.name}</b><small>跨品类专题</small><i>↗</i></Link>)}</aside></div><div className="weak-note warning"><b>缺失证据与风险</b><span>{game.evidenceRisk ?? "需要继续补充连续数据、产品实测和竞品比较；当前判断不作为最终结论。"}</span></div></>;
  }
}

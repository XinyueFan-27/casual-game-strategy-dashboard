import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GameAvatar, StatusPill } from "../../../_components/GameUI";
import { CategorySnapshot } from "../../../_components/CategorySnapshot";
import CategoryMarketDashboard from "../../../_components/CategoryMarketDashboard";
import CategoryMechanismDashboard from "../../../_components/CategoryMechanismDashboard";
import CategoryAnomalyDashboard from "../../../_components/CategoryAnomalyDashboard";
import { AnalysisBrief, DetailedPlanSection, PlanModule, TrendPlan } from "../../../_components/Planning";
import { categorySectionsFor, categoryTierMeta, gamesForCategory, getCategory, getCategoryTier, getFamily, getGame, relationForCategory } from "../../../lib/data";

const overviewJudgements: Record<string, string> = {
  match3: "三消仍是Puzzle中规模最大的成熟赛道，但收入增长已趋平；竞争重点正从基础交换规则转向存量用户价值、内容供给与高密度LiveOps。",
  merge: "二合正在从轻量合成玩法变成持续经营一套资源经济的长期产品；增长更快，但收入也进一步集中到具备强LiveOps与发行能力的头部厂商。",
  farming: "农场是模拟经营中规模最大且仍在加速的成熟细分，核心问题是头部长期运营优势是否会被混合玩法新品打破。",
  "life-sim": "生活模拟正由单款新品推动高速增长，需求已经出现，但稳定的产品梯队和可持续内容模型仍待验证。",
  "time-management": "时间管理保持温和增长，成熟产品基本盘稳定，新品突破更依赖题材差异、关卡内容与运营供给。",
};

type OverviewKpi = { revenue: string; revenueYoy: string; downloads: string; downloadsYoy: string; mau: string; mauYoy: string; d30: string; d30Yoy: string; arpdau: string; arpdauYoy: string };

const overviewKpis: Record<string, OverviewKpi> = {
  match3: { revenue: "$640M", revenueYoy: "−0.8%", downloads: "210M", downloadsYoy: "+5.4%", mau: "166M", mauYoy: "−2.4%", d30: "12.8%", d30Yoy: "+0.4pp", arpdau: "$0.129", arpdauYoy: "+4.9%" },
  merge: { revenue: "$218M", revenueYoy: "+21.0%", downloads: "88M", downloadsYoy: "+12.0%", mau: "82M", mauYoy: "+8.1%", d30: "10.6%", d30Yoy: "+0.9pp", arpdau: "$0.089", arpdauYoy: "+9.2%" },
  match3d: { revenue: "$86M", revenueYoy: "+9.8%", downloads: "134M", downloadsYoy: "+8.6%", mau: "61M", mauYoy: "+6.1%", d30: "7.4%", d30Yoy: "+0.3pp", arpdau: "$0.047", arpdauYoy: "+3.6%" },
  block: { revenue: "$96M", revenueYoy: "+46.0%", downloads: "285M", downloadsYoy: "+19.0%", mau: "118M", mauYoy: "+16.8%", d30: "5.2%", d30Yoy: "+0.7pp", arpdau: "$0.027", arpdauYoy: "+25.0%" },
  sort: { revenue: "$56M", revenueYoy: "+31.2%", downloads: "116M", downloadsYoy: "+27.4%", mau: "53M", mauYoy: "+18.6%", d30: "7.8%", d30Yoy: "+0.5pp", arpdau: "$0.035", arpdauYoy: "+10.6%" },
  screw: { revenue: "$42M", revenueYoy: "+54.2%", downloads: "91M", downloadsYoy: "+38.6%", mau: "41M", mauYoy: "+29.4%", d30: "6.1%", d30Yoy: "+0.8pp", arpdau: "$0.034", arpdauYoy: "+19.2%" },
  farming: { revenue: "$576M", revenueYoy: "+15.0%", downloads: "172M", downloadsYoy: "+33.0%", mau: "74M", mauYoy: "+18.6%", d30: "14.1%", d30Yoy: "+0.7pp", arpdau: "$0.091", arpdauYoy: "+6.2%" },
  "life-sim": { revenue: "$118M", revenueYoy: "+76.0%", downloads: "86M", downloadsYoy: "+41.0%", mau: "39M", mauYoy: "+37.4%", d30: "12.2%", d30Yoy: "+1.1pp", arpdau: "$0.084", arpdauYoy: "+14.6%" },
  "time-management": { revenue: "$88M", revenueYoy: "+18.0%", downloads: "94M", downloadsYoy: "+12.0%", mau: "42M", mauYoy: "+9.1%", d30: "10.8%", d30Yoy: "+0.4pp", arpdau: "$0.070", arpdauYoy: "+5.0%" },
  "idle-rpg": { revenue: "$126M", revenueYoy: "−3.6%", downloads: "92M", downloadsYoy: "−2.1%", mau: "45M", mauYoy: "−2.8%", d30: "9.1%", d30Yoy: "−0.3pp", arpdau: "$0.093", arpdauYoy: "−0.8%" },
  casino: { revenue: "$214M", revenueYoy: "−2.7%", downloads: "72M", downloadsYoy: "−5.2%", mau: "61M", mauYoy: "−3.4%", d30: "18.5%", d30Yoy: "+0.1pp", arpdau: "$0.117", arpdauYoy: "+0.9%" },
  "social-casino": { revenue: "$352M", revenueYoy: "+3.5%", downloads: "102M", downloadsYoy: "+4.2%", mau: "94M", mauYoy: "+1.8%", d30: "20.8%", d30Yoy: "+0.3pp", arpdau: "$0.125", arpdauYoy: "+1.7%" },
};

type MechanismStage = {
  time: string;
  phase: string;
  change: string;
  playerState: string;
  businessLogic: string;
  effect: string;
  gameIds: string[];
};

type CompletedMechanismResearch = {
  thesis: string;
  contrast: string;
  loop: string[];
  baseTitle: string;
  baseDescription: string;
  trigger: string;
  psychology: string;
  value: string;
  limit: string;
  stages: MechanismStage[];
  proof: { metric: string; value: string; meaning: string }[];
  strengths: string[];
  boundaries: string[];
  conclusion: string;
  sources: { label: string; url: string; note: string }[];
};

const mechanismResearch: Record<string, CompletedMechanismResearch> = {
  match3: {
    thesis: "三消最初出售的是一次明确的关卡解决方案；后续演进的核心，是把一次性失败压力连接到连胜、活动和长期Meta，让同一局关卡同时承载更多价值。",
    contrast: "与二合的持久棋盘不同，三消关卡有清晰开始和结束。它更容易理解、受众更广，但一次会话中可制造的付费机会也更离散。",
    loop: ["进入预设关卡", "有限步数完成目标", "成功推进／失败重置", "续关、道具或下一次尝试"],
    baseTitle: "临时棋盘＋有限步数＋明确成败",
    baseDescription: "每关从预设棋盘开始，目标、剩余步数和结果都清晰可见；关卡结束后棋盘消失，玩家获得一个自然的停顿点。",
    trigger: "差几步完成目标、连续失败，或即将失去连胜与活动进度。",
    psychology: "接近成功、损失厌恶、避免重复劳动，以及保护已经积累的连胜资产。",
    value: "玩家表面购买额外步数和道具，实际购买的是“解决当前关卡、保住连续进度”。",
    limit: "每次失败形成一次离散购买；关卡结束也给玩家明确退出许可，付费频次受失败次数和会话长度限制。",
    stages: [
      { time: "2012前后", phase: "传统底座", change: "有限步数、生命、关前道具与失败续关形成基础经济。", playerState: "结果清晰，玩家知道多几步是否可能过关。", businessLogic: "出售解决方案：用额外步数或道具解决眼前失败。", effect: "付费理由直观、用户面宽，但消费机会相对离散。", gameIds: ["candy-crush-saga"] },
      { time: "2016—2020", phase: "长期进度", change: "Saga地图进一步叠加装修、剧情、区域建设等Meta。", playerState: "过关不再只为下一关，而是为完成装修、故事或长期目标。", businessLogic: "把单局奖励转成长期进度货币，扩大回访理由和内容消耗。", effect: "提高留存与生命周期，同时显著增加内容生产成本。", gameIds: ["gardenscapes", "homescapes"] },
      { time: "2023", phase: "连胜资产化", change: "连胜奖励、Super Light Ball等强力状态跨关延续。", playerState: "此前成功积累成可感知资产；失败意味着同时失去强力状态。", businessLogic: "从“解决一关”扩展到“保护连胜和高效率状态”。", effect: "提高通关速度，也让玩家更快接触难关和转化点；效果取决于关卡漏斗与经济平衡。", gameIds: ["royal-match", "toon-blast"] },
      { time: "2024—2026", phase: "LiveOps工业化", change: "竞赛、团队、通行证、收集和限时任务围绕同一关卡并行。", playerState: "完成一关可以同时推进多个目标，放弃一局的机会成本变高。", businessLogic: "放大每次核心玩法的价值，并用限时目标增加活跃和消费密度。", effect: "当新增放缓时，可继续提升存量用户价值；代价是运营复杂度和活动疲劳。", gameIds: ["royal-match", "toon-blast", "candy-crush-saga"] },
    ],
    proof: [
      { metric: "品类规模", value: "约 $4.8B", meaning: "2025年仍是最大Puzzle子品类，但同比基本持平，说明规模优势与增长压力同时存在。" },
      { metric: "Toon Blast转折", value: "$16.6M → $35M+", meaning: "Deconstructor of Fun整理显示，其月均收入在强道具与LiveOps重建后显著提高；这是外部估算，不等同于官方披露。" },
      { metric: "用户价值信号", value: "下载较峰值下降90%+", meaning: "同一研究认为收入仍接近高位，增长主要来自留存和单用户价值，而不是新增下载。" },
    ],
    strengths: ["目标、失败原因和购买价值都非常清晰", "单局边界明确，适合碎片化会话和广泛用户", "成熟关卡与LiveOps体系已经被长期验证"],
    boundaries: ["付费依赖失败和有限会话，天然存在消费频次上限", "成熟产品需要持续关卡、活动和经济调优", "新产品面对高获量成本和强头部存量优势"],
    conclusion: "当前三消的商业公式已经从“失败后卖五步”演进为“用关卡制造清晰结果，再以连胜、强道具、Meta与多层LiveOps提高每局价值”。值得借鉴的是价值叠加方式，而不是表面复制某一个道具。",
    sources: [
      { label: "Does Merge-2 Monetize Better Than Match-3?", url: "https://www.deconstructoroffun.com/blog/does-merge-2-monetize-better-than-match-3", note: "临时棋盘、出售解决方案与消费上限" },
      { label: "How Toon Blast Became the Best Business in Puzzle", url: "https://www.deconstructoroffun.com/blog/how-toon-blast-became-the-best-business-in-puzzle", note: "强道具、ARPDAU与存量用户价值" },
      { label: "Win Streak: the Gift That Keeps on Giving", url: "https://www.deconstructoroffun.com/blog/2024/8/5/win-streak-the-gift-that-keeps-on-giving", note: "Super Light Ball与连胜机制" },
      { label: "AppMagic Mobile Market Landscape 2026", url: "https://appmagic.rocks/files/view/upload/Reports/EN_MobileMarkeLandscape2026.pdf", note: "2025 Puzzle及Match-3市场数据" },
    ],
  },
  merge: {
    thesis: "二合真正出售的不是能量本身，而是持续推动一套尚未完成的订单经济；持久棋盘、生成器、活动计时和空间压力共同让“暂停”比“失败”更难离开。",
    contrast: "三消让玩家在明确成败后重新决定是否继续；二合把未完成订单、半成品和冷却状态保留下来，让下一次付费更像延续已在进行的事情。",
    loop: ["点击生成器消耗能量", "合并并管理棋盘空间", "完成订单获得货币", "推进剧情／活动后继续生产"],
    baseTitle: "持久棋盘＋生成器＋订单经济",
    baseDescription: "棋盘不会随会话结束而清空。半成品、未完成订单、生成器冷却和活动计时都被保留，玩家管理的不是单个谜题，而是一套持续运转的资源系统。",
    trigger: "能量耗尽、生成器冷却、差一个高阶物品、棋盘拥堵，或限时活动即将结束。",
    psychology: "动量保护、未完成效应、沉没成本、完成欲、稀缺时间，以及解除空间和等待压力。",
    value: "玩家表面购买能量、钻石、物品和礼包，实际购买的是“继续生产、完成订单、解除阻塞和赶上活动”。",
    limit: "持续压力也会形成认知负担；高阶物品真实成本不透明，棋盘拥堵和活动叠加可能让轻度用户感到疲劳或失控。",
    stages: [
      { time: "2020前后", phase: "传统底座", change: "合成链、生成器、能量和订单组成持续棋盘经济。", playerState: "离开时任务没有结束，半成品和订单仍停留在原处。", businessLogic: "出售连续性：能量耗尽不是失败，而是把未完成状态暂停。", effect: "同一会话可反复购买能量，付费频次上限高于离散关卡。", gameIds: ["merge-mansion", "travel-town"] },
      { time: "2021—2022", phase: "叙事与经营", change: "订单奖励进一步连接剧情、装修、区域修复和角色关系。", playerState: "生产行为同时推进故事与长期身份目标。", businessLogic: "用情感和长期进度扩大订单价值，使轻操作获得长线意义。", effect: "拓宽受众并提高回访，但持续依赖剧情、任务与内容供给。", gameIds: ["gossip-harbor", "merge-mansion", "seaside-escape"] },
      { time: "约2023", phase: "消耗速度可控", change: "2×／4×强化生成器在头部产品中逐步标准化。", playerState: "玩家可以主动用更多能量换取更高阶物品，减少重复点击。", businessLogic: "能量从被动门槛变成可主动加速的消费资源；消耗越快，补充理由越快出现。", effect: "提高高价值用户消费速度，也适配希望短时清空能量的高活跃用户。", gameIds: ["gossip-harbor", "travel-town"] },
      { time: "2024—2026", phase: "活动叠加", change: "订单、赛季、棋盘活动、收集和限时竞赛同时读取核心生产行为。", playerState: "一笔能量同时推进多个目标，临近活动终点时动量价值进一步放大。", businessLogic: "将礼包、能量和活动追赶结合，形成高频、重复、不同价格带的付费出口。", effect: "AppMagic显示头部二合收入更多来自LiveOps关联优惠；壁垒转向活动编排、经济和发行能力。", gameIds: ["gossip-harbor", "travel-town", "seaside-escape"] },
    ],
    proof: [
      { metric: "品类增长", value: "14% → 20%", meaning: "AppMagic显示Merge占Puzzle收入份额在2024—2025年明显提高，证明用户与收入正在向新格式迁移。" },
      { metric: "头部集中", value: "Top10 ≈ 80%", meaning: "品类增长并不等于普遍机会；2025年大部分收入已集中在前十款产品。" },
      { metric: "头部样本", value: "$550M / 33%", meaning: "Gossip Harbor在2025年的收入和品类份额显示，机制成熟需要与LiveOps、内容和发行能力结合。" },
      { metric: "消耗速度", value: "780能量 / 约7分钟", meaning: "外部拆解估算4×生成器可显著压缩能量消耗时间，说明它改变的不只是便捷性，也是消费速度。" },
    ],
    strengths: ["未完成状态持续存在，回访和继续付费理由更连续", "同一棋盘可同时承载订单、活动、空间与时间压力", "能量补充和强化生成器让高价值用户拥有更高消费空间"],
    boundaries: ["经济价值更隐蔽，玩家难以直观判断高阶物品成本", "棋盘拥堵、多活动和未完成任务可能造成认知压力", "规模化依赖强内容、LiveOps、经济设计和UA，不能只复制合成操作"],
    conclusion: "当前二合的商业公式是“用持久棋盘保存未完成状态，再让订单、活动、空间和生成器共同放大连续性价值”。它可能比三消获得更高的单用户消费空间，但更高认知负担和更强组织能力要求也限制了受众和可复制性。",
    sources: [
      { label: "Does Merge-2 Monetize Better Than Match-3?", url: "https://www.deconstructoroffun.com/blog/does-merge-2-monetize-better-than-match-3", note: "持久棋盘、连续性付费与强化生成器" },
      { label: "Finding Genre Success: the Case of Gossip Harbor", url: "https://www.deconstructoroffun.com/blog/2024/8/19/finding-genre-success-the-case-of-gossip-harbor", note: "订单经济、活动、礼包和能量消耗速度" },
      { label: "AppMagic Mobile Market Landscape 2026", url: "https://appmagic.rocks/files/view/upload/Reports/EN_MobileMarkeLandscape2026.pdf", note: "Merge份额、集中度与优惠收入结构" },
      { label: "GameRefinery: Why Merge Could be the New Match3", url: "https://www.gamerefinery.com/why-merge-could-be-the-new-match3/", note: "混合机制与扩展变现场景" },
    ],
  },
};

export default async function CategorySectionPage({ params }: { params: Promise<{ categoryId: string; section: string }> }) {
  const { categoryId, section } = await params;
  const category = getCategory(categoryId);
  if (!category) notFound();
  if (section === "competition") redirect(`/categories/${categoryId}/market`);
  if (section === "evolution") redirect(`/categories/${categoryId}/mechanism`);
  if (section === "games") redirect(`/games?category=${categoryId}`);
  const visibleSections = categorySectionsFor(category.id);
  const validSections = new Set(visibleSections.map(([id]) => id));
  if (!validSections.has(section as never)) redirect(`/categories/${categoryId}/overview`);

  const family = getFamily(category.familyId);
  const categoryTier = getCategoryTier(category.id);
  const categoryGames = gamesForCategory(category.id);
  const headGames = categoryGames.filter((game) => relationForCategory(game, category.id).group === "头部产品");
  const scaleGames = categoryGames.filter((game) => relationForCategory(game, category.id).group === "规模产品");
  const emergingGames = categoryGames.filter((game) => relationForCategory(game, category.id).group === "新兴关注");
  const testingGames = categoryGames.filter((game) => ["新兴关注", "候补观察"].includes(relationForCategory(game, category.id).group ?? ""));

  return (
    <>
      <header className="entity-header category-header">
        <div className="breadcrumb"><Link href="/categories">品类研究</Link><span>›</span><span>{family?.name}</span><span>›</span><b>{category.name}</b></div>
        <div className="entity-title">
          <div className="entity-code">{category.code}</div>
          <div><span className="eyebrow">{family?.name} · {categoryTierMeta[categoryTier].label} · {categoryTierMeta[categoryTier].title}</span><h1>{category.name}<small>{category.english}</small></h1><p>{category.definition}</p></div>
          <div className="entity-summary"><b>{category.count}</b><span>候选记录</span><small>完整样本统一进入游戏样本库</small></div>
        </div>
      </header>
      <nav className={`subnav tier-${categoryTier}`} aria-label="品类子看板导航">{visibleSections.map(([id, label]) => <Link className={section === id ? "active" : ""} href={`/categories/${category.id}/${id}`} key={id}>{label}</Link>)}</nav>

      {section === "overview" && <CategoryOverview />}
      {section === "market" && <CategoryMarket categoryId={category.id} categoryName={category.name} />}
      {section === "mechanism" && <CategoryMechanism category={category} />}
      {section === "strategy" && <CategoryStrategy categoryId={category.id} categoryName={category.name} headGames={headGames} emergingGames={emergingGames} />}
    </>
  );

  function CategoryOverview() {
    const kpi = overviewKpis[category.id] ?? overviewKpis.match3d;
    const kpiCards = [
      { label: "月IAP收入", value: kpi.revenue, change: kpi.revenueYoy, note: "商业规模与同比" },
      { label: "月下载", value: kpi.downloads, change: kpi.downloadsYoy, note: "新增需求与同比" },
      { label: "月MAU", value: kpi.mau, change: kpi.mauYoy, note: "活跃用户规模与同比" },
      { label: "D30留存中位数", value: kpi.d30, change: kpi.d30Yoy, note: "达标样本中位数" },
      { label: "IAP ARPDAU", value: kpi.arpdau, change: kpi.arpdauYoy, note: "单活跃用户付费价值" },
    ];
    return <>
      <section className="judgement-strip"><div><span>品类核心判断</span><h2>{overviewJudgements[category.id] ?? "完成分析后，这里将用一句话概括市场阶段、增长来源、核心商业机制与最值得关注的机会。"}</h2></div></section>
      <section className="content-card overview-kpi-section"><div className="overview-module-heading"><div><span>关键指标</span><h2>最新完整月市场状态</h2><p>统一观察规模、活跃、留存和单用户价值；以下数值用于演示最终对接形态。</p></div><small>模拟数据</small></div><div className="market-kpi-grid">{kpiCards.map((item, index) => <article className={`tone-${index + 1}`} key={item.label}><div className="market-kpi-top"><i>{["$", "↓", "◎", "↺", "↗"][index]}</i><span>{item.label}</span></div><b>{item.value}</b><div className="overview-kpi-change"><small>同比</small><strong className={item.change.startsWith("−") ? "down" : "up"}>{item.change}</strong></div><p>{item.note}</p></article>)}</div></section>
      <CategorySnapshot categoryId={category.id} allGames={categoryGames} headGames={headGames} scaleGames={scaleGames} testingGames={testingGames} />
    </>;
  }
}

function CategoryMarket({ categoryId, categoryName }: { categoryId: string; categoryName: string }) {
  if (categoryId === "match3" || categoryId === "merge" || categoryId === "block") return <CategoryMarketDashboard categoryId={categoryId} categoryName={categoryName} />;
  return <>
    <header className="section-page-heading"><div><span className="eyebrow">MARKET LANDSCAPE</span><h2>{categoryName}市场格局</h2><p>把规模趋势与竞争结构放在同一页，判断市场怎么变、增长属于谁、进入有多难。</p></div><StatusPill tone="gray">统一分析框架</StatusPill></header>
    <AnalysisBrief title="市场有多大，增长从哪里来，谁最终拿走了增长？" description="本页不把趋势和竞争拆成两套信息。先观察收入、下载、活跃与RPD，再拆解头部集中度、产品梯队、厂商能力和新品进入，最终形成市场阶段判断。" questions={["市场是在扩张、稳定还是收缩？", "变化来自新增用户、单用户价值还是少数头部产品？", "市场是否仍有可进入空间，需要跨过什么门槛？"]} />
    <DetailedPlanSection index="01" title="市场规模与增长质量" description="用少量核心指标建立市场状态，并通过连续趋势判断增长是否健康，而不是堆叠更多单期数字。" columns={4} items={[
      { label: "商业规模", title: "收入", text: "最新值、同比与近12／24个月趋势，判断商业规模是否真实扩张。" },
      { label: "新增需求", title: "下载", text: "识别自然需求、集中投放和季节性变化，避免把下载直接等同于市场质量。" },
      { label: "真实用户", title: "活跃", text: "观察下载是否沉淀为DAU／MAU，以及活跃与收入是否同步。" },
      { label: "单用户价值", title: "RPD／ARPDAU", text: "区分靠获量扩张、靠存量提效和两者同时改善的增长。" },
    ]} output="一句市场阶段判断＋核心指标卡＋连续趋势图＋数据口径。" />
    <section className="content-card trend-plan-section"><div className="section-title"><div><span>02 · CONTINUOUS TREND</span><h2>连续趋势与关键事件</h2><p>在拐点标记新品、规模投放、机制更新和大型活动，建立数据变化与产品动作之间的证据链。</p></div><StatusPill tone="gray">图表规划</StatusPill></div><TrendPlan scope="品类" /></section>
    <DetailedPlanSection index="03" title="增长来源与竞争结构" description="同一页回答“谁在增长”和“为什么它能拿走增长”，把Top榜单、集中度、厂商矩阵和新品表现收敛为竞争判断。" columns={2} items={[
      { label: "增长归因", title: "头部、新品与地区贡献", text: "拆解成熟产品、新兴产品、主要地区和平台对收入与活跃增量的贡献。" },
      { label: "市场集中", title: "Top3／Top10与份额变化", text: "判断品类增长是普遍红利，还是继续被少数产品和厂商吸收。" },
      { label: "竞争梯队", title: "领导者、规模产品与新兴产品", text: "同时使用规模、增长和稳定性分组，而不是只展示静态排名。" },
      { label: "新品进入", title: "成功率与突破路径", text: "观察近一年新品进入Top榜的数量、停留时间，以及玩法、题材、商业或发行切入点。" },
    ]} example="如果品类收入增长10%，但七成增量来自两款头部产品，同时新品下载增长却未转化为RPD，则市场增长并不等于进入空间扩大。" output="增长贡献图＋Top榜与集中度＋新品进入判断＋厂商能力壁垒。" />
  </>;
}

function EvidenceGames({ ids }: { ids: string[] }) {
  const evidenceGames = ids.map((id) => getGame(id)).filter((game): game is NonNullable<ReturnType<typeof getGame>> => Boolean(game));
  return <div className="mechanism-games">{evidenceGames.map((game) => <Link href={`/games/${game.id}/product`} key={game.id}><GameAvatar game={game} size="tiny" /><span>{game.name}</span></Link>)}</div>;
}

function MechanismTimeline({ stages }: { stages: MechanismStage[] }) {
  return <div className="mechanism-timeline">{stages.map((stage, index) => {
    const milestoneGames = stage.gameIds.map((id) => getGame(id)).filter((game): game is NonNullable<ReturnType<typeof getGame>> => Boolean(game)).slice(0, 3);
    return <article key={`${stage.time}-${stage.phase}`}>
      <div className="timeline-games">{milestoneGames.map((game) => <Link href={`/games/${game.id}/product`} title={game.name} key={game.id}><GameAvatar game={game} size="small" /></Link>)}</div>
      <div className="timeline-stem" />
      <span className="timeline-node">{index + 1}</span>
      <div className="timeline-copy"><b>{stage.time}</b><h3>{stage.phase}</h3><p>{stage.businessLogic}</p></div>
    </article>;
  })}</div>;
}

function CategoryMechanism({ category }: { category: NonNullable<ReturnType<typeof getCategory>> }) {
  if (category.id === "match3" || category.id === "merge") return <CategoryMechanismDashboard categoryId={category.id} />;
  const research = mechanismResearch[category.id];
  if (!research) return <GenericMechanism category={category} />;

  return <>
    <header className="section-page-heading"><div><span className="eyebrow">MECHANISM & BUSINESS EVOLUTION</span><h2>{category.name}机制与商业演进</h2><p>从传统核心机制出发，解释它如何塑造玩家状态、产生商业价值，并在演进中改变留存与消费空间。</p></div><StatusPill tone="green">示范分析</StatusPill></header>
    <section className="mechanism-thesis"><span>核心判断</span><h2>{research.thesis}</h2><p>{research.contrast}</p></section>

    <section className="content-card mechanism-foundation">
      <div className="section-title"><div><span>01 · CORE FOUNDATION</span><h2>传统核心机制与原始商业逻辑</h2><p>先明确玩家真正反复做什么，再分析付费点，而不是从礼包和商店倒推产品。</p></div></div>
      <div className="mechanism-loop"><div><span>传统机制底座</span><h3>{research.baseTitle}</h3><p>{research.baseDescription}</p></div><div className="loop-flow">{research.loop.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b>{index < research.loop.length - 1 && <i>→</i>}</div>)}</div></div>
      <div className="commercial-logic-grid">
        <article><span>触发状态</span><p>{research.trigger}</p></article>
        <article><span>玩家心理</span><p>{research.psychology}</p></article>
        <article><span>真正出售的价值</span><p>{research.value}</p></article>
        <article className="risk"><span>天然上限</span><p>{research.limit}</p></article>
      </div>
    </section>

    <section className="content-card mechanism-evolution">
      <div className="section-title"><div><span>02 · INDUSTRY TIMELINE</span><h2>机制演进时间轴</h2><p>先用少量关键节点建立行业变化印象；产品只在能够验证某次演进时出现。</p></div></div>
      <MechanismTimeline stages={research.stages} />
    </section>

    <section className="content-card mechanism-evolution">
      <div className="section-title"><div><span>03 · STAGE DETAIL</span><h2>每次变化如何改变玩家状态与商业逻辑</h2><p>下方与时间轴逐一对应，继续解释机制变化、玩家感受、商业假设、效果与限制。</p></div></div>
      <div className="mechanism-stage-list">{research.stages.map((stage, index) => <article key={stage.phase}>
        <div className="stage-index"><span>{String(index + 1).padStart(2, "0")}</span><b>{stage.phase}</b><small>{stage.time}</small></div>
        <div><small>机制变化</small><p>{stage.change}</p><EvidenceGames ids={stage.gameIds} /></div>
        <div><small>玩家状态</small><p>{stage.playerState}</p></div>
        <div><small>商业逻辑与效果</small><p>{stage.businessLogic}</p><em>{stage.effect}</em></div>
      </article>)}</div>
    </section>

    <section className="content-card">
      <div className="section-title"><div><span>04 · EFFECT EVIDENCE</span><h2>演进是否真的转化为商业结果</h2><p>外部市场数据用于验证方向，产品机制解释结果；两者不能互相替代。</p></div></div>
      <div className="mechanism-proof-grid">{research.proof.map((proof) => <article key={proof.metric}><span>{proof.metric}</span><b>{proof.value}</b><p>{proof.meaning}</p></article>)}</div>
    </section>

    <section className="content-card mechanism-synthesis">
      <div className="section-title"><div><span>05 · SYNTHESIS</span><h2>当前商业公式、优势与边界</h2></div></div>
      <div className="mechanism-two-column"><div><span>为什么成立</span>{research.strengths.map((item) => <p key={item}>✓ {item}</p>)}</div><div className="limits"><span>为什么不能简单复制</span>{research.boundaries.map((item) => <p key={item}>! {item}</p>)}</div></div>
      <div className="mechanism-conclusion"><span>机制判断</span><p>{research.conclusion}</p></div>
    </section>

    <section className="mechanism-sources"><span>主要参考与证据边界</span><div>{research.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><b>{source.label}</b><small>{source.note}</small><i>↗</i></a>)}</div><p>第三方收入、下载与ARPDAU均为估算或外部研究结论；因果判断仍需结合版本前后数据、产品实测与更多样本继续验证。</p></section>
  </>;
}

function GenericMechanism({ category }: { category: NonNullable<ReturnType<typeof getCategory>> }) {
  return <>
    <header className="section-page-heading"><div><span className="eyebrow">MECHANISM & BUSINESS EVOLUTION</span><h2>{category.name}机制与商业演进</h2><p>统一从传统核心机制出发，分析商业逻辑、演进路径、效果证据与可复制边界。</p></div><StatusPill tone="gray">分析框架</StatusPill></header>
    <AnalysisBrief title="这个品类为什么成立，又为什么演变成今天的产品形态？" description="页面不再把核心玩法、Meta、变现和LiveOps拆成互不相干的功能清单，而是沿着“机制—玩家状态—商业逻辑—结果—边界”解释演进。" questions={["传统核心循环天然制造了什么玩家需求？", "后续演进改变了什么状态，又新增了什么商业价值？", "哪些效果已经验证，哪些只是值得监控的机制假设？"]} />
    <section className="content-card"><div className="section-title"><div><span>品类内部机制</span><h2>用于比较的机制范围</h2><p>三级机制只帮助内部比较，不会替代品类层的主判断。</p></div></div><section className="subtype-grid">{category.subtypes.map((subtype, index) => <div key={subtype}><span>0{index + 1}</span><h3>{subtype}</h3><p>后续补充核心规则、关键玩家状态、商业触发点和代表证据。</p></div>)}</section></section>
    <DetailedPlanSection index="01" title="传统核心机制与商业底座" description="先写清核心循环、成败或暂停方式，再识别机制天然产生的心理动机和商业出口。" columns={4} items={[
      { label: "核心行为", title: "玩家反复做什么", text: "描述不可删除的操作、目标和一局／一次完整循环。" },
      { label: "玩家状态", title: "哪里形成未满足需求", text: "识别接近成功、等待、拥堵、进度损失、收藏缺口或竞争压力。" },
      { label: "商业价值", title: "玩家真正买什么", text: "不是只列道具，而是说明购买的是解决、连续、加速、保护还是身份。" },
      { label: "天然限制", title: "付费上限与体验成本", text: "说明消费频次、用户广度、认知负担和内容成本。" },
    ]} />
    <DetailedPlanSection index="02" title="机制与商业演进路径" description="按3—5个关键阶段分析机制变化、玩家状态、商业逻辑、效果证据和限制，并只引用能证明观点的代表产品。" items={[
      { label: "机制变化", title: "改了什么", text: "核心玩法、长期进度、活动或资源结构发生了什么关键变化。" },
      { label: "商业假设", title: "为什么要改", text: "变化希望改善留存、活跃、转化、消费频次还是用户规模。" },
      { label: "效果验证", title: "结果是否成立", text: "使用版本前后、横向产品和市场数据验证，而不是把相关性写成因果。" },
    ]} />
    <DetailedPlanSection index="03" title="当前商业公式与边界" description="把演进收敛为一条可复用判断，同时明确不能表面复制的能力门槛。" items={[
      { label: "已验证", title: "当前主流公式", text: "总结已经成为规模产品共同配置的机制组合。" },
      { label: "高门槛", title: "头部能力", text: "识别需要内容、经济、LiveOps、发行或技术能力才能成立的部分。" },
      { label: "待验证", title: "下一步演进", text: "记录已有信号但尚未形成规模扩散的新方向和验证条件。" },
    ]} output="一句机制判断＋演进路径＋效果证据＋优势、上限和后续验证信号。" />
  </>;
}

function CategoryStrategy({ categoryId, categoryName, headGames, emergingGames }: { categoryId: string; categoryName: string; headGames: ReturnType<typeof gamesForCategory>; emergingGames: ReturnType<typeof gamesForCategory> }) {
  if (categoryId === "match3" || categoryId === "merge") return <CategoryAnomalyDashboard categoryId={categoryId} categoryName={categoryName} />;
  const evidenceGames = [...headGames.slice(0, 2), ...emergingGames.slice(0, 1)];
  return <>
    <header className="section-page-heading"><div><span className="eyebrow">ANOMALY STRATEGY VALIDATION</span><h2>{categoryName}异动监测分析</h2><p>核对进入观察池产品的真实策略变化，并判断变化是否传导到留存、活跃、变现和持续性。</p></div><StatusPill tone="orange">规划模块</StatusPill></header>
    <section className="strategy-block"><span>分析边界</span><h2>本页不重复解释异动如何筛选，只回答产品做了什么、数据何时变化、效果在哪一层成立，以及还有哪些解释无法排除。</h2></section>
    <div className="planning-grid strategy-plan-grid">
      <PlanModule title="异动与策略事实" compact plan="分开记录数据事实与有来源、日期的产品变化" data="异动指标、版本、活动、素材和商店变化" question="产品实际做了什么？" />
      <PlanModule title="策略与数据时间对齐" compact plan="在连续指标中标注策略节点和数据拐点" data="日／周趋势与事件时间" question="策略变化是否先于异动？" />
      <PlanModule title="效果传导链验证" compact plan="依次核查获客、活跃留存、变现和持续性" data="下载、DAU、留存、ARPDAU与收入" question="效果在哪一层成立？" />
      <PlanModule title="其他解释（按需）" compact plan="只有存在未排除因素时才展示" data="买量、季节性、低基数、地区与渠道变化" question="异动还可能由什么造成？" />
    </div>
    {evidenceGames.length > 0 && <section className="content-card strategy-reference"><div className="section-title"><div><span>代表证据</span><h2>只引用能够支撑判断的产品</h2><p>完整游戏列表不在品类分析中重复呈现，可从游戏样本库按品类筛选。</p></div><Link href="/games">进入游戏样本库 →</Link></div><div className="strategy-reference-row">{evidenceGames.map((game) => <Link href={`/games/${game.id}/insights`} key={game.id}><GameAvatar game={game} size="small" /><div><b>{game.name}</b><small>{game.researchRole ?? "研究样本"}</small></div><i>↗</i></Link>)}</div></section>}
    <div className="weak-note"><b>研究边界</b><span>案例只用于验证策略效果，不追求列全；没有无法排除因素时，不额外展示“其他解释”模块。</span></div>
  </>;
}

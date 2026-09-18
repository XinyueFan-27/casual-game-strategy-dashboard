"use client";

import { useMemo, useState, type ReactNode } from "react";

type CategoryId = "match3" | "merge";
type Stage = { period: string; title: string; summary: string; mechanic: string; player: string; value: string; proof: string; games: { name: string; icon: string }[] };
type Demo = {
  name: string;
  judgement: string;
  context: string;
  kpis: { icon: string; label: string; value: string; change: string; note: string; tone: string }[];
  stages: Stage[];
  coverageInsight: string;
  coverage: { name: string; value: number; previous: number; type: string }[];
  matrixFeatures: string[];
  matrix: { name: string; icon: string; features: boolean[] }[];
  liveopsInsight: string;
  liveopsStats: { label: string; value: string; note: string }[];
  eventTypes: { name: string; value: number; tone: string }[];
  liveopsProducts: { name: string; icon: string; events: { name: string; type: string; start: number; end: number; tone: string }[] }[];
  effectInsight: string;
  effectProducts: string[];
  effectSeries: Record<"收入" | "MAU" | "ARPDAU", number[]>;
  effectResults: { label: string; value: string; note: string; tone: string }[];
  creativeInsight: string;
  creativeThemes: { name: string; share: number; change: number; promise: string; landing: string; tone: string }[];
  formula: string;
  synthesis: { label: string; title: string; text: string; tone: string }[];
  monitors: string[];
};

const demos: Record<CategoryId, Demo> = {
  match3: {
    name: "三消",
    judgement: "三消的核心规则已经稳定，增长重心由“失败后出售解决方案”转向“连胜资产、长期Meta和多层LiveOps共同提高每局价值”。",
    context: "成熟机制 · 存量提效 · LiveOps工业化",
    kpis: [
      { icon: "◇", label: "长期Meta覆盖", value: "76%", change: "+4.0pp", note: "Top 30产品", tone: "blue" },
      { icon: "↻", label: "LiveOps覆盖", value: "93%", change: "+2.0pp", note: "Top 30产品", tone: "green" },
      { icon: "≋", label: "月均活动中位数", value: "15个", change: "+18%", note: "单产品月度", tone: "purple" },
      { icon: "◎", label: "同期并行活动", value: "5.2个", change: "+0.8", note: "日均同时运行", tone: "orange" },
    ],
    stages: [
      { period: "2012前后", title: "关卡商业化", summary: "有限步数、生命与续关构成最初的付费底座。", mechanic: "预设棋盘、有限步数、明确成败与失败重置。", player: "接近成功时能够清楚判断额外步数是否有价值。", value: "出售解决方案：额外步数和道具解决眼前失败。", proof: "Candy Crush Saga验证了广泛用户与关卡制商业化的可持续性。", games: [{ name: "Candy Crush Saga", icon: "candy-crush-saga.png" }] },
      { period: "2016—2020", title: "长期Meta", summary: "装修、剧情和区域建设把过关奖励转成长期进度。", mechanic: "关卡奖励连接装修、剧情、角色与区域建设。", player: "过关不再只为下一关，而是为长期目标积累进度。", value: "扩大回访理由和内容消耗，但显著提高内容成本。", proof: "Gardenscapes与Homescapes将三消拓展为长期经营体验。", games: [{ name: "Gardenscapes", icon: "gardenscapes.png" }, { name: "Homescapes", icon: "homescapes.png" }] },
      { period: "2022—2024", title: "连胜资产化", summary: "强道具和跨关连胜状态将历史成功变成可损失资产。", mechanic: "连胜奖励、强道具与高效率状态跨关延续。", player: "失败不仅意味着重玩，还会失去已经积累的强力状态。", value: "从解决一关扩展为保护连胜、效率与活动进度。", proof: "Royal Match与Toon Blast强化了连胜及强道具的经营价值。", games: [{ name: "Royal Match", icon: "royal-match.png" }, { name: "Toon Blast", icon: "toon-blast.jpg" }] },
      { period: "2024—2026", title: "LiveOps工业化", summary: "竞赛、收集、通行证和团队目标同时读取过关行为。", mechanic: "多层活动、赛季与收集系统围绕同一核心关卡并行。", player: "完成一关可同时推进多个目标，退出机会成本提高。", value: "在新增趋缓后继续提升活跃密度与单用户价值。", proof: "头部产品的差距越来越来自活动编排而非单一新功能。", games: [{ name: "Royal Match", icon: "royal-match.png" }, { name: "Candy Crush Saga", icon: "candy-crush-saga.png" }] },
    ],
    coverageInsight: "核心规则高度同质化，长期Meta、社交与多层活动正在成为主要差异化来源",
    coverage: [
      { name: "关卡与持续内容", value: 100, previous: 100, type: "基础标配" }, { name: "LiveOps活动", value: 93, previous: 91, type: "基础标配" }, { name: "连胜／强道具", value: 83, previous: 72, type: "快速扩散" }, { name: "长期Meta", value: 76, previous: 72, type: "成熟配置" }, { name: "通行证／赛季", value: 70, previous: 61, type: "成熟配置" }, { name: "社交／团队", value: 57, previous: 49, type: "头部差异" },
    ],
    matrixFeatures: ["强道具", "长期Meta", "通行证", "收集册", "团队", "竞赛"],
    matrix: [
      { name: "Royal Match", icon: "royal-match.png", features: [true, false, true, true, true, true] },
      { name: "Candy Crush Saga", icon: "candy-crush-saga.png", features: [true, false, true, true, true, true] },
      { name: "Gardenscapes", icon: "gardenscapes.png", features: [true, true, true, true, true, true] },
      { name: "Homescapes", icon: "homescapes.png", features: [true, true, true, true, true, false] },
      { name: "Toon Blast", icon: "toon-blast.jpg", features: [true, false, true, true, true, true] },
    ],
    liveopsInsight: "头部产品竞争已从“是否运营”转向活动层数、节奏衔接和同一关卡的价值叠加",
    liveopsStats: [
      { label: "Top 30覆盖", value: "93%", note: "至少运行一种持续活动" }, { label: "月均活动中位数", value: "15个", note: "不含纯商店促销" }, { label: "并行活动中位数", value: "5.2个", note: "日均同时运行" }, { label: "活动类型中位数", value: "7类", note: "单产品季度覆盖" },
    ],
    eventTypes: [
      { name: "里程碑／进度", value: 88, tone: "blue" }, { name: "竞赛／排行榜", value: 82, tone: "purple" }, { name: "通行证／赛季", value: 70, tone: "green" }, { name: "收集册／相册", value: 63, tone: "orange" }, { name: "团队／合作", value: 57, tone: "cyan" }, { name: "副玩法活动", value: 43, tone: "red" },
    ],
    liveopsProducts: [
      { name: "Royal Match", icon: "royal-match.png", events: [{ name: "King's Cup", type: "竞赛", start: 1, end: 7, tone: "blue" }, { name: "Royal Pass", type: "通行证", start: 1, end: 30, tone: "purple" }, { name: "Dragon Nest", type: "合作", start: 6, end: 13, tone: "green" }, { name: "Card Collection", type: "收集", start: 1, end: 30, tone: "orange" }, { name: "Lightning Rush", type: "里程碑", start: 18, end: 24, tone: "cyan" }] },
      { name: "Candy Crush Saga", icon: "candy-crush-saga.png", events: [{ name: "All Stars", type: "竞赛", start: 3, end: 16, tone: "blue" }, { name: "Season Pass", type: "通行证", start: 1, end: 30, tone: "purple" }, { name: "Episode Race", type: "竞赛", start: 1, end: 30, tone: "green" }, { name: "Music Tour", type: "收集", start: 12, end: 28, tone: "orange" }] },
      { name: "Gardenscapes", icon: "gardenscapes.png", events: [{ name: "Golden Ticket", type: "通行证", start: 1, end: 30, tone: "purple" }, { name: "Renovation", type: "副玩法", start: 4, end: 20, tone: "green" }, { name: "Team Chest", type: "合作", start: 8, end: 14, tone: "blue" }, { name: "Expedition", type: "探索", start: 17, end: 30, tone: "orange" }] },
    ],
    effectInsight: "强道具与活动密度提升后用户价值改善，但必须排除买量、季节性与关卡更新影响",
    effectProducts: ["Royal Match", "Toon Blast", "Gardenscapes"],
    effectSeries: { 收入: [58, 60, 61, 63, 66, 69, 73, 76, 82, 87, 91, 95], MAU: [84, 83, 83, 82, 82, 83, 84, 84, 85, 85, 86, 87], ARPDAU: [52, 53, 54, 55, 58, 61, 64, 67, 72, 76, 80, 84] },
    effectResults: [{ label: "收入", value: "+18.6%", note: "节点后28天 vs 前28天", tone: "green" }, { label: "MAU", value: "+2.4%", note: "规模变化较弱", tone: "blue" }, { label: "ARPDAU", value: "+12.9%", note: "主要关联信号", tone: "purple" }],
    creativeInsight: "素材正在从单纯展示三消，扩展到危机场景、副玩法与长期Meta承诺",
    creativeThemes: [
      { name: "真实三消玩法", share: 34, change: -5, promise: "直接筛选关卡用户", landing: "核心关卡", tone: "blue" }, { name: "危机／救援", share: 27, change: 6, promise: "制造高点击冲突", landing: "迷你游戏／事件", tone: "red" }, { name: "装修／剧情", share: 22, change: 2, promise: "扩大题材用户面", landing: "长期Meta", tone: "purple" }, { name: "副玩法／找物", share: 17, change: 4, promise: "降低玩法理解门槛", landing: "副玩法模块", tone: "green" },
    ],
    formula: "用关卡制造清晰结果，以连胜和强道具保护玩家资产，再通过长期Meta与多层LiveOps持续提高每局价值。",
    synthesis: [
      { label: "当前标配", title: "关卡内容＋强道具＋持续活动", text: "只拥有基础三消已无法形成差异，稳定内容和活动供给成为入场条件。", tone: "blue" },
      { label: "核心壁垒", title: "关卡、经济与活动编排", text: "头部优势来自同时控制难度漏斗、资产损失感和多活动奖励效率。", tone: "purple" },
      { label: "下一步信号", title: "副玩法产品化与社交深化", text: "需要继续验证副玩法是否提高真实留存，以及团队活动能否创造新消费空间。", tone: "green" },
    ],
    monitors: ["Top产品并行活动数", "强道具采用率", "副玩法素材与产品一致性", "活动节点前后ARPDAU", "社交活动覆盖率"],
  },
  merge: {
    name: "二合",
    judgement: "二合已经从轻量合成操作演进为持续经营一套资源经济的长期产品，叙事Meta和高密度LiveOps共同放大能量、订单与未完成状态的价值。",
    context: "机制扩张 · 叙事经营 · 高频LiveOps",
    kpis: [
      { icon: "◇", label: "长期Meta覆盖", value: "93%", change: "+6.0pp", note: "Top 30产品", tone: "blue" },
      { icon: "↻", label: "LiveOps覆盖", value: "97%", change: "+3.0pp", note: "Top 30产品", tone: "green" },
      { icon: "≋", label: "月均活动中位数", value: "18个", change: "+26%", note: "单产品月度", tone: "purple" },
      { icon: "◎", label: "同期并行活动", value: "6.4个", change: "+1.2", note: "日均同时运行", tone: "orange" },
    ],
    stages: [
      { period: "2020前后", title: "持续棋盘经济", summary: "生成器、能量、合成链和订单组成可持续经营的资源系统。", mechanic: "持久棋盘保存半成品、生成器冷却和未完成订单。", player: "离开并不等于结束，未完成状态持续保留。", value: "出售连续性：能量耗尽只是把正在进行的生产暂停。", proof: "Merge Mansion与Travel Town建立了二合的基础经济模型。", games: [{ name: "Merge Mansion", icon: "merge-mansion.png" }, { name: "Travel Town", icon: "travel-town.png" }] },
      { period: "2021—2022", title: "叙事与经营", summary: "订单奖励进一步连接剧情、装修、区域修复和角色关系。", mechanic: "生产与订单进度同时推动故事、装修和身份目标。", player: "轻操作获得长期意义，用户为人物和故事持续回访。", value: "扩大订单价值和用户面，但需要持续内容生产。", proof: "Gossip Harbor与Seaside Escape把二合包装成连续剧式产品。", games: [{ name: "Gossip Harbor", icon: "gossip-harbor.png" }, { name: "Seaside Escape", icon: "seaside-escape.png" }] },
      { period: "约2023", title: "消耗速度可控", summary: "强化生成器允许高价值用户主动加速能量消耗。", mechanic: "2×／4×生成器以更多能量换取更高阶物品。", player: "减少重复点击，也更快触发能量补充和礼包需求。", value: "能量由被动门槛变成可主动加速的消费资源。", proof: "头部二合产品逐步将强化生成器标准化。", games: [{ name: "Gossip Harbor", icon: "gossip-harbor.png" }, { name: "Travel Town", icon: "travel-town.png" }] },
      { period: "2024—2026", title: "高密度LiveOps", summary: "订单、赛季、棋盘活动、收集和限时竞赛共同读取生产行为。", mechanic: "多活动与优惠围绕同一能量消耗和订单行为叠加。", player: "一笔能量同时推进多个目标，临近终点时动量价值放大。", value: "形成高频、重复、覆盖不同价格带的付费出口。", proof: "Gossip Harbor等头部产品的增长与运营活动密度同步提高。", games: [{ name: "Gossip Harbor", icon: "gossip-harbor.png" }, { name: "Travel Town", icon: "travel-town.png" }, { name: "Seaside Escape", icon: "seaside-escape.png" }] },
    ],
    coverageInsight: "叙事、装修与订单已经成为基础配置，差异进一步转向活动编排和资源经济效率",
    coverage: [
      { name: "LiveOps活动", value: 97, previous: 94, type: "基础标配" }, { name: "订单／任务", value: 97, previous: 95, type: "基础标配" }, { name: "叙事／剧情", value: 93, previous: 88, type: "基础标配" }, { name: "装修／改造", value: 90, previous: 84, type: "成熟配置" }, { name: "配对玩法", value: 90, previous: 86, type: "成熟配置" }, { name: "社交／团队", value: 47, previous: 34, type: "快速扩散" },
    ],
    matrixFeatures: ["剧情", "装修", "强化生成器", "通行证", "副棋盘", "竞赛"],
    matrix: [
      { name: "Gossip Harbor", icon: "gossip-harbor.png", features: [true, true, true, true, true, true] },
      { name: "Travel Town", icon: "travel-town.png", features: [false, true, true, true, true, true] },
      { name: "Merge Mansion", icon: "merge-mansion.png", features: [true, true, true, true, true, true] },
      { name: "Seaside Escape", icon: "seaside-escape.png", features: [true, true, true, true, true, false] },
      { name: "Merge Cooking", icon: "merge-cooking.png", features: [true, true, false, true, true, false] },
    ],
    liveopsInsight: "二合增长越来越依赖高频活动和叙事内容，把一次能量消耗同时转化为多个进度目标",
    liveopsStats: [
      { label: "Top 30覆盖", value: "97%", note: "至少运行一种持续活动" }, { label: "月均活动中位数", value: "18个", note: "不含纯商店促销" }, { label: "并行活动中位数", value: "6.4个", note: "日均同时运行" }, { label: "活动类型中位数", value: "9类", note: "单产品季度覆盖" },
    ],
    eventTypes: [
      { name: "里程碑／奖励轨", value: 96, tone: "blue" }, { name: "订单／任务", value: 90, tone: "green" }, { name: "副棋盘活动", value: 83, tone: "purple" }, { name: "通行证／赛季", value: 77, tone: "orange" }, { name: "收集／相册", value: 63, tone: "cyan" }, { name: "竞赛／排行榜", value: 53, tone: "red" },
    ],
    liveopsProducts: [
      { name: "Gossip Harbor", icon: "gossip-harbor.png", events: [{ name: "Season Pass", type: "通行证", start: 1, end: 30, tone: "purple" }, { name: "Party Time", type: "里程碑", start: 3, end: 9, tone: "green" }, { name: "Snow to Spring", type: "副棋盘", start: 7, end: 21, tone: "blue" }, { name: "Culinary Contest", type: "竞赛", start: 14, end: 18, tone: "orange" }, { name: "Card Collection", type: "收集", start: 1, end: 30, tone: "cyan" }] },
      { name: "Travel Town", icon: "travel-town.png", events: [{ name: "Town Pass", type: "通行证", start: 1, end: 30, tone: "purple" }, { name: "Fantasy Island", type: "副棋盘", start: 5, end: 19, tone: "blue" }, { name: "Card Album", type: "收集", start: 1, end: 30, tone: "cyan" }, { name: "Race to Paris", type: "竞赛", start: 20, end: 27, tone: "orange" }] },
      { name: "Merge Mansion", icon: "merge-mansion.png", events: [{ name: "Mystery Pass", type: "通行证", start: 1, end: 30, tone: "purple" }, { name: "Garage Cleanup", type: "任务", start: 4, end: 10, tone: "green" }, { name: "Secret Supply", type: "副棋盘", start: 12, end: 26, tone: "blue" }, { name: "Bake Off", type: "竞赛", start: 22, end: 29, tone: "orange" }] },
    ],
    effectInsight: "活动数量增长与收入上升同步，但真正需要验证的是活动叠加是否改善留存和用户价值",
    effectProducts: ["Gossip Harbor", "Travel Town", "Merge Mansion"],
    effectSeries: { 收入: [42, 45, 48, 52, 58, 64, 70, 77, 84, 90, 95, 100], MAU: [55, 57, 58, 60, 63, 66, 70, 72, 75, 78, 80, 82], ARPDAU: [48, 50, 52, 55, 58, 62, 66, 70, 74, 78, 83, 88] },
    effectResults: [{ label: "收入", value: "+28.4%", note: "节点后28天 vs 前28天", tone: "green" }, { label: "MAU", value: "+8.7%", note: "规模同步扩大", tone: "blue" }, { label: "ARPDAU", value: "+14.6%", note: "用户价值改善", tone: "purple" }],
    creativeInsight: "剧情冲突、破屋改造和找物解谜负责扩大用户面，真实棋盘素材负责筛选高意向用户",
    creativeThemes: [
      { name: "家庭／情感冲突", share: 31, change: 7, promise: "用连续剧情提高点击", landing: "叙事Meta", tone: "red" }, { name: "装修／破屋救援", share: 26, change: 3, promise: "强化改造成果感", landing: "装修经营", tone: "purple" }, { name: "找物／轻解谜", share: 23, change: 5, promise: "降低玩法理解门槛", landing: "迷你游戏", tone: "green" }, { name: "真实合成棋盘", share: 20, change: -4, promise: "筛选高意向用户", landing: "持久棋盘", tone: "blue" },
    ],
    formula: "用持久棋盘保存未完成状态，以叙事与经营提供长期目标，再让订单、活动、空间与生成器共同放大连续性价值。",
    synthesis: [
      { label: "当前标配", title: "订单经济＋叙事Meta＋LiveOps", text: "单纯合成操作已不足以支撑规模产品，剧情与运营成为基础产品结构。", tone: "blue" },
      { label: "核心壁垒", title: "经济、内容与活动工业化", text: "头部优势来自资源价值控制、持续剧情生产和高频活动编排。", tone: "purple" },
      { label: "下一步信号", title: "社交协作与更深经营", text: "需要验证团队目标、社区经营和多棋盘是否能继续扩大用户价值。", tone: "green" },
    ],
    monitors: ["月均活动与并行密度", "剧情内容更新频率", "强化生成器采用率", "素材主题与产品承接", "活动节点前后留存／ARPDAU"],
  },
};

function ResearchStrip({ data, challenge, fallback }: { data: string; challenge: string; fallback: string }) {
  return <div className="mech-demo-research"><p><b>数据</b>{data}</p><p><b>难点</b>{challenge}</p><p><b>替代方案</b>{fallback}</p></div>;
}

function SectionHeading({ index, title, insight, description, children }: { index: string; title: string; insight: string; description: string; children?: ReactNode }) {
  return <div className="mech-demo-heading"><div><span>{index}</span><h2>{title}<em>：{insight}</em></h2><p>{description}</p></div>{children}</div>;
}

const months = ["25.08", "25.09", "25.10", "25.11", "25.12", "26.01", "26.02", "26.03", "26.04", "26.05", "26.06", "26.07"];

export default function CategoryMechanismDashboard({ categoryId }: { categoryId: CategoryId }) {
  const demo = demos[categoryId];
  const [stageIndex, setStageIndex] = useState(3);
  const [scope, setScope] = useState("Top 30");
  const [snapshot, setSnapshot] = useState("2026H1");
  const [liveopsProduct, setLiveopsProduct] = useState(demo.liveopsProducts[0].name);
  const [effectProduct, setEffectProduct] = useState(demo.effectProducts[0]);
  const [effectMetric, setEffectMetric] = useState<"收入" | "MAU" | "ARPDAU">("收入");
  const [creativeRegion, setCreativeRegion] = useState("全球");
  const selectedStage = demo.stages[stageIndex];
  const selectedLiveops = demo.liveopsProducts.find((item) => item.name === liveopsProduct) ?? demo.liveopsProducts[0];
  const series = demo.effectSeries[effectMetric];
  const maxSeries = Math.max(...series);
  const coverage = useMemo(() => demo.coverage.map((item) => ({ ...item, value: scope === "Top 10" ? Math.min(100, item.value + 3) : item.value })), [demo, scope]);

  return <div className="category-mechanism-demo">
    <header className="mech-demo-hero"><div><span>MECHANISM · LIVEOPS · BUSINESS EVOLUTION</span><h2>{demo.name}机制、LiveOps与商业演进</h2><p>{demo.judgement}</p><small>{demo.context} · 页面数值均为模拟数据</small></div><div><b>FULL DEMO</b><span>用于API可行性沟通</span></div></header>

    <section className="content-card mech-demo-section">
      <SectionHeading index="01 · STATUS" title="机制状态总览" insight={categoryId === "match3" ? "核心玩法稳定，竞争重心转向用户价值与运营密度" : "机制仍在扩张，增长越来越依赖内容和高频运营"} description="用最新完整期的机制与运营指标快速判断品类成熟度。"><span className="simulation-pill">模拟数据</span></SectionHeading>
      <div className="mech-demo-kpis">{demo.kpis.map((item) => <article className={item.tone} key={item.label}><i>{item.icon}</i><span>{item.label}</span><b>{item.value}</b><em>{item.change}</em><small>{item.note}</small></article>)}</div>
      <ResearchStrip data="Top产品机制标签、LiveOps覆盖、月度活动实例和每日并行活动数。" challenge="机制与活动口径必须随版本更新，且Playliner只覆盖部分头部产品。" fallback="首期覆盖Top 10，季度人工复核后扩展至Top 30。" />
    </section>

    <section className="content-card mech-demo-section">
      <SectionHeading index="02 · EVOLUTION" title="演进路径" insight={categoryId === "match3" ? "从关卡解决方案走向连胜资产和多层运营" : "从持续棋盘经济走向叙事经营和高密度LiveOps"} description="将时间轴与阶段解释合并；点击阶段查看机制、玩家状态、商业价值和代表证据。" />
      <div className="mech-stage-tabs" aria-label={`${demo.name}品类演进时间线`}>{demo.stages.map((stage, index) => <button type="button" aria-pressed={stageIndex === index} className={stageIndex === index ? "active" : ""} onClick={() => setStageIndex(index)} key={stage.title}><small>{stage.period}</small><span>{String(index + 1).padStart(2, "0")}</span><b>{stage.title}</b><i>{stage.summary}</i></button>)}</div>
      <div className="mech-stage-detail"><div className="stage-summary"><span>{selectedStage.period}</span><h3>{selectedStage.title}</h3><p>{selectedStage.summary}</p><div>{selectedStage.games.map((game) => <span key={game.name}><img src={`/game-icons/${game.icon}`} alt="" />{game.name}</span>)}</div></div><div className="stage-causal-grid"><article><span>机制变化</span><p>{selectedStage.mechanic}</p></article><article><span>玩家状态</span><p>{selectedStage.player}</p></article><article><span>商业价值</span><p>{selectedStage.value}</p></article><article><span>代表证据</span><p>{selectedStage.proof}</p></article></div></div>
      <ResearchStrip data="核心机制、Meta、商业化功能的上线时间、版本记录、代表产品和当期表现。" challenge="功能上线与增长同步不等于因果，且同名机制在不同产品中的作用可能不同。" fallback="先用关键产品实测建立3—4个稳定阶段，再用市场数据验证扩散范围。" />
    </section>

    <section className="content-card mech-demo-section">
      <SectionHeading index="03 · MECHANIC MIX" title="主流机制组合" insight={demo.coverageInsight} description="识别哪些能力已经成为标配、哪些是头部差异，以及哪些新机制正在扩散。"><div className="mech-inline-controls"><select value={scope} onChange={(event) => setScope(event.target.value)}><option>Top 10</option><option>Top 30</option></select><select value={snapshot} onChange={(event) => setSnapshot(event.target.value)}><option>2026H1</option><option>2025H2</option><option>2025H1</option></select></div></SectionHeading>
      <div className="mech-coverage-layout"><div className="mech-coverage-chart"><header><b>机制覆盖率</b><span>{scope} · {snapshot} · 非排他标签</span></header>{coverage.map((item) => <div className="mech-coverage-row" key={item.name}><span>{item.name}<small>{item.type}</small></span><div><i style={{ width: `${item.value}%` }} /><em style={{ left: `${item.previous}%` }} /></div><b>{item.value}%</b></div>)}<footer><span><i />当前覆盖</span><span><em />上期位置</span></footer></div><div className="mech-matrix"><header><b>代表产品机制矩阵</b><span>点击产品将在正式接入后进入单品拆解</span></header><div className="mech-matrix-head"><span>产品</span>{demo.matrixFeatures.map((item) => <span key={item}>{item}</span>)}</div>{demo.matrix.map((product) => <div className="mech-matrix-row" key={product.name}><span><img src={`/game-icons/${product.icon}`} alt="" />{product.name}</span>{product.features.map((enabled, index) => <i className={enabled ? "active" : ""} key={`${product.name}-${index}`}>{enabled ? "✓" : "—"}</i>)}</div>)}</div></div>
      <ResearchStrip data="GameIQ机制、Meta、产品模式标签，功能生效时间，以及我方自定义非排他标签。" challenge="标准标签未必覆盖剧情、装修、强化生成器等研究口径，历史版本也可能缺失。" fallback="维护统一产品ID与季度标签快照，首期人工标注Top 30。" />
    </section>

    <section className="content-card mech-demo-section">
      <SectionHeading index="04 · LIVEOPS" title="LiveOps运营体系" insight={demo.liveopsInsight} description="同时观察市场覆盖、活动类型、并行密度和代表产品月度活动日历。"><label className="mech-select"><span>代表产品</span><select value={liveopsProduct} onChange={(event) => setLiveopsProduct(event.target.value)}>{demo.liveopsProducts.map((item) => <option key={item.name}>{item.name}</option>)}</select></label></SectionHeading>
      <div className="mech-liveops-stats">{demo.liveopsStats.map((item) => <article key={item.label}><span>{item.label}</span><b>{item.value}</b><small>{item.note}</small></article>)}</div>
      <div className="mech-liveops-layout"><div className="mech-event-bars"><header><b>Top 30活动类型覆盖率</b><span>2026H1 · 模拟数据</span></header>{demo.eventTypes.map((item) => <div key={item.name}><span>{item.name}</span><div><i className={item.tone} style={{ width: `${item.value}%` }} /></div><b>{item.value}%</b></div>)}</div><div className="mech-calendar"><header><div><img src={`/game-icons/${selectedLiveops.icon}`} alt="" /><span><b>{selectedLiveops.name}</b><small>2026年7月活动日历</small></span></div><em>{selectedLiveops.events.length}项活动</em></header><div className="mech-calendar-scale"><span>活动</span>{[1, 5, 10, 15, 20, 25, 30].map((day) => <i style={{ left: `${((day - 1) / 29) * 100}%` }} key={day}>{day}</i>)}</div>{selectedLiveops.events.map((event) => <div className="mech-calendar-row" key={event.name}><span>{event.name}<small>{event.type}</small></span><div><i className={event.tone} style={{ left: `${((event.start - 1) / 30) * 100}%`, width: `${((event.end - event.start + 1) / 30) * 100}%` }} /></div></div>)}</div></div>
      <ResearchStrip data="事件ID、名称、类型、开始/结束时间、复发周期、奖励结构、优惠、更新和活动截图。" challenge="需要确认Playliner覆盖清单、历史回溯、更新延迟、API/批量导出与图片展示授权。" fallback="先覆盖三消和二合Top 10，每月人工补录活动日历和关键机制。" />
    </section>

    <section className="content-card mech-demo-section">
      <SectionHeading index="05 · EFFECT" title="运营效果验证" insight={demo.effectInsight} description="把产品节点与连续表现对齐，区分相关信号、较强验证和仍需排除的干扰因素。"><div className="mech-inline-controls"><select value={effectProduct} onChange={(event) => setEffectProduct(event.target.value)}>{demo.effectProducts.map((item) => <option key={item}>{item}</option>)}</select><select value={effectMetric} onChange={(event) => setEffectMetric(event.target.value as "收入" | "MAU" | "ARPDAU")}><option>收入</option><option>MAU</option><option>ARPDAU</option></select></div></SectionHeading>
      <div className="mech-effect-chart"><header><div><b>{effectProduct} · {effectMetric}连续趋势</b><span>节点前后对比 · 模拟指数</span></div><em>2025.08—2026.07</em></header><div className="mech-effect-plot">{series.map((value, index) => <div key={`${months[index]}-${value}`}><span>{index === 4 ? "机制上线" : index === 8 ? "活动加密" : ""}</span><i style={{ height: `${20 + value / maxSeries * 72}%` }} /><small>{months[index]}</small></div>)}</div></div>
      <div className="mech-effect-results">{demo.effectResults.map((item) => <article className={item.tone} key={item.label}><span>{item.label}</span><b>{item.value}</b><small>{item.note}</small></article>)}<article className="warning"><span>证据等级</span><b>相关信号</b><small>尚未排除UA、季节性与版本干扰</small></article></div>
      <ResearchStrip data="日/周收入、下载、DAU/MAU、留存、ARPDAU，版本、机制上线、活动日历和广告SOV。" challenge="市场数据只能观察同步变化，无法直接识别活动对留存和LTV的真实因果。" fallback="使用前后28天、上年同期和同品类对照组；无法排除干扰时仅标注相关信号。" />
    </section>

    <section className="content-card mech-demo-section">
      <SectionHeading index="06 · CREATIVE" title="素材与产品承接" insight={demo.creativeInsight} description="比较素材表达、投放声量和真实产品承接，判断广告是在筛选用户还是扩大用户面。"><label className="mech-select"><span>市场</span><select value={creativeRegion} onChange={(event) => setCreativeRegion(event.target.value)}><option>全球</option><option>美国</option><option>西欧</option><option>日本／韩国</option></select></label></SectionHeading>
      <div className="mech-creative-grid">{demo.creativeThemes.map((item) => <article key={item.name}><header><span className={item.tone}>{item.name}</span><b>{item.share}%</b><em className={item.change >= 0 ? "up" : "down"}>{item.change >= 0 ? "+" : ""}{item.change}pp</em></header><div><i className={item.tone} style={{ width: `${item.share}%` }} /></div><dl><div><dt>素材承诺</dt><dd>{item.promise}</dd></div><div><dt>产品承接</dt><dd>{item.landing}</dd></div></dl></article>)}</div>
      <div className="mech-creative-reading"><b>{creativeRegion}素材判断</b><p>素材份额反映被持续放大的表达方向，不代表真实转化率；需要与下载、留存和产品功能上线时间共同验证。</p><span>Share of Voice</span><i>→</i><span>下载变化</span><i>→</i><span>留存／用户价值</span></div>
      <ResearchStrip data="创意ID、素材文件/缩略图、主题、格式、首末出现时间、国家、网络、SOV/展示趋势和落地产品功能。" challenge="素材去重、主题自动分类和产品承接标签需要统一；SOV与增长只能说明相关性。" fallback="每周抽取各产品Top素材，人工标注主题与承接关系，并保留样本覆盖说明。" />
    </section>

    <section className="content-card mech-demo-section mech-synthesis">
      <SectionHeading index="07 · SYNTHESIS" title="当前商业公式与后续监控" insight={demo.formula} description="把机制研究收敛为当前标配、核心壁垒和下一步可验证信号。" />
      <div className="mech-synthesis-grid">{demo.synthesis.map((item) => <article className={item.tone} key={item.label}><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div><div className="mech-monitor-list"><b>后续监控</b>{demo.monitors.map((item) => <span key={item}>{item}</span>)}</div>
      <ResearchStrip data="机制覆盖、活动密度、事件效果、素材主题和代表产品实测形成的证据链。" challenge="当前公式可能只适用于头部样本，不能把共同配置直接解释为成功原因。" fallback="保留证据等级和反例，按季度复核结论并记录被证伪的判断。" />
    </section>
  </div>;
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CategoryId = "match3" | "merge";
type SignalStatus = "positive" | "neutral" | "negative" | "pending";

type CaseStudy = {
  id: string;
  name: string;
  publisher: string;
  icon: string;
  trigger: string;
  primaryChange: string;
  changeRate: string;
  verifiedStrategy: string;
  conclusion: string;
  evidence: string;
  updated: string;
  facts: { label: string; value: string; note: string }[];
  strategyFacts: { date: string; title: string; detail: string; source: string }[];
  events: { index: number; label: string }[];
  series: Record<"下载" | "活跃" | "收入", number[]>;
  chain: { stage: string; status: SignalStatus; title: string; metric: string; interpretation: string }[];
  alternatives?: { factor: string; finding: string; impact: string }[];
};

const categoryCases: Record<CategoryId, CaseStudy[]> = {
  match3: [
    {
      id: "match-villains",
      name: "Match Villains",
      publisher: "Good Job Games",
      icon: "match-villains.jpg",
      trigger: "收入异动",
      primaryChange: "近28日收入增加",
      changeRate: "+$1.97M",
      verifiedStrategy: "Season Pass上线＋活动密度提升",
      conclusion: "变现改善已出现，长期承接仍需观察",
      evidence: "B级·初步验证",
      updated: "2026.07",
      facts: [
        { label: "首次异动", value: "2026.06.16", note: "连续两周超过品类基线" },
        { label: "主要指标", value: "收入 +$1.97M", note: "近28日绝对增量" },
        { label: "相对变化", value: "+42.6%", note: "对比此前28日" },
        { label: "持续时间", value: "6周", note: "未在单一活动后回落" },
        { label: "主要市场", value: "美国／西欧", note: "iOS贡献更高" },
        { label: "关联信号", value: "ARPDAU上升", note: "MAU仍处于高位震荡" },
      ],
      strategyFacts: [
        { date: "05.27", title: "Season Pass上线", detail: "新增持续付费轨道，并与过关和活动任务连接。", source: "版本实测" },
        { date: "06.03", title: "并行活动增至5类", detail: "竞赛、收集和里程碑活动在同一周期并行。", source: "活动日历" },
        { date: "06.10", title: "商店Offer结构调整", detail: "中档礼包出现频率提高，覆盖更多消费层级。", source: "商店观察" },
      ],
      events: [{ index: 4, label: "Pass上线" }, { index: 6, label: "活动加密" }],
      series: {
        下载: [52, 55, 57, 59, 64, 66, 70, 73, 72, 75, 77, 78],
        活跃: [61, 62, 63, 65, 67, 69, 72, 74, 73, 75, 76, 77],
        收入: [43, 44, 46, 47, 54, 61, 72, 82, 87, 91, 94, 96],
      },
      chain: [
        { stage: "获客", status: "neutral", title: "下载小幅改善", metric: "+8.4%", interpretation: "不是本轮增长的主要来源" },
        { stage: "活跃与留存", status: "positive", title: "活跃承接稳定", metric: "DAU +6.1%", interpretation: "活动增加后未出现明显流失" },
        { stage: "变现", status: "positive", title: "用户价值上升", metric: "ARPDAU +19.3%", interpretation: "与Pass及Offer调整方向一致" },
        { stage: "持续性", status: "pending", title: "仍需跨季度验证", metric: "已持续6周", interpretation: "D30与活动疲劳尚未成熟" },
      ],
      alternatives: [
        { factor: "买量扩张", finding: "同期iOS投放声量上升", impact: "收入增量不能全部归因于产品策略" },
        { factor: "低基数", finding: "扩量前收入基数仍较低", impact: "相对增幅可能被放大，应以绝对增量为主" },
      ],
    },
    {
      id: "gardenscapes",
      name: "Gardenscapes",
      publisher: "Playrix",
      icon: "gardenscapes.png",
      trigger: "下载＋留存异动",
      primaryChange: "近28日下载增加",
      changeRate: "+50.5%",
      verifiedStrategy: "素材AI化＋广告玩法产品承接",
      conclusion: "获客与用户质量同步改善，策略初步成立",
      evidence: "B级·初步验证",
      updated: "2026.07",
      facts: [
        { label: "首次异动", value: "2026.03.24", note: "下载率先突破历史基线" },
        { label: "主要指标", value: "下载 +50.5%", note: "近28日环比" },
        { label: "收入变化", value: "+5.0%", note: "增幅明显低于下载" },
        { label: "留存信号", value: "D30改善", note: "后续月份仍需回填" },
        { label: "主要市场", value: "全球", note: "美国贡献最大" },
        { label: "关联信号", value: "ARPDAU回升", note: "成熟市场表现仍有分化" },
      ],
      strategyFacts: [
        { date: "03.05", title: "AI素材生产全面扩展", detail: "创意测试数量提升，并扩大危机场景和迷你游戏表达。", source: "素材监测" },
        { date: "03.19", title: "广告玩法产品化", detail: "胜出素材中的玩法被嵌入上手体验与活动入口。", source: "产品实测" },
        { date: "04.02", title: "Season Pass及LiveOps加密", detail: "付费轨道与多层活动同时承接新增用户。", source: "版本／活动" },
      ],
      events: [{ index: 3, label: "AI素材扩量" }, { index: 5, label: "玩法承接" }, { index: 7, label: "LiveOps加密" }],
      series: {
        下载: [44, 46, 48, 58, 71, 82, 91, 94, 96, 93, 95, 97],
        活跃: [71, 70, 69, 70, 74, 77, 79, 81, 82, 82, 83, 84],
        收入: [67, 65, 64, 65, 66, 70, 75, 78, 81, 83, 85, 88],
      },
      chain: [
        { stage: "获客", status: "positive", title: "前端吸引力显著增强", metric: "下载 +50.5%", interpretation: "素材扩量后出现明确规模信号" },
        { stage: "活跃与留存", status: "positive", title: "新增获得产品承接", metric: "D30改善", interpretation: "未出现只拉下载不留人的典型背离" },
        { stage: "变现", status: "neutral", title: "收入温和增长", metric: "收入 +5.0%", interpretation: "更多用户的中等付费尚在形成" },
        { stage: "持续性", status: "pending", title: "规模趋势仍待确认", metric: "MAU降幅收窄", interpretation: "尚未证明长期用户规模已反转" },
      ],
    },
    {
      id: "royal-kingdom",
      name: "Royal Kingdom",
      publisher: "Dream Games",
      icon: "royal-kingdom.png",
      trigger: "下载异动",
      primaryChange: "全球发行后下载增加",
      changeRate: "+7.1×",
      verifiedStrategy: "成熟三消能力迁移＋全球规模发行",
      conclusion: "获客和留存共同支撑放量，规模路径成立",
      evidence: "A级·较强验证",
      updated: "2026.07",
      facts: [
        { label: "首次异动", value: "2024.11.21", note: "全球发行后立即突破基线" },
        { label: "主要指标", value: "下载 +7.1×", note: "发行前后月度比较" },
        { label: "收入变化", value: "持续上升", note: "非单月脉冲" },
        { label: "留存信号", value: "D30约14%", note: "放量后仍处于上升区间" },
        { label: "主要市场", value: "美国／西欧", note: "双平台同步扩张" },
        { label: "持续时间", value: "超过12个月", note: "已跨多个赛季" },
      ],
      strategyFacts: [
        { date: "发行前", title: "长期测试与关卡调优", detail: "在全球发行前持续改善中长期留存和难度漏斗。", source: "版本／数据" },
        { date: "11.21", title: "全球规模发行", detail: "多市场同步扩大投放，以成熟留存支撑更高出价。", source: "商店／投放" },
        { date: "发行后", title: "LiveOps体系快速补齐", detail: "竞赛、团队和通行证持续增强用户价值。", source: "活动日历" },
      ],
      events: [{ index: 4, label: "全球发行" }, { index: 7, label: "活动补齐" }],
      series: {
        下载: [18, 19, 21, 24, 58, 78, 87, 91, 94, 95, 96, 98],
        活跃: [20, 22, 25, 28, 49, 67, 76, 83, 88, 92, 95, 97],
        收入: [13, 15, 17, 20, 41, 59, 71, 79, 86, 91, 95, 99],
      },
      chain: [
        { stage: "获客", status: "positive", title: "发行后快速起量", metric: "下载 +7.1×", interpretation: "多市场规模投放获得响应" },
        { stage: "活跃与留存", status: "positive", title: "留存承接放量", metric: "D30约14%", interpretation: "放量后没有出现明显用户质量崩塌" },
        { stage: "变现", status: "positive", title: "收入连续爬升", metric: "近12月持续增长", interpretation: "用户规模和价值形成正循环" },
        { stage: "持续性", status: "positive", title: "已跨多个运营周期", metric: "持续12个月+", interpretation: "不是单次发行或活动脉冲" },
      ],
    },
  ],
  merge: [
    {
      id: "foodstars-merge-and-cook",
      name: "Foodstars: Merge & Cook",
      publisher: "Happibits",
      icon: "foodstars-merge-and-cook.png",
      trigger: "下载异动",
      primaryChange: "近28日下载增加",
      changeRate: "+438.5K",
      verifiedStrategy: "餐厅题材素材扩圈＋轻订单节奏",
      conclusion: "前端获客明确有效，长期商业化尚未验证",
      evidence: "C级·相关信号",
      updated: "2026.07",
      facts: [
        { label: "首次异动", value: "2026.06.09", note: "下载连续两周超过基线" },
        { label: "主要指标", value: "+438.5K", note: "近28日下载绝对增量" },
        { label: "相对变化", value: "+108.7%", note: "对比此前28日" },
        { label: "持续时间", value: "5周", note: "仍处于观察期" },
        { label: "主要市场", value: "美国／英国", note: "Android占比更高" },
        { label: "关联信号", value: "DAU +53.3%", note: "收入仅小幅上升" },
      ],
      strategyFacts: [
        { date: "05.28", title: "餐厅经营素材集中扩量", detail: "更多展示烹饪订单和餐厅成长，而非复杂合成链。", source: "素材监测" },
        { date: "06.04", title: "新手订单节奏简化", detail: "前期目标更短，合成链理解成本降低。", source: "版本实测" },
        { date: "06.12", title: "限时烹饪活动上线", detail: "用短周期主题活动承接新用户。", source: "活动日历" },
      ],
      events: [{ index: 4, label: "素材扩量" }, { index: 6, label: "订单简化" }],
      series: {
        下载: [31, 33, 35, 39, 58, 76, 88, 92, 94, 95, 96, 97],
        活跃: [36, 37, 39, 42, 52, 65, 73, 80, 84, 86, 88, 90],
        收入: [49, 48, 50, 51, 53, 55, 58, 60, 61, 62, 64, 65],
      },
      chain: [
        { stage: "获客", status: "positive", title: "素材扩圈有效", metric: "下载 +108.7%", interpretation: "题材表达显著扩大用户面" },
        { stage: "活跃与留存", status: "positive", title: "DAU同步增长", metric: "DAU +53.3%", interpretation: "不是纯点击型下载脉冲" },
        { stage: "变现", status: "pending", title: "收入转化偏弱", metric: "收入 +2.9%", interpretation: "新增用户的付费成熟尚需时间" },
        { stage: "持续性", status: "pending", title: "仍处早期观察", metric: "持续5周", interpretation: "D30与长期RPD尚未成熟" },
      ],
      alternatives: [
        { factor: "渠道扩张", finding: "Android新增多个投放网络", impact: "下载增长可能部分来自覆盖面扩大" },
      ],
    },
    {
      id: "merge-teahouse",
      name: "Merge Teahouse",
      publisher: "X.P. Games",
      icon: "merge-teahouse.png",
      trigger: "收入异动",
      primaryChange: "近28日收入增加",
      changeRate: "+$510K",
      verifiedStrategy: "东方题材差异化＋活动订单加密",
      conclusion: "题材与运营形成初步协同，尚未跨周期验证",
      evidence: "B级·初步验证",
      updated: "2026.07",
      facts: [
        { label: "首次异动", value: "2026.05.19", note: "收入和DAU同时上升" },
        { label: "主要指标", value: "+$510K", note: "近28日收入绝对增量" },
        { label: "相对变化", value: "+28.0%", note: "对比此前28日" },
        { label: "持续时间", value: "8周", note: "跨两个活动周期" },
        { label: "主要市场", value: "日本／韩国", note: "iOS贡献更高" },
        { label: "关联信号", value: "DAU +3.5%", note: "变现改善强于规模" },
      ],
      strategyFacts: [
        { date: "05.08", title: "茶馆经营章节上线", detail: "将合成订单连接角色剧情和区域装修。", source: "版本实测" },
        { date: "05.15", title: "高阶订单活动加密", detail: "提高高阶合成物的阶段性需求。", source: "活动日历" },
        { date: "05.29", title: "区域定制素材放量", detail: "日韩市场强化角色与茶馆题材表达。", source: "素材监测" },
      ],
      events: [{ index: 3, label: "新章节" }, { index: 5, label: "订单活动" }, { index: 7, label: "区域素材" }],
      series: {
        下载: [58, 57, 59, 60, 62, 64, 65, 67, 68, 69, 70, 72],
        活跃: [62, 62, 63, 64, 65, 67, 68, 69, 70, 71, 72, 73],
        收入: [45, 46, 47, 49, 54, 62, 69, 75, 79, 83, 86, 89],
      },
      chain: [
        { stage: "获客", status: "neutral", title: "下载变化有限", metric: "下载 +7.3%", interpretation: "不是主要增长来源" },
        { stage: "活跃与留存", status: "neutral", title: "活跃温和改善", metric: "DAU +3.5%", interpretation: "剧情章节提供一定回访动力" },
        { stage: "变现", status: "positive", title: "高阶订单提高价值", metric: "收入 +28.0%", interpretation: "活动订单与收入变化时间一致" },
        { stage: "持续性", status: "pending", title: "需要跨赛季复核", metric: "持续8周", interpretation: "尚未覆盖完整季度" },
      ],
    },
    {
      id: "gossip-harbor",
      name: "Gossip Harbor",
      publisher: "Microfun",
      icon: "gossip-harbor.png",
      trigger: "ARPDAU异动",
      primaryChange: "近90日用户价值提升",
      changeRate: "+18.2%",
      verifiedStrategy: "高频剧情内容＋多活动价值叠加",
      conclusion: "内容与运营体系持续提效，策略效果成立",
      evidence: "A级·较强验证",
      updated: "2026.07",
      facts: [
        { label: "首次异动", value: "2026.02.02", note: "ARPDAU连续四周上升" },
        { label: "主要指标", value: "ARPDAU +18.2%", note: "近90日比较" },
        { label: "收入变化", value: "+11.6%", note: "用户规模基本稳定" },
        { label: "持续时间", value: "超过16周", note: "跨多个内容周期" },
        { label: "主要市场", value: "美国／西欧", note: "核心市场同步" },
        { label: "关联信号", value: "时长上升", note: "剧情消费与活动参与增强" },
      ],
      strategyFacts: [
        { date: "01.15", title: "剧情更新节奏提高", detail: "主线章节和角色事件保持高频供给。", source: "版本记录" },
        { date: "01.29", title: "多棋盘活动常态化", detail: "独立活动棋盘与主棋盘形成资源循环。", source: "产品实测" },
        { date: "02.12", title: "通行证与收集活动叠加", detail: "相同订单行为同时推进多个长期目标。", source: "活动日历" },
      ],
      events: [{ index: 3, label: "内容加速" }, { index: 5, label: "多棋盘" }, { index: 7, label: "活动叠加" }],
      series: {
        下载: [76, 74, 75, 73, 72, 72, 71, 70, 70, 69, 69, 68],
        活跃: [81, 80, 80, 79, 79, 79, 80, 80, 81, 81, 82, 82],
        收入: [64, 65, 66, 68, 72, 76, 81, 85, 88, 91, 94, 97],
      },
      chain: [
        { stage: "获客", status: "neutral", title: "下载不再是核心", metric: "下载 -2.5%", interpretation: "增长主要来自存量提效" },
        { stage: "活跃与留存", status: "positive", title: "参与深度提高", metric: "时长 +9.4%", interpretation: "内容与多棋盘提高使用深度" },
        { stage: "变现", status: "positive", title: "用户价值持续上升", metric: "ARPDAU +18.2%", interpretation: "收入改善强于用户规模" },
        { stage: "持续性", status: "positive", title: "跨周期保持增长", metric: "持续16周+", interpretation: "已排除单次活动脉冲" },
      ],
    },
  ],
};

const months = ["02.10", "02.24", "03.10", "03.24", "04.07", "04.21", "05.05", "05.19", "06.02", "06.16", "06.30", "07.14"];

function EvidenceBadge({ grade }: { grade: string }) {
  const tone = grade.startsWith("A") ? "strong" : grade.startsWith("B") ? "medium" : "weak";
  return <span className={`anomaly-evidence ${tone}`}>{grade}</span>;
}

export default function CategoryAnomalyDashboard({ categoryId, categoryName }: { categoryId: CategoryId; categoryName: string }) {
  const cases = categoryCases[categoryId];
  const [selectedId, setSelectedId] = useState(cases[0].id);
  const [metric, setMetric] = useState<"下载" | "活跃" | "收入">("收入");
  const selected = cases.find((item) => item.id === selectedId) ?? cases[0];
  const series = selected.series[metric];
  const maxValue = useMemo(() => Math.max(...series), [series]);

  function chooseCase(id: string) {
    setSelectedId(id);
    setMetric("收入");
  }

  return <div className="category-anomaly-dashboard">
    <header className="anomaly-hero">
      <div><span>ANOMALY STRATEGY VALIDATION</span><h2>{categoryName}异动监测分析</h2><p>对进入观察池的产品核对真实策略变化，并验证变化是否沿“获客—活跃与留存—变现—持续性”传导；本页不重复解释异动筛选算法。</p><small>当前为完整交互Demo · 页面数据用于展示分析方法</small></div>
      <div><b>{cases.length}</b><span>个验证案例</span><small>最近更新 2026.07</small></div>
    </header>

    <section className="content-card anomaly-case-section">
      <header className="anomaly-section-heading"><div><span>验证案例</span><h2>选择异动产品查看完整证据链</h2><p>卡片只呈现进入验证池的原因和当前判断；点击后查看策略事实、时间对应和效果传导。</p></div><span className="simulation-pill">模拟数据</span></header>
      <div className="anomaly-case-grid">{cases.map((item) => <button type="button" aria-pressed={item.id === selected.id} onClick={() => chooseCase(item.id)} className={item.id === selected.id ? "active" : ""} key={item.id}>
        <header><img src={`/game-icons/${item.icon}`} alt="" /><span><b>{item.name}</b><small>{item.publisher}</small></span><i>→</i></header>
        <div className="anomaly-trigger"><span>{item.trigger}</span><b>{item.changeRate}</b><small>{item.primaryChange}</small></div>
        <dl><div><dt>已核实变化</dt><dd>{item.verifiedStrategy}</dd></div><div><dt>当前判断</dt><dd>{item.conclusion}</dd></div></dl>
        <footer><EvidenceBadge grade={item.evidence} /><small>更新 {item.updated}</small></footer>
      </button>)}</div>
    </section>

    <section className="content-card anomaly-detail">
      <header className="anomaly-detail-title"><div><img src={`/game-icons/${selected.icon}`} alt="" /><span><small>当前验证案例</small><h2>{selected.name}</h2><p>{selected.conclusion}</p></span></div><EvidenceBadge grade={selected.evidence} /></header>

      <section className="anomaly-analysis-block">
        <header><span>01</span><div><h3>异动与策略事实</h3><p>先分开记录“数据发生了什么”和“产品实际改了什么”，策略变化必须有日期和来源。</p></div></header>
        <div className="anomaly-fact-layout">
          <div className="anomaly-data-facts"><h4>异动事实</h4><div>{selected.facts.map((fact) => <article key={fact.label}><span>{fact.label}</span><b>{fact.value}</b><small>{fact.note}</small></article>)}</div></div>
          <div className="anomaly-strategy-facts"><h4>已核实的策略变化</h4>{selected.strategyFacts.map((fact) => <article key={`${fact.date}-${fact.title}`}><time>{fact.date}</time><div><b>{fact.title}</b><p>{fact.detail}</p></div><span>{fact.source}</span></article>)}</div>
        </div>
      </section>

      <section className="anomaly-analysis-block">
        <header><span>02</span><div><h3>策略与数据时间对齐</h3><p>策略节点始终保留，切换指标观察变化是否先于数据异动，以及效果能否持续。</p></div><div className="anomaly-metric-tabs">{(["下载", "活跃", "收入"] as const).map((item) => <button type="button" className={metric === item ? "active" : ""} onClick={() => setMetric(item)} key={item}>{item}</button>)}</div></header>
        <div className="anomaly-time-chart"><div className="anomaly-chart-events">{selected.events.map((event) => <span style={{ left: `${(event.index / 11) * 100}%` }} key={event.label}><i />{event.label}</span>)}</div><div className="anomaly-chart-bars">{series.map((value, index) => <div key={`${metric}-${months[index]}`}><i style={{ height: `${24 + (value / maxValue) * 68}%` }} /><span>{months[index]}</span></div>)}</div></div>
        <div className="anomaly-chart-reading"><b>当前读取</b><span>{selected.strategyFacts[0].title}</span><i>→</i><span>{selected.primaryChange}</span><i>→</i><strong>{selected.conclusion}</strong></div>
      </section>

      <section className="anomaly-analysis-block">
        <header><span>03</span><div><h3>效果传导链验证</h3><p>不以收入单点判断策略有效，而是确认效果在哪一层成立、在哪一层仍缺证据。</p></div></header>
        <div className="anomaly-effect-chain">{selected.chain.map((step, index) => <article className={step.status} key={step.stage}><header><span>{String(index + 1).padStart(2, "0")}</span><b>{step.stage}</b></header><h4>{step.title}</h4><strong>{step.metric}</strong><p>{step.interpretation}</p>{index < selected.chain.length - 1 && <i>→</i>}</article>)}</div>
      </section>

      {selected.alternatives && selected.alternatives.length > 0 && <section className="anomaly-alternatives"><header><span>!</span><div><h3>仍无法排除的其他解释</h3><p>以下因素可能同时贡献本轮异动，因此当前结论保留相应证据边界。</p></div></header><div>{selected.alternatives.map((item) => <article key={item.factor}><b>{item.factor}</b><span>{item.finding}</span><p>{item.impact}</p></article>)}</div></section>}

      <div className="anomaly-research-strip"><p><b>数据</b>收入、下载、DAU/MAU、留存、ARPDAU、版本、活动、素材SOV与市场分布。</p><p><b>难点</b>外部数据只能支持时间对应和相关验证，无法直接证明策略因果。</p><p><b>替代方案</b>使用前后窗口、同期对照和人工事实核查；无法排除时明确标注其他解释。</p></div>
    </section>

    <div className="anomaly-method-note"><b>分析边界</b><span>案例卡片是研究队列而非异动排行榜；只有相对变化为正且完成策略事实核查的产品才进入本页。</span><Link href={`/games/${selected.id}/insights`}>进入产品详情 →</Link></div>
  </div>;
}

import Link from "next/link";
import { gamesForCategory, getCategory, getGame, relationForCategory, topics, totals } from "./lib/data";
import { GameAvatar, StatusPill } from "./_components/GameUI";

const strategyCuts = [
  {
    label: "竞争结构",
    title: "社交博彩前三款约占品类90%收入",
    evidence: "AppMagic 2025全年榜单：MONOPOLY GO!、Coin Master与Dice Dreams构成明显头部梯队。",
    implication: "进入难点不是复制骰子循环，而是题材、社交关系、收集与高密度运营的组合能力。",
    href: "/categories/social-casino/market",
    gameIds: ["monopoly-go", "coin-master"],
    source: "AppMagic · 2025",
    tone: "purple" as const,
  },
  {
    label: "运营演进",
    title: "二合竞争正转向高密度LiveOps",
    evidence: "Gossip Harbor的月活动量由约20逐步提升至接近100，并将订单循环与收集、竞赛、通行证同时连接。",
    implication: "成熟二合产品的壁垒正从合成规则转向内容生产、活动编排与经济系统。",
    href: "/categories/merge/mechanism",
    gameIds: ["gossip-harbor", "travel-town"],
    source: "AppMagic研究 · 2025",
    tone: "blue" as const,
  },
  {
    label: "成熟赛道",
    title: "三消的分水岭已是产品化能力",
    evidence: "Royal Match月IAP收入约1.05亿美元；Match Villains则是高门槛赛道中的少数新品信号。",
    implication: "核心规则不再是唯一胜负手，内容供给、LTV优化、LiveOps和发行效率决定上限。",
    href: "/categories/match3/market",
    gameIds: ["royal-match", "match-villains"],
    source: "Sensor Tower / AppMagic",
    tone: "green" as const,
  },
  {
    label: "混合休闲",
    title: "低门槛机制正在被重新产品化",
    evidence: "Color Block Jam下载环比+65.18%；Coin Sort将水排序、合并与2048成长结合，IAP收入约1100万美元。",
    implication: "机会不只在创造新操作，也在于把已验证的简单机制发展为可长期运营的产品。",
    href: "/topics/hybridization",
    gameIds: ["color-block-jam", "coin-sort"],
    source: "Sensor Tower / AppMagic",
    tone: "orange" as const,
  },
];

const opportunityStages = [
  { stage: "机制冒头", direction: "Yarn、Wool与动态排序变体", note: "查看素材可读性能否转为真实留存", href: "/categories/sort/overview" },
  { stage: "产品验证", direction: "Screw、Jam类的Meta与变现深化", note: "判断轻核心能否承载长期循环", href: "/categories/screw/overview" },
  { stage: "规模增长", direction: "排序、螺丝与Match 3D", note: "关注头部产品和跟随者的分化", href: "/categories/match3d/overview" },
  { stage: "成熟竞争", direction: "二合、农场与Block Puzzle", note: "寻找题材、内容和运营结构机会", href: "/categories/merge/overview" },
  { stage: "头部集中", direction: "传统三消与社交博彩", note: "优先评估进入壁垒，而非只看市场规模", href: "/categories/social-casino/overview" },
];

const focusCategoryIds = ["match3", "merge", "sort", "screw", "farming", "social-casino"];

const categoryJudgements: Record<string, string> = {
  match3: "规则高度成熟，竞争重心转向内容生产、LiveOps与LTV效率。",
  merge: "订单、剧情与活动棋盘正在把轻合成变成长期内容产品。",
  sort: "机制可读性持续带来获量机会，但商业化深度仍在分化。",
  screw: "成熟配方正向绒线、编织和新失败压力扩展。",
  farming: "成熟头部保持规模，长线运营与混合玩法新品共同推动增长。",
  "social-casino": "市场规模大但头部高度集中，新产品需要更强的差异化进入路径。",
};

function CutAvatars({ ids }: { ids: string[] }) {
  const cutGames = ids.map((id) => getGame(id)).filter((game): game is NonNullable<ReturnType<typeof getGame>> => Boolean(game));
  return <div className="home-avatar-stack">{cutGames.map((game) => <GameAvatar game={game} size="small" key={game.id} />)}</div>;
}

export default function HomePage() {
  const focusCategories = focusCategoryIds.map((id) => getCategory(id)).filter((category): category is NonNullable<ReturnType<typeof getCategory>> => Boolean(category));
  return (
    <>
      <section className="page-hero home-hero">
        <div><span className="eyebrow">休闲游戏策略研究项目</span><h1>休闲游戏策略分析看板</h1><p>用市场数据建立基础判断，用代表产品和机制演变解释原因，最终形成可用于品类选择和产品策略的观点。</p><div className="hero-actions"><Link className="primary-btn" href="/categories">进入品类研究 →</Link><Link className="ghost-btn" href="/games">查看游戏样本库</Link></div></div>
        <aside className="home-scope-card"><div><span>当前阶段</span><StatusPill tone="orange">框架与样本建池</StatusPill></div><dl><div><dt>{totals.categories}</dt><dd>分析品类</dd></div><div><dt>{totals.uniqueGames}</dt><dd>独立游戏</dd></div><div><dt>{topics.length}</dt><dd>策略专题</dd></div></dl><p>当前优先完善三消、二合、农场与社交博彩的市场与竞争证据。</p></aside>
      </section>

      <section className="content-card home-briefing">
        <div className="section-title"><div><span>01 · EXECUTIVE BRIEF</span><h2>本期策略摘要</h2><p>将当前最值得关注的结论、证据和策略含义放在同一张卡片。</p></div><small>阶段结论 · 后续持续验证</small></div>
        <div className="strategy-cut-grid">{strategyCuts.map((cut) => <article className="strategy-cut" key={cut.title}><header><StatusPill tone={cut.tone}>{cut.label}</StatusPill><CutAvatars ids={cut.gameIds} /></header><h3>{cut.title}</h3><p className="cut-evidence">{cut.evidence}</p><div className="cut-meaning"><span>策略含义</span><p>{cut.implication}</p></div><footer><small>{cut.source}</small><Link href={cut.href}>进入完整分析 →</Link></footer></article>)}</div>
      </section>

      <section className="home-middle-grid">
        <div className="content-card home-opportunity"><div className="section-title"><div><span>02 · OPPORTUNITY RADAR</span><h2>品类机会处于哪个阶段</h2><p>把“值得关注”拆成不同成熟度，避免把机制热度直接等同于商业机会。</p></div></div><div className="home-stage-list">{opportunityStages.map((item, index) => <Link href={item.href} key={item.stage}><span className={`stage-dot s${index + 1}`} /><b>{item.stage}</b><div><strong>{item.direction}</strong><small>{item.note}</small></div><i>↗</i></Link>)}</div><div className="home-hypothesis-note">当前为研究假设；后续将结合连续数据、产品实测和厂商跟进情况调整阶段判断。</div></div>
        <div className="content-card home-evidence-path"><div className="section-title"><div><span>03 · RESEARCH LOGIC</span><h2>从数据到策略判断</h2><p>每一层只回答一类问题，但可以相互跳转验证。</p></div></div><div className="home-evidence-steps"><Link href="/games"><span>01</span><div><b>单品证据</b><p>检查产品结构、数据表现与差异。</p></div><i>→</i></Link><Link href="/categories"><span>02</span><div><b>品类研究</b><p>判断市场趋势、竞争结构与机制演变。</p></div><i>→</i></Link><Link href="/topics"><span>03</span><div><b>策略专题</b><p>把多个品类的共性归纳为横向结论。</p></div><i>↗</i></Link></div></div>
      </section>

      <section className="content-card home-focus-categories"><div className="section-title"><div><span>04 · FOCUS CATEGORIES</span><h2>当前重点品类</h2><p>首页仅展示当前优先分析单元；大类和小类的市场位置从跨品类概览进入。</p></div><Link href="/categories">进入品类市场概览 →</Link></div><div className="focus-category-grid">{focusCategories.map((category) => {
        const categoryGames = gamesForCategory(category.id);
        const head = categoryGames.find((game) => relationForCategory(game, category.id).group === "头部产品");
        const emerging = categoryGames.find((game) => relationForCategory(game, category.id).group === "新兴关注");
        return <Link href={`/categories/${category.id}/overview`} key={category.id}><header><span>{category.code}</span><div><b>{category.name}</b><small>{category.english}</small></div><i>↗</i></header><p>{categoryJudgements[category.id]}</p><footer><div>{head && <GameAvatar game={head} size="tiny" />}{emerging && <GameAvatar game={emerging} size="tiny" />}</div><span>头部 {category.head}{category.scale ? ` · 规模 ${category.scale}` : ""} · 新兴 {category.emerging}</span></footer></Link>;
      })}</div></section>

      <section className="content-card"><div className="section-title"><div><span>05 · STRATEGY TOPICS</span><h2>跨品类策略专题</h2><p>用横向研究解释多个品类同时发生的产品变化。</p></div><Link href="/topics">进入专题地图 →</Link></div><div className="topic-grid home-topic-grid">{topics.map((topic) => <Link href={`/topics/${topic.id}`} key={topic.id}><StatusPill tone={topic.status === "研究中" ? "orange" : "gray"}>{topic.status}</StatusPill><h3>{topic.name}</h3><p>{topic.question}</p><span>查看专题框架 →</span></Link>)}</div></section>

    </>
  );
}

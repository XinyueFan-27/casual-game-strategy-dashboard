import Link from "next/link";
import { notFound } from "next/navigation";
import { GameAvatar, StatusPill } from "../../_components/GameUI";
import { PlanModule } from "../../_components/Planning";
import { games, getCategory, topics } from "../../lib/data";

export default async function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const topic = topics.find((item) => item.id === topicId);
  if (!topic) notFound();
  const supportingGames = games.filter((game) => game.relations.some((relation) => topic.linkedCategories.includes(relation.categoryId)) && ["头部产品", "新兴关注"].includes(game.group ?? "")).slice(0, 10);
  return <><header className="entity-header topic-header"><div className="breadcrumb"><Link href="/topics">策略专题</Link><span>›</span><b>{topic.name}</b></div><div className="topic-title"><div><span className="eyebrow">CROSS-CATEGORY STRATEGY</span><h1>{topic.name}</h1><p>{topic.subtitle}</p></div><StatusPill tone={topic.status === "研究中" ? "orange" : "gray"}>{topic.status}</StatusPill></div></header><section className="judgement-strip"><div><span>核心研究问题</span><h2>{topic.question}</h2></div></section><div className="planning-grid three"><PlanModule title="核心判断" plan="用一句话概括跨品类策略变化" data="品类趋势与代表产品证据" question="这个变化是否真实、可持续？" /><PlanModule title="跨品类比较" plan="对比机制、Meta、商业化和LiveOps" data="统一维度的单品拆解" question="哪些方法可以迁移，哪些依赖品类条件？" /><PlanModule title="业务启示" plan="产品机会、进入条件与主要风险" data="市场、产品和用户三类证据" question="我们应该做什么、不做什么？" /></div><section className="content-card"><div className="section-title"><div><span>涉及品类</span><h2>专题覆盖范围</h2></div></div><div className="topic-link-categories">{topic.linkedCategories.map((id) => { const category = getCategory(id); return <Link href={`/categories/${id}/overview`} key={id}><b>{category?.name}</b><span>{category?.count}条样本</span><i>进入品类 →</i></Link>; })}</div></section><section className="content-card"><div className="section-title"><div><span>代表证据</span><h2>从专题进入单游戏看板</h2></div></div><div className="compact-game-table">{supportingGames.map((game) => <Link href={`/games/${game.id}/insights`} key={game.id}><GameAvatar game={game} size="small" /><b>{game.name}</b><span>{game.group}</span><small>{game.researchRole ?? "研究样本"}</small><i>查看观点 →</i></Link>)}</div></section><div className="weak-note"><b>研究说明</b><span>当前页用于搭建专题证据链；来源、口径和开放问题将跟随具体图表或观点弱化呈现。</span></div></>;
}

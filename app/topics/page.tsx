import Link from "next/link";
import { getCategory, topics } from "../lib/data";
import { StatusPill } from "../_components/GameUI";

export default function TopicsPage() {
  return <><header className="page-heading"><div><span className="eyebrow">策略专题</span><h1>跨品类寻找可迁移的方法</h1><p>专题不是数据汇总，而是围绕一个策略问题连接多个品类和代表游戏。</p></div></header><div className="topic-page-grid">{topics.map((topic, index) => <Link href={`/topics/${topic.id}`} key={topic.id}><div className="topic-index">0{index + 1}</div><StatusPill tone={topic.status === "研究中" ? "orange" : "gray"}>{topic.status}</StatusPill><h2>{topic.name}</h2><h3>{topic.subtitle}</h3><p>{topic.question}</p><div className="topic-categories">{topic.linkedCategories.map((id) => <span key={id}>{getCategory(id)?.name}</span>)}</div><footer>进入专题子看板 →</footer></Link>)}</div></>;
}

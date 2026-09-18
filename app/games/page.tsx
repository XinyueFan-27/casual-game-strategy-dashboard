import GameLibrary from "../_components/GameLibrary";
import { totals } from "../lib/data";

export default async function GamesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "全部" } = await searchParams;
  return <><header className="page-heading"><div><span className="eyebrow">游戏样本库</span><h1>{totals.uniqueGames}款游戏的独立详情入口</h1><p>覆盖Excel全部{totals.candidateRecords}条候选记录。点击任意卡片进入基本信息、数据、产品和观点四个独立子看板。</p></div><div className="page-count"><b>{totals.uniqueGames}</b><span>独立游戏</span></div></header><GameLibrary initialQuery={q} initialCategory={category} /></>;
}

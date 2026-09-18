"use client";

import { useMemo, useState } from "react";
import { categories, Game, games } from "../lib/data";
import { GameCard } from "./GameUI";

const all = "全部";
const groupOrder: Record<string, number> = { "头部产品": 0, "规模产品": 1, "新兴关注": 2, "候补观察": 3 };

function relationForSort(game: Game, categoryId: string) {
  return categoryId === all ? game.relations[0] : game.relations.find((relation) => relation.categoryId === categoryId) ?? game.relations[0];
}

function compareGames(a: Game, b: Game, categoryId: string) {
  const relationA = relationForSort(a, categoryId);
  const relationB = relationForSort(b, categoryId);
  const groupDifference = (groupOrder[relationA?.group ?? ""] ?? 9) - (groupOrder[relationB?.group ?? ""] ?? 9);
  if (groupDifference) return groupDifference;

  if (categoryId === "match3") {
    const revenueA = typeof a.monthlyIap === "number" ? a.monthlyIap : -1;
    const revenueB = typeof b.monthlyIap === "number" ? b.monthlyIap : -1;
    if (revenueA !== revenueB) return revenueB - revenueA;
  }

  const preferAppMagic = categoryId === "social-casino";
  const rankA = preferAppMagic ? a.appMagicRank : a.sensorRank ?? a.appMagicRank;
  const rankB = preferAppMagic ? b.appMagicRank : b.sensorRank ?? b.appMagicRank;
  const numericRankA = typeof rankA === "number" ? rankA : Number.MAX_SAFE_INTEGER;
  const numericRankB = typeof rankB === "number" ? rankB : Number.MAX_SAFE_INTEGER;
  if (numericRankA !== numericRankB) return numericRankA - numericRankB;

  const revenueA = typeof a.monthlyIap === "number" ? a.monthlyIap : typeof a.appMagicIap === "number" ? a.appMagicIap : -1;
  const revenueB = typeof b.monthlyIap === "number" ? b.monthlyIap : typeof b.appMagicIap === "number" ? b.appMagicIap : -1;
  if (revenueA !== revenueB) return revenueB - revenueA;
  return a.name.localeCompare(b.name);
}

export default function GameLibrary({ initialQuery = "", initialCategory = all }: { initialQuery?: string; initialCategory?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(categories.some((item) => item.id === initialCategory) ? initialCategory : all);
  const [productType, setProductType] = useState(all);
  const [group, setGroup] = useState(all);
  const [visible, setVisible] = useState(24);

  const filtered = useMemo(() => games.filter((game) => {
    const text = query.trim().toLowerCase();
    const matchesText = !text || [game.name, game.publisher, game.region, game.gameplaySummary, game.metaTags, ...game.relations.map((relation) => relation.subtype)].filter(Boolean).some((value) => String(value).toLowerCase().includes(text));
    const matchesCategory = category === all || game.relations.some((relation) => relation.categoryId === category);
    const matchesGroup = group === all || (category === all ? game.relations.some((relation) => relation.group === group) : relationForSort(game, category)?.group === group);
    return matchesText && matchesCategory && (productType === all || game.productType === productType) && matchesGroup;
  }).sort((a, b) => compareGames(a, b, category)), [query, category, productType, group]);

  function resetPagination() { setVisible(24); }

  return (
    <>
      <div className="library-filters">
        <label className="wide"><span>搜索</span><input value={query} onChange={(event) => { setQuery(event.target.value); resetPagination(); }} placeholder="游戏、厂商、机制或Meta" /></label>
        <label><span>分析品类</span><select value={category} onChange={(event) => { setCategory(event.target.value); resetPagination(); }}><option>{all}</option>{categories.map((item) => <option value={item.id} key={item.id}>{item.code} {item.name}</option>)}</select></label>
        <label><span>产品形态</span><select value={productType} onChange={(event) => { setProductType(event.target.value); resetPagination(); }}><option>{all}</option><option>传统休闲</option><option>混合休闲</option><option>超休闲</option></select></label>
        <label><span>候选分组</span><select value={group} onChange={(event) => { setGroup(event.target.value); resetPagination(); }}><option>{all}</option><option>头部产品</option><option>规模产品</option><option>新兴关注</option><option>候补观察</option></select></label>
        <div className="filter-count"><b>{filtered.length}</b><span>款游戏</span></div>
      </div>
      <div className="sample-grid">{filtered.slice(0, visible).map((game: Game) => <GameCard game={game} categoryId={category === all ? undefined : category} key={game.id} />)}</div>
      {!filtered.length && <div className="empty-panel">没有匹配的游戏，请调整筛选条件。</div>}
      {filtered.length > visible && <button className="load-more" onClick={() => setVisible((count) => count + 24)}>继续加载 {Math.min(24, filtered.length - visible)} 款游戏</button>}
    </>
  );
}

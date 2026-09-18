"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { categories, families, games, getGame, topics } from "../lib/data";
import { GameAvatar } from "./GameUI";

const mainNav = [
  ["/", "首页"],
  ["/games", "游戏样本库"],
  ["/categories", "品类研究"],
  ["/topics", "策略专题"],
] as const;

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const gameMatch = pathname.match(/^\/games\/([^/]+)/);
  const activeGame = gameMatch ? getGame(gameMatch[1]) : null;
  const categoryMatch = pathname.match(/^\/categories\/([^/]+)/);
  const activeCategoryId = categoryMatch?.[1];
  const activeCategory = categories.find((category) => category.id === activeCategoryId);
  const activeFamilyId = activeCategory?.familyId ?? null;
  const [expandedFamilyId, setExpandedFamilyId] = useState<string | null>(activeFamilyId);

  useEffect(() => {
    setExpandedFamilyId(activeFamilyId);
  }, [activeFamilyId]);

  const relatedGroups = useMemo(() => {
    if (!activeGame) return [];
    return activeGame.relations.map((relation) => {
      const category = categories.find((item) => item.id === relation.categoryId);
      const categoryGames = games.filter((game) => game.relations.some((gameRelation) => gameRelation.categoryId === relation.categoryId));
      return { category, categoryId: relation.categoryId, games: categoryGames };
    });
  }, [activeGame]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    router.push(query.trim() ? `/games?q=${encodeURIComponent(query.trim())}` : "/games");
  }

  return (
    <div className="site-shell">
      <header className="global-header">
        <Link className="brand" href="/"><span className="brand-mark">◆</span><span>CasualScope</span><small>休闲游戏策略分析</small></Link>
        <nav className="global-nav" aria-label="全站导航">
          {mainNav.map(([href, label]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return <Link className={active ? "active" : ""} href={href} key={href}>{label}</Link>;
          })}
        </nav>
        <form className="global-search" onSubmit={submitSearch}><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索游戏、厂商或机制" aria-label="全局搜索" /></form>
      </header>

      <aside className="left-rail">
        {activeGame ? (
          <>
            <div className="rail-caption">当前游戏</div>
            <div className="rail-game-name">{activeGame.name}<small>{activeGame.publisher ?? "厂商待补"}</small></div>
            <Link className="rail-link back" href="/games">← 返回游戏库</Link>
            <div className="rail-divider" />
            <div className="rail-caption">所属品类</div>
            {activeGame.relations.map((relation) => {
              const category = categories.find((item) => item.id === relation.categoryId);
              return <Link className="rail-link" href={`/categories/${relation.categoryId}/overview`} key={relation.candidateId}><span>{category?.code}</span>{category?.name}</Link>;
            })}
            <div className="rail-divider" />
            <div className="rail-caption">同类样本</div>
            {relatedGroups.map((group) => <div className="rail-sample-group" key={group.categoryId}><div className="rail-sample-heading"><span>{group.category?.code} · {group.category?.name}</span><b>{group.games.length}</b></div>{group.games.map((game) => <Link className={`rail-mini-game ${game.id === activeGame.id ? "selected" : ""}`} href={`/games/${game.id}/overview`} key={game.id}><GameAvatar game={game} size="tiny" /><span>{game.name}</span>{game.id === activeGame.id && <i>当前</i>}</Link>)}</div>)}
          </>
        ) : pathname.startsWith("/categories") ? (
          <>
            <div className="rail-caption">品类研究</div>
            <Link className={`rail-link ${pathname === "/categories" ? "selected" : ""}`} href="/categories"><span>▦</span>品类市场概览</Link>
            <div className="rail-divider" />
            {families.map((family) => {
              const familyCategories = categories.filter((category) => category.familyId === family.id);
              const expanded = expandedFamilyId === family.id;
              return (
                <div className={`rail-family ${expanded ? "expanded" : "collapsed"}`} key={family.id}>
                  <button className="rail-family-title" type="button" aria-expanded={expanded} onClick={() => setExpandedFamilyId(expanded ? null : family.id)}>
                    <span>{family.name}<small>{family.english}</small></span>
                    <b>{familyCategories.length}</b><i>{expanded ? "−" : "+"}</i>
                  </button>
                  {expanded && <div className="rail-family-links">{familyCategories.map((category) => (
                    <Link className={`rail-link ${activeCategoryId === category.id ? "selected" : ""}`} href={`/categories/${category.id}/overview`} key={category.id}><span>{category.code}</span>{category.name}<i>{category.count}</i></Link>
                  ))}</div>}
                </div>
              );
            })}
          </>
        ) : pathname.startsWith("/topics") ? (
          <>
            <div className="rail-caption">策略专题</div>
            <Link className={`rail-link ${pathname === "/topics" ? "selected" : ""}`} href="/topics"><span>◎</span>专题地图</Link>
            <div className="rail-divider" />
            {topics.map((topic) => <Link className={`rail-topic ${pathname.includes(topic.id) ? "selected" : ""}`} href={`/topics/${topic.id}`} key={topic.id}>{topic.name}<small>{topic.status}</small></Link>)}
          </>
        ) : pathname.startsWith("/games") ? (
          <>
            <div className="rail-caption">游戏样本库</div>
            <div className="rail-stat"><b>161</b><span>独立游戏</span></div>
            <div className="rail-stat"><b>162</b><span>分类记录</span></div>
            <div className="rail-divider" />
            <div className="rail-note">在主区域按品类、产品形态和候选分组筛选。每款游戏进入独立详情子看板。</div>
          </>
        ) : (
          <>
            <div className="rail-caption">研究工作台</div>
            {mainNav.map(([href, label], index) => <Link className={`rail-link ${pathname === href ? "selected" : ""}`} href={href} key={href}><span>{["⌂", "◫", "▦", "◎"][index]}</span>{label}</Link>)}
            <div className="rail-divider" />
            <div className="rail-note"><b>当前阶段</b>样本池全量接入，品类与单品多页面框架已建立。</div>
          </>
        )}
      </aside>

      <main className="page-canvas">{children}</main>
    </div>
  );
}

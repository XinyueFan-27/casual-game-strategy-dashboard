import Link from "next/link";
import avatarMapRaw from "../avatar-map.json";
import { Game, getCategory, initials, relationForCategory } from "../lib/data";

const avatarMap = avatarMapRaw as Record<string, string>;

export function GameAvatar({ game, size = "medium" }: { game: Game; size?: "tiny" | "small" | "medium" | "large" }) {
  const src = avatarMap[game.id];
  const pixels = size === "large" ? 88 : size === "medium" ? 58 : size === "small" ? 40 : 30;
  return src ? <img className={`game-avatar ${size}`} src={src} alt={`${game.name} 图标`} width={pixels} height={pixels} loading="lazy" /> : <div className={`game-avatar fallback ${size}`}>{initials(game.name)}</div>;
}

export function StatusPill({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "orange" | "gray" | "purple" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

export function GameCard({ game, categoryId }: { game: Game; categoryId?: string }) {
  const relation = relationForCategory(game, categoryId);
  const category = getCategory(relation.categoryId);
  const appMagicRank = categoryId === "social-casino" && typeof game.appMagicRank === "number" ? game.appMagicRank : null;
  return (
    <article className="sample-card">
      <div className="sample-card-head"><GameAvatar game={game} /><div><h3>{game.name}</h3><p>{game.publisher ?? "厂商待补"} · {game.region ?? "地区待补"}</p></div><Link href={`/games/${game.id}/overview`} aria-label={`打开${game.name}详情`}>↗</Link></div>
      <div className="pill-row"><StatusPill>{category?.name ?? "待分类"}</StatusPill><StatusPill tone="purple">{game.productType ?? "形态待补"}</StatusPill><StatusPill tone={relation.group === "新兴关注" ? "orange" : relation.group === "头部产品" ? "green" : relation.group === "规模产品" ? "purple" : "gray"}>{relation.group ?? "待分组"}</StatusPill>{appMagicRank && <StatusPill tone="gray">AppMagic #{appMagicRank}</StatusPill>}</div>
      <dl className="sample-meta"><div><dt>研究角色</dt><dd>{relation.researchRole ?? game.researchRole ?? "待定义"}</dd></div><div><dt>机制标签</dt><dd>{relation.subtype ?? "待核验"}</dd></div></dl>
      <div className="sample-reason"><span>选择理由</span><p>{relation.reason ?? game.reason ?? "当前仅完成样本入池，选择理由待补充。"}</p></div>
      <div className="sample-card-foot"><small>{relation.candidateId}</small><Link href={`/games/${game.id}/overview`}>进入独立游戏看板 →</Link></div>
    </article>
  );
}

import raw from "../research-data.json";

export type Family = {
  id: string;
  name: string;
  english: string;
  analysisUnit: boolean;
};

export type Category = {
  id: string;
  code: string;
  name: string;
  english: string;
  familyId: string;
  count: number;
  head: number;
  scale?: number;
  emerging: number;
  candidate: number;
  subtypes: string[];
  definition: string;
  classificationNote: string | null;
  status: string;
};

export type GameRelation = {
  candidateId: string;
  categoryId: string;
  familyId: string;
  standardCategory: string | null;
  subtype: string | null;
  group: string | null;
  researchRole: string | null;
  reason: string | null;
};

export type Game = {
  id: string;
  name: string;
  publisher: string | null;
  region: string | null;
  productType: string | null;
  group: string | null;
  researchRole: string | null;
  poolLevel: string | null;
  reason: string | null;
  evidenceRisk: string | null;
  notes: string | null;
  metaTags: string | null;
  gameplaySummary: string | null;
  appMagicRank: number | string | null;
  appMagicIap: number | string | null;
  appMagicDownloads: number | string | null;
  appMagicPeriod: string | null;
  sensorRank: number | string | null;
  dau: number | string | null;
  dauChange: number | string | null;
  mau: number | string | null;
  mauChange: number | string | null;
  monthlyIap: number | string | null;
  monthlyIapChange: number | string | null;
  monthlyDownloads: number | string | null;
  monthlyDownloadsChange: number | string | null;
  sensorPeriod: string | null;
  sourceUrl: string | null;
  relations: GameRelation[];
};

export type Topic = {
  id: string;
  name: string;
  subtitle: string;
  question: string;
  linkedCategories: string[];
  status: "研究中" | "规划模块";
};

type ResearchData = {
  source: string;
  totals: Record<string, number>;
  families: Family[];
  categories: Category[];
  games: Game[];
};

export const research = raw as ResearchData;
const excludedCategoryIds = new Set(["music", "arcade", "runner", "solitaire", "word", "logic", "idle-sim", "tycoon"]);

const sensorTowerSimulationCategories: Category[] = [
  {
    id: "farming",
    code: "B1",
    name: "农场",
    english: "Farming",
    familyId: "simulation",
    count: 13,
    head: 9,
    emerging: 4,
    candidate: 0,
    subtypes: ["农场经营", "农场冒险", "农场＋城镇建设"],
    definition: "围绕种植、生产、订单与农场扩建形成长期经营循环。",
    classificationNote: "采用Sensor Tower模拟经营细分口径：Farming。混合产品按核心循环归类，并保留题材与机制标签。",
    status: "口径待与Sensor Tower确认",
  },
  {
    id: "life-sim",
    code: "B2",
    name: "生活模拟",
    english: "Life Simulation",
    familyId: "simulation",
    count: 3,
    head: 3,
    emerging: 0,
    candidate: 0,
    subtypes: ["虚拟生活", "角色生活", "开放生活社区"],
    definition: "以角色生活、关系、身份与开放式日常体验为主要长期目标。",
    classificationNote: "采用Sensor Tower模拟经营细分口径：Life Simulation；需确认边界产品与农场、社交或沙盒标签的主次规则。",
    status: "口径待与Sensor Tower确认",
  },
  {
    id: "time-management",
    code: "B3",
    name: "时间管理",
    english: "Time Management",
    familyId: "simulation",
    count: 5,
    head: 3,
    emerging: 0,
    candidate: 2,
    subtypes: ["餐厅经营", "烹饪服务", "主题经营"],
    definition: "在有限时间内完成生产、服务与资源调度，以效率和连续经营推动成长。",
    classificationNote: "采用Sensor Tower模拟经营细分口径：Time Management；餐厅、烹饪和主题经营的边界映射需通过Game IQ确认。",
    status: "口径待与Sensor Tower确认",
  },
];

export const categories = [
  ...research.categories.filter((category) => !excludedCategoryIds.has(category.id)),
  ...sensorTowerSimulationCategories,
];
const visibleFamilyIds = new Set(categories.map((category) => category.familyId));
export const families = research.families.filter((family) => visibleFamilyIds.has(family.id));
const visibleCategoryIds = new Set(categories.map((category) => category.id));

function remapSimulationRelation(relation: GameRelation): GameRelation | null {
  if (relation.categoryId !== "tycoon") return relation.categoryId === "idle-sim" ? null : relation;
  const subtype = relation.subtype ?? "";
  const categoryId = subtype.includes("农场")
    ? "farming"
    : subtype.includes("生活模拟")
      ? "life-sim"
      : subtype.includes("餐厅") || subtype.includes("主题经营")
        ? "time-management"
        : null;
  return categoryId ? { ...relation, categoryId } : null;
}

export const games = research.games
  .map((game) => ({
    ...game,
    relations: game.relations
      .map(remapSimulationRelation)
      .filter((relation): relation is GameRelation => Boolean(relation) && visibleCategoryIds.has(relation.categoryId)),
  }))
  .filter((game) => game.relations.length > 0);
export const totals = { ...research.totals, categories: categories.length, uniqueGames: games.length };

export const topics: Topic[] = [
  { id: "hybridization", name: "混合休闲化趋势", subtitle: "从轻核心到长期产品", question: "哪些简单机制已经具备承载Meta、IAP与长线运营的条件？", linkedCategories: ["sort", "screw", "idle-rpg"], status: "研究中" },
  { id: "liveops", name: "LiveOps跨品类趋同", subtitle: "活动系统如何扩散", question: "收集、通行证、排行榜和个人奖励轨道如何跨品类复用？", linkedCategories: ["match3", "merge", "farming", "social-casino"], status: "研究中" },
  { id: "ad-to-iap", name: "广告机制向IAP转化", subtitle: "获客可读性与商业化深度", question: "一眼看懂的素材机制如何发展为高留存、高付费产品？", linkedCategories: ["block", "sort", "screw"], status: "规划模块" },
  { id: "emerging", name: "新兴机制监控", subtitle: "发现下一轮增长信号", question: "哪些机制处于冒头、商业化验证或规模增长阶段？", linkedCategories: ["match3d", "sort", "screw"], status: "研究中" },
  { id: "regional-studios", name: "区域厂商能力", subtitle: "土耳其、中国与新兴工作室", question: "不同区域厂商在玩法复制、内容生产和发行效率上有何差异？", linkedCategories: ["match3", "merge", "sort", "farming"], status: "规划模块" },
  { id: "entry-barrier", name: "头部集中度与进入壁垒", subtitle: "成熟赛道是否仍可进入", question: "市场增长是否被头部吸收，新进入者需要什么最低配置？", linkedCategories: ["match3", "merge", "social-casino"], status: "规划模块" },
];

export const categorySections = [
  ["overview", "品类概览"],
  ["market", "市场格局"],
  ["mechanism", "机制与商业演进"],
  ["strategy", "异动监测分析"],
] as const;

export type CategoryTier = 1 | 2 | 3;

const tierOneCategoryIds = new Set(["match3", "merge"]);
const tierTwoCategoryIds = new Set(["sort", "screw", "block", "farming", "life-sim", "time-management", "casino", "social-casino"]);

export const categoryTierMeta: Record<CategoryTier, { label: string; title: string; description: string }> = {
  1: { label: "第一梯队", title: "深度研究品类", description: "保留品类概览、市场格局、机制与商业演进、异动监测分析四页。" },
  2: { label: "第二梯队", title: "重点跟踪品类", description: "当前保留品类概览、市场格局与机制页，后续收敛为概览＋专项详细页。" },
  3: { label: "第三梯队", title: "基础监测品类", description: "仅保留统一品类概览，用于持续观察市场规模、异动和新品测试。" },
};

export function getCategoryTier(categoryId: string): CategoryTier {
  if (tierOneCategoryIds.has(categoryId)) return 1;
  if (tierTwoCategoryIds.has(categoryId)) return 2;
  return 3;
}

export function categorySectionsFor(categoryId: string) {
  const tier = getCategoryTier(categoryId);
  if (tier === 1) return categorySections;
  if (tier === 2) return categorySections.slice(0, 3);
  return categorySections.slice(0, 1);
}

export const gameSections = [
  ["overview", "基本信息"],
  ["data", "数据表现"],
  ["product", "产品拆解"],
  ["insights", "策略研究"],
] as const;

export function getFamily(id: string) {
  return families.find((item) => item.id === id);
}

export function getCategory(id: string) {
  return categories.find((item) => item.id === id);
}

export function getGame(id: string) {
  return games.find((item) => item.id === id);
}

export function gamesForCategory(categoryId: string) {
  return games.filter((game) => game.relations.some((relation) => relation.categoryId === categoryId));
}

export function relationForCategory(game: Game, categoryId?: string) {
  return game.relations.find((relation) => relation.categoryId === categoryId) ?? game.relations[0];
}

export function categoryPath(game: Game) {
  return game.relations.map((relation) => {
    const category = getCategory(relation.categoryId);
    const family = getFamily(relation.familyId);
    return [family?.name, category?.name, relation.subtype].filter(Boolean).join(" / ");
  });
}

export function formatCompact(value: number | string | null, currency = false) {
  if (value === null || value === "") return "待补";
  if (typeof value === "string") return value;
  const absolute = Math.abs(value);
  const formatted = absolute >= 1_000_000 ? `${(value / 1_000_000).toFixed(2)}M` : absolute >= 1_000 ? `${(value / 1_000).toFixed(1)}K` : String(value);
  return currency ? `$${formatted}` : formatted;
}

export function formatChange(value: number | string | null) {
  if (typeof value !== "number") return null;
  return `${value >= 0 ? "+" : ""}${(value * 100).toFixed(1)}%`;
}

export function initials(name: string) {
  const latin = name.match(/[A-Za-z0-9]+/g);
  if (latin?.length) return latin.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return name.slice(0, 2);
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Metric = "revenue" | "downloads" | "active" | "retention";

const metricMeta: Record<Metric, { label: string; title: string; axis: string }> = {
  revenue: { label: "收入", title: "跨品类月收入趋势对比", axis: "IAP收入" },
  downloads: { label: "下载", title: "跨品类月下载趋势对比", axis: "下载量" },
  active: { label: "活跃", title: "跨品类月活跃用户趋势对比", axis: "MAU" },
  retention: { label: "留存", title: "跨品类D30留存率趋势", axis: "D30留存" },
};

const categorySeries = [
  { id: "match3", name: "三消类", color: "#5aa9df", base: { revenue: 440, downloads: 330, active: 166, retention: 12.8 }, growth: .005 },
  { id: "merge", name: "合成类", color: "#ef7478", base: { revenue: 185, downloads: 172, active: 82, retention: 10.6 }, growth: .017 },
  { id: "match3d", name: "立体配对消除", color: "#f0a45d", base: { revenue: 86, downloads: 134, active: 51, retention: 7.4 }, growth: .008 },
  { id: "block", name: "方块解谜", color: "#f1c75b", base: { revenue: 102, downloads: 226, active: 77, retention: 5.2 }, growth: .014 },
  { id: "sort", name: "排序解谜", color: "#9bcf6a", base: { revenue: 56, downloads: 116, active: 43, retention: 7.8 }, growth: .015 },
  { id: "screw", name: "螺丝拧解谜", color: "#65c39a", base: { revenue: 42, downloads: 91, active: 36, retention: 6.1 }, growth: .018 },
  { id: "farming", name: "农场", color: "#58b9b5", base: { revenue: 576, downloads: 172, active: 74, retention: 14.1 }, growth: .012 },
  { id: "life-sim", name: "生活模拟", color: "#8f83db", base: { revenue: 118, downloads: 86, active: 39, retention: 12.2 }, growth: .021 },
  { id: "time-management", name: "时间管理", color: "#ad76cf", base: { revenue: 88, downloads: 94, active: 42, retention: 10.8 }, growth: .009 },
  { id: "idle-rpg", name: "放置数值", color: "#c978b5", base: { revenue: 126, downloads: 92, active: 45, retention: 9.1 }, growth: .002 },
  { id: "casino", name: "传统博彩", color: "#dc778f", base: { revenue: 214, downloads: 72, active: 61, retention: 18.5 }, growth: -.001 },
  { id: "social-casino", name: "社交博彩", color: "#e38b6d", base: { revenue: 352, downloads: 102, active: 94, retention: 20.8 }, growth: .004 },
] as const;

const months: string[] = [];
for (let year = 2018; year <= 2025; year += 1) {
  for (let month = 1; month <= 12; month += 1) months.push(`${year}-${String(month).padStart(2, "0")}`);
}

function valueAt(categoryIndex: number, metric: Metric, index: number) {
  const category = categorySeries[categoryIndex];
  const seasonal = 1 + Math.sin(index * .43 + categoryIndex * .8) * .032 + Math.cos(index * .17 + categoryIndex) * .018;
  if (metric === "retention") {
    const longTermShift = 1 + category.growth * (index - 48) * .08;
    return Math.max(1, category.base.retention * longTermShift * (1 + (seasonal - 1) * .25));
  }
  const pandemic = index >= 26 && index <= 42 ? 1 + Math.sin((index - 26) / 16 * Math.PI) * (.09 + categoryIndex % 3 * .018) : 1;
  const downloadPressure = metric === "downloads" && index > 72 ? 1 - (index - 72) * .003 : 1;
  return category.base[metric] * Math.pow(1 + category.growth, index) * seasonal * pandemic * downloadPressure;
}

function formatValue(value: number, metric: Metric) {
  if (metric === "retention") return `${value.toFixed(1)}%`;
  if (metric === "revenue") return value >= 1000 ? `$${(value / 1000).toFixed(2)}B` : `$${value.toFixed(0)}M`;
  return value >= 1000 ? `${(value / 1000).toFixed(2)}B` : `${value.toFixed(0)}M`;
}

function niceMax(value: number) {
  if (!value) return 1;
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / power;
  return (normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * power;
}

type StageGroup = "scale" | "growth" | "mature" | "validation";
type AnomalyItem = { name: string; publisher: string; flag: string; icon?: string; kind: string; change: string; reason: string };
type MarketCard = {
  id: string;
  name: string;
  english: string;
  stage: string;
  stageGroup: StageGroup;
  judgement: string;
  downloads: string;
  downloadValue: number;
  downloadYoy: number;
  revenue: string;
  revenueValue: number;
  revenueYoy: number;
  newCount: number;
  anomalies: AnomalyItem[];
};

type TierGroup = {
  tier: 1 | 2 | 3;
  title: string;
  description: string;
  ids: string[];
};

const marketCards: MarketCard[] = [
  { id: "match3", name: "三消类", english: "Match-3", stage: "大规模成熟", stageGroup: "scale", judgement: "头部产品锁定收入，新品突围门槛持续升高", downloads: "210M", downloadValue: 210, downloadYoy: 5.4, revenue: "$640M", revenueValue: 640, revenueYoy: -.8, newCount: 2, anomalies: [
    { name: "Match Villains", publisher: "Good Job Games", flag: "🇹🇷", icon: "match-villains.jpg", kind: "收入异动", change: "+$1.97M", reason: "品类增量第1" },
    { name: "Austin's Odyssey", publisher: "Playrix", flag: "🇮🇪", icon: "austins-odyssey.jpg", kind: "下载异动", change: "+620K", reason: "新品获客加速" },
    { name: "Match Squad", publisher: "Cypher Games", flag: "🇹🇷", icon: "match-squad.jpg", kind: "DAU异动", change: "+180K", reason: "活跃连续上升" },
  ] },
  { id: "merge", name: "合成类", english: "Merge", stage: "大规模增长", stageGroup: "scale", judgement: "市场规模持续扩张，增量进一步向头部集中", downloads: "88M", downloadValue: 88, downloadYoy: 12, revenue: "$218M", revenueValue: 218, revenueYoy: 21, newCount: 4, anomalies: [
    { name: "Merge Prison", publisher: "Blue Ultra Game", flag: "🇭🇰", icon: "merge-prison-hidden-puzzle.png", kind: "收入异动", change: "+$420K", reason: "变现增量领先" },
    { name: "Merge Hotel Empire", publisher: "Moon Active", flag: "🇮🇱", icon: "merge-hotel-empire-design-game.png", kind: "下载异动", change: "+350K", reason: "获客规模放大" },
    { name: "Whisper Castle", publisher: "Microfun", flag: "🇨🇳", icon: "whisper-castle-merge-and-story.jpg", kind: "商店榜异动", change: "+16国", reason: "上榜市场扩张" },
  ] },
  { id: "match3d", name: "立体配对消除", english: "Match-3D", stage: "均衡增长", stageGroup: "growth", judgement: "规模保持增长，玩法创新正在决定新品效率", downloads: "134M", downloadValue: 134, downloadYoy: 8.6, revenue: "$86M", revenueValue: 86, revenueYoy: 9.8, newCount: 3, anomalies: [
    { name: "Match Factory", publisher: "Peak Games", flag: "🇹🇷", icon: "match-factory.jpg", kind: "收入异动", change: "+$510K", reason: "收入增量领先" },
    { name: "Triple Match 3D", publisher: "Boombox Games", flag: "🇮🇱", icon: "triple-match-3d.jpg", kind: "DAU异动", change: "+210K", reason: "活跃规模扩大" },
    { name: "Toy Match 3D", publisher: "Mentha Games", flag: "🇸🇬", icon: "toy-match-3d-triple-match.jpg", kind: "下载异动", change: "+380K", reason: "下载加速" },
  ] },
  { id: "block", name: "方块解谜", english: "Block Puzzle", stage: "高速商业化", stageGroup: "growth", judgement: "高下载底盘正在加速转化为商业收入", downloads: "285M", downloadValue: 285, downloadYoy: 19, revenue: "$96M", revenueValue: 96, revenueYoy: 46, newCount: 3, anomalies: [
    { name: "Block Blast!", publisher: "Hungry Studio", flag: "🇨🇳", icon: "block-blast.jpg", kind: "收入异动", change: "+$1.36M", reason: "商业化增量第1" },
    { name: "Blockudoku", publisher: "Easybrain", flag: "🇨🇾", icon: "blockudoku.png", kind: "DAU异动", change: "+110K", reason: "用户规模回升" },
    { name: "Woodoku", publisher: "Tripledot Studios", flag: "🇬🇧", icon: "woodoku.png", kind: "商店榜异动", change: "+11国", reason: "榜单覆盖扩大" },
  ] },
  { id: "sort", name: "排序解谜", english: "Sort Puzzle", stage: "产品验证", stageGroup: "validation", judgement: "新品密集涌入，尚未形成稳定的头部格局", downloads: "116M", downloadValue: 116, downloadYoy: 27.4, revenue: "$56M", revenueValue: 56, revenueYoy: 31.2, newCount: 8, anomalies: [
    { name: "Color Block Jam", publisher: "Rollic Games", flag: "🇹🇷", icon: "color-block-jam.png", kind: "下载异动", change: "+1.18M", reason: "新品下载第1" },
    { name: "Coin Sort", publisher: "Lion Studios", flag: "🇺🇸", icon: "coin-sort.png", kind: "收入异动", change: "+$280K", reason: "变现快速验证" },
    { name: "Magic Sort", publisher: "Onetap Global", flag: "🇸🇬", icon: "magic-sort.png", kind: "DAU异动", change: "+146K", reason: "活跃增长突出" },
  ] },
  { id: "screw", name: "螺丝拧解谜", english: "Screw Puzzle", stage: "低基数增长", stageGroup: "validation", judgement: "低基数快速扩张，素材驱动特征仍然明显", downloads: "91M", downloadValue: 91, downloadYoy: 38.6, revenue: "$42M", revenueValue: 42, revenueYoy: 54.2, newCount: 7, anomalies: [
    { name: "Screw Jam", publisher: "Rollic Games", flag: "🇹🇷", icon: "screw-jam.jpg", kind: "收入异动", change: "+$330K", reason: "商业化提速" },
    { name: "Screwdom", publisher: "iKame Games", flag: "🇻🇳", icon: "screwdom.jpg", kind: "下载异动", change: "+860K", reason: "素材放量明显" },
    { name: "Screw Land 3D", publisher: "Mind Crush", flag: "🇸🇬", icon: "screw-land-3d.jpg", kind: "商店榜异动", change: "+18国", reason: "多市场上榜" },
  ] },
  { id: "farming", name: "农场", english: "Farming", stage: "大规模增长", stageGroup: "scale", judgement: "成熟头部保持规模，收入增长由长线运营与新品混合化共同推动", downloads: "172M", downloadValue: 172, downloadYoy: 33, revenue: "$576M", revenueValue: 576, revenueYoy: 15, newCount: 4, anomalies: [
    { name: "Township", publisher: "Playrix", flag: "🇮🇪", icon: "township.png", kind: "收入异动", change: "+$1.24M", reason: "头部收入增量" },
    { name: "Family Island", publisher: "Melsoft Games", flag: "🇨🇾", icon: "family-island.jpg", kind: "下载异动", change: "+610K", reason: "活动拉动新增" },
    { name: "Tiny Farm: Remastered", publisher: "Com2uS", flag: "🇰🇷", kind: "收入异动", change: "+$180K", reason: "新品测试信号" },
  ] },
  { id: "life-sim", name: "生活模拟", english: "Life Simulation", stage: "高速增长", stageGroup: "growth", judgement: "新品爆发验证需求，但稳定产品与长线内容模型仍待形成", downloads: "86M", downloadValue: 86, downloadYoy: 41, revenue: "$118M", revenueValue: 118, revenueYoy: 76, newCount: 3, anomalies: [
    { name: "Heartopia", publisher: "XD Entertainment", flag: "🇨🇳", icon: "heartopia.png", kind: "收入异动", change: "+$3.10M", reason: "新品收入爆发" },
    { name: "The Sims FreePlay", publisher: "Electronic Arts", flag: "🇺🇸", icon: "the-sims-freeplay.png", kind: "下载异动", change: "+260K", reason: "存量产品回升" },
    { name: "BitLife", publisher: "Candywriter", flag: "🇺🇸", icon: "bitlife-life-simulator.png", kind: "收入异动", change: "+$140K", reason: "长线变现改善" },
  ] },
  { id: "time-management", name: "时间管理", english: "Time Management", stage: "均衡增长", stageGroup: "growth", judgement: "品类保持温和增长，题材差异与关卡内容供给决定新品上限", downloads: "94M", downloadValue: 94, downloadYoy: 12, revenue: "$88M", revenueValue: 88, revenueYoy: 18, newCount: 2, anomalies: [
    { name: "Cooking Diary", publisher: "Mytona", flag: "🇳🇿", icon: "cooking-diary-restaurant-game.png", kind: "收入异动", change: "+$290K", reason: "头部收入回升" },
    { name: "Cooking Fever", publisher: "Nordcurrent", flag: "🇱🇹", icon: "cooking-fever-restaurant-game.png", kind: "下载异动", change: "+230K", reason: "成熟产品拉新" },
    { name: "Idle Restaurant Tycoon", publisher: "Kolibri Games", flag: "🇩🇪", icon: "idle-restaurant-tycoon.png", kind: "收入异动", change: "+$110K", reason: "新品测试达标" },
  ] },
  { id: "idle-rpg", name: "放置数值", english: "Idle RPG", stage: "成熟承压", stageGroup: "mature", judgement: "头部优势稳固，新品买量回收压力上升", downloads: "92M", downloadValue: 92, downloadYoy: -2.1, revenue: "$126M", revenueValue: 126, revenueYoy: -3.6, newCount: 3, anomalies: [
    { name: "Capybara Go!", publisher: "Habby", flag: "🇸🇬", icon: "capybara-go.png", kind: "收入异动", change: "+$890K", reason: "新品收入领先" },
    { name: "Go Go Muffin", publisher: "XD Entertainment", flag: "🇨🇳", icon: "go-go-muffin.png", kind: "下载异动", change: "+410K", reason: "新市场扩量" },
    { name: "Lucky Defense", publisher: "111percent", flag: "🇰🇷", icon: "lucky-defense.jpg", kind: "DAU异动", change: "+132K", reason: "活跃快速提升" },
  ] },
  { id: "casino", name: "传统博彩", english: "Casino", stage: "成熟承压", stageGroup: "mature", judgement: "收入基本盘稳固，但新增用户持续放缓", downloads: "72M", downloadValue: 72, downloadYoy: -5.2, revenue: "$214M", revenueValue: 214, revenueYoy: -2.7, newCount: 1, anomalies: [
    { name: "Zynga Poker", publisher: "Zynga", flag: "🇺🇸", icon: "zynga-poker.png", kind: "收入异动", change: "+$260K", reason: "头部收入反弹" },
    { name: "Big Fish Casino", publisher: "Big Fish Games", flag: "🇺🇸", icon: "big-fish-casino.png", kind: "DAU异动", change: "+42K", reason: "老用户回流" },
    { name: "Bingo Blitz", publisher: "Playtika", flag: "🇮🇱", icon: "bingo-blitz.jpg", kind: "商店榜异动", change: "+5国", reason: "重点市场回升" },
  ] },
  { id: "social-casino", name: "社交博彩", english: "Social Casino", stage: "大规模成熟", stageGroup: "scale", judgement: "高价值存量用户支撑收入，市场格局高度稳定", downloads: "102M", downloadValue: 102, downloadYoy: 4.2, revenue: "$352M", revenueValue: 352, revenueYoy: 3.5, newCount: 2, anomalies: [
    { name: "MONOPOLY GO!", publisher: "Scopely", flag: "🇺🇸", icon: "monopoly-go.png", kind: "收入异动", change: "+$2.10M", reason: "品类收入增量第1" },
    { name: "Coin Master", publisher: "Moon Active", flag: "🇮🇱", icon: "coin-master.jpg", kind: "DAU异动", change: "+155K", reason: "活动带动回流" },
    { name: "Dice Dreams", publisher: "SuperPlay", flag: "🇮🇱", icon: "dice-dreams.jpg", kind: "下载异动", change: "+310K", reason: "新增用户提升" },
  ] },
];

const tierGroups: TierGroup[] = [
  { tier: 1, title: "第一梯队 · 深度研究", description: "三消与二合保留四层看板，持续追踪市场、机制、运营与策略验证。", ids: ["match3", "merge"] },
  { tier: 2, title: "第二梯队 · 重点跟踪", description: "重点观察具备规模或成长潜力的品类，当前保留概览、市场格局与机制页。", ids: ["sort", "screw", "block", "farming", "life-sim", "time-management", "casino", "social-casino"] },
  { tier: 3, title: "第三梯队 · 基础监测", description: "保持统一概览口径，先监测规模变化、已上线产品异动与新品测试。", ids: ["match3d", "idle-rpg"] },
];

function signedPercent(value: number) {
  return `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(1)}%`;
}

type CardMetric = { label: string; value: string; delta?: number; tone?: "positive" | "negative" };

function stageCardMetrics(card: MarketCard): CardMetric[] {
  const mau = Math.max(12, Math.round(card.downloadValue * (.43 + card.newCount * .01)));
  const arpdau = card.revenueValue / mau / 30;
  const mauYoy = card.downloadYoy * .68;
  const adSovYoy = 24 + card.newCount * 8 + Math.round(Math.abs(card.downloadYoy));

  if (card.stageGroup === "scale") return [
    { label: "近1月累计收入", value: card.revenue, delta: card.revenueYoy },
    { label: "近1月MAU", value: `${mau}M`, delta: mauYoy },
    { label: "IAP ARPDAU", value: `$${arpdau.toFixed(3)}` },
  ];

  if (card.stageGroup === "growth") return [
    { label: "近1月累计下载", value: card.downloads, delta: card.downloadYoy },
    { label: "近1月累计收入", value: card.revenue, delta: card.revenueYoy },
    { label: "快速上榜新品", value: `${card.newCount}款` },
  ];

  if (card.stageGroup === "mature") return [
    { label: "MAU同比", value: signedPercent(mauYoy), tone: mauYoy >= 0 ? "positive" : "negative" },
    { label: "收入同比", value: signedPercent(card.revenueYoy), tone: card.revenueYoy >= 0 ? "positive" : "negative" },
    { label: "IAP ARPDAU", value: `$${arpdau.toFixed(3)}` },
  ];

  return [
    { label: "快速上榜新品", value: `${card.newCount}款` },
    { label: "下载增速", value: signedPercent(card.downloadYoy), tone: card.downloadYoy >= 0 ? "positive" : "negative" },
    { label: "广告声量环比", value: `+${adSovYoy}%`, tone: "positive" },
  ];
}

export default function FamilyMarketTrend() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [metric, setMetric] = useState<Metric>("revenue");
  const [selected, setSelected] = useState<string[]>(categorySeries.map((item) => item.id));
  const [start, setStart] = useState("2021-01");
  const [end, setEnd] = useState("2025-12");
  const [hover, setHover] = useState<number | null>(null);
  const [size, setSize] = useState({ width: 900, height: 390 });

  const startIndex = Math.max(0, months.indexOf(start));
  const endIndex = Math.max(startIndex, months.indexOf(end));
  const indexes = useMemo(() => months.map((_, index) => index).filter((index) => index >= startIndex && index <= endIndex), [startIndex, endIndex]);
  const visibleCategories = categorySeries.map((item, index) => ({ ...item, seriesIndex: index })).filter((item) => selected.includes(item.id));

  useEffect(() => {
    if (!wrapRef.current) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: Math.max(520, entry.contentRect.width), height: 390 }));
    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.width, size.height);
    const padding = { left: 68, right: 18, top: 25, bottom: 43 };
    const chartWidth = size.width - padding.left - padding.right;
    const chartHeight = size.height - padding.top - padding.bottom;
    if (!visibleCategories.length || !indexes.length) {
      ctx.fillStyle = "#8590a3";
      ctx.font = "600 13px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("请选择至少一个比较品类", size.width / 2, size.height / 2);
      return;
    }
    const allValues = visibleCategories.flatMap((category) => indexes.map((index) => valueAt(category.seriesIndex, metric, index)));
    const yMax = niceMax(Math.max(...allValues) * 1.08);
    const x = (point: number) => padding.left + (indexes.length === 1 ? chartWidth / 2 : point / (indexes.length - 1) * chartWidth);
    const y = (value: number) => padding.top + chartHeight - value / yMax * chartHeight;

    ctx.lineWidth = 1;
    ctx.font = "10px system-ui";
    ctx.textBaseline = "middle";
    for (let grid = 0; grid <= 5; grid += 1) {
      const value = yMax * grid / 5;
      const yPos = y(value);
      ctx.strokeStyle = "#e8edf4";
      ctx.beginPath();
      ctx.moveTo(padding.left, yPos);
      ctx.lineTo(size.width - padding.right, yPos);
      ctx.stroke();
      ctx.fillStyle = "#8994a7";
      ctx.textAlign = "right";
      ctx.fillText(formatValue(value, metric), padding.left - 9, yPos);
    }

    const tickStep = Math.max(1, Math.floor((indexes.length - 1) / 7));
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    indexes.forEach((index, point) => {
      if (point % tickStep !== 0 && point !== indexes.length - 1) return;
      ctx.fillStyle = "#8994a7";
      ctx.fillText(months[index].slice(0, 4), x(point), size.height - padding.bottom + 12);
    });

    visibleCategories.forEach((category) => {
      const values = indexes.map((index) => valueAt(category.seriesIndex, metric, index));
      ctx.beginPath();
      values.forEach((value, point) => point === 0 ? ctx.moveTo(x(point), y(value)) : ctx.lineTo(x(point), y(value)));
      ctx.strokeStyle = category.color;
      ctx.lineWidth = selected.length <= 4 ? 2.5 : 1.8;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    });

    if (hover !== null && hover >= 0 && hover < indexes.length) {
      const xPos = x(hover);
      ctx.strokeStyle = "rgba(44,64,96,.38)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(xPos, padding.top);
      ctx.lineTo(xPos, padding.top + chartHeight);
      ctx.stroke();
      ctx.setLineDash([]);
      visibleCategories.forEach((category) => {
        const value = valueAt(category.seriesIndex, metric, indexes[hover]);
        ctx.beginPath();
        ctx.arc(xPos, y(value), selected.length <= 4 ? 4 : 3, 0, Math.PI * 2);
        ctx.fillStyle = category.color;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
      });
    }
  }, [metric, selected, startIndex, endIndex, indexes, size, hover, visibleCategories]);

  const hoverRows = hover === null || !indexes[hover] ? [] : visibleCategories
    .map((category) => ({ ...category, value: valueAt(category.seriesIndex, metric, indexes[hover]) }))
    .sort((a, b) => b.value - a.value);

  function applyRange(monthCount: number | "all") {
    const nextStart = monthCount === "all" ? 0 : Math.max(0, months.length - monthCount);
    setStart(months[nextStart]);
    setEnd(months[months.length - 1]);
  }

  function toggleCategory(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return <>
    <div className="family-trend-toolbar">
      <div className="family-trend-control"><span>数据</span><div className="family-trend-segments">{(Object.keys(metricMeta) as Metric[]).map((item) => <button className={metric === item ? "active" : ""} onClick={() => setMetric(item)} key={item}>{metricMeta[item].label}</button>)}</div></div>
      <div className="family-trend-control family-category-picker"><span>比较品类</span><details><summary>{selected.length === categorySeries.length ? "所有品类" : `已选 ${selected.length} 个品类`}</summary><div><header><button onClick={() => setSelected(categorySeries.map((item) => item.id))}>全选</button><button onClick={() => setSelected([])}>清空</button></header>{categorySeries.map((category) => <label key={category.id}><input type="checkbox" checked={selected.includes(category.id)} onChange={() => toggleCategory(category.id)} /><i style={{ background: category.color }} />{category.name}</label>)}</div></details></div>
      <div className="family-trend-control"><span>时间区间</span><div className="family-trend-ranges"><button onClick={() => applyRange(12)}>近1年</button><button onClick={() => applyRange(36)}>近3年</button><button onClick={() => applyRange(60)}>近5年</button><button onClick={() => applyRange("all")}>全部</button></div></div>
      <div className="family-trend-control family-trend-dates"><span>自定义</span><div><input type="month" min={months[0]} max={months[months.length - 1]} value={start} onChange={(event) => setStart(event.target.value <= end ? event.target.value : end)} /><b>—</b><input type="month" min={months[0]} max={months[months.length - 1]} value={end} onChange={(event) => setEnd(event.target.value >= start ? event.target.value : start)} /></div></div>
    </div>

    <div className="family-trend-card">
      <header><div><b>{metricMeta[metric].title}</b><small>全球 · iOS + Google Play · {start.replace("-", ".")}—{end.replace("-", ".")}</small></div></header>
      <div className="family-trend-canvas" ref={wrapRef}>
        <canvas ref={canvasRef} onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const left = 68;
          const width = rect.width - left - 18;
          const point = Math.round((event.clientX - rect.left - left) / width * Math.max(0, indexes.length - 1));
          setHover(point >= 0 && point < indexes.length ? point : null);
        }} onMouseLeave={() => setHover(null)} />
        {hover !== null && indexes[hover] !== undefined && hoverRows.length > 0 && <div className="family-trend-tooltip" style={{ left: `${Math.min(82, Math.max(9, 9 + hover / Math.max(1, indexes.length - 1) * 76))}%` }}><b>{months[indexes[hover]].replace("-", "年")}月</b>{hoverRows.map((row) => <span key={row.id}><i style={{ background: row.color }} />{row.name}<strong>{formatValue(row.value, metric)}</strong></span>)}</div>}
      </div>
      <div className="family-trend-legend family-trend-legend-bottom" aria-label="点击筛选图表品类">{categorySeries.map((category) => <button type="button" className={selected.includes(category.id) ? "active" : "inactive"} aria-pressed={selected.includes(category.id)} onClick={() => toggleCategory(category.id)} key={category.id}><i style={{ background: category.color }} />{category.name}</button>)}</div>
      <footer><span>{metric === "retention" ? "每条折线为该品类达标样本的D30 cohort留存中位数，不做跨应用相加。" : "每条折线代表一个品类的当期市场规模，支持点击图例取舍对比品类。"}</span><b>{selected.length}个品类 · {indexes.length}个月</b></footer>
    </div>

    <div className="family-api-note">
      <div><b>数据</b><p>① 产品×月×国家×平台的下载、IAP收入、DAU、MAU、D30 cohort留存　② 统一产品ID、上线时间与发行商　③ 12类品类映射与研究梯队</p></div>
      <div><b>难点</b><p>自定义分类要求全市场稳定打标；活跃与留存样本覆盖度可能与收入产品池不一致。</p></div>
      <div><b>替代方案</b><p>采用Game IQ标准标签或重点产品池；留存仅在共同覆盖样本中取中位数并标注样本数。</p></div>
    </div>

    <div className="family-card-section">
      <header className="family-tier-overview"><div><span>研究梯队 · RESEARCH TIERS</span><h3>按研究深度完整展开全部品类</h3><p>梯队决定品类页深度，不代表市场好坏；所有品类均保留统一概览与基础监测入口。</p></div><small>12个品类 · 全部展开</small></header>
      <div className="family-tier-groups">{tierGroups.map((group) => {
        const cards = group.ids.map((id) => marketCards.find((card) => card.id === id)).filter((card): card is MarketCard => Boolean(card));
        return <section className={`family-tier-group tier-${group.tier}`} key={group.tier}>
          <header><div><span>{group.title}</span><p>{group.description}</p></div><b>{cards.length}个品类</b></header>
          <div className={`family-insight-grid tier-grid-${group.tier}`}>
            {cards.map((card) => <article className={`family-insight-card tone-${card.stageGroup}`} key={card.id}>
              <div className="family-card-top"><h4>{card.name}<small>{card.english}</small></h4><div><span className={`family-tier-tag tier-${group.tier}`}>第{["", "一", "二", "三"][group.tier]}梯队</span><a href={`/categories/${card.id}/overview`} aria-label={`查看${card.name}详情`}>↗</a></div></div>
              <p className="family-card-judgement">{card.judgement}</p>
              <div className="family-card-metrics">{stageCardMetrics(card).map((metric) => <div key={metric.label}><span>{metric.label}</span><p><b className={metric.tone ?? ""}>{metric.value}</b>{metric.delta !== undefined && <em className={metric.delta >= 0 ? "positive" : "negative"}>{signedPercent(metric.delta)}</em>}</p></div>)}</div>
              <div className="family-anomaly-head"><b>异动关注榜</b><span>按综合异动强度排序</span></div>
              <div className="family-anomaly-list">{card.anomalies.map((item, index) => <div className="family-anomaly-row" key={item.name}>
                <i className={`family-anomaly-rank ${index === 0 ? "top" : ""}`}>{index + 1}</i>
                {item.icon ? <img src={`/game-icons/${item.icon}`} alt="" /> : <span className="family-anomaly-fallback">{item.name.slice(0, 1)}</span>}
                <div className="family-anomaly-game"><b>{item.name}</b><small>{item.flag} {item.publisher}</small></div>
                <div className="family-anomaly-signal"><span>{item.kind}</span><strong>{item.change}</strong><small>{item.reason}</small></div>
              </div>)}</div>
            </article>)}
          </div>
        </section>;
      })}</div>
      <div className="family-api-note family-card-data-note">
        <div><b>数据</b><p>① 单产品近7日下载、IAP收入、DAU/MAU、D1/D7/D30与商店排名　② 近52周同周期基线　③ 版本、LiveOps、素材、上线时间与产品标签</p></div>
        <div><b>难点</b><p>活跃和留存覆盖可能不完整；跨指标需标准化，且数据结果不能单独证明策略因果。</p></div>
        <div><b>替代方案</b><p>缺DAU时用MAU或下载代理；先拆分收入/下载/活跃子榜，再由分析师复核策略证据。</p></div>
      </div>
    </div>
  </>;
}

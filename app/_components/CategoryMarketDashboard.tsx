"use client";

import { Fragment, useMemo, useState } from "react";
import { games } from "../lib/data";
import { GameAvatar } from "./GameUI";

type BaseMetricKey = "revenue" | "downloads" | "mau" | "arpdau";
type MetricKey = BaseMetricKey | "retention";
type RetentionKey = "D1" | "D7" | "D30" | "D180" | "D360";

type TopProduct = {
  name: string;
  publisher: string;
  latestRevenue: number;
  annualRevenue: number;
  yoy: number;
  yoyDelta: number;
  trend: number[];
};

type NewProduct = {
  name: string;
  publisher: string;
  testDate: string;
  monthsAgo: number;
  markets: string;
  latestRevenue: number;
  mom: number;
  peakRevenue: number;
  status: "新进入测试" | "加速测试" | "稳定验证" | "达标新品" | "突破型新品" | "回落观察";
};

type MarketDemo = {
  judgement: string;
  context: string;
  kpis: { label: string; value: string; mom: number; yoy: number; note: string }[];
  trends: Record<BaseMetricKey, number[]>;
  retention: Record<RetentionKey, number[]>;
  growthMode: "value" | "dual";
  growthNote: string;
  segments: { name: string; color: string; revenue: number; downloads: number; mau: number; yoy: number; time: string; arpdau: string }[];
  segmentConclusion: string;
  concentration: { period: string; cr3: number; cr10: number }[];
  topProducts: TopProduct[];
  newProducts: NewProduct[];
  newCohort: { monitored: number; matured: number; qualified: number; breakout: number };
  newCohort6m: { monitored: number; matured: number; qualified: number; breakout: number };
  contributions: { name: string; value: number }[];
  matrix: { name: string; x: number; y: number; size: number; tone: string }[];
  regions: { name: string; revenue: number; revenueYoy: number; downloads: number; mauYoy: number; arpdau: string }[];
  countries: { name: string; revenue: number; revenueYoy: number; downloads: number; mauYoy: number; arpdau: string }[];
  monetization: { name: string; share: number; color: string }[];
  ads: { total: string; yoy: number; perDau: string; perDauYoy: number; coverage: string };
  conclusions: { label: string; title: string; text: string }[];
  monitors: string[];
};

const monthLabels = ["24.08", "24.09", "24.10", "24.11", "24.12", "25.01", "25.02", "25.03", "25.04", "25.05", "25.06", "25.07", "25.08", "25.09", "25.10", "25.11", "25.12", "26.01", "26.02", "26.03", "26.04", "26.05", "26.06", "26.07"];

function retentionTrend(start: number, end: number, phase: number) {
  return monthLabels.map((_, index) => {
    const progress = index / (monthLabels.length - 1);
    const wave = Math.sin(index * .62 + phase) * Math.max(.05, start * .006);
    return Number((start + (end - start) * progress + wave).toFixed(2));
  });
}

const baseDemos: Record<"match3" | "merge", MarketDemo> = {
  match3: {
    judgement: "三消进入存量竞争阶段：收入保持稳定但用户规模缓慢收缩，增长主要依靠头部产品提升参与深度与单用户价值。",
    context: "成熟规模 · 存量提效 · 头部格局稳定",
    kpis: [
      { label: "月收入", value: "$402M", mom: 0.7, yoy: 1.8, note: "商业规模基本持平" },
      { label: "月下载", value: "226M", mom: -1.2, yoy: -5.6, note: "新增需求继续回落" },
      { label: "月MAU", value: "165M", mom: -0.4, yoy: -2.4, note: "存量用户缓慢收缩" },
      { label: "人均每日游玩", value: "31.6分钟", mom: 1.1, yoy: 3.8, note: "参与深度仍在提高" },
      { label: "IAP ARPDAU", value: "$0.081", mom: 1.5, yoy: 4.9, note: "用户价值抵消规模下滑" },
    ],
    trends: {
      revenue: [382, 385, 388, 391, 397, 386, 392, 395, 399, 402, 398, 394, 396, 399, 401, 397, 405, 395, 398, 400, 403, 401, 399, 402],
      downloads: [262, 258, 257, 254, 251, 245, 248, 246, 244, 241, 239, 238, 236, 235, 232, 231, 229, 226, 230, 229, 228, 226, 224, 226],
      mau: [177, 176, 175, 174, 174, 172, 173, 171, 170, 170, 169, 169, 168, 168, 167, 167, 166, 165, 166, 166, 165, 165, 164, 165],
      arpdau: [0.071, 0.072, 0.073, 0.073, 0.074, 0.074, 0.075, 0.075, 0.076, 0.076, 0.076, 0.077, 0.077, 0.077, 0.078, 0.078, 0.079, 0.079, 0.079, 0.08, 0.08, 0.08, 0.081, 0.081],
    },
    retention: {
      D1: retentionTrend(41.2, 40.1, .2),
      D7: retentionTrend(20.4, 19.6, .8),
      D30: retentionTrend(12.4, 12.0, 1.4),
      D180: retentionTrend(5.6, 5.4, 2.1),
      D360: retentionTrend(3.2, 3.1, 2.8),
    },
    growthMode: "value",
    growthNote: "MAU同比下降2.4%，ARPDAU同比上升4.9%，当前属于典型的“用户收缩、价值提升”状态。",
    segments: [
      { name: "纯三消／轻Meta", color: "#4f8de8", revenue: 52, downloads: 47, mau: 46, yoy: 4.1, time: "29.4分钟", arpdau: "$0.088" },
      { name: "三消＋装修经营", color: "#7a68d8", revenue: 34, downloads: 38, mau: 39, yoy: -1.7, time: "34.8分钟", arpdau: "$0.076" },
      { name: "三消＋剧情／其他", color: "#55b89f", revenue: 14, downloads: 15, mau: 15, yoy: 2.6, time: "32.1分钟", arpdau: "$0.069" },
    ],
    segmentConclusion: "纯三消仍贡献过半收入；重Meta形态拥有更长游玩时间，但其内容成本与存量产品压力也更高。",
    concentration: [
      { period: "24Q2", cr3: 53, cr10: 78 }, { period: "24Q4", cr3: 54, cr10: 79 }, { period: "25Q2", cr3: 56, cr10: 80 }, { period: "25Q4", cr3: 57, cr10: 81 }, { period: "26Q2", cr3: 58, cr10: 82 },
    ],
    topProducts: [
      { name: "Royal Match", publisher: "Dream Games", latestRevenue: 104.95, annualRevenue: 1236, yoy: 10.2, yoyDelta: 114.4, trend: [82, 85, 88, 91, 94, 96, 99, 101, 103, 102, 104, 105] },
      { name: "Candy Crush Saga", publisher: "King", latestRevenue: 81.39, annualRevenue: 1018, yoy: -6.2, yoyDelta: -67.3, trend: [92, 90, 89, 87, 86, 85, 84, 83, 82, 82, 81, 81] },
      { name: "Gardenscapes", publisher: "Playrix", latestRevenue: 45.15, annualRevenue: 511, yoy: 8.7, yoyDelta: 40.9, trend: [37, 38, 39, 40, 41, 42, 42, 43, 44, 44, 45, 45] },
      { name: "Royal Kingdom", publisher: "Dream Games", latestRevenue: 36.25, annualRevenue: 398, yoy: 22.8, yoyDelta: 74.0, trend: [22, 24, 26, 28, 30, 31, 32, 34, 35, 35, 36, 36] },
      { name: "Homescapes", publisher: "Playrix", latestRevenue: 27.69, annualRevenue: 348, yoy: -4.8, yoyDelta: -17.5, trend: [31, 31, 30, 30, 29, 29, 29, 28, 28, 28, 28, 28] },
      { name: "Fishdom", publisher: "Playrix", latestRevenue: 25.45, annualRevenue: 312, yoy: 3.2, yoyDelta: 9.7, trend: [24, 24, 25, 25, 25, 26, 26, 26, 26, 26, 25, 25] },
      { name: "Match Factory!", publisher: "Peak", latestRevenue: 19.80, annualRevenue: 218, yoy: 15.4, yoyDelta: 29.1, trend: [14, 15, 16, 16, 17, 18, 18, 18, 19, 19, 20, 20] },
      { name: "Toon Blast", publisher: "Peak", latestRevenue: 16.40, annualRevenue: 204, yoy: -3.1, yoyDelta: -6.5, trend: [18, 18, 17, 17, 17, 17, 17, 17, 16, 16, 16, 16] },
      { name: "Project Makeover", publisher: "Magic Tavern", latestRevenue: 14.60, annualRevenue: 181, yoy: 1.8, yoyDelta: 3.2, trend: [14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15] },
      { name: "Match Masters", publisher: "Candivore", latestRevenue: 12.90, annualRevenue: 159, yoy: 6.7, yoyDelta: 10.0, trend: [11, 11, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13] },
    ],
    newProducts: [
      { name: "Match Villains", publisher: "Good Job Games", testDate: "2025.09", monthsAgo: 10, markets: "全球", latestRevenue: 3.70, mom: 14.8, peakRevenue: 4.10, status: "突破型新品" },
      { name: "Match Squad", publisher: "Cypher Games", testDate: "2026.01", monthsAgo: 6, markets: "加拿大／英国", latestRevenue: 0.62, mom: 38.5, peakRevenue: 0.62, status: "加速测试" },
      { name: "MONOPOLY Match", publisher: "VGW Holdings", testDate: "2025.12", monthsAgo: 7, markets: "美国／澳洲", latestRevenue: 0.28, mom: 9.6, peakRevenue: 0.31, status: "稳定验证" },
      { name: "Roomscapes", publisher: "Playrix", testDate: "2026.03", monthsAgo: 4, markets: "加拿大", latestRevenue: 0.18, mom: 31.2, peakRevenue: 0.18, status: "达标新品" },
      { name: "Kitchen Masters", publisher: "Futureplay", testDate: "2026.05", monthsAgo: 2, markets: "英国", latestRevenue: 0.14, mom: 56.4, peakRevenue: 0.14, status: "新进入测试" },
      { name: "Resort Match", publisher: "New Story", testDate: "2025.11", monthsAgo: 8, markets: "加拿大／澳洲", latestRevenue: 0.12, mom: -35.7, peakRevenue: 0.21, status: "回落观察" },
    ],
    newCohort: { monitored: 24, matured: 18, qualified: 2, breakout: 1 },
    newCohort6m: { monitored: 13, matured: 7, qualified: 1, breakout: 0 },
    contributions: [
      { name: "Royal Match", value: 13.2 }, { name: "Gardenscapes", value: 4.6 }, { name: "Royal Kingdom", value: 2.8 }, { name: "其他增长产品", value: 3.4 }, { name: "Candy Crush Saga", value: -7.2 }, { name: "其他收缩产品", value: -9.7 },
    ],
    matrix: [
      { name: "Royal Match", x: 88, y: 58, size: 24, tone: "blue" }, { name: "Candy Crush Saga", x: 74, y: 32, size: 22, tone: "purple" }, { name: "Gardenscapes", x: 55, y: 62, size: 18, tone: "green" }, { name: "Royal Kingdom", x: 42, y: 43, size: 17, tone: "orange" }, { name: "Match Villains", x: 22, y: 76, size: 13, tone: "red" },
    ],
    regions: [
      { name: "北美", revenue: 39, revenueYoy: 2.8, downloads: 18, mauYoy: -1.2, arpdau: "$0.142" },
      { name: "西欧", revenue: 26, revenueYoy: 1.6, downloads: 20, mauYoy: -2.4, arpdau: "$0.109" },
      { name: "日本／韩国", revenue: 15, revenueYoy: -2.1, downloads: 8, mauYoy: -4.8, arpdau: "$0.126" },
      { name: "其他亚洲", revenue: 11, revenueYoy: 5.7, downloads: 31, mauYoy: 3.6, arpdau: "$0.031" },
      { name: "其他地区", revenue: 9, revenueYoy: 3.1, downloads: 23, mauYoy: 1.9, arpdau: "$0.037" },
    ],
    countries: [
      { name: "美国", revenue: 35, revenueYoy: 2.9, downloads: 13, mauYoy: -1.0, arpdau: "$0.151" },
      { name: "英国", revenue: 8, revenueYoy: 1.6, downloads: 6, mauYoy: -2.2, arpdau: "$0.113" },
      { name: "德国", revenue: 7, revenueYoy: 2.1, downloads: 5, mauYoy: -1.8, arpdau: "$0.108" },
      { name: "法国", revenue: 6, revenueYoy: 0.8, downloads: 5, mauYoy: -2.9, arpdau: "$0.101" },
      { name: "日本", revenue: 10, revenueYoy: -2.4, downloads: 5, mauYoy: -4.5, arpdau: "$0.132" },
      { name: "韩国", revenue: 5, revenueYoy: -1.6, downloads: 3, mauYoy: -5.2, arpdau: "$0.117" },
      { name: "巴西", revenue: 3, revenueYoy: 6.8, downloads: 9, mauYoy: 4.7, arpdau: "$0.026" },
      { name: "印度", revenue: 2, revenueYoy: 8.1, downloads: 14, mauYoy: 6.9, arpdau: "$0.013" },
    ],
    monetization: [
      { name: "IAP主导", share: 68, color: "#4f8de8" }, { name: "混合变现", share: 26, color: "#55b89f" }, { name: "IAA主导", share: 6, color: "#f0ad58" },
    ],
    ads: { total: "44.2B", yoy: 6.8, perDau: "4.8次/日", perDauYoy: 8.7, coverage: "覆盖样本：Top 30中的19款" },
    conclusions: [
      { label: "市场阶段", title: "成熟提效", text: "收入仍有韧性，但新增和MAU下滑使增长越来越依赖存量用户价值。" },
      { label: "竞争结构", title: "头部继续集中", text: "CR10升至82%，新品需要同时跨过产品、内容、运营和获量门槛。" },
      { label: "新品供给", title: "突破仍是少数", text: "测试新品持续出现，但成熟新品成功率偏低，需同时观察达标速度与收入持续性。" },
    ],
    monitors: ["Top10年度收入分化", "MAU降幅是否扩大", "ARPDAU能否持续补位", "新品达标率与达标速度", "广告负载是否快于时长增长"],
  },
  merge: {
    judgement: "二合仍处于规模扩张期：用户、参与度与用户价值同步上升，但绝大部分增量正在被具备强LiveOps与发行能力的头部产品吸收。",
    context: "大规模增长 · 二合主导 · 增量向头部集中",
    kpis: [
      { label: "月收入", value: "$365M", mom: 2.9, yoy: 18.2, note: "商业规模快速扩张" },
      { label: "月下载", value: "52M", mom: 1.6, yoy: 6.4, note: "新增需求保持增长" },
      { label: "月MAU", value: "61M", mom: 1.8, yoy: 8.1, note: "下载逐步沉淀为活跃" },
      { label: "人均每日游玩", value: "27.8分钟", mom: 1.4, yoy: 5.3, note: "订单与活动提高黏性" },
      { label: "IAP ARPDAU", value: "$0.123", mom: 2.1, yoy: 9.2, note: "用户价值同步改善" },
    ],
    trends: {
      revenue: [205, 211, 218, 225, 232, 238, 245, 251, 258, 265, 274, 281, 289, 298, 306, 315, 324, 331, 338, 344, 350, 354, 358, 365],
      downloads: [39, 40, 40, 41, 41, 42, 42, 43, 43, 44, 45, 45, 46, 47, 47, 48, 48, 49, 49, 50, 50, 51, 51, 52],
      mau: [45, 46, 46, 47, 48, 48, 49, 50, 50, 51, 52, 52, 53, 54, 55, 55, 56, 57, 57, 58, 59, 59, 60, 61],
      arpdau: [0.091, 0.092, 0.093, 0.094, 0.095, 0.096, 0.098, 0.099, 0.1, 0.101, 0.102, 0.104, 0.105, 0.107, 0.109, 0.11, 0.112, 0.114, 0.116, 0.117, 0.119, 0.12, 0.121, 0.123],
    },
    retention: {
      D1: retentionTrend(38.8, 40.6, .1),
      D7: retentionTrend(17.9, 19.7, .7),
      D30: retentionTrend(10.1, 11.7, 1.3),
      D180: retentionTrend(4.3, 5.3, 2.0),
      D360: retentionTrend(2.2, 2.8, 2.7),
    },
    growthMode: "dual",
    growthNote: "MAU同比增长8.1%，ARPDAU同比增长9.2%，规模和用户价值共同推动收入增长。",
    segments: [
      { name: "二合（Merge-2）", color: "#55bfae", revenue: 93, downloads: 96, mau: 90, yoy: 21.4, time: "25.9分钟", arpdau: "$0.128" },
      { name: "三合（Merge-3）", color: "#8469d8", revenue: 7, downloads: 4, mau: 10, yoy: -28.0, time: "45.3分钟", arpdau: "$0.091" },
    ],
    segmentConclusion: "二合已主导规模增长；三合用户规模继续收缩，但更长的每日时长显示其仍保留一批高黏性核心用户。",
    concentration: [
      { period: "24Q2", cr3: 46, cr10: 72 }, { period: "24Q4", cr3: 48, cr10: 74 }, { period: "25Q2", cr3: 50, cr10: 76 }, { period: "25Q4", cr3: 53, cr10: 78 }, { period: "26Q2", cr3: 55, cr10: 80 },
    ],
    topProducts: [
      { name: "Gossip Harbor", publisher: "Microfun", latestRevenue: 92.62, annualRevenue: 983, yoy: 41.0, yoyDelta: 285.8, trend: [54, 58, 63, 68, 72, 77, 81, 84, 87, 89, 91, 93] },
      { name: "Tasty Travels", publisher: "Century Games", latestRevenue: 26.30, annualRevenue: 233, yoy: 54.0, yoyDelta: 81.7, trend: [12, 13, 14, 16, 17, 19, 21, 22, 23, 24, 25, 26] },
      { name: "Travel Town", publisher: "Moon Active", latestRevenue: 18.05, annualRevenue: 237, yoy: 12.0, yoyDelta: 25.4, trend: [17, 18, 18, 19, 19, 20, 20, 20, 20, 19, 18, 18] },
      { name: "Merge Cooking", publisher: "Happibits", latestRevenue: 13.89, annualRevenue: 165, yoy: 30.0, yoyDelta: 38.1, trend: [9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 14] },
      { name: "Seaside Escape", publisher: "Microfun", latestRevenue: 14.32, annualRevenue: 161, yoy: 22.0, yoyDelta: 29.0, trend: [10, 10, 11, 11, 12, 12, 12, 13, 13, 14, 14, 14] },
      { name: "Flambé: Merge & Cook", publisher: "Microfun", latestRevenue: 13.55, annualRevenue: 148, yoy: 18.0, yoyDelta: 22.6, trend: [10, 10, 10, 11, 11, 11, 12, 12, 13, 13, 13, 14] },
      { name: "Merge Mansion", publisher: "Metacore", latestRevenue: 9.36, annualRevenue: 122, yoy: -8.0, yoyDelta: -10.6, trend: [12, 12, 11, 11, 11, 10, 10, 10, 10, 10, 9, 9] },
      { name: "Longleaf Valley", publisher: "TreesPlease", latestRevenue: 11.20, annualRevenue: 124, yoy: 25.0, yoyDelta: 24.8, trend: [7, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11] },
      { name: "Merge Hotel Empire", publisher: "GreenPixel", latestRevenue: 8.60, annualRevenue: 99, yoy: 35.0, yoyDelta: 25.7, trend: [5, 6, 6, 7, 7, 8, 8, 8, 8, 8, 9, 9] },
      { name: "Merge Prison", publisher: "Blue Ultra Game", latestRevenue: 7.50, annualRevenue: 82, yoy: 110.0, yoyDelta: 43.0, trend: [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8] },
    ],
    newProducts: [
      { name: "Foodstars: Merge & Cook", publisher: "Happibits", testDate: "2026.02", monthsAgo: 5, markets: "加拿大／美国", latestRevenue: 0.44, mom: 108.7, peakRevenue: 0.44, status: "加速测试" },
      { name: "Merge Prison", publisher: "Blue Ultra Game", testDate: "2025.09", monthsAgo: 10, markets: "全球", latestRevenue: 7.50, mom: 28.0, peakRevenue: 7.50, status: "突破型新品" },
      { name: "Merge Teahouse", publisher: "X.P. Games", testDate: "2026.01", monthsAgo: 6, markets: "日本／韩国", latestRevenue: 0.51, mom: 28.0, peakRevenue: 0.51, status: "达标新品" },
      { name: "Merge Diner", publisher: "NewLeaf", testDate: "2026.04", monthsAgo: 3, markets: "英国／澳洲", latestRevenue: 0.16, mom: 42.5, peakRevenue: 0.16, status: "达标新品" },
      { name: "Merge Voyage", publisher: "Tiny Harbor", testDate: "2026.05", monthsAgo: 2, markets: "加拿大", latestRevenue: 0.14, mom: 75.2, peakRevenue: 0.14, status: "新进入测试" },
      { name: "Merge Bistro", publisher: "Casual Joy", testDate: "2025.11", monthsAgo: 8, markets: "欧洲", latestRevenue: 0.12, mom: -22.0, peakRevenue: 0.19, status: "回落观察" },
    ],
    newCohort: { monitored: 31, matured: 23, qualified: 5, breakout: 2 },
    newCohort6m: { monitored: 17, matured: 10, qualified: 3, breakout: 1 },
    contributions: [
      { name: "Gossip Harbor", value: 34.1 }, { name: "Travel Town", value: 15.6 }, { name: "Tasty Travels", value: 7.9 }, { name: "新兴产品", value: 5.3 }, { name: "Merge Mansion", value: -2.8 }, { name: "其他产品", value: -4.6 },
    ],
    matrix: [
      { name: "Gossip Harbor", x: 88, y: 76, size: 24, tone: "green" }, { name: "Travel Town", x: 69, y: 64, size: 20, tone: "blue" }, { name: "Tasty Travels", x: 51, y: 71, size: 18, tone: "orange" }, { name: "Merge Mansion", x: 42, y: 35, size: 17, tone: "purple" }, { name: "Foodstars", x: 19, y: 82, size: 12, tone: "red" },
    ],
    regions: [
      { name: "北美", revenue: 42, revenueYoy: 16.7, downloads: 22, mauYoy: 7.8, arpdau: "$0.181" },
      { name: "西欧", revenue: 28, revenueYoy: 19.4, downloads: 24, mauYoy: 9.1, arpdau: "$0.139" },
      { name: "日本／韩国", revenue: 9, revenueYoy: 12.3, downloads: 8, mauYoy: 4.8, arpdau: "$0.117" },
      { name: "其他亚洲", revenue: 13, revenueYoy: 29.8, downloads: 31, mauYoy: 14.6, arpdau: "$0.052" },
      { name: "其他地区", revenue: 8, revenueYoy: 22.1, downloads: 15, mauYoy: 11.2, arpdau: "$0.061" },
    ],
    countries: [
      { name: "美国", revenue: 38, revenueYoy: 17.4, downloads: 17, mauYoy: 8.2, arpdau: "$0.194" },
      { name: "英国", revenue: 9, revenueYoy: 20.1, downloads: 7, mauYoy: 9.8, arpdau: "$0.151" },
      { name: "德国", revenue: 7, revenueYoy: 18.9, downloads: 6, mauYoy: 8.7, arpdau: "$0.136" },
      { name: "法国", revenue: 6, revenueYoy: 21.4, downloads: 6, mauYoy: 10.2, arpdau: "$0.128" },
      { name: "日本", revenue: 6, revenueYoy: 11.8, downloads: 5, mauYoy: 4.4, arpdau: "$0.121" },
      { name: "韩国", revenue: 3, revenueYoy: 13.2, downloads: 3, mauYoy: 5.3, arpdau: "$0.110" },
      { name: "巴西", revenue: 4, revenueYoy: 31.6, downloads: 10, mauYoy: 16.1, arpdau: "$0.047" },
      { name: "印度", revenue: 2, revenueYoy: 35.2, downloads: 13, mauYoy: 18.5, arpdau: "$0.021" },
    ],
    monetization: [
      { name: "IAP主导", share: 82, color: "#4f8de8" }, { name: "混合变现", share: 16, color: "#55b89f" }, { name: "IAA主导", share: 2, color: "#f0ad58" },
    ],
    ads: { total: "15.8B", yoy: 24.0, perDau: "3.1次/日", perDauYoy: 14.2, coverage: "覆盖样本：Top 30中的17款" },
    conclusions: [
      { label: "市场阶段", title: "规模与质量共振", text: "下载、MAU和ARPDAU均在增长，当前扩张质量好于单纯买量拉动。" },
      { label: "竞争结构", title: "增长不等于普遍机会", text: "CR10接近80%，头部的内容、活动编排和发行能力正在形成新壁垒。" },
      { label: "内部结构", title: "二合成为绝对主流", text: "二合贡献九成以上收入与下载，三合则转向规模更小但黏性更深的存量市场。" },
    ],
    monitors: ["收入增速能否持续高于MAU", "Top10年度收入分化", "三合核心用户价值", "新品达标率与达标速度", "人均广告负载与时长关系"],
  },
};

const demos: Record<"match3" | "merge" | "block", MarketDemo> = {
  ...baseDemos,
  block: {
    ...baseDemos.match3,
    judgement: "方块解谜已完成大规模用户需求验证，收入增长明显快于下载增长，竞争重点正从扩大用户规模转向提升留存与IAP变现深度。",
    context: "第二梯队 · 商业化深化 · 头部新品驱动",
    kpis: [
      { label: "月收入", value: "$72M", mom: 4.8, yoy: 42.0, note: "商业化仍在快速深化" },
      { label: "月下载", value: "96M", mom: 1.5, yoy: 9.8, note: "大下载需求已被验证" },
      { label: "月MAU", value: "78M", mom: 1.1, yoy: 7.6, note: "用户规模继续扩张" },
      { label: "人均每日游玩", value: "22.4分钟", mom: 1.7, yoy: 6.2, note: "参与深度缓慢提高" },
      { label: "IAP ARPDAU", value: "$0.026", mom: 5.4, yoy: 31.0, note: "付费效率成为增长核心" },
    ],
    trends: {
      revenue: [28, 29, 30, 32, 34, 35, 37, 39, 41, 44, 46, 48, 51, 54, 57, 60, 63, 65, 67, 69, 70, 71, 71, 72],
      downloads: [74, 75, 76, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 92, 93, 94, 95, 95, 96],
      mau: [59, 60, 61, 61, 62, 63, 64, 65, 65, 66, 67, 68, 69, 70, 71, 72, 72, 73, 74, 75, 76, 77, 77, 78],
      arpdau: [0.014, 0.014, 0.015, 0.015, 0.016, 0.016, 0.017, 0.017, 0.018, 0.018, 0.019, 0.019, 0.020, 0.021, 0.021, 0.022, 0.022, 0.023, 0.023, 0.024, 0.024, 0.025, 0.025, 0.026],
    },
    retention: {
      D1: retentionTrend(33.8, 35.1, .3),
      D7: retentionTrend(13.5, 14.6, .9),
      D30: retentionTrend(7.1, 8.0, 1.5),
      D180: retentionTrend(2.4, 2.9, 2.2),
      D360: retentionTrend(1.1, 1.4, 2.9),
    },
    growthMode: "dual",
    growthNote: "MAU同比增长7.6%，IAP ARPDAU同比增长31.0%，收入增长主要由商业化深化驱动。",
    segments: [
      { name: "经典方块拼放", color: "#4f8de8", revenue: 54, downloads: 68, mau: 65, yoy: 21.0, time: "21.7分钟", arpdau: "$0.018" },
      { name: "方块Jam／队列", color: "#55b89f", revenue: 34, downloads: 22, mau: 25, yoy: 78.0, time: "24.8分钟", arpdau: "$0.041" },
      { name: "数独／其他融合", color: "#8469d8", revenue: 12, downloads: 10, mau: 10, yoy: 9.0, time: "23.1分钟", arpdau: "$0.024" },
    ],
    segmentConclusion: "经典方块拼放贡献最大用户规模，方块Jam等新形态以更深失败付费推动收入增量。",
    concentration: [
      { period: "24Q2", cr3: 37, cr10: 61 }, { period: "24Q4", cr3: 39, cr10: 63 }, { period: "25Q2", cr3: 43, cr10: 66 }, { period: "25Q4", cr3: 46, cr10: 69 }, { period: "26Q2", cr3: 48, cr10: 71 },
    ],
    topProducts: [
      { name: "Block Blast!", publisher: "Hungry Studio", latestRevenue: 18.6, annualRevenue: 206, yoy: 35.0, yoyDelta: 53.4, trend: [12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19] },
      { name: "Color Block Jam", publisher: "Rollic", latestRevenue: 14.8, annualRevenue: 158, yoy: 76.0, yoyDelta: 68.3, trend: [6, 7, 8, 9, 10, 11, 12, 13, 13, 14, 15, 15] },
      { name: "Blockudoku", publisher: "Easybrain", latestRevenue: 7.4, annualRevenue: 91, yoy: 8.0, yoyDelta: 6.7, trend: [7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 7, 7] },
      { name: "Woodoku", publisher: "Tripledot Studios", latestRevenue: 6.9, annualRevenue: 86, yoy: 5.0, yoyDelta: 4.1, trend: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7] },
      { name: "Block Jam 3D", publisher: "PartyUp", latestRevenue: 5.8, annualRevenue: 62, yoy: 58.0, yoyDelta: 22.8, trend: [3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6] },
      { name: "Tetris Block Party", publisher: "PLAYSTUDIOS", latestRevenue: 4.2, annualRevenue: 49, yoy: 16.0, yoyDelta: 6.8, trend: [3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4] },
      { name: "Block Puzzle", publisher: "Guru Puzzle", latestRevenue: 3.8, annualRevenue: 45, yoy: 11.0, yoyDelta: 4.5, trend: [3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4] },
      { name: "Wood Block Puzzle", publisher: "Gameberry", latestRevenue: 3.2, annualRevenue: 39, yoy: 7.0, yoyDelta: 2.6, trend: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3] },
      { name: "Block Puzzle Jewel", publisher: "Classic Puzzle", latestRevenue: 2.8, annualRevenue: 34, yoy: 13.0, yoyDelta: 3.9, trend: [2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3] },
      { name: "Block Master", publisher: "Puzzle Studio", latestRevenue: 2.4, annualRevenue: 29, yoy: 18.0, yoyDelta: 4.4, trend: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2] },
    ],
    newProducts: [
      { name: "Block Jam 3D", publisher: "PartyUp", testDate: "2025.03", monthsAgo: 16, markets: "全球", latestRevenue: 5.80, mom: 12.4, peakRevenue: 5.80, status: "突破型新品" },
      { name: "Block Sort Journey", publisher: "Puzzle Studio", testDate: "2025.10", monthsAgo: 9, markets: "美国／加拿大", latestRevenue: 0.86, mom: 28.1, peakRevenue: 0.86, status: "加速测试" },
      { name: "Color Tile Jam", publisher: "Rollic", testDate: "2026.01", monthsAgo: 6, markets: "英国／澳洲", latestRevenue: 0.54, mom: 19.5, peakRevenue: 0.61, status: "稳定验证" },
      { name: "Block Away", publisher: "Easybrain", testDate: "2026.02", monthsAgo: 5, markets: "加拿大", latestRevenue: 0.31, mom: 34.6, peakRevenue: 0.31, status: "达标新品" },
      { name: "Cube Escape Jam", publisher: "Tripledot Studios", testDate: "2026.04", monthsAgo: 3, markets: "英国", latestRevenue: 0.18, mom: 41.2, peakRevenue: 0.18, status: "新进入测试" },
      { name: "Block Match Story", publisher: "Casual Lab", testDate: "2025.12", monthsAgo: 7, markets: "加拿大／澳洲", latestRevenue: 0.13, mom: -8.2, peakRevenue: 0.22, status: "回落观察" },
    ],
    contributions: [
      { name: "Block Blast!", value: 8.8 }, { name: "Color Block Jam", value: 7.1 }, { name: "Block Jam 3D", value: 3.2 }, { name: "其他增长产品", value: 2.4 }, { name: "存量收缩产品", value: -1.8 },
    ],
  },
};

const metricMeta: Record<MetricKey, { label: string; unit: string }> = {
  revenue: { label: "收入", unit: "M美元" },
  downloads: { label: "下载", unit: "M次" },
  mau: { label: "MAU", unit: "M人" },
  arpdau: { label: "ARPDAU", unit: "美元" },
  retention: { label: "留存", unit: "%" },
};

function Change({ value }: { value: number }) {
  return <span className={value >= 0 ? "market-up" : "market-down"}>{value >= 0 ? "+" : ""}{value.toFixed(1)}%</span>;
}

function ResearchStrip({ data, challenge, fallback }: { data: string; challenge: string; fallback: string }) {
  return <div className="market-research-strip"><p><b>数据</b>{data}</p><p><b>难点</b>{challenge}</p><p><b>替代方案</b>{fallback}</p></div>;
}

function ModuleHeading({ index, title, insight, description, children }: { index: string; title: string; insight?: string; description: string; children?: React.ReactNode }) {
  return <div className="market-module-heading"><div><span>{index}</span><h2>{title}{insight && <em>：{insight}</em>}</h2><p>{description}</p></div>{children}</div>;
}

function formatTrend(value: number, metric: MetricKey) {
  if (metric === "retention") return `${value.toFixed(1)}%`;
  if (metric === "arpdau") return `$${value.toFixed(3)}`;
  return `${value.toFixed(0)}M`;
}

function formatMoney(value: number) {
  return value >= 1000 ? `$${(value / 1000).toFixed(2)}B` : `$${value.toFixed(value >= 10 ? 1 : 2)}M`;
}

function monthlyChange(trend: number[]) {
  if (trend.length < 2 || !trend[trend.length - 2]) return 0;
  return (trend[trend.length - 1] / trend[trend.length - 2] - 1) * 100;
}

function SparkLine({ values }: { values: number[] }) {
  const width = 92;
  const height = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map((value, index) => `${index / Math.max(1, values.length - 1) * width},${height - 3 - (value - min) / span * (height - 6)}`).join(" ");
  return <svg className="mini-revenue-line" viewBox={`0 0 ${width} ${height}`} aria-hidden="true"><polyline points={points} fill="none" stroke="#4f86e8" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" /></svg>;
}

function ProductIcon({ name, size = "tiny" }: { name: string; size?: "tiny" | "small" }) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const game = games.find((item) => item.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized);
  if (game) return <GameAvatar game={game} size={size} />;
  const initials = name.match(/[A-Za-z0-9]+/g)?.slice(0, 2).map((part) => part[0]).join("").toUpperCase() ?? name.slice(0, 2);
  return <span className={`product-icon-fallback ${size}`}>{initials}</span>;
}

const retentionMeta: Record<RetentionKey, { label: string; color: string }> = {
  D1: { label: "D1留存", color: "#3f7ee8" },
  D7: { label: "D7留存", color: "#5bb7a3" },
  D30: { label: "D30留存", color: "#8a6ddd" },
  D180: { label: "D180留存", color: "#ef9f4b" },
  D360: { label: "D360留存", color: "#dc6f8f" },
};

type TrendSeries = { id: string; label: string; color: string; values: number[] };

function LineTrendChart({ labels, series, metric }: { labels: string[]; series: TrendSeries[]; metric: MetricKey }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const width = 1180;
  const height = 280;
  const padding = { left: 58, right: 22, top: 18, bottom: 36 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const allValues = series.flatMap((item) => item.values);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const range = rawMax - rawMin || Math.max(rawMax * .1, 1);
  const yMin = Math.max(0, rawMin - range * .14);
  const yMax = rawMax + range * .16;
  const x = (index: number) => padding.left + (labels.length <= 1 ? chartWidth / 2 : index / (labels.length - 1) * chartWidth);
  const y = (value: number) => padding.top + chartHeight - (value - yMin) / Math.max(.001, yMax - yMin) * chartHeight;
  const activeIndex = hoverIndex === null ? labels.length - 1 : hoverIndex;
  const tooltipLeft = `${Math.min(82, Math.max(8, 6 + activeIndex / Math.max(1, labels.length - 1) * 86))}%`;

  return <div className="market-line-wrap" onMouseMove={(event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relative = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    setHoverIndex(Math.round(relative * (labels.length - 1)));
  }} onMouseLeave={() => setHoverIndex(null)}>
    <svg className="market-line-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${metricMeta[metric].label}折线趋势`}>
      {Array.from({ length: 5 }, (_, index) => {
        const value = yMin + (yMax - yMin) * index / 4;
        const yPos = y(value);
        return <g key={`grid-${index}`}><line x1={padding.left} x2={width - padding.right} y1={yPos} y2={yPos} className="market-line-grid" /><text x={padding.left - 10} y={yPos + 3} textAnchor="end" className="market-line-axis">{formatTrend(value, metric)}</text></g>;
      })}
      {labels.map((label, index) => index % Math.max(1, Math.floor(labels.length / 6)) === 0 || index === labels.length - 1 ? <text x={x(index)} y={height - 9} textAnchor="middle" className="market-line-axis" key={`${label}-${index}`}>{label}</text> : null)}
      {series.map((item) => {
        const points = item.values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
        return <polyline key={item.id} points={points} fill="none" stroke={item.color} strokeWidth={series.length === 1 ? 4 : 2.6} strokeLinejoin="round" strokeLinecap="round" />;
      })}
      {hoverIndex !== null && <g><line x1={x(activeIndex)} x2={x(activeIndex)} y1={padding.top} y2={padding.top + chartHeight} className="market-line-hover" />{series.map((item) => <circle key={item.id} cx={x(activeIndex)} cy={y(item.values[activeIndex])} r={4.5} fill={item.color} stroke="#fff" strokeWidth={2} />)}</g>}
    </svg>
    {hoverIndex !== null && <div className="market-line-tooltip" style={{ left: tooltipLeft }}><b>{labels[activeIndex].replace(".", "年")}月</b>{series.map((item) => <span key={item.id}><i style={{ background: item.color }} />{item.label}<strong>{formatTrend(item.values[activeIndex], metric)}</strong></span>)}</div>}
  </div>;
}

export default function CategoryMarketDashboard({ categoryId, categoryName }: { categoryId: "match3" | "merge" | "block"; categoryName: string }) {
  const demo = demos[categoryId];
  const [metric, setMetric] = useState<MetricKey>("revenue");
  const [granularity, setGranularity] = useState<"日" | "月" | "年">("月");
  const [timeWindow, setTimeWindow] = useState("近24个月");
  const [region, setRegion] = useState("全球");
  const [platform, setPlatform] = useState("双平台");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [monetizationRange, setMonetizationRange] = useState("最新月");
  const rangeOptions = granularity === "日" ? ["近30天", "近90天", "自定义区间"] : granularity === "月" ? ["近12个月", "近24个月", "自定义区间"] : ["近3年", "近5年", "自定义区间"];
  const trendBundle = useMemo(() => {
    const source = metric === "retention" ? demo.retention.D30 : demo.trends[metric];
    if (granularity === "年") {
      const yearly = [source.slice(0, 6), source.slice(6, 18), source.slice(18)].map((group) => group.reduce((sum, value) => sum + value, 0) / group.length);
      return { values: yearly, labels: ["2024", "2025", "2026"] };
    }
    const count = timeWindow.includes("12") || timeWindow.includes("30") ? 12 : 24;
    return { values: source.slice(-count), labels: granularity === "日" ? Array.from({ length: count }, (_, index) => `D-${count - index}`) : monthLabels.slice(-count) };
  }, [demo, granularity, metric, timeWindow]);
  const trend = trendBundle.values;
  const labels = trendBundle.labels;
  const retentionSeries = useMemo(() => (Object.keys(retentionMeta) as RetentionKey[]).map((key) => {
    const source = demo.retention[key];
    let values = source;
    if (granularity === "年") values = [source.slice(0, 6), source.slice(6, 18), source.slice(18)].map((group) => group.reduce((sum, value) => sum + value, 0) / group.length);
    else values = source.slice(-(timeWindow.includes("12") || timeWindow.includes("30") ? 12 : 24));
    return { id: key, label: retentionMeta[key].label, color: retentionMeta[key].color, values };
  }), [demo, granularity, timeWindow]);
  const standardSeries = [{ id: metric, label: metricMeta[metric].label, color: "#4f8de8", values: trend }];
  const top10AnnualRevenue = demo.topProducts.reduce((sum, item) => sum + item.annualRevenue, 0);
  const latestConcentration = demo.concentration[demo.concentration.length - 1];
  const filteredNewProducts = demo.newProducts.filter((item) => item.monthsAgo <= 24 && item.latestRevenue > .1);
  const categoryNarrative = {
    match3: {
      growth: "三消市场存量提效抵消用户收缩，MAU同比下降2.4%，ARPDAU同比上升4.9%",
      competition: "CR10为82%，头部格局稳定，近24个月月收入突破10万美元的测试新品仍少",
      monetization: "IAP仍占主导，但IAA占比与下沉市场下载份额同步上升",
      userScale: "MAU同比 -2.4%", userScaleNote: "用户底盘缓慢收缩", userValue: "ARPDAU同比 +4.9%", userValueNote: "价值提升抵消规模下滑", conclusion: "存量提效",
    },
    merge: {
      growth: "二合市场规模与质量同步增长，MAU同比增长8.1%，ARPDAU同比增长9.2%",
      competition: "CR10为80%，头部继续吸收增量，近24个月月收入过10万美元的测试新品多于三消",
      monetization: "IAP继续驱动收入，IAA与下沉市场主要承担增量用户承接",
      userScale: "MAU同比 +8.1%", userScaleNote: "下载正在沉淀为活跃", userValue: "ARPDAU同比 +9.2%", userValueNote: "商业效率同步改善", conclusion: "规模与质量共振",
    },
    block: {
      growth: "方块解谜需求规模继续扩张，MAU同比增长7.6%，IAP ARPDAU同比增长31.0%",
      competition: "CR10为71%，增长仍由少数头部新品推动，商业化模式尚未完全固化",
      monetization: "IAA仍覆盖广泛用户，IAP与混合变现占比正在提升",
      userScale: "MAU同比 +7.6%", userScaleNote: "大下载需求继续沉淀", userValue: "ARPDAU同比 +31.0%", userValueNote: "付费深度快速提高", conclusion: "商业化深化",
    },
  }[categoryId];
  const growthInsight = categoryNarrative.growth;
  const competitionInsight = categoryNarrative.competition;
  const monetizationInsight = categoryNarrative.monetization;
  const annualMix = categoryId === "match3"
    ? [{ year: "2025", iap: 94, iaa: 6 }, { year: "2026", iap: 91, iaa: 9 }]
    : categoryId === "merge"
      ? [{ year: "2025", iap: 97, iaa: 3 }, { year: "2026", iap: 95, iaa: 5 }]
      : [{ year: "2025", iap: 38, iaa: 62 }, { year: "2026", iap: 45, iaa: 55 }];
  const iaaLeaders = categoryId === "match3"
    ? [
      { name: "Royal Match", publisher: "Dream Games", share: 18, delta: 4.2, revenue: 19.8 },
      { name: "Gardenscapes", publisher: "Playrix", share: 15, delta: 5.1, revenue: 8.0 },
      { name: "Fishdom", publisher: "Playrix", share: 13, delta: 2.8, revenue: 3.8 },
      { name: "Candy Crush Saga", publisher: "King", share: 9, delta: 1.6, revenue: 8.0 },
      { name: "Homescapes", publisher: "Playrix", share: 8, delta: 2.1, revenue: 2.4 },
    ]
    : categoryId === "merge" ? [
      { name: "Gossip Harbor", publisher: "Microfun", share: 12, delta: 3.0, revenue: 12.6 },
      { name: "Travel Town", publisher: "Moon Active", share: 10, delta: 2.4, revenue: 2.0 },
      { name: "Tasty Travels", publisher: "Century Games", share: 9, delta: 3.7, revenue: 2.6 },
      { name: "Merge Cooking", publisher: "Happibits", share: 8, delta: 1.9, revenue: 1.2 },
      { name: "Merge Prison", publisher: "Blue Ultra Game", share: 7, delta: 2.6, revenue: .6 },
    ] : [
      { name: "Block Blast!", publisher: "Hungry Studio", share: 72, delta: -4.0, revenue: 47.8 },
      { name: "Blockudoku", publisher: "Easybrain", share: 64, delta: -3.0, revenue: 13.2 },
      { name: "Woodoku", publisher: "Tripledot Studios", share: 61, delta: -2.0, revenue: 10.8 },
      { name: "Color Block Jam", publisher: "Rollic", share: 28, delta: 8.0, revenue: 5.8 },
      { name: "Block Jam 3D", publisher: "PartyUp", share: 24, delta: 6.0, revenue: 3.4 },
    ];
  const regionHistory = categoryId === "match3" ? [
    { year: "2023", downloads: [34, 11, 37, 18], revenue: [60, 18, 12, 10] },
    { year: "2024", downloads: [33, 10, 39, 18], revenue: [59, 17, 14, 10] },
    { year: "2025", downloads: [31, 10, 42, 17], revenue: [57, 17, 16, 10] },
    { year: "2026", downloads: [29, 9, 46, 16], revenue: [54, 16, 20, 10] },
  ] : categoryId === "merge" ? [
    { year: "2023", downloads: [39, 10, 34, 17], revenue: [66, 12, 13, 9] },
    { year: "2024", downloads: [38, 9, 36, 17], revenue: [64, 12, 15, 9] },
    { year: "2025", downloads: [36, 9, 39, 16], revenue: [62, 12, 17, 9] },
    { year: "2026", downloads: [34, 8, 43, 15], revenue: [59, 11, 21, 9] },
  ] : [
    { year: "2023", downloads: [24, 8, 52, 16], revenue: [42, 10, 37, 11] },
    { year: "2024", downloads: [23, 8, 54, 15], revenue: [40, 10, 40, 10] },
    { year: "2025", downloads: [22, 7, 57, 14], revenue: [38, 9, 44, 9] },
    { year: "2026", downloads: [20, 7, 60, 13], revenue: [35, 8, 49, 8] },
  ];
  const marketGroups = [
    { name: "T1市场", color: "#4f86e8" },
    { name: "日本／韩国", color: "#816bd8" },
    { name: "下沉市场", color: "#54b99d" },
    { name: "其他市场", color: "#b8c2d1" },
  ];
  const iaaCoverage = categoryId === "match3" ? 19 : categoryId === "merge" ? 17 : 24;
  const previousRegion = regionHistory[regionHistory.length - 2];
  const currentRegion = regionHistory[regionHistory.length - 1];
  const downMarketDownload = currentRegion.downloads[2];
  const downMarketRevenue = currentRegion.revenue[2];
  const newProductModes = categoryId === "match3"
    ? [{ label: "IAP主导", value: 3 }, { label: "混合变现", value: 5 }, { label: "IAA主导", value: 2 }]
    : categoryId === "merge"
      ? [{ label: "IAP主导", value: 6 }, { label: "混合变现", value: 3 }, { label: "IAA主导", value: 1 }]
      : [{ label: "IAP主导", value: 2 }, { label: "混合变现", value: 5 }, { label: "IAA主导", value: 3 }];
  const newProductModeTotal = newProductModes.reduce((sum, item) => sum + item.value, 0);
  const newProductMixedShare = Math.round(newProductModes[1].value / newProductModeTotal * 100);
  const iaaShareChange = annualMix[1].iaa - annualMix[0].iaa;

  return <div className="category-market-demo">
    <header className="market-demo-hero">
      <div><span className="eyebrow">MARKET SIZE & COMPETITIVE LANDSCAPE</span><h2>{categoryName}市场规模与竞争格局</h2><p>{demo.judgement}</p><small>{demo.context}</small></div>
      <div className="market-demo-badge"><b>DEMO</b><span>页面数据均为模拟值</span></div>
    </header>

    <section className="content-card market-demo-section">
      <ModuleHeading index="01" title="规模趋势" insight={growthInsight} description="按日、月、年和自定义时间区间切换，判断变化来自用户规模还是单用户价值。" />
      <div className="market-trend-toolbar">
        <div className="market-metric-switch">{(Object.keys(metricMeta) as MetricKey[]).map((key) => <button className={metric === key ? "active" : ""} onClick={() => setMetric(key)} key={key}>{metricMeta[key].label}</button>)}</div>
        <div className="market-granularity"><span>粒度</span>{(["日", "月", "年"] as const).map((item) => <button className={granularity === item ? "active" : ""} onClick={() => { setGranularity(item); setTimeWindow(item === "日" ? "近30天" : item === "月" ? "近24个月" : "近3年"); }} key={item}>{item}</button>)}</div>
        <label><span>时间区间</span><select value={timeWindow} onChange={(event) => setTimeWindow(event.target.value)}>{rangeOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
        {timeWindow === "自定义区间" && <div className="custom-date-range"><input aria-label="开始日期" type="date" defaultValue="2025-01-01" /><span>—</span><input aria-label="结束日期" type="date" defaultValue="2026-07-31" /></div>}
        <label><span>地区</span><select value={region} onChange={(event) => setRegion(event.target.value)}><option>全球</option><option>T1市场</option><option>北美</option><option>西欧</option><option>日本／韩国</option></select></label>
        <label><span>平台</span><select value={platform} onChange={(event) => setPlatform(event.target.value)}><option>双平台</option><option>iOS</option><option>Android</option></select></label>
      </div>
      <div className="market-trend-chart market-trend-full"><header><div><b>{metric === "retention" ? "Cohort留存率趋势" : `${metricMeta[metric].label}连续趋势`}</b><span>{region} · {platform} · {granularity}粒度 · {timeWindow}</span></div><strong>{metric === "retention" ? "5条曲线" : formatTrend(trend[trend.length - 1], metric)}<small>{metric === "retention" ? "D1—D360" : metricMeta[metric].unit}</small></strong></header><LineTrendChart labels={labels} series={metric === "retention" ? retentionSeries : standardSeries} metric={metric} /><div className="market-line-legend">{(metric === "retention" ? retentionSeries : standardSeries).map((item) => <span key={item.id}><i style={{ background: item.color }} />{item.label}</span>)}</div><footer><span>{metric === "retention" ? "横轴为新增cohort安装月份；各曲线表示该cohort在对应日龄仍活跃的比例。" : "折线用于识别长期方向、季节波动与策略变动后的拐点。"}</span><span>{metric === "retention" ? "鼠标移入可同时查看D1/D7/D30/D180/D360" : `最新 ${formatTrend(trend[trend.length - 1], metric)}`}</span></footer></div>
      <div className="trend-insight-panel"><div><span>用户规模</span><b>{categoryNarrative.userScale}</b><p>{categoryNarrative.userScaleNote}</p></div><div><span>用户价值</span><b>{categoryNarrative.userValue}</b><p>{categoryNarrative.userValueNote}</p></div><div><span>分析结论</span><b>{categoryNarrative.conclusion}</b><p>{demo.growthNote}</p></div></div>
      <ResearchStrip data="日/月/年收入、下载、DAU/MAU、ARPDAU，以及新增cohort的D1/D7/D30/D180/D360留存；支持时间、地区和平台筛选。" challenge="D180/D360存在长成熟延迟，且收入、活跃与留存的产品覆盖范围可能不一致。" fallback="留存仅基于共同覆盖产品池计算；未成熟cohort显示为待回填，并同时标注样本数和数据覆盖率。" />
    </section>

    <section className="content-card market-demo-section">
      <ModuleHeading index="02" title="品类内部结构" insight={demo.segmentConclusion} description={categoryId === "merge" ? "拆分二合与三合，判断规模迁移与核心用户价值。" : categoryId === "block" ? "拆分经典拼放、Jam与融合形态，判断收入与用户迁移。" : "拆分不同三消产品形态，判断收入、用户和参与深度由谁贡献。"}><span className="simulation-pill">自定义分类待确认</span></ModuleHeading>
      <div className="segment-layout"><div className="segment-share-chart">{(["revenue", "downloads", "mau"] as const).map((key) => <div className="segment-row" key={key}><b>{key === "revenue" ? "收入份额" : key === "downloads" ? "下载份额" : "MAU份额"}</b><div>{demo.segments.map((segment) => <span style={{ width: `${segment[key]}%`, background: segment.color }} key={segment.name}>{segment[key] >= 14 ? `${segment.name} ${segment[key]}%` : `${segment[key]}%`}</span>)}</div></div>)}</div><div className="segment-compare-table"><header><span>产品形态</span><span>收入同比</span><span>日均时长</span><span>ARPDAU</span></header>{demo.segments.map((segment) => <div key={segment.name}><b><i style={{ background: segment.color }} />{segment.name}</b><Change value={segment.yoy} /><span>{segment.time}</span><span>{segment.arpdau}</span></div>)}</div></div>
      <ResearchStrip data="GameIQ标签、自定义产品形态标签，以及各形态收入、下载、MAU、时长和ARPDAU。" challenge="产品可能同时包含多个Meta，非排他标签会导致份额重复计算。" fallback="由内部维护唯一主类型，并保留多标签用于产品检索；初期仅覆盖Top 30。" />
    </section>

    <section className="content-card market-demo-section">
      <ModuleHeading index="03" title="竞争格局与新品供给" insight={competitionInsight} description="同时观察存量Top10的月度变化与近24个月新品供给，判断头部格局是否松动及新品能否持续跑出。" />
      <div className="competition-snapshot-grid">
        <article><span>CR3</span><b>{latestConcentration.cr3}%</b><small>当前收入集中度</small></article>
        <article><span>CR10</span><b>{latestConcentration.cr10}%</b><small>当前收入集中度</small></article>
        <article><span>Top10近12月收入</span><b>{formatMoney(top10AnnualRevenue)}</b><small>存量头部收入规模</small></article>
        <article><span>近24个月测试新品</span><b>{filteredNewProducts.length}款</b><small>当前月收入＞10万美元</small></article>
      </div>
      <div className="competition-detail-grid">
        <div className="top10-revenue-card">
          <header><div><b>Top10收入表现</b><span>最近12个月 · 点击任一产品展开月度折线与明细</span></div><small>单位：百万美元</small></header>
          <div className="top10-table-head"><span>产品</span><span>近月收入</span><span>近12月收入</span><span>月同比</span><span>月环比</span><span>折线</span></div>
          <div className="top10-table-body">{demo.topProducts.map((item, index) => {
            const mom = monthlyChange(item.trend);
            const isExpanded = expandedProduct === item.name;
            return <Fragment key={item.name}>
              <button className="top10-table-row" title="点击展开近12个月折线与具体数据" aria-expanded={isExpanded} onClick={() => setExpandedProduct(isExpanded ? null : item.name)}>
                <span className="top10-product"><i>{index + 1}</i><ProductIcon name={item.name} /><span><b>{item.name}</b><small>{item.publisher}</small></span></span>
                <strong>{formatMoney(item.latestRevenue)}</strong>
                <strong>{formatMoney(item.annualRevenue)}</strong>
                <Change value={item.yoy} />
                <Change value={mom} />
                <span className="mini-revenue-trend"><SparkLine values={item.trend} /></span>
              </button>
              {isExpanded && <div className="top10-expanded-detail">
                <header><div><b>{item.name}近12个月收入</b><span>月度折线与具体收入 · 模拟数据</span></div><button onClick={() => setExpandedProduct(null)}>收起</button></header>
                <LineTrendChart labels={monthLabels.slice(-12)} series={[{ id: item.name, label: "月收入", color: "#4f8de8", values: item.trend }]} metric="revenue" />
              </div>}
            </Fragment>;
          })}</div>
        </div>
        <div className="new-product-monitor-card">
          <header><div><b>新品测试监测</b><span>近24个月首次进入测试且当前月收入＞10万美元</span></div></header>
          <div className="new-product-featured-grid">{filteredNewProducts.slice(0, 4).map((item) => <button className="new-product-featured-card" key={item.name} title="接入后点击进入产品详情">
            <span className="new-product-featured-head"><ProductIcon name={item.name} size="small" /><span><b>{item.name}</b><small>{item.publisher}</small></span></span>
            <span className="new-product-featured-metrics"><span><small>测试市场</small><b>{item.markets}</b></span><span><small>首次监测</small><b>{item.testDate}</b></span><span><small>近月收入</small><b>{formatMoney(item.latestRevenue)} <Change value={item.mom} /></b></span><span><small>峰值收入</small><b>{formatMoney(item.peakRevenue)}</b></span></span>
          </button>)}</div>
          {filteredNewProducts.length > 4 && <><div className="new-product-table-head"><span>新品／发行商</span><span>测试市场</span><span>首次测试</span><span>近月收入</span><span>月环比</span><span>峰值收入</span></div>
          <div className="new-product-table-body">{filteredNewProducts.slice(4).map((item) => <button className="new-product-table-row" key={item.name} title="接入后点击进入产品详情">
            <span className="new-product-name"><ProductIcon name={item.name} /><span><b>{item.name}</b><small>{item.publisher}</small></span></span>
            <span>{item.markets}</span><span>{item.testDate}</span><strong>{formatMoney(item.latestRevenue)}</strong><Change value={item.mom} /><span>{formatMoney(item.peakRevenue)}</span>
          </button>)}</div></>}
          {filteredNewProducts.length === 0 && <div className="new-product-empty">近24个月暂无月收入突破10万美元的测试产品</div>}
          <p className="new-product-rule">纳入口径：近24个月首次进入测试、尚未正式全球发行，且最新完整月IAP收入＞10万美元。</p>
        </div>
      </div>
      <ResearchStrip data="①Top10逐月收入及月同比、月环比；②新品首次测试与全球上线时间；③近24个月测试新品逐月收入、下载、主要市场、峰值与统一产品ID。" challenge="软启动、重新发行和正式全球上线的识别口径可能不一致。" fallback="若无法获得完整测试池，先展示可观测新品清单与收入轨迹，不计算新品成功率。" />
    </section>

    <section className="content-card market-demo-section">
      <ModuleHeading index="04" title="变现模式迁移与区域下沉" insight={monetizationInsight} description="判断品类是否由纯IAP转向IAA／混合变现，以及新增用户是否正在向低IAP价值市场迁移。"><span className="conditional-pill">IAA数据待确认</span></ModuleHeading>
      <div className="monetization-toolbar"><label><span>时间范围</span><select value={monetizationRange} onChange={(event) => setMonetizationRange(event.target.value)}><option>2026 vs 2025</option><option>近12个月</option><option>近24个月</option><option>自定义区间</option></select></label><span>收入与下载均按统一产品池汇总 · 模拟数据</span></div>

      <div className="monetization-kpi-grid">
        <article className="tone-blue"><span>IAA收入占比</span><b>{annualMix[1].iaa}%</b><small>同比提升 {iaaShareChange} 个百分点</small></article>
        <article className="tone-violet"><span>Top30 IAA覆盖</span><b>{iaaCoverage}<em>/30款</em></b><small>当前存在IAA收入的头部产品</small></article>
        <article className="tone-orange"><span>新品变现模式</span><b>{newProductMixedShare}%<em>混合变现</em></b><div className="kpi-mode-dots">{newProductModes.map((item, index) => <i className={`mode-${index + 1}`} style={{ width: `${item.value / newProductModeTotal * 100}%` }} title={`${item.label} ${item.value}款`} key={item.label} />)}</div><small>{newProductModes.map((item) => `${item.label}${item.value}款`).join(" · ")}</small></article>
        <article className="tone-green"><span>下沉市场结构</span><b>{downMarketDownload}%<em>下载</em> / {downMarketRevenue}%<em>收入</em></b><small>同比均提升 4 个百分点</small></article>
      </div>

      <div className="monetization-detail-grid">
        <div className="annual-mix-card">
          <header><div><b>IAP／IAA收入结构：IAA占比同比提升{iaaShareChange}个百分点</b><span>对比市场总收入的变现模式变化</span></div><small>2026 vs 2025</small></header>
          <div className="annual-donut-grid">{annualMix.map((item) => <div className="annual-donut-item" key={item.year}>
            <div className="annual-donut" style={{ background: `conic-gradient(#c2cad6 0 ${item.iap}%, #55b89f ${item.iap}% 100%)` }}><i><b>{item.year}</b><span>IAA {item.iaa}%</span></i></div>
            <div><span><i />IAP收入<strong>{item.iap}%</strong></span><span><i />IAA收入<strong>{item.iaa}%</strong></span></div>
          </div>)}</div>
          <p>IAA份额从{annualMix[0].iaa}%升至{annualMix[1].iaa}%，用于识别成熟品类是否正通过广告变现承接更广泛用户。</p>
        </div>
        <div className="iaa-leaderboard-card">
          <header><div><b>Top30产品IAA占比排名</b><span>观察头部产品是否扩大IAA变现</span></div><small>Top 5 · 模拟数据</small></header>
          <div className="iaa-table-head"><span>产品</span><span>IAA占比</span><span>同比变化</span><span>IAA收入</span></div>
          {iaaLeaders.map((item, index) => <div className="iaa-table-row" key={item.name}><span className="iaa-product"><i>{index + 1}</i><ProductIcon name={item.name} /><span><b>{item.name}</b><small>{item.publisher}</small></span></span><strong>{item.share}%</strong><Change value={item.delta} /><strong>{formatMoney(item.revenue)}</strong></div>)}
        </div>
      </div>

      <div className="regional-migration-card">
        <header><div><b>区域结构是否向下沉市场迁移：下载占比{previousRegion.downloads[2]}%→{downMarketDownload}%，收入占比{previousRegion.revenue[2]}%→{downMarketRevenue}%</b><span>下载与总收入分图展示，观察2023—2026年市场结构迁移</span></div><small>2023—2026</small></header>
        <div className="regional-migration-legend">{[marketGroups[2], marketGroups[0], marketGroups[1], marketGroups[3]].map((group) => <span key={group.name}><i style={{ background: group.color }} />{group.name}</span>)}</div>
        <div className="regional-vertical-grid">{([
          { key: "downloads" as const, label: "下载结构", note: `下沉市场 ${regionHistory[0].downloads[2]}%→${downMarketDownload}%` },
          { key: "revenue" as const, label: "总收入结构", note: `下沉市场 ${regionHistory[0].revenue[2]}%→${downMarketRevenue}%` },
        ]).map((chart) => <section className="regional-vertical-panel" key={chart.key}><header><b>{chart.label}</b><span>{chart.note}</span></header><div className="regional-column-chart">{regionHistory.map((year) => {
          const values = year[chart.key];
          return <div className="regional-year-column" key={`${chart.key}-${year.year}`}><div className="regional-stack">{[2, 0, 1, 3].map((groupIndex) => <em className={groupIndex === 2 ? "down-market-segment" : ""} key={groupIndex} style={{ height: `${values[groupIndex]}%`, background: marketGroups[groupIndex].color }}>{groupIndex === 2 || values[groupIndex] >= 16 ? `${values[groupIndex]}%` : ""}</em>)}</div><b>{year.year}</b></div>;
        })}</div></section>)}</div>
        <p>下沉市场份额置于每根柱子的底部，便于跨年份直接比较；结构变化仍需结合品类整体ARPDAU判断价值稀释程度。</p>
      </div>

      <ResearchStrip data="市场划分：①T1＝美国、加拿大、西欧、澳大利亚、新西兰；②日本／韩国单列；③下沉市场＝印度、东南亚、拉美、土耳其等大下载、低IAP RPD市场；④其他市场承接口径剩余。区域图需要产品×月份×国家×平台的下载与总收入；IAA结构另需产品级IAA收入。" challenge="需确认Sensor Tower的IAA收入覆盖范围，并固定国家映射与共同产品池，避免样本变化造成结构误判。" fallback="若IAA收入不可用，则隐藏IAA结构和排名，仅保留下载、总收入、产品变现标签与新品结构。" />
    </section>

  </div>;
}

import FamilyMarketTrend from "../_components/FamilyMarketTrend";

export default function CategoriesPage() {
  return <>
    <header className="page-heading market-overview-heading">
      <div>
        <span className="eyebrow">CROSS-CATEGORY MARKET OVERVIEW</span>
        <h1>休闲品类市场概览</h1>
        <p>通过跨品类趋势判断市场规模与结构变化，再下钻12个重点细分品类跟踪市场阶段和产品异动。</p>
      </div>
    </header>

    <section className="content-card family-market-section" id="family-market">
      <div className="section-title">
        <div><h2>跨品类总格局：规模与结构趋势</h2><p>自由选择比较品类、时间区间和核心指标，并直接下钻查看各品类的规模、市场阶段与异动产品。</p></div>
        <small>模拟数据 · 待接入API</small>
      </div>
      <FamilyMarketTrend />
    </section>
  </>;
}

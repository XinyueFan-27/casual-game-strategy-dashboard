export function PlanModule({ title, plan, data, question, compact = false }: { title: string; plan: string; data: string; question: string; compact?: boolean }) {
  return (
    <section className={`plan-module ${compact ? "compact" : ""}`}>
      <div className="plan-module-head"><span>规划模块</span><b>{title}</b></div>
      <div className="plan-module-body"><p><strong>计划展示</strong>{plan}</p><p><strong>需要数据</strong>{data}</p><p><strong>用于回答</strong>{question}</p></div>
    </section>
  );
}

export function AnalysisBrief({ title, description, questions }: { title: string; description: string; questions: string[] }) {
  return (
    <section className="analysis-brief">
      <div><span>本页核心任务</span><h2>{title}</h2><p>{description}</p></div>
      <div className="analysis-question-list">{questions.map((question, index) => <div key={question}><b>0{index + 1}</b><span>{question}</span></div>)}</div>
    </section>
  );
}

export function DetailedPlanSection({ index, title, description, items, example, output, columns = 3 }: { index: string; title: string; description: string; items: { label: string; title: string; text: string }[]; example?: string; output?: string; columns?: 2 | 3 | 4 }) {
  return (
    <section className="content-card detailed-plan-section">
      <div className="detailed-plan-heading"><span>{index}</span><div><small>PLANNED ANALYSIS</small><h2>{title}</h2><p>{description}</p></div></div>
      <div className={`detailed-plan-grid columns-${columns}`}>{items.map((item) => <article key={`${item.label}-${item.title}`}><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      {example && <div className="plan-example"><b>示例判断（非当前结论）</b><p>{example}</p></div>}
      {output && <footer className="plan-output"><b>最终产出</b><span>{output}</span></footer>}
    </section>
  );
}

export function TrendPlan({ scope = "游戏" }: { scope?: "游戏" | "品类" }) {
  return (
    <section className="trend-plan">
      <div className="trend-toolbar"><div><b>收入／下载／RPD时间趋势</b><small>计划接入连续月份数据</small></div><div className="segmented"><span className="active">收入</span><span>下载</span><span>RPD</span><span>活跃</span></div></div>
      <div className="trend-canvas"><div className="trend-axis y"><span>高</span><span>中</span><span>低</span></div><div className="trend-grid"><i /><i /><i /><i /><div className="trend-placeholder"><b>{scope}趋势图预留区</b><p>后续支持时间范围、地区、平台和指标切换，并标注版本与活动节点。</p></div></div><div className="trend-axis x"><span>起始期</span><span>连续月份</span><span>最新期</span></div></div>
      <div className="chart-footnote">数据口径与来源将在图表下方以弱提示展示，不占据主要分析空间。</div>
    </section>
  );
}

import Link from "next/link";
import type { PublicReport } from "@/lib/diagnostic/public-report";
import { ReportActions } from "./report-actions";

export function ReportState({ title, message }: { title: string; message: string }) {
  return <main className="report-state"><section><span className="eyebrow">AI Workforce Fit Report</span><h1>{title}</h1><p>{message}</p><Link href="/diagnostic" className="report-action primary">Start another diagnostic</Link></section></main>;
}

export function ReportContent({ report }: { report: PublicReport }) {
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(report.completedAt));
  return <main className="full-report">
    <header className="report-nav"><Link href="/" className="brand"><span>AI</span> Workforce Fit</Link><span>Private report link</span></header>
    <article>
      <section className="report-hero" aria-labelledby="report-title">
        <div><span className="eyebrow">AI Workforce Fit Report</span><h1 id="report-title">A practical AI Workforce for <em>{report.businessName}</em></h1><p>This report identifies your best-fit AI Agents and the recommended order for introducing them into the business.</p></div>
        <dl><div><dt>Prepared for</dt><dd>{report.businessName}</dd></div><div><dt>Completed</dt><dd>{date}</dd></div><div><dt>Priority Agents</dt><dd>Three-stage rollout</dd></div></dl>
      </section>

      <section className="report-section summary-section" aria-labelledby="summary-title"><div className="section-number">01</div><div><span className="section-kicker">Your fit summary</span><h2 id="summary-title">Where to focus first</h2><p className="report-summary">{report.summary}</p></div></section>

      <section className="report-section" aria-labelledby="recommendations-title"><div className="section-heading"><div><span className="section-kicker">Primary recommendations</span><h2 id="recommendations-title">Your first three AI Agents</h2></div><p>Build in sequence. Each role prepares cleaner information and clearer handovers for the next.</p></div><div className="recommendation-grid">{report.topThree.map((item) => <article className={`recommendation-card rank-${item.rank}`} key={item.name}><div className="rank-row"><span>Rank {item.rank}</span><strong>{item.priority}</strong></div><h3>{item.name}</h3><p className="card-why">{item.why}</p><ReportList title="Main problems it addresses" items={item.problems}/><ReportList title="Suggested first responsibilities" items={item.responsibilities}/><div className="benefit"><span>Expected operational benefit</span><p>{item.benefit}</p></div><div className="evidence"><span>Relevant diagnostic evidence</span>{item.evidence.map((evidence) => <p key={evidence}>{evidence}</p>)}</div></article>)}</div></section>

      <section className="report-section score-section" aria-labelledby="scores-title"><div className="section-heading"><div><span className="section-kicker">All eight roles compared</span><h2 id="scores-title">Diagnostic Fit Score</h2></div><p>Higher scores indicate a stronger match with the operational signals in your assessment. Scores are weighted points, not percentages.</p></div><div className="score-list">{report.scoreOverview.map((item, index) => <div className={`score-item ${item.isTopThree ? "top-score" : ""}`} key={item.name}><span className="score-rank">{String(index + 1).padStart(2, "0")}</span><div className="score-body"><div><strong>{item.name}</strong><span>{item.score} points{item.isTopThree ? " · Top three" : ""}</span></div><div className="score-track" aria-label={`${item.name}: ${item.score} fit points`}><span style={{ width: `${Math.max((item.score / report.maxScore) * 100, 3)}%` }}/></div></div></div>)}</div></section>

      <section className="report-section" aria-labelledby="sequence-title"><div className="section-heading"><div><span className="section-kicker">Recommended roadmap</span><h2 id="sequence-title">Implementation sequence</h2></div><p>Start narrowly, prove each handover, and expand only when the operating foundation is stable.</p></div><ol className="sequence">{report.sequence.map((step, index) => <li key={step}><span>{index === 0 ? "Prepare" : index === report.sequence.length - 1 ? "Expand" : `Stage ${index}`}</span><strong>{step}</strong>{index === 0 && <p>{report.readiness.actions[0]}</p>}{index === report.sequence.length - 1 && <p>Consider the next-phase roles when new constraints become visible.</p>}</li>)}</ol></section>

      <section className="report-section readiness-section" aria-labelledby="readiness-title"><div><span className="section-kicker">Readiness and foundations</span><h2 id="readiness-title">{report.readiness.level}</h2><p>{report.readiness.explanation}</p>{report.readiness.avoid && <p className="readiness-guardrail"><strong>Keep human control:</strong> {report.readiness.avoid}</p>}</div><div className="foundation-panel"><h3>Preparation actions</h3><ol>{report.readiness.actions.map((action, index) => <li key={action}><span>{index + 1}</span>{action}</li>)}</ol></div></section>

      <section className="report-section" aria-labelledby="next-phase-title"><div className="section-heading"><div><span className="section-kicker">Possible Next-Phase Agents</span><h2 id="next-phase-title">Roles to consider later</h2></div><p>These are not immediate priorities. Revisit them when the conditions below are present.</p></div><div className="next-phase-grid">{report.nextPhase.map((item) => <article key={item.name}><span>Later expansion</span><h3>{item.name}</h3><p>{item.why}</p><div><strong>Consider adding when</strong>{item.condition}</div></article>)}</div></section>

      <section className="report-section" aria-labelledby="snapshot-title"><div className="section-heading"><div><span className="section-kicker">Assessment snapshot</span><h2 id="snapshot-title">What you told us</h2></div><p>A concise view of the business signals used to produce this deterministic report.</p></div><div className="snapshot-grid">{report.snapshot.map((group) => <section key={group.title}><h3>{group.title}</h3>{group.items.map((item) => <p key={item}>{item}</p>)}</section>)}</div></section>

      <section className="report-utility"><div><span className="section-kicker">Keep this report useful</span><h2>Save, share or start again.</h2><p>This diagnostic provides an initial recommendation based on the information submitted. Implementation requirements depend on your systems, processes and data readiness. It does not guarantee specific financial or business outcomes.</p></div><ReportActions /></section>
    </article>
  </main>;
}

function ReportList({ title, items }: { title: string; items: string[] }) { return <div className="report-list"><h4>{title}</h4><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>; }

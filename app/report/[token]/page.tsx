import Link from "next/link";

export default async function ReportPlaceholder({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <main className="report-shell"><section className="report-placeholder"><span className="eyebrow">Submission saved securely</span><h1>Your AI Workforce Fit Report is ready for review.</h1><p>Phase 2 has stored your complete diagnostic and created a private report route. The full report design arrives in a later phase.</p><div className="token-box"><span>Secure report reference</span><code>{token.slice(0, 12)}…{token.slice(-8)}</code></div><Link className="secondary-link" href="/">Start another diagnostic</Link></section></main>;
}

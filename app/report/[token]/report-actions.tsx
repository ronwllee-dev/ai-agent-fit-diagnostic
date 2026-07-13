"use client";

import { useState } from "react";
import Link from "next/link";

export function ReportActions() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "fallback">("idle");
  async function copyLink() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(window.location.href);
      setCopyState("copied");
    } catch {
      setCopyState("fallback");
    }
  }
  return <div className="report-actions" aria-label="Report actions">
    <Link href="/diagnostic" className="report-action primary">Start another diagnostic</Link>
    <button type="button" className="report-action" onClick={copyLink}>Copy report link</button>
    <button type="button" className="report-action" onClick={() => window.print()}>Print report</button>
    <span className="action-status" role="status" aria-live="polite">{copyState === "copied" ? "Report link copied." : copyState === "fallback" ? "Copy unavailable—select the address from your browser." : ""}</span>
  </div>;
}

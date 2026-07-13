"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { emptyAnswers, questions, type Answers } from "@/lib/diagnostic/questions";
import type { Contact } from "@/lib/diagnostic/validation";

const initialContact: Contact = { firstName: "", lastName: "", email: "", phone: "", businessName: "", website: "", reportProcessingConsent: false, marketingConsent: false };

export default function DiagnosticPage() {
  const router = useRouter();
  const [stage, setStage] = useState<"intro" | "questions" | "contact" | "submitting">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => structuredClone(emptyAnswers));
  const [contact, setContact] = useState<Contact>(initialContact);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [limitMessage, setLimitMessage] = useState("");
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);
  const question = questions[step];

  function toggle(answerId: string) {
    const current = answers[question.id];
    let next: string[];
    if (question.type === "single") next = [answerId];
    else if (current.includes(answerId)) next = current.filter((id) => id !== answerId);
    else if (question.max && current.length >= question.max) { setLimitMessage(`You can select up to ${question.max} answers.`); return; }
    else next = [...current, answerId];
    setAnswers((old) => ({ ...old, [question.id]: next }));
    setErrors({}); setLimitMessage("");
  }

  function continueQuestion() {
    if (!answers[question.id].length) { setErrors({ [question.id]: "Choose at least one answer to continue." }); return; }
    if (step === questions.length - 1) setStage("contact"); else setStep((value) => value + 1);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setErrors({}); setStage("submitting");
    try {
      const response = await fetch("/api/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idempotencyKey, answers, contact }) });
      const data = await response.json();
      if (!response.ok) { setErrors(data.errors ?? { form: data.error ?? "Please check your details." }); setStage("contact"); return; }
      router.push(`/report/${data.reportToken}`);
    } catch { setErrors({ form: "The connection was interrupted. Please try again." }); setStage("contact"); }
  }

  if (stage === "intro") return <main className="diagnostic-shell"><header className="compact-header"><Link href="/" className="brand"><span>AI</span> Workforce Fit</Link><span>10 questions · 3–5 minutes</span></header><section className="intro-card"><span className="eyebrow">Your diagnostic</span><h1>Find the pressure points holding your business back.</h1><p>This short assessment reviews how you handle enquiries, sales, appointments, customers, payments, and daily operations. Your answers determine three priority AI Agents using a transparent scoring model.</p><div className="intro-points"><div><strong>10</strong><span>focused questions</span></div><div><strong>8</strong><span>specialist roles scored</span></div><div><strong>3</strong><span>priority matches</span></div></div><button className="primary-button" onClick={() => setStage("questions")}>Begin assessment <span>→</span></button><Link href="/" className="text-link">Back to overview</Link></section></main>;
  if (stage === "submitting") return <main className="diagnostic-shell"><section className="loading-card" aria-live="polite"><div className="spinner"/><span className="eyebrow">Building your match</span><h1>Analysing your business gaps…</h1><p>Scoring all eight specialist roles and securely saving your diagnostic.</p></section></main>;
  if (stage === "contact") return <main className="diagnostic-shell"><header className="compact-header"><Link href="/" className="brand"><span>AI</span> Workforce Fit</Link><span>Assessment complete</span></header><section className="contact-card"><div className="step-meta"><span className="eyebrow">Final step</span><span>Details & consent</span></div><h1>Where should we address your report?</h1><p className="lead-small">Your answers are complete. Add your details to generate and securely store your personalised match.</p><form onSubmit={submit} noValidate><div className="form-grid">{([['firstName','First name','text',true],['lastName','Last name','text',false],['email','Email address','email',true],['phone','Phone','tel',false],['businessName','Business name','text',true],['website','Website','url',false]] as const).map(([key,label,type,required]) => <label key={key}><span>{label}{required && ' *'}</span><input type={type} value={String(contact[key] ?? '')} onChange={(e) => setContact((c) => ({ ...c, [key]: e.target.value }))} aria-invalid={Boolean(errors[key])}/>{errors[key] && <small className="error">{errors[key]}</small>}</label>)}</div><label className="consent"><input type="checkbox" checked={contact.reportProcessingConsent} onChange={(e) => setContact((c) => ({ ...c, reportProcessingConsent: e.target.checked }))}/><span><strong>Required report consent</strong>I agree to the processing of my submitted information so that my AI Workforce Fit Report can be generated and stored.</span></label>{errors.reportProcessingConsent && <small className="error">{errors.reportProcessingConsent}</small>}<label className="consent"><input type="checkbox" checked={contact.marketingConsent} onChange={(e) => setContact((c) => ({ ...c, marketingConsent: e.target.checked }))}/><span><strong>Optional updates</strong>I would also like useful information about AI and business automation. I can unsubscribe at any time.</span></label>{errors.form && <div className="form-error">{errors.form}</div>}<div className="actions"><button type="button" className="back-button" onClick={() => { setStage("questions"); setStep(9); }}>← Back</button><button className="primary-button" type="submit">Generate my report →</button></div></form></section></main>;
  const progress = ((step + 1) / questions.length) * 100;
  return <main className="diagnostic-shell"><header className="compact-header"><Link href="/" className="brand"><span>AI</span> Workforce Fit</Link><span>Question {step + 1} of {questions.length}</span></header><section className="question-card"><div className="progress-track"><span style={{ width: `${progress}%` }}/></div><div className="step-meta"><span className="eyebrow">Question {String(step + 1).padStart(2, '0')}</span><span>{Math.round(progress)}% complete</span></div><h1>{question.title}</h1>{question.hint && <p className="question-hint">{question.hint}</p>}<div className="answer-grid" role={question.type === "single" ? "radiogroup" : "group"}>{question.answers.map((answer) => { const selected = answers[question.id].includes(answer.id); return <button type="button" key={answer.id} className={`answer-card ${selected ? 'selected' : ''}`} aria-pressed={selected} onClick={() => toggle(answer.id)}><span className="select-mark">{selected ? '✓' : ''}</span><span>{answer.label}</span></button>; })}</div>{(errors[question.id] || limitMessage) && <div className="inline-notice" role="alert">{errors[question.id] || limitMessage}</div>}<div className="actions"><button className="back-button" onClick={() => step === 0 ? setStage("intro") : setStep((value) => value - 1)}>← Back</button><button className="primary-button" onClick={continueQuestion}>Continue →</button></div></section></main>;
}

import { agents, type AgentId } from "./agents";
import { questions, type Answers } from "./questions";
import type { ScoreResult } from "./scoring";

const label = (questionId: string, answerId: string) => questions.find((q) => q.id === questionId)?.answers.find((a) => a.id === answerId)?.label ?? answerId;
const agentName = (id: AgentId) => agents.find((a) => a.id === id)!.name;

export function generateTemplateReport(scores: ScoreResult, answers: Answers) {
  const goal = label("primary_goal", answers.primary_goal[0]);
  const bottlenecks = answers.main_bottlenecks.map((id) => label("main_bottlenecks", id));
  const readiness = label("automation_readiness", answers.automation_readiness[0]);
  const recommendationContent = scores.topThree.map((id, index) => ({ rank: index + 1, agent: id, name: agentName(id), priority: ["Immediate Priority", "High Priority", "Supporting Priority"][index], why: `${agentName(id)} strongly matches the priorities and process gaps identified in your answers.` }));
  const full = { version: "template-v1", summary: `Your goal is to ${goal.toLowerCase()}. The clearest opportunities are ${bottlenecks.join(", ").toLowerCase()}, led by ${agentName(scores.topThree[0])}.`, recommendations: recommendationContent, sequence: scores.topThree.map(agentName).join(" → "), readiness: `Your current readiness is: ${readiness}. Document rules, approved messages, ownership, and handovers before implementation.`, nextPhase: scores.nextTwo.map((id, index) => ({ rank: index + 4, agent: id, name: agentName(id) })) };
  return { workforceSummary: full.summary, recommendationContent, workforceSequence: full.sequence, readinessNotes: full.readiness, nextPhaseContent: full.nextPhase, fullReportContent: full };
}

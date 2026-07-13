import { agents, type AgentId } from "./agents";
import { scoringMatrix } from "./scoring-matrix";
import type { Answers } from "./questions";

export type ScoreResult = { agentScores: Record<AgentId, number>; ranked: AgentId[]; topThree: AgentId[]; nextTwo: AgentId[]; tieBreakData: { rules: string[]; metrics: Record<AgentId, { strongHits: number; goalMatch: number; bottleneckMatch: number }> } };

export function scoreSubmission(answers: Answers): ScoreResult {
  const agentScores = Object.fromEntries(agents.map((a) => [a.id, 0])) as Record<AgentId, number>;
  const metrics = Object.fromEntries(agents.map((a) => [a.id, { strongHits: 0, goalMatch: 0, bottleneckMatch: 0 }])) as ScoreResult["tieBreakData"]["metrics"];
  for (const [questionId, selected] of Object.entries(answers)) {
    for (const answerId of selected) {
      for (const [agentId, delta] of Object.entries(scoringMatrix[questionId]?.[answerId] ?? {}) as [AgentId, number][]) {
        agentScores[agentId] += delta;
        if (delta === 3) metrics[agentId].strongHits += 1;
        if (questionId === "primary_goal") metrics[agentId].goalMatch += delta;
        if (questionId === "main_bottlenecks") metrics[agentId].bottleneckMatch += delta;
      }
    }
  }
  const ranked = agents.map((a) => a.id).sort((left, right) =>
    agentScores[right] - agentScores[left] || metrics[right].strongHits - metrics[left].strongHits || metrics[right].goalMatch - metrics[left].goalMatch || metrics[right].bottleneckMatch - metrics[left].bottleneckMatch || agents.find((a) => a.id === left)!.journeyOrder - agents.find((a) => a.id === right)!.journeyOrder,
  );
  return { agentScores, ranked, topThree: ranked.slice(0, 3), nextTwo: ranked.slice(3, 5), tieBreakData: { rules: ["score", "strong_hits", "primary_goal", "bottleneck", "journey_order"], metrics } };
}

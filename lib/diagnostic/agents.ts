export const agents = [
  { id: "enquiry_assistant", name: "AI Enquiry Assistant", journeyOrder: 0 },
  { id: "lead_qualification", name: "Lead Qualification Agent", journeyOrder: 1 },
  { id: "sales_follow_up", name: "Sales Follow-Up Agent", journeyOrder: 2 },
  { id: "appointment_coordinator", name: "Appointment Coordinator", journeyOrder: 3 },
  { id: "customer_support", name: "Customer Support Agent", journeyOrder: 4 },
  { id: "payment_follow_up", name: "Payment Follow-Up Assistant", journeyOrder: 5 },
  { id: "review_reactivation", name: "Review and Reactivation Agent", journeyOrder: 6 },
  { id: "operations_reporting", name: "Operations and Reporting Assistant", journeyOrder: 7 },
] as const;

export type AgentId = (typeof agents)[number]["id"];
export const agentIds = agents.map((agent) => agent.id);

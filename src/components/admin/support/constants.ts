import type { RequesterRole, SupportTicket, TicketPriority, TicketStatus } from "./types";

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "tkt_1",
    ticketCode: "SUP-4102",
    requesterName: "Emeka Okafor",
    requesterRole: "Teacher",
    subject: "Restore Offline CBT Session Pin for JSS 3 Mathematics",
    city: "Lagos",
    priority: "High",
    status: "pending",
    updatedAt: "14 mins ago",
  },
  {
    id: "tkt_2",
    ticketCode: "SUP-4098",
    requesterName: "Amina Bello",
    requesterRole: "Student",
    subject: "Request Exam Resumption After Power Cut in Lab B (SSS 2 Physics)",
    city: "Abuja",
    priority: "Normal",
    status: "in_progress",
    updatedAt: "1 hour ago",
  },
  {
    id: "tkt_3",
    ticketCode: "SUP-4085",
    requesterName: "Toluwalase Adeyemi",
    requesterRole: "Student",
    subject:
      "IndexedDB Script Sync Confirmation for Assessment #EXM-8710",
    city: "Lagos",
    priority: "Normal",
    status: "completed",
    updatedAt: "Yesterday",
  },
];

export const ROLE_OPTIONS: ReadonlyArray<{
  id: RequesterRole;
  label: string;
}> = [
  { id: "Student", label: "Student / Parent" },
  { id: "Teacher", label: "Teacher / Invigilator" },
] as const;

export const PRIORITY_OPTIONS: ReadonlyArray<{
  id: TicketPriority;
  label: string;
}> = [
  { id: "High", label: "High Priority" },
  { id: "Normal", label: "Normal SLA" },
] as const;

export const TICKET_STATUS_OPTIONS: ReadonlyArray<{
  id: TicketStatus;
  label: string;
}> = [
  { id: "pending", label: "Open / Pending" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Resolved" },
] as const;


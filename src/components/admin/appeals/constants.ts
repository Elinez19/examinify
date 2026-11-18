import type { DisputeItem, DisputeStatus } from "./types";

export const INITIAL_DISPUTES: DisputeItem[] = [
  {
    id: "dsp_1",
    caseCode: "APL-9041",
    bookingCode: "EXM-8821",
    clientName: "Chidinma Nwosu",
    artisanName: "Mr. Emeka Okafor",
    serviceTitle: "SS 3 Physics Paper 2 Theory Remark",
    escrowAmount: 28000,
    reason: "Candidate requested manual verification of Question 4 script calculation.",
    status: "disputed",
    createdAt: "Today, 11:20 AM",
  },
  {
    id: "dsp_2",
    caseCode: "APL-9038",
    bookingCode: "EXM-8794",
    clientName: "Ibrahim Danjuma",
    artisanName: "Mr. Musa Abdullahi",
    serviceTitle: "JSS 3 Mathematics First Term CBT",
    escrowAmount: 35000,
    reason: "Result paused pending exam resumption sync check after power outage.",
    status: "held",
    createdAt: "Yesterday, 4:15 PM",
  },
  {
    id: "dsp_3",
    caseCode: "APL-9019",
    bookingCode: "EXM-8710",
    clientName: "Toluwalase Adeyemi",
    artisanName: "Mrs. Segun Adebayo",
    serviceTitle: "SS 2 English Language Comprehension CBT",
    escrowAmount: 42000,
    reason: "Resolved after subject teacher reviewed student answer script.",
    status: "resolved",
    createdAt: "Nov 05, 2026",
  },
];

export const DISPUTE_STATUS_OPTIONS: ReadonlyArray<{
  id: DisputeStatus;
  label: string;
}> = [
  { id: "disputed", label: "Active Appeal" },
  { id: "held", label: "Score Held" },
  { id: "resolved", label: "Resolved & Finalized" },
] as const;


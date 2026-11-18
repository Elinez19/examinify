import type { RatingString, ReviewModerationStatus, ReviewRecord } from "./types";

export const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: "rev_1",
    clientName: "Amina Bello",
    artisanName: "Mr. Emeka Okafor",
    serviceTitle: "JSS 3 Mathematics First Term CBT",
    rating: 5,
    comment:
      "My exam resumed from question 18 right after our classroom power outage. Zero answers lost.",
    status: "verified",
    createdAt: "Today, 9:40 AM",
  },
  {
    id: "rev_2",
    clientName: "Tunde Bakare",
    artisanName: "Mrs. Chukwudi Eze",
    serviceTitle: "SS 3 Physics Paper 1 CBT",
    rating: 5,
    comment:
      "Instant result scripts and question-by-question breakdown made revision much easier for the whole class.",
    status: "verified",
    createdAt: "Yesterday",
  },
  {
    id: "rev_3",
    clientName: "Ngozi Okonkwo",
    artisanName: "Mr. Ibrahim Musa",
    serviceTitle: "Grade 6 Verbal Reasoning Mock",
    rating: 4,
    comment:
      "Browser lockdown kept the lab calm and focused throughout the 45-minute test.",
    status: "pending",
    createdAt: "Nov 06, 2026",
  },
];

export const RATING_OPTIONS: ReadonlyArray<{
  id: RatingString;
  label: string;
}> = [
  { id: "5", label: "5.0 ★ Excellent" },
  { id: "4", label: "4.0 ★ Very Good" },
  { id: "3", label: "3.0 ★ Good" },
  { id: "2", label: "2.0 ★ Fair" },
  { id: "1", label: "1.0 ★ Poor" },
] as const;

export const MODERATION_STATUS_OPTIONS: ReadonlyArray<{
  id: ReviewModerationStatus;
  label: string;
}> = [
  { id: "verified", label: "Verified & Published" },
  { id: "pending", label: "Pending Moderation" },
  { id: "rejected", label: "Flagged / Hidden" },
] as const;


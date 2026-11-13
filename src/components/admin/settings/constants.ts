import type { PolicyGroup, PolicySettingItem, PolicyStatus } from "./types";

export const INITIAL_POLICIES: PolicySettingItem[] = [
  {
    id: "pol_1",
    keyCode: "LICENSE_REVENUE_SPLIT",
    title: "School Partner License Split (School / Platform)",
    category: "financials",
    value: "90% / 10%",
    defaultValue: "90% / 10%",
    description:
      "Partner schools retain 90% of term CBT fee collection; 10% Examinify platform license fee.",
    status: "active",
    updatedAt: "Active policy",
  },
  {
    id: "pol_2",
    keyCode: "OFFLINE_AUTOSAVE_SECONDS",
    title: "Offline CBT Script Auto-Save Cadence",
    category: "dispatch",
    value: "15 sec",
    defaultValue: "15 sec",
    description:
      "Interval for local IndexedDB answer persistence and server sync across Primary, JSS & SSS labs.",
    status: "active",
    updatedAt: "Active policy",
  },
  {
    id: "pol_3",
    keyCode: "APPEAL_REVIEW_WINDOW",
    title: "Student Script Appeal & Re-mark Window",
    category: "governance",
    value: "48 Hours",
    defaultValue: "48 Hours",
    description:
      "Window after CBT result publication during which students can request script verification.",
    status: "active",
    updatedAt: "Active policy",
  },
  {
    id: "pol_4",
    keyCode: "MANDATORY_TEACHER_VERIFICATION",
    title: "Mandatory Teacher Credential & Subject Approval",
    category: "governance",
    value: "Required before exam publish",
    defaultValue: "Required before exam publish",
    description:
      "Requires verified staff ID and assigned subject clearance before publishing live CBT assessments.",
    status: "active",
    updatedAt: "Active policy",
  },
];

export const POLICY_CATEGORY_OPTIONS: ReadonlyArray<{
  id: PolicyGroup;
  label: string;
}> = [
  { id: "financials", label: "Billing & Licenses" },
  { id: "dispatch", label: "Exam Delivery & Sync" },
  { id: "governance", label: "Lockdown & Governance" },
] as const;

export const POLICY_STATUS_OPTIONS: ReadonlyArray<{
  id: PolicyStatus;
  label: string;
}> = [
  { id: "active", label: "Active Policy" },
  { id: "pending", label: "Paused / Draft" },
] as const;


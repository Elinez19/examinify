"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpenCheck, Clock, Play, ShieldCheck } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import {
  AdminSearchInput,
  AdminSelectField,
} from "@/components/admin/ui/admin-form-controls";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/ui/admin-data-table";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";

export function StudentExamsWorkspace() {
  const router = useRouter();
  const { store, activeSessionTerm } = usePortalStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  const myExams = store.exams.filter(
    (exam) =>
      exam.classLevel === store.student.classLevel ||
      exam.classLevel.startsWith(store.student.classLevel.split(" ")[0] ?? "")
  );

  const mySubmissions = store.submissions.filter(
    (sub) => sub.studentId === store.student.id
  );

  const q = searchQuery.trim().toLowerCase();
  const filteredExams = myExams.filter((exam) => {
    if (statusFilter !== "ALL" && exam.status !== statusFilter) return false;
    if (!q) return true;
    return (
      exam.title.toLowerCase().includes(q) ||
      exam.subjectCode.toLowerCase().includes(q) ||
      exam.subjectTitle.toLowerCase().includes(q)
    );
  });

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.student.termLabel;

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Examinations · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Live & Upcoming Exams."
        highlightWords={["Live", "Upcoming", "Exams."]}
        subtitle={`Launch active computer-based assessments for ${store.student.classLevel} and track upcoming exam windows.`}
        primaryCta={{
          label: "Results & Scripts",
          href: "/student/results",
          variant: "primary",
          trailingArrow: true,
        }}
        secondaryCta={{
          label: "Study Mode",
          href: "/student/study-mode",
          variant: "secondary",
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search examination title or subject..."
          />

          <AdminSelectField
            variant="filter"
            aria-label="Filter exam status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { id: "ALL", label: "All Assessments" },
              { id: "live", label: "Live CBTs" },
              { id: "scheduled", label: "Upcoming Schedule" },
              { id: "completed", label: "Completed" },
            ]}
          />
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Examination Timetable"
            subtitle="Enter live CBTs directly or check your upcoming examination schedule."
            badge={`${filteredExams.length} exams`}
          >
            {filteredExams.length === 0 ? (
              <AdminEmptyState
                title="No Examinations Found"
                description="No assessments match your current search or status filter."
                icon={<BookOpenCheck className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead>Examination</AdminTableHead>
                    <AdminTableHead>Subject</AdminTableHead>
                    <AdminTableHead>Schedule</AdminTableHead>
                    <AdminTableHead>Duration & Marks</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">Action</AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredExams.map((exam) => {
                    const submitted = mySubmissions.find(
                      (item) => item.examId === exam.id
                    );
                    return (
                      <AdminTableRow key={exam.id}>
                        <AdminTableCell>
                          <p className="font-display font-extrabold text-brand-950">
                            {exam.title}
                          </p>
                          <p className="text-[11px] font-medium text-ink-secondary">
                            {exam.questionIds.length} Questions
                            {exam.proctoringEnabled && (
                              <span className="ml-2 inline-flex items-center gap-1 font-bold text-accent-success">
                                <ShieldCheck className="h-3 w-3" />
                                Proctored
                              </span>
                            )}
                          </p>
                        </AdminTableCell>
                        <AdminTableCell>
                          <PillBadge
                            tone="sky"
                            className="px-2.5 py-0.5 text-[10px]"
                          >
                            {exam.subjectCode} · {exam.subjectTitle}
                          </PillBadge>
                        </AdminTableCell>
                        <AdminTableCell className="font-medium text-ink-secondary">
                          {exam.scheduledFor}
                        </AdminTableCell>
                        <AdminTableCell>
                          <span className="inline-flex items-center gap-1 font-bold text-brand-900">
                            <Clock className="h-3.5 w-3.5 text-brand-500" />
                            {exam.durationMinutes} mins · {exam.totalMarks}{" "}
                            marks
                          </span>
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminStatusPill
                            status={submitted ? "submitted" : exam.status}
                            variant={
                              submitted
                                ? "success"
                                : exam.status === "live"
                                  ? "active"
                                  : exam.status === "scheduled"
                                    ? "warning"
                                    : "neutral"
                            }
                          />
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                          {submitted ? (
                            <CtaButton
                              type="button"
                              variant="secondary"
                              size="xs"
                              onClick={() => router.push("/student/results")}
                            >
                              View Result
                            </CtaButton>
                          ) : exam.status === "live" ? (
                            <CtaButton
                              type="button"
                              variant="primary"
                              size="xs"
                              onClick={() => router.push(`/exam/${exam.id}`)}
                            >
                              <Play className="h-3 w-3" />
                              <span>Start CBT</span>
                            </CtaButton>
                          ) : (
                            <span className="text-xs font-bold text-ink-muted">
                              Not Yet Open
                            </span>
                          )}
                        </AdminTableCell>
                      </AdminTableRow>
                    );
                  })}
                </AdminTableBody>
              </AdminTable>
            )}
          </AdminDataTable>
        </div>
      </AdminWorkspaceSlab>
    </div>
  );
}

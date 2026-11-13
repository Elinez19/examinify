"use client";

import * as React from "react";
import { Award, BarChart3, CheckCircle2, Download, Users } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminKpiCard } from "@/components/admin/ui/admin-kpi-card";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import {
  AdminDataTable,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/ui/admin-data-table";
import { useAdminToast } from "@/components/admin/ui/admin-toast";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";

export function TeacherAnalyticsWorkspace() {
  const { store } = usePortalStore();
  const toast = useAdminToast();
  const [examFilter, setExamFilter] = React.useState("all");

  const filteredSubs = React.useMemo(
    () =>
      examFilter === "all"
        ? store.submissions
        : store.submissions.filter((s) => s.examId === examFilter),
    [store.submissions, examFilter]
  );

  const avgPct =
    filteredSubs.length > 0
      ? Math.round(
          filteredSubs.reduce((sum, s) => sum + s.percentage, 0) /
            filteredSubs.length
        )
      : 0;
  const passCount = filteredSubs.filter((s) => s.percentage >= 50).length;
  const passRate =
    filteredSubs.length > 0
      ? Math.round((passCount / filteredSubs.length) * 100)
      : 0;

  const handleExportCsv = () => {
    const header = [
      "Student Name",
      "Reg No",
      "Class",
      "Exam",
      "Objective",
      "Theory",
      "Total",
      "Percentage",
      "Grade",
      "Status",
    ];
    const rows = filteredSubs.map((s) => [
      s.studentName,
      s.studentRegNo,
      s.classLevel,
      s.examTitle,
      `${s.objectiveScore}/${s.objectiveMax}`,
      `${s.theoryScore}/${s.theoryMax}`,
      `${s.totalScore}/${s.totalMax}`,
      `${s.percentage}%`,
      s.grade,
      s.gradingStatus,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "examinify-class-broadsheet.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Broadsheet Exported", "Downloaded CSV broadsheet file.");
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow="Class Broadsheets & Item Analysis"
        eyebrowIcon="shield"
        headline="Results Analytics & CSV Broadsheets."
        highlightWords={["Analytics", "Broadsheets."]}
        subtitle="Inspect class score distributions, compare objective vs. theory performance, and export formatted CSV broadsheets."
        primaryCta={{
          label: "Export CSV Broadsheet",
          onClick: handleExportCsv,
          variant: "primary",
          icon: <Download className="h-3.5 w-3.5" />,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            aria-label="Filter broadsheet by exam"
            className="h-10 rounded-pill border-2 border-brand-200 bg-surface-porcelain px-4 font-display text-xs font-extrabold text-brand-950 shadow-gloss-card cursor-pointer"
          >
            <option value="all">All Submitted Exams</option>
            {store.exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title}
              </option>
            ))}
          </select>

          <PillBadge tone="sky" className="px-3 py-1 text-xs">
            {filteredSubs.length} Script Records
          </PillBadge>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          <AdminKpiCard
            label="Mean Score"
            value={`${avgPct}%`}
            numericValue={avgPct}
            suffix="%"
            badgeText="Across Filtered Scripts"
            badgeTone="blue"
            tone="ink"
            icon={<BarChart3 className="h-4 w-4 text-accent-gold" />}
          />
          <AdminKpiCard
            label="Pass Rate (≥ 50%)"
            value={`${passRate}%`}
            numericValue={passRate}
            suffix="%"
            badgeText={`${passCount} of ${filteredSubs.length} Passed`}
            badgeTone="sky"
            icon={<CheckCircle2 className="h-4 w-4 text-accent-success" />}
          />
          <AdminKpiCard
            label="Scripts Analyzed"
            value={String(filteredSubs.length)}
            numericValue={filteredSubs.length}
            badgeText="Broadsheet Ready"
            badgeTone="porcelain"
            icon={<Users className="h-4 w-4 text-brand-600" />}
          />
        </div>

        <div className="mt-6">
          <AdminDataTable
            title="Student Score Broadsheet"
            subtitle="Live aggregate of auto-scored objective and graded theory marks."
            badge={`${filteredSubs.length} Rows`}
          >
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead>Candidate</AdminTableHead>
                  <AdminTableHead>Exam</AdminTableHead>
                  <AdminTableHead>Objective</AdminTableHead>
                  <AdminTableHead>Theory</AdminTableHead>
                  <AdminTableHead>Total</AdminTableHead>
                  <AdminTableHead>Grade</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {filteredSubs.map((s) => (
                  <AdminTableRow key={s.id}>
                    <AdminTableCell>
                      <p className="font-display text-xs sm:text-sm font-extrabold text-brand-950">
                        {s.studentName}
                      </p>
                      <p className="font-mono text-[11px] text-ink-secondary">
                        {s.studentRegNo} · {s.classLevel}
                      </p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <span className="text-xs font-bold text-brand-950">
                        {s.examTitle}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell>
                      <span className="font-mono text-xs font-bold text-brand-700">
                        {s.objectiveScore}/{s.objectiveMax}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell>
                      <span className="font-mono text-xs font-bold text-ink-secondary">
                        {s.theoryMax === 0
                          ? "—"
                          : `${s.theoryScore}/${s.theoryMax}`}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell>
                      <span className="font-display text-sm font-extrabold text-brand-950">
                        {s.percentage}%
                      </span>
                    </AdminTableCell>
                    <AdminTableCell>
                      <PillBadge tone="blue" className="px-2 py-0.5 text-[10px]">
                        <Award className="h-3 w-3 inline mr-1" />
                        {s.grade}
                      </PillBadge>
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminStatusPill
                        status={
                          s.gradingStatus === "pending_theory"
                            ? "pending"
                            : "completed"
                        }
                      />
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
          </AdminDataTable>
        </div>
      </AdminWorkspaceSlab>
    </div>
  );
}


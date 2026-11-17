"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Download, Edit3 } from "lucide-react";
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
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { usePortalStore } from "@/hooks/portal/use-portal-store";

export function TeacherAnalyticsWorkspace() {
  const router = useRouter();
  const { store, activeSessionTerm } = usePortalStore();

  const [broadsheetSubject, setBroadsheetSubject] = React.useState("ALL");
  const [broadsheetSearch, setBroadsheetSearch] = React.useState("");

  const handleExportCsv = () => {
    const rows = [
      [
        "Candidate",
        "Admission No",
        "Assessment",
        "Subject",
        "Earned",
        "Total",
        "Status",
      ],
      ...store.submissions.map((sub) => [
        sub.studentName,
        sub.admissionNo,
        sub.examTitle,
        sub.subjectCode,
        String(sub.objectiveEarned + sub.theoryEarned),
        String(sub.objectiveTotal + sub.theoryTotal),
        sub.gradingStatus,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "examinify-broadsheet.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredBroadsheet = React.useMemo(() => {
    const q = broadsheetSearch.trim().toLowerCase();
    return store.submissions.filter((sub) => {
      if (broadsheetSubject !== "ALL" && sub.subjectCode !== broadsheetSubject)
        return false;
      if (!q) return true;
      return (
        sub.studentName.toLowerCase().includes(q) ||
        sub.examTitle.toLowerCase().includes(q) ||
        sub.admissionNo.toLowerCase().includes(q)
      );
    });
  }, [broadsheetSearch, broadsheetSubject, store.submissions]);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Examinations · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Result Broadsheets."
        highlightWords={["Result", "Broadsheets."]}
        subtitle="Review consolidated objective and theory marks across all candidates and export CSV broadsheets."
        primaryCta={{
          label: "Export CSV",
          onClick: handleExportCsv,
          variant: "primary",
          icon: <Download className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Theory Grading",
          href: "/teacher/grading",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <AdminSearchInput
              value={broadsheetSearch}
              onChange={setBroadsheetSearch}
              placeholder="Filter student, admission no, or exam..."
            />

            <AdminSelectField
              variant="filter"
              aria-label="Filter by subject"
              value={broadsheetSubject}
              onChange={setBroadsheetSubject}
              options={[
                { id: "ALL", label: "All Subjects" },
                ...store.subjects.map((sub) => ({
                  id: sub.code,
                  label: `${sub.code} · ${sub.title}`,
                })),
              ]}
            />
          </div>

          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={handleExportCsv}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Consolidated Result Broadsheet"
            subtitle="Objective + theory scores across submitted examination scripts."
            badge={`${filteredBroadsheet.length} records`}
          >
            {filteredBroadsheet.length === 0 ? (
              <AdminEmptyState
                title="No Broadsheet Records"
                description="No submitted scripts matched your subject or search filter."
                icon={<BarChart3 className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead>Candidate</AdminTableHead>
                    <AdminTableHead>Assessment</AdminTableHead>
                    <AdminTableHead>Total Score</AdminTableHead>
                    <AdminTableHead>Percent</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredBroadsheet.map((sub) => {
                    const earned = sub.objectiveEarned + sub.theoryEarned;
                    const total = sub.objectiveTotal + sub.theoryTotal;
                    const pct =
                      total > 0 ? Math.round((earned / total) * 100) : 0;
                    return (
                      <AdminTableRow key={sub.id}>
                        <AdminTableCell>
                          <p className="font-display font-extrabold text-brand-950">
                            {sub.studentName}
                          </p>
                          <p className="font-mono text-[11px] text-ink-secondary">
                            {sub.admissionNo}
                          </p>
                        </AdminTableCell>
                        <AdminTableCell className="font-bold text-brand-900">
                          {sub.examTitle}
                        </AdminTableCell>
                        <AdminTableCell className="font-extrabold text-brand-950">
                          {earned} / {total}
                        </AdminTableCell>
                        <AdminTableCell className="font-display font-extrabold text-accent-success">
                          {pct}%
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminStatusPill
                            status={
                              sub.gradingStatus === "published"
                                ? "Published"
                                : "Pending"
                            }
                            variant={
                              sub.gradingStatus === "published"
                                ? "success"
                                : "warning"
                            }
                          />
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                          <AdminActionMenu
                            ariaLabel={`Broadsheet action for ${sub.studentName}`}
                            items={[
                              {
                                id: "open-grade",
                                label: "Review / Adjust Marks",
                                icon: <Edit3 className="h-3.5 w-3.5" />,
                                variant: "primary",
                                onClick: () =>
                                  router.push(
                                    `/teacher/grading?scriptId=${encodeURIComponent(sub.id)}`
                                  ),
                              },
                            ]}
                          />
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

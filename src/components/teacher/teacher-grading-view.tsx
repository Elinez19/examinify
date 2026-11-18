"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Award, FileCheck2 } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import {
  AdminSearchInput,
  AdminSelectField,
} from "@/components/admin/ui/admin-form-controls";
import {
  AdminCheckbox,
  AdminDataTable,
  AdminEmptyState,
  AdminSortableTableHead,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  type SortDirection,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { useTableSelection } from "@/hooks/portal/use-table-selection";
import type { ExamSubmission, TheoryScoreEntry } from "@/data/portal-mock-data";
import { ScriptGradingForm } from "./script-grading-form";

type GradingSortKey =
  | "studentName"
  | "examTitle"
  | "objectiveEarned"
  | "gradingStatus";

function TeacherGradingInner() {
  const { store, activeSessionTerm, gradeSubmission } = usePortalStore();
  const searchParams = useSearchParams();
  const requestedScriptId = searchParams.get("scriptId");

  const [gradingSearch, setGradingSearch] = React.useState("");
  const [gradingStatusFilter, setGradingStatusFilter] = React.useState("ALL");
  const [gradingSortKey, setGradingSortKey] =
    React.useState<GradingSortKey>("gradingStatus");
  const [gradingSortDir, setGradingSortDir] =
    React.useState<SortDirection>("asc");

  const initialSub = requestedScriptId
    ? store.submissions.find((s) => s.id === requestedScriptId) ?? null
    : null;

  const buildInitialTheory = (sub: ExamSubmission | null) => {
    const initialScores: Record<string, TheoryScoreEntry> = {};
    if (!sub) return initialScores;
    const exam = store.exams.find((e) => e.id === sub.examId);
    const theoryQuestions = store.questions.filter(
      (q) =>
        (q.type === "theory" || q.type === "essay") &&
        (exam?.questionIds.includes(q.id) ?? false)
    );
    for (const q of theoryQuestions) {
      initialScores[q.id] =
        (sub.theoryScores ?? sub.theoryScoresByQuestion)?.[q.id] ?? {
          score: 0,
          maxScore: q.marks,
          comment: "",
        };
    }
    return initialScores;
  };

  const [gradingTarget, setGradingTarget] =
    React.useState<ExamSubmission | null>(initialSub);
  const [theoryInputs, setTheoryInputs] = React.useState<
    Record<string, TheoryScoreEntry>
  >(() => buildInitialTheory(initialSub));
  const [overallFeedback, setOverallFeedback] = React.useState(
    () => initialSub?.overallFeedback ?? ""
  );
  const [feedbackDialog, setFeedbackDialog] = React.useState<{
    title: string;
    description: string;
  } | null>(null);

  const gradingFormRef = React.useRef<HTMLDivElement | null>(null);

  const toggleGradingSort = (key: GradingSortKey) => {
    if (gradingSortKey === key)
      setGradingSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setGradingSortKey(key);
      setGradingSortDir("asc");
    }
  };

  const openGradingForm = (sub: ExamSubmission) => {
    setTheoryInputs(buildInitialTheory(sub));
    setOverallFeedback(sub.overallFeedback ?? "");
    setGradingTarget(sub);
    window.requestAnimationFrame(() => {
      gradingFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleSaveGrading = (event: React.FormEvent) => {
    event.preventDefault();
    if (!gradingTarget) return;
    const studentName = gradingTarget.studentName;
    const examTitle = gradingTarget.examTitle;
    gradeSubmission(gradingTarget.id, theoryInputs, overallFeedback.trim(), true);
    setGradingTarget(null);
    setFeedbackDialog({
      title: "Result Published",
      description: `Theory scores and feedback for ${studentName} (${examTitle}) have been saved and published.`,
    });
  };

  const filteredGrading = React.useMemo(() => {
    const q = gradingSearch.trim().toLowerCase();
    const list = store.submissions.filter((sub) => {
      if (
        gradingStatusFilter !== "ALL" &&
        sub.gradingStatus !== gradingStatusFilter
      )
        return false;
      if (!q) return true;
      return (
        (sub.studentName ?? "").toLowerCase().includes(q) ||
        (sub.examTitle ?? "").toLowerCase().includes(q) ||
        (sub.admissionNo ?? "").toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (gradingSortKey === "studentName")
        cmp = (a.studentName ?? "").localeCompare(b.studentName ?? "");
      else if (gradingSortKey === "examTitle")
        cmp = (a.examTitle ?? "").localeCompare(b.examTitle ?? "");
      else if (gradingSortKey === "objectiveEarned")
        cmp = (a.objectiveEarned ?? 0) - (b.objectiveEarned ?? 0);
      else if (gradingSortKey === "gradingStatus")
        cmp = (a.gradingStatus ?? "").localeCompare(b.gradingStatus ?? "");
      return gradingSortDir === "asc" ? cmp : -cmp;
    });
  }, [
    gradingSearch,
    gradingSortDir,
    gradingSortKey,
    gradingStatusFilter,
    store.submissions,
  ]);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  const selection = useTableSelection(filteredGrading.map((sub) => sub.id));

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Examinations · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Theory Grading Queue."
        highlightWords={["Theory", "Grading"]}
        subtitle="Score subjective candidate answers and publish official results using the single inline grading form below."
        primaryCta={{
          label: "View Broadsheets",
          href: "/teacher/analytics",
          variant: "primary",
          trailingArrow: true,
        }}
        secondaryCta={{
          label: "Create Exam",
          href: "/teacher/exams/create",
          variant: "secondary",
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <ScriptGradingForm
          formRef={gradingFormRef}
          target={gradingTarget}
          onClose={() => setGradingTarget(null)}
          questions={store.questions}
          theoryInputs={theoryInputs}
          setTheoryInputs={setTheoryInputs}
          overallFeedback={overallFeedback}
          setOverallFeedback={setOverallFeedback}
          onSubmit={handleSaveGrading}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={gradingSearch}
            onChange={setGradingSearch}
            placeholder="Search student or assessment..."
          />

          <AdminSelectField
            variant="filter"
            aria-label="Filter grading status"
            value={gradingStatusFilter}
            onChange={setGradingStatusFilter}
            options={[
              { id: "ALL", label: "All Scripts" },
              { id: "needs_theory_review", label: "Needs Theory Review" },
              { id: "published", label: "Published" },
            ]}
          />
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Submitted Candidate Scripts"
            subtitle="Select a script from the action menu to score theory sections and publish marks."
            badge={`${filteredGrading.length} scripts`}
            selectedCount={selection.selectedCount}
            bulkActions={
              <button
                type="button"
                onClick={selection.clearSelection}
                className="text-xs font-bold text-ink-secondary hover:text-brand-900 transition-colors px-1 cursor-pointer"
              >
                Clear
              </button>
            }
          >
            {filteredGrading.length === 0 ? (
              <AdminEmptyState
                title="No Scripts in Queue"
                description="No submitted scripts matched your search or grading status filter."
                icon={<FileCheck2 className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead className="w-10">
                      <AdminCheckbox
                        aria-label="Select all submitted scripts"
                        checked={selection.allSelected}
                        indeterminate={selection.someSelected}
                        onChange={(e) => selection.toggleAll(e.target.checked)}
                      />
                    </AdminTableHead>
                    <AdminSortableTableHead
                      label="Candidate"
                      sortKey="studentName"
                      activeSortKey={gradingSortKey}
                      sortDirection={gradingSortDir}
                      onSort={toggleGradingSort}
                    />
                    <AdminSortableTableHead
                      label="Assessment"
                      sortKey="examTitle"
                      activeSortKey={gradingSortKey}
                      sortDirection={gradingSortDir}
                      onSort={toggleGradingSort}
                    />
                    <AdminSortableTableHead
                      label="Objective"
                      sortKey="objectiveEarned"
                      activeSortKey={gradingSortKey}
                      sortDirection={gradingSortDir}
                      onSort={toggleGradingSort}
                    />
                    <AdminTableHead>Theory Score</AdminTableHead>
                    <AdminSortableTableHead
                      label="Status"
                      sortKey="gradingStatus"
                      activeSortKey={gradingSortKey}
                      sortDirection={gradingSortDir}
                      onSort={toggleGradingSort}
                    />
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredGrading.map((sub) => (
                    <AdminTableRow
                      key={sub.id}
                      isSelected={selection.isSelected(sub.id)}
                    >
                      <AdminTableCell className="w-10">
                        <AdminCheckbox
                          aria-label={`Select ${sub.studentName}`}
                          checked={selection.isSelected(sub.id)}
                          onChange={() => selection.toggleOne(sub.id)}
                        />
                      </AdminTableCell>
                      <AdminTableCell>
                        <p className="font-display font-extrabold text-brand-950">
                          {sub.studentName}
                        </p>
                        <p className="font-mono text-[11px] font-medium text-ink-secondary">
                          {sub.admissionNo}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell>
                        <p className="font-bold text-brand-900">
                          {sub.examTitle}
                        </p>
                        <p className="text-[11px] text-ink-secondary">
                          {sub.submittedAt}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell className="font-bold">
                        {sub.objectiveEarned} / {sub.objectiveTotal}
                      </AdminTableCell>
                      <AdminTableCell className="font-bold">
                        {sub.theoryEarned} / {sub.theoryTotal}
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
                          ariaLabel={`Grade ${sub.studentName}`}
                          items={[
                            {
                              id: "grade",
                              label: "Grade & Publish Script",
                              icon: <Award className="h-3.5 w-3.5" />,
                              variant: "primary",
                              onClick: () => openGradingForm(sub),
                            },
                          ]}
                        />
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            )}
          </AdminDataTable>
        </div>
      </AdminWorkspaceSlab>

      <AdminDialogModal
        open={Boolean(feedbackDialog)}
        onOpenChange={(open) => {
          if (!open) setFeedbackDialog(null);
        }}
        variant="success"
        eyebrow="Published"
        title={feedbackDialog?.title ?? ""}
        description={feedbackDialog?.description}
        cancelLabel="Done"
      />
    </div>
  );
}

export function TeacherGradingWorkspace() {
  return (
    <React.Suspense fallback={null}>
      <TeacherGradingInner />
    </React.Suspense>
  );
}

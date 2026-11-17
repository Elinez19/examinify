"use client";

import * as React from "react";
import { ClipboardCheck, Edit3, Play, Plus, Trash2 } from "lucide-react";
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
import { CtaButton } from "@/components/landing/ui/cta-button";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { PortalExam } from "@/data/portal-mock-data";
import {
  TeacherExamBuilderForm,
  type TeacherExamFormState,
} from "./teacher-exam-builder-form";

type ExamSortKey =
  | "title"
  | "subjectCode"
  | "classLevel"
  | "durationMinutes"
  | "status";

export function TeacherExamsWorkspace() {
  const {
    store,
    activeSessionTerm,
    saveExam,
    updateExamStatus,
    deleteExam,
  } = usePortalStore();

  const [examSearch, setExamSearch] = React.useState("");
  const [examStatusFilter, setExamStatusFilter] = React.useState("ALL");
  const [examSortKey, setExamSortKey] = React.useState<ExamSortKey>("title");
  const [examSortDir, setExamSortDir] = React.useState<SortDirection>("asc");
  const [examFormOpen, setExamFormOpen] = React.useState(false);
  const [deleteExamTarget, setDeleteExamTarget] =
    React.useState<PortalExam | null>(null);
  const [feedbackDialog, setFeedbackDialog] = React.useState<{
    variant: "success" | "danger";
    title: string;
    description: string;
  } | null>(null);

  const examFormRef = React.useRef<HTMLDivElement | null>(null);

  const [examForm, setExamForm] = React.useState<TeacherExamFormState>({
    id: "",
    title: "",
    subjectCode: store.subjects[0]?.code ?? "MTH-301",
    classLevel: store.classArms[0]?.name ?? "JSS 3A",
    scheduledFor: "Fri, Nov 20 · 09:00 AM",
    durationMinutes: 40,
    status: "scheduled",
    instructions: "Answer all questions before submitting.",
    questionIds: [],
  });

  const toggleExamSort = (key: ExamSortKey) => {
    if (examSortKey === key) setExamSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setExamSortKey(key);
      setExamSortDir("asc");
    }
  };

  const scrollToForm = () => {
    window.requestAnimationFrame(() => {
      examFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openCreateExamForm = () => {
    const defaultSubject = store.subjects[0]?.code ?? "MTH-301";
    const defaultQuestionIds = store.questions
      .filter((q) => q.subjectCode === defaultSubject)
      .map((q) => q.id);
    setExamForm({
      id: "",
      title: "",
      subjectCode: defaultSubject,
      classLevel: store.classArms[0]?.name ?? "JSS 3A",
      scheduledFor: "Mon, Nov 23 · 10:00 AM",
      durationMinutes: 40,
      status: "scheduled",
      instructions: "Read all instructions carefully before beginning.",
      questionIds: defaultQuestionIds,
    });
    setExamFormOpen(true);
    scrollToForm();
  };

  const openEditExamForm = (exam: PortalExam) => {
    setExamForm({
      id: exam.id,
      title: exam.title,
      subjectCode: exam.subjectCode,
      classLevel: exam.classLevel,
      scheduledFor: exam.scheduledFor,
      durationMinutes: exam.durationMinutes,
      status: exam.status,
      instructions: Array.isArray(exam.instructions)
        ? exam.instructions.join("\n")
        : String(exam.instructions || ""),
      questionIds: exam.questionIds,
    });
    setExamFormOpen(true);
    scrollToForm();
  };

  const handleSaveExam = (event: React.FormEvent) => {
    event.preventDefault();
    if (!examForm.title.trim()) {
      setFeedbackDialog({
        variant: "danger",
        title: "Missing Exam Title",
        description: "Please enter an examination title before saving.",
      });
      return;
    }
    const isUpdate = Boolean(examForm.id);
    const title = examForm.title.trim();
    const subject = store.subjects.find((s) => s.code === examForm.subjectCode);
    const chosenQuestions = store.questions.filter((q) =>
      examForm.questionIds.includes(q.id)
    );
    const totalMarks = chosenQuestions.reduce((sum, q) => sum + q.marks, 0) || 10;

    saveExam({
      id: examForm.id || `exam_${Date.now()}`,
      title,
      subjectCode: examForm.subjectCode,
      subjectTitle: subject?.title ?? examForm.subjectCode,
      classLevel: examForm.classLevel,
      term: activeSessionTerm?.term ?? "First Term",
      teacherName: store.teacher.name,
      scheduledFor: examForm.scheduledFor.trim() || "Scheduled",
      durationMinutes: Number(examForm.durationMinutes) || 30,
      totalMarks,
      status: examForm.status,
      roomCode: `EXM-${examForm.subjectCode}`,
      proctoringEnabled: true,
      instructions: examForm.instructions
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      questionIds: examForm.questionIds,
    });
    setExamFormOpen(false);
    setFeedbackDialog({
      variant: "success",
      title: isUpdate ? "Assessment Updated" : "Assessment Created",
      description: `${title} (${examForm.classLevel}) has been saved to the examination registry.`,
    });
  };

  const filteredExams = React.useMemo(() => {
    const q = examSearch.trim().toLowerCase();
    const list = store.exams.filter((exam) => {
      if (examStatusFilter !== "ALL" && exam.status !== examStatusFilter)
        return false;
      if (!q) return true;
      return (
        exam.title.toLowerCase().includes(q) ||
        exam.subjectCode.toLowerCase().includes(q) ||
        exam.classLevel.toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (examSortKey === "title") cmp = (a.title ?? "").localeCompare(b.title ?? "");
      else if (examSortKey === "subjectCode")
        cmp = (a.subjectCode ?? "").localeCompare(b.subjectCode ?? "");
      else if (examSortKey === "classLevel")
        cmp = (a.classLevel ?? "").localeCompare(b.classLevel ?? "");
      else if (examSortKey === "durationMinutes")
        cmp = (a.durationMinutes ?? 0) - (b.durationMinutes ?? 0);
      else if (examSortKey === "status")
        cmp = (a.status ?? "").localeCompare(b.status ?? "");
      return examSortDir === "asc" ? cmp : -cmp;
    });
  }, [examSearch, examSortDir, examSortKey, examStatusFilter, store.exams]);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Examinations · ${termLabel}`}
        eyebrowIcon="dot"
        headline="CBT Assessments."
        highlightWords={["Assessments."]}
        subtitle="Create, schedule, and launch computer-based assessments using the single inline builder form below."
        primaryCta={{
          label: "Create Exam",
          onClick: openCreateExamForm,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Live Monitor",
          href: "/teacher/live-monitor",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <TeacherExamBuilderForm
          formRef={examFormRef}
          open={examFormOpen}
          onOpenChange={setExamFormOpen}
          formState={examForm}
          setFormState={setExamForm}
          subjects={store.subjects}
          classArms={store.classArms}
          questions={store.questions}
          onReset={openCreateExamForm}
          onSubmit={handleSaveExam}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <AdminSearchInput
              value={examSearch}
              onChange={setExamSearch}
              placeholder="Search title, subject, or class..."
            />

            <AdminSelectField
              variant="filter"
              aria-label="Filter by exam status"
              value={examStatusFilter}
              onChange={setExamStatusFilter}
              options={[
                { id: "ALL", label: "All Statuses" },
                { id: "live", label: "Live" },
                { id: "scheduled", label: "Scheduled" },
                { id: "completed", label: "Completed" },
                { id: "draft", label: "Draft" },
              ]}
            />
          </div>

          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={openCreateExamForm}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Exam</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Assessments Registry"
            subtitle="Sortable, filterable CBT assessments with contextual actions."
            badge={`${filteredExams.length} exams`}
          >
            {filteredExams.length === 0 ? (
              <AdminEmptyState
                title="No Assessments Found"
                description="Create a new CBT assessment or clear your search/status filters."
                icon={<ClipboardCheck className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminSortableTableHead
                      label="Assessment"
                      sortKey="title"
                      activeSortKey={examSortKey}
                      sortDirection={examSortDir}
                      onSort={toggleExamSort}
                    />
                    <AdminSortableTableHead
                      label="Subject"
                      sortKey="subjectCode"
                      activeSortKey={examSortKey}
                      sortDirection={examSortDir}
                      onSort={toggleExamSort}
                    />
                    <AdminSortableTableHead
                      label="Class Arm"
                      sortKey="classLevel"
                      activeSortKey={examSortKey}
                      sortDirection={examSortDir}
                      onSort={toggleExamSort}
                    />
                    <AdminSortableTableHead
                      label="Duration"
                      sortKey="durationMinutes"
                      activeSortKey={examSortKey}
                      sortDirection={examSortDir}
                      onSort={toggleExamSort}
                    />
                    <AdminTableHead>Access PIN</AdminTableHead>
                    <AdminSortableTableHead
                      label="Status"
                      sortKey="status"
                      activeSortKey={examSortKey}
                      sortDirection={examSortDir}
                      onSort={toggleExamSort}
                    />
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredExams.map((exam) => (
                    <AdminTableRow key={exam.id}>
                      <AdminTableCell>
                        <p className="font-display font-extrabold text-brand-950">
                          {exam.title}
                        </p>
                        <p className="text-[11px] font-medium text-ink-secondary">
                          {exam.scheduledFor} · {exam.questionIds.length} items
                        </p>
                      </AdminTableCell>
                      <AdminTableCell className="font-mono font-bold text-brand-800">
                        {exam.subjectCode}
                      </AdminTableCell>
                      <AdminTableCell className="font-bold text-brand-900">
                        {exam.classLevel}
                      </AdminTableCell>
                      <AdminTableCell className="font-semibold">
                        {exam.durationMinutes} mins
                      </AdminTableCell>
                      <AdminTableCell className="font-mono font-extrabold text-brand-950">
                        {exam.passCode || "—"}
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={exam.status}
                          variant={
                            exam.status === "live"
                              ? "success"
                              : exam.status === "scheduled"
                                ? "warning"
                                : "neutral"
                          }
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${exam.title}`}
                          items={[
                            {
                              id: "edit",
                              label: "Edit Exam Details",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditExamForm(exam),
                            },
                            {
                              id: "toggle-live",
                              label:
                                exam.status === "live"
                                  ? "Mark Completed"
                                  : "Launch Live Session",
                              icon: <Play className="h-3.5 w-3.5" />,
                              variant: "primary",
                              onClick: () =>
                                updateExamStatus(
                                  exam.id,
                                  exam.status === "live" ? "completed" : "live"
                                ),
                            },
                            {
                              id: "delete",
                              label: "Delete Exam",
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              onClick: () => setDeleteExamTarget(exam),
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
        open={Boolean(deleteExamTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteExamTarget(null);
        }}
        variant="danger"
        title="Delete Examination?"
        description={
          deleteExamTarget
            ? `Permanently remove "${deleteExamTarget.title}" from the portal.`
            : undefined
        }
        confirmLabel="Delete Exam"
        onConfirm={() => {
          if (deleteExamTarget) {
            deleteExam(deleteExamTarget.id);
            setDeleteExamTarget(null);
          }
        }}
      />

      <AdminDialogModal
        open={Boolean(feedbackDialog)}
        onOpenChange={(open) => {
          if (!open) setFeedbackDialog(null);
        }}
        variant={feedbackDialog?.variant === "danger" ? "warning" : "success"}
        eyebrow={feedbackDialog?.variant === "danger" ? "Validation" : "Saved"}
        title={feedbackDialog?.title ?? ""}
        description={feedbackDialog?.description}
        cancelLabel="Done"
      />
    </div>
  );
}

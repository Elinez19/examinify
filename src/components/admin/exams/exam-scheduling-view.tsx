"use client";

import * as React from "react";
import {
  CalendarCheck,
  Edit3,
  KeyRound,
  Play,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
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
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import {
  AdminDialogModal,
  type ModalVariant,
} from "@/components/admin/ui/admin-dialog-modal";
import { CtaButton } from "@/components/landing/ui/cta-button";
import {
  generateExamPassCode,
  usePortalStore,
} from "@/hooks/portal/use-portal-store";
import { useTableSelection } from "@/hooks/portal/use-table-selection";
import type { PortalExam } from "@/data/portal-mock-data";
import {
  ExamScheduleForm,
  type ExamScheduleFormState,
} from "./exam-schedule-form";
import { ExamPasscodeModal } from "./exam-passcode-modal";

export function ExamSchedulingWorkspace() {
  const {
    store,
    activeSessionTerm,
    saveExam,
    updateExamStatus,
    rotateExamPassCode,
    toggleExamProctoring,
    deleteExam,
  } = usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  const examFormRef = React.useRef<HTMLDivElement | null>(null);
  const [examFormOpen, setExamFormOpen] = React.useState(false);
  const [examForm, setExamForm] = React.useState<ExamScheduleFormState>({
    id: "",
    title: "",
    subjectCode: store.subjects[0]?.code ?? "MTH-301",
    classLevel: store.classArms[0]?.name ?? "JSS 3 Superstars",
    scheduledFor: "Tue, Nov 24 · 09:00 AM",
    durationMinutes: 45,
    passCode: "",
    status: "scheduled",
    proctoringEnabled: true,
    instructions: "Keep your CBT tab focused. Offline sync is active.",
  });

  // Passcode PIN Modal
  const [pinTarget, setPinTarget] = React.useState<PortalExam | null>(null);
  const [pinDraft, setPinDraft] = React.useState("");

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<PortalExam | null>(
    null
  );

  const scrollToForm = () => {
    setTimeout(() => {
      examFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  const resetExamForm = () => {
    setExamForm({
      id: "",
      title: "",
      subjectCode: store.subjects[0]?.code ?? "MTH-301",
      classLevel: store.classArms[0]?.name ?? "JSS 3 Superstars",
      scheduledFor: "Tue, Nov 24 · 09:00 AM",
      durationMinutes: 45,
      passCode: generateExamPassCode(),
      status: "scheduled",
      proctoringEnabled: true,
      instructions: "Keep your CBT tab focused. Offline sync is active.",
    });
  };

  const openCreateForm = () => {
    resetExamForm();
    setExamFormOpen(true);
    scrollToForm();
  };

  const openEditForm = (exam: PortalExam) => {
    setExamForm({
      id: exam.id,
      title: exam.title,
      subjectCode: exam.subjectCode,
      classLevel: exam.classLevel,
      scheduledFor: exam.scheduledFor,
      durationMinutes: exam.durationMinutes,
      passCode: exam.passCode || generateExamPassCode(),
      status: exam.status,
      proctoringEnabled: exam.proctoringEnabled ?? true,
      instructions: Array.isArray(exam.instructions)
        ? exam.instructions.join("\n")
        : String(exam.instructions || ""),
    });
    setExamFormOpen(true);
    scrollToForm();
  };

  const handleSaveExam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!examForm.title.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Examination Title Required",
        description: "Please provide a clear title for the examination schedule.",
      });
      return;
    }

    const sub = store.subjects.find((s) => s.code === examForm.subjectCode);
    const existing = store.exams.find((item) => item.id === examForm.id);
    const qIds = existing?.questionIds.length
      ? existing.questionIds
      : store.questions
          .filter((q) => q.subjectCode === examForm.subjectCode)
          .map((q) => q.id);

    const savedTitle = examForm.title.trim();
    const wasEditing = Boolean(examForm.id);

    saveExam({
      id: examForm.id || `exam_${Date.now()}`,
      title: savedTitle,
      subjectCode: examForm.subjectCode,
      subjectTitle: sub?.title ?? examForm.subjectCode,
      classLevel: examForm.classLevel,
      term: activeSessionTerm?.term ?? "First Term",
      teacherName: sub?.teacherName ?? "Faculty Invigilator",
      scheduledFor: examForm.scheduledFor.trim(),
      durationMinutes: Number(examForm.durationMinutes) || 40,
      totalMarks: existing?.totalMarks ?? 20,
      status: examForm.status,
      roomCode: `EXM-${examForm.subjectCode}`,
      passCode: examForm.passCode.trim() || generateExamPassCode(),
      proctoringEnabled: examForm.proctoringEnabled,
      instructions: examForm.instructions
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      questionIds: qIds,
    });

    setExamFormOpen(false);
    resetExamForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Exam Schedule Saved",
      title: wasEditing ? "Examination Updated" : "Examination Scheduled",
      description: `"${savedTitle}" has been saved for ${examForm.classLevel}.`,
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredExams = store.exams.filter((exam) => {
    if (statusFilter !== "ALL" && exam.status !== statusFilter) return false;
    if (!q) return true;
    return (
      exam.title.toLowerCase().includes(q) ||
      exam.subjectCode.toLowerCase().includes(q) ||
      (exam.passCode ?? "").includes(q) ||
      exam.classLevel.toLowerCase().includes(q)
    );
  });

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "First Term · 2026/2027";

  const selection = useTableSelection(filteredExams.map((exam) => exam.id));

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Examination Governance · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Exam Scheduling & Pass Codes."
        highlightWords={["Exam", "Scheduling"]}
        subtitle="Schedule CBT examination windows using the single inline form below, and rotate entry PINs via modal."
        primaryCta={{
          label: "Schedule Exam",
          onClick: openCreateForm,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Live Proctoring",
          href: "/admin/exams/proctoring",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <ExamScheduleForm
          formRef={examFormRef}
          open={examFormOpen}
          onOpenChange={setExamFormOpen}
          formState={examForm}
          setFormState={setExamForm}
          subjects={store.subjects}
          classArms={store.classArms}
          onReset={resetExamForm}
          onSubmit={handleSaveExam}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search exam title, code, or PIN..."
            />
            <AdminSelectField
              variant="filter"
              aria-label="Filter status"
              value={statusFilter}
              onChange={setStatusFilter}
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
            onClick={openCreateForm}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Schedule Exam</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Examination Schedule & Pass Codes"
            subtitle="Issue 6-digit pass codes / PINs via modal, toggle proctoring rules, or adjust timetable windows."
            badge={`${filteredExams.length} exams`}
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
            {filteredExams.length === 0 ? (
              <AdminEmptyState
                title="No Examinations Found"
                description="Schedule a new CBT exam or clear your search/status filters."
                icon={<CalendarCheck className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead className="w-10">
                      <AdminCheckbox
                        aria-label="Select all examinations"
                        checked={selection.allSelected}
                        indeterminate={selection.someSelected}
                        onChange={(e) => selection.toggleAll(e.target.checked)}
                      />
                    </AdminTableHead>
                    <AdminTableHead>Examination</AdminTableHead>
                    <AdminTableHead>Class Arm</AdminTableHead>
                    <AdminTableHead>Schedule</AdminTableHead>
                    <AdminTableHead>Pass Code / PIN</AdminTableHead>
                    <AdminTableHead>Proctoring</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredExams.map((exam) => (
                    <AdminTableRow
                      key={exam.id}
                      isSelected={selection.isSelected(exam.id)}
                    >
                      <AdminTableCell className="w-10">
                        <AdminCheckbox
                          aria-label={`Select ${exam.title}`}
                          checked={selection.isSelected(exam.id)}
                          onChange={() => selection.toggleOne(exam.id)}
                        />
                      </AdminTableCell>
                      <AdminTableCell>
                        <p className="font-display font-extrabold text-brand-950">
                          {exam.title}
                        </p>
                        <p className="text-[11px] font-medium text-ink-secondary">
                          {exam.subjectCode} · {exam.durationMinutes} mins
                        </p>
                      </AdminTableCell>
                      <AdminTableCell className="font-bold text-brand-900">
                        {exam.classLevel}
                      </AdminTableCell>
                      <AdminTableCell className="font-medium text-ink-primary">
                        {exam.scheduledFor}
                      </AdminTableCell>
                      <AdminTableCell>
                        <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-brand-100 bg-surface-pearl px-2.5 py-1 font-mono font-extrabold text-brand-950">
                          <KeyRound className="h-3 w-3 text-brand-600" />
                          {exam.passCode || "—"}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={exam.proctoringEnabled ? "Enforced" : "Off"}
                          variant={
                            exam.proctoringEnabled ? "success" : "neutral"
                          }
                        />
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
                          ariaLabel={`Manage ${exam.title}`}
                          items={[
                            {
                              id: "pin",
                              label: "Manage Pass Code / PIN",
                              icon: <KeyRound className="h-3.5 w-3.5" />,
                              variant: "primary",
                              onClick: () => {
                                setPinDraft(
                                  exam.passCode || generateExamPassCode()
                                );
                                setPinTarget(exam);
                              },
                            },
                            {
                              id: "edit",
                              label: "Edit Schedule & Rules",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditForm(exam),
                            },
                            {
                              id: "proctor-toggle",
                              label: exam.proctoringEnabled
                                ? "Disable Proctoring"
                                : "Enable Proctoring",
                              icon: <ShieldCheck className="h-3.5 w-3.5" />,
                              onClick: () => toggleExamProctoring(exam.id),
                            },
                            {
                              id: "status-toggle",
                              label:
                                exam.status === "live"
                                  ? "Close Live Window"
                                  : "Open Live Window",
                              icon: <Play className="h-3.5 w-3.5" />,
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
                              onClick: () => setDeleteTarget(exam),
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

      <ExamPasscodeModal
        target={pinTarget}
        pinDraft={pinDraft}
        setPinDraft={setPinDraft}
        onGeneratePin={generateExamPassCode}
        onClose={() => setPinTarget(null)}
        onConfirm={() => {
          if (!pinTarget) return;
          rotateExamPassCode(pinTarget.id, pinDraft);
          const examTitle = pinTarget.title;
          setPinTarget(null);
          setFeedbackModal({
            variant: "success",
            eyebrow: "Access PIN Updated",
            title: "Exam Pass Code Saved",
            description: `Updated CBT access PIN for "${examTitle}".`,
          });
        }}
      />

      <AdminDialogModal
        open={Boolean(feedbackModal)}
        onOpenChange={(open) => {
          if (!open) setFeedbackModal(null);
        }}
        variant={feedbackModal?.variant ?? "primary"}
        eyebrow={feedbackModal?.eyebrow}
        title={feedbackModal?.title ?? ""}
        description={feedbackModal?.description}
        confirmLabel="OK"
        cancelLabel="Close"
        onConfirm={() => setFeedbackModal(null)}
      />

      <AdminDialogModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        variant="danger"
        title="Delete Examination?"
        description={
          deleteTarget
            ? `Permanently delete "${deleteTarget.title}"?`
            : undefined
        }
        confirmLabel="Delete Exam"
        onConfirm={() => {
          if (deleteTarget) {
            deleteExam(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

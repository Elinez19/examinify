"use client";

import * as React from "react";
import {
  Clock,
  Edit3,
  Flag,
  KeyRound,
  Megaphone,
  Play,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import {
  AdminSearchInput,
  AdminSelectField,
} from "@/components/admin/ui/admin-form-controls";
import {
  AdminTableCell,
  AdminTableHead,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import {
  AdminDialogModal,
  type ModalVariant,
} from "@/components/admin/ui/admin-dialog-modal";
import {
  generateExamPassCode,
  usePortalStore,
} from "@/hooks/portal/use-portal-store";
import type { PortalExam } from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";
import {
  ExamScheduleForm,
  type ExamScheduleFormState,
} from "./exam-schedule-form";
import { ExamPasscodeForm } from "./exam-passcode-form";
import { ProctorBroadcastForm } from "./proctor-broadcast-form";

type AdminExamsTab = "scheduling" | "proctoring";

export function ExamsWorkspace() {
  const {
    store,
    activeSessionTerm,
    saveExam,
    updateExamStatus,
    rotateExamPassCode,
    toggleExamProctoring,
    deleteExam,
    extendCandidateTime,
    flagCandidateSession,
    forceSubmitCandidate,
    sendBroadcast,
  } = usePortalStore();

  const [activeTab, setActiveTab] = React.useState<AdminExamsTab>("scheduling");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  const examFormRef = React.useRef<HTMLDivElement | null>(null);
  const pinFormRef = React.useRef<HTMLDivElement | null>(null);
  const broadcastFormRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToForm = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  // Schedule/Edit inline form
  const [examFormOpen, setExamFormOpen] = React.useState(false);
  const [examForm, setExamForm] = React.useState<ExamScheduleFormState>({
    id: "",
    title: "",
    subjectCode: store.subjects[0]?.code ?? "MTH-301",
    classLevel: store.classArms[0]?.name ?? "JSS 3A",
    scheduledFor: "Tue, Nov 24 · 09:00 AM",
    durationMinutes: 45,
    passCode: "",
    status: "scheduled",
    proctoringEnabled: true,
    instructions: "Keep your CBT tab focused. Offline sync is active.",
  });

  // Pass code PIN inline form
  const [pinTarget, setPinTarget] = React.useState<PortalExam | null>(null);
  const [pinDraft, setPinDraft] = React.useState("");

  // Broadcast inline form
  const [broadcastFormOpen, setBroadcastFormOpen] = React.useState(false);
  const [broadcastMsg, setBroadcastMsg] = React.useState("");

  // Feedback & Delete confirmation modals
  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<PortalExam | null>(null);

  const resetExamForm = () => {
    setExamForm({
      id: "",
      title: "",
      subjectCode: store.subjects[0]?.code ?? "MTH-301",
      classLevel: store.classArms[0]?.name ?? "JSS 3A",
      scheduledFor: "Tue, Nov 24 · 09:00 AM",
      durationMinutes: 45,
      passCode: generateExamPassCode(),
      status: "scheduled",
      proctoringEnabled: true,
      instructions: "Keep your CBT tab focused. Offline sync is active.",
    });
  };

  const openCreateForm = () => {
    setActiveTab("scheduling");
    setPinTarget(null);
    resetExamForm();
    setExamFormOpen(true);
    scrollToForm(examFormRef);
  };

  const openEditForm = (exam: PortalExam) => {
    setActiveTab("scheduling");
    setPinTarget(null);
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
    scrollToForm(examFormRef);
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
      (exam.passCode ?? "").includes(q)
    );
  });

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "First Term · 2026/2027";

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow={`Examination Governance · ${termLabel}`}
        title="Exam Scheduling, PINs & Proctoring"
        description="Schedule CBT windows, issue or rotate exam pass codes / PINs, enforce proctoring rules, and monitor active candidate seats."
        badgeLabel={`${store.exams.filter((e) => e.status === "live").length} Live Window`}
        badgeTone="emerald"
        metrics={[
          { label: "Scheduled Exams", value: `${store.exams.length}` },
          {
            label: "Proctored",
            value: `${store.exams.filter((e) => e.proctoringEnabled).length}`,
          },
          {
            label: "Active Candidates",
            value: `${store.liveCandidates.filter((c) => c.status !== "submitted").length}`,
          },
        ]}
        action={
          <button
            type="button"
            onClick={openCreateForm}
            className="cta-surface-secondary inline-flex items-center gap-1.5 rounded-pill px-5 py-2.5 font-display text-xs font-extrabold cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Schedule Exam
          </button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("scheduling")}
          className={cn(
            "rounded-pill px-4 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer",
            activeTab === "scheduling"
              ? "cta-surface-primary text-ink-on-blue"
              : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 shadow-gloss-card hover:bg-surface-mist"
          )}
        >
          Exam Scheduling & Pass Codes ({store.exams.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("proctoring")}
          className={cn(
            "rounded-pill px-4 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer",
            activeTab === "proctoring"
              ? "cta-surface-primary text-ink-on-blue"
              : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 shadow-gloss-card hover:bg-surface-mist"
          )}
        >
          Proctoring & Live Candidates ({store.liveCandidates.length})
        </button>
      </div>

      {activeTab === "scheduling" ? (
        <div className="space-y-4">
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

          <ExamPasscodeForm
            formRef={pinFormRef}
            target={pinTarget}
            pinDraft={pinDraft}
            setPinDraft={setPinDraft}
            onGeneratePin={generateExamPassCode}
            onCancel={() => setPinTarget(null)}
            onSubmit={(e) => {
              e.preventDefault();
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

          <AdminSectionCard
            title="Examination Schedule & Pass Codes"
            description="Issue 6-digit pass codes / PINs, toggle proctoring rules, or adjust timetable windows."
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="w-full sm:w-72">
                <AdminSearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search exam title, code, or PIN..."
                />
              </div>

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

            <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
              <table className="w-full text-left text-xs">
                <thead className="border-b-2 border-brand-100 bg-surface-pearl">
                  <tr>
                    <AdminTableHead>Examination</AdminTableHead>
                    <AdminTableHead>Class Arm</AdminTableHead>
                    <AdminTableHead>Schedule</AdminTableHead>
                    <AdminTableHead>Pass Code / PIN</AdminTableHead>
                    <AdminTableHead>Proctoring</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">Actions</AdminTableHead>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100 bg-white">
                  {filteredExams.map((exam) => (
                    <tr
                      key={exam.id}
                      className="hover:bg-surface-mist/50 transition-colors"
                    >
                      <AdminTableCell>
                        <p className="font-extrabold text-brand-950">
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
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                            exam.proctoringEnabled
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                          )}
                        >
                          <ShieldCheck className="h-3 w-3" />
                          {exam.proctoringEnabled ? "Enforced" : "Off"}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                            exam.status === "live"
                              ? "bg-emerald-100 text-emerald-800"
                              : exam.status === "scheduled"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                          )}
                        >
                          {exam.status}
                        </span>
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
                                setExamFormOpen(false);
                                setPinDraft(
                                  exam.passCode || generateExamPassCode()
                                );
                                setPinTarget(exam);
                                scrollToForm(pinFormRef);
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminSectionCard>
        </div>
      ) : (
        <div className="space-y-4">
          <ProctorBroadcastForm
            formRef={broadcastFormRef}
            open={broadcastFormOpen}
            onOpenChange={setBroadcastFormOpen}
            message={broadcastMsg}
            setMessage={setBroadcastMsg}
            onSubmit={(e) => {
              e.preventDefault();
              if (!broadcastMsg.trim()) return;
              const liveExamId =
                store.exams.find((ex) => ex.status === "live")?.id ??
                store.exams[0]?.id ??
                "exam_mth_midterm";
              sendBroadcast(liveExamId, broadcastMsg.trim(), "warning");
              setBroadcastMsg("");
              setBroadcastFormOpen(false);
              setFeedbackModal({
                variant: "success",
                eyebrow: "Broadcast Delivered",
                title: "Proctoring Notice Sent",
                description:
                  "Your announcement has been pushed to all active candidate exam sessions.",
              });
            }}
          />

          <AdminSectionCard
            title="Proctoring Telemetry & Live Seats"
            description="Monitor focus-loss flags, adjust candidate timers, or broadcast school-wide alerts."
            action={
              <button
                type="button"
                onClick={() => {
                  setBroadcastFormOpen(true);
                  scrollToForm(broadcastFormRef);
                }}
                className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
              >
                <Megaphone className="h-3.5 w-3.5" />
                Broadcast Alert
              </button>
            }
          >
            <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
              <table className="w-full text-left text-xs">
                <thead className="border-b-2 border-brand-100 bg-surface-pearl">
                  <tr>
                    <AdminTableHead>Candidate</AdminTableHead>
                    <AdminTableHead>Seat</AdminTableHead>
                    <AdminTableHead>Integrity Switches</AdminTableHead>
                    <AdminTableHead>Time Remaining</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">Actions</AdminTableHead>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100 bg-white">
                  {store.liveCandidates.map((cand) => (
                    <tr
                      key={cand.id}
                      className="hover:bg-surface-mist/50 transition-colors"
                    >
                      <AdminTableCell>
                        <p className="font-extrabold text-brand-950">
                          {cand.studentName}
                        </p>
                        <p className="text-[11px] font-mono text-ink-secondary">
                          {cand.admissionNo}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell className="font-mono font-bold text-brand-800">
                        {cand.seatLabel}
                      </AdminTableCell>
                      <AdminTableCell className="font-bold">
                        {cand.tabSwitchCount} switch(es)
                      </AdminTableCell>
                      <AdminTableCell className="font-bold text-brand-900">
                        {cand.timeRemainingMinutes} mins
                      </AdminTableCell>
                      <AdminTableCell>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                            cand.status === "flagged"
                              ? "bg-rose-100 text-rose-800"
                              : cand.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-700"
                          )}
                        >
                          {cand.status}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Proctor ${cand.studentName}`}
                          items={[
                            {
                              id: "extend",
                              label: "Grant +5 Mins Extra Time",
                              icon: <Clock className="h-3.5 w-3.5" />,
                              disabled: cand.status === "submitted",
                              onClick: () => extendCandidateTime(cand.id, 5),
                            },
                            {
                              id: "flag",
                              label:
                                cand.status === "flagged"
                                  ? "Clear Proctor Flag"
                                  : "Flag Integrity Breach",
                              icon: <Flag className="h-3.5 w-3.5" />,
                              onClick: () => flagCandidateSession(cand.id),
                            },
                            {
                              id: "terminate",
                              label: "Force Submit Session",
                              icon: <ShieldAlert className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              disabled: cand.status === "submitted",
                              onClick: () => forceSubmitCandidate(cand.id),
                            },
                          ]}
                        />
                      </AdminTableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminSectionCard>
        </div>
      )}

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

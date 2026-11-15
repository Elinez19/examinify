"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Award,
  CheckCircle2,
  Clock,
  Download,
  Edit3,
  FileCheck2,
  Flag,
  Megaphone,
  Play,
  Plus,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import {
  AdminSearchInput,
  AdminSelectField,
} from "@/components/admin/ui/admin-form-controls";
import {
  AdminSortableTableHead,
  AdminTableCell,
  AdminTableHead,
  type SortDirection,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type {
  ExamSubmission,
  PortalExam,
  TheoryScoreEntry,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";
import {
  TeacherExamBuilderForm,
  type TeacherExamFormState,
} from "./teacher-exam-builder-form";
import { TeacherBroadcastForm } from "./teacher-broadcast-form";
import { ScriptGradingForm } from "./script-grading-form";

type ExamHubTab = "exams" | "monitor" | "grading" | "broadsheets";
type ExamSortKey = "title" | "subjectCode" | "classLevel" | "durationMinutes" | "status";
type MonitorSortKey = "studentName" | "seatLabel" | "progressPercent" | "timeRemainingMinutes" | "status";
type GradingSortKey = "studentName" | "examTitle" | "objectiveEarned" | "gradingStatus";

export function TeacherExamsWorkspace() {
  const {
    store,
    activeSessionTerm,
    saveExam,
    updateExamStatus,
    deleteExam,
    extendCandidateTime,
    forceSubmitCandidate,
    flagCandidateSession,
    sendBroadcast,
    gradeSubmission,
  } = usePortalStore();

  const searchParams = useSearchParams();
  const paramTab = searchParams.get("tab");
  const initialTab: ExamHubTab =
    paramTab === "exams" ||
    paramTab === "monitor" ||
    paramTab === "grading" ||
    paramTab === "broadsheets"
      ? paramTab
      : "exams";

  const [tabOverride, setTabOverride] = React.useState<ExamHubTab | null>(null);
  const activeTab = tabOverride ?? initialTab;
  const setActiveTab = (tab: ExamHubTab) => setTabOverride(tab);

  // Exams table state
  const [examSearch, setExamSearch] = React.useState("");
  const [examStatusFilter, setExamStatusFilter] = React.useState("ALL");
  const [examSortKey, setExamSortKey] = React.useState<ExamSortKey>("title");
  const [examSortDir, setExamSortDir] = React.useState<SortDirection>("asc");
  const [examModalOpen, setExamModalOpen] = React.useState(false);
  const [deleteExamTarget, setDeleteExamTarget] =
    React.useState<PortalExam | null>(null);
  const [feedbackDialog, setFeedbackDialog] = React.useState<{
    variant: "success" | "danger";
    title: string;
    description: string;
  } | null>(null);

  const examFormRef = React.useRef<HTMLDivElement | null>(null);
  const broadcastFormRef = React.useRef<HTMLDivElement | null>(null);
  const gradingFormRef = React.useRef<HTMLDivElement | null>(null);

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

  // Live monitor state
  const [monitorSearch, setMonitorSearch] = React.useState("");
  const [monitorStatusFilter, setMonitorStatusFilter] = React.useState("ALL");
  const [monitorSortKey, setMonitorSortKey] =
    React.useState<MonitorSortKey>("studentName");
  const [monitorSortDir, setMonitorSortDir] =
    React.useState<SortDirection>("asc");
  const [broadcastModalOpen, setBroadcastModalOpen] = React.useState(false);
  const [broadcastExamId, setBroadcastExamId] = React.useState(
    store.exams.find((e) => e.status === "live")?.id ?? store.exams[0]?.id ?? ""
  );
  const [broadcastMessage, setBroadcastMessage] = React.useState("");
  const [broadcastUrgency, setBroadcastUrgency] = React.useState<
    "info" | "warning"
  >("info");

  // Theory grading state
  const [gradingSearch, setGradingSearch] = React.useState("");
  const [gradingStatusFilter, setGradingStatusFilter] = React.useState("ALL");
  const [gradingSortKey, setGradingSortKey] =
    React.useState<GradingSortKey>("gradingStatus");
  const [gradingSortDir, setGradingSortDir] =
    React.useState<SortDirection>("asc");
  const [gradingTarget, setGradingTarget] =
    React.useState<ExamSubmission | null>(null);
  const [theoryInputs, setTheoryInputs] = React.useState<
    Record<string, TheoryScoreEntry>
  >({});
  const [overallFeedback, setOverallFeedback] = React.useState("");

  // Broadsheet filter
  const [broadsheetSubject, setBroadsheetSubject] = React.useState("ALL");
  const [broadsheetSearch, setBroadsheetSearch] = React.useState("");

  const toggleExamSort = (key: ExamSortKey) => {
    if (examSortKey === key) setExamSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setExamSortKey(key);
      setExamSortDir("asc");
    }
  };

  const toggleMonitorSort = (key: MonitorSortKey) => {
    if (monitorSortKey === key)
      setMonitorSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setMonitorSortKey(key);
      setMonitorSortDir("asc");
    }
  };

  const toggleGradingSort = (key: GradingSortKey) => {
    if (gradingSortKey === key)
      setGradingSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setGradingSortKey(key);
      setGradingSortDir("asc");
    }
  };

  const scrollToForm = (ref: React.RefObject<HTMLDivElement | null>) => {
    window.requestAnimationFrame(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openCreateExamModal = () => {
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
    setActiveTab("exams");
    setExamModalOpen(true);
    scrollToForm(examFormRef);
  };

  const openEditExamModal = (exam: PortalExam) => {
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
    setActiveTab("exams");
    setExamModalOpen(true);
    scrollToForm(examFormRef);
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
    setExamModalOpen(false);
    setFeedbackDialog({
      variant: "success",
      title: isUpdate ? "Assessment Updated" : "Assessment Created",
      description: `${title} (${examForm.classLevel}) has been saved to the examination registry.`,
    });
  };

  const openGradingModal = (sub: ExamSubmission) => {
    const initialScores: Record<string, TheoryScoreEntry> = {};
    const exam = store.exams.find((e) => e.id === sub.examId);
    const theoryQuestions = store.questions.filter(
      (q) => q.type === "theory" && (exam?.questionIds.includes(q.id) ?? false)
    );
    for (const q of theoryQuestions) {
      initialScores[q.id] =
        (sub.theoryScores ?? sub.theoryScoresByQuestion)?.[q.id] ?? {
          score: 0,
          maxScore: q.marks,
          comment: "",
        };
    }
    setTheoryInputs(initialScores);
    setOverallFeedback(sub.overallFeedback ?? "");
    setActiveTab("grading");
    setGradingTarget(sub);
    scrollToForm(gradingFormRef);
  };

  const handleSaveGrading = (event: React.FormEvent) => {
    event.preventDefault();
    if (!gradingTarget) return;
    const studentName = gradingTarget.studentName;
    const examTitle = gradingTarget.examTitle;
    gradeSubmission(gradingTarget.id, theoryInputs, overallFeedback.trim(), true);
    setGradingTarget(null);
    setFeedbackDialog({
      variant: "success",
      title: "Result Published",
      description: `Theory scores and feedback for ${studentName} (${examTitle}) have been saved and published.`,
    });
  };

  const handleBroadcastSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!broadcastMessage.trim() || !broadcastExamId) {
      setFeedbackDialog({
        variant: "danger",
        title: "Notice Incomplete",
        description: "Select a target examination and enter a notice message to broadcast.",
      });
      return;
    }
    sendBroadcast(broadcastExamId, broadcastMessage.trim(), broadcastUrgency);
    setBroadcastMessage("");
    setBroadcastModalOpen(false);
    setFeedbackDialog({
      variant: "success",
      title: "Invigilation Notice Broadcast",
      description: "Your notice has been delivered to active candidate workstations.",
    });
  };

  const handleExportCsv = () => {
    const rows = [
      ["Candidate", "Admission No", "Assessment", "Subject", "Earned", "Total", "Status"],
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
    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "examinify-broadsheet.csv";
    link.click();
    URL.revokeObjectURL(url);
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

  const filteredCandidates = React.useMemo(() => {
    const q = monitorSearch.trim().toLowerCase();
    const list = store.liveCandidates.filter((cand) => {
      if (monitorStatusFilter !== "ALL" && cand.status !== monitorStatusFilter)
        return false;
      if (!q) return true;
      return (
        (cand.studentName ?? "").toLowerCase().includes(q) ||
        (cand.admissionNo ?? "").toLowerCase().includes(q) ||
        (cand.seatLabel ?? "").toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (monitorSortKey === "studentName")
        cmp = (a.studentName ?? "").localeCompare(b.studentName ?? "");
      else if (monitorSortKey === "seatLabel")
        cmp = (a.seatLabel ?? "").localeCompare(b.seatLabel ?? "");
      else if (monitorSortKey === "progressPercent")
        cmp = (a.progressPercent ?? 0) - (b.progressPercent ?? 0);
      else if (monitorSortKey === "timeRemainingMinutes")
        cmp = (a.timeRemainingMinutes ?? 0) - (b.timeRemainingMinutes ?? 0);
      else if (monitorSortKey === "status")
        cmp = (a.status ?? "").localeCompare(b.status ?? "");
      return monitorSortDir === "asc" ? cmp : -cmp;
    });
  }, [
    monitorSearch,
    monitorSortDir,
    monitorSortKey,
    monitorStatusFilter,
    store.liveCandidates,
  ]);

  const filteredGrading = React.useMemo(() => {
    const q = gradingSearch.trim().toLowerCase();
    const list = store.submissions.filter((sub) => {
      if (gradingStatusFilter !== "ALL" && sub.gradingStatus !== gradingStatusFilter)
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

  const filteredBroadsheet = React.useMemo(() => {
    const q = broadsheetSearch.trim().toLowerCase();
    return store.submissions.filter((sub) => {
      if (broadsheetSubject !== "ALL" && sub.subjectCode !== broadsheetSubject)
        return false;
      if (!q) return true;
      return (
        sub.studentName.toLowerCase().includes(q) ||
        sub.examTitle.toLowerCase().includes(q)
      );
    });
  }, [broadsheetSearch, broadsheetSubject, store.submissions]);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow={`Assessment Hub · ${termLabel}`}
        title="Examinations & Grading"
        description="Manage CBT assessments, supervise active candidates, score theory scripts, and export class broadsheets."
        badgeLabel={`${store.exams.filter((e) => e.status === "live").length} Live Assessment`}
        badgeTone="emerald"
        metrics={[
          { label: "Total Exams", value: `${store.exams.length}` },
          {
            label: "Active Candidates",
            value: `${store.liveCandidates.filter((c) => c.status === "active" || c.status === "flagged").length}`,
          },
          {
            label: "Pending Grading",
            value: `${store.submissions.filter((s) => s.gradingStatus === "needs_theory_review").length}`,
          },
        ]}
        action={
          <button
            type="button"
            onClick={openCreateExamModal}
            className="cta-surface-secondary inline-flex items-center gap-2 rounded-pill px-5 py-2.5 font-display text-xs font-extrabold transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Exam
          </button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "exams", label: `Exams (${store.exams.length})` },
            { id: "monitor", label: "Live Monitor" },
            {
              id: "grading",
              label: `Theory Grading (${store.submissions.filter((s) => s.gradingStatus === "needs_theory_review").length})`,
            },
            { id: "broadsheets", label: "Broadsheets" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-pill px-4 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer",
              activeTab === tab.id
                ? "cta-surface-primary text-ink-on-blue"
                : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 shadow-gloss-card hover:bg-surface-mist"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "exams" && (
        <div className="space-y-6">
          <TeacherExamBuilderForm
            formRef={examFormRef}
            open={examModalOpen}
            onOpenChange={setExamModalOpen}
            formState={examForm}
            setFormState={setExamForm}
            subjects={store.subjects}
            classArms={store.classArms}
            questions={store.questions}
            onReset={openCreateExamModal}
            onSubmit={handleSaveExam}
          />

          <AdminSectionCard
            title="Assessments Table"
            description="Sortable, filterable CBT assessments with contextual actions."
          >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="w-full sm:w-72">
              <AdminSearchInput
                value={examSearch}
                onChange={setExamSearch}
                placeholder="Search title, subject, class..."
              />
            </div>

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

          <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-brand-100 bg-surface-pearl">
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
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 bg-white">
                {filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-surface-mist/50 transition-colors">
                    <AdminTableCell>
                      <p className="font-extrabold text-brand-950">
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
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
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
                        ariaLabel={`Actions for ${exam.title}`}
                        items={[
                          {
                            id: "edit",
                            label: "Edit Exam Details",
                            icon: <Edit3 className="h-3.5 w-3.5" />,
                            onClick: () => openEditExamModal(exam),
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </AdminSectionCard>
        </div>
      )}

      {activeTab === "monitor" && (
        <div className="space-y-6">
          <TeacherBroadcastForm
            formRef={broadcastFormRef}
            open={broadcastModalOpen}
            onOpenChange={setBroadcastModalOpen}
            exams={store.exams}
            examId={broadcastExamId}
            setExamId={setBroadcastExamId}
            urgency={broadcastUrgency}
            setUrgency={setBroadcastUrgency}
            message={broadcastMessage}
            setMessage={setBroadcastMessage}
            onSubmit={handleBroadcastSubmit}
          />

          <AdminSectionCard
            title="Live Invigilation Monitor"
            description="Track active workstations, extend candidate timing, and broadcast instructions."
            action={
              <button
                type="button"
                onClick={() => {
                  setBroadcastModalOpen(true);
                  scrollToForm(broadcastFormRef);
                }}
                className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
              >
                <Megaphone className="h-3.5 w-3.5" />
                Send Notice
              </button>
            }
          >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="w-full sm:w-72">
              <AdminSearchInput
                value={monitorSearch}
                onChange={setMonitorSearch}
                placeholder="Search candidate, seat, admission no..."
              />
            </div>

            <AdminSelectField
              variant="filter"
              aria-label="Filter candidate status"
              value={monitorStatusFilter}
              onChange={setMonitorStatusFilter}
              options={[
                { id: "ALL", label: "All Candidates" },
                { id: "active", label: "Active" },
                { id: "flagged", label: "Flagged" },
                { id: "offline", label: "Offline Cache" },
                { id: "submitted", label: "Submitted" },
              ]}
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-brand-100 bg-surface-pearl">
                <tr>
                  <AdminSortableTableHead
                    label="Candidate"
                    sortKey="studentName"
                    activeSortKey={monitorSortKey}
                    sortDirection={monitorSortDir}
                    onSort={toggleMonitorSort}
                  />
                  <AdminSortableTableHead
                    label="Workstation"
                    sortKey="seatLabel"
                    activeSortKey={monitorSortKey}
                    sortDirection={monitorSortDir}
                    onSort={toggleMonitorSort}
                  />
                  <AdminSortableTableHead
                    label="Progress"
                    sortKey="progressPercent"
                    activeSortKey={monitorSortKey}
                    sortDirection={monitorSortDir}
                    onSort={toggleMonitorSort}
                  />
                  <AdminSortableTableHead
                    label="Time Left"
                    sortKey="timeRemainingMinutes"
                    activeSortKey={monitorSortKey}
                    sortDirection={monitorSortDir}
                    onSort={toggleMonitorSort}
                  />
                  <AdminSortableTableHead
                    label="Status"
                    sortKey="status"
                    activeSortKey={monitorSortKey}
                    sortDirection={monitorSortDir}
                    onSort={toggleMonitorSort}
                  />
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 bg-white">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-surface-mist/50 transition-colors">
                    <AdminTableCell>
                      <p className="font-extrabold text-brand-950">
                        {cand.studentName}
                      </p>
                      <p className="text-[11px] font-medium text-ink-secondary">
                        {cand.admissionNo} · {cand.tabSwitchCount} focus switch(es)
                      </p>
                    </AdminTableCell>
                    <AdminTableCell className="font-mono font-bold text-brand-800">
                      {cand.seatLabel}
                    </AdminTableCell>
                    <AdminTableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-brand-100">
                          <div
                            className="h-full rounded-full bg-brand-700"
                            style={{ width: `${cand.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-bold">{cand.progressPercent}%</span>
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className="font-bold text-brand-900">
                      {cand.timeRemainingMinutes} mins
                    </AdminTableCell>
                    <AdminTableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                          cand.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : cand.status === "flagged"
                              ? "bg-rose-100 text-rose-800"
                              : cand.status === "offline"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                        )}
                      >
                        {cand.status}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <AdminActionMenu
                        ariaLabel={`Invigilate ${cand.studentName}`}
                        items={[
                          {
                            id: "extend",
                            label: "Extend Time (+5 mins)",
                            icon: <Clock className="h-3.5 w-3.5" />,
                            disabled: cand.status === "submitted",
                            onClick: () => extendCandidateTime(cand.id, 5),
                          },
                          {
                            id: "flag",
                            label:
                              cand.status === "flagged"
                                ? "Clear Session Flag"
                                : "Flag Session Integrity",
                            icon: <Flag className="h-3.5 w-3.5" />,
                            onClick: () => flagCandidateSession(cand.id),
                          },
                          {
                            id: "force",
                            label: "Force Submit Script",
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

      {activeTab === "grading" && (
        <div className="space-y-6">
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

          <AdminSectionCard
            title="Theory Grading Queue"
            description="Score subjective answers and publish official results using the inline grading panel."
            action={<FileCheck2 className="h-4 w-4 text-brand-500" />}
          >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="w-full sm:w-72">
              <AdminSearchInput
                value={gradingSearch}
                onChange={setGradingSearch}
                placeholder="Search student or assessment..."
              />
            </div>

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

          <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-brand-100 bg-surface-pearl">
                <tr>
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
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 bg-white">
                {filteredGrading.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-mist/50 transition-colors">
                    <AdminTableCell>
                      <p className="font-extrabold text-brand-950">
                        {sub.studentName}
                      </p>
                      <p className="text-[11px] font-medium text-ink-secondary">
                        {sub.admissionNo}
                      </p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="font-bold text-brand-900">{sub.examTitle}</p>
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
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                          sub.gradingStatus === "published"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {sub.gradingStatus === "published"
                          ? "Published"
                          : "Needs Review"}
                      </span>
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
                            onClick: () => openGradingModal(sub),
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

      {activeTab === "broadsheets" && (
        <AdminSectionCard
          title="Result Broadsheets"
          description="Consolidated objective + theory scores across candidates."
          action={
            <button
              type="button"
              onClick={handleExportCsv}
              className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          }
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="w-full sm:w-72">
              <AdminSearchInput
                value={broadsheetSearch}
                onChange={setBroadsheetSearch}
                placeholder="Filter student or exam..."
              />
            </div>

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

          <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-brand-100 bg-surface-pearl">
                <tr>
                  <AdminTableHead>Candidate</AdminTableHead>
                  <AdminTableHead>Assessment</AdminTableHead>
                  <AdminTableHead>Total Score</AdminTableHead>
                  <AdminTableHead>Percent</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 bg-white">
                {filteredBroadsheet.map((sub) => {
                  const earned = sub.objectiveEarned + sub.theoryEarned;
                  const total = sub.objectiveTotal + sub.theoryTotal;
                  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
                  return (
                    <tr key={sub.id} className="hover:bg-surface-mist/50 transition-colors">
                      <AdminTableCell>
                        <p className="font-extrabold text-brand-950">
                          {sub.studentName}
                        </p>
                        <p className="text-[11px] text-ink-secondary">
                          {sub.admissionNo}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell className="font-bold text-brand-900">
                        {sub.examTitle}
                      </AdminTableCell>
                      <AdminTableCell className="font-extrabold text-brand-950">
                        {earned} / {total}
                      </AdminTableCell>
                      <AdminTableCell className="font-extrabold text-emerald-700">
                        {pct}%
                      </AdminTableCell>
                      <AdminTableCell>
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-brand-900">
                          <CheckCircle2 className="h-3 w-3" />
                          {sub.gradingStatus}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Broadsheet action for ${sub.studentName}`}
                          items={[
                            {
                              id: "open-grade",
                              label: "Review / Adjust Marks",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openGradingModal(sub),
                            },
                          ]}
                        />
                      </AdminTableCell>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AdminSectionCard>
      )}

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

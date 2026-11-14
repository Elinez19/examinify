"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Activity,
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
  Send,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import {
  AdminSearchInput,
  AdminTextField,
  AdminTextareaField,
} from "@/components/admin/ui/admin-form-controls";
import {
  AdminSortableTableHead,
  AdminTableCell,
  AdminTableHead,
  type SortDirection,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type {
  ExamSubmission,
  PortalExam,
  TheoryScoreEntry,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

type ExamHubTab = "exams" | "monitor" | "grading" | "broadsheets";
type ExamSortKey = "title" | "subjectCode" | "classLevel" | "durationMinutes" | "status";
type MonitorSortKey = "studentName" | "seatLabel" | "progressPercent" | "timeRemainingMinutes" | "status";
type GradingSortKey = "studentName" | "examTitle" | "objectiveEarned" | "gradingStatus";

interface ExamFormState {
  id: string;
  title: string;
  subjectCode: string;
  classLevel: string;
  scheduledFor: string;
  durationMinutes: number;
  status: PortalExam["status"];
  instructions: string;
  questionIds: string[];
}

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
  const [examForm, setExamForm] = React.useState<ExamFormState>({
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
    setExamModalOpen(true);
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
    setExamModalOpen(true);
  };

  const handleSaveExam = (event: React.FormEvent) => {
    event.preventDefault();
    if (!examForm.title.trim()) return;
    const subject = store.subjects.find((s) => s.code === examForm.subjectCode);
    const chosenQuestions = store.questions.filter((q) =>
      examForm.questionIds.includes(q.id)
    );
    const totalMarks = chosenQuestions.reduce((sum, q) => sum + q.marks, 0) || 10;

    saveExam({
      id: examForm.id || `exam_${Date.now()}`,
      title: examForm.title.trim(),
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
  };

  const openGradingModal = (sub: ExamSubmission) => {
    const initialScores: Record<string, TheoryScoreEntry> = {};
    const exam = store.exams.find((e) => e.id === sub.examId);
    const theoryQuestions = store.questions.filter(
      (q) => q.type === "theory" && (exam?.questionIds.includes(q.id) ?? false)
    );
    for (const q of theoryQuestions) {
      initialScores[q.id] = sub.theoryScores[q.id] ?? {
        score: 0,
        maxScore: q.marks,
        comment: "",
      };
    }
    setTheoryInputs(initialScores);
    setOverallFeedback(sub.overallFeedback ?? "");
    setGradingTarget(sub);
  };

  const handleSaveGrading = (event: React.FormEvent) => {
    event.preventDefault();
    if (!gradingTarget) return;
    gradeSubmission(gradingTarget.id, theoryInputs, overallFeedback.trim(), true);
    setGradingTarget(null);
  };

  const handleBroadcastSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!broadcastMessage.trim() || !broadcastExamId) return;
    sendBroadcast(broadcastExamId, broadcastMessage.trim(), broadcastUrgency);
    setBroadcastMessage("");
    setBroadcastModalOpen(false);
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

            <select
              value={examStatusFilter}
              onChange={(event) => setExamStatusFilter(event.target.value)}
              aria-label="Filter by exam status"
              className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-xs font-bold text-brand-900"
            >
              <option value="ALL">All Statuses</option>
              <option value="live">Live</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
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
      )}

      {activeTab === "monitor" && (
        <AdminSectionCard
          title="Live Invigilation Monitor"
          description="Track active workstations, extend candidate timing, and broadcast instructions."
          action={
            <button
              type="button"
              onClick={() => setBroadcastModalOpen(true)}
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

            <select
              value={monitorStatusFilter}
              onChange={(event) => setMonitorStatusFilter(event.target.value)}
              aria-label="Filter candidate status"
              className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-xs font-bold text-brand-900"
            >
              <option value="ALL">All Candidates</option>
              <option value="active">Active</option>
              <option value="flagged">Flagged</option>
              <option value="offline">Offline Cache</option>
              <option value="submitted">Submitted</option>
            </select>
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
      )}

      {activeTab === "grading" && (
        <AdminSectionCard
          title="Theory Grading Queue"
          description="Score subjective answers and publish official results using the contextual grading modal."
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

            <select
              value={gradingStatusFilter}
              onChange={(event) => setGradingStatusFilter(event.target.value)}
              aria-label="Filter grading status"
              className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-xs font-bold text-brand-900"
            >
              <option value="ALL">All Scripts</option>
              <option value="needs_theory_review">Needs Theory Review</option>
              <option value="published">Published</option>
            </select>
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

            <select
              value={broadsheetSubject}
              onChange={(event) => setBroadsheetSubject(event.target.value)}
              aria-label="Filter by subject"
              className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-xs font-bold text-brand-900"
            >
              <option value="ALL">All Subjects</option>
              {store.subjects.map((sub) => (
                <option key={sub.id} value={sub.code}>
                  {sub.code} · {sub.title}
                </option>
              ))}
            </select>
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

      {/* Contextual Create / Edit Exam Modal */}
      <AdminModal
        open={examModalOpen}
        onOpenChange={setExamModalOpen}
        eyebrow="Assessment Builder"
        title={examForm.id ? "Edit Assessment" : "Create New Exam"}
        description="Configure assessment details and select question items."
        size="lg"
      >
        <form onSubmit={handleSaveExam} className="space-y-4">
          <AdminTextField
            label="Exam Title"
            value={examForm.title}
            onChange={(event) =>
              setExamForm((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="e.g. JSS 3 Mathematics First Term CBT"
            required
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
                Subject
              </label>
              <select
                value={examForm.subjectCode}
                onChange={(event) => {
                  const code = event.target.value;
                  setExamForm((prev) => ({
                    ...prev,
                    subjectCode: code,
                    questionIds: store.questions
                      .filter((q) => q.subjectCode === code)
                      .map((q) => q.id),
                  }));
                }}
                className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-xs font-bold text-ink-primary"
              >
                {store.subjects.map((sub) => (
                  <option key={sub.id} value={sub.code}>
                    {sub.title} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
                Target Class Arm
              </label>
              <select
                value={examForm.classLevel}
                onChange={(event) =>
                  setExamForm((prev) => ({
                    ...prev,
                    classLevel: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-xs font-bold text-ink-primary"
              >
                {store.classArms.map((arm) => (
                  <option key={arm.id} value={arm.name}>
                    {arm.name}
                  </option>
                ))}
              </select>
            </div>

            <AdminTextField
              label="Duration (Minutes)"
              type="number"
              min={5}
              max={180}
              value={String(examForm.durationMinutes)}
              onChange={(event) =>
                setExamForm((prev) => ({
                  ...prev,
                  durationMinutes: Number(event.target.value) || 30,
                }))
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <AdminTextField
              label="Schedule Label"
              value={examForm.scheduledFor}
              onChange={(event) =>
                setExamForm((prev) => ({
                  ...prev,
                  scheduledFor: event.target.value,
                }))
              }
              placeholder="e.g. Fri, Nov 20 · 09:00 AM"
            />
            <div>
              <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
                Status
              </label>
              <select
                value={examForm.status}
                onChange={(event) =>
                  setExamForm((prev) => ({
                    ...prev,
                    status: event.target.value as PortalExam["status"],
                  }))
                }
                className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-xs font-bold text-ink-primary"
              >
                <option value="scheduled">Scheduled</option>
                <option value="live">Live Now</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <AdminTextareaField
            label="Candidate Instructions"
            value={examForm.instructions}
            onChange={(event) =>
              setExamForm((prev) => ({
                ...prev,
                instructions: event.target.value,
              }))
            }
            rows={2}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setExamModalOpen(false)}
              className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 hover:bg-brand-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-surface-primary rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              {examForm.id ? "Save Exam" : "Create Exam"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Contextual Broadcast Notice Modal */}
      <AdminModal
        open={broadcastModalOpen}
        onOpenChange={setBroadcastModalOpen}
        eyebrow="Live Invigilation Notice"
        title="Send Notice to Active Candidates"
        size="md"
      >
        <form onSubmit={handleBroadcastSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
              Target Examination
            </label>
            <select
              value={broadcastExamId}
              onChange={(event) => setBroadcastExamId(event.target.value)}
              className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-xs font-bold text-ink-primary"
            >
              {store.exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
              Notice Urgency
            </label>
            <select
              value={broadcastUrgency}
              onChange={(event) =>
                setBroadcastUrgency(event.target.value as "info" | "warning")
              }
              className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-xs font-bold text-ink-primary"
            >
              <option value="info">Standard Instruction</option>
              <option value="warning">Urgent Reminder</option>
            </select>
          </div>

          <AdminTextareaField
            label="Notice Message"
            value={broadcastMessage}
            onChange={(event) => setBroadcastMessage(event.target.value)}
            placeholder="e.g. You have 10 minutes remaining..."
            rows={3}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setBroadcastModalOpen(false)}
              className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Broadcast Notice
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Contextual Theory Grading Modal */}
      <AdminModal
        open={Boolean(gradingTarget)}
        onOpenChange={(open) => {
          if (!open) setGradingTarget(null);
        }}
        eyebrow={gradingTarget?.admissionNo ?? "Theory Grading"}
        title={
          gradingTarget
            ? `Grade Script · ${gradingTarget.studentName}`
            : "Grade Script"
        }
        description={gradingTarget?.examTitle}
        size="lg"
      >
        {gradingTarget && (
          <form onSubmit={handleSaveGrading} className="space-y-4">
            {Object.entries(theoryInputs).length === 0 ? (
              <p className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 text-xs font-medium text-ink-secondary">
                No subjective theory questions were present on this assessment. You can still attach overall feedback and publish.
              </p>
            ) : (
              Object.entries(theoryInputs).map(([qId, entry]) => {
                const question = store.questions.find((item) => item.id === qId);
                const studentResp = gradingTarget.answers[qId];
                return (
                  <div
                    key={qId}
                    className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 space-y-3"
                  >
                    <p className="text-xs font-extrabold text-brand-950">
                      {question?.prompt ?? "Theory Question"}
                    </p>
                    <div className="rounded-xl border border-brand-100 bg-white p-3 text-xs font-medium text-ink-primary">
                      Candidate answer:{" "}
                      <span className="font-bold">
                        {Array.isArray(studentResp)
                          ? studentResp.join(", ")
                          : String(studentResp || "No response provided")}
                      </span>
                    </div>
                    {question?.markingGuide && (
                      <p className="text-[11px] font-semibold text-emerald-800">
                        Guide: {question.markingGuide}
                      </p>
                    )}
                    <div className="grid gap-3 sm:grid-cols-3">
                      <AdminTextField
                        label={`Score (Max ${entry.maxScore})`}
                        type="number"
                        min={0}
                        max={entry.maxScore}
                        value={String(entry.score)}
                        onChange={(event) => {
                          const raw = Number(event.target.value) || 0;
                          const clamped = Math.max(
                            0,
                            Math.min(entry.maxScore, raw)
                          );
                          setTheoryInputs((prev) => ({
                            ...prev,
                            [qId]: { ...prev[qId], score: clamped },
                          }));
                        }}
                      />
                      <div className="sm:col-span-2">
                        <AdminTextField
                          label="Marker Remark"
                          value={entry.comment}
                          onChange={(event) =>
                            setTheoryInputs((prev) => ({
                              ...prev,
                              [qId]: {
                                ...prev[qId],
                                comment: event.target.value,
                              },
                            }))
                          }
                          placeholder="Brief marking note..."
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <AdminTextareaField
              label="Overall Script Feedback"
              value={overallFeedback}
              onChange={(event) => setOverallFeedback(event.target.value)}
              rows={2}
              placeholder="Summary feedback visible to the student..."
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setGradingTarget(null)}
                className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
              >
                <Activity className="h-3.5 w-3.5" />
                Save & Publish Score
              </button>
            </div>
          </form>
        )}
      </AdminModal>

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
    </div>
  );
}

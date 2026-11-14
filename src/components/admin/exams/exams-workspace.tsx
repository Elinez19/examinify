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
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
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
  AdminTableCell,
  AdminTableHead,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import {
  generateExamPassCode,
  usePortalStore,
} from "@/hooks/portal/use-portal-store";
import type { PortalExam } from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

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

  // Schedule/Edit modal
  const [examModalOpen, setExamModalOpen] = React.useState(false);
  const [examForm, setExamForm] = React.useState({
    id: "",
    title: "",
    subjectCode: store.subjects[0]?.code ?? "MTH-301",
    classLevel: store.classArms[0]?.name ?? "JSS 3A",
    scheduledFor: "Tue, Nov 24 · 09:00 AM",
    durationMinutes: 45,
    passCode: "",
    status: "scheduled" as PortalExam["status"],
    proctoringEnabled: true,
    instructions: "Keep your CBT tab focused. Offline sync is active.",
  });

  // Pass code PIN modal
  const [pinTarget, setPinTarget] = React.useState<PortalExam | null>(null);
  const [pinDraft, setPinDraft] = React.useState("");

  // Broadcast modal
  const [broadcastModalOpen, setBroadcastModalOpen] = React.useState(false);
  const [broadcastMsg, setBroadcastMsg] = React.useState("");

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = React.useState<PortalExam | null>(null);

  const openCreateModal = () => {
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
    setExamModalOpen(true);
  };

  const openEditModal = (exam: PortalExam) => {
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
    setExamModalOpen(true);
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.title.trim()) return;
    const sub = store.subjects.find((s) => s.code === examForm.subjectCode);
    const existing = store.exams.find((item) => item.id === examForm.id);
    const qIds =
      existing?.questionIds.length
        ? existing.questionIds
        : store.questions
            .filter((q) => q.subjectCode === examForm.subjectCode)
            .map((q) => q.id);

    saveExam({
      id: examForm.id || `exam_${Date.now()}`,
      title: examForm.title.trim(),
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
    setExamModalOpen(false);
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
            onClick={openCreateModal}
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter status"
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
                  <tr key={exam.id} className="hover:bg-surface-mist/50 transition-colors">
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
                            onClick: () => openEditModal(exam),
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
      ) : (
        <AdminSectionCard
          title="Proctoring Telemetry & Live Seats"
          description="Monitor focus-loss flags, adjust candidate timers, or broadcast school-wide alerts."
          action={
            <button
              type="button"
              onClick={() => setBroadcastModalOpen(true)}
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
                  <tr key={cand.id} className="hover:bg-surface-mist/50 transition-colors">
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
      )}

      {/* Contextual Schedule / Edit Exam Modal */}
      <AdminModal
        open={examModalOpen}
        onOpenChange={setExamModalOpen}
        eyebrow="Exam Scheduler"
        title={examForm.id ? "Edit Exam Schedule & Proctoring" : "Schedule New Exam"}
        size="lg"
      >
        <form onSubmit={handleSaveExam} className="space-y-4">
          <AdminTextField
            label="Examination Title"
            value={examForm.title}
            onChange={(e) =>
              setExamForm((p) => ({ ...p, title: e.target.value }))
            }
            placeholder="e.g. JSS 3 Mathematics Final CBT"
            required
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
                Subject
              </label>
              <select
                value={examForm.subjectCode}
                onChange={(e) =>
                  setExamForm((p) => ({ ...p, subjectCode: e.target.value }))
                }
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
                Class Arm
              </label>
              <select
                value={examForm.classLevel}
                onChange={(e) =>
                  setExamForm((p) => ({ ...p, classLevel: e.target.value }))
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
              label="Duration (mins)"
              type="number"
              min={5}
              value={String(examForm.durationMinutes)}
              onChange={(e) =>
                setExamForm((p) => ({
                  ...p,
                  durationMinutes: Number(e.target.value) || 30,
                }))
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <AdminTextField
              label="Date & Time Slot"
              value={examForm.scheduledFor}
              onChange={(e) =>
                setExamForm((p) => ({ ...p, scheduledFor: e.target.value }))
              }
            />
            <AdminTextField
              label="Pass Code / PIN"
              value={examForm.passCode}
              onChange={(e) =>
                setExamForm((p) => ({ ...p, passCode: e.target.value }))
              }
              required
            />
            <div>
              <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
                Status
              </label>
              <select
                value={examForm.status}
                onChange={(e) =>
                  setExamForm((p) => ({
                    ...p,
                    status: e.target.value as PortalExam["status"],
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

          <label className="flex items-center gap-2 text-xs font-bold text-brand-900 cursor-pointer">
            <input
              type="checkbox"
              checked={examForm.proctoringEnabled}
              onChange={(e) =>
                setExamForm((p) => ({
                  ...p,
                  proctoringEnabled: e.target.checked,
                }))
              }
              className="h-4 w-4 accent-brand-700"
            />
            Enforce focus-switch proctoring alerts during exam
          </label>

          <AdminTextareaField
            label="Candidate Instructions"
            value={examForm.instructions}
            onChange={(e) =>
              setExamForm((p) => ({ ...p, instructions: e.target.value }))
            }
            rows={2}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setExamModalOpen(false)}
              className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-surface-primary rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Contextual Pass Code / PIN Modal */}
      <AdminModal
        open={Boolean(pinTarget)}
        onOpenChange={(open) => {
          if (!open) setPinTarget(null);
        }}
        eyebrow="Exam Access Control"
        title={
          pinTarget ? `Exam Pass Code · ${pinTarget.subjectCode}` : "Exam PIN"
        }
        description={pinTarget?.title}
        size="sm"
      >
        {pinTarget && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              rotateExamPassCode(pinTarget.id, pinDraft);
              setPinTarget(null);
            }}
            className="space-y-4"
          >
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <AdminTextField
                  label="6-Digit Exam Pass Code / PIN"
                  value={pinDraft}
                  onChange={(e) => setPinDraft(e.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setPinDraft(generateExamPassCode())}
                className="cta-surface-secondary inline-flex h-10 items-center gap-1.5 rounded-xl px-3 font-display text-xs font-extrabold cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPinTarget(null)}
                className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cta-surface-primary rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
              >
                Save Pass Code
              </button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Contextual Proctor Broadcast Modal */}
      <AdminModal
        open={broadcastModalOpen}
        onOpenChange={setBroadcastModalOpen}
        eyebrow="School Proctoring Notice"
        title="Send Proctoring Broadcast"
        size="sm"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!broadcastMsg.trim()) return;
            const liveExamId =
              store.exams.find((ex) => ex.status === "live")?.id ??
              store.exams[0]?.id ??
              "exam_mth_midterm";
            sendBroadcast(liveExamId, broadcastMsg.trim(), "warning");
            setBroadcastMsg("");
            setBroadcastModalOpen(false);
          }}
          className="space-y-4"
        >
          <AdminTextareaField
            label="Proctor Notice"
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
            placeholder="e.g. All candidates remain seated during sync..."
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
              className="cta-surface-primary rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              Broadcast Now
            </button>
          </div>
        </form>
      </AdminModal>

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

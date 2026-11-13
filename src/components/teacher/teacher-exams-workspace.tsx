"use client";

import * as React from "react";
import {
  CheckCircle2,
  Edit3,
  ExternalLink,
  Plus,
  Radio,
  Trash2,
} from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import {
  AdminInlineForm,
  AdminSearchInput,
  AdminSelectField,
  AdminSelectPills,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { AdminSegmentedTabs } from "@/components/admin/ui/admin-segmented-tabs";
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
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { PortalExam, PortalExamStatus } from "@/data/portal-mock-data";

type StatusFilter = "all" | PortalExamStatus;

interface ExamDraft {
  id: string | null;
  code: string;
  title: string;
  subjectId: string;
  classLevel: string;
  status: PortalExamStatus;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: string;
  passMarkPercent: string;
  accessPin: string;
  venue: string;
  allowCalculator: boolean;
  offlineReady: boolean;
  instantResult: boolean;
  questionIds: string[];
}

const EMPTY_EXAM_DRAFT: ExamDraft = {
  id: null,
  code: "",
  title: "",
  subjectId: "sub_math",
  classLevel: "JSS 3A",
  status: "scheduled",
  scheduledDate: "2026-11-16",
  scheduledTime: "09:00 AM",
  durationMinutes: "30",
  passMarkPercent: "50",
  accessPin: "4082",
  venue: "CBT Lab A · Main Campus, Abuja",
  allowCalculator: true,
  offlineReady: true,
  instantResult: false,
  questionIds: [],
};

export function TeacherExamsWorkspace() {
  const { store, saveExam, updateExamStatus, deleteExam } = usePortalStore();
  const toast = useAdminToast();

  const [filter, setFilter] = React.useState<StatusFilter>("all");
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<ExamDraft>(EMPTY_EXAM_DRAFT);

  const filteredExams = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return store.exams.filter((ex) => {
      if (filter !== "all" && ex.status !== filter) return false;
      if (!q) return true;
      return (
        ex.title.toLowerCase().includes(q) ||
        ex.code.toLowerCase().includes(q) ||
        ex.subjectName.toLowerCase().includes(q)
      );
    });
  }, [store.exams, filter, search]);

  const subjectQuestions = React.useMemo(
    () => store.questions.filter((q) => q.subjectId === draft.subjectId),
    [store.questions, draft.subjectId]
  );

  const selectedTotalMarks = React.useMemo(
    () =>
      draft.questionIds.reduce((sum, id) => {
        const q = store.questions.find((item) => item.id === id);
        return sum + (q?.marks ?? 0);
      }, 0),
    [draft.questionIds, store.questions]
  );

  const toggleQuestion = (qId: string) => {
    setDraft((d) => ({
      ...d,
      questionIds: d.questionIds.includes(qId)
        ? d.questionIds.filter((id) => id !== qId)
        : [...d.questionIds, qId],
    }));
  };

  const loadForEdit = (ex: PortalExam) => {
    setDraft({
      id: ex.id,
      code: ex.code,
      title: ex.title,
      subjectId: ex.subjectId,
      classLevel: ex.classLevel,
      status: ex.status,
      scheduledDate: ex.scheduledDate,
      scheduledTime: ex.scheduledTime,
      durationMinutes: String(ex.durationMinutes),
      passMarkPercent: String(ex.passMarkPercent),
      accessPin: ex.accessPin ?? "",
      venue: ex.venue,
      allowCalculator: ex.allowCalculator,
      offlineReady: ex.offlineReady,
      instantResult: ex.instantResult,
      questionIds: ex.questionIds,
    });
    setFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) {
      toast.error("Exam Title Required", "Give this assessment a clear title.");
      return;
    }
    if (draft.questionIds.length === 0) {
      toast.error(
        "Select Questions",
        "Pick at least 1 question from the Question Bank below."
      );
      return;
    }

    const subj =
      store.subjects.find((s) => s.id === draft.subjectId) ?? store.subjects[0];

    const exam: PortalExam = {
      id: draft.id ?? "exm_" + Date.now().toString(36),
      code:
        draft.code.trim() ||
        `EXM-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      title: draft.title.trim(),
      subjectId: subj.id,
      subjectName: subj.title,
      classLevel: draft.classLevel,
      term: store.teacher.term,
      teacherId: store.teacher.id,
      teacherName: store.teacher.name,
      status: draft.status,
      scheduledDate: draft.scheduledDate,
      scheduledTime: draft.scheduledTime,
      durationMinutes: Math.max(5, Number(draft.durationMinutes) || 30),
      passMarkPercent: Math.min(
        100,
        Math.max(1, Number(draft.passMarkPercent) || 50)
      ),
      accessPin: draft.accessPin.trim() || undefined,
      shuffleQuestions: false,
      shuffleOptions: false,
      allowCalculator: draft.allowCalculator,
      offlineReady: draft.offlineReady,
      instantResult: draft.instantResult,
      venue: draft.venue.trim() || "CBT Lab A",
      instructions: [
        "Read every question carefully before submitting.",
        "Answers are saved locally in real time.",
      ],
      questionIds: draft.questionIds,
    };

    saveExam(exam);
    toast.success(
      draft.id ? "Exam Updated" : "CBT Exam Created",
      `${exam.title} (${exam.questionIds.length} questions · ${selectedTotalMarks} marks)`
    );
    setDraft(EMPTY_EXAM_DRAFT);
    setFormOpen(false);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow="CBT Paper Builder & Scheduler"
        eyebrowIcon="pin"
        headline="Exam Builder & Sitting Control."
        highlightWords={["Exam", "Builder"]}
        subtitle="Assemble CBT papers from your Question Bank, set duration, PINs, and offline policies, and publish live to students."
        primaryCta={{
          label: "Create Exam Paper",
          onClick: () => {
            setDraft({
              ...EMPTY_EXAM_DRAFT,
              questionIds: store.questions
                .filter((q) => q.subjectId === "sub_math")
                .slice(0, 3)
                .map((q) => q.id),
            });
            setFormOpen(true);
          },
          variant: "primary",
          icon: <Plus className="h-3.5 w-3.5" />,
        }}
        secondaryCta={{
          label: "Live Monitor",
          href: "/teacher/live-monitor",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <AdminInlineForm
          open={formOpen}
          onOpenChange={setFormOpen}
          eyebrow="Exam Blueprint"
          title={draft.id ? "Edit CBT Exam Paper" : "Assemble New CBT Exam"}
          description="Configure paper timing, access PIN, and select questions from your subject bank."
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <AdminTextField
                label="Exam Title"
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
                placeholder="e.g., JSS 3A Algebra Weekly CBT"
              />
              <AdminSelectField
                label="Subject"
                value={draft.subjectId}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, subjectId: v, questionIds: [] }))
                }
                options={store.subjects.map((s) => ({
                  id: s.id,
                  label: s.title,
                }))}
              />
              <AdminSelectField
                label="Class Arm"
                value={draft.classLevel}
                onChange={(v) => setDraft((d) => ({ ...d, classLevel: v }))}
                options={store.teacher.assignedClasses.map((c) => ({
                  id: c,
                  label: c,
                }))}
              />
              <AdminTextField
                label="Scheduled Date"
                type="date"
                value={draft.scheduledDate}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, scheduledDate: e.target.value }))
                }
              />
              <AdminTextField
                label="Scheduled Time"
                value={draft.scheduledTime}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, scheduledTime: e.target.value }))
                }
              />
              <AdminTextField
                label="Duration (Minutes)"
                type="number"
                min={5}
                max={180}
                value={draft.durationMinutes}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, durationMinutes: e.target.value }))
                }
              />
              <AdminTextField
                label="Gate PIN (Optional)"
                value={draft.accessPin}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, accessPin: e.target.value }))
                }
                placeholder="Leave empty for open entry"
              />
              <AdminTextField
                label="Pass Mark (%)"
                type="number"
                min={1}
                max={100}
                value={draft.passMarkPercent}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, passMarkPercent: e.target.value }))
                }
              />
              <AdminTextField
                label="Exam Venue / Lab"
                value={draft.venue}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, venue: e.target.value }))
                }
              />
            </div>

            <AdminSelectPills
              label="Publication Status"
              columns={5}
              value={draft.status}
              onChange={(v) => setDraft((d) => ({ ...d, status: v }))}
              options={[
                { id: "draft", label: "Draft" },
                { id: "scheduled", label: "Scheduled" },
                { id: "live", label: "Live Now" },
                { id: "practice", label: "Practice" },
                { id: "completed", label: "Completed" },
              ]}
            />

            {/* Policy Toggles */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "allowCalculator" as const, label: "Allow Calculator" },
                { key: "offlineReady" as const, label: "Offline Lab Sync" },
                { key: "instantResult" as const, label: "Instant Objective Result" },
              ].map((toggle) => {
                const active = draft[toggle.key];
                return (
                  <button
                    key={toggle.key}
                    type="button"
                    onClick={() =>
                      setDraft((d) => ({ ...d, [toggle.key]: !d[toggle.key] }))
                    }
                    className={
                      active
                        ? "cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 font-display text-xs font-extrabold cursor-pointer"
                        : "cta-surface-secondary inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 font-display text-xs font-extrabold cursor-pointer"
                    }
                  >
                    {active && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {toggle.label}
                  </button>
                );
              })}
            </div>

            {/* Question Picker */}
            <div className="rounded-2xl border-2 border-brand-100 bg-surface-porcelain p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-xs sm:text-sm font-extrabold text-brand-950">
                  Select Questions from Question Bank
                </p>
                <PillBadge tone="sky" className="px-2.5 py-0.5 text-[11px]">
                  {draft.questionIds.length} Selected · {selectedTotalMarks} Total Marks
                </PillBadge>
              </div>

              {subjectQuestions.length === 0 ? (
                <p className="text-xs font-medium text-ink-secondary">
                  No questions authored for this subject yet. Add items in Question Bank first.
                </p>
              ) : (
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {subjectQuestions.map((q) => {
                    const checked = draft.questionIds.includes(q.id);
                    return (
                      <label
                        key={q.id}
                        className={
                          checked
                            ? "flex items-start gap-2.5 rounded-xl border-2 border-brand-500 bg-brand-50/70 p-2.5 cursor-pointer"
                            : "flex items-start gap-2.5 rounded-xl border border-brand-100 bg-surface-pearl/70 p-2.5 cursor-pointer hover:bg-brand-50/40"
                        }
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleQuestion(q.id)}
                          className="mt-1 h-4 w-4 accent-brand-600"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-xs font-extrabold text-brand-950 line-clamp-1">
                            {q.stem}
                          </p>
                          <p className="text-[11px] font-semibold text-ink-secondary">
                            {q.type.toUpperCase()} · {q.topic} · {q.marks} marks
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <CtaButton
                variant="secondary"
                size="xs"
                type="button"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </CtaButton>
              <CtaButton variant="primary" size="xs" type="submit">
                {draft.id ? "Save Changes" : "Publish Exam"}
              </CtaButton>
            </div>
          </form>
        </AdminInlineForm>

        {/* Filter Bar */}
        <div className="mt-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <AdminSegmentedTabs
            layoutId="teacher-exams-tabs"
            ariaLabel="Filter teacher exams"
            value={filter}
            onChange={setFilter}
            options={[
              { id: "all", label: "All", count: store.exams.length },
              {
                id: "live",
                label: "Live",
                count: store.exams.filter((e) => e.status === "live").length,
              },
              {
                id: "scheduled",
                label: "Scheduled",
                count: store.exams.filter((e) => e.status === "scheduled")
                  .length,
              },
              {
                id: "practice",
                label: "Practice",
                count: store.exams.filter((e) => e.status === "practice").length,
              },
              {
                id: "completed",
                label: "Completed",
                count: store.exams.filter((e) => e.status === "completed")
                  .length,
              },
              {
                id: "draft",
                label: "Draft",
                count: store.exams.filter((e) => e.status === "draft").length,
              },
            ]}
          />

          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search paper title or code..."
          />
        </div>

        {/* Exams Table */}
        <div className="mt-5">
          <AdminDataTable
            title="Authored CBT Exams"
            subtitle="Switch an exam live so students can enter immediately, or preview in the CBT exam hall."
            badge={`${filteredExams.length} Papers`}
          >
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead>Exam Paper</AdminTableHead>
                  <AdminTableHead>Subject & Class</AdminTableHead>
                  <AdminTableHead>Schedule & PIN</AdminTableHead>
                  <AdminTableHead>Items</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead className="text-right">
                    Actions
                  </AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {filteredExams.map((ex) => (
                  <AdminTableRow key={ex.id}>
                    <AdminTableCell>
                      <p className="font-display text-xs sm:text-sm font-extrabold text-brand-950">
                        {ex.title}
                      </p>
                      <p className="font-mono text-[11px] font-semibold text-ink-secondary">
                        {ex.code} · {ex.venue}
                      </p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="font-display text-xs font-extrabold text-brand-950">
                        {ex.subjectName}
                      </p>
                      <p className="text-[11px] font-medium text-ink-secondary">
                        {ex.classLevel}
                      </p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="text-xs font-bold text-brand-950">
                        {ex.scheduledDate} · {ex.scheduledTime}
                      </p>
                      <p className="font-mono text-[11px] text-brand-600">
                        {ex.durationMinutes}m ·{" "}
                        {ex.accessPin ? `PIN ${ex.accessPin}` : "Open PIN"}
                      </p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <PillBadge tone="sky" className="px-2.5 py-0.5 text-[10px]">
                        {ex.questionIds.length} Qs
                      </PillBadge>
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminStatusPill
                        status={
                          ex.status === "live"
                            ? "active"
                            : ex.status === "completed"
                              ? "completed"
                              : "pending"
                        }
                      />
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                        {ex.status !== "live" && ex.status !== "practice" && (
                          <button
                            type="button"
                            onClick={() => {
                              updateExamStatus(ex.id, "live");
                              toast.success(
                                "Exam Is Now Live",
                                `${ex.title} is open for students.`
                              );
                            }}
                            className="inline-flex items-center gap-1 rounded-pill bg-brand-600 px-2.5 py-1 font-display text-[11px] font-extrabold text-ink-on-blue hover:bg-brand-700 cursor-pointer"
                          >
                            <Radio className="h-3 w-3" />
                            Go Live
                          </button>
                        )}
                        <CtaButton
                          variant="secondary"
                          size="xs"
                          href={`/exam/${ex.id}`}
                        >
                          <ExternalLink className="h-3 w-3" />
                          Preview
                        </CtaButton>
                        <button
                          type="button"
                          onClick={() => loadForEdit(ex)}
                          className="inline-flex items-center gap-1 rounded-pill border border-brand-200 bg-surface-porcelain px-2.5 py-1 font-display text-[11px] font-extrabold text-brand-700 hover:bg-brand-50 cursor-pointer"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteExam(ex.id);
                            toast.info("Exam Deleted", ex.title);
                          }}
                          className="inline-flex items-center gap-1 rounded-pill border border-brand-100 bg-surface-pearl px-2.5 py-1 font-display text-[11px] font-extrabold text-accent-warm hover:bg-surface-mist cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
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


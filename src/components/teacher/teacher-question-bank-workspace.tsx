"use client";

import * as React from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import {
  AdminInlineForm,
  AdminSearchInput,
  AdminSelectField,
  AdminSelectPills,
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { AdminSegmentedTabs } from "@/components/admin/ui/admin-segmented-tabs";
import { useAdminToast } from "@/components/admin/ui/admin-toast";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type {
  DifficultyLevel,
  QuestionItem,
  QuestionType,
} from "@/data/portal-mock-data";

type TypeFilter = "all" | QuestionType;

interface QuestionDraft {
  id: string | null;
  subjectId: string;
  classLevel: string;
  topic: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  marks: string;
  stem: string;
  passage: string;
  optA: string;
  optB: string;
  optC: string;
  optD: string;
  correctAnswer: string;
  rubric: string;
  explanation: string;
}

const EMPTY_DRAFT: QuestionDraft = {
  id: null,
  subjectId: "sub_math",
  classLevel: "JSS 3A",
  topic: "",
  type: "mcq",
  difficulty: "medium",
  marks: "5",
  stem: "",
  passage: "",
  optA: "",
  optB: "",
  optC: "",
  optD: "",
  correctAnswer: "A",
  rubric: "",
  explanation: "",
};

export function TeacherQuestionBankWorkspace() {
  const { store, addOrUpdateQuestion, deleteQuestion } = usePortalStore();
  const toast = useAdminToast();

  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all");
  const [subjectFilter, setSubjectFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<QuestionDraft>(EMPTY_DRAFT);

  const filteredQuestions = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return store.questions.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (subjectFilter !== "all" && item.subjectId !== subjectFilter)
        return false;
      if (!q) return true;
      return (
        item.stem.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.subjectName.toLowerCase().includes(q)
      );
    });
  }, [store.questions, typeFilter, subjectFilter, search]);

  const loadForEdit = (item: QuestionItem) => {
    setDraft({
      id: item.id,
      subjectId: item.subjectId,
      classLevel: item.classLevel,
      topic: item.topic,
      type: item.type,
      difficulty: item.difficulty,
      marks: String(item.marks),
      stem: item.stem,
      passage: item.passage ?? "",
      optA: item.options?.[0]?.text ?? "",
      optB: item.options?.[1]?.text ?? "",
      optC: item.options?.[2]?.text ?? "",
      optD: item.options?.[3]?.text ?? "",
      correctAnswer:
        item.correctAnswer ?? (item.type === "true_false" ? "True" : "A"),
      rubric: item.rubric ?? "",
      explanation: item.explanation ?? "",
    });
    setFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.stem.trim() || !draft.topic.trim()) {
      toast.error(
        "Missing Required Fields",
        "Please provide both a topic and question stem."
      );
      return;
    }

    const subj =
      store.subjects.find((s) => s.id === draft.subjectId) ?? store.subjects[0];
    const marksNum = Math.max(1, Number(draft.marks) || 5);

    const options =
      draft.type === "mcq"
        ? [
            { id: "A", label: "A", text: draft.optA || "Option A" },
            { id: "B", label: "B", text: draft.optB || "Option B" },
            { id: "C", label: "C", text: draft.optC || "Option C" },
            { id: "D", label: "D", text: draft.optD || "Option D" },
          ]
        : draft.type === "true_false"
          ? [
              { id: "True", label: "True", text: "True" },
              { id: "False", label: "False", text: "False" },
            ]
          : undefined;

    const item: QuestionItem = {
      id: draft.id ?? "q_" + Date.now().toString(36),
      subjectId: subj.id,
      subjectName: subj.title,
      classLevel: draft.classLevel,
      topic: draft.topic.trim(),
      type: draft.type,
      difficulty: draft.difficulty,
      marks: marksNum,
      stem: draft.stem.trim(),
      passage: draft.passage.trim() || undefined,
      options,
      correctAnswer:
        draft.type === "theory" ? undefined : draft.correctAnswer.trim(),
      rubric: draft.type === "theory" ? draft.rubric.trim() : undefined,
      explanation: draft.explanation.trim() || undefined,
      createdBy: store.teacher.name,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    addOrUpdateQuestion(item);
    toast.success(
      draft.id ? "Question Updated" : "Question Added to Bank",
      `${subj.title} · ${item.topic} (${item.marks} marks)`
    );
    setDraft(EMPTY_DRAFT);
    setFormOpen(false);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow="Curriculum Question Repository"
        eyebrowIcon="shield"
        headline="Question Bank & Authoring Studio."
        highlightWords={["Question", "Authoring"]}
        subtitle="Create objective MCQ, True/False, short-answer, and rubric-backed theory items that sync straight into your CBT Exam Builder."
        primaryCta={{
          label: "New Question",
          onClick: () => {
            setDraft(EMPTY_DRAFT);
            setFormOpen(true);
          },
          variant: "primary",
          icon: <Plus className="h-3.5 w-3.5" />,
        }}
        secondaryCta={{
          label: "Build Exam",
          href: "/teacher/exams",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <AdminInlineForm
          open={formOpen}
          onOpenChange={setFormOpen}
          eyebrow="Question Authoring"
          title={draft.id ? "Edit Question Item" : "Create New Question Item"}
          description="Questions saved here are immediately selectable when assembling a new CBT exam paper."
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <AdminSelectField
                label="Subject"
                value={draft.subjectId}
                onChange={(v) => setDraft((d) => ({ ...d, subjectId: v }))}
                options={store.subjects.map((s) => ({
                  id: s.id,
                  label: s.title,
                }))}
              />
              <AdminSelectField
                label="Class Level"
                value={draft.classLevel}
                onChange={(v) => setDraft((d) => ({ ...d, classLevel: v }))}
                options={store.teacher.assignedClasses.map((c) => ({
                  id: c,
                  label: c,
                }))}
              />
              <AdminTextField
                label="Topic / Strand"
                value={draft.topic}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, topic: e.target.value }))
                }
                placeholder="e.g., Quadratic Equations"
              />
              <AdminTextField
                label="Marks"
                type="number"
                min={1}
                max={50}
                value={draft.marks}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, marks: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AdminSelectPills
                label="Question Type"
                columns={4}
                value={draft.type}
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    type: v,
                    correctAnswer:
                      v === "true_false" ? "True" : v === "mcq" ? "A" : "",
                  }))
                }
                options={[
                  { id: "mcq", label: "MCQ" },
                  { id: "true_false", label: "True/False" },
                  { id: "short_answer", label: "Short Ans" },
                  { id: "theory", label: "Theory" },
                ]}
              />

              <AdminSelectPills
                label="Difficulty Level"
                columns={3}
                value={draft.difficulty}
                onChange={(v) => setDraft((d) => ({ ...d, difficulty: v }))}
                options={[
                  { id: "easy", label: "Easy" },
                  { id: "medium", label: "Medium" },
                  { id: "hard", label: "Hard" },
                ]}
              />
            </div>

            <AdminTextareaField
              label="Question Stem"
              value={draft.stem}
              onChange={(e) =>
                setDraft((d) => ({ ...d, stem: e.target.value }))
              }
              placeholder="Write the exact prompt students will see in the exam hall..."
              rows={3}
            />

            <AdminTextareaField
              label="Optional Comprehension Passage / Context"
              value={draft.passage}
              onChange={(e) =>
                setDraft((d) => ({ ...d, passage: e.target.value }))
              }
              placeholder="Leave blank unless this question references a shared reading passage..."
              rows={2}
            />

            {draft.type === "mcq" && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AdminTextField
                  label="Option A"
                  value={draft.optA}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, optA: e.target.value }))
                  }
                  placeholder="First option..."
                />
                <AdminTextField
                  label="Option B"
                  value={draft.optB}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, optB: e.target.value }))
                  }
                  placeholder="Second option..."
                />
                <AdminTextField
                  label="Option C"
                  value={draft.optC}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, optC: e.target.value }))
                  }
                  placeholder="Third option..."
                />
                <AdminTextField
                  label="Option D"
                  value={draft.optD}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, optD: e.target.value }))
                  }
                  placeholder="Fourth option..."
                />
                <AdminSelectPills
                  label="Correct Option Key"
                  columns={4}
                  value={draft.correctAnswer}
                  onChange={(v) =>
                    setDraft((d) => ({ ...d, correctAnswer: v }))
                  }
                  options={[
                    { id: "A", label: "A" },
                    { id: "B", label: "B" },
                    { id: "C", label: "C" },
                    { id: "D", label: "D" },
                  ]}
                />
              </div>
            )}

            {draft.type === "true_false" && (
              <AdminSelectPills
                label="Correct Key"
                columns={2}
                value={draft.correctAnswer}
                onChange={(v) => setDraft((d) => ({ ...d, correctAnswer: v }))}
                options={[
                  { id: "True", label: "True" },
                  { id: "False", label: "False" },
                ]}
              />
            )}

            {draft.type === "short_answer" && (
              <AdminTextField
                label="Expected Exact Answer"
                value={draft.correctAnswer}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, correctAnswer: e.target.value }))
                }
                placeholder="e.g., 40 or Joule"
              />
            )}

            {draft.type === "theory" && (
              <AdminTextareaField
                label="Marking Guide / Rubric"
                value={draft.rubric}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, rubric: e.target.value }))
                }
                placeholder="Describe mark allocation for method, workings, and final answer..."
                rows={2}
              />
            )}

            <AdminTextField
              label="Answer Explanation (Shown during Practice & Script Review)"
              value={draft.explanation}
              onChange={(e) =>
                setDraft((d) => ({ ...d, explanation: e.target.value }))
              }
              placeholder="Brief explanation of why the answer is correct..."
            />

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <CtaButton
                variant="secondary"
                size="xs"
                type="button"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </CtaButton>
              <CtaButton variant="primary" size="xs" type="submit">
                {draft.id ? "Update Question" : "Save Question"}
              </CtaButton>
            </div>
          </form>
        </AdminInlineForm>

        {/* Filter Controls */}
        <div className="mt-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <AdminSegmentedTabs
            layoutId="teacher-qb-tabs"
            ariaLabel="Filter question types"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { id: "all", label: "All", count: store.questions.length },
              {
                id: "mcq",
                label: "MCQ",
                count: store.questions.filter((q) => q.type === "mcq").length,
              },
              {
                id: "true_false",
                label: "True/False",
                count: store.questions.filter((q) => q.type === "true_false")
                  .length,
              },
              {
                id: "short_answer",
                label: "Short",
                count: store.questions.filter((q) => q.type === "short_answer")
                  .length,
              },
              {
                id: "theory",
                label: "Theory",
                count: store.questions.filter((q) => q.type === "theory").length,
              },
            ]}
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              aria-label="Filter by subject"
              className="h-10 rounded-pill border-2 border-brand-100 bg-surface-porcelain px-3.5 font-display text-xs font-extrabold text-brand-950 shadow-gloss-card cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {store.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>

            <AdminSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search question stem or topic..."
            />
          </div>
        </div>

        {/* Question Cards */}
        <div className="mt-5 space-y-3">
          {filteredQuestions.map((q) => (
            <article key={q.id} className="surface-gloss-card p-4 sm:p-5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <PillBadge tone="blue" className="px-2.5 py-0.5 text-[10px]">
                    {q.subjectName}
                  </PillBadge>
                  <PillBadge tone="sky" className="px-2.5 py-0.5 text-[10px]">
                    {q.type.replace("_", " ").toUpperCase()}
                  </PillBadge>
                  <span className="rounded-pill border border-brand-100 bg-surface-pearl px-2.5 py-0.5 font-display text-[10px] font-extrabold text-brand-700">
                    {q.classLevel} · {q.topic}
                  </span>
                  <span className="rounded-pill border border-brand-100 bg-surface-pearl px-2.5 py-0.5 font-display text-[10px] font-extrabold text-ink-secondary capitalize">
                    {q.difficulty} · {q.marks} Marks
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => loadForEdit(q)}
                    className="inline-flex items-center gap-1 rounded-pill border border-brand-200 bg-surface-porcelain px-2.5 py-1 font-display text-[11px] font-extrabold text-brand-700 hover:bg-brand-50 cursor-pointer"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteQuestion(q.id);
                      toast.info("Question Removed", "Deleted from bank.");
                    }}
                    className="inline-flex items-center gap-1 rounded-pill border border-brand-100 bg-surface-pearl px-2.5 py-1 font-display text-[11px] font-extrabold text-accent-warm hover:bg-surface-mist cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>

              <p className="font-display text-sm sm:text-base font-extrabold text-brand-950">
                {q.stem}
              </p>

              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={
                        q.correctAnswer === opt.id
                          ? "rounded-xl border-2 border-accent-success bg-surface-porcelain px-3 py-1.5 font-bold text-brand-950"
                          : "rounded-xl border border-brand-100 bg-surface-pearl/70 px-3 py-1.5 font-medium text-ink-secondary"
                      }
                    >
                      <span className="font-display font-extrabold mr-1.5">
                        {opt.label}.
                      </span>
                      {opt.text}
                    </div>
                  ))}
                </div>
              )}

              {q.type === "short_answer" && q.correctAnswer && (
                <p className="text-xs font-bold text-accent-success">
                  Answer Key: {q.correctAnswer}
                </p>
              )}

              {q.type === "theory" && q.rubric && (
                <p className="rounded-xl border border-brand-100 bg-surface-pearl px-3 py-2 text-xs font-medium text-ink-secondary">
                  <span className="font-display font-extrabold text-brand-950">
                    Marking Rubric:{" "}
                  </span>
                  {q.rubric}
                </p>
              )}
            </article>
          ))}
        </div>
      </AdminWorkspaceSlab>
    </div>
  );
}


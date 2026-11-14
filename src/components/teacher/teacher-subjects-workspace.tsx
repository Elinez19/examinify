"use client";

import * as React from "react";
import {
  BookOpen,
  Edit3,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import {
  AdminSearchInput,
  AdminSelectField,
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
  QuestionItem,
  QuestionType,
  SubjectEnrollment,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

type SubjectsTab = "subjects" | "questions";
type SubjectSortKey = "code" | "title" | "questions" | "passRate";
type QuestionSortKey = "topic" | "subjectCode" | "type" | "difficulty" | "marks";

interface QuestionFormState {
  id: string;
  subjectCode: string;
  topic: string;
  classLevel: string;
  type: QuestionType;
  difficulty: QuestionItem["difficulty"];
  marks: number;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOptionId: string;
  correctOptionIds: string[];
  acceptedAnswersText: string;
  markingGuide: string;
  explanation: string;
}

export function TeacherSubjectsWorkspace() {
  const { store, activeSessionTerm, addOrUpdateQuestion, deleteQuestion } =
    usePortalStore();

  const [activeTab, setActiveTab] = React.useState<SubjectsTab>("subjects");

  // Subjects table filters & sorting
  const [subSearch, setSubSearch] = React.useState("");
  const [subClassFilter, setSubClassFilter] = React.useState("ALL");
  const [subSortKey, setSubSortKey] = React.useState<SubjectSortKey>("title");
  const [subSortDir, setSubSortDir] = React.useState<SortDirection>("asc");
  const [inspectSubject, setInspectSubject] =
    React.useState<SubjectEnrollment | null>(null);

  // Question Bank table filters & sorting
  const [qSearch, setQSearch] = React.useState("");
  const [qSubjectFilter, setQSubjectFilter] = React.useState("ALL");
  const [qTypeFilter, setQTypeFilter] = React.useState("ALL");
  const [qSortKey, setQSortKey] = React.useState<QuestionSortKey>("subjectCode");
  const [qSortDir, setQSortDir] = React.useState<SortDirection>("asc");

  // Contextual modals
  const [questionModalOpen, setQuestionModalOpen] = React.useState(false);
  const [previewQuestion, setPreviewQuestion] =
    React.useState<QuestionItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<QuestionItem | null>(
    null
  );
  const [formState, setFormState] = React.useState<QuestionFormState>({
    id: "",
    subjectCode: store.subjects[0]?.code ?? "MTH-301",
    topic: "",
    classLevel: store.classArms[0]?.name ?? "JSS 3A",
    type: "objective",
    difficulty: "Standard",
    marks: 2,
    prompt: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOptionId: "a",
    correctOptionIds: ["a"],
    acceptedAnswersText: "",
    markingGuide: "",
    explanation: "",
  });

  const handleSortSubjects = (key: SubjectSortKey) => {
    if (subSortKey === key) {
      setSubSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSubSortKey(key);
      setSubSortDir("asc");
    }
  };

  const handleSortQuestions = (key: QuestionSortKey) => {
    if (qSortKey === key) {
      setQSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setQSortKey(key);
      setQSortDir("asc");
    }
  };

  const openAddQuestionModal = (defaultSubjectCode?: string) => {
    const code = defaultSubjectCode || store.subjects[0]?.code || "MTH-301";
    setFormState({
      id: "",
      subjectCode: code,
      topic: "",
      classLevel: store.classArms[0]?.name ?? "JSS 3A",
      type: "objective",
      difficulty: "Standard",
      marks: 2,
      prompt: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOptionId: "a",
      correctOptionIds: ["a"],
      acceptedAnswersText: "",
      markingGuide: "",
      explanation: "",
    });
    setQuestionModalOpen(true);
  };

  const openEditQuestionModal = (item: QuestionItem) => {
    const optMap = new Map((item.options ?? []).map((opt) => [opt.id, opt.label]));
    setFormState({
      id: item.id,
      subjectCode: item.subjectCode,
      topic: item.topic,
      classLevel: item.classLevel,
      type: item.type,
      difficulty: item.difficulty,
      marks: item.marks,
      prompt: item.prompt,
      optionA: optMap.get("a") ?? "",
      optionB: optMap.get("b") ?? "",
      optionC: optMap.get("c") ?? "",
      optionD: optMap.get("d") ?? "",
      correctOptionId: item.correctOptionId ?? "a",
      correctOptionIds: item.correctOptionIds ?? ["a"],
      acceptedAnswersText: (item.acceptedAnswers ?? []).join(", "),
      markingGuide: item.markingGuide ?? "",
      explanation: item.explanation ?? "",
    });
    setQuestionModalOpen(true);
  };

  const handleSaveQuestion = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.prompt.trim() || !formState.topic.trim()) return;

    const subject =
      store.subjects.find((s) => s.code === formState.subjectCode) ??
      store.subjects[0];

    const options =
      formState.type === "objective" || formState.type === "multi_select"
        ? [
            { id: "a", label: formState.optionA.trim() || "Option A" },
            { id: "b", label: formState.optionB.trim() || "Option B" },
            { id: "c", label: formState.optionC.trim() || "Option C" },
            { id: "d", label: formState.optionD.trim() || "Option D" },
          ]
        : undefined;

    const nextItem: QuestionItem = {
      id: formState.id || `q_${Date.now()}`,
      subjectCode: formState.subjectCode,
      subjectTitle: subject?.title ?? formState.subjectCode,
      topic: formState.topic.trim(),
      classLevel: formState.classLevel,
      term: activeSessionTerm?.term ?? "First Term",
      type: formState.type,
      difficulty: formState.difficulty,
      marks: Number(formState.marks) || 2,
      prompt: formState.prompt.trim(),
      options,
      correctOptionId:
        formState.type === "objective" ? formState.correctOptionId : undefined,
      correctOptionIds:
        formState.type === "multi_select" ? formState.correctOptionIds : undefined,
      acceptedAnswers:
        formState.type === "fill_blank"
          ? formState.acceptedAnswersText
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean)
          : undefined,
      markingGuide:
        formState.type === "theory" ? formState.markingGuide.trim() : undefined,
      explanation: formState.explanation.trim() || undefined,
      createdBy: store.teacher.name,
      updatedAt: "Today",
    };

    addOrUpdateQuestion(nextItem);
    setQuestionModalOpen(false);
  };

  const filteredSubjects = React.useMemo(() => {
    const q = subSearch.trim().toLowerCase();
    const list = store.subjects.filter((sub) => {
      const assignedClasses = sub.assignedClasses ?? [];
      if (
        subClassFilter !== "ALL" &&
        !assignedClasses.includes(subClassFilter)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        (sub.title ?? "").toLowerCase().includes(q) ||
        (sub.code ?? "").toLowerCase().includes(q) ||
        (sub.category ?? "").toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      let cmp = 0;
      const qCountA = store.questions.filter((item) => item.subjectCode === a.code).length;
      const qCountB = store.questions.filter((item) => item.subjectCode === b.code).length;
      if (subSortKey === "code") cmp = (a.code ?? "").localeCompare(b.code ?? "");
      else if (subSortKey === "title") cmp = (a.title ?? "").localeCompare(b.title ?? "");
      else if (subSortKey === "questions") cmp = qCountA - qCountB;
      else if (subSortKey === "passRate") cmp = (a.passRate ?? 0) - (b.passRate ?? 0);
      return subSortDir === "asc" ? cmp : -cmp;
    });
  }, [
    store.questions,
    store.subjects,
    subClassFilter,
    subSearch,
    subSortDir,
    subSortKey,
  ]);

  const filteredQuestions = React.useMemo(() => {
    const q = qSearch.trim().toLowerCase();
    const list = store.questions.filter((item) => {
      if (qSubjectFilter !== "ALL" && item.subjectCode !== qSubjectFilter) {
        return false;
      }
      if (qTypeFilter !== "ALL" && item.type !== qTypeFilter) {
        return false;
      }
      if (!q) return true;
      return (
        (item.prompt ?? "").toLowerCase().includes(q) ||
        (item.topic ?? "").toLowerCase().includes(q) ||
        (item.subjectCode ?? "").toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      let cmp = 0;
      if (qSortKey === "topic") cmp = (a.topic ?? "").localeCompare(b.topic ?? "");
      else if (qSortKey === "subjectCode")
        cmp = (a.subjectCode ?? "").localeCompare(b.subjectCode ?? "");
      else if (qSortKey === "type") cmp = (a.type ?? "").localeCompare(b.type ?? "");
      else if (qSortKey === "difficulty")
        cmp = (a.difficulty ?? "").localeCompare(b.difficulty ?? "");
      else if (qSortKey === "marks") cmp = (a.marks ?? 0) - (b.marks ?? 0);
      return qSortDir === "asc" ? cmp : -cmp;
    });
  }, [qSearch, qSortDir, qSortKey, qSubjectFilter, qTypeFilter, store.questions]);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow={`Curriculum & Question Bank · ${termLabel}`}
        title="Subjects & Question Bank"
        description="Browse assigned subjects and manage objective, multi-select, fill-in-the-blank, and theory items via contextual modals."
        badgeLabel={`${store.questions.length} Bank Items`}
        badgeTone="brand"
        metrics={[
          { label: "Subjects", value: `${store.subjects.length}` },
          { label: "Question Bank", value: `${store.questions.length}` },
          {
            label: "Active Types",
            value: `${store.questionTypes.filter((item) => item.enabled).length}`,
          },
        ]}
        action={
          <button
            type="button"
            onClick={() =>
              openAddQuestionModal(
                qSubjectFilter !== "ALL" ? qSubjectFilter : undefined
              )
            }
            className="cta-surface-secondary inline-flex items-center gap-2 rounded-pill px-5 py-2.5 font-display text-xs font-extrabold transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Question
          </button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("subjects")}
          className={cn(
            "rounded-pill px-4 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer",
            activeTab === "subjects"
              ? "cta-surface-primary text-ink-on-blue"
              : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 shadow-gloss-card hover:bg-surface-mist"
          )}
        >
          Assigned Subjects ({store.subjects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          className={cn(
            "rounded-pill px-4 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer",
            activeTab === "questions"
              ? "cta-surface-primary text-ink-on-blue"
              : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 shadow-gloss-card hover:bg-surface-mist"
          )}
        >
          Question Bank ({store.questions.length})
        </button>
      </div>

      {activeTab === "subjects" ? (
        <AdminSectionCard
          title="Subjects Table"
          description="Sortable, filterable overview of subjects and question coverage."
          action={<BookOpen className="h-4 w-4 text-brand-500" />}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="w-full sm:w-72">
              <AdminSearchInput
                value={subSearch}
                onChange={setSubSearch}
                placeholder="Search subject title or code..."
              />
            </div>

            <AdminSelectField
              variant="filter"
              aria-label="Filter by class"
              value={subClassFilter}
              onChange={setSubClassFilter}
              options={[
                { id: "ALL", label: "All Class Arms" },
                ...store.classArms.map((arm) => ({
                  id: arm.name,
                  label: arm.name,
                })),
              ]}
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-brand-100 bg-surface-pearl">
                <tr>
                  <AdminSortableTableHead
                    label="Code"
                    sortKey="code"
                    activeSortKey={subSortKey}
                    sortDirection={subSortDir}
                    onSort={handleSortSubjects}
                  />
                  <AdminSortableTableHead
                    label="Subject"
                    sortKey="title"
                    activeSortKey={subSortKey}
                    sortDirection={subSortDir}
                    onSort={handleSortSubjects}
                  />
                  <AdminTableHead>Assigned Classes</AdminTableHead>
                  <AdminSortableTableHead
                    label="Bank Items"
                    sortKey="questions"
                    activeSortKey={subSortKey}
                    sortDirection={subSortDir}
                    onSort={handleSortSubjects}
                  />
                  <AdminSortableTableHead
                    label="Pass Rate"
                    sortKey="passRate"
                    activeSortKey={subSortKey}
                    sortDirection={subSortDir}
                    onSort={handleSortSubjects}
                  />
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 bg-white">
                {filteredSubjects.map((subject) => {
                  const bankCount = store.questions.filter(
                    (item) => item.subjectCode === subject.code
                  ).length;
                  return (
                    <tr
                      key={subject.id}
                      className="hover:bg-surface-mist/50 transition-colors"
                    >
                      <AdminTableCell className="font-mono font-bold text-brand-900">
                        {subject.code}
                      </AdminTableCell>
                      <AdminTableCell>
                        <p className="font-extrabold text-brand-950">
                          {subject.title}
                        </p>
                        <p className="text-[11px] font-medium text-ink-secondary">
                          {subject.category}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex flex-wrap gap-1">
                          {(subject.assignedClasses ?? []).map((cls) => (
                            <span
                              key={cls}
                              className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-extrabold text-brand-900"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      </AdminTableCell>
                      <AdminTableCell className="font-bold text-brand-900">
                        {bankCount} items
                      </AdminTableCell>
                      <AdminTableCell className="font-extrabold text-emerald-700">
                        {subject.passRate}%
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${subject.title}`}
                          items={[
                            {
                              id: "browse-bank",
                              label: "View Subject Questions",
                              icon: <BookOpen className="h-3.5 w-3.5" />,
                              onClick: () => {
                                setQSubjectFilter(subject.code);
                                setActiveTab("questions");
                              },
                            },
                            {
                              id: "add-question",
                              label: "Add Question Item",
                              icon: <Plus className="h-3.5 w-3.5" />,
                              variant: "primary",
                              onClick: () => openAddQuestionModal(subject.code),
                            },
                            {
                              id: "inspect-sub",
                              label: "Subject Details",
                              icon: <Eye className="h-3.5 w-3.5" />,
                              onClick: () => setInspectSubject(subject),
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
      ) : (
        <AdminSectionCard
          title="Question Bank Table"
          description="Sort, filter, preview, edit, or remove questions using contextual modals."
          action={
            <button
              type="button"
              onClick={() =>
                openAddQuestionModal(
                  qSubjectFilter !== "ALL" ? qSubjectFilter : undefined
                )
              }
              className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New Question
            </button>
          }
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="w-full sm:w-72">
              <AdminSearchInput
                value={qSearch}
                onChange={setQSearch}
                placeholder="Search question prompt or topic..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <AdminSelectField
                variant="filter"
                aria-label="Filter by subject"
                value={qSubjectFilter}
                onChange={setQSubjectFilter}
                options={[
                  { id: "ALL", label: "All Subjects" },
                  ...store.subjects.map((sub) => ({
                    id: sub.code,
                    label: `${sub.code} · ${sub.title}`,
                  })),
                ]}
              />

              <AdminSelectField
                variant="filter"
                aria-label="Filter by question type"
                value={qTypeFilter}
                onChange={setQTypeFilter}
                options={[
                  { id: "ALL", label: "All Types" },
                  { id: "objective", label: "Objective" },
                  { id: "multi_select", label: "Multi-Select" },
                  { id: "fill_blank", label: "Fill-in-Blank" },
                  { id: "theory", label: "Theory" },
                ]}
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-brand-100 bg-surface-pearl">
                <tr>
                  <AdminSortableTableHead
                    label="Topic & Prompt"
                    sortKey="topic"
                    activeSortKey={qSortKey}
                    sortDirection={qSortDir}
                    onSort={handleSortQuestions}
                  />
                  <AdminSortableTableHead
                    label="Subject"
                    sortKey="subjectCode"
                    activeSortKey={qSortKey}
                    sortDirection={qSortDir}
                    onSort={handleSortQuestions}
                  />
                  <AdminSortableTableHead
                    label="Type"
                    sortKey="type"
                    activeSortKey={qSortKey}
                    sortDirection={qSortDir}
                    onSort={handleSortQuestions}
                  />
                  <AdminSortableTableHead
                    label="Difficulty"
                    sortKey="difficulty"
                    activeSortKey={qSortKey}
                    sortDirection={qSortDir}
                    onSort={handleSortQuestions}
                  />
                  <AdminSortableTableHead
                    label="Marks"
                    sortKey="marks"
                    activeSortKey={qSortKey}
                    sortDirection={qSortDir}
                    onSort={handleSortQuestions}
                  />
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 bg-white">
                {filteredQuestions.length === 0 ? (
                  <tr>
                    <AdminTableCell
                      colSpan={6}
                      className="py-8 text-center text-xs font-medium text-ink-secondary"
                    >
                      No questions match these filters.
                    </AdminTableCell>
                  </tr>
                ) : (
                  filteredQuestions.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-surface-mist/50 transition-colors"
                    >
                      <AdminTableCell className="max-w-sm">
                        <p className="font-extrabold text-brand-950">
                          {item.topic}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-ink-secondary">
                          {item.prompt}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell className="font-mono font-bold text-brand-800">
                        {item.subjectCode}
                      </AdminTableCell>
                      <AdminTableCell>
                        <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-brand-900">
                          {item.type.replace("_", " ")}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell className="font-semibold text-ink-primary">
                        {item.difficulty}
                      </AdminTableCell>
                      <AdminTableCell className="font-extrabold text-brand-950">
                        {item.marks}
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Question actions`}
                          items={[
                            {
                              id: "preview",
                              label: "Preview Question",
                              icon: <Eye className="h-3.5 w-3.5" />,
                              onClick: () => setPreviewQuestion(item),
                            },
                            {
                              id: "edit",
                              label: "Edit Question",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditQuestionModal(item),
                            },
                            {
                              id: "delete",
                              label: "Delete Question",
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              onClick: () => setDeleteTarget(item),
                            },
                          ]}
                        />
                      </AdminTableCell>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AdminSectionCard>
      )}

      {/* Contextual Subject Details Modal */}
      <AdminModal
        open={Boolean(inspectSubject)}
        onOpenChange={(open) => {
          if (!open) setInspectSubject(null);
        }}
        eyebrow={inspectSubject?.code ?? "Subject"}
        title={inspectSubject?.title ?? "Subject Details"}
        description={inspectSubject?.category}
        size="md"
      >
        {inspectSubject && (
          <div className="grid grid-cols-2 gap-3 rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 text-xs">
            <div>
              <span className="block text-[10px] font-bold uppercase text-brand-500">
                Assigned Classes
              </span>
              <span className="font-extrabold text-brand-950">
                {(inspectSubject.assignedClasses ?? []).join(", ") || "All Classes"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-brand-500">
                Syllabus Progress
              </span>
              <span className="font-extrabold text-brand-950">
                {inspectSubject.topicsCovered} / {inspectSubject.totalTopics} Topics
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-brand-500">
                Next CBT Date
              </span>
              <span className="font-extrabold text-brand-950">
                {inspectSubject.nextExamAt}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-brand-500">
                Average Pass Rate
              </span>
              <span className="font-extrabold text-emerald-700">
                {inspectSubject.passRate}%
              </span>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Contextual Question Preview Modal */}
      <AdminModal
        open={Boolean(previewQuestion)}
        onOpenChange={(open) => {
          if (!open) setPreviewQuestion(null);
        }}
        eyebrow={
          previewQuestion
            ? `${previewQuestion.subjectCode} · ${previewQuestion.type.replace("_", " ")}`
            : "Question"
        }
        title={previewQuestion?.topic ?? "Question Preview"}
        size="md"
      >
        {previewQuestion && (
          <div className="space-y-4 text-xs">
            <p className="text-sm font-bold text-brand-950">
              {previewQuestion.prompt}
            </p>
            {previewQuestion.options && (
              <div className="space-y-1.5">
                {previewQuestion.options.map((opt) => (
                  <div
                    key={opt.id}
                    className="rounded-xl border border-brand-100 bg-surface-pearl px-3 py-2 font-semibold text-brand-900"
                  >
                    <span className="uppercase">{opt.id}.</span> {opt.label}
                  </div>
                ))}
              </div>
            )}
            {previewQuestion.markingGuide && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-950">
                <p className="font-extrabold uppercase">Marking Guide</p>
                <p className="mt-1">{previewQuestion.markingGuide}</p>
              </div>
            )}
            {previewQuestion.explanation && (
              <p className="text-ink-secondary">
                Explanation: {previewQuestion.explanation}
              </p>
            )}
          </div>
        )}
      </AdminModal>

      {/* Contextual Add / Edit Question Modal */}
      <AdminModal
        open={questionModalOpen}
        onOpenChange={setQuestionModalOpen}
        eyebrow="Question Bank Authoring"
        title={formState.id ? "Edit Question Item" : "Add Question Item"}
        description="Configure only the fields needed for this CBT question."
        size="lg"
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <AdminSelectField
              label="Subject"
              value={formState.subjectCode}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  subjectCode: val,
                }))
              }
              options={store.subjects.map((sub) => ({
                id: sub.code,
                label: `${sub.title} (${sub.code})`,
              }))}
            />

            <AdminSelectField<QuestionType>
              label="Question Type"
              value={formState.type}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  type: val,
                }))
              }
              options={[
                { id: "objective", label: "Objective" },
                { id: "multi_select", label: "Multi-Select" },
                { id: "fill_blank", label: "Fill-in-Blank" },
                { id: "theory", label: "Theory" },
              ]}
            />

            <AdminTextField
              label="Marks"
              type="number"
              min={1}
              max={50}
              value={String(formState.marks)}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  marks: Number(event.target.value) || 1,
                }))
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <AdminTextField
              label="Topic"
              value={formState.topic}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, topic: event.target.value }))
              }
              placeholder="e.g. Linear Equations"
              required
            />
            <AdminSelectField
              label="Class Arm"
              value={formState.classLevel}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  classLevel: val,
                }))
              }
              options={store.classArms.map((arm) => ({
                id: arm.name,
                label: arm.name,
              }))}
            />
            <AdminSelectField<QuestionItem["difficulty"]>
              label="Difficulty"
              value={formState.difficulty}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  difficulty: val,
                }))
              }
              options={[
                { id: "Easy", label: "Easy" },
                { id: "Standard", label: "Standard" },
                { id: "Challenge", label: "Challenge" },
              ]}
            />
          </div>

          <AdminTextareaField
            label="Question Prompt"
            value={formState.prompt}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, prompt: event.target.value }))
            }
            placeholder="Write the full question prompt..."
            rows={3}
            required
          />

          {(formState.type === "objective" ||
            formState.type === "multi_select") && (
            <div className="grid gap-3 sm:grid-cols-2">
              <AdminTextField
                label="Option A"
                value={formState.optionA}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, optionA: event.target.value }))
                }
              />
              <AdminTextField
                label="Option B"
                value={formState.optionB}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, optionB: event.target.value }))
                }
              />
              <AdminTextField
                label="Option C"
                value={formState.optionC}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, optionC: event.target.value }))
                }
              />
              <AdminTextField
                label="Option D"
                value={formState.optionD}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, optionD: event.target.value }))
                }
              />
            </div>
          )}

          {formState.type === "objective" && (
            <AdminSelectField
              label="Correct Option"
              className="max-w-xs"
              value={formState.correctOptionId}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  correctOptionId: val,
                }))
              }
              options={[
                { id: "a", label: "Option A" },
                { id: "b", label: "Option B" },
                { id: "c", label: "Option C" },
                { id: "d", label: "Option D" },
              ]}
            />
          )}

          {formState.type === "fill_blank" && (
            <AdminTextField
              label="Accepted Answers (comma separated)"
              value={formState.acceptedAnswersText}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  acceptedAnswersText: event.target.value,
                }))
              }
              placeholder="e.g. 2000, 2,000"
            />
          )}

          {formState.type === "theory" && (
            <AdminTextareaField
              label="Marking Guide"
              value={formState.markingGuide}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  markingGuide: event.target.value,
                }))
              }
              rows={2}
              placeholder="Step-by-step mark allocation..."
            />
          )}

          <AdminTextField
            label="Explanation (Optional)"
            value={formState.explanation}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                explanation: event.target.value,
              }))
            }
            placeholder="Displayed during student Study Mode"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setQuestionModalOpen(false)}
              className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 hover:bg-brand-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-surface-primary rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              {formState.id ? "Save Changes" : "Add Question"}
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
        title="Delete Question Item?"
        description={
          deleteTarget
            ? `Remove "${deleteTarget.topic}" from the Question Bank and unlink it from assessments.`
            : undefined
        }
        confirmLabel="Delete Question"
        onConfirm={() => {
          if (deleteTarget) {
            deleteQuestion(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}


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
import { QuestionBankForm, type QuestionBankFormState } from "@/components/forms";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type {
  QuestionItem,
  SubjectEnrollment,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

type SubjectsTab = "subjects" | "questions";
type SubjectSortKey = "code" | "title" | "questions" | "passRate";
type QuestionSortKey = "topic" | "subjectCode" | "type" | "difficulty" | "marks";

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

  // Contextual form & preview dialogs
  const [questionModalOpen, setQuestionModalOpen] = React.useState(false);
  const [previewQuestion, setPreviewQuestion] =
    React.useState<QuestionItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<QuestionItem | null>(
    null
  );
  const [feedbackDialog, setFeedbackDialog] = React.useState<{
    variant: "success" | "warning";
    title: string;
    description: string;
  } | null>(null);
  const questionFormRef = React.useRef<HTMLDivElement | null>(null);
  const [formState, setFormState] = React.useState<QuestionBankFormState>({
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

  const scrollToQuestionForm = () => {
    window.requestAnimationFrame(() => {
      questionFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
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
    setActiveTab("questions");
    setQuestionModalOpen(true);
    scrollToQuestionForm();
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
    setActiveTab("questions");
    setQuestionModalOpen(true);
    scrollToQuestionForm();
  };

  const handleSaveQuestion = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.prompt.trim() || !formState.topic.trim()) {
      setFeedbackDialog({
        variant: "warning",
        title: "Missing Required Details",
        description:
          "Please provide both the question topic and prompt before saving.",
      });
      return;
    }
    const isUpdate = Boolean(formState.id);

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
        formState.type === "multi_select"
          ? formState.correctOptionIds ?? ["a"]
          : undefined,
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
    setFeedbackDialog({
      variant: "success",
      title: isUpdate ? "Question Updated" : "Question Added",
      description: `"${nextItem.topic}" (${nextItem.subjectCode}) has been saved to the Question Bank.`,
    });
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
        <div className="space-y-6">
          <QuestionBankForm
            formRef={questionFormRef}
            open={questionModalOpen}
            onOpenChange={setQuestionModalOpen}
            formState={formState}
            setFormState={setFormState}
            subjects={store.subjects}
            classArms={store.classArms}
            onReset={() => openAddQuestionModal(formState.subjectCode)}
            onSubmit={handleSaveQuestion}
          />

          <AdminSectionCard
            title="Question Bank Table"
            description="Sort, filter, preview, edit, or remove questions using the inline form and detail previews."
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
        </div>
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

      <AdminDialogModal
        open={Boolean(feedbackDialog)}
        onOpenChange={(open) => {
          if (!open) setFeedbackDialog(null);
        }}
        variant={feedbackDialog?.variant ?? "success"}
        eyebrow={feedbackDialog?.variant === "warning" ? "Validation" : "Saved"}
        title={feedbackDialog?.title ?? ""}
        description={feedbackDialog?.description}
        cancelLabel="Done"
      />
    </div>
  );
}


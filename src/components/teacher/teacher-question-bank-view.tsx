"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Edit3, Eye, Layers, Plus, Trash2 } from "lucide-react";
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
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import { QuestionBankForm, type QuestionBankFormState } from "@/components/forms";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { useTableSelection } from "@/hooks/portal/use-table-selection";
import type { QuestionItem } from "@/data/portal-mock-data";

type QuestionSortKey = "topic" | "subjectCode" | "type" | "difficulty" | "marks";

function TeacherQuestionBankInner() {
  const { store, activeSessionTerm, addOrUpdateQuestion, deleteQuestion } =
    usePortalStore();

  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject");

  const [qSearch, setQSearch] = React.useState("");
  const [qSubjectOverride, setQSubjectOverride] = React.useState<string | null>(
    null
  );
  const qSubjectFilter = qSubjectOverride ?? initialSubject ?? "ALL";
  const setQSubjectFilter = (val: string) => setQSubjectOverride(val);

  const [qTypeFilter, setQTypeFilter] = React.useState("ALL");
  const [qSortKey, setQSortKey] = React.useState<QuestionSortKey>("subjectCode");
  const [qSortDir, setQSortDir] = React.useState<SortDirection>("asc");

  const [questionFormOpen, setQuestionFormOpen] = React.useState(false);
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
    classLevel: store.classArms[0]?.name ?? "JSS 3 Superstars",
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

  const openAddQuestionForm = (defaultSubjectCode?: string) => {
    const code = defaultSubjectCode || store.subjects[0]?.code || "MTH-301";
    setFormState({
      id: "",
      subjectCode: code,
      topic: "",
      classLevel: store.classArms[0]?.name ?? "JSS 3 Superstars",
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
    setQuestionFormOpen(true);
    scrollToQuestionForm();
  };

  const openEditQuestionForm = (item: QuestionItem) => {
    const optMap = new Map(
      (item.options ?? []).map((opt) => [opt.id, opt.label])
    );
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
    setQuestionFormOpen(true);
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
    setQuestionFormOpen(false);
    setFeedbackDialog({
      variant: "success",
      title: isUpdate ? "Question Updated" : "Question Added",
      description: `"${nextItem.topic}" (${nextItem.subjectTitle}) has been saved to the Question Bank.`,
    });
  };

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
      else if (qSortKey === "type")
        cmp = (a.type ?? "").localeCompare(b.type ?? "");
      else if (qSortKey === "difficulty")
        cmp = (a.difficulty ?? "").localeCompare(b.difficulty ?? "");
      else if (qSortKey === "marks") cmp = (a.marks ?? 0) - (b.marks ?? 0);
      return qSortDir === "asc" ? cmp : -cmp;
    });
  }, [qSearch, qSortDir, qSortKey, qSubjectFilter, qTypeFilter, store.questions]);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  const selection = useTableSelection(filteredQuestions.map((item) => item.id));

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Class & Subjects · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Question Bank."
        highlightWords={["Question", "Bank."]}
        subtitle="Create, edit, and preview objective, multi-select, fill-in-the-blank, and theory items using the single inline form below."
        primaryCta={{
          label: "Add Question",
          onClick: () =>
            openAddQuestionForm(
              qSubjectFilter !== "ALL" ? qSubjectFilter : undefined
            ),
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Assigned Subjects",
          href: "/teacher/subjects",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <QuestionBankForm
          formRef={questionFormRef}
          open={questionFormOpen}
          onOpenChange={setQuestionFormOpen}
          formState={formState}
          setFormState={setFormState}
          subjects={store.subjects}
          classArms={store.classArms}
          onReset={() => openAddQuestionForm(formState.subjectCode)}
          onSubmit={handleSaveQuestion}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <AdminSearchInput
              value={qSearch}
              onChange={setQSearch}
              placeholder="Search question prompt or topic..."
            />

            <AdminSelectField
              variant="filter"
              aria-label="Filter by subject"
              value={qSubjectFilter}
              onChange={setQSubjectFilter}
              options={[
                { id: "ALL", label: "All Subjects" },
                ...store.subjects.map((sub) => ({
                  id: sub.code,
                  label: sub.title,
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

          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={() =>
              openAddQuestionForm(
                qSubjectFilter !== "ALL" ? qSubjectFilter : undefined
              )
            }
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Question</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Question Bank Repository"
            subtitle="Sort, filter, preview, edit, or remove CBT assessment items."
            badge={`${filteredQuestions.length} items`}
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
            {filteredQuestions.length === 0 ? (
              <AdminEmptyState
                title="No Questions Matched"
                description="Add a new question item or clear your subject/type filters."
                icon={<Layers className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead className="w-10">
                      <AdminCheckbox
                        aria-label="Select all questions"
                        checked={selection.allSelected}
                        indeterminate={selection.someSelected}
                        onChange={(e) => selection.toggleAll(e.target.checked)}
                      />
                    </AdminTableHead>
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
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredQuestions.map((item) => (
                    <AdminTableRow
                      key={item.id}
                      isSelected={selection.isSelected(item.id)}
                    >
                      <AdminTableCell className="w-10">
                        <AdminCheckbox
                          aria-label={`Select ${item.topic}`}
                          checked={selection.isSelected(item.id)}
                          onChange={() => selection.toggleOne(item.id)}
                        />
                      </AdminTableCell>
                      <AdminTableCell className="max-w-sm">
                        <p className="font-display font-extrabold text-brand-950">
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
                        <PillBadge
                          tone="sky"
                          className="px-2.5 py-0.5 text-[10px] uppercase"
                        >
                          {item.type.replace("_", " ")}
                        </PillBadge>
                      </AdminTableCell>
                      <AdminTableCell className="font-semibold text-ink-primary">
                        {item.difficulty}
                      </AdminTableCell>
                      <AdminTableCell className="font-extrabold text-brand-950">
                        {item.marks}
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${item.topic}`}
                          items={[
                            {
                              id: "preview",
                              label: "Preview Question",
                              icon: <Eye className="h-3.5 w-3.5" />,
                              variant: "primary",
                              onClick: () => setPreviewQuestion(item),
                            },
                            {
                              id: "edit",
                              label: "Edit Question",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditQuestionForm(item),
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
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            )}
          </AdminDataTable>
        </div>
      </AdminWorkspaceSlab>

      <AdminModal
        open={Boolean(previewQuestion)}
        onOpenChange={(open) => {
          if (!open) setPreviewQuestion(null);
        }}
        eyebrow={
          previewQuestion
            ? `${previewQuestion.subjectTitle} · ${previewQuestion.type.replace("_", " ")}`
            : "Question"
        }
        title={previewQuestion?.topic ?? "Question Preview"}
        size="md"
        footer={
          <CtaButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setPreviewQuestion(null)}
          >
            Close
          </CtaButton>
        }
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
              <div className="rounded-xl border border-accent-success/40 bg-accent-success/10 p-3 text-brand-950">
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
            ? `Permanently delete "${deleteTarget.topic}" from the Question Bank?`
            : undefined
        }
        confirmLabel="Confirm Delete"
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
        eyebrow={
          feedbackDialog?.variant === "warning" ? "Validation" : "Saved"
        }
        title={feedbackDialog?.title ?? ""}
        description={feedbackDialog?.description}
        cancelLabel="Done"
      />
    </div>
  );
}

export function TeacherQuestionBankWorkspace() {
  return (
    <React.Suspense fallback={null}>
      <TeacherQuestionBankInner />
    </React.Suspense>
  );
}

"use client";

import * as React from "react";
import { Edit3, Layers, Plus, Trash2 } from "lucide-react";
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
import {
  AdminDialogModal,
  type ModalVariant,
} from "@/components/admin/ui/admin-dialog-modal";
import {
  QuestionBankForm,
  type QuestionBankFormState,
} from "@/components/forms";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { useTableSelection } from "@/hooks/portal/use-table-selection";
import type { QuestionItem } from "@/data/portal-mock-data";

export function QuestionBankWorkspace() {
  const { store, activeSessionTerm, addOrUpdateQuestion, deleteQuestion } =
    usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState("ALL");
  const questionFormRef = React.useRef<HTMLDivElement | null>(null);
  const [questionFormOpen, setQuestionFormOpen] = React.useState(false);

  const [questionForm, setQuestionForm] =
    React.useState<QuestionBankFormState>({
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
      acceptedAnswersText: "",
      markingGuide: "",
      explanation: "",
    });

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = React.useState<QuestionItem | null>(
    null
  );

  const scrollToForm = () => {
    setTimeout(() => {
      questionFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  const resetQuestionForm = () => {
    setQuestionForm({
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
      acceptedAnswersText: "",
      markingGuide: "",
      explanation: "",
    });
  };

  const openAddQuestion = () => {
    resetQuestionForm();
    setQuestionFormOpen(true);
    scrollToForm();
  };

  const openEditQuestion = (q: QuestionItem) => {
    const optMap = new Map((q.options ?? []).map((o) => [o.id, o.label]));
    setQuestionForm({
      id: q.id,
      subjectCode: q.subjectCode,
      topic: q.topic,
      classLevel: q.classLevel,
      type: q.type,
      difficulty: q.difficulty,
      marks: q.marks,
      prompt: q.prompt,
      optionA: optMap.get("a") ?? "",
      optionB: optMap.get("b") ?? "",
      optionC: optMap.get("c") ?? "",
      optionD: optMap.get("d") ?? "",
      correctOptionId: q.correctOptionId ?? "a",
      acceptedAnswersText: (q.acceptedAnswers ?? []).join(", "),
      markingGuide: q.markingGuide ?? "",
      explanation: q.explanation ?? "",
    });
    setQuestionFormOpen(true);
    scrollToForm();
  };

  const handleSaveQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!questionForm.topic.trim() || !questionForm.prompt.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Incomplete Question Item",
        description: "Please provide both a topic and question prompt.",
      });
      return;
    }

    const subject = store.subjects.find(
      (s) => s.code === questionForm.subjectCode
    );
    const wasEditing = Boolean(questionForm.id);

    addOrUpdateQuestion({
      id: questionForm.id || `q_${Date.now()}`,
      subjectCode: questionForm.subjectCode,
      subjectTitle: subject?.title ?? questionForm.subjectCode,
      topic: questionForm.topic.trim(),
      classLevel: questionForm.classLevel,
      term: activeSessionTerm?.term ?? "First Term",
      type: questionForm.type,
      difficulty: questionForm.difficulty,
      marks: Number(questionForm.marks) || 2,
      prompt: questionForm.prompt.trim(),
      options:
        questionForm.type === "objective" ||
        questionForm.type === "multi_select"
          ? [
              { id: "a", label: questionForm.optionA || "Option A" },
              { id: "b", label: questionForm.optionB || "Option B" },
              { id: "c", label: questionForm.optionC || "Option C" },
              { id: "d", label: questionForm.optionD || "Option D" },
            ]
          : undefined,
      correctOptionId:
        questionForm.type === "objective"
          ? questionForm.correctOptionId
          : undefined,
      acceptedAnswers:
        questionForm.type === "fill_blank"
          ? questionForm.acceptedAnswersText
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean)
          : undefined,
      markingGuide:
        questionForm.type === "theory" ? questionForm.markingGuide : undefined,
      explanation: questionForm.explanation.trim() || undefined,
      createdBy: "School Administrator",
      updatedAt: "Today",
    });

    setQuestionFormOpen(false);
    resetQuestionForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Question Bank Updated",
      title: wasEditing ? "Question Updated" : "Question Added",
      description: `"${questionForm.topic.trim()}" has been saved to ${questionForm.subjectCode}.`,
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredQuestions = store.questions.filter((item) => {
    if (subjectFilter !== "ALL" && item.subjectCode !== subjectFilter) {
      return false;
    }
    if (!q) return true;
    return (
      item.topic.toLowerCase().includes(q) ||
      item.prompt.toLowerCase().includes(q) ||
      item.subjectCode.toLowerCase().includes(q) ||
      item.classLevel.toLowerCase().includes(q)
    );
  });

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "Academic Setup";

  const selection = useTableSelection(filteredQuestions.map((item) => item.id));

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Academic · ${termLabel}`}
        eyebrowIcon="dot"
        headline="School Question Bank."
        highlightWords={["Question", "Bank."]}
        subtitle="Create, edit, and curate CBT assessment items across all school subjects and class arms."
        primaryCta={{
          label: "Add Bank Question",
          onClick: openAddQuestion,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Question Types",
          href: "/admin/academic/question-types",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <QuestionBankForm
          formRef={questionFormRef}
          open={questionFormOpen}
          onOpenChange={setQuestionFormOpen}
          eyebrow="Admin Question Bank"
          formState={questionForm}
          setFormState={setQuestionForm}
          subjects={store.subjects}
          classArms={store.classArms}
          onReset={resetQuestionForm}
          onSubmit={handleSaveQuestion}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search topic, prompt, or subject..."
            />
            <AdminSelectField
              variant="filter"
              aria-label="Filter by subject"
              value={subjectFilter}
              onChange={setSubjectFilter}
              options={[
                { id: "ALL", label: "All Subjects" },
                ...store.subjects.map((sub) => ({
                  id: sub.code,
                  label: sub.title,
                })),
              ]}
            />
          </div>

          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddQuestion}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Bank Question</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Question Bank Repository"
            subtitle="Browse and edit curated CBT items across subjects."
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
                title="No Questions Found"
                description="Add a bank question or adjust your subject/search filters."
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
                    <AdminTableHead>Topic & Prompt</AdminTableHead>
                    <AdminTableHead>Subject</AdminTableHead>
                    <AdminTableHead>Class</AdminTableHead>
                    <AdminTableHead>Type</AdminTableHead>
                    <AdminTableHead>Marks</AdminTableHead>
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
                      <AdminTableCell className="max-w-md">
                        <p className="font-display font-extrabold text-brand-950">
                          {item.topic}
                        </p>
                        <p className="line-clamp-1 text-[11px] font-medium text-ink-secondary">
                          {item.prompt}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell className="font-mono font-bold text-brand-800">
                        {item.subjectCode}
                      </AdminTableCell>
                      <AdminTableCell className="font-semibold text-brand-900">
                        {item.classLevel}
                      </AdminTableCell>
                      <AdminTableCell>
                        <PillBadge
                          tone="sky"
                          className="px-2.5 py-0.5 text-[10px] uppercase"
                        >
                          {item.type.replace("_", " ")}
                        </PillBadge>
                      </AdminTableCell>
                      <AdminTableCell className="font-bold text-brand-950">
                        {item.marks}
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Manage ${item.topic}`}
                          items={[
                            {
                              id: "edit-q",
                              label: "Edit Question",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditQuestion(item),
                            },
                            {
                              id: "del-q",
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
        title="Delete Question?"
        description={
          deleteTarget
            ? `Permanently delete question "${deleteTarget.topic}"?`
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
    </div>
  );
}

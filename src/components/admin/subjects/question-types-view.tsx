"use client";

import * as React from "react";
import { Edit3, Plus, Power, ShieldCheck } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminSearchInput } from "@/components/admin/ui/admin-form-controls";
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
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import {
  AdminDialogModal,
  type ModalVariant,
} from "@/components/admin/ui/admin-dialog-modal";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { useTableSelection } from "@/hooks/portal/use-table-selection";
import type { QuestionTypeConfig } from "@/data/portal-mock-data";
import {
  QuestionTypeForm,
  type QuestionTypeFormState,
} from "./question-type-form";

export function QuestionTypesWorkspace() {
  const { store, activeSessionTerm, saveQuestionType, toggleQuestionType } =
    usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const formRef = React.useRef<HTMLDivElement | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);

  const [formState, setFormState] = React.useState<QuestionTypeFormState>({
    id: "",
    code: "objective",
    label: "",
    description: "",
    autoGradable: true,
    enabled: true,
  });

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const resetForm = () => {
    setFormState({
      id: "",
      code: "objective",
      label: "",
      description: "",
      autoGradable: true,
      enabled: true,
    });
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
    scrollToForm();
  };

  const openEditForm = (qt: QuestionTypeConfig) => {
    setFormState({
      id: qt.id,
      code: qt.code,
      label: qt.label,
      description: qt.description,
      autoGradable: qt.autoGradable,
      enabled: qt.enabled,
    });
    setFormOpen(true);
    scrollToForm();
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formState.label.trim() || !formState.description.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Missing Format Details",
        description: "Please provide both a label and description.",
      });
      return;
    }

    const wasEditing = Boolean(formState.id);
    saveQuestionType({
      id: formState.id || `qt_${Date.now()}`,
      code: formState.code,
      label: formState.label.trim(),
      description: formState.description.trim(),
      autoGradable: formState.autoGradable,
      enabled: formState.enabled,
    });

    setFormOpen(false);
    resetForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Assessment Format Saved",
      title: wasEditing ? "Question Type Updated" : "Question Type Added",
      description: `"${formState.label.trim()}" has been saved to your CBT assessment formats.`,
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredTypes = store.questionTypes.filter(
    (qt) =>
      !q ||
      qt.label.toLowerCase().includes(q) ||
      qt.code.toLowerCase().includes(q) ||
      qt.description.toLowerCase().includes(q)
  );

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "Academic Setup";

  const selection = useTableSelection(filteredTypes.map((qt) => qt.id));

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Academic · ${termLabel}`}
        eyebrowIcon="dot"
        headline="CBT Question Types."
        highlightWords={["Question", "Types."]}
        subtitle="Enable, disable, and configure supported assessment question formats school-wide."
        primaryCta={{
          label: "Add Question Type",
          onClick: openAddForm,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Question Bank",
          href: "/admin/academic/question-bank",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <QuestionTypeForm
          formRef={formRef}
          open={formOpen}
          onOpenChange={setFormOpen}
          formState={formState}
          setFormState={setFormState}
          onReset={resetForm}
          onSubmit={handleSave}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search question types..."
          />
          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddForm}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Question Type</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Supported Question Types"
            subtitle="All CBT item formats configured for teachers and examinations."
            badge={`${filteredTypes.length} formats`}
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
            {filteredTypes.length === 0 ? (
              <AdminEmptyState
                title="No Question Types Found"
                description="Add a question format or adjust your search filter."
                icon={<ShieldCheck className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead className="w-10">
                      <AdminCheckbox
                        aria-label="Select all question types"
                        checked={selection.allSelected}
                        indeterminate={selection.someSelected}
                        onChange={(e) => selection.toggleAll(e.target.checked)}
                      />
                    </AdminTableHead>
                    <AdminTableHead>Question Type</AdminTableHead>
                    <AdminTableHead>Code</AdminTableHead>
                    <AdminTableHead>Grading Mode</AdminTableHead>
                    <AdminTableHead>Description</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredTypes.map((qt) => (
                    <AdminTableRow
                      key={qt.id}
                      isSelected={selection.isSelected(qt.id)}
                    >
                      <AdminTableCell className="w-10">
                        <AdminCheckbox
                          aria-label={`Select ${qt.label}`}
                          checked={selection.isSelected(qt.id)}
                          onChange={() => selection.toggleOne(qt.id)}
                        />
                      </AdminTableCell>
                      <AdminTableCell className="font-display font-extrabold text-brand-950">
                        {qt.label}
                      </AdminTableCell>
                      <AdminTableCell className="font-mono text-xs font-bold text-brand-800">
                        {qt.code}
                      </AdminTableCell>
                      <AdminTableCell>
                        <PillBadge
                          tone={qt.autoGradable ? "sky" : "porcelain"}
                          className="px-2.5 py-0.5 text-[10px]"
                        >
                          {qt.autoGradable ? "Auto-Graded" : "Rubric Graded"}
                        </PillBadge>
                      </AdminTableCell>
                      <AdminTableCell className="max-w-md text-xs font-medium text-ink-secondary">
                        {qt.description}
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={qt.enabled ? "Active" : "Inactive"}
                          variant={qt.enabled ? "success" : "neutral"}
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${qt.label}`}
                          items={[
                            {
                              id: "toggle-qt",
                              label: qt.enabled
                                ? "Disable Format"
                                : "Enable Format",
                              icon: <Power className="h-3.5 w-3.5" />,
                              variant: "primary",
                              onClick: () => toggleQuestionType(qt.id),
                            },
                            {
                              id: "edit-qt",
                              label: "Edit Question Type",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditForm(qt),
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
    </div>
  );
}

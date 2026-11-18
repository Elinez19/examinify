"use client";

import * as React from "react";
import { CalendarDays, CheckCircle2, Edit3, Plus, Trash2 } from "lucide-react";
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
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { useTableSelection } from "@/hooks/portal/use-table-selection";
import type { AcademicTerm } from "@/data/portal-mock-data";
import {
  AcademicTermForm,
  buildAcademicTermFromForm,
  type AcademicTermFormState,
} from "./academic-term-form";

export function AcademicTermsWorkspace() {
  const {
    store,
    activeSessionTerm,
    saveTermRecord,
    setActiveTermRecord,
    deleteTermRecord,
  } = usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [termFormOpen, setTermFormOpen] = React.useState(false);

  const [termForm, setTermForm] = React.useState<AcademicTermFormState>({
    id: "",
    term: "",
    description: "",
  });

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] =
    React.useState<AcademicTerm | null>(null);

  const resetTermForm = () => {
    setTermForm({
      id: "",
      term: "",
      description: "",
    });
  };

  const openAddTerm = () => {
    resetTermForm();
    setTermFormOpen(true);
  };

  const openEditTerm = (term: AcademicTerm) => {
    setTermForm({
      id: term.id,
      term: term.term,
      description: term.description ?? "",
    });
    setTermFormOpen(true);
  };

  const handleSaveTerm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termForm.term.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Term Required",
        description: "Please enter a term name (e.g. First Term).",
      });
      return;
    }

    const wasEditing = Boolean(termForm.id);
    const saved = buildAcademicTermFromForm(termForm, store.terms);
    saveTermRecord(saved);

    setTermFormOpen(false);
    resetTermForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Academic Terms Updated",
      title: wasEditing ? "Term Updated" : "Term Created",
      description: `"${saved.term}" has been saved to the school terms directory.`,
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredTerms = store.terms.filter(
    (term) =>
      !q ||
      term.term.toLowerCase().includes(q) ||
      term.description.toLowerCase().includes(q)
  );

  const activeBadge = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "Academic Calendar";

  const selection = useTableSelection(filteredTerms.map((term) => term.id));

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Academic · ${activeBadge}`}
        eyebrowIcon="dot"
        headline="Academic Terms."
        highlightWords={["Terms."]}
        subtitle="Create and manage school academic terms, descriptions, and set the active term across all portals."
        primaryCta={{
          label: "New Term",
          onClick: openAddTerm,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Manage Sessions",
          href: "/admin/academic/sessions",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search term or description..."
          />
          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddTerm}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Term</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Academic Terms Directory"
            subtitle="Configure school terms and activate the current term."
            badge={`${filteredTerms.length} terms`}
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
            {filteredTerms.length === 0 ? (
              <AdminEmptyState
                title="No Academic Terms Found"
                description="Create a new academic term or adjust your search query."
                icon={<CalendarDays className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead className="w-10">
                      <AdminCheckbox
                        aria-label="Select all academic terms"
                        checked={selection.allSelected}
                        indeterminate={selection.someSelected}
                        onChange={(e) => selection.toggleAll(e.target.checked)}
                      />
                    </AdminTableHead>
                    <AdminTableHead>Term</AdminTableHead>
                    <AdminTableHead>Description</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredTerms.map((term) => (
                    <AdminTableRow
                      key={term.id}
                      isSelected={selection.isSelected(term.id) || term.isActive}
                    >
                      <AdminTableCell className="w-10">
                        <AdminCheckbox
                          aria-label={`Select ${term.term}`}
                          checked={selection.isSelected(term.id)}
                          onChange={() => selection.toggleOne(term.id)}
                        />
                      </AdminTableCell>
                      <AdminTableCell className="font-display font-extrabold text-brand-950">
                        {term.term}
                      </AdminTableCell>
                      <AdminTableCell className="max-w-md font-medium text-ink-secondary">
                        <span className="line-clamp-2">
                          {term.description || "—"}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={term.isActive ? "Active" : "Inactive"}
                          variant={term.isActive ? "success" : "neutral"}
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${term.term}`}
                          items={[
                            {
                              id: "activate-term",
                              label: term.isActive
                                ? "Currently Active Term"
                                : "Set Active Term",
                              icon: <CheckCircle2 className="h-3.5 w-3.5" />,
                              variant: "primary",
                              disabled: term.isActive,
                              onClick: () => setActiveTermRecord(term.id),
                            },
                            {
                              id: "edit-term",
                              label: "Edit Term",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditTerm(term),
                            },
                            {
                              id: "del-term",
                              label: "Remove Term",
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              disabled: term.isActive,
                              onClick: () => setDeleteTarget(term),
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

      <AcademicTermForm
        open={termFormOpen}
        onOpenChange={setTermFormOpen}
        formState={termForm}
        setFormState={setTermForm}
        onReset={resetTermForm}
        onSubmit={handleSaveTerm}
      />

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
        title="Remove Academic Term?"
        description={
          deleteTarget
            ? `Permanently delete "${deleteTarget.term}" from the terms directory?`
            : undefined
        }
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteTermRecord(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

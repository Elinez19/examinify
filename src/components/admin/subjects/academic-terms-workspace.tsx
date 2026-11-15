"use client";

import * as React from "react";
import { CalendarDays, CheckCircle2, Edit3, Plus, Trash2 } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminSearchInput } from "@/components/admin/ui/admin-form-controls";
import {
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
import type { AcademicSessionTerm } from "@/data/portal-mock-data";
import {
  AcademicTermForm,
  type AcademicTermFormState,
} from "./academic-term-form";

export function AcademicTermsWorkspace() {
  const {
    store,
    activeSessionTerm,
    saveAcademicTerm,
    setActiveAcademicTerm,
    deleteAcademicTerm,
  } = usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const termFormRef = React.useRef<HTMLDivElement | null>(null);
  const [termFormOpen, setTermFormOpen] = React.useState(false);

  const [termForm, setTermForm] = React.useState<AcademicTermFormState>({
    id: "",
    session: "2026/2027",
    term: "Third Term",
    startsAt: "Apr 19, 2027",
    endsAt: "Jul 23, 2027",
    isActive: false,
  });

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] =
    React.useState<AcademicSessionTerm | null>(null);

  const scrollToForm = () => {
    setTimeout(() => {
      termFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  const resetTermForm = () => {
    setTermForm({
      id: "",
      session: "2026/2027",
      term: "Third Term",
      startsAt: "Apr 19, 2027",
      endsAt: "Jul 23, 2027",
      isActive: false,
    });
  };

  const openAddTerm = () => {
    resetTermForm();
    setTermFormOpen(true);
    scrollToForm();
  };

  const openEditTerm = (term: AcademicSessionTerm) => {
    setTermForm({
      id: term.id,
      session: term.session,
      term: term.term,
      startsAt: term.startsAt,
      endsAt: term.endsAt,
      isActive: term.isActive,
    });
    setTermFormOpen(true);
    scrollToForm();
  };

  const handleSaveTerm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termForm.session.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Session Required",
        description: "Please enter an academic session (e.g. 2026/2027).",
      });
      return;
    }

    const wasEditing = Boolean(termForm.id);
    saveAcademicTerm({
      id: termForm.id || `term_${Date.now()}`,
      session: termForm.session.trim(),
      term: termForm.term,
      startsAt: termForm.startsAt.trim(),
      endsAt: termForm.endsAt.trim(),
      isActive: termForm.isActive,
    });

    setTermFormOpen(false);
    resetTermForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Academic Calendar Updated",
      title: wasEditing ? "Session / Term Updated" : "Session / Term Added",
      description: `${termForm.term} · ${termForm.session} has been saved to the academic calendar.`,
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredTerms = store.academicTerms.filter(
    (term) =>
      !q ||
      term.session.toLowerCase().includes(q) ||
      term.term.toLowerCase().includes(q)
  );

  const activeBadge = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "Academic Calendar";

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Academic · ${activeBadge}`}
        eyebrowIcon="dot"
        headline="Sessions & Academic Terms."
        highlightWords={["Sessions", "Terms."]}
        subtitle="Configure school sessions, term date windows, and set the active term across Student, Teacher, and Admin portals."
        primaryCta={{
          label: "Add Session / Term",
          onClick: openAddTerm,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Class Arms",
          href: "/admin/academic/classes",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <AcademicTermForm
          formRef={termFormRef}
          open={termFormOpen}
          onOpenChange={setTermFormOpen}
          formState={termForm}
          setFormState={setTermForm}
          onReset={resetTermForm}
          onSubmit={handleSaveTerm}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search session or term..."
          />
          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddTerm}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Session / Term</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Academic Sessions & Terms"
            subtitle="Activate the current school term or adjust session window dates."
            badge={`${filteredTerms.length} terms`}
          >
            {filteredTerms.length === 0 ? (
              <AdminEmptyState
                title="No Academic Terms Found"
                description="Create a new academic session and term to organize examinations."
                icon={<CalendarDays className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead>Session</AdminTableHead>
                    <AdminTableHead>Term</AdminTableHead>
                    <AdminTableHead>Start Date</AdminTableHead>
                    <AdminTableHead>End Date</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredTerms.map((term) => (
                    <AdminTableRow key={term.id} isSelected={term.isActive}>
                      <AdminTableCell className="font-mono font-extrabold text-brand-900">
                        {term.session}
                      </AdminTableCell>
                      <AdminTableCell className="font-display font-extrabold text-brand-950">
                        {term.term}
                      </AdminTableCell>
                      <AdminTableCell className="font-medium text-ink-secondary">
                        {term.startsAt}
                      </AdminTableCell>
                      <AdminTableCell className="font-medium text-ink-secondary">
                        {term.endsAt}
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={term.isActive ? "Active" : "Inactive"}
                          variant={term.isActive ? "success" : "neutral"}
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${term.term} ${term.session}`}
                          items={[
                            {
                              id: "activate-term",
                              label: term.isActive
                                ? "Currently Active Term"
                                : "Set Active Term",
                              icon: <CheckCircle2 className="h-3.5 w-3.5" />,
                              variant: "primary",
                              disabled: term.isActive,
                              onClick: () => setActiveAcademicTerm(term.id),
                            },
                            {
                              id: "edit-term",
                              label: "Edit Term Details",
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
            ? `Permanently delete "${deleteTarget.term} · ${deleteTarget.session}"?`
            : undefined
        }
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteAcademicTerm(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

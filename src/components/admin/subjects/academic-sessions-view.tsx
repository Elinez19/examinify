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
import type { AcademicSession } from "@/data/portal-mock-data";
import {
  AcademicSessionForm,
  buildAcademicSessionFromForm,
  type AcademicSessionFormState,
} from "./academic-session-form";

function formatSessionDate(value: string): string {
  if (!value) return "—";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function AcademicSessionsWorkspace() {
  const {
    store,
    activeSessionTerm,
    saveAcademicSession,
    setActiveAcademicSession,
    deleteAcademicSession,
  } = usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [sessionFormOpen, setSessionFormOpen] = React.useState(false);

  const [sessionForm, setSessionForm] = React.useState<AcademicSessionFormState>(
    {
      id: "",
      session: "",
      description: "",
      startDate: "",
      stopDate: "",
    }
  );

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] =
    React.useState<AcademicSession | null>(null);

  const resetSessionForm = () => {
    setSessionForm({
      id: "",
      session: "",
      description: "",
      startDate: "",
      stopDate: "",
    });
  };

  const openAddSession = () => {
    resetSessionForm();
    setSessionFormOpen(true);
  };

  const openEditSession = (session: AcademicSession) => {
    setSessionForm({
      id: session.id,
      session: session.session,
      description: session.description ?? "",
      startDate: session.startDate,
      stopDate: session.stopDate,
    });
    setSessionFormOpen(true);
  };

  const handleSaveSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !sessionForm.session.trim() ||
      !sessionForm.startDate.trim() ||
      !sessionForm.stopDate.trim()
    ) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Missing Required Fields",
        description:
          "Please provide Session, Start Date, and Stop Date before saving.",
      });
      return;
    }

    if (sessionForm.stopDate < sessionForm.startDate) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Invalid Date Range",
        description: "Stop Date must be on or after the Start Date.",
      });
      return;
    }

    const wasEditing = Boolean(sessionForm.id);
    const saved = buildAcademicSessionFromForm(
      sessionForm,
      store.academicSessions
    );
    saveAcademicSession(saved);

    setSessionFormOpen(false);
    resetSessionForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Academic Calendar Updated",
      title: wasEditing ? "Session Updated" : "Session Created",
      description: `"${saved.session}" has been saved to the academic sessions directory.`,
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredSessions = store.academicSessions.filter(
    (item) =>
      !q ||
      item.session.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
  );

  const activeBadge = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "Academic Calendar";

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Academic · ${activeBadge}`}
        eyebrowIcon="dot"
        headline="Academic Sessions."
        highlightWords={["Sessions."]}
        subtitle="Create and manage school academic sessions, descriptions, and start/stop calendar dates."
        primaryCta={{
          label: "New Session",
          onClick: openAddSession,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Manage Terms",
          href: "/admin/academic/terms",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search session or description..."
          />
          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddSession}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Session</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Academic Sessions Directory"
            subtitle="Configure school sessions, calendar boundaries, and set the active session."
            badge={`${filteredSessions.length} sessions`}
          >
            {filteredSessions.length === 0 ? (
              <AdminEmptyState
                title="No Academic Sessions Found"
                description="Create a new academic session or adjust your search query."
                icon={<CalendarDays className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead>Session</AdminTableHead>
                    <AdminTableHead>Description</AdminTableHead>
                    <AdminTableHead>Start Date</AdminTableHead>
                    <AdminTableHead>Stop Date</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredSessions.map((item) => (
                    <AdminTableRow key={item.id} isSelected={item.isActive}>
                      <AdminTableCell className="font-mono font-extrabold text-brand-950">
                        {item.session}
                      </AdminTableCell>
                      <AdminTableCell className="max-w-sm font-medium text-ink-secondary">
                        <span className="line-clamp-2">
                          {item.description || "—"}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell className="font-medium text-ink-secondary">
                        {formatSessionDate(item.startDate)}
                      </AdminTableCell>
                      <AdminTableCell className="font-medium text-ink-secondary">
                        {formatSessionDate(item.stopDate)}
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={item.isActive ? "Active" : "Inactive"}
                          variant={item.isActive ? "success" : "neutral"}
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${item.session}`}
                          items={[
                            {
                              id: "activate-session",
                              label: item.isActive
                                ? "Currently Active Session"
                                : "Set Active Session",
                              icon: <CheckCircle2 className="h-3.5 w-3.5" />,
                              variant: "primary",
                              disabled: item.isActive,
                              onClick: () => setActiveAcademicSession(item.id),
                            },
                            {
                              id: "edit-session",
                              label: "Edit Session",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditSession(item),
                            },
                            {
                              id: "del-session",
                              label: "Remove Session",
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              disabled: item.isActive,
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

      <AcademicSessionForm
        open={sessionFormOpen}
        onOpenChange={setSessionFormOpen}
        formState={sessionForm}
        setFormState={setSessionForm}
        onReset={resetSessionForm}
        onSubmit={handleSaveSession}
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
        title="Remove Academic Session?"
        description={
          deleteTarget
            ? `Permanently delete "${deleteTarget.session}" from the academic sessions directory?`
            : undefined
        }
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteAcademicSession(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

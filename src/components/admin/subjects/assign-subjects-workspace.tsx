"use client";

import * as React from "react";
import { ClipboardList, Edit3, Plus, Trash2 } from "lucide-react";
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
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import {
  AssignSubjectModal,
  type AssignSubjectDraftRow,
} from "./assign-subject-modal";

interface SubjectClassAssignmentRow {
  rowKey: string;
  subjectId: string;
  subjectTitle: string;
  subjectCode: string;
  className: string;
  branch: string;
  description: string;
}

export function AssignSubjectsWorkspace() {
  const {
    store,
    activeSessionTerm,
    assignSubjectsToClass,
    removeSubjectClassAssignments,
  } = usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [classFilter, setClassFilter] = React.useState("ALL");
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalSessionKey, setModalSessionKey] = React.useState(0);
  const [modalClassName, setModalClassName] = React.useState<string>("");
  const [modalBranch, setModalBranch] = React.useState<string>("");

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [singleDeleteTarget, setSingleDeleteTarget] =
    React.useState<SubjectClassAssignmentRow | null>(null);

  const assignmentRows = React.useMemo<SubjectClassAssignmentRow[]>(() => {
    const rows: SubjectClassAssignmentRow[] = [];
    for (const sub of store.subjects) {
      for (const cls of sub.assignedClasses) {
        rows.push({
          rowKey: `${sub.id}::${cls}`,
          subjectId: sub.id,
          subjectTitle: sub.title,
          subjectCode: sub.code,
          className: cls,
          branch: sub.schoolBranch || "Main Campus (Guzape)",
          description: sub.classDescriptions?.[cls] ?? "",
        });
      }
    }
    return rows.sort((a, b) =>
      a.subjectTitle.localeCompare(b.subjectTitle) ||
      a.className.localeCompare(b.className)
    );
  }, [store.subjects]);

  const q = searchQuery.trim().toLowerCase();
  const filteredRows = React.useMemo(() => {
    return assignmentRows.filter((row) => {
      if (classFilter !== "ALL" && row.className !== classFilter) return false;
      if (!q) return true;
      return (
        row.subjectTitle.toLowerCase().includes(q) ||
        row.subjectCode.toLowerCase().includes(q) ||
        row.className.toLowerCase().includes(q) ||
        row.branch.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q)
      );
    });
  }, [assignmentRows, classFilter, q]);

  const allFilteredSelected =
    filteredRows.length > 0 &&
    filteredRows.every((row) => selectedRowKeys.includes(row.rowKey));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(filteredRows.map((row) => row.rowKey));
    }
  };

  const toggleSelectOne = (rowKey: string) => {
    setSelectedRowKeys((prev) =>
      prev.includes(rowKey)
        ? prev.filter((item) => item !== rowKey)
        : [...prev, rowKey]
    );
  };

  const openAssignModal = (className?: string, branch?: string) => {
    setModalClassName(className || store.classArms[0]?.name || "");
    setModalBranch(branch || "Main Campus (Guzape)");
    setModalSessionKey((prev) => prev + 1);
    setModalOpen(true);
  };

  const handleSaveModal = (payload: {
    branch: string;
    className: string;
    rows: AssignSubjectDraftRow[];
  }) => {
    assignSubjectsToClass(payload.className, payload.branch, payload.rows);
    setModalOpen(false);
    const totalAssigned = payload.rows.filter((r) => r.assigned).length;
    setFeedbackModal({
      variant: "success",
      eyebrow: "Class Curriculum Updated",
      title: "Subjects Assigned to Class",
      description: `${totalAssigned} subject(s) are now assigned to ${payload.className}.`,
    });
  };

  const handleBulkDelete = () => {
    const pairs = assignmentRows
      .filter((row) => selectedRowKeys.includes(row.rowKey))
      .map((row) => ({ subjectId: row.subjectId, className: row.className }));
    if (pairs.length > 0) {
      removeSubjectClassAssignments(pairs);
    }
    setSelectedRowKeys([]);
    setConfirmDeleteOpen(false);
  };

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "Academic Setup";

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Academic · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Assign Subject(s) To Class."
        highlightWords={["Assign", "Subject(s)"]}
        subtitle="Allocate school subjects to class arms using a single checklist modal and manage existing class–subject mappings below."
        primaryCta={{
          label: "Add | Edit Assignment",
          onClick: () => openAssignModal(),
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "All Subjects",
          href: "/admin/subjects",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <CtaButton
              type="button"
              variant="primary"
              size="sm"
              onClick={() => openAssignModal()}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add | Edit</span>
            </CtaButton>

            {selectedRowKeys.length > 0 && (
              <CtaButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setConfirmDeleteOpen(true)}
                className="border-accent-warm/40 text-accent-warm-deep"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete ({selectedRowKeys.length})</span>
              </CtaButton>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AdminSelectField
              variant="filter"
              aria-label="Filter by class arm"
              value={classFilter}
              onChange={setClassFilter}
              options={[
                { id: "ALL", label: "All Classes" },
                ...store.classArms.map((arm) => ({
                  id: arm.name,
                  label: arm.name,
                })),
              ]}
            />
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search subject, class, or branch..."
            />
          </div>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Class Subject Allocations"
            subtitle="Tick rows to remove in bulk, or click Add | Edit to assign subjects in the modal."
            badge={`${filteredRows.length} assignments`}
            selectedCount={selectedRowKeys.length}
            bulkActions={
              <CtaButton
                type="button"
                variant="secondary"
                size="xs"
                onClick={() => setConfirmDeleteOpen(true)}
                className="border-accent-warm/50 text-accent-warm-deep"
              >
                <Trash2 className="h-3 w-3" />
                <span>Remove Selected</span>
              </CtaButton>
            }
          >
            {filteredRows.length === 0 ? (
              <AdminEmptyState
                title="No Class Assignments Yet"
                description="Use the Add | Edit button to assign subjects to any class arm."
                icon={<ClipboardList className="h-5 w-5 text-accent-sky" />}
                action={
                  <CtaButton
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => openAssignModal()}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Assign Subjects</span>
                  </CtaButton>
                }
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead className="w-10">
                      <AdminCheckbox
                        checked={allFilteredSelected}
                        onChange={toggleSelectAll}
                        aria-label="Select all assignments"
                      />
                    </AdminTableHead>
                    <AdminTableHead>Subject</AdminTableHead>
                    <AdminTableHead>Class Name</AdminTableHead>
                    <AdminTableHead>Branch</AdminTableHead>
                    <AdminTableHead>Description</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredRows.map((row) => {
                    const isSelected = selectedRowKeys.includes(row.rowKey);
                    return (
                      <AdminTableRow key={row.rowKey} isSelected={isSelected}>
                        <AdminTableCell>
                          <AdminCheckbox
                            checked={isSelected}
                            onChange={() => toggleSelectOne(row.rowKey)}
                            aria-label={`Select ${row.subjectTitle} for ${row.className}`}
                          />
                        </AdminTableCell>
                        <AdminTableCell>
                          <p className="font-display font-extrabold uppercase tracking-tight text-brand-950">
                            {row.subjectTitle}
                          </p>
                          <p className="font-mono text-[10px] font-bold text-ink-secondary">
                            {row.subjectCode}
                          </p>
                        </AdminTableCell>
                        <AdminTableCell>
                          <PillBadge
                            tone="sky"
                            className="px-2.5 py-0.5 text-[10px]"
                          >
                            {row.className}
                          </PillBadge>
                        </AdminTableCell>
                        <AdminTableCell className="font-semibold text-brand-800">
                          {row.branch}
                        </AdminTableCell>
                        <AdminTableCell className="text-xs font-medium text-ink-secondary">
                          {row.description || "—"}
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                          <AdminActionMenu
                            ariaLabel={`Actions for ${row.subjectTitle} in ${row.className}`}
                            items={[
                              {
                                id: "edit-class-subjects",
                                label: `Edit ${row.className} Subjects`,
                                icon: <Edit3 className="h-3.5 w-3.5" />,
                                variant: "primary",
                                onClick: () =>
                                  openAssignModal(row.className, row.branch),
                              },
                              {
                                id: "remove-assignment",
                                label: "Remove Assignment",
                                icon: <Trash2 className="h-3.5 w-3.5" />,
                                variant: "danger",
                                dividerBefore: true,
                                onClick: () => setSingleDeleteTarget(row),
                              },
                            ]}
                          />
                        </AdminTableCell>
                      </AdminTableRow>
                    );
                  })}
                </AdminTableBody>
              </AdminTable>
            )}
          </AdminDataTable>
        </div>
      </AdminWorkspaceSlab>

      <AssignSubjectModal
        key={modalSessionKey}
        open={modalOpen}
        onOpenChange={setModalOpen}
        classArms={store.classArms}
        subjects={store.subjects}
        initialClassName={modalClassName}
        initialBranch={modalBranch}
        onSave={handleSaveModal}
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
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        variant="danger"
        title="Remove Selected Assignments?"
        description={`Unassign ${selectedRowKeys.length} selected subject–class record(s)?`}
        confirmLabel="Remove Selected"
        onConfirm={handleBulkDelete}
      />

      <AdminDialogModal
        open={Boolean(singleDeleteTarget)}
        onOpenChange={(open) => {
          if (!open) setSingleDeleteTarget(null);
        }}
        variant="danger"
        title="Remove Subject Assignment?"
        description={
          singleDeleteTarget
            ? `Unassign "${singleDeleteTarget.subjectTitle}" from ${singleDeleteTarget.className}?`
            : undefined
        }
        confirmLabel="Remove"
        onConfirm={() => {
          if (singleDeleteTarget) {
            removeSubjectClassAssignments([
              {
                subjectId: singleDeleteTarget.subjectId,
                className: singleDeleteTarget.className,
              },
            ]);
            setSingleDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

"use client";

import * as React from "react";
import { Save } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminSelectField } from "@/components/admin/ui/admin-form-controls";
import {
  AdminCheckbox,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/ui/admin-data-table";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { SCHOOL_BRANCH_OPTIONS } from "@/components/forms/registration-options";
import type { ClassArm, SubjectEnrollment } from "@/data/portal-mock-data";

export interface AssignSubjectDraftRow {
  subjectId: string;
  assigned: boolean;
  description: string;
}

export interface AssignSubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classArms: ClassArm[];
  subjects: SubjectEnrollment[];
  initialClassName?: string;
  initialBranch?: string;
  onSave: (payload: {
    branch: string;
    className: string;
    rows: AssignSubjectDraftRow[];
  }) => void;
}

function buildDraftRows(
  subjects: SubjectEnrollment[],
  className: string
): Record<string, AssignSubjectDraftRow> {
  const map: Record<string, AssignSubjectDraftRow> = {};
  for (const sub of subjects) {
    map[sub.id] = {
      subjectId: sub.id,
      assigned: sub.assignedClasses.includes(className),
      description: sub.classDescriptions?.[className] ?? "",
    };
  }
  return map;
}

export function AssignSubjectModal({
  open,
  onOpenChange,
  classArms,
  subjects,
  initialClassName,
  initialBranch,
  onSave,
}: AssignSubjectModalProps) {
  const defaultClass = initialClassName || classArms[0]?.name || "";
  const defaultBranch =
    initialBranch ||
    classArms.find((arm) => arm.name === defaultClass)?.schoolBranch ||
    SCHOOL_BRANCH_OPTIONS[0].id;

  const [className, setClassName] = React.useState(defaultClass);
  const resolvedBranch =
    classArms.find((arm) => arm.name === className)?.schoolBranch ||
    defaultBranch;
  const [drafts, setDrafts] = React.useState<
    Record<string, AssignSubjectDraftRow>
  >(() => buildDraftRows(subjects, defaultClass));

  const handleClassChange = (nextClass: string) => {
    setClassName(nextClass);
    setDrafts(buildDraftRows(subjects, nextClass));
  };

  const toggleSubject = (subjectId: string) => {
    setDrafts((prev) => {
      const current = prev[subjectId] ?? {
        subjectId,
        assigned: false,
        description: "",
      };
      return {
        ...prev,
        [subjectId]: {
          ...current,
          assigned: !current.assigned,
        },
      };
    });
  };

  const updateDescription = (subjectId: string, description: string) => {
    setDrafts((prev) => {
      const current = prev[subjectId] ?? {
        subjectId,
        assigned: false,
        description: "",
      };
      return {
        ...prev,
        [subjectId]: {
          ...current,
          description,
        },
      };
    });
  };

  const assignedCount = Object.values(drafts).filter((d) => d.assigned).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className) return;
    onSave({
      branch: resolvedBranch,
      className,
      rows: Object.values(drafts),
    });
  };

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Academic Allocation"
      title="Assign Subject to Class"
      description="Select a class arm from your school directory, then tick all subjects offered by that class."
      size="lg"
      footer={
        <>
          <CtaButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </CtaButton>
          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            disabled={!className}
            onClick={() =>
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Assignments ({assignedCount})</span>
          </CtaButton>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminSelectField
          label="Class Name *"
          value={className}
          onChange={handleClassChange}
          options={classArms.map((arm) => ({
            id: arm.name,
            label: `${arm.name} (${arm.arm})`,
          }))}
        />

        <div className="overflow-hidden rounded-2xl border-2 border-surface-frost bg-surface-porcelain shadow-gloss-card">
          <div className="max-h-80 overflow-y-auto">
            <AdminTable>
              <AdminTableHeader className="sticky top-0 z-10 bg-surface-mist">
                <tr>
                  <AdminTableHead className="w-12 text-center">
                    Tick
                  </AdminTableHead>
                  <AdminTableHead>Subject</AdminTableHead>
                  <AdminTableHead>Description</AdminTableHead>
                </tr>
              </AdminTableHeader>
              <AdminTableBody>
                {subjects.map((sub) => {
                  const row = drafts[sub.id] ?? {
                    subjectId: sub.id,
                    assigned: false,
                    description: "",
                  };
                  return (
                    <AdminTableRow key={sub.id} isSelected={row.assigned}>
                      <AdminTableCell className="text-center">
                        <AdminCheckbox
                          checked={row.assigned}
                          onChange={() => toggleSubject(sub.id)}
                          aria-label={`Assign ${sub.title} to ${className}`}
                        />
                      </AdminTableCell>
                      <AdminTableCell>
                        <button
                          type="button"
                          onClick={() => toggleSubject(sub.id)}
                          className="text-left cursor-pointer"
                        >
                          <p className="font-display text-xs font-extrabold uppercase tracking-tight text-brand-950">
                            {sub.title}
                          </p>
                          <p className="text-[10px] font-bold text-ink-secondary">
                            {sub.category}
                          </p>
                        </button>
                      </AdminTableCell>
                      <AdminTableCell>
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) =>
                            updateDescription(sub.id, e.target.value)
                          }
                          placeholder="Optional class note..."
                          className="h-8 w-full rounded-lg border-2 border-brand-100 bg-surface-pearl px-2.5 text-xs font-semibold text-ink-primary placeholder:text-ink-muted focus:border-brand-500 focus:bg-surface-porcelain focus:outline-none"
                        />
                      </AdminTableCell>
                    </AdminTableRow>
                  );
                })}
              </AdminTableBody>
            </AdminTable>
          </div>
        </div>
      </form>
    </AdminModal>
  );
}

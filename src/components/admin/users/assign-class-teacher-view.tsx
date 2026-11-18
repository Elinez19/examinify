"use client";

import * as React from "react";
import { GraduationCap, Plus, UserCheck, UserMinus } from "lucide-react";
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
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import {
  AdminDialogModal,
  type ModalVariant,
} from "@/components/admin/ui/admin-dialog-modal";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { CLASS_CLASSIFICATION_OPTIONS } from "@/components/admin/subjects/class-arm-form";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { useTableSelection } from "@/hooks/portal/use-table-selection";
import type { ClassArm } from "@/data/portal-mock-data";
import { AssignClassTeacherModal } from "./assign-class-teacher-modal";

export function AssignClassTeacherView() {
  const {
    store,
    activeSessionTerm,
    assignClassToTeacher,
    unassignClassTeacher,
  } = usePortalStore();

  const sortedTeachers = React.useMemo(
    () => [...store.teachers].sort((a, b) => a.name.localeCompare(b.name)),
    [store.teachers]
  );

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = React.useState("");
  const [selectedClassArmId, setSelectedClassArmId] = React.useState("");

  const [searchQuery, setSearchQuery] = React.useState("");
  const [classificationFilter, setClassificationFilter] = React.useState("ALL");
  const [teacherFilter, setTeacherFilter] = React.useState("ALL");

  const [unassignTarget, setUnassignTarget] = React.useState<ClassArm | null>(
    null
  );
  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const openAssignModal = (arm?: ClassArm) => {
    if (arm) {
      setSelectedClassArmId(arm.id);
      setSelectedTeacherId(arm.classTeacherId || "");
    } else {
      setSelectedClassArmId("");
      setSelectedTeacherId("");
    }
    setModalOpen(true);
  };

  const handleChangeClassArm = (classArmId: string) => {
    setSelectedClassArmId(classArmId);
    const arm = store.classArms.find((item) => item.id === classArmId);
    if (arm?.classTeacherId && !selectedTeacherId) {
      setSelectedTeacherId(arm.classTeacherId);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const teacher = sortedTeachers.find((t) => t.id === selectedTeacherId);
    const arm = store.classArms.find((a) => a.id === selectedClassArmId);

    if (!teacher) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "No Teacher Selected",
        title: "Please Select a Teacher",
        description:
          "Choose a registered teaching staff member before saving the class assignment.",
      });
      return;
    }

    if (!arm) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "No Class Selected",
        title: "Please Select a Class Arm",
        description: "Choose a class arm before saving the assignment.",
      });
      return;
    }

    assignClassToTeacher(teacher.id, arm.id);
    setModalOpen(false);
    setFeedbackModal({
      variant: "success",
      eyebrow: "Class Assignment Saved",
      title: "Class Assigned to Teacher",
      description: `${arm.name} is now assigned to ${teacher.name} (${teacher.staffId}).`,
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredArms = React.useMemo(() => {
    return store.classArms.filter((arm) => {
      if (
        classificationFilter !== "ALL" &&
        arm.classification !== classificationFilter
      ) {
        return false;
      }
      if (teacherFilter === "UNASSIGNED" && arm.classTeacherId) {
        return false;
      }
      if (
        teacherFilter !== "ALL" &&
        teacherFilter !== "UNASSIGNED" &&
        arm.classTeacherId !== teacherFilter
      ) {
        return false;
      }
      if (!q) return true;
      const teacher = store.teachers.find((t) => t.id === arm.classTeacherId);
      return (
        arm.name.toLowerCase().includes(q) ||
        arm.classification.toLowerCase().includes(q) ||
        arm.arm.toLowerCase().includes(q) ||
        (teacher?.name ?? "").toLowerCase().includes(q) ||
        (teacher?.staffId ?? "").toLowerCase().includes(q)
      );
    });
  }, [
    classificationFilter,
    q,
    store.classArms,
    store.teachers,
    teacherFilter,
  ]);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "Class Allocation";

  const selection = useTableSelection(filteredArms.map((arm) => arm.id));

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Users · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Assign Class to Teacher."
        highlightWords={["Assign", "Class"]}
        subtitle="Select a registered teacher and assign them to any school class arm using the drop-down options."
        primaryCta={{
          label: "Assign Class to Teacher",
          onClick: () => openAssignModal(),
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "View Class Arms",
          href: "/admin/academic/classes",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search class arm, teacher, or staff ID..."
            />
            <AdminSelectField
              variant="filter"
              aria-label="Filter by classification"
              value={classificationFilter}
              onChange={setClassificationFilter}
              options={[
                { id: "ALL", label: "All Classifications" },
                ...CLASS_CLASSIFICATION_OPTIONS,
              ]}
            />
            <AdminSelectField
              variant="filter"
              aria-label="Filter by assigned teacher"
              value={teacherFilter}
              onChange={setTeacherFilter}
              options={[
                { id: "ALL", label: "All Teachers" },
                { id: "UNASSIGNED", label: "Unassigned Classes" },
                ...sortedTeachers.map((t) => ({
                  id: t.id,
                  label: t.name,
                })),
              ]}
            />
          </div>

          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={() => openAssignModal()}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Assign Class</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Class-to-Teacher Assignments"
            subtitle="Overview of school class arms and their assigned class teachers."
            badge={`${filteredArms.length} classes`}
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
            {filteredArms.length === 0 ? (
              <AdminEmptyState
                title="No Class Arms Found"
                description="Create class arms under Academic Setup or clear your search and dropdown filters."
                icon={<GraduationCap className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead className="w-10">
                      <AdminCheckbox
                        aria-label="Select all class arms"
                        checked={selection.allSelected}
                        indeterminate={selection.someSelected}
                        onChange={(e) => selection.toggleAll(e.target.checked)}
                      />
                    </AdminTableHead>
                    <AdminTableHead>Class Arm</AdminTableHead>
                    <AdminTableHead>Classification</AdminTableHead>
                    <AdminTableHead>Assigned Teacher</AdminTableHead>
                    <AdminTableHead>Enrolled Students</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredArms.map((arm) => {
                    const assignedTeacher = store.teachers.find(
                      (t) => t.id === arm.classTeacherId
                    );
                    const studentCount = store.students.filter(
                      (s) => s.classLevel === arm.name
                    ).length;

                    return (
                      <AdminTableRow
                        key={arm.id}
                        isSelected={selection.isSelected(arm.id)}
                      >
                        <AdminTableCell className="w-10">
                          <AdminCheckbox
                            aria-label={`Select ${arm.name}`}
                            checked={selection.isSelected(arm.id)}
                            onChange={() => selection.toggleOne(arm.id)}
                          />
                        </AdminTableCell>
                        <AdminTableCell>
                          <p className="font-display font-extrabold text-brand-950">
                            {arm.name}
                          </p>
                          <p className="text-[11px] font-medium text-ink-secondary">
                            {arm.level} · {arm.arm}
                          </p>
                        </AdminTableCell>

                        <AdminTableCell>
                          <PillBadge
                            tone="sky"
                            icon="none"
                            className="px-2.5 py-0.5 text-[10px]"
                          >
                            {arm.classification}
                          </PillBadge>
                        </AdminTableCell>

                        <AdminTableCell>
                          {assignedTeacher ? (
                            <div className="flex items-center gap-2.5">
                              <AvatarBadge
                                name={assignedTeacher.name}
                                avatarUrl={assignedTeacher.avatarUrl}
                                size="sm"
                              />
                              <div>
                                <p className="font-display text-xs font-extrabold text-brand-950">
                                  {assignedTeacher.name}
                                </p>
                                <p className="text-[11px] font-medium text-ink-secondary">
                                  {assignedTeacher.staffId} ·{" "}
                                  {assignedTeacher.assignedRole ?? "Teacher"}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <PillBadge
                              tone="porcelain"
                              icon="none"
                              className="px-2.5 py-0.5 text-[11px] text-ink-secondary"
                            >
                              Unassigned
                            </PillBadge>
                          )}
                        </AdminTableCell>

                        <AdminTableCell className="font-bold text-brand-950">
                          {studentCount} / {arm.capacity} seats
                        </AdminTableCell>

                        <AdminTableCell>
                          <AdminStatusPill status={arm.status} />
                        </AdminTableCell>

                        <AdminTableCell className="text-right">
                          <AdminActionMenu
                            ariaLabel={`Actions for ${arm.name}`}
                            items={[
                              {
                                id: "assign-teacher",
                                label: assignedTeacher
                                  ? "Change Teacher"
                                  : "Assign Teacher",
                                icon: <UserCheck className="h-3.5 w-3.5" />,
                                variant: "primary",
                                onClick: () => openAssignModal(arm),
                              },
                              ...(assignedTeacher
                                ? [
                                    {
                                      id: "unassign-teacher",
                                      label: "Unassign Teacher",
                                      icon: <UserMinus className="h-3.5 w-3.5" />,
                                      variant: "danger" as const,
                                      dividerBefore: true,
                                      onClick: () => setUnassignTarget(arm),
                                    },
                                  ]
                                : []),
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

      <AssignClassTeacherModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        teachers={sortedTeachers}
        classArms={store.classArms}
        selectedTeacherId={selectedTeacherId}
        onChangeTeacher={setSelectedTeacherId}
        selectedClassArmId={selectedClassArmId}
        onChangeClassArm={handleChangeClassArm}
        onSubmit={handleSubmit}
      />

      <AdminDialogModal
        open={Boolean(unassignTarget)}
        onOpenChange={(open) => {
          if (!open) setUnassignTarget(null);
        }}
        variant="danger"
        eyebrow="Remove Assignment"
        title="Unassign Class Teacher?"
        description={
          unassignTarget
            ? `Remove the assigned class teacher from "${unassignTarget.name}"? You can assign another teacher anytime.`
            : undefined
        }
        confirmLabel="Confirm Unassign"
        onConfirm={() => {
          if (unassignTarget) {
            unassignClassTeacher(unassignTarget.id);
            const removedName = unassignTarget.name;
            setUnassignTarget(null);
            setFeedbackModal({
              variant: "success",
              eyebrow: "Class Unassigned",
              title: "Teacher Removed from Class",
              description: `${removedName} currently has no assigned class teacher.`,
            });
          }
        }}
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
    </div>
  );
}

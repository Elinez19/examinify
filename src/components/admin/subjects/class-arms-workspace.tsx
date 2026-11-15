"use client";

import * as React from "react";
import { Edit3, GraduationCap, Plus, Trash2 } from "lucide-react";
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
import type { ClassArm } from "@/data/portal-mock-data";
import { ClassArmForm, type ClassArmFormState } from "./class-arm-form";

export function ClassArmsWorkspace() {
  const { store, activeSessionTerm, saveClassArm, deleteClassArm } =
    usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const classFormRef = React.useRef<HTMLDivElement | null>(null);
  const [classFormOpen, setClassFormOpen] = React.useState(false);

  const [classForm, setClassForm] = React.useState<ClassArmFormState>({
    id: "",
    name: "",
    level: "JSS 3",
    arm: "Science Wing",
    classTeacherId: store.teachers[0]?.id ?? "",
    capacity: 40,
  });

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = React.useState<ClassArm | null>(null);

  const scrollToForm = () => {
    setTimeout(() => {
      classFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  const resetClassArmForm = () => {
    setClassForm({
      id: "",
      name: "",
      level: "JSS 3",
      arm: "Science Wing",
      classTeacherId: store.teachers[0]?.id ?? "",
      capacity: 40,
    });
  };

  const openAddClassArm = () => {
    resetClassArmForm();
    setClassFormOpen(true);
    scrollToForm();
  };

  const openEditClassArm = (arm: ClassArm) => {
    setClassForm({
      id: arm.id,
      name: arm.name,
      level: arm.level,
      arm: arm.arm,
      classTeacherId: arm.classTeacherId,
      capacity: arm.capacity,
    });
    setClassFormOpen(true);
    scrollToForm();
  };

  const handleSaveClassArm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!classForm.name.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Class Arm Name Required",
        description: "Please enter a name for the class arm.",
      });
      return;
    }

    const wasEditing = Boolean(classForm.id);
    const armName = classForm.name.trim();
    saveClassArm({
      id: classForm.id || `arm_${Date.now()}`,
      name: armName,
      level: classForm.level.trim() || "JSS 3",
      arm: classForm.arm.trim() || "General",
      classTeacherId: classForm.classTeacherId,
      capacity: Number(classForm.capacity) || 40,
      status: "active",
    });

    setClassFormOpen(false);
    resetClassArmForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Class Directory Updated",
      title: wasEditing ? "Class Arm Updated" : "Class Arm Created",
      description: `"${armName}" is now configured in the school directory.`,
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredArms = store.classArms.filter(
    (arm) =>
      !q ||
      arm.name.toLowerCase().includes(q) ||
      arm.level.toLowerCase().includes(q) ||
      arm.arm.toLowerCase().includes(q)
  );

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "Academic Setup";

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Academic · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Class Arms & Form Teachers."
        highlightWords={["Class", "Arms"]}
        subtitle="Define school class arms, seating capacities, and assigned form teachers using the single inline form below."
        primaryCta={{
          label: "New Class Arm",
          onClick: openAddClassArm,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Assign Subjects",
          href: "/admin/academic/assign-subjects",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <ClassArmForm
          formRef={classFormRef}
          open={classFormOpen}
          onOpenChange={setClassFormOpen}
          formState={classForm}
          setFormState={setClassForm}
          teachers={store.teachers}
          onReset={resetClassArmForm}
          onSubmit={handleSaveClassArm}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search class name, level, or wing..."
          />
          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddClassArm}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Class Arm</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Class Arms Directory"
            subtitle="Configure school class arms and assigned form teachers."
            badge={`${filteredArms.length} class arms`}
          >
            {filteredArms.length === 0 ? (
              <AdminEmptyState
                title="No Class Arms Found"
                description="Create a new class arm or adjust your search query."
                icon={<GraduationCap className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead>Class Name</AdminTableHead>
                    <AdminTableHead>Level & Wing</AdminTableHead>
                    <AdminTableHead>Class Teacher</AdminTableHead>
                    <AdminTableHead>Enrolled Students</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredArms.map((arm) => {
                    const ct = store.teachers.find(
                      (t) => t.id === arm.classTeacherId
                    );
                    const stuCount = store.students.filter(
                      (s) => s.classLevel === arm.name
                    ).length;
                    return (
                      <AdminTableRow key={arm.id}>
                        <AdminTableCell className="font-display font-extrabold text-brand-950">
                          {arm.name}
                        </AdminTableCell>
                        <AdminTableCell className="font-medium text-ink-secondary">
                          {arm.level} · {arm.arm}
                        </AdminTableCell>
                        <AdminTableCell className="font-semibold text-brand-900">
                          {ct?.name ?? "Unassigned"}
                        </AdminTableCell>
                        <AdminTableCell className="font-bold text-brand-950">
                          {stuCount} / {arm.capacity} seats
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminStatusPill status={arm.status} />
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                          <AdminActionMenu
                            ariaLabel={`Actions for ${arm.name}`}
                            items={[
                              {
                                id: "edit-arm",
                                label: "Edit Class & Teacher",
                                icon: <Edit3 className="h-3.5 w-3.5" />,
                                onClick: () => openEditClassArm(arm),
                              },
                              {
                                id: "del-arm",
                                label: "Remove Class Arm",
                                icon: <Trash2 className="h-3.5 w-3.5" />,
                                variant: "danger",
                                dividerBefore: true,
                                onClick: () => setDeleteTarget(arm),
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
        title="Remove Class Arm?"
        description={
          deleteTarget
            ? `Permanently delete "${deleteTarget.name}" from the school class directory?`
            : undefined
        }
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteClassArm(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

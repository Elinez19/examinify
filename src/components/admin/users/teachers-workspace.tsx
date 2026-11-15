"use client";

import * as React from "react";
import { Edit3, Plus, Power, Trash2, UserCheck, Users } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import {
  AdminSearchInput,
  AdminSelectField,
} from "@/components/admin/ui/admin-form-controls";
import {
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
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import {
  AdminDialogModal,
  type ModalVariant,
} from "@/components/admin/ui/admin-dialog-modal";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { TeacherProfile } from "@/data/portal-mock-data";
import {
  createInitialTeacherFormState,
  TeacherRegistrationForm,
  type TeacherRegistrationFormState,
} from "./teacher-registration-form";
import { AssignTeacherModal } from "./assign-teacher-modal";

type TeacherSortKey = "name" | "email" | "detail" | "status";

export function TeachersWorkspace() {
  const {
    store,
    activeSessionTerm,
    saveTeacherAccount,
    setTeacherStatus,
    assignTeacherAssignments,
    deleteTeacherAccount,
  } = usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [sortKey, setSortKey] = React.useState<TeacherSortKey>("name");
  const [sortDir, setSortDir] = React.useState<SortDirection>("asc");

  const teacherFormRef = React.useRef<HTMLDivElement | null>(null);
  const [teacherFormOpen, setTeacherFormOpen] = React.useState(false);
  const [teacherForm, setTeacherForm] =
    React.useState<TeacherRegistrationFormState>(() =>
      createInitialTeacherFormState(
        store.classArms,
        store.subjects,
        store.teachers.length
      )
    );

  // Modal for assigning classes & subjects
  const [assignTeacherTarget, setAssignTeacherTarget] =
    React.useState<TeacherProfile | null>(null);
  const [teacherClassesDraft, setTeacherClassesDraft] = React.useState<string[]>(
    []
  );
  const [teacherSubjectsDraft, setTeacherSubjectsDraft] = React.useState<
    string[]
  >([]);

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] =
    React.useState<TeacherProfile | null>(null);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  const scrollFormIntoView = () => {
    setTimeout(() => {
      teacherFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  const resetTeacherForm = () => {
    setTeacherForm(
      createInitialTeacherFormState(
        store.classArms,
        store.subjects,
        store.teachers.length
      )
    );
  };

  const openAddTeacher = () => {
    resetTeacherForm();
    setTeacherFormOpen(true);
    scrollFormIntoView();
  };

  const openEditTeacher = (tch: TeacherProfile) => {
    const detectedPrefix =
      tch.displayPrefix ??
      (tch.name.startsWith("Mrs.")
        ? "Mrs."
        : tch.name.startsWith("Ms.")
          ? "Ms."
          : tch.name.startsWith("Dr.")
            ? "Dr."
            : tch.name.startsWith("Prof.")
              ? "Prof."
              : "Mr.");
    setTeacherForm({
      ...createInitialTeacherFormState(
        store.classArms,
        store.subjects,
        store.teachers.length
      ),
      id: tch.id,
      schoolBranch: tch.schoolBranch ?? "Main Campus (Guzape)",
      staffId: tch.staffId,
      displayPrefix: detectedPrefix,
      firstName: tch.firstName,
      middleName: tch.middleName ?? "",
      lastName: tch.lastName,
      sex: tch.sex ?? "Male",
      maritalStatus: tch.maritalStatus ?? "Married",
      dateOfBirth: tch.dateOfBirth ?? "",
      country: tch.country ?? "Nigeria",
      stateOfOrigin: tch.stateOfOrigin ?? "FCT Abuja",
      cityOfResidence: tch.cityOfResidence ?? "",
      photoDataUrl:
        tch.avatarUrl && tch.avatarUrl.startsWith("data:image/")
          ? tch.avatarUrl
          : "",
      department: tch.department,
      qualification: tch.qualification ?? "B.Sc (Ed)",
      employmentType: tch.employmentType ?? "Full-Time",
      employmentDate: tch.employmentDate ?? "",
      assignedClasses: tch.assignedClasses,
      assignedSubjectIds: tch.assignedSubjectIds,
      phoneType: tch.phoneType ?? "Personal Mobile",
      phone: tch.phone,
      alternatePhone: tch.alternatePhone ?? "",
      emailType: tch.emailType ?? "Official School",
      email: tch.email,
      alternateEmail: tch.alternateEmail ?? "",
      nextOfKinName: tch.nextOfKinName ?? "",
      nextOfKinRelationship: tch.nextOfKinRelationship ?? "Spouse",
      nextOfKinPhone: tch.nextOfKinPhone ?? "",
      nextOfKinAddress: tch.nextOfKinAddress ?? "",
      password: tch.password,
      status: tch.status,
    });
    setTeacherFormOpen(true);
    scrollFormIntoView();
  };

  const handleSaveTeacher = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!teacherForm.firstName.trim() || !teacherForm.email.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Missing Required Teacher Fields",
        description:
          "Please provide the teacher's first name, surname, and email address before submitting.",
      });
      return;
    }

    const prefix = teacherForm.displayPrefix
      ? `${teacherForm.displayPrefix} `
      : "";
    const fullName = [
      prefix.trim(),
      teacherForm.firstName.trim(),
      teacherForm.middleName.trim(),
      teacherForm.lastName.trim(),
    ]
      .filter(Boolean)
      .join(" ");
    const existing = store.teachers.find((t) => t.id === teacherForm.id);
    const wasEditing = Boolean(teacherForm.id);

    saveTeacherAccount({
      id: teacherForm.id || `tch_${Date.now()}`,
      displayPrefix: teacherForm.displayPrefix,
      firstName: teacherForm.firstName.trim(),
      middleName: teacherForm.middleName.trim() || undefined,
      lastName: teacherForm.lastName.trim(),
      name: fullName,
      email: teacherForm.email.trim().toLowerCase(),
      emailType: teacherForm.emailType,
      alternateEmail: teacherForm.alternateEmail.trim() || undefined,
      phone: teacherForm.phone.trim(),
      phoneType: teacherForm.phoneType,
      alternatePhone: teacherForm.alternatePhone.trim() || undefined,
      staffId: teacherForm.staffId.trim(),
      schoolBranch: teacherForm.schoolBranch,
      sex: teacherForm.sex,
      maritalStatus: teacherForm.maritalStatus,
      dateOfBirth: teacherForm.dateOfBirth || undefined,
      country: teacherForm.country,
      stateOfOrigin: teacherForm.stateOfOrigin,
      cityOfResidence: teacherForm.cityOfResidence.trim() || undefined,
      department: teacherForm.department.trim(),
      qualification: teacherForm.qualification.trim() || undefined,
      employmentType: teacherForm.employmentType,
      employmentDate: teacherForm.employmentDate || undefined,
      assignedClasses: teacherForm.assignedClasses,
      assignedSubjectIds: teacherForm.assignedSubjectIds,
      termLabel,
      schoolName: store.teacher.schoolName,
      avatarUrl: teacherForm.photoDataUrl || existing?.avatarUrl || "avatar-5",
      password: teacherForm.password || "Teacher@2026",
      status: teacherForm.status,
      nextOfKinName: teacherForm.nextOfKinName.trim() || undefined,
      nextOfKinRelationship: teacherForm.nextOfKinRelationship,
      nextOfKinPhone: teacherForm.nextOfKinPhone.trim() || undefined,
      nextOfKinAddress: teacherForm.nextOfKinAddress.trim() || undefined,
    });

    setTeacherFormOpen(false);
    resetTeacherForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Operation Completed",
      title: wasEditing ? "Teacher Record Updated" : "Teacher Registered",
      description: `${fullName} (${teacherForm.staffId}) has been saved to the faculty directory.`,
    });
  };

  const toggleSort = (key: TeacherSortKey) => {
    if (sortKey === key) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredTeachers = React.useMemo(() => {
    const list = store.teachers.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (item.name ?? "").toLowerCase().includes(q) ||
        (item.email ?? "").toLowerCase().includes(q) ||
        (item.department ?? "").toLowerCase().includes(q) ||
        (item.staffId ?? "").toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = (a.name ?? "").localeCompare(b.name ?? "");
      else if (sortKey === "email")
        cmp = (a.email ?? "").localeCompare(b.email ?? "");
      else if (sortKey === "detail")
        cmp = (a.department ?? "").localeCompare(b.department ?? "");
      else if (sortKey === "status")
        cmp = (a.status ?? "").localeCompare(b.status ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [q, sortDir, sortKey, statusFilter, store.teachers]);

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Users · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Teachers & Faculty Directory."
        highlightWords={["Teachers", "Faculty"]}
        subtitle="Onboard or edit teachers with the single inline form below, and manage class/subject allocations via modal."
        primaryCta={{
          label: "Register Teacher",
          onClick: openAddTeacher,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Students Directory",
          href: "/admin/user-management",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <TeacherRegistrationForm
          formRef={teacherFormRef}
          open={teacherFormOpen}
          onOpenChange={setTeacherFormOpen}
          formState={teacherForm}
          setFormState={setTeacherForm}
          classArms={store.classArms}
          subjects={store.subjects}
          teacherCount={store.teachers.length}
          onReset={resetTeacherForm}
          onSubmit={handleSaveTeacher}
          onPhotoError={(msg) =>
            setFeedbackModal({
              variant: "danger",
              eyebrow: "Photo Upload Error",
              title: "Invalid Image",
              description: msg,
            })
          }
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search teacher name, email, or department..."
            />
            <AdminSelectField
              variant="filter"
              aria-label="Filter account status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { id: "ALL", label: "All Statuses" },
                { id: "active", label: "Active" },
                { id: "inactive", label: "Inactive" },
              ]}
            />
          </div>

          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddTeacher}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Teacher</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Teacher Accounts & Subject/Class Allocations"
            subtitle="Edit faculty profiles inline or assign classes and subjects via modal."
            badge={`${filteredTeachers.length} teachers`}
          >
            {filteredTeachers.length === 0 ? (
              <AdminEmptyState
                title="No Teachers Found"
                description="Register a new teacher or clear your search/status filters."
                icon={<Users className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminSortableTableHead
                      label="Teacher"
                      sortKey="name"
                      activeSortKey={sortKey}
                      sortDirection={sortDir}
                      onSort={toggleSort}
                    />
                    <AdminSortableTableHead
                      label="Email"
                      sortKey="email"
                      activeSortKey={sortKey}
                      sortDirection={sortDir}
                      onSort={toggleSort}
                    />
                    <AdminSortableTableHead
                      label="Classes & Subjects"
                      sortKey="detail"
                      activeSortKey={sortKey}
                      sortDirection={sortDir}
                      onSort={toggleSort}
                    />
                    <AdminSortableTableHead
                      label="Status"
                      sortKey="status"
                      activeSortKey={sortKey}
                      sortDirection={sortDir}
                      onSort={toggleSort}
                    />
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredTeachers.map((tch) => (
                    <AdminTableRow key={tch.id}>
                      <AdminTableCell>
                        <div className="flex items-center gap-2.5">
                          <AvatarBadge
                            name={tch.name}
                            avatarUrl={tch.avatarUrl}
                            size="sm"
                          />
                          <div>
                            <p className="font-display font-extrabold text-brand-950">
                              {tch.name}
                            </p>
                            <p className="text-[11px] font-medium text-ink-secondary">
                              {tch.staffId} · {tch.department}
                            </p>
                          </div>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell className="font-medium text-brand-800">
                        {tch.email}
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-brand-950">
                            Classes: {tch.assignedClasses.join(", ") || "None"}
                          </p>
                          <p className="text-[11px] font-medium text-ink-secondary">
                            Subjects:{" "}
                            {tch.assignedSubjectIds
                              .map(
                                (sid) =>
                                  store.subjects.find((s) => s.id === sid)
                                    ?.title ?? sid
                              )
                              .join(", ") || "None"}
                          </p>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={tch.status}
                          variant={
                            tch.status === "active" ? "success" : "danger"
                          }
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${tch.name}`}
                          items={[
                            {
                              id: "assign-tch",
                              label: "Assign Classes & Subjects",
                              icon: <UserCheck className="h-3.5 w-3.5" />,
                              variant: "primary",
                              onClick: () => {
                                setTeacherClassesDraft(tch.assignedClasses);
                                setTeacherSubjectsDraft(tch.assignedSubjectIds);
                                setAssignTeacherTarget(tch);
                              },
                            },
                            {
                              id: "edit-tch",
                              label: "Edit Teacher Profile",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditTeacher(tch),
                            },
                            {
                              id: "toggle-tch",
                              label:
                                tch.status === "active"
                                  ? "Deactivate Account"
                                  : "Activate Account",
                              icon: <Power className="h-3.5 w-3.5" />,
                              onClick: () =>
                                setTeacherStatus(
                                  tch.id,
                                  tch.status === "active"
                                    ? "inactive"
                                    : "active"
                                ),
                            },
                            {
                              id: "del-tch",
                              label: "Remove Teacher",
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              onClick: () => setDeleteTarget(tch),
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

      <AssignTeacherModal
        target={assignTeacherTarget}
        classesDraft={teacherClassesDraft}
        setClassesDraft={setTeacherClassesDraft}
        subjectsDraft={teacherSubjectsDraft}
        setSubjectsDraft={setTeacherSubjectsDraft}
        classArms={store.classArms}
        subjects={store.subjects}
        onClose={() => setAssignTeacherTarget(null)}
        onConfirm={() => {
          if (!assignTeacherTarget) return;
          assignTeacherAssignments(
            assignTeacherTarget.id,
            teacherClassesDraft,
            teacherSubjectsDraft
          );
          const teacherName = assignTeacherTarget.name;
          setAssignTeacherTarget(null);
          setFeedbackModal({
            variant: "success",
            eyebrow: "Operation Completed",
            title: "Teaching Assignments Saved",
            description: `Updated class arms and subjects for ${teacherName}.`,
          });
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

      <AdminDialogModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        variant="danger"
        title="Remove Teacher Account?"
        description={
          deleteTarget
            ? `Permanently remove "${deleteTarget.name}" from the faculty directory?`
            : undefined
        }
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteTeacherAccount(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

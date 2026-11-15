"use client";

import * as React from "react";
import { BookOpen, Edit3, Plus, Trash2 } from "lucide-react";
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
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { SubjectEnrollment } from "@/data/portal-mock-data";
import { SubjectForm, type SubjectFormState } from "./subject-form";

export function AllSubjectsWorkspace() {
  const { store, activeSessionTerm, saveSubject, deleteSubject } =
    usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const subjectFormRef = React.useRef<HTMLDivElement | null>(null);
  const [subjectFormOpen, setSubjectFormOpen] = React.useState(false);

  const [subjectForm, setSubjectForm] = React.useState<SubjectFormState>({
    id: "",
    code: "",
    title: "",
    category: "Core STEM",
    assignedClasses: [],
    assignedTeacherIds: [],
  });

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = React.useState<SubjectEnrollment | null>(
    null
  );

  const scrollToForm = () => {
    setTimeout(() => {
      subjectFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  const resetSubjectForm = () => {
    setSubjectForm({
      id: "",
      code: "",
      title: "",
      category: "Core STEM",
      assignedClasses: store.classArms[0] ? [store.classArms[0].name] : [],
      assignedTeacherIds: store.teachers[0] ? [store.teachers[0].id] : [],
    });
  };

  const openAddSubject = () => {
    resetSubjectForm();
    setSubjectFormOpen(true);
    scrollToForm();
  };

  const openEditSubject = (sub: SubjectEnrollment) => {
    setSubjectForm({
      id: sub.id,
      code: sub.code,
      title: sub.title,
      category: sub.category,
      assignedClasses: sub.assignedClasses,
      assignedTeacherIds: sub.assignedTeacherIds,
    });
    setSubjectFormOpen(true);
    scrollToForm();
  };

  const handleSaveSubject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subjectForm.code.trim() || !subjectForm.title.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Missing Subject Details",
        description: "Please provide both a subject code and subject title.",
      });
      return;
    }

    const primaryTeacher = store.teachers.find((t) =>
      subjectForm.assignedTeacherIds.includes(t.id)
    );
    const existing = store.subjects.find((s) => s.id === subjectForm.id);
    const wasEditing = Boolean(subjectForm.id);
    const title = subjectForm.title.trim();
    const normalizedCode = subjectForm.code.trim().toUpperCase();

    saveSubject({
      id: subjectForm.id || `sub_${Date.now()}`,
      code: normalizedCode,
      title,
      category: subjectForm.category.trim() || "Core",
      teacherName: primaryTeacher?.name ?? existing?.teacherName ?? "Unassigned",
      assignedClasses: subjectForm.assignedClasses,
      assignedTeacherIds: subjectForm.assignedTeacherIds,
      classDescriptions: existing?.classDescriptions,
      schoolBranch: existing?.schoolBranch,
      nextExamAt: existing?.nextExamAt ?? "Not scheduled",
      topicsCovered: existing?.topicsCovered ?? 0,
      totalTopics: existing?.totalTopics ?? 10,
      questionCount: store.questions.filter(
        (item) => item.subjectCode === normalizedCode
      ).length,
      passRate: existing?.passRate ?? 80,
      status: existing?.status ?? "active",
    });

    setSubjectFormOpen(false);
    resetSubjectForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Curriculum Updated",
      title: wasEditing ? "Subject Updated" : "Subject Created",
      description: `"${title}" (${normalizedCode}) has been saved to the school subject catalog.`,
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredSubjects = store.subjects.filter(
    (s) =>
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
  );

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "Academic Setup";

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Academic · ${termLabel}`}
        eyebrowIcon="dot"
        headline="All Subjects Catalog."
        highlightWords={["All", "Subjects"]}
        subtitle="Create and maintain school subject codes, categories, and faculty ownership using the single inline form below."
        primaryCta={{
          label: "New Subject",
          onClick: openAddSubject,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Assign to Class",
          href: "/admin/academic/assign-subjects",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <SubjectForm
          formRef={subjectFormRef}
          open={subjectFormOpen}
          onOpenChange={setSubjectFormOpen}
          formState={subjectForm}
          setFormState={setSubjectForm}
          classArms={store.classArms}
          teachers={store.teachers}
          onReset={resetSubjectForm}
          onSubmit={handleSaveSubject}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search subject title, code, or category..."
          />
          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddSubject}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Subject</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="School Subjects Directory"
            subtitle="Manage curriculum subjects across all school departments."
            badge={`${filteredSubjects.length} subjects`}
          >
            {filteredSubjects.length === 0 ? (
              <AdminEmptyState
                title="No Subjects Found"
                description="No subjects matched your search query. Create a new subject or clear the filter."
                icon={<BookOpen className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead>Code</AdminTableHead>
                    <AdminTableHead>Subject Title</AdminTableHead>
                    <AdminTableHead>Assigned Classes</AdminTableHead>
                    <AdminTableHead>Assigned Teachers</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredSubjects.map((sub) => (
                    <AdminTableRow key={sub.id}>
                      <AdminTableCell className="font-mono font-extrabold text-brand-900">
                        {sub.code}
                      </AdminTableCell>
                      <AdminTableCell>
                        <p className="font-display font-extrabold text-brand-950">
                          {sub.title}
                        </p>
                        <p className="text-[11px] font-medium text-ink-secondary">
                          {sub.category}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex flex-wrap gap-1">
                          {sub.assignedClasses.length > 0 ? (
                            sub.assignedClasses.map((cls) => (
                              <PillBadge
                                key={cls}
                                tone="sky"
                                className="px-2 py-0.5 text-[10px]"
                              >
                                {cls}
                              </PillBadge>
                            ))
                          ) : (
                            <span className="text-xs font-medium text-ink-muted">
                              Unassigned
                            </span>
                          )}
                        </div>
                      </AdminTableCell>
                      <AdminTableCell className="font-semibold text-brand-800">
                        {sub.assignedTeacherIds
                          .map(
                            (id) =>
                              store.teachers.find((t) => t.id === id)?.name ??
                              sub.teacherName
                          )
                          .join(", ") || sub.teacherName}
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill status={sub.status} />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${sub.title}`}
                          items={[
                            {
                              id: "edit-sub",
                              label: "Edit Subject",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditSubject(sub),
                            },
                            {
                              id: "del-sub",
                              label: "Delete Subject",
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              onClick: () => setDeleteTarget(sub),
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
        title="Delete Subject?"
        description={
          deleteTarget
            ? `Permanently remove "${deleteTarget.title}" (${deleteTarget.code}) from the curriculum catalog?`
            : undefined
        }
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteSubject(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

"use client";

import * as React from "react";
import { BookCheck, Eye, Users } from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import {
  AdminSearchInput,
  AdminSelectField,
} from "@/components/admin/ui/admin-form-controls";
import {
  AdminCheckbox,
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
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { useTableSelection } from "@/hooks/portal/use-table-selection";
import type { StudentProfile } from "@/data/portal-mock-data";

type StudentSortKey = "name" | "admissionNo" | "classLevel" | "submissions" | "status";

export function TeacherClassListWorkspace() {
  const { store, activeSessionTerm } = usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [classFilter, setClassFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [sortKey, setSortKey] = React.useState<StudentSortKey>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");
  const [inspectStudent, setInspectStudent] =
    React.useState<StudentProfile | null>(null);

  const handleSort = (key: StudentSortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const classOptions = Array.from(
    new Set([
      ...store.teacher.assignedClasses,
      ...store.classArms.map((arm) => arm.name),
    ])
  );

  const getSubmissionCount = React.useCallback(
    (studentId: string) =>
      store.submissions.filter((sub) => sub.studentId === studentId).length,
    [store.submissions]
  );

  const filteredStudents = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = store.students.filter((student) => {
      if (classFilter !== "ALL" && student.classLevel !== classFilter) {
        return false;
      }
      if (statusFilter !== "ALL" && student.status !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        (student.name ?? "").toLowerCase().includes(q) ||
        (student.admissionNo ?? "").toLowerCase().includes(q) ||
        (student.email ?? "").toLowerCase().includes(q) ||
        (student.classLevel ?? "").toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case "name":
          comparison = (a.name ?? "").localeCompare(b.name ?? "");
          break;
        case "admissionNo":
          comparison = (a.admissionNo ?? "").localeCompare(b.admissionNo ?? "");
          break;
        case "classLevel":
          comparison = (a.classLevel ?? "").localeCompare(b.classLevel ?? "");
          break;
        case "submissions":
          comparison = getSubmissionCount(a.id) - getSubmissionCount(b.id);
          break;
        case "status":
          comparison = (a.status ?? "").localeCompare(b.status ?? "");
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [
    classFilter,
    getSubmissionCount,
    searchQuery,
    sortDirection,
    sortKey,
    statusFilter,
    store.students,
  ]);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  const selection = useTableSelection(
    filteredStudents.map((student) => student.id)
  );

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow={`Class Roster · ${termLabel}`}
        title="ClassList"
        description="Browse enrolled candidates across your assigned classes, filter by arm or status, and inspect candidate scripts."
        badgeLabel={`${filteredStudents.length} Students`}
        badgeTone="brand"
        metrics={[
          { label: "Total Enrolled", value: `${store.students.length}` },
          {
            label: "Assigned Arms",
            value: `${store.teacher.assignedClasses.length}`,
          },
          {
            label: "Active Accounts",
            value: `${store.students.filter((s) => s.status === "active").length}`,
          },
        ]}
      />

      <AdminSectionCard
        title="Student Class Directory"
        description="Sort any column header or use the three-dot menu to inspect candidate profiles and exam history."
        action={<Users className="h-4 w-4 text-brand-500" />}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full sm:w-72">
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search name, admission no, email..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AdminSelectField
              variant="filter"
              aria-label="Filter by class"
              value={classFilter}
              onChange={setClassFilter}
              options={[
                { id: "ALL", label: "All Classes" },
                ...classOptions.map((cls) => ({ id: cls, label: cls })),
              ]}
            />

            <AdminSelectField
              variant="filter"
              aria-label="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { id: "ALL", label: "All Statuses" },
                { id: "active", label: "Active" },
                { id: "inactive", label: "Inactive" },
              ]}
            />
          </div>
        </div>

        <AdminDataTable
          title="Enrolled Candidates"
          subtitle="Sort any column header or use the three-dot menu to inspect candidate profiles and exam history."
          badge={`${filteredStudents.length} students`}
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
          {filteredStudents.length === 0 ? (
            <AdminEmptyState
              title="No Students Found"
              description="No students matched the selected filters."
              icon={<Users className="h-5 w-5 text-accent-sky" />}
            />
          ) : (
            <AdminTable>
              <AdminTableHeader>
                <tr>
                  <AdminTableHead className="w-10">
                    <AdminCheckbox
                      aria-label="Select all students"
                      checked={selection.allSelected}
                      indeterminate={selection.someSelected}
                      onChange={(e) => selection.toggleAll(e.target.checked)}
                    />
                  </AdminTableHead>
                  <AdminSortableTableHead
                    label="Student"
                    sortKey="name"
                    activeSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <AdminSortableTableHead
                    label="Admission No"
                    sortKey="admissionNo"
                    activeSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <AdminSortableTableHead
                    label="Class Arm"
                    sortKey="classLevel"
                    activeSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <AdminSortableTableHead
                    label="Submissions"
                    sortKey="submissions"
                    activeSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <AdminSortableTableHead
                    label="Status"
                    sortKey="status"
                    activeSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </tr>
              </AdminTableHeader>
              <AdminTableBody>
                {filteredStudents.map((student) => {
                  const subCount = getSubmissionCount(student.id);
                  return (
                    <AdminTableRow
                      key={student.id}
                      isSelected={selection.isSelected(student.id)}
                    >
                      <AdminTableCell className="w-10">
                        <AdminCheckbox
                          aria-label={`Select ${student.name}`}
                          checked={selection.isSelected(student.id)}
                          onChange={() => selection.toggleOne(student.id)}
                        />
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex items-center gap-2.5">
                          <AvatarBadge
                            name={student.name}
                            avatarUrl={student.avatarUrl}
                            size="sm"
                          />
                          <div>
                            <p className="font-display font-extrabold text-brand-950">
                              {student.name}
                            </p>
                            <p className="text-[11px] font-medium text-ink-secondary">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell className="font-mono font-semibold text-brand-800">
                        {student.admissionNo}
                      </AdminTableCell>
                      <AdminTableCell>
                        <PillBadge
                          tone="sky"
                          className="px-2.5 py-0.5 text-[11px]"
                        >
                          {student.classLevel}
                        </PillBadge>
                      </AdminTableCell>
                      <AdminTableCell className="font-bold text-brand-900">
                        {subCount} script{subCount === 1 ? "" : "s"}
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={student.status}
                          variant={
                            student.status === "active" ? "success" : "danger"
                          }
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${student.name}`}
                          items={[
                            {
                              id: "inspect",
                              label: "View Profile & Scripts",
                              icon: <Eye className="h-3.5 w-3.5" />,
                              onClick: () => setInspectStudent(student),
                            },
                            {
                              id: "grading",
                              label: "Open Theory Grading",
                              icon: <BookCheck className="h-3.5 w-3.5" />,
                              href: "/teacher/grading",
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
      </AdminSectionCard>

      <AdminModal
        open={Boolean(inspectStudent)}
        onOpenChange={(open) => {
          if (!open) setInspectStudent(null);
        }}
        eyebrow={inspectStudent?.admissionNo ?? "Student"}
        title={inspectStudent?.name ?? "Student Profile"}
        description={
          inspectStudent
            ? `${inspectStudent.classLevel} · ${inspectStudent.wing}`
            : undefined
        }
        size="md"
      >
        {inspectStudent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 text-xs">
              <div>
                <span className="block text-[10px] font-bold uppercase text-brand-500">
                  Email
                </span>
                <span className="font-bold text-brand-950 break-all">
                  {inspectStudent.email}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-brand-500">
                  Phone
                </span>
                <span className="font-bold text-brand-950">
                  {inspectStudent.phone || "—"}
                </span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-brand-800">
                Recent Assessment Scripts
              </p>
              {store.submissions.filter(
                (sub) => sub.studentId === inspectStudent.id
              ).length === 0 ? (
                <p className="rounded-xl border border-brand-100 bg-white p-4 text-center text-xs font-medium text-ink-secondary">
                  No submitted scripts recorded yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {store.submissions
                    .filter((sub) => sub.studentId === inspectStudent.id)
                    .map((sub) => {
                      const total = sub.objectiveTotal + sub.theoryTotal;
                      const earned = sub.objectiveEarned + sub.theoryEarned;
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between gap-2 rounded-xl border border-brand-100 bg-white px-3.5 py-2.5 text-xs"
                        >
                          <div>
                            <p className="font-extrabold text-brand-950">
                              {sub.examTitle}
                            </p>
                            <p className="text-[11px] font-medium text-ink-secondary">
                              {sub.submittedAt}
                            </p>
                          </div>
                          <span className="rounded-lg bg-brand-100 px-2.5 py-1 font-extrabold text-brand-900">
                            {earned}/{total}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}


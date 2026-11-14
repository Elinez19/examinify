"use client";

import * as React from "react";
import { BookCheck, Eye, Users } from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import { AdminSearchInput } from "@/components/admin/ui/admin-form-controls";
import {
  AdminSortableTableHead,
  AdminTableCell,
  AdminTableHead,
  type SortDirection,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { StudentProfile } from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

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
            <select
              value={classFilter}
              onChange={(event) => setClassFilter(event.target.value)}
              aria-label="Filter by class"
              className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-xs font-bold text-brand-900 focus:border-brand-600 focus:outline-none"
            >
              <option value="ALL">All Classes</option>
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
              className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-xs font-bold text-brand-900 focus:border-brand-600 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
          <table className="w-full text-left text-xs">
            <thead className="border-b-2 border-brand-100 bg-surface-pearl">
              <tr>
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
            </thead>
            <tbody className="divide-y divide-brand-100 bg-white">
              {filteredStudents.length === 0 ? (
                <tr>
                  <AdminTableCell
                    colSpan={6}
                    className="py-8 text-center text-xs font-medium text-ink-secondary"
                  >
                    No students matched the selected filters.
                  </AdminTableCell>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const subCount = getSubmissionCount(student.id);
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-surface-mist/50 transition-colors"
                    >
                      <AdminTableCell>
                        <div className="flex items-center gap-2.5">
                          <AvatarBadge
                            name={student.name}
                            avatarUrl={student.avatarUrl}
                            size="sm"
                          />
                          <div>
                            <p className="font-extrabold text-brand-950">
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
                        <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-900">
                          {student.classLevel}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell className="font-bold text-brand-900">
                        {subCount} script{subCount === 1 ? "" : "s"}
                      </AdminTableCell>
                      <AdminTableCell>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                            student.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                          )}
                        >
                          {student.status}
                        </span>
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
                              href: "/teacher/exams?tab=grading",
                            },
                          ]}
                        />
                      </AdminTableCell>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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


"use client";

import * as React from "react";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import { AdminSearchInput } from "@/components/admin/ui/admin-form-controls";
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
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { useTableSelection } from "@/hooks/portal/use-table-selection";

export function StudentClassWorkspace() {
  const { store, activeSessionTerm } = usePortalStore();
  const [searchQuery, setSearchQuery] = React.useState("");

  const classArm = store.classArms.find(
    (arm) =>
      arm.id === store.student.classArmId || arm.name === store.student.classLevel
  );

  const classTeacher = store.teachers.find(
    (teacher) => teacher.id === classArm?.classTeacherId
  );

  const classmates = store.students.filter(
    (student) =>
      student.classLevel === store.student.classLevel &&
      student.status === "active"
  );

  const q = searchQuery.trim().toLowerCase();
  const filteredPeers = classmates.filter(
    (peer) =>
      !q ||
      peer.name.toLowerCase().includes(q) ||
      peer.admissionNo.toLowerCase().includes(q)
  );

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.student.termLabel;

  const selection = useTableSelection(filteredPeers.map((peer) => peer.id));

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Class Enrollment · ${termLabel}`}
        eyebrowIcon="dot"
        headline={store.student.classLevel}
        subtitle={`Your assigned class arm, homeroom coordinator, and active classmates at ${store.student.schoolName}.`}
        primaryCta={{
          label: "My Subjects",
          href: "/student/subjects",
          variant: "primary",
          icon: <BookOpen className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Study Mode",
          href: "/student/study-mode",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <AdminSectionCard
          title="Homeroom Oversight"
          description="Your assigned class arm, academic wing, and class teacher."
          action={<GraduationCap className="h-4 w-4 text-brand-500" />}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4">
              {classTeacher ? (
                <>
                  <AvatarBadge
                    name={classTeacher.name}
                    avatarUrl={classTeacher.avatarUrl}
                    size="md"
                  />
                  <div>
                    <p className="font-display text-sm font-extrabold text-brand-950">
                      {classTeacher.name}
                    </p>
                    <p className="text-xs font-medium text-ink-secondary">
                      {classTeacher.department}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-xs font-medium text-ink-secondary">
                  Class teacher assigned by Administrator.
                </p>
              )}
            </div>

            <div className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-500">
                Class Arm
              </span>
              <p className="mt-1 font-display text-base font-extrabold text-brand-950">
                {store.student.classLevel}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-500">
                Academic Wing
              </span>
              <p className="mt-1 font-display text-base font-extrabold text-brand-950">
                {classArm?.arm ?? store.student.wing}
              </p>
            </div>
          </div>
        </AdminSectionCard>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search classmates by name or admission no..."
          />
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Classmate Roster"
            subtitle={`Active students enrolled in ${store.student.classLevel}.`}
            badge={`${filteredPeers.length} students`}
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
            {filteredPeers.length === 0 ? (
              <AdminEmptyState
                title="No Classmates Found"
                description="No classmates matched your search query."
                icon={<Users className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead className="w-10">
                      <AdminCheckbox
                        aria-label="Select all classmates"
                        checked={selection.allSelected}
                        indeterminate={selection.someSelected}
                        onChange={(e) => selection.toggleAll(e.target.checked)}
                      />
                    </AdminTableHead>
                    <AdminTableHead>Student</AdminTableHead>
                    <AdminTableHead>Admission No</AdminTableHead>
                    <AdminTableHead>Class Arm</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredPeers.map((peer) => (
                    <AdminTableRow
                      key={peer.id}
                      isSelected={
                        selection.isSelected(peer.id) ||
                        peer.id === store.student.id
                      }
                    >
                      <AdminTableCell className="w-10">
                        <AdminCheckbox
                          aria-label={`Select ${peer.name}`}
                          checked={selection.isSelected(peer.id)}
                          onChange={() => selection.toggleOne(peer.id)}
                        />
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex items-center gap-2.5">
                          <AvatarBadge
                            name={peer.name}
                            avatarUrl={peer.avatarUrl}
                            size="sm"
                          />
                          <div>
                            <p className="font-display font-extrabold text-brand-950">
                              {peer.name}
                              {peer.id === store.student.id ? " (You)" : ""}
                            </p>
                            <p className="text-[11px] font-medium text-ink-secondary">
                              {peer.email}
                            </p>
                          </div>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell className="font-mono font-bold text-brand-800">
                        {peer.admissionNo}
                      </AdminTableCell>
                      <AdminTableCell>
                        <PillBadge
                          tone="sky"
                          className="px-2.5 py-0.5 text-[10px]"
                        >
                          {peer.classLevel}
                        </PillBadge>
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill status={peer.status} />
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            )}
          </AdminDataTable>
        </div>
      </AdminWorkspaceSlab>
    </div>
  );
}

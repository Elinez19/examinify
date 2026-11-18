"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, Sparkles } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
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
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { useTableSelection } from "@/hooks/portal/use-table-selection";
import type { SubjectEnrollment } from "@/data/portal-mock-data";

export function StudentSubjectsWorkspace() {
  const router = useRouter();
  const { store, activeSessionTerm } = usePortalStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSubject, setSelectedSubject] =
    React.useState<SubjectEnrollment | null>(null);

  const assignedSubjects = store.subjects.filter(
    (subject) =>
      subject.status === "active" &&
      (subject.assignedClasses.length === 0 ||
        subject.assignedClasses.includes(store.student.classLevel))
  );

  const q = searchQuery.trim().toLowerCase();
  const filteredSubjects = assignedSubjects.filter(
    (subject) =>
      !q ||
      subject.title.toLowerCase().includes(q) ||
      subject.code.toLowerCase().includes(q) ||
      subject.teacherName.toLowerCase().includes(q)
  );

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.student.termLabel;

  const selection = useTableSelection(
    filteredSubjects.map((subject) => subject.id)
  );

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Class & Subjects · ${termLabel}`}
        eyebrowIcon="dot"
        headline="My Registered Subjects."
        highlightWords={["Registered", "Subjects."]}
        subtitle={`Review subjects assigned to ${store.student.classLevel}, track syllabus coverage, or launch Study Mode.`}
        primaryCta={{
          label: "Practice in Study Mode",
          href: "/student/study-mode",
          variant: "primary",
          icon: <Sparkles className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "My Class",
          href: "/student/class",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search subject, code, or teacher..."
          />
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Assigned Class Subjects"
            subtitle="All subjects registered for your class arm this term."
            badge={`${filteredSubjects.length} subjects`}
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
            {filteredSubjects.length === 0 ? (
              <AdminEmptyState
                title="No Subjects Found"
                description="No subjects matched your search query."
                icon={<BookOpen className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead className="w-10">
                      <AdminCheckbox
                        aria-label="Select all subjects"
                        checked={selection.allSelected}
                        indeterminate={selection.someSelected}
                        onChange={(e) => selection.toggleAll(e.target.checked)}
                      />
                    </AdminTableHead>
                    <AdminTableHead>Code</AdminTableHead>
                    <AdminTableHead>Subject Title</AdminTableHead>
                    <AdminTableHead>Subject Teacher</AdminTableHead>
                    <AdminTableHead>Syllabus Progress</AdminTableHead>
                    <AdminTableHead>Next CBT</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredSubjects.map((subject) => {
                    const progressPct =
                      subject.totalTopics > 0
                        ? Math.round(
                            (subject.topicsCovered / subject.totalTopics) * 100
                          )
                        : 0;
                    return (
                      <AdminTableRow
                        key={subject.id}
                        isSelected={selection.isSelected(subject.id)}
                      >
                        <AdminTableCell className="w-10">
                          <AdminCheckbox
                            aria-label={`Select ${subject.title}`}
                            checked={selection.isSelected(subject.id)}
                            onChange={() => selection.toggleOne(subject.id)}
                          />
                        </AdminTableCell>
                        <AdminTableCell className="font-mono font-extrabold text-brand-900">
                          {subject.code}
                        </AdminTableCell>
                        <AdminTableCell>
                          <p className="font-display font-extrabold text-brand-950">
                            {subject.title}
                          </p>
                          <p className="text-[11px] font-medium text-ink-secondary">
                            {subject.category}
                          </p>
                        </AdminTableCell>
                        <AdminTableCell className="font-semibold text-brand-800">
                          {subject.teacherName}
                        </AdminTableCell>
                        <AdminTableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-brand-100">
                              <div
                                className="h-full rounded-full bg-brand-700"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                            <PillBadge
                              tone="sky"
                              className="px-2 py-0.5 text-[10px]"
                            >
                              {progressPct}%
                            </PillBadge>
                          </div>
                        </AdminTableCell>
                        <AdminTableCell className="font-medium text-ink-secondary">
                          {subject.nextExamAt}
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                          <AdminActionMenu
                            ariaLabel={`Actions for ${subject.title}`}
                            items={[
                              {
                                id: "study",
                                label: "Study Now",
                                icon: <Sparkles className="h-3.5 w-3.5" />,
                                variant: "primary",
                                onClick: () =>
                                  router.push(
                                    `/student/study-mode?subject=${encodeURIComponent(subject.code)}`
                                  ),
                              },
                              {
                                id: "details",
                                label: "Subject Details",
                                icon: <Eye className="h-3.5 w-3.5" />,
                                onClick: () => setSelectedSubject(subject),
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

      <AdminModal
        open={Boolean(selectedSubject)}
        onOpenChange={(open) => {
          if (!open) setSelectedSubject(null);
        }}
        eyebrow={selectedSubject?.code ?? "Subject"}
        title={selectedSubject?.title ?? "Subject Details"}
        description={selectedSubject?.category}
        size="md"
        footer={
          <>
            <CtaButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setSelectedSubject(null)}
            >
              Close
            </CtaButton>
            {selectedSubject && (
              <CtaButton
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  const code = selectedSubject.code;
                  setSelectedSubject(null);
                  router.push(
                    `/student/study-mode?subject=${encodeURIComponent(code)}`
                  );
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Launch Study Mode</span>
              </CtaButton>
            )}
          </>
        }
      >
        {selectedSubject && (
          <div className="grid grid-cols-2 gap-3 rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 text-xs">
            <div>
              <span className="block text-[10px] font-bold uppercase text-brand-500">
                Subject Teacher
              </span>
              <span className="font-extrabold text-brand-950">
                {selectedSubject.teacherName}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-brand-500">
                Question Bank Items
              </span>
              <span className="font-extrabold text-brand-950">
                {
                  store.questions.filter(
                    (q) => q.subjectCode === selectedSubject.code
                  ).length
                }{" "}
                Questions
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-brand-500">
                Syllabus Covered
              </span>
              <span className="font-extrabold text-brand-950">
                {selectedSubject.topicsCovered} / {selectedSubject.totalTopics}{" "}
                topics
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-brand-500">
                Next CBT Schedule
              </span>
              <span className="font-extrabold text-brand-950">
                {selectedSubject.nextExamAt}
              </span>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

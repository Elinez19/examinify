"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, Layers } from "lucide-react";
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
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { SubjectEnrollment } from "@/data/portal-mock-data";

type SubjectSortKey = "code" | "title" | "questions" | "passRate";

export function TeacherSubjectsWorkspace() {
  const router = useRouter();
  const { store, activeSessionTerm } = usePortalStore();

  const [subSearch, setSubSearch] = React.useState("");
  const [subClassFilter, setSubClassFilter] = React.useState("ALL");
  const [subSortKey, setSubSortKey] = React.useState<SubjectSortKey>("title");
  const [subSortDir, setSubSortDir] = React.useState<SortDirection>("asc");
  const [inspectSubject, setInspectSubject] =
    React.useState<SubjectEnrollment | null>(null);

  const handleSortSubjects = (key: SubjectSortKey) => {
    if (subSortKey === key) {
      setSubSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSubSortKey(key);
      setSubSortDir("asc");
    }
  };

  const filteredSubjects = React.useMemo(() => {
    const q = subSearch.trim().toLowerCase();
    const list = store.subjects.filter((sub) => {
      const assignedClasses = sub.assignedClasses ?? [];
      if (
        subClassFilter !== "ALL" &&
        !assignedClasses.includes(subClassFilter)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        (sub.title ?? "").toLowerCase().includes(q) ||
        (sub.code ?? "").toLowerCase().includes(q) ||
        (sub.category ?? "").toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      let cmp = 0;
      const qCountA = store.questions.filter(
        (item) => item.subjectCode === a.code
      ).length;
      const qCountB = store.questions.filter(
        (item) => item.subjectCode === b.code
      ).length;
      if (subSortKey === "code") cmp = (a.code ?? "").localeCompare(b.code ?? "");
      else if (subSortKey === "title")
        cmp = (a.title ?? "").localeCompare(b.title ?? "");
      else if (subSortKey === "questions") cmp = qCountA - qCountB;
      else if (subSortKey === "passRate")
        cmp = (a.passRate ?? 0) - (b.passRate ?? 0);
      return subSortDir === "asc" ? cmp : -cmp;
    });
  }, [
    store.questions,
    store.subjects,
    subClassFilter,
    subSearch,
    subSortDir,
    subSortKey,
  ]);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Class & Subjects · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Assigned Subjects."
        highlightWords={["Assigned", "Subjects."]}
        subtitle="Review your teaching subjects, assigned class arms, syllabus coverage, and question bank counts."
        primaryCta={{
          label: "Open Question Bank",
          href: "/teacher/question-bank",
          variant: "primary",
          icon: <Layers className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "ClassList Roster",
          href: "/teacher/class-list",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={subSearch}
            onChange={setSubSearch}
            placeholder="Search subject title, code, or category..."
          />
          <AdminSelectField
            variant="filter"
            aria-label="Filter by class"
            value={subClassFilter}
            onChange={setSubClassFilter}
            options={[
              { id: "ALL", label: "All Class Arms" },
              ...store.classArms.map((arm) => ({
                id: arm.name,
                label: arm.name,
              })),
            ]}
          />
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Assigned Subjects Directory"
            subtitle="Inspect subject metadata or jump straight into its question bank."
            badge={`${filteredSubjects.length} subjects`}
          >
            {filteredSubjects.length === 0 ? (
              <AdminEmptyState
                title="No Subjects Found"
                description="No subjects matched your search or class filter."
                icon={<BookOpen className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminSortableTableHead
                      label="Code"
                      sortKey="code"
                      activeSortKey={subSortKey}
                      sortDirection={subSortDir}
                      onSort={handleSortSubjects}
                    />
                    <AdminSortableTableHead
                      label="Subject"
                      sortKey="title"
                      activeSortKey={subSortKey}
                      sortDirection={subSortDir}
                      onSort={handleSortSubjects}
                    />
                    <AdminTableHead>Assigned Classes</AdminTableHead>
                    <AdminSortableTableHead
                      label="Bank Items"
                      sortKey="questions"
                      activeSortKey={subSortKey}
                      sortDirection={subSortDir}
                      onSort={handleSortSubjects}
                    />
                    <AdminSortableTableHead
                      label="Pass Rate"
                      sortKey="passRate"
                      activeSortKey={subSortKey}
                      sortDirection={subSortDir}
                      onSort={handleSortSubjects}
                    />
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredSubjects.map((subject) => {
                    const bankCount = store.questions.filter(
                      (item) => item.subjectCode === subject.code
                    ).length;
                    return (
                      <AdminTableRow key={subject.id}>
                        <AdminTableCell className="font-mono font-bold text-brand-900">
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
                        <AdminTableCell>
                          <div className="flex flex-wrap gap-1">
                            {(subject.assignedClasses ?? []).map((cls) => (
                              <PillBadge
                                key={cls}
                                tone="sky"
                                className="px-2 py-0.5 text-[10px]"
                              >
                                {cls}
                              </PillBadge>
                            ))}
                          </div>
                        </AdminTableCell>
                        <AdminTableCell className="font-bold text-brand-900">
                          {bankCount} items
                        </AdminTableCell>
                        <AdminTableCell className="font-display font-extrabold text-accent-success">
                          {subject.passRate}%
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminStatusPill status={subject.status} />
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                          <AdminActionMenu
                            ariaLabel={`Actions for ${subject.title}`}
                            items={[
                              {
                                id: "browse-bank",
                                label: "Open Question Bank",
                                icon: <Layers className="h-3.5 w-3.5" />,
                                variant: "primary",
                                onClick: () =>
                                  router.push(
                                    `/teacher/question-bank?subject=${encodeURIComponent(subject.code)}`
                                  ),
                              },
                              {
                                id: "inspect-sub",
                                label: "Subject Details",
                                icon: <Eye className="h-3.5 w-3.5" />,
                                onClick: () => setInspectSubject(subject),
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
        open={Boolean(inspectSubject)}
        onOpenChange={(open) => {
          if (!open) setInspectSubject(null);
        }}
        eyebrow={inspectSubject?.code ?? "Subject"}
        title={inspectSubject?.title ?? "Subject Details"}
        description={inspectSubject?.category}
        size="md"
        footer={
          <>
            <CtaButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setInspectSubject(null)}
            >
              Close
            </CtaButton>
            {inspectSubject && (
              <CtaButton
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  const code = inspectSubject.code;
                  setInspectSubject(null);
                  router.push(
                    `/teacher/question-bank?subject=${encodeURIComponent(code)}`
                  );
                }}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Manage Questions</span>
              </CtaButton>
            )}
          </>
        }
      >
        {inspectSubject && (
          <div className="grid grid-cols-2 gap-3 rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 text-xs">
            <div>
              <span className="block text-[10px] font-bold uppercase text-brand-500">
                Assigned Classes
              </span>
              <span className="font-extrabold text-brand-950">
                {(inspectSubject.assignedClasses ?? []).join(", ") ||
                  "All Classes"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-brand-500">
                Syllabus Progress
              </span>
              <span className="font-extrabold text-brand-950">
                {inspectSubject.topicsCovered} / {inspectSubject.totalTopics}{" "}
                Topics
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-brand-500">
                Next CBT Date
              </span>
              <span className="font-extrabold text-brand-950">
                {inspectSubject.nextExamAt}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-brand-500">
                Average Pass Rate
              </span>
              <span className="font-extrabold text-accent-success">
                {inspectSubject.passRate}%
              </span>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

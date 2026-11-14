"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, Sparkles, UserCheck, Users } from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type { SubjectEnrollment } from "@/data/portal-mock-data";

export function StudentClassWorkspace() {
  const { store, activeSessionTerm } = usePortalStore();
  const [selectedSubject, setSelectedSubject] =
    React.useState<SubjectEnrollment | null>(null);

  const classArm = store.classArms.find(
    (arm) =>
      arm.id === store.student.classArmId || arm.name === store.student.classLevel
  );

  const classTeacher = store.teachers.find(
    (teacher) => teacher.id === classArm?.classTeacherId
  );

  const assignedSubjects = store.subjects.filter(
    (subject) =>
      subject.status === "active" &&
      (subject.assignedClasses.length === 0 ||
        subject.assignedClasses.includes(store.student.classLevel))
  );

  const classmates = store.students.filter(
    (student) =>
      student.classLevel === store.student.classLevel &&
      student.status === "active"
  );

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.student.termLabel;

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow={`Class Enrollment · ${termLabel}`}
        title={store.student.classLevel}
        description={`Your assigned class arm, homeroom teacher, and registered subjects for ${store.student.schoolName}.`}
        badgeLabel={classArm?.arm ?? store.student.wing}
        badgeTone="brand"
        metrics={[
          { label: "Subjects", value: `${assignedSubjects.length}` },
          { label: "Active Peers", value: `${classmates.length}` },
          {
            label: "Class Teacher",
            value: classTeacher ? classTeacher.lastName : "Assigned",
          },
        ]}
        action={
          <Link
            href="/student/study-mode"
            className="cta-surface-secondary inline-flex items-center gap-2 rounded-pill px-5 py-2.5 font-display text-xs font-extrabold transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Practice Subjects
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminSectionCard
          title="Assigned Class Subjects"
          description="Subjects registered for your class arm this term."
          className="lg:col-span-2"
          action={<BookOpen className="h-4 w-4 text-brand-500" />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {assignedSubjects.map((subject) => {
              const progressPct =
                subject.totalTopics > 0
                  ? Math.round((subject.topicsCovered / subject.totalTopics) * 100)
                  : 0;
              return (
                <div
                  key={subject.id}
                  className="flex flex-col justify-between rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-extrabold text-brand-900">
                        {subject.code}
                      </span>
                      <span className="text-[11px] font-bold text-brand-700">
                        {progressPct}% Syllabus
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-base font-extrabold text-brand-950">
                      {subject.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-ink-secondary">
                      Teacher: {subject.teacherName}
                    </p>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
                      <div
                        className="h-full rounded-full bg-brand-700"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-brand-100">
                    <button
                      type="button"
                      onClick={() => setSelectedSubject(subject)}
                      className="text-xs font-extrabold text-brand-700 hover:text-brand-950 cursor-pointer"
                    >
                      Subject Details
                    </button>
                    <Link
                      href={`/student/study-mode?subject=${encodeURIComponent(subject.code)}`}
                      className="cta-surface-primary rounded-pill px-3.5 py-1.5 font-display text-[11px] font-extrabold text-ink-on-blue transition-colors"
                    >
                      Study Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </AdminSectionCard>

        <div className="space-y-6">
          <AdminSectionCard
            title="Class Oversight"
            description="Your homeroom coordinator and wing details."
            action={<GraduationCap className="h-4 w-4 text-brand-500" />}
          >
            <div className="rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4 space-y-3">
              {classTeacher ? (
                <div className="flex items-center gap-3">
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
                </div>
              ) : (
                <p className="text-xs font-medium text-ink-secondary">
                  Class teacher assignment managed by Administrator.
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 border-t border-brand-100 pt-3 text-xs">
                <div>
                  <span className="block text-[10px] font-bold uppercase text-brand-500">
                    Class Arm
                  </span>
                  <span className="font-extrabold text-brand-950">
                    {store.student.classLevel}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase text-brand-500">
                    Wing
                  </span>
                  <span className="font-extrabold text-brand-950">
                    {classArm?.arm ?? store.student.wing}
                  </span>
                </div>
              </div>
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="Class Roster Preview"
            description="Active classmates in your class arm."
            action={<Users className="h-4 w-4 text-brand-500" />}
          >
            <div className="space-y-2.5">
              {classmates.map((peer) => (
                <div
                  key={peer.id}
                  className="flex items-center justify-between gap-2.5 rounded-xl border border-brand-100 bg-white px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <AvatarBadge
                      name={peer.name}
                      avatarUrl={peer.avatarUrl}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-extrabold text-brand-950">
                        {peer.name}
                        {peer.id === store.student.id ? " (You)" : ""}
                      </p>
                      <p className="truncate text-[10px] font-medium text-ink-secondary">
                        {peer.admissionNo}
                      </p>
                    </div>
                  </div>
                  <UserCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                </div>
              ))}
            </div>
          </AdminSectionCard>
        </div>
      </div>

      <AdminModal
        open={Boolean(selectedSubject)}
        onOpenChange={(open) => {
          if (!open) setSelectedSubject(null);
        }}
        eyebrow={selectedSubject?.code ?? "Subject"}
        title={selectedSubject?.title ?? "Subject Details"}
        description={selectedSubject?.category}
        size="md"
      >
        {selectedSubject && (
          <div className="space-y-4">
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
                  {selectedSubject.topicsCovered} / {selectedSubject.totalTopics} topics
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

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSubject(null)}
                className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 hover:bg-brand-50 cursor-pointer"
              >
                Close
              </button>
              <Link
                href={`/student/study-mode?subject=${encodeURIComponent(selectedSubject.code)}`}
                className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Launch Study Mode
              </Link>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}


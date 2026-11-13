"use client";

import * as React from "react";
import { BookOpen, Play, Sparkles, User } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";

export function StudentSubjectsWorkspace() {
  const { store } = usePortalStore();

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow={`${store.student.classLevel} Curriculum Bank`}
        eyebrowIcon="dot"
        headline="Enrolled Subjects & Practice Packs."
        highlightWords={["Subjects", "Practice"]}
        subtitle="Track topic mastery across your registered subjects and launch untimed or timed practice drills offline."
        primaryCta={{
          label: "Go to Exam Hall",
          href: "/student/exams",
          variant: "primary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {store.subjects.map((subject) => {
            const subjectQuestionCount = store.questions.filter(
              (q) => q.subjectId === subject.id
            ).length;

            return (
              <article
                key={subject.id}
                className="surface-gloss-card p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <PillBadge tone="sky" className="px-2.5 py-0.5 text-[10px]">
                      {subject.code} · {subject.classLevel}
                    </PillBadge>
                    <span className="inline-flex items-center gap-1 rounded-pill bg-brand-50 px-2.5 py-0.5 font-display text-[11px] font-extrabold text-brand-700 border border-brand-100">
                      <Sparkles className="h-3 w-3 text-accent-gold" />
                      {subject.masteryPercent}% Mastery
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-extrabold text-brand-950">
                      {subject.title}
                    </h3>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-secondary">
                      <User className="h-3.5 w-3.5 text-brand-600" />
                      {subject.teacherName}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-ink-secondary">
                      <span>{subject.topicsCount} Curriculum Topics</span>
                      <span>{subjectQuestionCount} Practice Items</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-pill bg-brand-100">
                      <div
                        className="h-full rounded-pill bg-brand-600"
                        style={{ width: `${subject.masteryPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-secondary">
                    <BookOpen className="h-3.5 w-3.5 text-brand-600" />
                    {subject.nextAssessment}
                  </span>

                  <CtaButton
                    variant="secondary"
                    size="xs"
                    href={`/exam/${subject.practiceExamId}`}
                  >
                    <Play className="h-3 w-3" />
                    Practice Drill
                  </CtaButton>
                </div>
              </article>
            );
          })}
        </div>
      </AdminWorkspaceSlab>
    </div>
  );
}


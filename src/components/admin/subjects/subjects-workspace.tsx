"use client";

import * as React from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Edit3,
  GraduationCap,
  Layers,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import {
  AdminSearchInput,
  AdminSelectField,
  AdminTextField,
  AdminTextareaField,
} from "@/components/admin/ui/admin-form-controls";
import {
  AdminTableCell,
  AdminTableHead,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type {
  AcademicSessionTerm,
  ClassArm,
  QuestionItem,
  QuestionType,
  SubjectEnrollment,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

type AcademicsTab = "subjects" | "classes" | "terms" | "question_bank";

export function SubjectsWorkspace() {
  const {
    store,
    activeSessionTerm,
    saveSubject,
    deleteSubject,
    saveClassArm,
    deleteClassArm,
    saveAcademicTerm,
    setActiveAcademicTerm,
    deleteAcademicTerm,
    toggleQuestionType,
    addOrUpdateQuestion,
    deleteQuestion,
  } = usePortalStore();

  const [activeTab, setActiveTab] = React.useState<AcademicsTab>("subjects");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Subject modal
  const [subjectModalOpen, setSubjectModalOpen] = React.useState(false);
  const [subjectForm, setSubjectForm] = React.useState({
    id: "",
    code: "",
    title: "",
    category: "Core",
    assignedClasses: [] as string[],
    assignedTeacherIds: [] as string[],
  });

  // Class arm modal
  const [classModalOpen, setClassModalOpen] = React.useState(false);
  const [classForm, setClassForm] = React.useState({
    id: "",
    name: "",
    level: "JSS 3",
    arm: "Science Wing",
    classTeacherId: store.teachers[0]?.id ?? "",
    capacity: 40,
  });

  // Term modal
  const [termModalOpen, setTermModalOpen] = React.useState(false);
  const [termForm, setTermForm] = React.useState({
    id: "",
    session: "2026/2027",
    term: "First Term" as AcademicSessionTerm["term"],
    startsAt: "Sep 08, 2026",
    endsAt: "Dec 18, 2026",
    isActive: false,
  });

  // Question modal
  const [questionModalOpen, setQuestionModalOpen] = React.useState(false);
  const [questionForm, setQuestionForm] = React.useState({
    id: "",
    subjectCode: store.subjects[0]?.code ?? "MTH-301",
    topic: "",
    classLevel: store.classArms[0]?.name ?? "JSS 3A",
    type: "objective" as QuestionType,
    difficulty: "Standard" as QuestionItem["difficulty"],
    marks: 2,
    prompt: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOptionId: "a",
    acceptedAnswersText: "",
    markingGuide: "",
  });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = React.useState<{
    kind: "subject" | "class" | "term" | "question";
    id: string;
    label: string;
  } | null>(null);

  const openAddSubject = () => {
    setSubjectForm({
      id: "",
      code: "",
      title: "",
      category: "Core STEM",
      assignedClasses: store.classArms[0] ? [store.classArms[0].name] : [],
      assignedTeacherIds: store.teachers[0] ? [store.teachers[0].id] : [],
    });
    setSubjectModalOpen(true);
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
    setSubjectModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.code.trim() || !subjectForm.title.trim()) return;
    const primaryTeacher = store.teachers.find((t) =>
      subjectForm.assignedTeacherIds.includes(t.id)
    );
    const existing = store.subjects.find((s) => s.id === subjectForm.id);
    saveSubject({
      id: subjectForm.id || `sub_${Date.now()}`,
      code: subjectForm.code.trim().toUpperCase(),
      title: subjectForm.title.trim(),
      category: subjectForm.category.trim() || "Core",
      teacherName: primaryTeacher?.name ?? existing?.teacherName ?? "Unassigned",
      assignedClasses: subjectForm.assignedClasses,
      assignedTeacherIds: subjectForm.assignedTeacherIds,
      nextExamAt: existing?.nextExamAt ?? "Not scheduled",
      topicsCovered: existing?.topicsCovered ?? 0,
      totalTopics: existing?.totalTopics ?? 10,
      questionCount: store.questions.filter(
        (q) => q.subjectCode === subjectForm.code.trim().toUpperCase()
      ).length,
      passRate: existing?.passRate ?? 80,
      status: "active",
    });
    setSubjectModalOpen(false);
  };

  const openAddClassArm = () => {
    setClassForm({
      id: "",
      name: "",
      level: "JSS 3",
      arm: "Science Wing",
      classTeacherId: store.teachers[0]?.id ?? "",
      capacity: 40,
    });
    setClassModalOpen(true);
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
    setClassModalOpen(true);
  };

  const handleSaveClassArm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.name.trim()) return;
    saveClassArm({
      id: classForm.id || `arm_${Date.now()}`,
      name: classForm.name.trim(),
      level: classForm.level.trim() || "JSS 3",
      arm: classForm.arm.trim() || "General",
      classTeacherId: classForm.classTeacherId,
      capacity: Number(classForm.capacity) || 40,
      status: "active",
    });
    setClassModalOpen(false);
  };

  const openAddTerm = () => {
    setTermForm({
      id: "",
      session: "2026/2027",
      term: "Third Term",
      startsAt: "Apr 19, 2027",
      endsAt: "Jul 23, 2027",
      isActive: false,
    });
    setTermModalOpen(true);
  };

  const handleSaveTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termForm.session.trim()) return;
    saveAcademicTerm({
      id: termForm.id || `term_${Date.now()}`,
      session: termForm.session.trim(),
      term: termForm.term,
      startsAt: termForm.startsAt.trim(),
      endsAt: termForm.endsAt.trim(),
      isActive: termForm.isActive,
    });
    setTermModalOpen(false);
  };

  const openAddQuestion = () => {
    setQuestionForm({
      id: "",
      subjectCode: store.subjects[0]?.code ?? "MTH-301",
      topic: "",
      classLevel: store.classArms[0]?.name ?? "JSS 3A",
      type: "objective",
      difficulty: "Standard",
      marks: 2,
      prompt: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOptionId: "a",
      acceptedAnswersText: "",
      markingGuide: "",
    });
    setQuestionModalOpen(true);
  };

  const openEditQuestion = (q: QuestionItem) => {
    const optMap = new Map((q.options ?? []).map((o) => [o.id, o.label]));
    setQuestionForm({
      id: q.id,
      subjectCode: q.subjectCode,
      topic: q.topic,
      classLevel: q.classLevel,
      type: q.type,
      difficulty: q.difficulty,
      marks: q.marks,
      prompt: q.prompt,
      optionA: optMap.get("a") ?? "",
      optionB: optMap.get("b") ?? "",
      optionC: optMap.get("c") ?? "",
      optionD: optMap.get("d") ?? "",
      correctOptionId: q.correctOptionId ?? "a",
      acceptedAnswersText: (q.acceptedAnswers ?? []).join(", "),
      markingGuide: q.markingGuide ?? "",
    });
    setQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.topic.trim() || !questionForm.prompt.trim()) return;
    const subject = store.subjects.find(
      (s) => s.code === questionForm.subjectCode
    );
    addOrUpdateQuestion({
      id: questionForm.id || `q_${Date.now()}`,
      subjectCode: questionForm.subjectCode,
      subjectTitle: subject?.title ?? questionForm.subjectCode,
      topic: questionForm.topic.trim(),
      classLevel: questionForm.classLevel,
      term: activeSessionTerm?.term ?? "First Term",
      type: questionForm.type,
      difficulty: questionForm.difficulty,
      marks: Number(questionForm.marks) || 2,
      prompt: questionForm.prompt.trim(),
      options:
        questionForm.type === "objective" || questionForm.type === "multi_select"
          ? [
              { id: "a", label: questionForm.optionA || "Option A" },
              { id: "b", label: questionForm.optionB || "Option B" },
              { id: "c", label: questionForm.optionC || "Option C" },
              { id: "d", label: questionForm.optionD || "Option D" },
            ]
          : undefined,
      correctOptionId:
        questionForm.type === "objective"
          ? questionForm.correctOptionId
          : undefined,
      acceptedAnswers:
        questionForm.type === "fill_blank"
          ? questionForm.acceptedAnswersText
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean)
          : undefined,
      markingGuide:
        questionForm.type === "theory" ? questionForm.markingGuide : undefined,
      createdBy: "School Administrator",
      updatedAt: "Today",
    });
    setQuestionModalOpen(false);
  };

  const q = searchQuery.trim().toLowerCase();

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow="Curriculum & Academic Configuration"
        title="Subjects, Terms, Class Arms & Question Bank"
        description="Create school subjects, configure academic sessions and active terms, build class arms, assign classes and teachers, and govern question types & banks."
        badgeLabel={
          activeSessionTerm
            ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
            : "Academic Setup"
        }
        badgeTone="emerald"
        metrics={[
          { label: "Subjects", value: `${store.subjects.length}` },
          { label: "Class Arms", value: `${store.classArms.length}` },
          { label: "Bank Items", value: `${store.questions.length}` },
        ]}
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openAddSubject}
              className="cta-surface-secondary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New Subject
            </button>
            <button
              type="button"
              onClick={openAddClassArm}
              className="inline-flex items-center gap-1.5 rounded-pill border border-surface-porcelain/35 bg-surface-porcelain/15 px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue transition-colors hover:bg-surface-porcelain/25 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New Class Arm
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {(
          [
            {
              id: "subjects",
              label: `Subjects (${store.subjects.length})`,
              icon: BookOpen,
            },
            {
              id: "classes",
              label: `Class Arms (${store.classArms.length})`,
              icon: GraduationCap,
            },
            {
              id: "terms",
              label: `Sessions & Terms (${store.academicTerms.length})`,
              icon: CalendarDays,
            },
            {
              id: "question_bank",
              label: `Question Types & Bank (${store.questions.length})`,
              icon: Layers,
            },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold transition-colors cursor-pointer",
                activeTab === tab.id
                  ? "cta-surface-primary text-ink-on-blue"
                  : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 shadow-gloss-card hover:bg-surface-mist"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "subjects" && (
        <AdminSectionCard
          title="Subjects & Class / Teacher Allocations"
          description="Assign subjects to classes and teaching faculty via contextual modals."
          action={
            <button
              type="button"
              onClick={openAddSubject}
              className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Subject
            </button>
          }
        >
          <div className="mb-4 w-full sm:w-72">
            <AdminSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search subjects..."
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-brand-100 bg-surface-pearl">
                <tr>
                  <AdminTableHead>Code</AdminTableHead>
                  <AdminTableHead>Subject Title</AdminTableHead>
                  <AdminTableHead>Assigned Classes</AdminTableHead>
                  <AdminTableHead>Assigned Teachers</AdminTableHead>
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 bg-white">
                {store.subjects
                  .filter(
                    (s) =>
                      !q ||
                      s.title.toLowerCase().includes(q) ||
                      s.code.toLowerCase().includes(q)
                  )
                  .map((sub) => (
                    <tr key={sub.id} className="hover:bg-surface-mist/50 transition-colors">
                      <AdminTableCell className="font-mono font-extrabold text-brand-900">
                        {sub.code}
                      </AdminTableCell>
                      <AdminTableCell>
                        <p className="font-extrabold text-brand-950">
                          {sub.title}
                        </p>
                        <p className="text-[11px] text-ink-secondary">
                          {sub.category}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex flex-wrap gap-1">
                          {sub.assignedClasses.map((c) => (
                            <span
                              key={c}
                              className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-extrabold text-brand-900"
                            >
                              {c}
                            </span>
                          ))}
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
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Actions for ${sub.title}`}
                          items={[
                            {
                              id: "edit-sub",
                              label: "Edit & Assign Classes/Teachers",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditSubject(sub),
                            },
                            {
                              id: "del-sub",
                              label: "Delete Subject",
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              onClick: () =>
                                setDeleteTarget({
                                  kind: "subject",
                                  id: sub.id,
                                  label: sub.title,
                                }),
                            },
                          ]}
                        />
                      </AdminTableCell>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </AdminSectionCard>
      )}

      {activeTab === "classes" && (
        <AdminSectionCard
          title="Class Arms & Class Teachers"
          description="Define school arms (e.g. JSS 3A) and assign form teachers."
          action={
            <button
              type="button"
              onClick={openAddClassArm}
              className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Class Arm
            </button>
          }
        >
          <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-brand-100 bg-surface-pearl">
                <tr>
                  <AdminTableHead>Class Name</AdminTableHead>
                  <AdminTableHead>Level & Wing</AdminTableHead>
                  <AdminTableHead>Class Teacher</AdminTableHead>
                  <AdminTableHead>Enrolled Students</AdminTableHead>
                  <AdminTableHead className="text-right">Actions</AdminTableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 bg-white">
                {store.classArms.map((arm) => {
                  const ct = store.teachers.find(
                    (t) => t.id === arm.classTeacherId
                  );
                  const stuCount = store.students.filter(
                    (s) => s.classLevel === arm.name
                  ).length;
                  return (
                    <tr key={arm.id} className="hover:bg-surface-mist/50 transition-colors">
                      <AdminTableCell className="font-extrabold text-brand-950">
                        {arm.name}
                      </AdminTableCell>
                      <AdminTableCell>
                        {arm.level} · {arm.arm}
                      </AdminTableCell>
                      <AdminTableCell className="font-semibold text-brand-900">
                        {ct?.name ?? "Unassigned"}
                      </AdminTableCell>
                      <AdminTableCell className="font-bold">
                        {stuCount} / {arm.capacity} seats
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
                              onClick: () =>
                                setDeleteTarget({
                                  kind: "class",
                                  id: arm.id,
                                  label: arm.name,
                                }),
                            },
                          ]}
                        />
                      </AdminTableCell>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AdminSectionCard>
      )}

      {activeTab === "terms" && (
        <AdminSectionCard
          title="Academic Sessions & Active Term"
          description="Set the active session and term across Student, Teacher, and Admin portals."
          action={
            <button
              type="button"
              onClick={openAddTerm}
              className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Session / Term
            </button>
          }
        >
          <div className="grid gap-3 md:grid-cols-3">
            {store.academicTerms.map((term) => (
              <div
                key={term.id}
                className={cn(
                  "flex flex-col justify-between rounded-2xl border p-4",
                  term.isActive
                    ? "border-emerald-300 bg-emerald-50/70"
                    : "border-brand-100 bg-white"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-extrabold text-brand-800">
                      {term.session}
                    </span>
                    {term.isActive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                        <CheckCircle2 className="h-3 w-3" />
                        Active Term
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-display text-base font-extrabold text-brand-950">
                    {term.term}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-ink-secondary">
                    {term.startsAt} — {term.endsAt}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-brand-100 pt-3">
                  {term.isActive ? (
                    <span className="text-xs font-extrabold text-emerald-800">
                      Currently Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveAcademicTerm(term.id)}
                      className="cta-surface-primary rounded-pill px-3.5 py-1.5 font-display text-[11px] font-extrabold text-ink-on-blue cursor-pointer"
                    >
                      Set Active Term
                    </button>
                  )}

                  {!term.isActive && (
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          kind: "term",
                          id: term.id,
                          label: `${term.term} · ${term.session}`,
                        })
                      }
                      className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>
      )}

      {activeTab === "question_bank" && (
        <div className="space-y-6">
          <AdminSectionCard
            title="Exam Question Types"
            description="Enable or disable supported CBT item formats school-wide."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {store.questionTypes.map((qt) => (
                <div
                  key={qt.id}
                  className="flex flex-col justify-between rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-brand-900">
                        {qt.autoGradable ? "Auto-Graded" : "Rubric Graded"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleQuestionType(qt.id)}
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase cursor-pointer",
                          qt.enabled
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-200 text-slate-700"
                        )}
                      >
                        {qt.enabled ? "Enabled" : "Disabled"}
                      </button>
                    </div>
                    <p className="mt-2 font-display text-sm font-extrabold text-brand-950">
                      {qt.label}
                    </p>
                    <p className="mt-1 text-xs font-medium text-ink-secondary">
                      {qt.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="School Question Bank"
            description="Create, edit, and curate assessment questions across all subjects."
            action={
              <button
                type="button"
                onClick={openAddQuestion}
                className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Bank Question
              </button>
            }
          >
            <div className="overflow-x-auto rounded-2xl border-2 border-brand-100 bg-surface-porcelain">
              <table className="w-full text-left text-xs">
                <thead className="border-b-2 border-brand-100 bg-surface-pearl">
                  <tr>
                    <AdminTableHead>Topic & Prompt</AdminTableHead>
                    <AdminTableHead>Subject</AdminTableHead>
                    <AdminTableHead>Type</AdminTableHead>
                    <AdminTableHead>Marks</AdminTableHead>
                    <AdminTableHead className="text-right">Actions</AdminTableHead>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100 bg-white">
                  {store.questions.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-mist/50 transition-colors">
                      <AdminTableCell className="max-w-md">
                        <p className="font-extrabold text-brand-950">
                          {item.topic}
                        </p>
                        <p className="line-clamp-1 text-[11px] text-ink-secondary">
                          {item.prompt}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell className="font-mono font-bold text-brand-800">
                        {item.subjectCode}
                      </AdminTableCell>
                      <AdminTableCell>
                        <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-brand-900">
                          {item.type.replace("_", " ")}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell className="font-bold">
                        {item.marks}
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Manage ${item.topic}`}
                          items={[
                            {
                              id: "edit-q",
                              label: "Edit Question",
                              icon: <Edit3 className="h-3.5 w-3.5" />,
                              onClick: () => openEditQuestion(item),
                            },
                            {
                              id: "del-q",
                              label: "Delete Question",
                              icon: <Trash2 className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              onClick: () =>
                                setDeleteTarget({
                                  kind: "question",
                                  id: item.id,
                                  label: item.topic,
                                }),
                            },
                          ]}
                        />
                      </AdminTableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminSectionCard>
        </div>
      )}

      {/* Contextual Subject Modal */}
      <AdminModal
        open={subjectModalOpen}
        onOpenChange={setSubjectModalOpen}
        eyebrow="Subject Configuration"
        title={subjectForm.id ? "Edit Subject & Allocations" : "Create Subject"}
        size="md"
      >
        <form onSubmit={handleSaveSubject} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <AdminTextField
              label="Code"
              value={subjectForm.code}
              onChange={(e) =>
                setSubjectForm((p) => ({ ...p, code: e.target.value }))
              }
              placeholder="PHY-101"
              required
            />
            <div className="sm:col-span-2">
              <AdminTextField
                label="Subject Title"
                value={subjectForm.title}
                onChange={(e) =>
                  setSubjectForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Physics"
                required
              />
            </div>
          </div>

          <AdminTextField
            label="Category"
            value={subjectForm.category}
            onChange={(e) =>
              setSubjectForm((p) => ({ ...p, category: e.target.value }))
            }
          />

          <div>
            <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
              Assign to Class Arms
            </p>
            <div className="flex flex-wrap gap-2">
              {store.classArms.map((arm) => {
                const selected = subjectForm.assignedClasses.includes(arm.name);
                return (
                  <button
                    key={arm.id}
                    type="button"
                    onClick={() =>
                      setSubjectForm((p) => ({
                        ...p,
                        assignedClasses: selected
                          ? p.assignedClasses.filter((c) => c !== arm.name)
                          : [...p.assignedClasses, arm.name],
                      }))
                    }
                    className={cn(
                      "rounded-pill px-3 py-1 font-display text-xs font-extrabold cursor-pointer transition-colors",
                      selected
                        ? "cta-surface-primary text-ink-on-blue"
                        : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 hover:bg-surface-mist"
                    )}
                  >
                    {arm.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
              Assign Subject Teachers
            </p>
            <div className="flex flex-wrap gap-2">
              {store.teachers.map((t) => {
                const selected = subjectForm.assignedTeacherIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      setSubjectForm((p) => ({
                        ...p,
                        assignedTeacherIds: selected
                          ? p.assignedTeacherIds.filter((id) => id !== t.id)
                          : [...p.assignedTeacherIds, t.id],
                      }))
                    }
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-extrabold cursor-pointer",
                      selected
                        ? "bg-emerald-700 text-white"
                        : "border border-brand-200 bg-white text-brand-800"
                    )}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSubjectModalOpen(false)}
              className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-surface-primary rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              Save Subject
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Contextual Class Arm Modal */}
      <AdminModal
        open={classModalOpen}
        onOpenChange={setClassModalOpen}
        eyebrow="Class Setup"
        title={classForm.id ? "Edit Class Arm" : "Create Class Arm"}
        size="md"
      >
        <form onSubmit={handleSaveClassArm} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminTextField
              label="Class Arm Name"
              value={classForm.name}
              onChange={(e) =>
                setClassForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="e.g. SSS 2A"
              required
            />
            <AdminTextField
              label="Level"
              value={classForm.level}
              onChange={(e) =>
                setClassForm((p) => ({ ...p, level: e.target.value }))
              }
              placeholder="SSS 2"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminTextField
              label="Arm / Wing"
              value={classForm.arm}
              onChange={(e) =>
                setClassForm((p) => ({ ...p, arm: e.target.value }))
              }
            />
            <AdminTextField
              label="Seat Capacity"
              type="number"
              min={5}
              value={String(classForm.capacity)}
              onChange={(e) =>
                setClassForm((p) => ({
                  ...p,
                  capacity: Number(e.target.value) || 30,
                }))
              }
            />
          </div>
          <AdminSelectField
            label="Assign Class Teacher"
            value={classForm.classTeacherId}
            onChange={(val) =>
              setClassForm((p) => ({ ...p, classTeacherId: val }))
            }
            options={store.teachers.map((t) => ({
              id: t.id,
              label: t.name,
            }))}
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setClassModalOpen(false)}
              className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-surface-primary rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              Save Class Arm
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Contextual Term Modal */}
      <AdminModal
        open={termModalOpen}
        onOpenChange={setTermModalOpen}
        eyebrow="Academic Calendar"
        title="Add Session / Term"
        size="sm"
      >
        <form onSubmit={handleSaveTerm} className="space-y-4">
          <AdminTextField
            label="Academic Session"
            value={termForm.session}
            onChange={(e) =>
              setTermForm((p) => ({ ...p, session: e.target.value }))
            }
            placeholder="2026/2027"
            required
          />
          <AdminSelectField<AcademicSessionTerm["term"]>
            label="Term"
            value={termForm.term}
            onChange={(val) => setTermForm((p) => ({ ...p, term: val }))}
            options={[
              { id: "First Term", label: "First Term" },
              { id: "Second Term", label: "Second Term" },
              { id: "Third Term", label: "Third Term" },
            ]}
          />
          <div className="grid gap-3 grid-cols-2">
            <AdminTextField
              label="Starts"
              value={termForm.startsAt}
              onChange={(e) =>
                setTermForm((p) => ({ ...p, startsAt: e.target.value }))
              }
            />
            <AdminTextField
              label="Ends"
              value={termForm.endsAt}
              onChange={(e) =>
                setTermForm((p) => ({ ...p, endsAt: e.target.value }))
              }
            />
          </div>
          <label className="flex items-center gap-2 text-xs font-bold text-brand-900 cursor-pointer">
            <input
              type="checkbox"
              checked={termForm.isActive}
              onChange={(e) =>
                setTermForm((p) => ({ ...p, isActive: e.target.checked }))
              }
              className="h-4 w-4 accent-brand-700"
            />
            Set as active term immediately
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setTermModalOpen(false)}
              className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-surface-primary rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              Save Term
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Contextual Question Modal */}
      <AdminModal
        open={questionModalOpen}
        onOpenChange={setQuestionModalOpen}
        eyebrow="Admin Question Bank"
        title={questionForm.id ? "Edit Question Item" : "Add Bank Question"}
        size="lg"
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <AdminSelectField
              label="Subject"
              value={questionForm.subjectCode}
              onChange={(val) =>
                setQuestionForm((p) => ({ ...p, subjectCode: val }))
              }
              options={store.subjects.map((sub) => ({
                id: sub.code,
                label: sub.title,
              }))}
            />
            <AdminSelectField<QuestionType>
              label="Type"
              value={questionForm.type}
              onChange={(val) =>
                setQuestionForm((p) => ({ ...p, type: val }))
              }
              options={[
                { id: "objective", label: "Objective" },
                { id: "multi_select", label: "Multi-Select" },
                { id: "fill_blank", label: "Fill-in-Blank" },
                { id: "theory", label: "Theory" },
              ]}
            />
            <AdminTextField
              label="Marks"
              type="number"
              min={1}
              value={String(questionForm.marks)}
              onChange={(e) =>
                setQuestionForm((p) => ({
                  ...p,
                  marks: Number(e.target.value) || 2,
                }))
              }
            />
          </div>
          <AdminTextField
            label="Topic"
            value={questionForm.topic}
            onChange={(e) =>
              setQuestionForm((p) => ({ ...p, topic: e.target.value }))
            }
            required
          />
          <AdminTextareaField
            label="Question Prompt"
            value={questionForm.prompt}
            onChange={(e) =>
              setQuestionForm((p) => ({ ...p, prompt: e.target.value }))
            }
            rows={3}
            required
          />
          {(questionForm.type === "objective" ||
            questionForm.type === "multi_select") && (
            <div className="grid gap-3 sm:grid-cols-2">
              <AdminTextField
                label="Option A"
                value={questionForm.optionA}
                onChange={(e) =>
                  setQuestionForm((p) => ({ ...p, optionA: e.target.value }))
                }
              />
              <AdminTextField
                label="Option B"
                value={questionForm.optionB}
                onChange={(e) =>
                  setQuestionForm((p) => ({ ...p, optionB: e.target.value }))
                }
              />
              <AdminTextField
                label="Option C"
                value={questionForm.optionC}
                onChange={(e) =>
                  setQuestionForm((p) => ({ ...p, optionC: e.target.value }))
                }
              />
              <AdminTextField
                label="Option D"
                value={questionForm.optionD}
                onChange={(e) =>
                  setQuestionForm((p) => ({ ...p, optionD: e.target.value }))
                }
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setQuestionModalOpen(false)}
              className="rounded-xl border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-5 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Save Question
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminDialogModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        variant="danger"
        title="Confirm Removal"
        description={
          deleteTarget
            ? `Permanently delete "${deleteTarget.label}"?`
            : undefined
        }
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (!deleteTarget) return;
          if (deleteTarget.kind === "subject") deleteSubject(deleteTarget.id);
          else if (deleteTarget.kind === "class")
            deleteClassArm(deleteTarget.id);
          else if (deleteTarget.kind === "term")
            deleteAcademicTerm(deleteTarget.id);
          else deleteQuestion(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}

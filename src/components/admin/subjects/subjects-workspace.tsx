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
  Trash2,
} from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import { AdminSearchInput } from "@/components/admin/ui/admin-form-controls";
import {
  AdminTableCell,
  AdminTableHead,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import {
  AdminDialogModal,
  type ModalVariant,
} from "@/components/admin/ui/admin-dialog-modal";
import {
  QuestionBankForm,
  type QuestionBankFormState,
} from "@/components/forms";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import type {
  ClassArm,
  QuestionItem,
  SubjectEnrollment,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";
import { SubjectForm, type SubjectFormState } from "./subject-form";
import { ClassArmForm, type ClassArmFormState } from "./class-arm-form";
import {
  AcademicTermForm,
  type AcademicTermFormState,
} from "./academic-term-form";

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

  const subjectFormRef = React.useRef<HTMLDivElement | null>(null);
  const classFormRef = React.useRef<HTMLDivElement | null>(null);
  const termFormRef = React.useRef<HTMLDivElement | null>(null);
  const questionFormRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToForm = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  // Subject inline form
  const [subjectFormOpen, setSubjectFormOpen] = React.useState(false);
  const [subjectForm, setSubjectForm] = React.useState<SubjectFormState>({
    id: "",
    code: "",
    title: "",
    category: "Core",
    assignedClasses: [],
    assignedTeacherIds: [],
  });

  // Class arm inline form
  const [classFormOpen, setClassFormOpen] = React.useState(false);
  const [classForm, setClassForm] = React.useState<ClassArmFormState>({
    id: "",
    name: "",
    level: "JSS 3",
    arm: "Science Wing",
    classTeacherId: store.teachers[0]?.id ?? "",
    capacity: 40,
  });

  // Term inline form
  const [termFormOpen, setTermFormOpen] = React.useState(false);
  const [termForm, setTermForm] = React.useState<AcademicTermFormState>({
    id: "",
    session: "2026/2027",
    term: "First Term",
    startsAt: "Sep 08, 2026",
    endsAt: "Dec 18, 2026",
    isActive: false,
  });

  // Question inline form
  const [questionFormOpen, setQuestionFormOpen] = React.useState(false);
  const [questionForm, setQuestionForm] =
    React.useState<QuestionBankFormState>({
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
      explanation: "",
    });

  // Feedback & Delete confirmation modals
  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = React.useState<{
    kind: "subject" | "class" | "term" | "question";
    id: string;
    label: string;
  } | null>(null);

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
    setActiveTab("subjects");
    resetSubjectForm();
    setSubjectFormOpen(true);
    scrollToForm(subjectFormRef);
  };

  const openEditSubject = (sub: SubjectEnrollment) => {
    setActiveTab("subjects");
    setSubjectForm({
      id: sub.id,
      code: sub.code,
      title: sub.title,
      category: sub.category,
      assignedClasses: sub.assignedClasses,
      assignedTeacherIds: sub.assignedTeacherIds,
    });
    setSubjectFormOpen(true);
    scrollToForm(subjectFormRef);
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

    saveSubject({
      id: subjectForm.id || `sub_${Date.now()}`,
      code: subjectForm.code.trim().toUpperCase(),
      title,
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
    setSubjectFormOpen(false);
    resetSubjectForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Curriculum Updated",
      title: wasEditing ? "Subject Updated" : "Subject Created",
      description: `"${title}" has been saved with its class and teacher allocations.`,
    });
  };

  const resetClassArmForm = () => {
    setClassForm({
      id: "",
      name: "",
      level: "JSS 3",
      arm: "Science Wing",
      classTeacherId: store.teachers[0]?.id ?? "",
      capacity: 40,
    });
  };

  const openAddClassArm = () => {
    setActiveTab("classes");
    resetClassArmForm();
    setClassFormOpen(true);
    scrollToForm(classFormRef);
  };

  const openEditClassArm = (arm: ClassArm) => {
    setActiveTab("classes");
    setClassForm({
      id: arm.id,
      name: arm.name,
      level: arm.level,
      arm: arm.arm,
      classTeacherId: arm.classTeacherId,
      capacity: arm.capacity,
    });
    setClassFormOpen(true);
    scrollToForm(classFormRef);
  };

  const handleSaveClassArm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!classForm.name.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Class Arm Name Required",
        description: "Please enter a name for the class arm.",
      });
      return;
    }

    const wasEditing = Boolean(classForm.id);
    const armName = classForm.name.trim();
    saveClassArm({
      id: classForm.id || `arm_${Date.now()}`,
      name: armName,
      level: classForm.level.trim() || "JSS 3",
      arm: classForm.arm.trim() || "General",
      classTeacherId: classForm.classTeacherId,
      capacity: Number(classForm.capacity) || 40,
      status: "active",
    });
    setClassFormOpen(false);
    resetClassArmForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Class Directory Updated",
      title: wasEditing ? "Class Arm Updated" : "Class Arm Created",
      description: `"${armName}" is now configured in the school directory.`,
    });
  };

  const openAddTerm = () => {
    setActiveTab("terms");
    setTermForm({
      id: "",
      session: "2026/2027",
      term: "Third Term",
      startsAt: "Apr 19, 2027",
      endsAt: "Jul 23, 2027",
      isActive: false,
    });
    setTermFormOpen(true);
    scrollToForm(termFormRef);
  };

  const handleSaveTerm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termForm.session.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Session Required",
        description: "Please enter an academic session (e.g. 2026/2027).",
      });
      return;
    }
    saveAcademicTerm({
      id: termForm.id || `term_${Date.now()}`,
      session: termForm.session.trim(),
      term: termForm.term,
      startsAt: termForm.startsAt.trim(),
      endsAt: termForm.endsAt.trim(),
      isActive: termForm.isActive,
    });
    setTermFormOpen(false);
    setFeedbackModal({
      variant: "success",
      eyebrow: "Academic Calendar Updated",
      title: "Session / Term Saved",
      description: `${termForm.term} · ${termForm.session} has been added to the academic calendar.`,
    });
  };

  const resetQuestionForm = () => {
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
      explanation: "",
    });
  };

  const openAddQuestion = () => {
    setActiveTab("question_bank");
    resetQuestionForm();
    setQuestionFormOpen(true);
    scrollToForm(questionFormRef);
  };

  const openEditQuestion = (q: QuestionItem) => {
    setActiveTab("question_bank");
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
      explanation: q.explanation ?? "",
    });
    setQuestionFormOpen(true);
    scrollToForm(questionFormRef);
  };

  const handleSaveQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!questionForm.topic.trim() || !questionForm.prompt.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Incomplete Question Item",
        description: "Please provide both a topic and question prompt.",
      });
      return;
    }
    const subject = store.subjects.find(
      (s) => s.code === questionForm.subjectCode
    );
    const wasEditing = Boolean(questionForm.id);

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
        questionForm.type === "objective" ||
        questionForm.type === "multi_select"
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
      explanation: questionForm.explanation.trim() || undefined,
      createdBy: "School Administrator",
      updatedAt: "Today",
    });
    setQuestionFormOpen(false);
    resetQuestionForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Question Bank Updated",
      title: wasEditing ? "Question Updated" : "Question Added",
      description: `"${questionForm.topic.trim()}" has been saved to ${questionForm.subjectCode}.`,
    });
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
        <div className="space-y-4">
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

          <AdminSectionCard
            title="Subjects & Class / Teacher Allocations"
            description="Assign subjects to classes and teaching faculty using the inline form above."
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
                      <tr
                        key={sub.id}
                        className="hover:bg-surface-mist/50 transition-colors"
                      >
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
        </div>
      )}

      {activeTab === "classes" && (
        <div className="space-y-4">
          <ClassArmForm
            formRef={classFormRef}
            open={classFormOpen}
            onOpenChange={setClassFormOpen}
            formState={classForm}
            setFormState={setClassForm}
            teachers={store.teachers}
            onReset={resetClassArmForm}
            onSubmit={handleSaveClassArm}
          />

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
                      <tr
                        key={arm.id}
                        className="hover:bg-surface-mist/50 transition-colors"
                      >
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
        </div>
      )}

      {activeTab === "terms" && (
        <div className="space-y-4">
          <AcademicTermForm
            formRef={termFormRef}
            open={termFormOpen}
            onOpenChange={setTermFormOpen}
            formState={termForm}
            setFormState={setTermForm}
            onSubmit={handleSaveTerm}
          />

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
        </div>
      )}

      {activeTab === "question_bank" && (
        <div className="space-y-6">
          <QuestionBankForm
            formRef={questionFormRef}
            open={questionFormOpen}
            onOpenChange={setQuestionFormOpen}
            eyebrow="Admin Question Bank"
            formState={questionForm}
            setFormState={setQuestionForm}
            subjects={store.subjects}
            classArms={store.classArms}
            onReset={resetQuestionForm}
            onSubmit={handleSaveQuestion}
          />

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
                    <tr
                      key={item.id}
                      className="hover:bg-surface-mist/50 transition-colors"
                    >
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
        title="Confirm Removal"
        description={
          deleteTarget
            ? `Permanently delete "${deleteTarget.label}"?`
            : undefined
        }
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTarget) {
            if (deleteTarget.kind === "subject") deleteSubject(deleteTarget.id);
            else if (deleteTarget.kind === "class")
              deleteClassArm(deleteTarget.id);
            else if (deleteTarget.kind === "term")
              deleteAcademicTerm(deleteTarget.id);
            else deleteQuestion(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

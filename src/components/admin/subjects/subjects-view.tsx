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
import { PillBadge } from "@/components/landing/ui/pill-badge";
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
import {
  buildSubjectFromForm,
  SubjectForm,
  type SubjectFormState,
} from "./subject-form";
import {
  buildClassArmFromForm,
  ClassArmForm,
  type ClassArmFormState,
} from "./class-arm-form";
import {
  AcademicTermForm,
  buildAcademicTermFromForm,
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
    saveTermRecord,
    setActiveTermRecord,
    deleteTermRecord,
    toggleQuestionType,
    addOrUpdateQuestion,
    deleteQuestion,
  } = usePortalStore();

  const [activeTab, setActiveTab] = React.useState<AcademicsTab>("subjects");
  const [searchQuery, setSearchQuery] = React.useState("");

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
    title: "",
    description: "",
  });

  // Class arm modal form
  const [classFormOpen, setClassFormOpen] = React.useState(false);
  const [classForm, setClassForm] = React.useState<ClassArmFormState>({
    id: "",
    name: "",
    classification: "NURSERY",
  });

  // Term modal form
  const [termFormOpen, setTermFormOpen] = React.useState(false);
  const [termForm, setTermForm] = React.useState<AcademicTermFormState>({
    id: "",
    term: "",
    description: "",
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
      title: "",
      description: "",
    });
  };

  const openAddSubject = () => {
    setActiveTab("subjects");
    resetSubjectForm();
    setSubjectFormOpen(true);
  };

  const openEditSubject = (sub: SubjectEnrollment) => {
    setActiveTab("subjects");
    setSubjectForm({
      id: sub.id,
      title: sub.title,
      description: sub.description ?? "",
    });
    setSubjectFormOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subjectForm.title.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Missing Subject Title",
        description: "Please provide a subject title.",
      });
      return;
    }

    const wasEditing = Boolean(subjectForm.id);
    const saved = buildSubjectFromForm(
      subjectForm,
      store.subjects,
      store.questions
    );

    saveSubject(saved);
    setSubjectFormOpen(false);
    resetSubjectForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Curriculum Updated",
      title: wasEditing ? "Subject Updated" : "Subject Created",
      description: `"${saved.title}" (${saved.code}) has been saved to the school subject catalog.`,
    });
  };

  const resetClassArmForm = () => {
    setClassForm({
      id: "",
      name: "",
      classification: "NURSERY",
    });
  };

  const openAddClassArm = () => {
    setActiveTab("classes");
    resetClassArmForm();
    setClassFormOpen(true);
  };

  const openEditClassArm = (arm: ClassArm) => {
    setActiveTab("classes");
    setClassForm({
      id: arm.id,
      name: arm.name,
      classification: arm.classification ?? "SECONDARY",
    });
    setClassFormOpen(true);
  };

  const handleSaveClassArm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!classForm.name.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Arm Name Required",
        description: "Please enter a name for the class arm.",
      });
      return;
    }

    const wasEditing = Boolean(classForm.id);
    const saved = buildClassArmFromForm(classForm, store.classArms);
    saveClassArm(saved);
    setClassFormOpen(false);
    resetClassArmForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Class Directory Updated",
      title: wasEditing ? "Class Arm Updated" : "Class Arm Created",
      description: `"${saved.name}" (${saved.classification}) is now configured in the school directory.`,
    });
  };

  const resetTermForm = () => {
    setTermForm({
      id: "",
      term: "",
      description: "",
    });
  };

  const openAddTerm = () => {
    setActiveTab("terms");
    resetTermForm();
    setTermFormOpen(true);
  };

  const handleSaveTerm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termForm.term.trim()) {
      setFeedbackModal({
        variant: "danger",
        eyebrow: "Validation Error",
        title: "Term Required",
        description: "Please enter a term name (e.g. First Term).",
      });
      return;
    }
    const wasEditing = Boolean(termForm.id);
    const saved = buildAcademicTermFromForm(termForm, store.terms);
    saveTermRecord(saved);
    setTermFormOpen(false);
    resetTermForm();
    setFeedbackModal({
      variant: "success",
      eyebrow: "Academic Terms Updated",
      title: wasEditing ? "Term Updated" : "Term Saved",
      description: `"${saved.term}" has been saved to the academic terms directory.`,
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
            open={subjectFormOpen}
            onOpenChange={setSubjectFormOpen}
            formState={subjectForm}
            setFormState={setSubjectForm}
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
                            {sub.description || sub.category}
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
            open={classFormOpen}
            onOpenChange={setClassFormOpen}
            formState={classForm}
            setFormState={setClassForm}
            onReset={resetClassArmForm}
            onSubmit={handleSaveClassArm}
          />

          <AdminSectionCard
            title="Class Arms & Class Teachers"
            description="Define school arms (e.g. JSS 3A) and classifications."
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
                    <AdminTableHead>Arm Name</AdminTableHead>
                    <AdminTableHead>Classification</AdminTableHead>
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
                          <PillBadge
                            tone="sky"
                            icon="none"
                            className="px-2.5 py-0.5 text-[10px]"
                          >
                            {arm.classification}
                          </PillBadge>
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
                                label: "Edit Class Arm",
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
            open={termFormOpen}
            onOpenChange={setTermFormOpen}
            formState={termForm}
            setFormState={setTermForm}
            onReset={resetTermForm}
            onSubmit={handleSaveTerm}
          />

          <AdminSectionCard
            title="Academic Terms"
            description="Create school terms and set the active term across Student, Teacher, and Admin portals."
            action={
              <button
                type="button"
                onClick={openAddTerm}
                className="cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Term
              </button>
            }
          >
            <div className="grid gap-3 md:grid-cols-3">
              {store.terms.map((term) => (
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
                      <span className="font-display text-base font-extrabold text-brand-950">
                        {term.term}
                      </span>
                      {term.isActive && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                          <CheckCircle2 className="h-3 w-3" />
                          Active Term
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-ink-secondary">
                      {term.description || "No description"}
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
                        onClick={() => setActiveTermRecord(term.id)}
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
                            label: term.term,
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
              deleteTermRecord(deleteTarget.id);
            else deleteQuestion(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

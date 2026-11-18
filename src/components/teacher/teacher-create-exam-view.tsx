"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Copy,
  Database,
  Edit3,
  FilePlus2,
  Layers,
  Minus,
  Play,
  Plus,
  PlusCircle,
  RefreshCw,
  Save,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import {
  AdminSearchInput,
  AdminSelectField,
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { AdminSegmentedTabs } from "@/components/admin/ui/admin-segmented-tabs";
import {
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
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import { FormSection } from "@/components/forms";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import {
  getSchoolTypeForLevel,
  type ExamSection,
  type ExamType,
  type PortalExam,
  type QuestionItem,
  type QuestionRubricItem,
  type QuestionType,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

type ExamBuilderStep = "about" | "questions" | "time" | "settings" | "classlist";
type BuilderQuestionType = "theory" | "objective" | "fill_blank" | "essay";

interface DraftQuestion {
  id: string;
  questionType: BuilderQuestionType;
  marks: number;
  prompt: string;
  modelAnswer: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  allowMultipleCorrect: boolean;
  correctOptionId: string;
  correctOptionIds: string[];
  acceptedAnswersText: string;
  rubrics: QuestionRubricItem[];
  rubricsOpen: boolean;
  sectionId?: string;
}

const STEP_DEFINITIONS: ReadonlyArray<{
  id: ExamBuilderStep;
  label: string;
  shortLabel: string;
}> = [
  { id: "about", label: "About Exam", shortLabel: "About Exam" },
  { id: "questions", label: "Add Questions", shortLabel: "Add Questions" },
  { id: "time", label: "Time", shortLabel: "Time" },
  { id: "settings", label: "Exam Settings", shortLabel: "Exam Settings" },
  { id: "classlist", label: "ClassList", shortLabel: "ClassList" },
];

const EXAMINATION_TYPE_OPTIONS: ReadonlyArray<{ id: ExamType; label: string }> = [
  { id: "CA1", label: "CA1" },
  { id: "CA2", label: "CA2" },
  { id: "CA3", label: "CA3" },
  { id: "Exam", label: "Exam" },
];

const QUESTION_TYPE_OPTIONS: ReadonlyArray<{
  id: BuilderQuestionType;
  label: string;
}> = [
  { id: "theory", label: "Theory" },
  { id: "objective", label: "Multi-choice" },
  { id: "fill_blank", label: "Fill in the gaps" },
  { id: "essay", label: "Essay" },
];

const MATH_SYMBOLS = ["√", "±", "π", "÷", "×", "²", "³", "°", "≤", "≥", "≠", "____"];

function createEmptyDraftQuestion(sectionId?: string): DraftQuestion {
  return {
    id: `q_draft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    questionType: "theory",
    marks: 2,
    prompt: "",
    modelAnswer: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    allowMultipleCorrect: false,
    correctOptionId: "a",
    correctOptionIds: ["a"],
    acceptedAnswersText: "",
    rubrics: [],
    rubricsOpen: false,
    sectionId,
  };
}

function mapStoreQuestionToDraft(q: QuestionItem, sectionId?: string): DraftQuestion {
  const optMap = new Map((q.options ?? []).map((o) => [o.id, o.text || o.label]));
  let mappedType: BuilderQuestionType = "theory";
  if (q.type === "objective" || q.type === "mcq" || q.type === "multi_select" || q.type === "true_false") {
    mappedType = "objective";
  } else if (q.type === "fill_blank" || q.type === "short_answer") {
    mappedType = "fill_blank";
  } else if (q.type === "essay") {
    mappedType = "essay";
  }

  return {
    id: q.id,
    questionType: mappedType,
    marks: q.marks || 2,
    prompt: q.prompt,
    modelAnswer: q.markingGuide ?? "",
    optionA: optMap.get("a") ?? "",
    optionB: optMap.get("b") ?? "",
    optionC: optMap.get("c") ?? "",
    optionD: optMap.get("d") ?? "",
    allowMultipleCorrect: q.type === "multi_select",
    correctOptionId: q.correctOptionId ?? "a",
    correctOptionIds:
      q.correctOptionIds && q.correctOptionIds.length > 0
        ? q.correctOptionIds
        : [q.correctOptionId ?? "a"],
    acceptedAnswersText: (q.acceptedAnswers ?? []).join(", "),
    rubrics: q.rubrics ?? [],
    rubricsOpen: Boolean(q.rubrics && q.rubrics.length > 0),
    sectionId: sectionId ?? q.sectionId,
  };
}

function generateSixDigitPin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function TeacherCreateExamWorkspace() {
  const {
    store,
    activeSessionTerm,
    addOrUpdateQuestion,
    saveExam,
    updateExamStatus,
    deleteExam,
  } = usePortalStore();

  const teacherSchoolType = store.teacher.schoolType ?? "College";
  const teacherBranch = store.teacher.schoolBranch ?? "Guzape Branch";

  // ClassList automatically scoped to the logged-in teacher's schoolType & branch
  const scopedClassArms = React.useMemo(() => {
    const byType = store.classArms.filter(
      (arm) =>
        arm.status === "active" &&
        (arm.schoolType ?? getSchoolTypeForLevel(arm.level || arm.name)) ===
          teacherSchoolType
    );
    const branchExact = byType.filter(
      (arm) => !arm.schoolBranch || arm.schoolBranch === teacherBranch
    );
    const source = branchExact.length > 0 ? branchExact : byType;
    const seen = new Set<string>();
    return source.filter((arm) => {
      if (seen.has(arm.name)) return false;
      seen.add(arm.name);
      return true;
    });
  }, [store.classArms, teacherBranch, teacherSchoolType]);

  const [activeTab, setActiveTab] = React.useState<"builder" | "created">("builder");
  const [activeStep, setActiveStep] = React.useState<ExamBuilderStep>("about");
  const [editingExamId, setEditingExamId] = React.useState<string>("");

  // Step 1: About Exam
  const [examName, setExamName] = React.useState("");
  const [examType, setExamType] = React.useState<ExamType>("CA1");
  const [description, setDescription] = React.useState("");
  const [subjectCode, setSubjectCode] = React.useState(
    store.subjects[0]?.code ?? "MTH-301"
  );

  // Step 2: Add Questions & Sections
  const [questions, setQuestions] = React.useState<DraftQuestion[]>(() => [
    createEmptyDraftQuestion(),
  ]);
  const [sections, setSections] = React.useState<Array<{ id: string; title: string }>>([]);
  const [symbolMenuForId, setSymbolMenuForId] = React.useState<string | null>(null);
  const [bankPickerOpen, setBankPickerOpen] = React.useState(false);
  const [bankSearch, setBankSearch] = React.useState("");

  // Step 3: Time
  const [durationMinutes, setDurationMinutes] = React.useState(45);
  const [scheduledFor, setScheduledFor] = React.useState("Tomorrow · 09:00 AM");

  // Step 4: Exam Settings
  const [status, setStatus] = React.useState<PortalExam["status"]>("scheduled");
  const [passCode, setPassCode] = React.useState<string>(() => generateSixDigitPin());
  const [proctoringEnabled, setProctoringEnabled] = React.useState(true);
  const [shuffleQuestions, setShuffleQuestions] = React.useState(false);
  const [allowCalculator, setAllowCalculator] = React.useState(false);
  const [instantResult, setInstantResult] = React.useState(true);
  const [instructions, setInstructions] = React.useState(
    "Read each question carefully before submitting your final response."
  );

  // Step 5: ClassList
  const defaultClass =
    scopedClassArms.find((arm) => store.teacher.assignedClasses.includes(arm.name))
      ?.name ??
    scopedClassArms[0]?.name ??
    "";
  const [selectedClassOverride, setSelectedClassOverride] = React.useState<string | null>(
    null
  );
  const [selectedClassesOverride, setSelectedClassesOverride] = React.useState<
    string[] | null
  >(null);

  const selectedClass =
    selectedClassOverride &&
    scopedClassArms.some((arm) => arm.name === selectedClassOverride)
      ? selectedClassOverride
      : defaultClass;

  const selectedClasses = React.useMemo(() => {
    if (selectedClassesOverride) {
      const valid = selectedClassesOverride.filter((name) =>
        scopedClassArms.some((arm) => arm.name === name)
      );
      if (valid.length > 0) return valid;
    }
    return defaultClass ? [defaultClass] : [];
  }, [defaultClass, scopedClassArms, selectedClassesOverride]);

  const setSelectedClass = (val: string) => setSelectedClassOverride(val);
  const setSelectedClasses = (
    updater: string[] | ((prev: string[]) => string[])
  ) => {
    setSelectedClassesOverride((prev) => {
      const current = prev ?? (defaultClass ? [defaultClass] : []);
      return typeof updater === "function" ? updater(current) : updater;
    });
  };

  // Created Exams tab state & dialogs
  const [examSearch, setExamSearch] = React.useState("");
  const [examStatusFilter, setExamStatusFilter] = React.useState("ALL");
  const [deleteExamTarget, setDeleteExamTarget] = React.useState<PortalExam | null>(
    null
  );
  const [feedbackDialog, setFeedbackDialog] = React.useState<{
    variant: "success" | "warning" | "danger";
    title: string;
    description: string;
  } | null>(null);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  const activeStepIndex = STEP_DEFINITIONS.findIndex((s) => s.id === activeStep);
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  const resetBuilder = () => {
    setEditingExamId("");
    setActiveStep("about");
    setExamName("");
    setExamType("CA1");
    setDescription("");
    setSubjectCode(store.subjects[0]?.code ?? "MTH-301");
    setQuestions([createEmptyDraftQuestion()]);
    setSections([]);
    setDurationMinutes(45);
    setScheduledFor("Tomorrow · 09:00 AM");
    setStatus("scheduled");
    setPassCode(generateSixDigitPin());
    setProctoringEnabled(true);
    setShuffleQuestions(false);
    setAllowCalculator(false);
    setInstantResult(true);
    setInstructions(
      "Read each question carefully before submitting your final response."
    );
    setSelectedClassOverride(null);
    setSelectedClassesOverride(null);
  };

  const loadExamIntoBuilder = (exam: PortalExam) => {
    setEditingExamId(exam.id);
    setExamName(exam.title);
    setExamType(exam.examType ?? "Exam");
    setDescription(exam.description ?? "");
    setSubjectCode(exam.subjectCode);
    setDurationMinutes(exam.durationMinutes);
    setScheduledFor(exam.scheduledFor);
    setStatus(exam.status);
    setPassCode(exam.passCode || exam.accessPin || generateSixDigitPin());
    setProctoringEnabled(exam.proctoringEnabled ?? true);
    setShuffleQuestions(exam.shuffleQuestions ?? false);
    setAllowCalculator(exam.allowCalculator ?? false);
    setInstantResult(exam.instantResult ?? true);
    setInstructions(
      Array.isArray(exam.instructions)
        ? exam.instructions.join("\n")
        : exam.instructions || ""
    );

    const linkedQuestions = exam.questionIds
      .map((id) => store.questions.find((q) => q.id === id))
      .filter((q): q is QuestionItem => Boolean(q))
      .map((q) => mapStoreQuestionToDraft(q));
    setQuestions(
      linkedQuestions.length > 0 ? linkedQuestions : [createEmptyDraftQuestion()]
    );
    setSections(
      (exam.sections ?? []).map((sec) => ({ id: sec.id, title: sec.title }))
    );

    const classes =
      exam.targetClassArms && exam.targetClassArms.length > 0
        ? exam.targetClassArms
        : [exam.classLevel];
    setSelectedClass(classes[0] ?? defaultClass);
    setSelectedClasses(classes.filter(Boolean));
    setActiveStep("about");
    setActiveTab("builder");
  };

  // Question card mutations
  const updateQuestion = (id: string, updater: (prev: DraftQuestion) => DraftQuestion) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? updater(q) : q)));
  };

  const handleAddQuestion = (sectionId?: string) => {
    setQuestions((prev) => [...prev, createEmptyDraftQuestion(sectionId)]);
  };

  const handleDuplicateQuestion = (index: number) => {
    setQuestions((prev) => {
      const source = prev[index];
      if (!source) return prev;
      const clone: DraftQuestion = {
        ...source,
        id: `q_draft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        rubrics: source.rubrics.map((r) => ({
          ...r,
          id: `rub_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
        })),
      };
      const next = [...prev];
      next.splice(index + 1, 0, clone);
      return next;
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => {
      if (prev.length <= 1) {
        return [createEmptyDraftQuestion()];
      }
      return prev.filter((q) => q.id !== id);
    });
  };

  const handleMoveQuestion = (index: number, direction: -1 | 1) => {
    setQuestions((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const handleAddSection = () => {
    const nextNumber = sections.length + 1;
    const newSection = {
      id: `sec_${Date.now()}_${nextNumber}`,
      title: `Section ${String.fromCharCode(64 + nextNumber)}`,
    };
    setSections((prev) => [...prev, newSection]);
    setQuestions((prev) => [...prev, createEmptyDraftQuestion(newSection.id)]);
  };

  const handleAutoSectionByType = () => {
    const labelByType: Record<BuilderQuestionType, string> = {
      theory: "Section: Theory Questions",
      objective: "Section: Multi-choice Questions",
      fill_blank: "Section: Fill in the gaps",
      essay: "Section: Essay Questions",
    };
    const presentTypes = Array.from(
      new Set(questions.map((q) => q.questionType))
    ) as BuilderQuestionType[];

    const newSections = presentTypes.map((typeKey) => ({
      id: `sec_auto_${typeKey}`,
      title: labelByType[typeKey],
    }));
    setSections(newSections);
    setQuestions((prev) =>
      [...prev]
        .sort((a, b) => a.questionType.localeCompare(b.questionType))
        .map((q) => ({
          ...q,
          sectionId: `sec_auto_${q.questionType}`,
        }))
    );
  };

  const handleImportQuestionFromBank = (q: QuestionItem) => {
    const imported = mapStoreQuestionToDraft(q);
    setQuestions((prev) => {
      const onlyBlankFirst =
        prev.length === 1 && !prev[0].prompt.trim() && !prev[0].modelAnswer.trim();
      return onlyBlankFirst ? [imported] : [...prev, imported];
    });
    setBankPickerOpen(false);
  };

  const handlePublishExam = () => {
    if (!examName.trim()) {
      setActiveStep("about");
      setFeedbackDialog({
        variant: "danger",
        title: "Examination Name Required",
        description: "Please enter the Examination Exam Name in About Exam.",
      });
      return;
    }

    const validQuestions = questions.filter((q) => q.prompt.trim().length > 0);
    if (validQuestions.length === 0) {
      setActiveStep("questions");
      setFeedbackDialog({
        variant: "danger",
        title: "Add At Least One Question",
        description:
          "Please enter question text for at least one question before saving the exam.",
      });
      return;
    }

    const primaryClass = selectedClasses[0] || selectedClass || defaultClass;
    if (!primaryClass) {
      setActiveStep("classlist");
      setFeedbackDialog({
        variant: "danger",
        title: "Select a Class from ClassList",
        description: "Please choose at least one target class in ClassList.",
      });
      return;
    }

    const subject = store.subjects.find((s) => s.code === subjectCode);
    const termName = activeSessionTerm?.term ?? "First Term";
    const savedQuestionIds: string[] = [];

    for (const q of validQuestions) {
      let resolvedType: QuestionType = "theory";
      if (q.questionType === "objective") {
        resolvedType = q.allowMultipleCorrect ? "multi_select" : "objective";
      } else if (q.questionType === "fill_blank") {
        resolvedType = "fill_blank";
      } else if (q.questionType === "essay") {
        resolvedType = "essay";
      }

      const persistedId = q.id.startsWith("q_draft_")
        ? `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
        : q.id;
      savedQuestionIds.push(persistedId);

      const acceptedAnswers = q.acceptedAnswersText
        .split(",")
        .map((ans) => ans.trim())
        .filter(Boolean);

      const item: QuestionItem = {
        id: persistedId,
        subjectCode,
        subjectTitle: subject?.title ?? subjectCode,
        topic: `${examType} · ${examName.trim()}`,
        classLevel: primaryClass,
        term: termName,
        type: resolvedType,
        difficulty: "Standard",
        marks: Math.max(1, Number(q.marks) || 1),
        prompt: q.prompt.trim(),
        options:
          q.questionType === "objective"
            ? [
                { id: "a", label: q.optionA.trim() || "Option A" },
                { id: "b", label: q.optionB.trim() || "Option B" },
                { id: "c", label: q.optionC.trim() || "Option C" },
                { id: "d", label: q.optionD.trim() || "Option D" },
              ]
            : undefined,
        correctOptionId:
          q.questionType === "objective" && !q.allowMultipleCorrect
            ? q.correctOptionId
            : undefined,
        correctOptionIds:
          q.questionType === "objective" && q.allowMultipleCorrect
            ? q.correctOptionIds
            : undefined,
        acceptedAnswers:
          q.questionType === "fill_blank" ? acceptedAnswers : undefined,
        markingGuide:
          q.questionType === "theory" || q.questionType === "essay"
            ? q.modelAnswer.trim() || undefined
            : undefined,
        rubrics:
          (q.questionType === "theory" || q.questionType === "essay") &&
          q.rubrics.length > 0
            ? q.rubrics
            : undefined,
        sectionId: q.sectionId,
        createdBy: store.teacher.name,
        updatedAt: "Just now",
      };
      addOrUpdateQuestion(item);
    }

    const builtSections: ExamSection[] = sections.map((sec) => ({
      id: sec.id,
      title: sec.title,
      questionIds: validQuestions
        .map((q, idx) => (q.sectionId === sec.id ? savedQuestionIds[idx] : null))
        .filter((id): id is string => Boolean(id)),
    }));

    const calculatedTotalMarks = validQuestions.reduce(
      (sum, q) => sum + (Number(q.marks) || 1),
      0
    );

    const examId = editingExamId || `exam_${Date.now()}`;
    const wasEditing = Boolean(editingExamId);

    saveExam({
      id: examId,
      title: examName.trim(),
      examType,
      description: description.trim() || undefined,
      subjectCode,
      subjectTitle: subject?.title ?? subjectCode,
      classLevel: primaryClass,
      targetClassArms: selectedClasses.length > 0 ? selectedClasses : [primaryClass],
      schoolType: teacherSchoolType,
      schoolBranch: teacherBranch,
      term: termName,
      teacherName: store.teacher.name,
      scheduledFor: scheduledFor.trim() || "Scheduled",
      durationMinutes: Math.max(5, Number(durationMinutes) || 30),
      totalMarks: calculatedTotalMarks,
      status,
      roomCode: `EXM-${subjectCode}`,
      passCode: passCode.trim() || generateSixDigitPin(),
      proctoringEnabled,
      shuffleQuestions,
      allowCalculator,
      instantResult,
      instructions: instructions
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      sections: builtSections.length > 0 ? builtSections : undefined,
      questionIds: savedQuestionIds,
    });

    setFeedbackDialog({
      variant: "success",
      title: wasEditing ? "Examination Updated" : "Examination Created",
      description: `"${examName.trim()}" (${examType}) for ${selectedClasses.join(", ")} has been saved with ${validQuestions.length} question(s) totaling ${calculatedTotalMarks} marks.`,
    });
    resetBuilder();
    setActiveTab("created");
  };

  const filteredCreatedExams = React.useMemo(() => {
    const q = examSearch.trim().toLowerCase();
    return store.exams.filter((exam) => {
      if (examStatusFilter !== "ALL" && exam.status !== examStatusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        exam.title.toLowerCase().includes(q) ||
        exam.subjectCode.toLowerCase().includes(q) ||
        exam.classLevel.toLowerCase().includes(q) ||
        (exam.examType ?? "").toLowerCase().includes(q)
      );
    });
  }, [examSearch, examStatusFilter, store.exams]);

  const filteredBankQuestions = React.useMemo(() => {
    const q = bankSearch.trim().toLowerCase();
    return store.questions.filter((item) => {
      if (!q) return true;
      return (
        item.prompt.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.subjectCode.toLowerCase().includes(q) ||
        item.classLevel.toLowerCase().includes(q)
      );
    });
  }, [bankSearch, store.questions]);

  const renderQuestionCard = (q: DraftQuestion, index: number) => {
    const promptRemaining = Math.max(0, 500 - q.prompt.length);
    const answerRemaining = Math.max(0, 1500 - q.modelAnswer.length);

    return (
      <div key={q.id} className="relative space-y-2">
        {/* Top-Right Reorder Controls matching reference */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PillBadge tone="sky" icon="dot" className="px-2.5 py-0.5 text-[10px]">
              Question {index + 1}
            </PillBadge>
            <span className="text-[11px] font-bold text-ink-secondary">
              {q.marks} mark{q.marks === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleMoveQuestion(index, -1)}
              disabled={index === 0}
              aria-label={`Move question ${index + 1} up`}
              className="grid h-8 w-8 place-items-center rounded-xl border-2 border-brand-100 bg-surface-porcelain text-brand-700 shadow-gloss-card transition-colors hover:border-brand-300 hover:bg-surface-mist disabled:opacity-40 cursor-pointer"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleMoveQuestion(index, 1)}
              disabled={index === questions.length - 1}
              aria-label={`Move question ${index + 1} down`}
              className="cta-surface-primary grid h-8 w-8 place-items-center rounded-xl transition-transform hover:scale-[1.03] disabled:opacity-40 cursor-pointer"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Question Card with Left Electric Blue Accent Border */}
        <div className="surface-gloss-card overflow-hidden rounded-2xl border-2 border-brand-100 border-l-4 border-l-brand-600 p-4 sm:p-6 space-y-4">
          {/* Card Header Controls */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-48">
                <AdminSelectField<BuilderQuestionType>
                  label="Question Type"
                  value={q.questionType}
                  onChange={(nextType) =>
                    updateQuestion(q.id, (prev) => ({
                      ...prev,
                      questionType: nextType,
                    }))
                  }
                  options={QUESTION_TYPE_OPTIONS}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <span className="block font-display text-xs sm:text-[13px] font-extrabold tracking-tight text-brand-950">
                  Maximum Score
                </span>
                <div className="inline-flex h-10 items-center overflow-hidden rounded-xl border-2 border-brand-100 bg-surface-porcelain shadow-gloss-card">
                  <button
                    type="button"
                    aria-label="Decrease score"
                    onClick={() =>
                      updateQuestion(q.id, (prev) => ({
                        ...prev,
                        marks: Math.max(1, prev.marks - 1),
                      }))
                    }
                    className="grid h-full w-9 place-items-center text-brand-700 hover:bg-surface-mist transition-colors cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-10 px-2 text-center font-display text-sm font-extrabold text-brand-950">
                    {q.marks}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase score"
                    onClick={() =>
                      updateQuestion(q.id, (prev) => ({
                        ...prev,
                        marks: Math.min(100, prev.marks + 1),
                      }))
                    }
                    className="grid h-full w-9 place-items-center text-brand-700 hover:bg-surface-mist transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Duplicate, Delete & Quick Symbol Toolbar */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  title="Insert symbol or blank"
                  onClick={() =>
                    setSymbolMenuForId((prev) => (prev === q.id ? null : q.id))
                  }
                  className="grid h-9 w-9 place-items-center rounded-xl border-2 border-brand-100 bg-surface-pearl font-display text-sm font-extrabold text-brand-700 hover:border-brand-300 hover:bg-surface-porcelain cursor-pointer"
                >
                  Σ
                </button>
                {symbolMenuForId === q.id && (
                  <div className="surface-gloss-card absolute right-0 top-11 z-20 flex w-48 flex-wrap gap-1 rounded-2xl border-2 border-brand-200 p-2 shadow-gloss-float">
                    {MATH_SYMBOLS.map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => {
                          updateQuestion(q.id, (prev) => ({
                            ...prev,
                            prompt: `${prev.prompt}${sym}`.slice(0, 500),
                          }));
                          setSymbolMenuForId(null);
                        }}
                        className="rounded-lg border border-brand-100 bg-surface-pearl px-2 py-1 font-mono text-xs font-bold text-brand-900 hover:bg-brand-100 cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                title="Duplicate question"
                onClick={() => handleDuplicateQuestion(index)}
                className="grid h-9 w-9 place-items-center rounded-xl border-2 border-brand-100 bg-surface-pearl text-brand-700 hover:border-brand-300 hover:bg-surface-porcelain cursor-pointer"
              >
                <Copy className="h-4 w-4" />
              </button>

              <button
                type="button"
                title="Delete question"
                onClick={() => handleDeleteQuestion(q.id)}
                className="grid h-9 w-9 place-items-center rounded-xl border-2 border-brand-100 bg-surface-pearl text-rose-600 hover:border-rose-300 hover:bg-rose-50 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Question Prompt Area */}
          <div className="space-y-1.5 border-b-2 border-brand-100/80 pb-3">
            <textarea
              rows={3}
              maxLength={500}
              value={q.prompt}
              onChange={(e) =>
                updateQuestion(q.id, (prev) => ({
                  ...prev,
                  prompt: e.target.value,
                }))
              }
              placeholder="Enter question text"
              className="w-full resize-y rounded-xl border-2 border-brand-100/80 bg-surface-pearl/40 p-3 font-sans text-sm font-semibold text-ink-primary placeholder:text-ink-muted focus:border-brand-500 focus:bg-surface-porcelain focus:outline-none focus:ring-4 focus:ring-accent-sky/30"
            />
            <div className="flex items-center justify-between text-[11px] font-semibold text-ink-muted">
              <span>
                {q.questionType === "fill_blank"
                  ? "Tip: Use ____ to indicate a blank space in your question."
                  : "Supports clear candidate prompts and math symbols."}
              </span>
              <span>{promptRemaining} characters left</span>
            </div>
          </div>

          {/* Dynamic Answer Configuration by Question Type */}
          {(q.questionType === "theory" || q.questionType === "essay") && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <textarea
                  rows={3}
                  maxLength={1500}
                  value={q.modelAnswer}
                  onChange={(e) =>
                    updateQuestion(q.id, (prev) => ({
                      ...prev,
                      modelAnswer: e.target.value,
                    }))
                  }
                  placeholder={
                    q.questionType === "essay"
                      ? "Essay model answer & grading expectations"
                      : "Theory answer"
                  }
                  className="w-full resize-y rounded-xl border-2 border-brand-100/80 bg-surface-pearl/40 p-3 font-sans text-sm font-semibold text-ink-primary placeholder:text-ink-muted focus:border-brand-500 focus:bg-surface-porcelain focus:outline-none focus:ring-4 focus:ring-accent-sky/30"
                />
                <div className="text-right text-[11px] font-semibold text-ink-muted">
                  {answerRemaining} characters left
                </div>
              </div>

              {/* Expandable Question Rubrics Accordion */}
              <div className="rounded-xl border-2 border-brand-100 bg-surface-pearl/70 overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    updateQuestion(q.id, (prev) => ({
                      ...prev,
                      rubricsOpen: !prev.rubricsOpen,
                    }))
                  }
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left font-display text-xs sm:text-sm font-extrabold text-brand-950 hover:bg-surface-mist/70 transition-colors cursor-pointer"
                >
                  <span>
                    Question Rubrics{" "}
                    {q.rubrics.length > 0 && (
                      <span className="ml-1.5 font-sans text-[11px] font-bold text-brand-600">
                        ({q.rubrics.length} criteria)
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-brand-600 transition-transform duration-200",
                      q.rubricsOpen && "rotate-180"
                    )}
                  />
                </button>

                {q.rubricsOpen && (
                  <div className="space-y-2.5 border-t border-brand-100 bg-surface-porcelain p-3.5">
                    {q.rubrics.length === 0 ? (
                      <p className="text-xs font-medium text-ink-secondary">
                        Break down marks across key points or steps for consistent grading.
                      </p>
                    ) : (
                      q.rubrics.map((rubric, rIdx) => (
                        <div
                          key={rubric.id}
                          className="grid gap-2 sm:grid-cols-[1fr_110px_auto] items-end"
                        >
                          <AdminTextField
                            label={`Criterion ${rIdx + 1}`}
                            value={rubric.criterion}
                            onChange={(e) =>
                              updateQuestion(q.id, (prev) => ({
                                ...prev,
                                rubrics: prev.rubrics.map((r) =>
                                  r.id === rubric.id
                                    ? { ...r, criterion: e.target.value }
                                    : r
                                ),
                              }))
                            }
                            placeholder="e.g. Correct formula & substitution"
                          />
                          <AdminTextField
                            label="Points"
                            type="number"
                            min={1}
                            max={q.marks}
                            value={String(rubric.maxMarks)}
                            onChange={(e) =>
                              updateQuestion(q.id, (prev) => ({
                                ...prev,
                                rubrics: prev.rubrics.map((r) =>
                                  r.id === rubric.id
                                    ? {
                                        ...r,
                                        maxMarks: Math.max(1, Number(e.target.value) || 1),
                                      }
                                    : r
                                ),
                              }))
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateQuestion(q.id, (prev) => ({
                                ...prev,
                                rubrics: prev.rubrics.filter((r) => r.id !== rubric.id),
                              }))
                            }
                            aria-label="Remove rubric criterion"
                            className="grid h-10 w-10 place-items-center rounded-xl border-2 border-brand-100 bg-surface-pearl text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}

                    <CtaButton
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={() =>
                        updateQuestion(q.id, (prev) => ({
                          ...prev,
                          rubrics: [
                            ...prev.rubrics,
                            {
                              id: `rub_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
                              criterion: "",
                              maxMarks: 1,
                            },
                          ],
                        }))
                      }
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Rubric Criterion</span>
                    </CtaButton>
                  </div>
                )}
              </div>
            </div>
          )}

          {q.questionType === "objective" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-xs font-extrabold uppercase tracking-wider text-brand-700">
                  Options A – D
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuestion(q.id, (prev) => ({
                      ...prev,
                      allowMultipleCorrect: !prev.allowMultipleCorrect,
                    }))
                  }
                  className={cn(
                    "rounded-pill border-2 px-3 py-1 font-display text-[11px] font-extrabold transition-colors cursor-pointer",
                    q.allowMultipleCorrect
                      ? "border-brand-600 bg-brand-600 text-ink-on-blue"
                      : "border-brand-200 bg-surface-pearl text-brand-800 hover:bg-surface-mist"
                  )}
                >
                  {q.allowMultipleCorrect
                    ? "Multiple Correct Answers Enabled"
                    : "Single Correct Answer"}
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { id: "a", label: "Option A", value: q.optionA, key: "optionA" },
                    { id: "b", label: "Option B", value: q.optionB, key: "optionB" },
                    { id: "c", label: "Option C", value: q.optionC, key: "optionC" },
                    { id: "d", label: "Option D", value: q.optionD, key: "optionD" },
                  ] as const
                ).map((opt) => (
                  <AdminTextField
                    key={opt.id}
                    label={opt.label}
                    value={opt.value}
                    onChange={(e) =>
                      updateQuestion(q.id, (prev) => ({
                        ...prev,
                        [opt.key]: e.target.value,
                      }))
                    }
                    placeholder={`Enter ${opt.label.toLowerCase()}...`}
                  />
                ))}
              </div>

              <div className="space-y-1.5">
                <span className="block font-display text-xs font-extrabold text-brand-950">
                  {q.allowMultipleCorrect
                    ? "Correct Options (select all that apply)"
                    : "Correct Option"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {["a", "b", "c", "d"].map((optId) => {
                    const isActive = q.allowMultipleCorrect
                      ? q.correctOptionIds.includes(optId)
                      : q.correctOptionId === optId;
                    return (
                      <button
                        key={optId}
                        type="button"
                        onClick={() =>
                          updateQuestion(q.id, (prev) => {
                            if (!prev.allowMultipleCorrect) {
                              return { ...prev, correctOptionId: optId };
                            }
                            const exists = prev.correctOptionIds.includes(optId);
                            const next = exists
                              ? prev.correctOptionIds.filter((x) => x !== optId)
                              : [...prev.correctOptionIds, optId];
                            return {
                              ...prev,
                              correctOptionIds: next.length > 0 ? next : [optId],
                            };
                          })
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-pill border-2 px-3.5 py-1.5 font-display text-xs font-extrabold transition-all cursor-pointer",
                          isActive
                            ? "cta-surface-primary text-ink-on-blue"
                            : "border-brand-200 bg-surface-porcelain text-brand-800 hover:bg-surface-mist"
                        )}
                      >
                        {isActive && <Check className="h-3 w-3" />}
                        <span>Option {optId.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {q.questionType === "fill_blank" && (
            <div className="space-y-2">
              <AdminTextField
                label="Accepted Answers (comma separated)"
                value={q.acceptedAnswersText}
                onChange={(e) =>
                  updateQuestion(q.id, (prev) => ({
                    ...prev,
                    acceptedAnswersText: e.target.value,
                  }))
                }
                placeholder="e.g. photosynthesis, light synthesis"
                hint="Candidate typed answers are matched case-insensitively against any accepted value."
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/teacher"
          className="inline-flex items-center gap-1.5 rounded-pill border-2 border-brand-100 bg-surface-porcelain px-3.5 py-1.5 font-display text-xs font-extrabold text-brand-800 shadow-gloss-card transition-colors hover:border-brand-300 hover:bg-surface-mist"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Teacher Dashboard</span>
        </Link>

        <AdminSegmentedTabs
          ariaLabel="Create Exam workspace views"
          layoutId="teacher-create-exam-tabs"
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { id: "builder", label: editingExamId ? "Edit Exam" : "Create Exam" },
            { id: "created", label: "Created Exams", count: store.exams.length },
          ]}
        />
      </div>

      <AdminHeroBanner
        eyebrow={`${teacherSchoolType} · ${teacherBranch} · ${termLabel}`}
        eyebrowIcon="dot"
        headline={editingExamId ? "Update Examination." : "Create New Exam."}
        highlightWords={["Examination.", "Exam."]}
        subtitle="Configure exam details, author multi-format questions with rubrics, set timing, and allocate to your scoped ClassList."
        metrics={[
          { label: "Questions", value: `${questions.length}` },
          { label: "Total Marks", value: `${totalMarks}` },
          { label: "Duration", value: `${durationMinutes} mins` },
        ]}
        secondaryCta={{
          label: "Live Monitor",
          href: "/teacher/live-monitor",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        {activeTab === "builder" ? (
          <div className="space-y-5">
            {/* 5-Step Progress Tab Bar (Reference Image 1) */}
            <div className="surface-gloss-card rounded-2xl border-2 border-brand-100 px-3 py-2 sm:px-5 sm:py-3">
              <div
                role="tablist"
                aria-label="Exam builder steps"
                className="grid grid-cols-2 gap-2 sm:grid-cols-5"
              >
                {STEP_DEFINITIONS.map((step, idx) => {
                  const isActive = step.id === activeStep;
                  const isCompleted = idx < activeStepIndex;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveStep(step.id)}
                      className="group flex flex-col items-center gap-1.5 pt-1 text-center cursor-pointer focus:outline-none"
                    >
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 font-display text-xs sm:text-[13px] font-extrabold transition-colors",
                          isActive
                            ? "text-brand-700"
                            : isCompleted
                              ? "text-accent-success"
                              : "text-ink-muted group-hover:text-brand-700"
                        )}
                      >
                        {isCompleted && <Check className="h-3.5 w-3.5" />}
                        <span>{step.label}</span>
                      </span>
                      <span
                        className={cn(
                          "h-1 w-full rounded-pill transition-all",
                          isActive
                            ? "bg-brand-600"
                            : isCompleted
                              ? "bg-accent-success"
                              : "bg-brand-100 group-hover:bg-brand-200"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 1: ABOUT EXAM */}
            {activeStep === "about" && (
              <div className="space-y-5">
                <FormSection
                  title="About Exam"
                  subtitle="Define the examination identity, type, subject, and overview"
                  icon={<FilePlus2 className="h-3.5 w-3.5" />}
                >
                  <div className="space-y-4">
                    <AdminTextField
                      label="Examination Exam Name *"
                      value={examName}
                      onChange={(e) => setExamName(e.target.value)}
                      placeholder="e.g. First Term Continuous Assessment I"
                      required
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <AdminSelectField<ExamType>
                        label="Examination Type *"
                        value={examType}
                        onChange={setExamType}
                        options={EXAMINATION_TYPE_OPTIONS}
                      />

                      <AdminSelectField
                        label="Subject *"
                        value={subjectCode}
                        onChange={setSubjectCode}
                        options={store.subjects.map((sub) => ({
                          id: sub.code,
                          label: sub.title,
                        }))}
                      />
                    </div>

                    <AdminTextareaField
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Describe the topics covered, format, and assessment goals..."
                    />
                  </div>
                </FormSection>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  {editingExamId ? (
                    <CtaButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={resetBuilder}
                    >
                      <span>Start Fresh Draft</span>
                    </CtaButton>
                  ) : (
                    <span />
                  )}

                  <CtaButton
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveStep("questions")}
                  >
                    <span>Next: Add Questions</span>
                  </CtaButton>
                </div>
              </div>
            )}

            {/* STEP 2: ADD QUESTIONS (Reference Images 1, 2 & 3) */}
            {activeStep === "questions" && (
              <div className="relative flex flex-col gap-5 xl:pr-16">
                {/* Sections & Questions Stack */}
                {sections.length === 0 ? (
                  <div className="space-y-5">
                    {questions.map((q, idx) => renderQuestionCard(q, idx))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.some((q) => !q.sectionId) && (
                      <div className="space-y-4">
                        {questions
                          .map((q, idx) => ({ q, idx }))
                          .filter(({ q }) => !q.sectionId)
                          .map(({ q, idx }) => renderQuestionCard(q, idx))}
                      </div>
                    )}

                    {sections.map((sec) => {
                      const secQuestions = questions
                        .map((q, idx) => ({ q, idx }))
                        .filter(({ q }) => q.sectionId === sec.id);
                      return (
                        <div
                          key={sec.id}
                          className="space-y-4 rounded-2xl border-2 border-brand-200 bg-surface-mist/50 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <input
                              type="text"
                              value={sec.title}
                              onChange={(e) =>
                                setSections((prev) =>
                                  prev.map((item) =>
                                    item.id === sec.id
                                      ? { ...item, title: e.target.value }
                                      : item
                                  )
                                )
                              }
                              className="rounded-xl border-2 border-brand-100 bg-surface-porcelain px-3 py-1.5 font-display text-sm font-extrabold text-brand-950 focus:border-brand-500 focus:outline-none"
                            />
                            <div className="flex items-center gap-2">
                              <CtaButton
                                type="button"
                                variant="secondary"
                                size="xs"
                                onClick={() => handleAddQuestion(sec.id)}
                              >
                                <Plus className="h-3 w-3" />
                                <span>Add to Section</span>
                              </CtaButton>
                              <button
                                type="button"
                                onClick={() => {
                                  setSections((prev) =>
                                    prev.filter((item) => item.id !== sec.id)
                                  );
                                  setQuestions((prev) =>
                                    prev.map((q) =>
                                      q.sectionId === sec.id
                                        ? { ...q, sectionId: undefined }
                                        : q
                                    )
                                  );
                                }}
                                aria-label="Remove section grouping"
                                className="grid h-8 w-8 place-items-center rounded-xl border-2 border-brand-100 bg-surface-porcelain text-rose-600 hover:bg-rose-50 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {secQuestions.length === 0 ? (
                            <p className="text-xs font-medium text-ink-secondary">
                              No questions in this section yet. Click &ldquo;Add to Section&rdquo; above.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {secQuestions.map(({ q, idx }) =>
                                renderQuestionCard(q, idx)
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Floating Side Quick-Action Rail (Desktop) */}
                <aside
                  aria-label="Question builder tools"
                  className="hidden xl:flex xl:flex-col xl:gap-2 xl:fixed xl:right-8 xl:top-1/2 xl:-translate-y-1/2 xl:z-30 surface-gloss-card rounded-2xl border-2 border-brand-100 p-2 shadow-gloss-float"
                >
                  <button
                    type="button"
                    title="Add Question"
                    onClick={() => handleAddQuestion()}
                    className="grid h-9 w-9 place-items-center rounded-xl text-brand-700 hover:bg-surface-mist cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Import from Question Bank"
                    onClick={() => setBankPickerOpen(true)}
                    className="grid h-9 w-9 place-items-center rounded-xl text-brand-700 hover:bg-surface-mist cursor-pointer"
                  >
                    <Database className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Add Section"
                    onClick={handleAddSection}
                    className="grid h-9 w-9 place-items-center rounded-xl text-brand-700 hover:bg-surface-mist cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Auto-section by type"
                    onClick={handleAutoSectionByType}
                    className="grid h-9 w-9 place-items-center rounded-xl text-brand-700 hover:bg-surface-mist cursor-pointer"
                  >
                    <Layers className="h-4 w-4" />
                  </button>
                </aside>

                {/* Bottom Action Buttons Row (Reference Image 3) */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <CtaButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAddQuestion()}
                    className="w-full justify-center"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Question</span>
                  </CtaButton>

                  <CtaButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddSection}
                    className="w-full justify-center"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Section</span>
                  </CtaButton>

                  <CtaButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAutoSectionByType}
                    className="w-full justify-center"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Auto-section by type</span>
                  </CtaButton>
                </div>

                {/* Quick Import from Question Bank shortcut on smaller viewports */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-surface-frost pt-4">
                  <div className="flex items-center gap-2">
                    <CtaButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveStep("about")}
                    >
                      <span>Previous</span>
                    </CtaButton>

                    <CtaButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setBankPickerOpen(true)}
                    >
                      <Database className="h-3.5 w-3.5" />
                      <span>Import from Bank</span>
                    </CtaButton>
                  </div>

                  <CtaButton
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveStep("time")}
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Questions</span>
                  </CtaButton>
                </div>
              </div>
            )}

            {/* STEP 3: TIME */}
            {activeStep === "time" && (
              <div className="space-y-5">
                <FormSection
                  title="Assessment Timing"
                  subtitle="Configure exam duration and scheduled window"
                  icon={<CalendarClock className="h-3.5 w-3.5" />}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AdminTextField
                      label="Duration (Minutes) *"
                      type="number"
                      min={5}
                      max={240}
                      value={String(durationMinutes)}
                      onChange={(e) =>
                        setDurationMinutes(Math.max(5, Number(e.target.value) || 30))
                      }
                      hint="Total time allocated per candidate once the CBT session starts."
                    />

                    <AdminTextField
                      label="Schedule Label *"
                      value={scheduledFor}
                      onChange={(e) => setScheduledFor(e.target.value)}
                      placeholder="e.g. Fri, Nov 20 · 09:00 AM"
                      hint="Displayed to candidates on their Upcoming Exams schedule."
                    />
                  </div>
                </FormSection>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CtaButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveStep("questions")}
                  >
                    <span>Previous</span>
                  </CtaButton>

                  <CtaButton
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveStep("settings")}
                  >
                    <span>Next: Exam Settings</span>
                  </CtaButton>
                </div>
              </div>
            )}

            {/* STEP 4: EXAM SETTINGS */}
            {activeStep === "settings" && (
              <div className="space-y-5">
                <FormSection
                  title="Exam Settings & Candidate Rules"
                  subtitle="Control exam status, access PIN, proctoring, and candidate instructions"
                  icon={<Settings2 className="h-3.5 w-3.5" />}
                >
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <AdminSelectField<PortalExam["status"]>
                        label="Publication Status *"
                        value={status}
                        onChange={setStatus}
                        options={[
                          { id: "scheduled", label: "Scheduled" },
                          { id: "live", label: "Live Now" },
                          { id: "draft", label: "Draft" },
                        ]}
                      />

                      <AdminTextField
                        label="Candidate Access PIN"
                        value={passCode}
                        onChange={(e) => setPassCode(e.target.value)}
                        trailingIcon={
                          <button
                            type="button"
                            onClick={() => setPassCode(generateSixDigitPin())}
                            title="Generate new 6-digit PIN"
                            className="grid h-7 w-7 place-items-center rounded-lg bg-surface-mist text-brand-700 hover:bg-brand-100 cursor-pointer"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                        }
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        {
                          label: "Proctoring & Tab-Switch Guard",
                          detail: "Monitors focus loss during active CBT sessions",
                          value: proctoringEnabled,
                          toggle: () => setProctoringEnabled((v) => !v),
                        },
                        {
                          label: "Shuffle Question Order",
                          detail: "Randomizes item order per candidate workstation",
                          value: shuffleQuestions,
                          toggle: () => setShuffleQuestions((v) => !v),
                        },
                        {
                          label: "Allow On-Screen Calculator",
                          detail: "Enables scientific calculator inside Exam Hall",
                          value: allowCalculator,
                          toggle: () => setAllowCalculator((v) => !v),
                        },
                        {
                          label: "Instant Objective Feedback",
                          detail: "Shows auto-graded scores upon submission",
                          value: instantResult,
                          toggle: () => setInstantResult((v) => !v),
                        },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={item.toggle}
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-2xl border-2 p-3.5 text-left transition-all cursor-pointer",
                            item.value
                              ? "border-brand-400 bg-brand-50/70"
                              : "border-brand-100 bg-surface-porcelain hover:bg-surface-pearl"
                          )}
                        >
                          <div>
                            <p className="font-display text-xs font-extrabold text-brand-950">
                              {item.label}
                            </p>
                            <p className="text-[11px] font-medium text-ink-secondary">
                              {item.detail}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "inline-flex h-6 w-11 shrink-0 items-center rounded-pill p-0.5 transition-colors",
                              item.value ? "bg-brand-600 justify-end" : "bg-brand-200 justify-start"
                            )}
                          >
                            <span className="h-5 w-5 rounded-pill bg-surface-porcelain shadow-sm" />
                          </span>
                        </button>
                      ))}
                    </div>

                    <AdminTextareaField
                      label="Candidate Instructions"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      rows={3}
                      placeholder="One instruction per line..."
                    />
                  </div>
                </FormSection>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CtaButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveStep("time")}
                  >
                    <span>Previous</span>
                  </CtaButton>

                  <CtaButton
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveStep("classlist")}
                  >
                    <span>Next: ClassList</span>
                  </CtaButton>
                </div>
              </div>
            )}

            {/* STEP 5: CLASSLIST & PUBLISH */}
            {activeStep === "classlist" && (
              <div className="space-y-5">
                <FormSection
                  title="ClassList"
                  subtitle={`Select target classes for ${teacherSchoolType} · ${teacherBranch}`}
                  icon={<Users className="h-3.5 w-3.5" />}
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="min-w-[260px] flex-1">
                        <AdminSelectField
                          label="ClassList *"
                          value={selectedClass}
                          onChange={(val) => {
                            setSelectedClass(val);
                            setSelectedClasses((prev) =>
                              prev.includes(val) ? prev : [...prev, val]
                            );
                          }}
                          options={scopedClassArms.map((arm) => ({
                            id: arm.name,
                            label: arm.name,
                            description: `${arm.level} · ${arm.arm}`,
                          }))}
                          placeholder="Select a class from ClassList"
                        />
                      </div>
                    </div>

                    {selectedClasses.length > 0 && (
                      <div className="space-y-2">
                        <span className="block font-display text-xs font-extrabold text-brand-950">
                          Assigned ClassList ({selectedClasses.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {selectedClasses.map((clsName) => (
                            <span
                              key={clsName}
                              className="inline-flex items-center gap-1.5 rounded-pill border-2 border-brand-200 bg-surface-mist px-3 py-1 font-display text-xs font-extrabold text-brand-900"
                            >
                              <span>{clsName}</span>
                              {selectedClasses.length > 1 && (
                                <button
                                  type="button"
                                  aria-label={`Remove ${clsName}`}
                                  onClick={() =>
                                    setSelectedClasses((prev) =>
                                      prev.filter((item) => item !== clsName)
                                    )
                                  }
                                  className="ml-0.5 text-brand-600 hover:text-rose-600 cursor-pointer"
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </FormSection>

                {/* Pre-Publish Review Card */}
                <FormSection
                  title="Examination Summary"
                  subtitle="Review configuration before publishing to candidates"
                  icon={<ShieldCheck className="h-3.5 w-3.5" />}
                >
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-brand-100 bg-surface-pearl p-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                        Examination Name
                      </span>
                      <span className="font-display text-xs font-extrabold text-brand-950">
                        {examName.trim() || "Untitled Examination"}
                      </span>
                    </div>
                    <div className="rounded-xl border border-brand-100 bg-surface-pearl p-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                        Examination Type
                      </span>
                      <span className="font-display text-xs font-extrabold text-brand-700">
                        {examType} ·{" "}
                        {store.subjects.find((s) => s.code === subjectCode)
                          ?.title ?? subjectCode}
                      </span>
                    </div>
                    <div className="rounded-xl border border-brand-100 bg-surface-pearl p-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                        Questions &amp; Marks
                      </span>
                      <span className="font-display text-xs font-extrabold text-brand-950">
                        {questions.filter((q) => q.prompt.trim()).length} items ·{" "}
                        {totalMarks} marks
                      </span>
                    </div>
                    <div className="rounded-xl border border-brand-100 bg-surface-pearl p-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                        Timing &amp; Status
                      </span>
                      <span className="font-display text-xs font-extrabold text-brand-950 capitalize">
                        {durationMinutes} mins · {status}
                      </span>
                    </div>
                  </div>

                  {description.trim() && (
                    <p className="mt-3 rounded-xl border border-brand-100 bg-surface-pearl p-3 text-xs font-medium text-ink-secondary">
                      {description.trim()}
                    </p>
                  )}
                </FormSection>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CtaButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveStep("settings")}
                  >
                    <span>Previous</span>
                  </CtaButton>

                  <CtaButton
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handlePublishExam}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>
                      {editingExamId ? "Save Exam Changes" : "Publish & Save Exam"}
                    </span>
                  </CtaButton>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* CREATED EXAMS TAB */
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <AdminSearchInput
                  value={examSearch}
                  onChange={setExamSearch}
                  placeholder="Search exam name, type, subject, or class..."
                />
                <AdminSelectField
                  variant="filter"
                  aria-label="Filter by exam status"
                  value={examStatusFilter}
                  onChange={setExamStatusFilter}
                  options={[
                    { id: "ALL", label: "All Statuses" },
                    { id: "live", label: "Live" },
                    { id: "scheduled", label: "Scheduled" },
                    { id: "draft", label: "Draft" },
                    { id: "completed", label: "Completed" },
                  ]}
                />
              </div>

              <CtaButton
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  resetBuilder();
                  setActiveTab("builder");
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create New Exam</span>
              </CtaButton>
            </div>

            <AdminDataTable
              title="Created Examinations"
              subtitle="Edit, launch live, or manage exams authored for your classes."
              badge={`${filteredCreatedExams.length} exams`}
            >
              {filteredCreatedExams.length === 0 ? (
                <AdminEmptyState
                  title="No Examinations Found"
                  description="Create your first exam in the builder or clear your filters."
                  icon={<ClipboardCheck className="h-5 w-5 text-accent-sky" />}
                />
              ) : (
                <AdminTable>
                  <AdminTableHeader>
                    <tr>
                      <AdminTableHead>Examination</AdminTableHead>
                      <AdminTableHead>Type</AdminTableHead>
                      <AdminTableHead>Subject</AdminTableHead>
                      <AdminTableHead>ClassList</AdminTableHead>
                      <AdminTableHead>PIN</AdminTableHead>
                      <AdminTableHead>Status</AdminTableHead>
                      <AdminTableHead className="text-right">Actions</AdminTableHead>
                    </tr>
                  </AdminTableHeader>
                  <AdminTableBody>
                    {filteredCreatedExams.map((exam) => (
                      <AdminTableRow key={exam.id}>
                        <AdminTableCell>
                          <p className="font-display font-extrabold text-brand-950">
                            {exam.title}
                          </p>
                          <p className="text-[11px] font-medium text-ink-secondary">
                            {exam.scheduledFor} · {exam.questionIds.length} items ·{" "}
                            {exam.totalMarks} marks
                          </p>
                        </AdminTableCell>
                        <AdminTableCell>
                          <PillBadge
                            tone="blue"
                            icon="none"
                            className="px-2.5 py-0.5 text-[10px]"
                          >
                            {exam.examType ?? "Exam"}
                          </PillBadge>
                        </AdminTableCell>
                        <AdminTableCell className="font-semibold text-brand-800">
                          {exam.subjectTitle || exam.subjectCode}
                        </AdminTableCell>
                        <AdminTableCell className="font-bold text-brand-900">
                          {(exam.targetClassArms && exam.targetClassArms.length > 0
                            ? exam.targetClassArms
                            : [exam.classLevel]
                          ).join(", ")}
                        </AdminTableCell>
                        <AdminTableCell className="font-mono font-extrabold text-brand-950">
                          {exam.passCode || "—"}
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminStatusPill
                            status={exam.status}
                            variant={
                              exam.status === "live"
                                ? "success"
                                : exam.status === "scheduled"
                                  ? "warning"
                                  : "neutral"
                            }
                          />
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                          <AdminActionMenu
                            ariaLabel={`Actions for ${exam.title}`}
                            items={[
                              {
                                id: "edit",
                                label: "Edit in Builder",
                                icon: <Edit3 className="h-3.5 w-3.5" />,
                                onClick: () => loadExamIntoBuilder(exam),
                              },
                              {
                                id: "toggle-live",
                                label:
                                  exam.status === "live"
                                    ? "Mark Completed"
                                    : "Launch Live Session",
                                icon: <Play className="h-3.5 w-3.5" />,
                                variant: "primary",
                                onClick: () =>
                                  updateExamStatus(
                                    exam.id,
                                    exam.status === "live" ? "completed" : "live"
                                  ),
                              },
                              {
                                id: "delete",
                                label: "Delete Exam",
                                icon: <Trash2 className="h-3.5 w-3.5" />,
                                variant: "danger",
                                dividerBefore: true,
                                onClick: () => setDeleteExamTarget(exam),
                              },
                            ]}
                          />
                        </AdminTableCell>
                      </AdminTableRow>
                    ))}
                  </AdminTableBody>
                </AdminTable>
              )}
            </AdminDataTable>
          </div>
        )}
      </AdminWorkspaceSlab>

      {/* Import from Question Bank Modal */}
      <AdminModal
        open={bankPickerOpen}
        onOpenChange={setBankPickerOpen}
        eyebrow="Question Bank"
        title="Import Existing Question"
        description="Select a saved question from your question bank to add it directly into this exam."
        size="lg"
      >
        <div className="space-y-4">
          <AdminSearchInput
            value={bankSearch}
            onChange={setBankSearch}
            placeholder="Search topic, prompt, subject, or class..."
            className="max-w-full"
          />

          <div className="max-h-80 space-y-2.5 overflow-y-auto pr-1">
            {filteredBankQuestions.length === 0 ? (
              <p className="py-6 text-center text-xs font-semibold text-ink-secondary">
                No matching questions found in the question bank.
              </p>
            ) : (
              filteredBankQuestions.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-brand-100 bg-surface-pearl p-3.5"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <PillBadge tone="sky" icon="none" className="px-2 py-0.5 text-[10px]">
                        {item.subjectTitle || item.subjectCode}
                      </PillBadge>
                      <PillBadge tone="porcelain" icon="none" className="px-2 py-0.5 text-[10px]">
                        {item.type}
                      </PillBadge>
                      <span className="text-[11px] font-bold text-ink-secondary">
                        {item.marks} marks · {item.classLevel}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-brand-950 line-clamp-2">
                      {item.prompt}
                    </p>
                  </div>

                  <CtaButton
                    type="button"
                    variant="primary"
                    size="xs"
                    onClick={() => handleImportQuestionFromBank(item)}
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>Add</span>
                  </CtaButton>
                </div>
              ))
            )}
          </div>
        </div>
      </AdminModal>

      <AdminDialogModal
        open={Boolean(deleteExamTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteExamTarget(null);
        }}
        variant="danger"
        title="Delete Examination?"
        description={
          deleteExamTarget
            ? `Permanently remove "${deleteExamTarget.title}" from the examination registry?`
            : undefined
        }
        confirmLabel="Delete Exam"
        onConfirm={() => {
          if (deleteExamTarget) {
            deleteExam(deleteExamTarget.id);
            setDeleteExamTarget(null);
          }
        }}
      />

      <AdminDialogModal
        open={Boolean(feedbackDialog)}
        onOpenChange={(open) => {
          if (!open) setFeedbackDialog(null);
        }}
        variant={
          feedbackDialog?.variant === "danger"
            ? "warning"
            : feedbackDialog?.variant === "warning"
              ? "warning"
              : "success"
        }
        eyebrow={feedbackDialog?.variant === "danger" ? "Validation" : "Saved"}
        title={feedbackDialog?.title ?? ""}
        description={feedbackDialog?.description}
        cancelLabel="Done"
      />
    </div>
  );
}

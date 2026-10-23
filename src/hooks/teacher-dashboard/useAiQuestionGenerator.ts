import * as React from "react"
import type { ITeacherQuestion, TeacherQuestionType } from "@/types/teacher"

export interface UploadedMaterialFile {
  id: string
  name: string
  size: number
  formattedSize: string
  type: string
  status: "uploaded" | "processing" | "ready"
}

export type AiGeneratorStep = "upload" | "configure" | "generating" | "review"

export interface UseAiQuestionGeneratorOptions {
  currentSubject?: string
  maxFiles?: number
  maxFileSizeBytes?: number
  onImportQuestions?: (questions: ITeacherQuestion[]) => void
  onClose?: () => void
}

const MAX_FILES_DEFAULT = 15
const MAX_FILE_SIZE_BYTES_DEFAULT = 5 * 1024 * 1024 // 5MB

// Curated question templates per subject for realistic AI generation
const SUBJECT_QUESTION_TEMPLATES: Record<string, ITeacherQuestion[]> = {
  default: [
    {
      id: "ai-gen-1",
      questionNumber: 1,
      type: "mcq",
      prompt: "Which of the following best defines the primary concept discussed in the uploaded curriculum materials?",
      difficulty: "Basic",
      points: 2,
      options: [
        { id: "A", text: "Empirical observation supported by experimental verification" },
        { id: "B", text: "Hypothetical reasoning without repeatable testing" },
        { id: "C", text: "Subjective interpretation of secondary sources" },
        { id: "D", text: "Randomized sampling with unverified controls" },
      ],
      correctOptionId: "A",
      explanation: "Scientific and academic literature prioritizes empirical observation supported by rigorous experimental verification.",
    },
    {
      id: "ai-gen-2",
      questionNumber: 2,
      type: "mcq",
      prompt: "What is the critical consequence when the governing principles described in the study document are violated?",
      difficulty: "Intermediate",
      points: 2,
      options: [
        { id: "A", text: "System instability and non-deterministic outcomes" },
        { id: "B", text: "Immediate equilibrium and stabilization" },
        { id: "C", text: "Exponential decrease in system entropy" },
        { id: "D", text: "Negligible impact on baseline parameters" },
      ],
      correctOptionId: "A",
      explanation: "As detailed in foundational models, deviations from core equilibrium rules introduce volatility and unpredictable outputs.",
    },
    {
      id: "ai-gen-3",
      questionNumber: 3,
      type: "theory",
      prompt: "Explain the fundamental mechanism detailed in Section 2 of the teaching material and discuss two real-world applications.",
      difficulty: "Intermediate",
      points: 5,
      theoryAnswer: "The mechanism relies on sequential feedback loops that regulate internal states. In practical applications, this is observed in industrial process automation and biological homeostasis.",
      rubrics: [
        { id: "r-1", criterion: "Accurate identification of the core mechanism", weight: 0.4 },
        { id: "r-2", criterion: "Explanation of two distinct real-world applications", weight: 0.4 },
        { id: "r-3", criterion: "Clarity, coherence, and technical terminology", weight: 0.2 },
      ],
    },
    {
      id: "ai-gen-4",
      questionNumber: 4,
      type: "mcq",
      prompt: "Based on the quantitative examples provided, what is the expected standard deviation when variance equals 16?",
      difficulty: "Basic",
      points: 2,
      options: [
        { id: "A", text: "4" },
        { id: "B", text: "8" },
        { id: "C", text: "32" },
        { id: "D", text: "256" },
      ],
      correctOptionId: "A",
      explanation: "Standard deviation is the square root of variance: √16 = 4.",
    },
    {
      id: "ai-gen-5",
      questionNumber: 5,
      type: "theory",
      prompt: "Critically evaluate the comparative advantages and limitations of the primary methodology presented in the notes.",
      difficulty: "Advanced",
      points: 5,
      theoryAnswer: "Advantages include reproducible accuracy and low marginal implementation cost. Limitations encompass higher setup overhead and sensitivity to boundary conditions.",
      rubrics: [
        { id: "r-1", criterion: "Identification of advantages with supporting points", weight: 0.4 },
        { id: "r-2", criterion: "Analysis of limitations and operational boundaries", weight: 0.4 },
        { id: "r-3", criterion: "Critical synthesis and concluding recommendation", weight: 0.2 },
      ],
    },
  ],
  "English Language": [
    {
      id: "ai-eng-1",
      questionNumber: 1,
      type: "mcq",
      prompt: "Identify the grammatical function of the underlined clause in the lecture excerpt: 'Whoever finishes the essay first will receive bonus credit.'",
      difficulty: "Intermediate",
      points: 2,
      options: [
        { id: "A", text: "Nominal clause functioning as the subject of the main clause" },
        { id: "B", text: "Adverbial clause of condition modifying 'receive'" },
        { id: "C", text: "Relative clause qualifying the missing noun" },
        { id: "D", text: "Prepositional complement phrase" },
      ],
      correctOptionId: "A",
      explanation: "'Whoever finishes the essay first' is a nominal relative clause acting as the complete grammatical subject for the predicate 'will receive bonus credit'.",
    },
    {
      id: "ai-eng-2",
      questionNumber: 2,
      type: "mcq",
      prompt: "Choose the word nearest in meaning to the italicized word: 'The principal issued a PEREMPTORY directive requiring immediate attendance.'",
      difficulty: "Advanced",
      points: 2,
      options: [
        { id: "A", text: "Authoritative and indisputable" },
        { id: "B", text: "Tentative and flexible" },
        { id: "C", text: "Informative and advisory" },
        { id: "D", text: "Ambiguous and casual" },
      ],
      correctOptionId: "A",
      explanation: "'Peremptory' denotes an imperative, decisive command that admits no refusal or hesitation.",
    },
    {
      id: "ai-eng-3",
      questionNumber: 3,
      type: "theory",
      prompt: "Differentiate between grammatical concord and notional concord with two illustrative sentences for each.",
      difficulty: "Intermediate",
      points: 5,
      theoryAnswer: "Grammatical concord strictly follows morphological agreement (e.g., 'The committee has submitted its report'). Notional concord adheres to the perceived meaning of collective entities (e.g., 'The committee were divided on the disciplinary sanction').",
      rubrics: [
        { id: "r-1", criterion: "Clear conceptual distinction between grammatical and notional concord", weight: 0.4 },
        { id: "r-2", criterion: "Correct formulation of 2 grammatical concord examples", weight: 0.3 },
        { id: "r-3", criterion: "Correct formulation of 2 notional concord examples", weight: 0.3 },
      ],
    },
    {
      id: "ai-eng-4",
      questionNumber: 4,
      type: "mcq",
      prompt: "Which punctuation mark is most suitable to separate independent clauses that are closely connected in thought without a coordinating conjunction?",
      difficulty: "Basic",
      points: 2,
      options: [
        { id: "A", text: "Semicolon (;)" },
        { id: "B", text: "Comma (,)" },
        { id: "C", text: "Hyphen (-)" },
        { id: "D", text: "Ellipsis (...)" },
      ],
      correctOptionId: "A",
      explanation: "A semicolon connects two closely related independent clauses without needing a conjunction like 'and' or 'but'.",
    },
    {
      id: "ai-eng-5",
      questionNumber: 5,
      type: "theory",
      prompt: "Write an outline for an argumentative essay on the topic: 'Artificial Intelligence in Classrooms: Catalyst for Academic Growth or Threat to Critical Reasoning?' Include a thesis statement and 3 topical arguments.",
      difficulty: "Advanced",
      points: 5,
      theoryAnswer: "Thesis: While AI provides unprecedented personalized tutoring, safeguards are essential to preserve human critical thinking. Point 1: Tailored pacing. Point 2: Algorithmic bias and dependency. Point 3: Hybrid pedagogical equilibrium.",
      rubrics: [
        { id: "r-1", criterion: "Strong, well-articulated thesis statement", weight: 0.3 },
        { id: "r-2", criterion: "Three distinct, well-reasoned argumentative pillars", weight: 0.4 },
        { id: "r-3", criterion: "Synthesized counter-argument and structural coherence", weight: 0.3 },
      ],
    },
  ],
  Biology: [
    {
      id: "ai-bio-1",
      questionNumber: 1,
      type: "mcq",
      prompt: "During the light-dependent reactions of photosynthesis, which molecule acts as the initial electron donor in non-cyclic photophosphorylation?",
      difficulty: "Intermediate",
      points: 2,
      options: [
        { id: "A", text: "Water (H2O)" },
        { id: "B", text: "Carbon dioxide (CO2)" },
        { id: "C", text: "NADPH" },
        { id: "D", text: "Glucose" },
      ],
      correctOptionId: "A",
      explanation: "Photolysis of water inside the thylakoid lumen splits H2O into protons, electrons, and oxygen, replenishing reaction center P680.",
    },
    {
      id: "ai-bio-2",
      questionNumber: 2,
      type: "mcq",
      prompt: "Which organelle is responsible for post-translational modification and sorting of secretory proteins in eukaryotic cells?",
      difficulty: "Basic",
      points: 2,
      options: [
        { id: "A", text: "Golgi apparatus" },
        { id: "B", text: "Rough endoplasmic reticulum" },
        { id: "C", text: "Lysosome" },
        { id: "D", text: "Peroxisome" },
      ],
      correctOptionId: "A",
      explanation: "The Golgi apparatus modifies, sorts, and packages glycoproteins and lipids into vesicles for targeted cellular transport.",
    },
    {
      id: "ai-bio-3",
      questionNumber: 3,
      type: "theory",
      prompt: "Outline the four primary stages of cellular respiration and state the net ATP yield produced per molecule of glucose oxidized under aerobic conditions.",
      difficulty: "Intermediate",
      points: 5,
      theoryAnswer: "1. Glycolysis (cytoplasm) produces 2 net ATP. 2. Link reaction (mitochondrial matrix) converts pyruvate to acetyl-CoA. 3. Krebs Cycle (citric acid cycle) produces 2 ATP. 4. Oxidative Phosphorylation (electron transport chain) yields ~26-28 ATP. Net theoretical yield is approximately 30-32 ATP.",
      rubrics: [
        { id: "r-1", criterion: "Accurate naming and localization of all 4 stages", weight: 0.4 },
        { id: "r-2", criterion: "Correct energetic accounting and ATP yields per stage", weight: 0.4 },
        { id: "r-3", criterion: "Clarity of biochemical pathway terminology", weight: 0.2 },
      ],
    },
    {
      id: "ai-bio-4",
      questionNumber: 4,
      type: "mcq",
      prompt: "In Mendelian genetics, a cross between two heterozygous tall pea plants (Tt x Tt) produces what expected phenotypic ratio in the F1 generation?",
      difficulty: "Basic",
      points: 2,
      options: [
        { id: "A", text: "3 Tall : 1 Dwarf" },
        { id: "B", text: "1 Tall : 2 Intermediate : 1 Dwarf" },
        { id: "C", text: "1 Tall : 1 Dwarf" },
        { id: "D", text: "4 Tall : 0 Dwarf" },
      ],
      correctOptionId: "A",
      explanation: "The genotypic ratio is 1 TT : 2 Tt : 1 tt, yielding a phenotypic manifestation of 3 Tall : 1 Dwarf.",
    },
    {
      id: "ai-bio-5",
      questionNumber: 5,
      type: "theory",
      prompt: "Explain how negative feedback loops maintain blood glucose homeostasis following a carbohydrate-rich meal versus during prolonged fasting.",
      difficulty: "Advanced",
      points: 5,
      theoryAnswer: "Post-prandial hyperglycemia stimulates pancreatic beta-cells to secrete insulin, promoting cellular glucose uptake and glycogenesis in the liver. Hypoglycemia triggers alpha-cells to secrete glucagon, stimulating glycogenolysis and gluconeogenesis.",
      rubrics: [
        { id: "r-1", criterion: "Insulin pathway mechanism and cellular uptake explained", weight: 0.4 },
        { id: "r-2", criterion: "Glucagon pathway and counter-regulatory mechanisms detailed", weight: 0.4 },
        { id: "r-3", criterion: "Integration of organ roles (pancreas, liver, muscle tissue)", weight: 0.2 },
      ],
    },
  ],
  Mathematics: [
    {
      id: "ai-math-1",
      questionNumber: 1,
      type: "mcq",
      prompt: "Solve for x in the quadratic equation: 2x² - 5x - 3 = 0.",
      difficulty: "Intermediate",
      points: 2,
      options: [
        { id: "A", text: "x = 3 or x = -1/2" },
        { id: "B", text: "x = -3 or x = 1/2" },
        { id: "C", text: "x = 5 or x = -3" },
        { id: "D", text: "x = 1 or x = -6" },
      ],
      correctOptionId: "A",
      explanation: "Factoring: (2x + 1)(x - 3) = 0 => 2x = -1 (x = -1/2) or x = 3.",
    },
    {
      id: "ai-math-2",
      questionNumber: 2,
      type: "mcq",
      prompt: "What is the derivative of f(x) = 4x³ - 6x² + 7x - 9 with respect to x?",
      difficulty: "Basic",
      points: 2,
      options: [
        { id: "A", text: "12x² - 12x + 7" },
        { id: "B", text: "12x² - 6x + 7" },
        { id: "C", text: "4x² - 12x + 7" },
        { id: "D", text: "12x³ - 12x² + 7" },
      ],
      correctOptionId: "A",
      explanation: "Applying the power rule d/dx(x^n) = n*x^(n-1): 4(3)x² - 6(2)x + 7 = 12x² - 12x + 7.",
    },
    {
      id: "ai-math-3",
      questionNumber: 3,
      type: "theory",
      prompt: "Prove using mathematical induction that the sum of the first n positive integers equals n(n + 1) / 2 for all natural numbers n >= 1.",
      difficulty: "Advanced",
      points: 5,
      theoryAnswer: "Base Case: For n=1, LHS = 1, RHS = 1(2)/2 = 1 (True). Inductive Hypothesis: Assume true for n=k: sum = k(k+1)/2. Inductive Step: For n=k+1, sum = k(k+1)/2 + (k+1) = (k+1)(k/2 + 1) = (k+1)(k+2)/2. Hence true by PMI.",
      rubrics: [
        { id: "r-1", criterion: "Correct verification of the base case n=1", weight: 0.2 },
        { id: "r-2", criterion: "Explicit statement of inductive hypothesis for n=k", weight: 0.3 },
        { id: "r-3", criterion: "Rigorous algebraic proof of step n=k+1 and conclusion", weight: 0.5 },
      ],
    },
    {
      id: "ai-math-4",
      questionNumber: 4,
      type: "mcq",
      prompt: "If log₁₀(x) + log₁₀(25) = 2, calculate the numerical value of x.",
      difficulty: "Intermediate",
      points: 2,
      options: [
        { id: "A", text: "4" },
        { id: "B", text: "2" },
        { id: "C", text: "50" },
        { id: "D", text: "1/4" },
      ],
      correctOptionId: "A",
      explanation: "log₁₀(25x) = 2 => 25x = 10² = 100 => x = 100/25 = 4.",
    },
    {
      id: "ai-math-5",
      questionNumber: 5,
      type: "theory",
      prompt: "A cylindrical storage tank has a radius of 7 meters and a height of 10 meters. Calculate its total surface area and total liquid capacity in liters. (Take π = 22/7).",
      difficulty: "Intermediate",
      points: 5,
      theoryAnswer: "Total surface area = 2πr(r + h) = 2 * (22/7) * 7 * (7 + 10) = 44 * 17 = 748 m². Volume = πr²h = (22/7) * 49 * 10 = 1540 m³. Since 1 m³ = 1000 L, capacity = 1,540,000 Liters.",
      rubrics: [
        { id: "r-1", criterion: "Correct surface area formula and substitution (748 m²)", weight: 0.4 },
        { id: "r-2", criterion: "Correct cylinder volume computation (1540 m³)", weight: 0.3 },
        { id: "r-3", criterion: "Correct metric conversion to liters (1,540,000 L)", weight: 0.3 },
      ],
    },
  ],
}

// Sample files that users can instantly attach for testing
export const PRESET_SAMPLE_MATERIALS = [
  {
    name: "Biology_Ch4_Photosynthesis_Notes.pdf",
    size: 2.4 * 1024 * 1024,
    formattedSize: "2.4 MB",
    type: "application/pdf",
    subject: "Biology",
  },
  {
    name: "English_Senior_Grammar_Concord.docx",
    size: 1.1 * 1024 * 1024,
    formattedSize: "1.1 MB",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    subject: "English Language",
  },
  {
    name: "Mathematics_Algebra_Calculus_Summary.pptx",
    size: 3.2 * 1024 * 1024,
    formattedSize: "3.2 MB",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    subject: "Mathematics",
  },
]

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function useAiQuestionGenerator({
  currentSubject = "English Language",
  maxFiles = MAX_FILES_DEFAULT,
  maxFileSizeBytes = MAX_FILE_SIZE_BYTES_DEFAULT,
  onImportQuestions,
  onClose,
}: UseAiQuestionGeneratorOptions = {}) {
  // Step progression: "upload" -> "configure" -> "generating" -> "review"
  const [step, setStep] = React.useState<AiGeneratorStep>("upload")

  // File Upload State
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedMaterialFile[]>([])
  const [uploadError, setUploadError] = React.useState<string | null>(null)

  // Question Configuration State
  const [subject, setSubject] = React.useState<string>(currentSubject)
  const [topicFocus, setTopicFocus] = React.useState<string>("")
  const [questionCount, setQuestionCount] = React.useState<number>(5)
  const [selectedTypes, setSelectedTypes] = React.useState<TeacherQuestionType[]>(["mcq", "theory"])
  const [difficulty, setDifficulty] = React.useState<"Basic" | "Intermediate" | "Advanced" | "Mixed">("Mixed")
  const [pointsPerQuestion, setPointsPerQuestion] = React.useState<number>(2)

  // Generation Simulation State
  const [generationProgress, setGenerationProgress] = React.useState<number>(0)
  const [generationStageText, setGenerationStageText] = React.useState<string>("")
  const [generationStageIndex, setGenerationStageIndex] = React.useState<number>(0)

  // Review State
  const [generatedQuestions, setGeneratedQuestions] = React.useState<ITeacherQuestion[]>([])
  const [selectedQuestionIds, setSelectedQuestionIds] = React.useState<Set<string>>(new Set())

  // Sync subject when external currentSubject changes
  const [prevCurrentSubject, setPrevCurrentSubject] = React.useState(currentSubject)
  if (currentSubject !== prevCurrentSubject) {
    setPrevCurrentSubject(currentSubject)
    setSubject(currentSubject)
  }

  // Clear errors when files change
  React.useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => setUploadError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [uploadError])

  // File Handling
  const addFiles = React.useCallback(
    (files: File[] | FileList) => {
      setUploadError(null)
      const fileList = Array.from(files)

      if (uploadedFiles.length + fileList.length > maxFiles) {
        setUploadError(`You can upload up to ${maxFiles} files maximum. Please remove some files to proceed.`)
        return
      }

      const validNewFiles: UploadedMaterialFile[] = []

      for (const file of fileList) {
        // Validation: Size
        if (file.size > maxFileSizeBytes) {
          setUploadError(`"${file.name}" exceeds the 5MB file size limit. Please choose a smaller file.`)
          continue
        }

        // Validation: Extension
        const validExtensions = [".pdf", ".pptx", ".docx", ".doc", ".txt"]
        const lowerName = file.name.toLowerCase()
        const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext))

        if (!hasValidExt) {
          setUploadError(`"${file.name}" is not a supported format. Please upload PDF, PPTX, or DOCX files.`)
          continue
        }

        // Avoid exact duplicate names
        if (uploadedFiles.some((f) => f.name === file.name)) {
          continue
        }

        validNewFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          formattedSize: formatFileSize(file.size),
          type: file.type || "application/octet-stream",
          status: "ready",
        })
      }

      if (validNewFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...validNewFiles])
      }
    },
    [uploadedFiles, maxFiles, maxFileSizeBytes]
  )

  const removeFile = React.useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
    setUploadError(null)
  }, [])

  const clearFiles = React.useCallback(() => {
    setUploadedFiles([])
    setUploadError(null)
  }, [])

  // Add preset sample file for quick test
  const addSampleFile = React.useCallback((presetIndex: number = 0) => {
    const sample = PRESET_SAMPLE_MATERIALS[presetIndex % PRESET_SAMPLE_MATERIALS.length]
    if (uploadedFiles.some((f) => f.name === sample.name)) return

    setUploadedFiles((prev) => [
      ...prev,
      {
        id: `sample-${Date.now()}`,
        name: sample.name,
        size: sample.size,
        formattedSize: sample.formattedSize,
        type: sample.type,
        status: "ready",
      },
    ])
    if (sample.subject) {
      setSubject(sample.subject)
    }
    setUploadError(null)
  }, [uploadedFiles])

  // Question Type Toggle
  const toggleQuestionType = React.useCallback((type: TeacherQuestionType) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev // Keep at least one type
        return prev.filter((t) => t !== type)
      }
      return [...prev, type]
    })
  }, [])

  // Start AI Generation simulation
  const startGeneration = React.useCallback(() => {
    setStep("generating")
    setGenerationProgress(0)
    setGenerationStageIndex(0)

    const stages = [
      "Parsing uploaded lecture notes and document structure...",
      "Extracting key curricular definitions and formulas...",
      "Synthesizing high-yield questions with Bloom's taxonomy alignment...",
      "Generating distractors, model answers, and rubric criteria...",
      "Finalizing formatted questions and quality checks...",
    ]

    setGenerationStageText(stages[0])

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        const next = prev + 15
        const stageIdx = Math.min(Math.floor((next / 100) * stages.length), stages.length - 1)
        setGenerationStageIndex(stageIdx)
        setGenerationStageText(stages[stageIdx])

        if (next >= 100) {
          clearInterval(interval)
          // Synthesize questions based on subject & configurations
          const bank =
            SUBJECT_QUESTION_TEMPLATES[subject] ||
            SUBJECT_QUESTION_TEMPLATES.default

          // Filter by selected types if possible
          let pool = bank.filter((q) => selectedTypes.includes(q.type || "mcq"))
          if (pool.length === 0) pool = bank

          // Duplicate or slice to requested question count
          const finalQuestions: ITeacherQuestion[] = []
          for (let i = 0; i < questionCount; i++) {
            const template = pool[i % pool.length]
            const id = `ai-gen-${Date.now()}-${i + 1}`
            finalQuestions.push({
              ...template,
              id,
              questionNumber: i + 1,
              points: pointsPerQuestion,
              difficulty: difficulty === "Mixed" ? template.difficulty : difficulty,
            })
          }

          setGeneratedQuestions(finalQuestions)
          setSelectedQuestionIds(new Set(finalQuestions.map((q) => q.id)))
          setStep("review")
          return 100
        }
        return next
      })
    }, 250)
  }, [subject, selectedTypes, questionCount, pointsPerQuestion, difficulty])

  // Review Selection Handlers
  const toggleQuestionSelection = React.useCallback((questionId: string) => {
    setSelectedQuestionIds((prev) => {
      const next = new Set(prev)
      if (next.has(questionId)) {
        next.delete(questionId)
      } else {
        next.add(questionId)
      }
      return next
    })
  }, [])

  const selectAllQuestions = React.useCallback(() => {
    setSelectedQuestionIds(new Set(generatedQuestions.map((q) => q.id)))
  }, [generatedQuestions])

  const deselectAllQuestions = React.useCallback(() => {
    setSelectedQuestionIds(new Set())
  }, [])

  // Final Action: Import selected questions into exam
  const handleImportSelected = React.useCallback(() => {
    const selected = generatedQuestions.filter((q) => selectedQuestionIds.has(q.id))
    if (selected.length > 0 && onImportQuestions) {
      onImportQuestions(selected)
    }
    if (onClose) {
      onClose()
    }
  }, [generatedQuestions, selectedQuestionIds, onImportQuestions, onClose])

  // Reset to initial state
  const resetAll = React.useCallback(() => {
    setStep("upload")
    setUploadedFiles([])
    setUploadError(null)
    setGeneratedQuestions([])
    setSelectedQuestionIds(new Set())
    setGenerationProgress(0)
  }, [])

  return {
    // Current Step
    step,
    setStep,

    // Uploaded Materials
    uploadedFiles,
    uploadCount: uploadedFiles.length,
    maxFiles,
    uploadError,
    addFiles,
    removeFile,
    clearFiles,
    addSampleFile,

    // Configurations
    subject,
    setSubject,
    topicFocus,
    setTopicFocus,
    questionCount,
    setQuestionCount,
    selectedTypes,
    toggleQuestionType,
    difficulty,
    setDifficulty,
    pointsPerQuestion,
    setPointsPerQuestion,

    // Generation State
    generationProgress,
    generationStageText,
    generationStageIndex,
    startGeneration,

    // Review & Import
    generatedQuestions,
    selectedQuestionIds,
    selectedCount: selectedQuestionIds.size,
    isAllSelected:
      generatedQuestions.length > 0 &&
      selectedQuestionIds.size === generatedQuestions.length,
    toggleQuestionSelection,
    selectAllQuestions,
    deselectAllQuestions,
    handleImportSelected,

    // Flow Helpers
    resetAll,
  }
}

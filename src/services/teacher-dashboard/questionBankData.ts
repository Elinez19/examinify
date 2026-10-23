import type { ITeacherQuestion } from "@/types/teacher"

export interface IQuestionBankItem extends ITeacherQuestion {
  course: string
  examTitle: string
  publishedAt: string // ISO date string e.g. "2026-02-10"
}

export const MOCK_QUESTION_BANK: IQuestionBankItem[] = [
  // 1. English Language - Literature & Grammar
  {
    id: "qb-eng-001",
    questionNumber: 1,
    course: "English Language",
    examTitle: "1st Term Terminal Examination",
    publishedAt: "2026-01-15",
    type: "theory",
    prompt:
      "Discuss the central theme of tradition versus modernity in West African literature, highlighting the cultural conflicts portrayed by the protagonist.",
    points: 5,
    difficulty: "Intermediate",
    theoryAnswer:
      "The theme explores the tension between customary indigenous values and Western statutory or religious institutions. Characters frequently navigate deep identity crises when trying to harmonize modern expectations with ancestral expectations.",
    rubrics: [
      { id: "qb-r-1", criterion: "Identification of key themes and characters", weight: 0.4 },
      { id: "qb-r-2", criterion: "Depth of cultural analysis and contextual examples", weight: 0.4 },
      { id: "qb-r-3", criterion: "Coherence, spelling, and grammatical presentation", weight: 0.2 },
    ],
  },
  {
    id: "qb-eng-002",
    questionNumber: 2,
    course: "English Language",
    examTitle: "2nd Term Continuous Assessment (CA 1)",
    publishedAt: "2026-02-05",
    type: "mcq",
    prompt:
      "Identify the figure of speech used in the following line: 'The morning sun smiled warmly across the open school field.'",
    points: 2,
    difficulty: "Basic",
    options: [
      { id: "A", text: "Personification" },
      { id: "B", text: "Metaphor" },
      { id: "C", text: "Hyperbole" },
      { id: "D", text: "Oxymoron" },
    ],
    correctOptionId: "A",
    explanation: "Personification attributes human qualities (smiling warmly) to non-human or inanimate entities (the sun).",
  },
  {
    id: "qb-eng-003",
    questionNumber: 3,
    course: "English Language",
    examTitle: "2nd Term Continuous Assessment (CA 1)",
    publishedAt: "2026-02-05",
    type: "fill-blanks",
    prompt:
      "A word that has the exact opposite meaning to another word in lexical semantics is known as an ________.",
    points: 2,
    difficulty: "Basic",
    shortAnswer: "antonym",
    explanation: "An antonym is a word opposite in meaning to another word.",
  },
  {
    id: "qb-eng-004",
    questionNumber: 4,
    course: "English Language",
    examTitle: "Mock Pre-WAEC Examination",
    publishedAt: "2026-02-28",
    type: "mcq",
    prompt:
      "Choose the word that is nearest in meaning to the capitalized word: The commissioner's speech was PRAGMATIC rather than visionary.",
    points: 2,
    difficulty: "Intermediate",
    options: [
      { id: "A", text: "Practical" },
      { id: "B", text: "Idealistic" },
      { id: "C", text: "Theoretical" },
      { id: "D", text: "Ambitious" },
    ],
    correctOptionId: "A",
    explanation: "Pragmatic means dealing with things sensibly and realistically in a practical way.",
  },

  // 2. Mathematics - Algebra, Geometry, Trigonometry
  {
    id: "qb-math-001",
    questionNumber: 1,
    course: "Mathematics",
    examTitle: "Term 1 Final Examination",
    publishedAt: "2025-12-18",
    type: "mcq",
    prompt: "Find the roots of the quadratic equation 2x² - 5x - 3 = 0.",
    points: 3,
    difficulty: "Intermediate",
    options: [
      { id: "A", text: "x = 3 or x = -1/2" },
      { id: "B", text: "x = -3 or x = 1/2" },
      { id: "C", text: "x = 2 or x = -3" },
      { id: "D", text: "x = 5 or x = -1" },
    ],
    correctOptionId: "A",
    explanation: "Factorizing gives (2x + 1)(x - 3) = 0, so x = 3 or x = -1/2.",
  },
  {
    id: "qb-math-002",
    questionNumber: 2,
    course: "Mathematics",
    examTitle: "Term 2 Mid-Term CA 2",
    publishedAt: "2026-02-12",
    type: "mcq",
    prompt: "If log₁₀(x) + log₁₀(5) = 2, what is the numerical value of x?",
    points: 2,
    difficulty: "Intermediate",
    options: [
      { id: "A", text: "10" },
      { id: "B", text: "20" },
      { id: "C", text: "50" },
      { id: "D", text: "100" },
    ],
    correctOptionId: "B",
    explanation: "log₁₀(5x) = 2 => 5x = 10² = 100 => x = 20.",
  },
  {
    id: "qb-math-003",
    questionNumber: 3,
    course: "Mathematics",
    examTitle: "2nd Term Geometry CA 1",
    publishedAt: "2026-01-28",
    type: "theory",
    prompt:
      "In the right-angled triangle ABC shown in the diagram below, angle B = 90°, AB = 8 cm, and BC = 6 cm. Calculate the length of AC and determine sin(angle BAC).",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Fig 1.1: Right-angled triangle ABC with perpendicular height AB and base BC",
    points: 5,
    difficulty: "Advanced",
    theoryAnswer:
      "Using Pythagoras theorem: AC² = AB² + BC² = 8² + 6² = 64 + 36 = 100. Thus, AC = 10 cm. Sin(angle BAC) = Opposite / Hypotenuse = BC / AC = 6 / 10 = 0.6.",
    rubrics: [
      { id: "qb-mr-1", criterion: "Correct application of Pythagoras theorem", weight: 0.5 },
      { id: "qb-mr-2", criterion: "Accurate computation of trigonometric ratio", weight: 0.5 },
    ],
  },
  {
    id: "qb-math-004",
    questionNumber: 4,
    course: "Mathematics",
    examTitle: "Term 2 Mid-Term CA 2",
    publishedAt: "2026-02-12",
    type: "fill-blanks",
    prompt:
      "The value of the gradient (slope) of a line perpendicular to a line with gradient m = -2/3 is ________.",
    points: 2,
    difficulty: "Intermediate",
    shortAnswer: "3/2",
    explanation: "Perpendicular lines satisfy m1 * m2 = -1. Therefore, m2 = -1 / (-2/3) = 3/2 or 1.5.",
  },

  // 3. Basic Science - Biology, Physics & Chemistry
  {
    id: "qb-sci-001",
    questionNumber: 1,
    course: "Basic Science",
    examTitle: "1st Term Science Terminal Exam",
    publishedAt: "2026-01-20",
    type: "mcq",
    prompt:
      "Which organelle illustrated in the cellular diagram below is known as the powerhouse of the cell and facilitates ATP production?",
    imageUrl: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Fig 2.1: Microscopic structure of cellular organelles under electron microscope",
    points: 2,
    difficulty: "Basic",
    options: [
      { id: "A", text: "Mitochondria" },
      { id: "B", text: "Ribosome" },
      { id: "C", text: "Endoplasmic Reticulum" },
      { id: "D", text: "Golgi Apparatus" },
    ],
    correctOptionId: "A",
    explanation: "Mitochondria produce cellular energy (ATP) through aerobic cellular respiration.",
  },
  {
    id: "qb-sci-002",
    questionNumber: 2,
    course: "Basic Science",
    examTitle: "2nd Term CA 1 Science Test",
    publishedAt: "2026-02-18",
    type: "fill-blanks",
    prompt:
      "The standard International System of Units (SI) unit for measuring electrical resistance is the ________.",
    points: 2,
    difficulty: "Basic",
    shortAnswer: "ohm",
    explanation: "The SI unit of electrical resistance is the ohm (Ω).",
  },
  {
    id: "qb-sci-003",
    questionNumber: 3,
    course: "Basic Science",
    examTitle: "1st Term Science Terminal Exam",
    publishedAt: "2026-01-20",
    type: "theory",
    prompt:
      "State Newton's Second Law of Motion. Derive the formula F = ma from the definition of momentum and state its standard unit of force.",
    points: 4,
    difficulty: "Intermediate",
    theoryAnswer:
      "Newton's Second Law states that the rate of change of momentum of a body is directly proportional to the applied external force and takes place in the direction of the force. F = dp/dt = d(mv)/dt = m(dv/dt) = ma. The unit of force is the Newton (N) or kg·m/s².",
    rubrics: [
      { id: "qb-sr-1", criterion: "Clear statement of Newton's second law", weight: 0.4 },
      { id: "qb-sr-2", criterion: "Correct mathematical derivation of F = ma", weight: 0.4 },
      { id: "qb-sr-3", criterion: "Correct SI unit designation", weight: 0.2 },
    ],
  },
  {
    id: "qb-sci-004",
    questionNumber: 4,
    course: "Basic Science",
    examTitle: "2nd Term Ecology & Photosynthesis CA",
    publishedAt: "2026-02-25",
    type: "mcq",
    prompt:
      "Refer to the diagram below showing the photosynthesis process in green leaves. What gas is released as a byproduct during the light-dependent reaction?",
    imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80",
    imageCaption: "Fig 3.2: Sunlight absorption and gas exchange during leaf photosynthesis",
    points: 2,
    difficulty: "Basic",
    options: [
      { id: "A", text: "Oxygen (O₂)" },
      { id: "B", text: "Carbon Dioxide (CO₂)" },
      { id: "C", text: "Nitrogen (N₂)" },
      { id: "D", text: "Hydrogen Gas (H₂)" },
    ],
    correctOptionId: "A",
    explanation: "During photolysis of water in photosynthesis, oxygen is released into the atmosphere.",
  },

  // 4. Civic Education & Social Studies
  {
    id: "qb-civ-001",
    questionNumber: 1,
    course: "Civic Education",
    examTitle: "1st Term Continuous Assessment",
    publishedAt: "2026-01-10",
    type: "theory",
    prompt:
      "Explain the concept of Rule of Law as postulated by A.V. Dicey, outlining the three pillars of its constitutional application in democratic governance.",
    points: 5,
    difficulty: "Intermediate",
    theoryAnswer:
      "A.V. Dicey outlined three core pillars: 1. Supremacy of regular law over arbitrary power. 2. Equality before the law (every citizen is subject to the ordinary law of the realm). 3. Predominance of legal spirit and fundamental human rights protected by an independent judiciary.",
    rubrics: [
      { id: "qb-cr-1", criterion: "Accurate explanation of supremacy of law", weight: 0.35 },
      { id: "qb-cr-2", criterion: "Explanation of equality before the law", weight: 0.35 },
      { id: "qb-cr-3", criterion: "Explanation of judicial independence and rights", weight: 0.3 },
    ],
  },
  {
    id: "qb-civ-002",
    questionNumber: 2,
    course: "Civic Education",
    examTitle: "1st Term Continuous Assessment",
    publishedAt: "2026-01-10",
    type: "mcq",
    prompt:
      "Which branch of government is constitutionally empowered to interpret laws and administer justice?",
    points: 1,
    difficulty: "Basic",
    options: [
      { id: "A", text: "The Judiciary" },
      { id: "B", text: "The Legislature" },
      { id: "C", text: "The Executive" },
      { id: "D", text: "The Civil Service" },
    ],
    correctOptionId: "A",
    explanation: "The Judiciary interprets the laws and resolves legal disputes.",
  },
]

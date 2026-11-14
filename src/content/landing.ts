export interface ArtisanMarqueeItem {
  id: string;
  title: string;
  provider: string;
  area: string;
  fromFee: string;
  rating: string;
  reviews: number;
  eta: string;
  badgeText: string;
  image: string;
  tiltDeg: number;
}

export interface ServiceCategoryItem {
  id: string;
  title: string;
  description: string;
  startingPrice: string;
  etaBadge: string;
  image: string;
  popularTags: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface QuestionTypeItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  iconType:
    | "list-checks"
    | "text-cursor"
    | "file-text"
    | "pen-line"
    | "sigma"
    | "book-open"
    | "shapes";
}

export interface FloatingNotificationItem {
  id: string;
  title: string;
  subtitle: string;
  tone: "blue" | "ink" | "sapphire";
  iconType: "scooter" | "gift" | "tag" | "check";
  position: "top-left" | "bottom-left" | "top-right" | "bottom-right";
  tiltDeg: number;
}

export interface AbujaBubbleItem {
  id: string;
  name: string;
  xPercent: number;
  yPercent: number;
  size: "md" | "lg";
}

export interface TestimonialItem {
  id: string;
  type: "quote" | "story";
  quote?: string;
  authorName: string;
  authorRole: string;
  area: string;
  storyTitle?: string;
  storyTrade?: string;
  tiltDeg: number;
}

export type BlogBodyBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      leadIn: string;
      items: readonly string[];
    };

export interface WhatsNewItem {
  id: string;
  slug: string;
  categoryId: "offers" | "product-update" | "artisans";
  category: string;
  readTime: string;
  title: string;
  highlightWords?: readonly string[];
  description: string;
  fullStory: string[];
  bodyBlocks: readonly BlogBodyBlock[];
  image?: string;
  visualType:
    | "reward"
    | "dashboards"
    | "emblem"
    | "referral"
    | "tracking"
    | "business";
}

export type BlogCategoryId = "all" | "offers" | "product-update" | "artisans";

export interface BlogCategoryTab {
  id: BlogCategoryId;
  label: string;
}

export interface AudienceItem {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaVariant: "primary" | "secondary";
  ctaHref: string;
  image: string;
  slabTone: "blue" | "ink" | "sapphire";
}

export interface FaqItemData {
  id: string;
  question: string;
  answer: string;
}

export type FaqCategoryId = "customers" | "artisans" | "businesses";

export interface FaqCategoryTab {
  id: FaqCategoryId;
  label: string;
  items: FaqItemData[];
}

export interface HowItWorksStepItem {
  id: string;
  stepNumber: "01" | "02" | "03" | "04" | "05";
  title: string;
  description: string;
  image: string;
  illustrationType?: "store" | "dispatch" | "orders";
}

export interface HowItWorksPerkItem {
  id: string;
  label: string;
  iconType: "onboarding" | "dashboard" | "support";
}

export const landingContent = {
  preloader: {
    brandName: "Examinify",
    tagline: "Offline-Ready CBT · Full School Ownership · Built for Nigerian Schools",
  },
  navbar: {
    links: [
      { label: "Home", href: "/" },
      { label: "Schools", href: "/schools" },
      { label: "Features", href: "/#services" },
      { label: "Coverage", href: "/#coverage" },
      { label: "FAQs", href: "/faqs" },
      { label: "Blog", href: "/blog" },
    ],
    primaryCta: "School Portal",
    secondaryCta: "Book a Demo",
  },
  hero: {
    eyebrow: "One Unified Exam Platform · AI Question Studio · 100% School Owned",
    headlineLine1: "Better Exams.",
    headlineLine2: "Graded in Minutes.",
    subtitle:
      "Turn lesson notes into ready-made exam questions in seconds, prevent copy-paste and tab switching, and grade hundreds of multiple choice, theory, and cloze scripts in minutes—all inside a CBT customized and owned by your school.",
    primaryCta: "Reclaim Your Time",
    secondaryCta: "Explore CBT Portal",
    marqueeCards: [
      {
        id: "ac-refill",
        title: "AI Lesson-to-Exam Studio",
        provider: "Multiple Choice · Theory · Cloze",
        area: "In Seconds",
        fromFee: "Fully Editable",
        rating: "4.9",
        reviews: 210,
        eta: "AI Ready",
        badgeText: "Question Studio",
        image: "/images/landing/feature-question-generator.jpg",
        tiltDeg: -4,
      },
      {
        id: "pipe-leak",
        title: "Anti-Malpractice Lockdown",
        provider: "Copy, Paste & Tab Switch Blocked",
        area: "Live Guard",
        fromFee: "Distraction-Free",
        rating: "4.9",
        reviews: 185,
        eta: "Secured",
        badgeText: "Exam Lock",
        image: "/images/landing/feature-malpractice-control.jpg",
        tiltDeg: 3.5,
      },
      {
        id: "carpentry-doors",
        title: "Mathematics & Diagram CBT",
        provider: "Equations · Graphs · Geometry",
        area: "JSS & SSS",
        fromFee: "Autosaving Room",
        rating: "4.9",
        reviews: 164,
        eta: "45 Min",
        badgeText: "7 Formats",
        image: "/images/landing/cbt-maths.jpg",
        tiltDeg: -3,
      },
      {
        id: "inverter-solar",
        title: "Automated Script Grading",
        provider: "MCQ, Cloze & Theory in Minutes",
        area: "High Scale",
        fromFee: "Review & Adjust",
        rating: "4.8",
        reviews: 192,
        eta: "Minutes",
        badgeText: "Auto-Graded",
        image: "/images/landing/feature-auto-grading.svg",
        tiltDeg: 4,
      },
      {
        id: "deep-clean",
        title: "Personalized Feedback",
        provider: "Tailored Guidance per Answer",
        area: "Clear Insights",
        fromFee: "Student-Ready",
        rating: "4.9",
        reviews: 240,
        eta: "Instant",
        badgeText: "Auto-Feedback",
        image: "/images/landing/feature-instant-feedback.svg",
        tiltDeg: -3.5,
      },
      {
        id: "tv-mounting",
        title: "Instant Broadsheet Export",
        provider: "Review Before Sharing Results",
        area: "Full Control",
        fromFee: "Excel & Slips",
        rating: "4.8",
        reviews: 150,
        eta: "1-Click",
        badgeText: "Export Ready",
        image: "/images/landing/feature-export-results.svg",
        tiltDeg: 3,
      },
    ] satisfies ArtisanMarqueeItem[],
  },
  appShowcase: {
    headline: "One Reliable System. Zero Tool Hopping.",
    subtitle:
      "Why juggle separate apps for question writing, exam security, grading, and broadsheets when one dependable platform handles every stage—and keeps working through unstable internet?",
    primaryCta: "Reclaim Your Time",
    secondaryCta: "See 5-Step Flow",
    promoLine: "Generate questions, lock down the exam hall, grade in minutes, and export organized results in one flow.",
    notifications: [
      {
        id: "notif-1",
        title: "Notes to Questions in Seconds",
        subtitle: "AI Question Studio · Edit & customize freely.",
        tone: "blue",
        iconType: "scooter",
        position: "top-left",
        tiltDeg: -5,
      },
      {
        id: "notif-2",
        title: "Timed & Autosaving Setup",
        subtitle: "Power or network drop? Resume right away.",
        tone: "ink",
        iconType: "gift",
        position: "bottom-left",
        tiltDeg: 2,
      },
      {
        id: "notif-3",
        title: "Copy, Paste & Tabs Blocked",
        subtitle: "Malpractice control active on every seat.",
        tone: "ink",
        iconType: "check",
        position: "top-right",
        tiltDeg: -3,
      },
      {
        id: "notif-4",
        title: "Review Before You Export",
        subtitle: "Adjust grades & send personalized feedback.",
        tone: "sapphire",
        iconType: "tag",
        position: "bottom-right",
        tiltDeg: 4,
      },
    ] satisfies FloatingNotificationItem[],
  },
  services: {
    eyebrow: "One Unified Exam Platform",
    headline: "Everything Your School Needs for Stronger Exams",
    subtitle:
      "Why stitch together separate tools when a single, dependable system lets you generate questions, guard against malpractice, grade in minutes, and export polished results?",
    items: [
      {
        id: "cat-question-gen",
        title: "Smart Question Studio",
        description:
          "Transform your lesson notes and topics into ready-to-publish exam items in seconds—then edit, format, and tailor every question to your class.",
        startingPrice: "AI-Assisted",
        etaBadge: "In Seconds",
        image: "/images/landing/feature-question-generator.jpg",
        popularTags: ["Notes to Questions", "Editable Prompts", "NERDC Ready"],
        ctaLabel: "Try Question Studio",
        ctaHref: "/login",
      },
      {
        id: "cat-malpractice",
        title: "Anti-Malpractice Lockdown",
        description:
          "Keep every test fair from start to finish. Candidates cannot copy, paste, or switch browser tabs while your examination is active.",
        startingPrice: "Anti-Cheat",
        etaBadge: "Tab & Copy Lock",
        image: "/images/landing/feature-malpractice-control.jpg",
        popularTags: ["Copy-Paste Blocked", "Tab-Switch Guard", "Shuffled Items"],
        ctaLabel: "See Exam Security",
        ctaHref: "#how-it-works",
      },
      {
        id: "cat-feedback",
        title: "Personalized Instant Feedback",
        description:
          "Give each student clear, constructive feedback automatically tailored to their specific answers so every learner knows how to improve.",
        startingPrice: "Tailored Clarity",
        etaBadge: "Auto-Feedback",
        image: "/images/landing/feature-instant-feedback.svg",
        popularTags: ["Answer Explanations", "Strengths & Gaps", "Student-Ready"],
        ctaLabel: "Explore Feedback",
        ctaHref: "/login",
      },
      {
        id: "cat-setup",
        title: "Distraction-Free Exam Room",
        description:
          "Deliver strictly timed, real-time autosaving exams in a calm, controlled environment—resilient even on weak internet and synced online later.",
        startingPrice: "Autosave + Sync",
        etaBadge: "Timed Focus",
        image: "/images/landing/feature-standard-exam.svg",
        popularTags: ["Real-Time Autosave", "Zero Distractions", "Power-Drop Safe"],
        ctaLabel: "Explore Exam Room",
        ctaHref: "#how-it-works",
      },
      {
        id: "cat-export",
        title: "One-Click Result Export",
        description:
          "Download neatly organized broadsheets and score reports instantly—while staying in full command to inspect scripts and adjust marks before sharing.",
        startingPrice: "Full Oversight",
        etaBadge: "Instant Export",
        image: "/images/landing/feature-export-results.svg",
        popularTags: ["Pre-Share Review", "Score Adjustments", "Clean Broadsheets"],
        ctaLabel: "See Broadsheets",
        ctaHref: "/login",
      },
      {
        id: "cat-auto-grade",
        title: "Minutes-Fast Auto-Grading",
        description:
          "Score hundreds of scripts across multiple choice, structured theory, and fill-in-the-gap questions in minutes—giving teachers their evenings back.",
        startingPrice: "High Volume",
        etaBadge: "Graded in Minutes",
        image: "/images/landing/feature-auto-grading.svg",
        popularTags: ["MCQ & Cloze", "Theory Marking", "Teacher Override"],
        ctaLabel: "Start Grading Faster",
        ctaHref: "/login",
      },
    ] satisfies ServiceCategoryItem[],
  },
  questionTypes: {
    eyebrow: "7 Supported Formats",
    headline: "Every Question Format, Ready Immediately",
    highlightWords: ["Question", "Format,", "Immediately"],
    subtitle:
      "Mix objective, fill-in-the-blank, mathematical, diagram-based, and extended written prompts inside a single examination—built and scored without switching tools.",
    showcaseImage: "/images/landing/question-types-showcase.jpg",
    ctaLabel: "Create With Any Format",
    ctaHref: "/login",
    items: [
      {
        id: "qt-mcq",
        title: "Multiple Choice",
        description: "Single or multi-select A–D options with seat-by-seat shuffling and instant scoring.",
        badge: "Instant Auto-Score",
        iconType: "list-checks",
      },
      {
        id: "qt-cloze",
        title: "Fill in the Blank",
        description: "Cloze passages and missing-word statements graded accurately in seconds.",
        badge: "Cloze Precision",
        iconType: "text-cursor",
      },
      {
        id: "qt-theory",
        title: "Structured Theory",
        description: "Short and multi-part written answers evaluated quickly with AI rubric support.",
        badge: "AI Rubric Assist",
        iconType: "file-text",
      },
      {
        id: "qt-essay",
        title: "Long-Form Essay",
        description: "Extended composition questions with clear scoring guides and teacher review.",
        badge: "Full Oversight",
        iconType: "pen-line",
      },
      {
        id: "qt-math",
        title: "Mathematics",
        description: "Clean algebraic equations, fractions, symbols, and numerical problem solving.",
        badge: "Formula Ready",
        iconType: "sigma",
      },
      {
        id: "qt-case-study",
        title: "Case Studies",
        description: "Real-world scenarios and comprehension passages paired with linked sub-items.",
        badge: "Scenario Linked",
        iconType: "book-open",
      },
      {
        id: "qt-diagram",
        title: "Labeled Diagrams",
        description: "Crisp scientific illustrations, maps, and charts embedded directly in questions.",
        badge: "Visual Prompts",
        iconType: "shapes",
      },
    ] satisfies QuestionTypeItem[],
  },
  coverage: {
    badge: "36 States & FCT Ready",
    headline: "Trusted Across Nigeria",
    subtitle:
      "From Lagos and Abuja to Port Harcourt, Ibadan, Kano, and Enugu, Examinify powers resilient, sync-ready CBT assessments that schools own completely.",
    comingSoonNote:
      "Works across school ICT labs, desktops, laptops, and tablets—even on weak internet, with automatic online sync.",
    topBubbles: [
      { id: "wuse", name: "Lagos", xPercent: 18, yPercent: 22, size: "lg" },
      { id: "maitama", name: "Abuja", xPercent: 52, yPercent: 18, size: "md" },
      { id: "jabi", name: "Ibadan", xPercent: 82, yPercent: 24, size: "md" },
    ] satisfies AbujaBubbleItem[],
    bottomBubbles: [
      { id: "gwarinpa", name: "Kano", xPercent: 16, yPercent: 72, size: "md" },
      { id: "asokoro", name: "Enugu", xPercent: 45, yPercent: 76, size: "md" },
      { id: "garki", name: "Port Harcourt", xPercent: 78, yPercent: 68, size: "lg" },
    ] satisfies AbujaBubbleItem[],
    stats: [
      { value: 350, suffix: "+", label: "Nigerian Schools" },
      { value: 120, suffix: "K+", label: "CBT Scripts Graded" },
      { value: 2, suffix: " Sec", label: "Result Turnaround" },
    ],
  },
  roadJourney: {
    headline: "Built for Nigeria's Top-Rated Schools",
    subtitle:
      "Move your school from paper booklets and fragile internet to a reliable CBT personalized and customized just for your school—with your school owning the entire software.",
    signposts: [
      { id: "sign-wuse", name: "Lagos", direction: "right" as const, heightClass: "tall" as const },
      { id: "sign-maitama", name: "Abuja", direction: "right" as const, heightClass: "mid" as const },
      { id: "sign-gwarinpa", name: "Port Harcourt", direction: "right" as const, heightClass: "short" as const },
      { id: "sign-jabi", name: "Ibadan", direction: "left" as const, heightClass: "short" as const },
    ],
  },
  testimonials: {
    headline: "What Schools Are Saying",
    subtitle:
      "See why primary and secondary school proprietors, principals, and exam officers across Nigeria trust Examinify every term.",
    items: [
      {
        id: "test-1",
        type: "quote",
        quote:
          "Students keep testing smoothly even when our internet drops, and every script syncs online once Wi-Fi returns. Best of all, the CBT is customized just for our school, and we own the entire software.",
        authorName: "Mrs. Amina Bello",
        authorRole: "Principal · Crescent Heights Academy, Abuja",
        area: "Abuja",
        tiltDeg: -4,
      },
      {
        id: "test-2",
        type: "story",
        storyTitle: "Offline-Ready CBT · Auto-Sync",
        storyTrade: "St. Gabriel Primary · Ikeja",
        authorName: "Chinedu O.",
        authorRole: "Head Teacher",
        area: "Lagos",
        tiltDeg: 3,
      },
      {
        id: "test-3",
        type: "story",
        storyTitle: "JSS 1–3 Script & Item Analysis",
        storyTrade: "Royal Crown College · Bodija",
        authorName: "Zainab M.",
        authorRole: "Exam Officer",
        area: "Ibadan",
        tiltDeg: -3,
      },
      {
        id: "test-4",
        type: "story",
        storyTitle: "Custom CBT · Full Software Ownership",
        storyTrade: "Horizon High · GRA Phase 2",
        authorName: "David A.",
        authorRole: "ICT Coordinator",
        area: "Port Harcourt",
        tiltDeg: 3.5,
      },
      {
        id: "test-5",
        type: "quote",
        quote:
          "When power or internet flickered mid-exam in our ICT lab, every student stayed on track and resumed right where they stopped—zero lost answers and seamless online sync.",
        authorName: "Mr. Tunde Okonkwo",
        authorRole: "Proprietor · Prime Scholars Schools, Lagos",
        area: "Lagos",
        tiltDeg: 4,
      },
    ] satisfies TestimonialItem[],
  },
  everythingYouNeed: {
    headline: "Everything You Need To Own Your CBT",
    primaryCta: "Reclaim Your Time",
    secondaryCta: "Explore CBT Portal",
    promoLine: "Generate questions from notes, block tab-switching, grade in minutes, and own your entire CBT platform.",
    chips: [
      "AI Question Studio",
      "Copy & Tab Lock",
      "Auto-Grade in Minutes",
      "7 Question Formats",
      "Personalized Feedback",
      "Timed & Autosaving",
      "Review & Export Results",
      "100% School Owned",
    ],
  },
  whatsNew: {
    headline: "What's New on Examinify",
    subtitle:
      "Discover new CBT assessment features, termly exam guides, product updates, and stories from Nigerian schools on Examinify.",
    cardCta: "Read More",
    moreCta: "See More",
    moreHref: "/blog",
    items: [
      {
        id: "new-1",
        slug: "zero-paper-cost-termly-ca-and-exams",
        categoryId: "offers",
        category: "Offers",
        readTime: "3 mins read",
        title: "Cut Termly Exam Printing Costs by 80%",
        highlightWords: ["Termly", "Exam"],
        description:
          "At Examinify, we help Nigerian primary and secondary schools eliminate paper booklets, ink costs, and manual collation errors every term.",
        fullStory: [
          "Printing thousands of question papers for 1st CA, 2nd CA, and terminal exams drains school budgets every term. With Examinify, schools launch digital CBT exams across existing ICT lab computers, tablets, or Chromebooks at a fraction of paper cost.",
          "Plus, every new school that signs up before mid-term receives a free 1st CA onboarding pilot for up to 200 students, complete with bulk question upload and teacher training.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Printing, stapling, and sorting thousands of question papers for 1st CA, 2nd CA, and terminal exams costs Nigerian schools millions of naira every session — and Examinify eliminates that stress from day one.",
          },
          {
            type: "list",
            leadIn: "Every school onboarding onto Examinify unlocks:",
            items: [
              "Free 1st CA pilot term for up to 200 primary or secondary students",
              "Zero paper, toner, or photocopying expenses for objective tests",
              "Automated 1st CA, 2nd CA, and 60%/70% exam score collation",
              "Dedicated onboarding support for your exam officer and teachers",
            ],
          },
          {
            type: "paragraph",
            text: "Once your school profile is created and your class arms (Primary 1–6 or JSS 1–SSS 3) are imported, teachers can upload questions in minutes using Word, Excel, or our built-in editor.",
          },
          {
            type: "list",
            leadIn: "Use Examinify across every termly milestone:",
            items: [
              "1st Continuous Assessment (CA 1) quizzes and class tests",
              "2nd Continuous Assessment (CA 2) and mid-term evaluations",
              "1st, 2nd, and 3rd Term promotion and terminal examinations",
              "Common Entrance, BECE, and WAEC/NECO mock CBT practice",
            ],
          },
          {
            type: "list",
            leadIn: "Getting your school started takes less than 15 minutes:",
            items: [
              "Launch your personalized Examinify CBT customized for your school",
              "Upload your student roster by class and arm (e.g., JSS 2A, Primary 5B)",
              "Add subject questions or pick from NERDC-aligned templates",
              "Publish your exam PINs and watch scores compute automatically",
            ],
          },
          {
            type: "paragraph",
            text: "Schools using Examinify save hours of manual script marking each week and deliver accurate termly result sheets to parents faster.",
          },
          {
            type: "paragraph",
            text: "Book a demo today and run your next termly continuous assessment smoothly on Examinify.",
          },
        ],
        visualType: "reward",
      },
      {
        id: "new-2",
        slug: "from-lesson-notes-to-graded-results-in-five-steps",
        categoryId: "product-update",
        category: "Product Update",
        readTime: "3 mins read",
        title: "Lesson Notes to Graded Broadsheets in Five Steps",
        highlightWords: ["Lesson", "Notes", "Five", "Steps"],
        description:
          "Generate questions in seconds, block copy-paste and tab switching, and grade hundreds of MCQ, cloze, and theory scripts in minutes.",
        fullStory: [
          "Why stitch together separate apps when one dependable platform lets teachers convert lesson notes into exam questions in seconds, organize student groups, and run distraction-free timed tests?",
          "With Examinify's five-step workflow, hundreds of scripts across multiple choice, theory, and fill-in-the-gap questions are graded in minutes—leaving teachers in complete control to review, adjust marks, share personalized feedback, and export results.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Setting, invigilating, and grading termly continuous assessments shouldn't require three disconnected tools — Examinify brings every stage into one reliable, school-owned workflow.",
          },
          {
            type: "list",
            leadIn: "Our five-step exam pipeline saves staff hours at every stage:",
            items: [
              "01 Craft Your Examination: Turn lesson notes into editable exam questions in seconds using AI",
              "02 Group Your Learners: Organize students into classes, arms, or cohorts ready for testing",
              "03 Publish & Share Access: Launch timed, autosaving exams with copy-paste and tab-switch lock",
              "04 Review & Approve Marks: Inspect AI-graded MCQ, cloze, and theory scripts and adjust scores",
              "05 Export & Deliver Feedback: Download organized broadsheets and share personalized feedback",
            ],
          },
          {
            type: "paragraph",
            text: "Every candidate writes inside a calm, distraction-free exam room that autosaves in real time—even when internet drops—and automatically syncs completed scripts once reconnected.",
          },
          {
            type: "list",
            leadIn: "Teachers and exam officers keep complete oversight from start to finish:",
            items: [
              "Built-in malpractice control prevents copying, pasting, and switching browser tabs",
              "Minutes-fast automated grading across Multiple Choice, Cloze, and Theory prompts",
              "Clear, constructive automatic feedback personalized to each student's answers",
              "One-click export to clean Excel broadsheets after final teacher approval",
            ],
          },
          {
            type: "paragraph",
            text: "Reclaim your weekends by running your next continuous assessment or terminal exam inside Examinify.",
          },
        ],
        image: "/images/landing/feature-question-generator.jpg",
        visualType: "dashboards",
      },
      {
        id: "new-3",
        slug: "seven-question-formats-and-malpractice-lockdown",
        categoryId: "artisans",
        category: "Schools",
        readTime: "3 mins read",
        title: "Seven Question Formats & Built-In Malpractice Control",
        highlightWords: ["Seven", "Question", "Formats"],
        description:
          "Combine Multiple Choice, Fill in the Blank, Theory, Essay, Mathematics, Case Study, and Diagram prompts inside one tamper-proof exam room.",
        fullStory: [
          "Modern school assessments go far beyond simple A–D bubbles. Examinify supports seven rich question formats out of the box: Multiple Choice, Fill in the Blank, Theory, Essay, Mathematics, Case Study, and Diagram items.",
          "Every paper runs inside a distraction-free, timed, autosaving workspace where copying, pasting, and tab switching are strictly blocked.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Whether you're setting a Primary 5 comprehension passage, a JSS 2 math quiz, or an SSS 3 biology diagram exam, Examinify handles all seven assessment formats seamlessly in one place.",
          },
          {
            type: "list",
            leadIn: "Every school examination on Examinify supports:",
            items: [
              "Multiple Choice & Fill in the Blank (Cloze) with instant auto-scoring",
              "Structured Theory & Long-Form Essay prompts graded rapidly with AI rubric support",
              "Mathematics equations, Case Studies, and Labeled Diagrams embedded cleanly",
              "Copy-paste blocking and tab-switch prevention active on every candidate screen",
            ],
          },
          {
            type: "paragraph",
            text: "After students submit, teachers review AI-assisted grades across hundreds of scripts in minutes, fine-tune any marks, and release personalized answer feedback alongside downloadable broadsheets.",
          },
          {
            type: "paragraph",
            text: "Organize your school's termly question bank once on Examinify and reuse it effortlessly every session.",
          },
        ],
        image: "/images/landing/question-types-showcase.jpg",
        visualType: "emblem",
      },
    ] satisfies WhatsNewItem[],
  },
  blogPage: {
    hero: {
      headline: "The Exam Hub",
      highlightWords: ["Exam"],
      subtitle:
        "Product updates, CBT best practices, Nigerian school spotlights, and guides for stress-free termly assessments on Examinify.",
    },
    detail: {
      defaultArticleId: "new-2",
      shareLabel: "Share",
      socials: ["IG", "𝕏", "in"] as const,
      moreNewsHeadline: "More Updates",
      moreNewsHighlightWords: ["Updates"] as const,
    },
    categories: [
      { id: "all", label: "All" },
      { id: "offers", label: "Offers" },
      { id: "product-update", label: "Product Update" },
      { id: "artisans", label: "Schools" },
    ] satisfies BlogCategoryTab[],
    cardCta: "Read More",
    loadMoreCta: "Load More",
    showLessCta: "Show Less",
    items: [
      {
        id: "new-1",
        slug: "zero-paper-cost-termly-ca-and-exams",
        categoryId: "offers",
        category: "Offers",
        readTime: "3 mins read",
        title: "Cut Termly Exam Printing Costs by 80%",
        highlightWords: ["Termly", "Exam"],
        description:
          "At Examinify, we help Nigerian primary and secondary schools eliminate paper booklets, ink costs, and manual collation errors every term.",
        fullStory: [
          "Printing thousands of question papers for 1st CA, 2nd CA, and terminal exams drains school budgets every term. With Examinify, schools launch digital CBT exams across existing ICT lab computers, tablets, or Chromebooks at a fraction of paper cost.",
          "Plus, every new school that signs up before mid-term receives a free 1st CA onboarding pilot for up to 200 students, complete with bulk question upload and teacher training.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Printing, stapling, and sorting thousands of question papers for 1st CA, 2nd CA, and terminal exams costs Nigerian schools millions of naira every session — and Examinify eliminates that stress from day one.",
          },
          {
            type: "list",
            leadIn: "Every school onboarding onto Examinify unlocks:",
            items: [
              "Free 1st CA pilot term for up to 200 primary or secondary students",
              "Zero paper, toner, or photocopying expenses for objective tests",
              "Automated 1st CA, 2nd CA, and 60%/70% exam score collation",
              "Dedicated onboarding support for your exam officer and teachers",
            ],
          },
          {
            type: "paragraph",
            text: "Once your school profile is created and your class arms (Primary 1–6 or JSS 1–SSS 3) are imported, teachers can upload questions in minutes using Word, Excel, or our built-in editor.",
          },
          {
            type: "list",
            leadIn: "Use Examinify across every termly milestone:",
            items: [
              "1st Continuous Assessment (CA 1) quizzes and class tests",
              "2nd Continuous Assessment (CA 2) and mid-term evaluations",
              "1st, 2nd, and 3rd Term promotion and terminal examinations",
              "Common Entrance, BECE, and WAEC/NECO mock CBT practice",
            ],
          },
          {
            type: "list",
            leadIn: "Getting your school started takes less than 15 minutes:",
            items: [
              "Launch your personalized Examinify CBT customized for your school",
              "Upload your student roster by class and arm (e.g., JSS 2A, Primary 5B)",
              "Add subject questions or pick from NERDC-aligned templates",
              "Publish your exam PINs and watch scores compute automatically",
            ],
          },
          {
            type: "paragraph",
            text: "Schools using Examinify save hours of manual script marking each week and deliver accurate termly result sheets to parents faster.",
          },
          {
            type: "paragraph",
            text: "Book a demo today and run your next termly continuous assessment smoothly on Examinify.",
          },
        ],
        visualType: "reward",
      },
      {
        id: "new-2",
        slug: "from-lesson-notes-to-graded-results-in-five-steps",
        categoryId: "product-update",
        category: "Product Update",
        readTime: "3 mins read",
        title: "Lesson Notes to Graded Broadsheets in Five Steps",
        highlightWords: ["Lesson", "Notes", "Five", "Steps"],
        description:
          "Generate questions in seconds, block copy-paste and tab switching, and grade hundreds of MCQ, cloze, and theory scripts in minutes.",
        fullStory: [
          "Why stitch together separate apps when one dependable platform lets teachers convert lesson notes into exam questions in seconds, organize student groups, and run distraction-free timed tests?",
          "With Examinify's five-step workflow, hundreds of scripts across multiple choice, theory, and fill-in-the-gap questions are graded in minutes—leaving teachers in complete control to review, adjust marks, share personalized feedback, and export results.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Setting, invigilating, and grading termly continuous assessments shouldn't require three disconnected tools — Examinify brings every stage into one reliable, school-owned workflow.",
          },
          {
            type: "list",
            leadIn: "Our five-step exam pipeline saves staff hours at every stage:",
            items: [
              "01 Craft Your Examination: Turn lesson notes into editable exam questions in seconds using AI",
              "02 Group Your Learners: Organize students into classes, arms, or cohorts ready for testing",
              "03 Publish & Share Access: Launch timed, autosaving exams with copy-paste and tab-switch lock",
              "04 Review & Approve Marks: Inspect AI-graded MCQ, cloze, and theory scripts and adjust scores",
              "05 Export & Deliver Feedback: Download organized broadsheets and share personalized feedback",
            ],
          },
          {
            type: "paragraph",
            text: "Every candidate writes inside a calm, distraction-free exam room that autosaves in real time—even when internet drops—and automatically syncs completed scripts once reconnected.",
          },
          {
            type: "list",
            leadIn: "Teachers and exam officers keep complete oversight from start to finish:",
            items: [
              "Built-in malpractice control prevents copying, pasting, and switching browser tabs",
              "Minutes-fast automated grading across Multiple Choice, Cloze, and Theory prompts",
              "Clear, constructive automatic feedback personalized to each student's answers",
              "One-click export to clean Excel broadsheets after final teacher approval",
            ],
          },
          {
            type: "paragraph",
            text: "Reclaim your weekends by running your next continuous assessment or terminal exam inside Examinify.",
          },
        ],
        image: "/images/landing/feature-question-generator.jpg",
        visualType: "dashboards",
      },
      {
        id: "new-3",
        slug: "seven-question-formats-and-malpractice-lockdown",
        categoryId: "artisans",
        category: "Schools",
        readTime: "3 mins read",
        title: "Seven Question Formats & Built-In Malpractice Control",
        highlightWords: ["Seven", "Question", "Formats"],
        description:
          "Combine Multiple Choice, Fill in the Blank, Theory, Essay, Mathematics, Case Study, and Diagram prompts inside one tamper-proof exam room.",
        fullStory: [
          "Modern school assessments go far beyond simple A–D bubbles. Examinify supports seven rich question formats out of the box: Multiple Choice, Fill in the Blank, Theory, Essay, Mathematics, Case Study, and Diagram items.",
          "Every paper runs inside a distraction-free, timed, autosaving workspace where copying, pasting, and tab switching are strictly blocked.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Whether you're setting a Primary 5 comprehension passage, a JSS 2 math quiz, or an SSS 3 biology diagram exam, Examinify handles all seven assessment formats seamlessly in one place.",
          },
          {
            type: "list",
            leadIn: "Every school examination on Examinify supports:",
            items: [
              "Multiple Choice & Fill in the Blank (Cloze) with instant auto-scoring",
              "Structured Theory & Long-Form Essay prompts graded rapidly with AI rubric support",
              "Mathematics equations, Case Studies, and Labeled Diagrams embedded cleanly",
              "Copy-paste blocking and tab-switch prevention active on every candidate screen",
            ],
          },
          {
            type: "paragraph",
            text: "After students submit, teachers review AI-assisted grades across hundreds of scripts in minutes, fine-tune any marks, and release personalized answer feedback alongside downloadable broadsheets.",
          },
          {
            type: "paragraph",
            text: "Organize your school's termly question bank once on Examinify and reuse it effortlessly every session.",
          },
        ],
        image: "/images/landing/question-types-showcase.jpg",
        visualType: "emblem",
      },
      {
        id: "new-4",
        slug: "free-1st-ca-pilot-for-nigerian-schools",
        categoryId: "offers",
        category: "Offers",
        readTime: "2 mins read",
        title: "Free 1st CA Pilot Before Full School Handover",
        highlightWords: ["Free", "1st", "CA"],
        description:
          "Test Examinify live with your pupils or secondary students this term, then step into a CBT customized just for your school with full software ownership.",
        fullStory: [
          "Transitioning from paper exams to digital CBT shouldn't feel risky. That's why Examinify guides Nigerian primary and secondary schools through a complimentary 1st CA pilot for up to 200 students before full software handover.",
          "Our onboarding team sets up your school's dedicated instance, uploads class lists, formats test questions, and supports a smooth first CBT session.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Switching from paper booklets to computer-based testing is easiest when your staff can test it live on a real continuous assessment — and our Free 1st CA Pilot makes that possible.",
          },
          {
            type: "list",
            leadIn: "Every school in the 1st CA Pilot receives:",
            items: [
              "Full CBT access for up to 200 primary or secondary students",
              "Guided upload of your 1st CA objective and theory questions",
              "Live remote support during your scheduled exam window",
              "Exportable class broadsheets and student score slips",
            ],
          },
          {
            type: "paragraph",
            text: "Whether your school uses 15 shared ICT lab desktops in batches or individual tablets, Examinify automatically manages timed cohorts so every class completes seamlessly.",
          },
          {
            type: "list",
            leadIn: "How to claim your school's pilot slot:",
            items: [
              "Book a 15-minute school walkthrough with our team",
              "Share one sample class list and 1st CA subject test",
              "Launch your pilot session with pupils or JSS/SSS students",
              "Review instant broadsheet results with your leadership team",
            ],
          },
          {
            type: "paragraph",
            text: "Experience how fast termly continuous assessments become when teachers never have to mark objective scripts by hand again.",
          },
        ],
        visualType: "referral",
      },
      {
        id: "new-5",
        slug: "introducing-power-drop-sync-and-tab-lock",
        categoryId: "product-update",
        category: "Product Update",
        readTime: "3 mins read",
        title: "Offline-Ready Exams, Auto-Sync & Full Ownership",
        highlightWords: ["Auto-Sync", "Ownership"],
        description:
          "Test smoothly on weak or unavailable internet, sync completed scripts online later, and enjoy a CBT personalized for your school where you own the entire software.",
        fullStory: [
          "Examinify is engineered for real-world school connectivity: students take tests and exams smoothly through poor, patchy, or dropped internet while answers save safely and sync online later.",
          "Your school also receives a CBT personalized and customized just for your campus—with your school owning the entire software—protected by instant exam resumption, browser lockdown, question randomization, and strict time limits.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Running digital exams in Nigeria requires software engineered for real school conditions — which is why Examinify pairs Power-Drop Sync with Tab-Switch Guard.",
          },
          {
            type: "list",
            leadIn: "With Power-Drop Sync, your exam hall stays calm because:",
            items: [
              "Every answer is cached locally the moment a student clicks an option",
              "Brief internet dips never kick students out of their active test",
              "If a desktop restarts, the student logs back in and resumes right where they stopped",
              "Completed scripts sync automatically as soon as connectivity returns",
            ],
          },
          {
            type: "paragraph",
            text: "While resilience keeps honest students stress-free, Exam Integrity controls give teachers and invigilators full confidence in every score.",
          },
          {
            type: "list",
            leadIn: "Tab-Switch Guard & Shuffling protect every assessment with:",
            items: [
              "Unique randomized question and option order for adjacent seats",
              "Real-time invigilator alerts when a candidate exits full-screen",
              "One-click pause, extend-time, or force-submit controls per student",
              "Complete timestamped audit log of every exam attempt",
            ],
          },
          {
            type: "paragraph",
            text: "Run high-stakes termly exams with total peace of mind on Examinify.",
          },
        ],
        visualType: "tracking",
      },
      {
        id: "new-6",
        slug: "how-crescent-heights-automated-termly-broadsheets",
        categoryId: "artisans",
        category: "Schools",
        readTime: "4 mins read",
        title: "How Crescent Heights Automated Termly Broadsheets",
        highlightWords: ["Crescent", "Broadsheets"],
        description:
          "From two weeks of manual script marking to 10-minute termly broadsheets across 650 students—see how one Abuja school transformed exam week.",
        fullStory: [
          "Before Examinify, Crescent Heights Academy spent thousands on paper printing every term and waited over ten days after exams for teachers to tally 1st CA, 2nd CA, and exam scores.",
          "Within one term on Examinify, all Primary 4–6 and JSS 1–SSS 3 objective assessments moved to scheduled ICT lab batches—cutting grading time by 90% and producing error-free broadsheets.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Two terms ago, Crescent Heights Academy in Abuja spent days printing exam scripts and chasing late score sheets before vacation — today, their entire termly broadsheet is ready within minutes of the final paper.",
          },
          {
            type: "list",
            leadIn: "Moving continuous assessments and exams to Examinify delivered:",
            items: [
              "90% reduction in teacher marking and score-entry hours",
              "Zero arithmetic errors across 1st CA (20%), 2nd CA (20%), and Exam (60%)",
              "Smooth 30-seat ICT lab rotation across 650 primary and secondary students",
              "Over ₦450,000 saved per term on paper, ink, and stapling",
            ],
          },
          {
            type: "paragraph",
            text: "Teachers upload questions a week ahead for HOD approval, while the exam officer generates unique session PINs for each class arm on exam morning.",
          },
          {
            type: "list",
            leadIn: "With Examinify's school admin dashboard, leadership now:",
            items: [
              "Monitors live exam attendance and submission progress by class",
              "Reviews item difficulty to see which topics students struggled with",
              "Exports formatted broadsheets straight into their report card workflow",
              "Builds a permanent, reusable school question archive every term",
            ],
          },
          {
            type: "paragraph",
            text: "Whether your school teaches 150 primary pupils or 2,000 secondary students, Examinify makes termly assessments fast, fair, and effortless.",
          },
        ],
        visualType: "business",
      },
    ] satisfies WhatsNewItem[],
  },
  joinYourWay: {
    headline: "Join Examinify Your Way.",
    subtitle:
      "Whether you're taking exams on unstable internet, reviewing student scripts, or owning the entire CBT platform for your school, Examinify is built for you.",
    items: [
      {
        id: "join-customers",
        title: "For Students",
        description:
          "Take tests smoothly even on poor or lost internet, answer faster with keyboard shortcuts, and pick up right where you stopped after any power or network drop.",
        ctaLabel: "Try CBT Demo",
        ctaVariant: "primary",
        ctaHref: "#download",
        image: "/images/landing/audience-student.svg",
        slabTone: "blue",
      },
      {
        id: "join-artisans",
        title: "For Teachers & Exam Officers",
        description:
          "Create unlimited classes and subjects, activate exams on demand, review full student answer scripts, and run detailed performance analysis inside a CBT tailored to your school.",
        ctaLabel: "Learn More",
        ctaVariant: "secondary",
        ctaHref: "/schools",
        image: "/images/landing/audience-teacher.svg",
        slabTone: "ink",
      },
      {
        id: "join-businesses",
        title: "For Schools & Proprietors",
        description:
          "Get a CBT personalized and customized just for your school—with your school owning the entire software—while running exams seamlessly on any connection with automatic online sync.",
        ctaLabel: "Book a Demo",
        ctaVariant: "secondary",
        ctaHref: "#download",
        image: "/images/landing/audience-school.svg",
        slabTone: "sapphire",
      },
    ] satisfies AudienceItem[],
  },
  artisanPage: {
    hero: {
      headlineLine1: "Great Teaching Deserves",
      headlineLine2: "Smarter Exams.",
      subtitle:
        "Why juggle disconnected platforms when one dependable system turns lesson notes into questions in seconds, blocks copy-paste and tab switching, grades hundreds of scripts in minutes, and stays 100% owned by your school?",
      primaryCta: "Reclaim Your Time",
      secondaryCta: "See 5-Step Flow",
    },
    howItWorks: {
      eyebrow: "Five Steps. Zero Guesswork.",
      headline: "How Examinify Works",
      subtitle:
        "Scroll through a streamlined five-step workflow that saves hours at every stage—from generating exam items and organizing learner cohorts to reviewing AI-assisted scores in one place.",
      steps: [
        {
          id: "step-01",
          stepNumber: "01",
          title: "Craft Your Examination",
          description:
            "Build your own questions or convert lesson notes into ready-to-edit exam items in seconds using AI.",
          image: "/images/landing/step-01-create-exam.svg",
          illustrationType: "store",
        },
        {
          id: "step-02",
          stepNumber: "02",
          title: "Group Your Learners",
          description:
            "Organize students into classes, arms, or exam cohorts so every candidate is prepared before test time.",
          image: "/images/landing/step-02-student-group.svg",
          illustrationType: "dispatch",
        },
        {
          id: "step-03",
          stepNumber: "03",
          title: "Publish & Share Access",
          description:
            "Take the examination live and distribute access to your learners from one tidy, distraction-free workspace.",
          image: "/images/landing/step-03-publish-exam.svg",
          illustrationType: "dispatch",
        },
        {
          id: "step-04",
          stepNumber: "04",
          title: "Review & Approve Marks",
          description:
            "Inspect AI-graded scripts across multiple choice, cloze, and theory, adjust marks if needed, and approve.",
          image: "/images/landing/step-04-review-approve.svg",
          illustrationType: "orders",
        },
        {
          id: "step-05",
          stepNumber: "05",
          title: "Export & Share Feedback",
          description:
            "Download structured broadsheets and share personalized, helpful answer feedback whenever you are ready.",
          image: "/images/landing/step-05-export-share.svg",
          illustrationType: "orders",
        },
      ] satisfies HowItWorksStepItem[],
      perks: [
        {
          id: "perk-onboarding",
          label: "AI Lesson-to-Exam Generation",
          iconType: "onboarding",
        },
        {
          id: "perk-dashboard",
          label: "Copy-Paste & Tab-Switch Lock",
          iconType: "dashboard",
        },
        {
          id: "perk-support",
          label: "Review & Adjust Before Export",
          iconType: "support",
        },
      ] satisfies HowItWorksPerkItem[],
      ctaLabel: "Reclaim Your Time",
      ctaHref: "/login",
    },
    coverage: {
      badge: "7 Question Formats · Unlimited Classes",
      headline: "One Unified Platform for Every Class",
      highlightWords: ["Unified", "Platform"],
      subtitle:
        "From Primary 1–6 to JSS 1–SSS 3, Examinify replaces fragmented tools with one reliable, school-owned system—supporting multiple choice, fill-in-the-blank, theory, essay, mathematics, case studies, and diagrams.",
    },
    faqs: {
      headline: "Got Questions ?",
      subtitle:
        "Everything school proprietors, principals, and teachers need to know about AI question generation, malpractice control, auto-grading, and full software ownership.",
      moreCta: "See More",
      items: [
        {
          id: "artisan-faq-1",
          question: "How fast can teachers turn lesson notes into exam questions?",
          answer:
            "In seconds! Upload or paste your lesson notes into the Smart Question Studio to generate structured multiple choice, fill-in-the-gap, theory, or essay items—then edit and customize every question freely.",
        },
        {
          id: "artisan-faq-2",
          question: "How does Examinify prevent exam malpractice during live tests?",
          answer:
            "Anti-Malpractice Lockdown blocks copying, pasting, and tab switching while an examination is underway, paired with randomized question order and timed, autosaving distraction-free test rooms.",
        },
        {
          id: "artisan-faq-3",
          question: "Which question formats and grading modes are supported?",
          answer:
            "Create Multiple Choice, Fill in the Blank (Cloze), Theory, Essay, Mathematics, Case Study, and Diagram questions. Hundreds of scripts are graded automatically in minutes, and teachers can review and adjust scores before sharing.",
        },
        {
          id: "artisan-faq-4",
          question: "Do students receive personalized feedback on their answers?",
          answer:
            "Yes! Once results are approved, each learner receives clear, constructive automatic feedback tailored specifically to their answers—highlighting strengths and areas to improve.",
        },
        {
          id: "artisan-faq-5",
          question: "Does Examinify still work if internet drops mid-exam, and do we own the software?",
          answer:
            "Yes! Timed exams autosave continuously even on weak or lost internet and sync online once reconnected. Best of all, your CBT is customized for your school with full software ownership.",
        },
      ] satisfies FaqItemData[],
    },
  },
  faqsPage: {
    headline: "Got Questions ?",
    highlightWords: ["Questions"],
    subtitle:
      "Everything students, teachers, and schools need to know about our unified exam platform, AI question generation, malpractice control, and automated grading.",
    categories: [
      {
        id: "customers",
        label: "For Students & Parents",
        items: [
          {
            id: "cust-faq-1",
            question: "What is Examinify?",
            answer:
              "Examinify is an all-in-one, offline-resilient Computer-Based Testing (CBT) platform built for schools—combining AI question creation, distraction-free timed exams, anti-malpractice protection, and personalized feedback in one reliable system.",
          },
          {
            id: "cust-faq-2",
            question: "What kind of feedback do students receive after an exam?",
            answer:
              "When teachers release results, each student receives clear, helpful automatic feedback personalized to their exact answers—making it easy to understand mistakes and improve faster.",
          },
          {
            id: "cust-faq-3",
            question: "What does the distraction-free exam environment feel like?",
            answer:
              "Students work inside a clean, standard timed exam room that autosaves every answer in real time—with zero pop-ups or distractions, and full keyboard navigation support.",
          },
          {
            id: "cust-faq-4",
            question: "Can students take exams when internet is poor or unavailable?",
            answer:
              "Yes! Students can take tests smoothly with slow, intermittent, or no internet on lab desktops, laptops, Chromebooks, or tablets. Answers save safely and sync online once connectivity returns.",
          },
          {
            id: "cust-faq-5",
            question: "What happens if power or internet drops mid-exam?",
            answer:
              "Examinify's Exam Resumption automatically preserves every selected answer and remaining time, so students resume right where they stopped and sync completed scripts online later.",
          },
          {
            id: "cust-faq-6",
            question: "Can students review their answers before submitting?",
            answer:
              "Yes! A clear question palette shows answered, unanswered, and flagged questions so students can jump back and review before final submission.",
          },
          {
            id: "cust-faq-7",
            question: "Do students see their scores immediately?",
            answer:
              "Teachers stay in full control. Your school can show instant scores and personalized feedback upon submission or review and adjust marks first before sharing.",
          },
          {
            id: "cust-faq-8",
            question: "Which question formats will students see during tests?",
            answer:
              "Depending on the subject, exams can include Multiple Choice, Fill in the Blank (Cloze), Structured Theory, Essay, Mathematics equations, Case Studies, and Labeled Diagrams.",
          },
        ],
      },
      {
        id: "artisans",
        label: "For Teachers",
        items: [
          {
            id: "pro-faq-1",
            question: "How does the Smart Question Studio turn lesson notes into exams?",
            answer:
              "Paste or upload your lesson notes and generate ready-made exam questions in seconds. You can edit wording, adjust marks, and customize every question before publishing.",
          },
          {
            id: "pro-faq-2",
            question: "Which question types can teachers include in a single exam?",
            answer:
              "All seven core formats are built right in: Multiple Choice, Fill in the Blank, Theory, Essay, Mathematics, Case Study, and Diagram questions.",
          },
          {
            id: "pro-faq-3",
            question: "How fast is automatic grading across objective and theory scripts?",
            answer:
              "Hundreds of scripts across multiple choice, cloze (fill-in-the-gap), and written theory questions are graded in minutes—and you can always review and fine-tune marks before approving.",
          },
          {
            id: "pro-faq-4",
            question: "How does Examinify prevent copying, pasting, and tab switching?",
            answer:
              "Anti-Malpractice Lockdown disables copy-paste actions and blocks tab switching while an examination is live, paired with seat-by-seat question shuffling and strict countdown timers.",
          },
          {
            id: "pro-faq-5",
            question: "Can teachers review and adjust scores before exporting results?",
            answer:
              "Yes! Step 04 of our workflow lets you inspect AI-graded responses, make final mark adjustments, approve results, and then export organized broadsheets in one click.",
          },
          {
            id: "pro-faq-6",
            question: "Can teachers reuse last session's exam questions?",
            answer:
              "Absolutely. All questions remain safely stored in your customized, school-owned CBT software so teachers can pick, edit, and reuse vetted items every term.",
          },
        ],
      },
      {
        id: "businesses",
        label: "For Schools",
        items: [
          {
            id: "biz-faq-1",
            question: "Why use Examinify instead of separate tools for creation, testing, and grading?",
            answer:
              "Examinify brings lesson-to-question AI generation, student group management, malpractice-locked exam delivery, automatic grading, personalized feedback, and broadsheet exports into one reliable, school-owned platform.",
          },
          {
            id: "biz-faq-2",
            question: "Is our CBT personalized for our school, and do we really own the entire software?",
            answer:
              "Yes! Your school receives a CBT personalized and customized just for your school, and your school owns the entire software—giving you permanent control with no vendor lock-in.",
          },
          {
            id: "biz-faq-3",
            question: "How does the 5-step exam workflow save staff hours every term?",
            answer:
              "Teachers simply (01) create or AI-generate an exam, (02) organize student groups, (03) publish live access, (04) review and approve AI-graded scores, and (05) export organized results with personalized feedback.",
          },
          {
            id: "biz-faq-4",
            question: "Can we manage unlimited classes, arms, and subjects?",
            answer:
              "Yes! Create unlimited classes across Primary 1–6, JSS 1–3, and SSS 1–3 with unlimited subjects and question banks from one unified admin dashboard.",
          },
          {
            id: "biz-faq-5",
            question: "How are broadsheets and performance insights exported?",
            answer:
              "Download organized Excel/CSV broadsheets per class or subject anytime after final review and approval, alongside question-level performance analytics.",
          },
          {
            id: "biz-faq-6",
            question: "How does Examinify work when our internet is poor or down?",
            answer:
              "Timed exams autosave continuously even with weak, patchy, or no internet and sync completed scripts online automatically once connectivity returns.",
          },
          {
            id: "biz-faq-7",
            question: "How secure is the exam environment?",
            answer:
              "Examinify blocks copy-paste and tab switching, enforces browser lockdown and question randomization, and gives admins one-click exam activation control.",
          },
        ],
      },
    ] satisfies FaqCategoryTab[],
  },
  faqs: {
    headline: "Got Questions ?",
    subtitle:
      "Everything schools need to know about our all-in-one exam workflow, malpractice control, automated grading, and owning the complete platform.",
    moreCta: "See More",
    items: [
      {
        id: "faq-1",
        question: "How quickly can teachers generate exam questions from lesson notes?",
        answer:
          "Our Smart Question Studio turns lesson notes into ready-to-use Multiple Choice, Cloze, Theory, Essay, Math, Case Study, and Diagram questions in seconds—ready for you to edit and customize.",
      },
      {
        id: "faq-2",
        question: "How does Examinify stop students from copying, pasting, or switching tabs?",
        answer:
          "Built-in Malpractice Control blocks copy-paste shortcuts and tab switching during active examinations, inside a distraction-free, timed, and autosaving test environment.",
      },
      {
        id: "faq-3",
        question: "Does automatic grading cover theory and fill-in-the-gap questions too?",
        answer:
          "Yes! Hundreds of exams across multiple choice, theory, and cloze (fill-in-the-gap) questions are graded in minutes—and teachers can always review and adjust scores before approving or exporting.",
      },
      {
        id: "faq-4",
        question: "Do students get automatic feedback, and can we export organized results?",
        answer:
          "Yes! Learners receive clear automatic feedback tailored to their answers once approved, while teachers can download clean, organized broadsheets anytime.",
      },
      {
        id: "faq-5",
        question: "Is our CBT customized for our school, and does it work on weak internet?",
        answer:
          "Yes! Your Examinify CBT is personalized for your school with full software ownership, and timed exams autosave seamlessly even when internet drops, syncing online later.",
      },
    ] satisfies FaqItemData[],
  },
  footer: {
    socialLabel: "Follow us on our socials",
    companyLinks: [
      { label: "Home", href: "/" },
      { label: "Exam Hub", href: "/blog" },
      { label: "For Schools", href: "/schools" },
      { label: "Coverage", href: "/#coverage" },
    ],
    quickLinks: [
      { label: "Terms of Service", href: "/faqs" },
      { label: "Privacy Policy", href: "/faqs" },
    ],
    helpDesk: {
      contactLabel: "Contact Us",
      email: "hello@examinify.ng",
      phone1: "+234 800 392 6464",
      phone2: "+234 913 000 9099",
    },
    wordmark: "Examinify",
  },
} as const;

export function getBlogArticleBySlug(slugOrId?: string): WhatsNewItem {
  const { items, detail } = landingContent.blogPage;
  const fallback =
    items.find((item) => item.id === detail.defaultArticleId) ?? items[0];

  if (!slugOrId) {
    return fallback;
  }

  const normalized = decodeURIComponent(slugOrId).trim().toLowerCase();
  const match = items.find(
    (item) =>
      item.slug.toLowerCase() === normalized ||
      item.id.toLowerCase() === normalized
  );

  return match ?? fallback;
}

export function getRelatedBlogArticles(
  currentId: string,
  count = 2
): WhatsNewItem[] {
  const { items } = landingContent.blogPage;
  return items.filter((item) => item.id !== currentId).slice(0, count);
}

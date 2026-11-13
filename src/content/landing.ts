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
  stepNumber: "01" | "02" | "03";
  title: string;
  description: string;
  illustrationType: "store" | "dispatch" | "orders";
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
    eyebrow: "Offline-Ready + Online Sync · 100% School Owned · Nigerian Schools",
    headlineLine1: "Go Paperless.",
    headlineLine2: "Grade Exams in Seconds.",
    subtitle:
      "Run smooth computer-based exams across Primary 1–6 and JSS 1–SSS 3—even when internet drops—and sync results online anytime. Plus, it's CBT personalized and customized just for your school, with your school owning the entire software.",
    primaryCta: "Book a School Demo",
    secondaryCta: "Explore CBT Portal",
    marqueeCards: [
      {
        id: "ac-refill",
        title: "Mathematics 1st Term CBT",
        provider: "JSS 1–3 · Objective & Theory",
        area: "Lagos",
        fromFee: "Instant Broadsheet",
        rating: "4.9",
        reviews: 210,
        eta: "45 Min",
        badgeText: "Auto-Graded",
        image: "/images/landing/cbt-maths.jpg",
        tiltDeg: -4,
      },
      {
        id: "pipe-leak",
        title: "English Language 2nd CA",
        provider: "Primary 4–6 · Comprehension",
        area: "Abuja",
        fromFee: "Zero Paper Printing",
        rating: "4.8",
        reviews: 185,
        eta: "30 Min",
        badgeText: "Auto-Graded",
        image: "/images/landing/cbt-primary.svg",
        tiltDeg: 3.5,
      },
      {
        id: "carpentry-doors",
        title: "Basic Science & Tech Exam",
        provider: "JSS 1–3 · NERDC Aligned",
        area: "Ibadan",
        fromFee: "Question Shuffling",
        rating: "4.9",
        reviews: 164,
        eta: "40 Min",
        badgeText: "Auto-Graded",
        image: "/images/landing/cbt-termly-exams.svg",
        tiltDeg: -3,
      },
      {
        id: "inverter-solar",
        title: "Physics & Chemistry Mock",
        provider: "SSS 1–3 · WAEC-Style CBT",
        area: "Port Harcourt",
        fromFee: "Auto-Submit Timer",
        rating: "4.8",
        reviews: 192,
        eta: "60 Min",
        badgeText: "Auto-Graded",
        image: "/images/landing/cbt-security.svg",
        tiltDeg: 4,
      },
      {
        id: "deep-clean",
        title: "Quantitative & Verbal CA",
        provider: "Primary 1–6 · Timed Quiz",
        area: "Enugu",
        fromFee: "Audio & Image Prompts",
        rating: "4.9",
        reviews: 240,
        eta: "25 Min",
        badgeText: "Auto-Graded",
        image: "/images/landing/cbt-secondary.svg",
        tiltDeg: -3.5,
      },
      {
        id: "tv-mounting",
        title: "Civic & Social Studies CBT",
        provider: "Primary & JSS · 1st CA",
        area: "Kano",
        fromFee: "Instant Parent Slip",
        rating: "4.7",
        reviews: 150,
        eta: "30 Min",
        badgeText: "Auto-Graded",
        image: "/images/landing/cbt-broadsheets.svg",
        tiltDeg: 3,
      },
    ] satisfies ArtisanMarqueeItem[],
  },
  appShowcase: {
    headline: "Reliable CBT For Every School",
    subtitle:
      "Students take tests smoothly even on weak or lost internet and sync online once reconnected. Built as a CBT personalized and customized just for your school, with your school owning the entire software.",
    primaryCta: "Book a School Demo",
    secondaryCta: "Try Student CBT",
    promoLine: "Built to work through unstable connections, sync online later, and stay 100% yours.",
    notifications: [
      {
        id: "notif-1",
        title: "Offline-Ready + Auto-Sync",
        subtitle: "JSS 2 Maths · Saves locally, syncs online.",
        tone: "blue",
        iconType: "scooter",
        position: "top-left",
        tiltDeg: -5,
      },
      {
        id: "notif-2",
        title: "Instant Exam Resumption",
        subtitle: "Power or network cut? Resume where you stopped.",
        tone: "ink",
        iconType: "gift",
        position: "bottom-left",
        tiltDeg: 2,
      },
      {
        id: "notif-3",
        title: "Browser Lockdown Active",
        subtitle: "Shuffled questions & strict time limits on.",
        tone: "ink",
        iconType: "check",
        position: "top-right",
        tiltDeg: -3,
      },
      {
        id: "notif-4",
        title: "100% School Owned",
        subtitle: "Tailored for your school · Full software ownership",
        tone: "sapphire",
        iconType: "tag",
        position: "bottom-right",
        tiltDeg: 4,
      },
    ] satisfies FloatingNotificationItem[],
  },
  services: {
    eyebrow: "Works Anywhere · 100% Yours",
    headline: "Powerful CBT Features You Own",
    subtitle:
      "Everything your school needs to run exams smoothly on any connection, sync results online seamlessly, and own your entire assessment platform.",
    items: [
      {
        id: "cat-ac",
        title: "Offline-Ready & Online Sync",
        description:
          "Students take tests seamlessly even with weak, patchy, or unavailable internet. Answers save safely and sync online once connectivity returns.",
        startingPrice: "Auto-Sync",
        etaBadge: "Any Connection",
        image: "/images/landing/cbt-maths.jpg",
        popularTags: ["Low-Bandwidth Ready", "Offline Resilience", "Cloud Sync"],
      },
      {
        id: "cat-carpentry",
        title: "Exam Resumption & Control",
        description:
          "Students resume exams right where they stopped after power or network drops, while admins activate tests and control access.",
        startingPrice: "Auto-Resume",
        etaBadge: "Live Control",
        image: "/images/landing/cbt-termly-exams.svg",
        popularTags: ["Power-Drop Safe", "Exam Activation", "Student Access"],
      },
      {
        id: "cat-plumbing",
        title: "Personalized & School-Owned",
        description:
          "No vendor lock-in. Get a CBT personalized and customized just for your school—supporting unlimited classes across Primary 1–6 and JSS 1–SSS 3, with your school owning the entire software.",
        startingPrice: "100% Yours",
        etaBadge: "Custom & Owned",
        image: "/images/landing/cbt-primary.svg",
        popularTags: ["Tailored for Your School", "Full Software Ownership", "Unlimited Scale"],
      },
      {
        id: "cat-cleaning",
        title: "View Student Scripts",
        description:
          "Administrators and teachers can open, inspect, and review complete student answer scripts for all subjects immediately after exams.",
        startingPrice: "Full Scripts",
        etaBadge: "Post-Exam Audit",
        image: "/images/landing/cbt-secondary.svg",
        popularTags: ["Script Review", "Answer Audit", "All Subjects"],
      },
      {
        id: "cat-electronics",
        title: "Performance Analysis",
        description:
          "Detailed performance analytics, instant broadsheets, and question analysis to identify each student's strengths and weaknesses.",
        startingPrice: "Deep Insights",
        etaBadge: "Instant Grades",
        image: "/images/landing/cbt-broadsheets.svg",
        popularTags: ["Question Analysis", "Strengths & Gaps", "Broadsheets"],
      },
      {
        id: "cat-electrical",
        title: "Secure Environment",
        description:
          "Prevent cheating with browser lockdown, per-student question randomization, keyboard navigation, and strict automatic time limits.",
        startingPrice: "Anti-Cheat",
        etaBadge: "Tamper Proof",
        image: "/images/landing/cbt-security.svg",
        popularTags: ["Browser Lockdown", "Randomization", "Time Limits"],
      },
    ] satisfies ServiceCategoryItem[],
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
    primaryCta: "Book a School Demo",
    secondaryCta: "Explore CBT Portal",
    promoLine: "Test smoothly even with unstable or lost internet, sync online anytime, and own the full system.",
    chips: [
      "Offline-Ready & Online Sync",
      "Personalized & School-Owned",
      "Exam Resumption",
      "View Student Scripts",
      "Unlimited Classes & Subjects",
      "Performance Analysis",
      "Keyboard Navigation",
      "Exam Activation Control",
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
        slug: "the-all-new-examinify-cbt-engine",
        categoryId: "product-update",
        category: "Product Update",
        readTime: "2 mins read",
        title: "The All-New Hybrid CBT Engine",
        highlightWords: ["All-New", "Hybrid"],
        description:
          "Test smoothly on weak, unstable, or no internet and sync online automatically later—with a CBT personalized for your school and full software ownership.",
        fullStory: [
          "We engineered Examinify so students can take tests and exams even when internet is slow, unstable, or temporarily out—saving answers safely and syncing online once connectivity returns.",
          "Plus, Examinify delivers a CBT personalized and customized just for your school—with your school owning the entire software—paired with instant exam resumption, keyboard navigation, browser lockdown, and post-exam script analytics.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Setting, invigilating, and grading termly continuous assessments should be fast, calm, and reliable — and that's exactly what the new Examinify CBT engine delivers.",
          },
          {
            type: "list",
            leadIn: "We've upgraded the exam portal to make it:",
            items: [
              "Faster for pupils in Primary 1–6 and students in JSS 1–SSS 3",
              "Resilient during brief Wi-Fi or power interruptions",
              "Easier for teachers to upload equations, diagrams, and passages",
              "Clearer for exam officers tracking live submissions",
            ],
          },
          {
            type: "paragraph",
            text: "The updated experience makes scheduling termly exams across multiple arms effortless. Whether you're running a 20-minute 1st CA test in Primary 5 or a 90-minute SSS 3 mock exam, every second is accounted for.",
          },
          {
            type: "list",
            leadIn: "Behind the scenes, Examinify is optimized for:",
            items: [
              "Auto-saving every clicked answer locally in real time",
              "Instant countdown sync and automatic submission at time-up",
              "Tab-switch alerts and randomized question order per seat",
              "One-click export to Excel broadsheets and PDF report slips",
            ],
          },
          {
            type: "list",
            leadIn: "That means with Examinify your school can:",
            items: [
              "Grade hundreds of objective scripts in under 2 seconds",
              "Combine 1st CA, 2nd CA, and exam scores automatically",
              "Spot struggling topics with item-by-item analytics",
              "Share verified results with parents without delays",
            ],
          },
          {
            type: "paragraph",
            text: "New features like bulk Word/Excel question import, rich math notation, and offline-resilient online sync mean your ICT lab runs smoothly even on modest or patchy internet—inside a platform your school owns completely.",
          },
          {
            type: "paragraph",
            text: "Try the new Examinify CBT experience today and give your teachers their weekends back.",
          },
        ],
        visualType: "dashboards",
      },
      {
        id: "new-3",
        slug: "nerdc-aligned-termly-cbt-question-banks",
        categoryId: "artisans",
        category: "Schools",
        readTime: "3 mins read",
        title: "NERDC-Aligned Question Banks Now on Examinify",
        highlightWords: ["Question", "Banks"],
        description:
          "Access structured termly assessment templates across Mathematics, English, Basic Science, Civic Education, and senior secondary subjects...",
        fullStory: [
          "We are excited to roll out curated, NERDC-aligned CBT question bank templates for Nigerian Primary 1–6, JSS 1–3, and SSS 1–3 classes—covering 1st, 2nd, and 3rd term schemes of work.",
          "Teachers can adopt ready-made items, customize questions to match their classroom notes, and reuse vetted termly banks year after year.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Building fresh test items from scratch every mid-term shouldn't exhaust teachers — and with NERDC-aligned question banks now on Examinify, quality termly assessments are ready in minutes.",
          },
          {
            type: "list",
            leadIn: "Every school question bank on Examinify supports:",
            items: [
              "Primary 1–6 core subjects including Numeracy, Literacy, and Verbal Reasoning",
              "JSS 1–3 Basic Science, Social Studies, Business Studies, and Civic Education",
              "SSS 1–3 Science, Commercial, and Arts subjects with diagram support",
              "Topic tagging by 1st, 2nd, and 3rd Term scheme of work",
            ],
          },
          {
            type: "paragraph",
            text: "Teachers can either start from school-owned question banks or adapt structured templates to match exact lesson notes before publishing a 1st CA, 2nd CA, or terminal exam.",
          },
          {
            type: "list",
            leadIn: "Exam officers get full oversight before any test goes live:",
            items: [
              "Head of Department review and approval workflow",
              "Difficulty balance checks across objective and theory sections",
              "Automatic shuffling of question numbers and A–D options",
              "Reusable archived exams across academic sessions",
            ],
          },
          {
            type: "list",
            leadIn: "When your school runs CBT on Examinify, you get:",
            items: [
              "Consistent academic standards across all class arms",
              "Zero leaked papers or photocopier bottlenecks",
              "Instant score breakdown per topic and per student",
              "Seamless term-end broadsheets ready for report cards",
            ],
          },
          {
            type: "paragraph",
            text: "Organize your school's termly question bank once on Examinify and reuse it effortlessly every session.",
          },
          {
            type: "paragraph",
            text: "Book a walkthrough with our team to see how Nigerian schools set up an entire term's CBT calendar in one afternoon.",
          },
        ],
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
        slug: "the-all-new-examinify-cbt-engine",
        categoryId: "product-update",
        category: "Product Update",
        readTime: "2 mins read",
        title: "The All-New Hybrid CBT Engine",
        highlightWords: ["All-New", "Hybrid"],
        description:
          "Test smoothly on weak, unstable, or no internet and sync online automatically later—with a CBT personalized for your school and full software ownership.",
        fullStory: [
          "We engineered Examinify so students can take tests and exams even when internet is slow, unstable, or temporarily out—saving answers safely and syncing online once connectivity returns.",
          "Plus, Examinify delivers a CBT personalized and customized just for your school—with your school owning the entire software—paired with instant exam resumption, keyboard navigation, browser lockdown, and post-exam script analytics.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Setting, invigilating, and grading termly continuous assessments should be fast, calm, and reliable — and that's exactly what the new Examinify CBT engine delivers.",
          },
          {
            type: "list",
            leadIn: "We've upgraded the exam portal to make it:",
            items: [
              "Faster for pupils in Primary 1–6 and students in JSS 1–SSS 3",
              "Resilient during brief Wi-Fi or power interruptions",
              "Easier for teachers to upload equations, diagrams, and passages",
              "Clearer for exam officers tracking live submissions",
            ],
          },
          {
            type: "paragraph",
            text: "The updated experience makes scheduling termly exams across multiple arms effortless. Whether you're running a 20-minute 1st CA test in Primary 5 or a 90-minute SSS 3 mock exam, every second is accounted for.",
          },
          {
            type: "list",
            leadIn: "Behind the scenes, Examinify is optimized for:",
            items: [
              "Auto-saving every clicked answer locally in real time",
              "Instant countdown sync and automatic submission at time-up",
              "Tab-switch alerts and randomized question order per seat",
              "One-click export to Excel broadsheets and PDF report slips",
            ],
          },
          {
            type: "list",
            leadIn: "That means with Examinify your school can:",
            items: [
              "Grade hundreds of objective scripts in under 2 seconds",
              "Combine 1st CA, 2nd CA, and exam scores automatically",
              "Spot struggling topics with item-by-item analytics",
              "Share verified results with parents without delays",
            ],
          },
          {
            type: "paragraph",
            text: "New features like bulk Word/Excel question import, rich math notation, and offline-resilient online sync mean your ICT lab runs smoothly even on modest or patchy internet—inside a platform your school owns completely.",
          },
          {
            type: "paragraph",
            text: "Try the new Examinify CBT experience today and give your teachers their weekends back.",
          },
        ],
        visualType: "dashboards",
      },
      {
        id: "new-3",
        slug: "nerdc-aligned-termly-cbt-question-banks",
        categoryId: "artisans",
        category: "Schools",
        readTime: "3 mins read",
        title: "NERDC-Aligned Question Banks Now on Examinify",
        highlightWords: ["Question", "Banks"],
        description:
          "Access structured termly assessment templates across Mathematics, English, Basic Science, Civic Education, and senior secondary subjects...",
        fullStory: [
          "We are excited to roll out curated, NERDC-aligned CBT question bank templates for Nigerian Primary 1–6, JSS 1–3, and SSS 1–3 classes—covering 1st, 2nd, and 3rd term schemes of work.",
          "Teachers can adopt ready-made items, customize questions to match their classroom notes, and reuse vetted termly banks year after year.",
        ],
        bodyBlocks: [
          {
            type: "paragraph",
            text: "Building fresh test items from scratch every mid-term shouldn't exhaust teachers — and with NERDC-aligned question banks now on Examinify, quality termly assessments are ready in minutes.",
          },
          {
            type: "list",
            leadIn: "Every school question bank on Examinify supports:",
            items: [
              "Primary 1–6 core subjects including Numeracy, Literacy, and Verbal Reasoning",
              "JSS 1–3 Basic Science, Social Studies, Business Studies, and Civic Education",
              "SSS 1–3 Science, Commercial, and Arts subjects with diagram support",
              "Topic tagging by 1st, 2nd, and 3rd Term scheme of work",
            ],
          },
          {
            type: "paragraph",
            text: "Teachers can either start from school-owned question banks or adapt structured templates to match exact lesson notes before publishing a 1st CA, 2nd CA, or terminal exam.",
          },
          {
            type: "list",
            leadIn: "Exam officers get full oversight before any test goes live:",
            items: [
              "Head of Department review and approval workflow",
              "Difficulty balance checks across objective and theory sections",
              "Automatic shuffling of question numbers and A–D options",
              "Reusable archived exams across academic sessions",
            ],
          },
          {
            type: "list",
            leadIn: "When your school runs CBT on Examinify, you get:",
            items: [
              "Consistent academic standards across all class arms",
              "Zero leaked papers or photocopier bottlenecks",
              "Instant score breakdown per topic and per student",
              "Seamless term-end broadsheets ready for report cards",
            ],
          },
          {
            type: "paragraph",
            text: "Organize your school's termly question bank once on Examinify and reuse it effortlessly every session.",
          },
          {
            type: "paragraph",
            text: "Book a walkthrough with our team to see how Nigerian schools set up an entire term's CBT calendar in one afternoon.",
          },
        ],
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
        "Run reliable computer-based exams even with weak or no internet, sync results online later, and get a CBT personalized and customized just for your school, with your school owning the entire software.",
      primaryCta: "Book a School Demo",
      secondaryCta: "Explore CBT Portal",
    },
    howItWorks: {
      headline: "How It Works",
      subtitle:
        "Own your complete CBT system, let students test reliably on any connection and sync online later, and inspect full answer scripts right after submission.",
      steps: [
        {
          id: "step-01",
          stepNumber: "01",
          title: "Own Your Full System",
          description:
            "Deploy a CBT personalized and customized just for your school—with your school owning the entire software, unlimited classes, and question banks.",
          illustrationType: "store",
        },
        {
          id: "step-02",
          stepNumber: "02",
          title: "Test Offline, Sync Online",
          description:
            "Activate tests and manage student access. Candidates take exams smoothly even on weak or lost internet, then sync results online when connected.",
          illustrationType: "dispatch",
        },
        {
          id: "step-03",
          stepNumber: "03",
          title: "Scripts & Deep Analytics",
          description:
            "View full student answer scripts after exams, analyze question strengths and weaknesses, and export instant broadsheets.",
          illustrationType: "orders",
        },
      ] satisfies HowItWorksStepItem[],
      perks: [
        {
          id: "perk-onboarding",
          label: "Personalized & School-Owned CBT",
          iconType: "onboarding",
        },
        {
          id: "perk-dashboard",
          label: "Offline-Ready + Online Sync",
          iconType: "dashboard",
        },
        {
          id: "perk-support",
          label: "Power-Drop Exam Resumption",
          iconType: "support",
        },
      ] satisfies HowItWorksPerkItem[],
      ctaLabel: "Onboard Your School",
      ctaHref: "#join",
    },
    coverage: {
      badge: "Unlimited Classes · Primary 1–6 & JSS 1–SSS 3",
      headline: "Assess Every Class Effortlessly",
      highlightWords: ["Every", "Class"],
      subtitle:
        "Examinify adapts to your school's termly calendar—running smoothly through weak or lost internet, syncing online seamlessly, and giving you a CBT customized just for your school with full software ownership.",
    },
    faqs: {
      headline: "Got Questions ?",
      subtitle:
        "Everything school proprietors, principals, and teachers need to know about offline-resilient CBT exams, online sync, and full software ownership.",
      moreCta: "See More",
      items: [
        {
          id: "artisan-faq-1",
          question: "How does Examinify handle weak or no internet during exams?",
          answer:
            "Students can start and complete tests even when internet is slow, unstable, or unavailable. Every answer saves safely and syncs online automatically once a connection returns.",
        },
        {
          id: "artisan-faq-2",
          question: "Is the CBT customized for our school, and do we truly own the entire software?",
          answer:
            "Yes! Examinify is personalized and customized just for your school—matching your school's branding, classes, and workflow—and your school owns the entire software with zero vendor lock-in.",
        },
        {
          id: "artisan-faq-3",
          question: "How do administrators control who takes an exam and when?",
          answer:
            "Exam Activation Control lets administrators activate or deactivate specific exams at any moment and control exactly which students or classes are authorized to attempt each test.",
        },
        {
          id: "artisan-faq-4",
          question: "Can teachers inspect student scripts and question performance after exams?",
          answer:
            "Yes! Administrators can open and review complete student answer scripts for every subject after exams, alongside detailed performance and question analysis to spot strengths and weaknesses.",
        },
        {
          id: "artisan-faq-5",
          question: "What happens if electricity or internet drops mid-exam?",
          answer:
            "Examinify's Exam Resumption ensures students pick up right where they stopped with all previous answers and remaining time intact, then syncs completed work online once reconnected.",
        },
      ] satisfies FaqItemData[],
    },
  },
  faqsPage: {
    headline: "Got Questions ?",
    highlightWords: ["Questions"],
    subtitle:
      "Everything you need to know about offline-resilient CBT exams, online syncing, and full school software ownership on Examinify.",
    categories: [
      {
        id: "customers",
        label: "For Students & Parents",
        items: [
          {
            id: "cust-faq-1",
            question: "What is Examinify?",
            answer:
              "Examinify is an offline-resilient Computer-Based Testing (CBT) platform built for schools to run seamless 1st CA, 2nd CA, and termly exams—even on poor or unavailable internet—with automatic online sync.",
          },
          {
            id: "cust-faq-2",
            question: "Can students take exams when internet is poor or unavailable?",
            answer:
              "Yes! Students can take tests smoothly with slow, intermittent, or no internet on lab desktops, laptops, Chromebooks, or tablets. Answers save safely and sync online once connectivity returns.",
          },
          {
            id: "cust-faq-3",
            question: "Can students use keyboard shortcuts to answer faster?",
            answer:
              "Yes! Keyboard Navigation lets students pick options and move between questions quickly using keyboard shortcuts, making timed tests smoother and faster.",
          },
          {
            id: "cust-faq-4",
            question: "How do students log in to start a CA or exam?",
            answer:
              "Each student logs in with their school-issued Student ID for tests activated by the administrator—no personal email signup required.",
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
              "Schools control result visibility. Your school can show instant scores upon submission or hold results until administrators review scripts and publish broadsheets.",
          },
          {
            id: "cust-faq-8",
            question: "Does Examinify help students prepare for WAEC, NECO, and BECE?",
            answer:
              "Yes! Secondary students practice in an authentic CBT environment—complete with keyboard navigation, countdown timers, and randomized questions.",
          },
        ],
      },
      {
        id: "artisans",
        label: "For Teachers",
        items: [
          {
            id: "pro-faq-1",
            question: "How many classes, subjects, and questions can we create?",
            answer:
              "Unlimited! Create unlimited classes, add unlimited subjects across Primary 1–6 and JSS 1–SSS 3, and build unlimited questions inside the personalized CBT software your school owns.",
          },
          {
            id: "pro-faq-2",
            question: "Can teachers view student answer scripts after exams?",
            answer:
              "Yes! View Student Scripts lets administrators and teachers open and review complete student answer scripts across all subjects after exams conclude.",
          },
          {
            id: "pro-faq-3",
            question: "What kind of performance analytics does Examinify provide?",
            answer:
              "Performance Analysis delivers detailed student score breakdowns and question-by-question item analysis so teachers can quickly spot each student's strengths and weaknesses.",
          },
          {
            id: "pro-faq-4",
            question: "Can I add diagrams, comprehension passages, and math formulas?",
            answer:
              "Yes! Teachers can attach science diagrams, maps, comprehension passages, and formatted mathematical equations directly inside the question bank.",
          },
          {
            id: "pro-faq-5",
            question: "Can I randomize questions so students sitting together don't copy?",
            answer:
              "Yes! Examinify prevents cheating with browser lockdown, per-student question randomization, and strict automatic time limits.",
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
            question: "How does Examinify work when our internet is poor or down?",
            answer:
              "Students can take tests and exams smoothly even with weak, patchy, or no internet. Responses are saved safely during the session and synced online automatically once connectivity returns.",
          },
          {
            id: "biz-faq-2",
            question: "Is our CBT personalized for our school, and do we really own the entire software?",
            answer:
              "Yes! Your school receives a CBT personalized and customized just for your school, and your school owns the entire software—giving you permanent control with no vendor lock-in.",
          },
          {
            id: "biz-faq-3",
            question: "How does Exam Activation Control work?",
            answer:
              "Administrators can activate or deactivate any exam with a single click and strictly control which students or classes are permitted to attempt specific tests.",
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
              "Export clean Excel/CSV broadsheets per class or subject, alongside detailed performance analytics and question-level breakdowns.",
          },
          {
            id: "biz-faq-6",
            question: "How is software ownership structured for Nigerian schools?",
            answer:
              "Schools receive a CBT personalized and customized just for their campus, with full ownership of the entire software and straightforward pricing in Naira (₦)—starting with a guided pilot walkthrough.",
          },
          {
            id: "biz-faq-7",
            question: "How secure is the exam environment?",
            answer:
              "Examinify enforces browser lockdown, question randomization, strict time limits, and exam activation controls so every assessment remains fair and tamper-proof.",
          },
        ],
      },
    ] satisfies FaqCategoryTab[],
  },
  faqs: {
    headline: "Got Questions ?",
    subtitle:
      "Everything schools need to know about offline-resilient CBT exams, online syncing, and owning the complete platform.",
    moreCta: "See More",
    items: [
      {
        id: "faq-1",
        question: "Can students take exams when internet is poor or down?",
        answer:
          "Yes! Students can sit tests and exams smoothly through weak, unstable, or unavailable internet—answers save safely and sync online automatically once connectivity returns.",
      },
      {
        id: "faq-2",
        question: "Is our CBT personalized for us, and does our school own the entire software?",
        answer:
          "Yes! Your Examinify CBT is personalized and customized just for your school, and your school owns the entire software with zero vendor lock-in.",
      },
      {
        id: "faq-3",
        question: "What happens if there is a power or network drop during an exam?",
        answer:
          "With Exam Resumption, students pick up right where they stopped after a power outage or system restart—with zero lost answers.",
      },
      {
        id: "faq-4",
        question: "Can admins review student scripts and control exam access?",
        answer:
          "Yes! Administrators can activate or deactivate exams, control which students can attempt specific tests, and view full student answer scripts for all subjects after exams.",
      },
      {
        id: "faq-5",
        question: "Are there limits on classes, subjects, or questions?",
        answer:
          "No limits—create unlimited classes, add unlimited subjects, and build unlimited questions inside your customized, school-owned CBT software, complete with detailed performance and question analysis.",
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

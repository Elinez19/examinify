/**
 * Standalone UI types & Examinify mock datasets for the UI-only Admin Dashboard.
 * Decoupled from Drizzle/Neon schema and auth services.
 */

export interface ArtisanRow {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string;
  trade: string;
  categoryId: string | null;
  serviceKey: string;
  profileImage: string;
  hourlyRate: string;
  hourlyRateNumeric: number;
  about: string;
  skills: string[];
  portfolioImages: string[];
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  distance: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  isOnline: boolean;
  kycStatus: string;
  ninNumber: string | null;
  ninEncrypted: string | null;
  ninHash: string | null;
  kycSelfieUrl: string | null;
  kycIdDocumentUrl: string | null;
  kycIdType: string | null;
  kycRejectionReason: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingRow {
  id: string;
  bookingCode: string;
  clientId: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  artisanId: string;
  artisanName: string;
  categoryId: string | null;
  serviceTitle: string;
  description: string;
  status: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  agreedAmount: number;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryRow {
  id: string;
  title: string;
  slug: string;
  iconName: string;
  iconFamily: string;
  description: string | null;
  subServices: string[];
  basePrice: number;
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRow {
  id: string;
  reference: string;
  bachsTransactionId: string | null;
  bookingId: string | null;
  clientName: string;
  clientEmail: string;
  artisanId: string | null;
  artisanName: string;
  amount: number;
  platformFee: number;
  artisanPayout: number;
  currency: string;
  paymentMethod: string;
  status: string;
  escrowStatus: string;
  checkoutUrl: string | null;
  metadata: Record<string, unknown> | null;
  paidAt: Date | null;
  releasedAt: Date | null;
  createdAt: Date;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  role: string;
  onboardingStatus: string;
  onboardingStep: number;
  city: string | null;
  address: string | null;
  accountStatus: string;
  adminRoleTitle: string | null;
  adminPermissions: string | null;
  adminScope: string | null;
  mustChangePassword: boolean;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const BASE_TIMESTAMP = new Date("2026-11-01T09:00:00.000Z");

export const MOCK_CATEGORIES: CategoryRow[] = [
  {
    id: "cat_math",
    title: "Mathematics & Further Maths",
    slug: "mathematics-further-maths",
    iconName: "calculator",
    iconFamily: "MaterialCommunityIcons",
    description:
      "Timed objective & theory CBT papers for Academy (Grade 1–6) and College (JSS 1–SS 3) readiness.",
    subServices: [
      "Algebra & Number Base CBT",
      "Geometry & Mensuration Drill",
      "SS 3 WAEC Past Questions Mock",
      "Grade 6 Quantitative Reasoning",
    ],
    basePrice: 15000,
    isPopular: true,
    isActive: true,
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: "cat_english",
    title: "English Language & Literature",
    slug: "english-language-literature",
    iconName: "book-open-variant",
    iconFamily: "MaterialCommunityIcons",
    description:
      "Comprehension, lexis & structure, oral English audio drills, and essay evaluation modules.",
    subServices: [
      "Lexis & Structure Objective CBT",
      "Comprehension & Summary Mock",
      "Oral English Phonetics Drill",
      "Literature-in-English Set Texts",
    ],
    basePrice: 14000,
    isPopular: true,
    isActive: true,
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: "cat_sciences",
    title: "Chemistry, Biology & Basic Science",
    slug: "secondary-sciences",
    iconName: "flask",
    iconFamily: "MaterialCommunityIcons",
    description:
      "Diagram-assisted science assessments with offline image caching for school computer labs.",
    subServices: [
      "SS 2 Chemistry Practical Alternatives",
      "Biology Diagrams & Taxonomy CBT",
      "JSS 3 Basic Science Term Exam",
    ],
    basePrice: 18000,
    isPopular: true,
    isActive: true,
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: "cat_ict",
    title: "Computer Studies & Physics",
    slug: "ict-physics",
    iconName: "laptop",
    iconFamily: "MaterialCommunityIcons",
    description:
      "Lockdown-browser ready ICT, data processing, and physics calculation modules.",
    subServices: [
      "Data Processing & Networking CBT",
      "SS 3 Physics Mechanics & Optics",
      "Coding & Logic Gate Basics",
    ],
    basePrice: 16500,
    isPopular: false,
    isActive: true,
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: "cat_primary",
    title: "Academy General Studies",
    slug: "primary-general-studies",
    iconName: "school",
    iconFamily: "MaterialCommunityIcons",
    description:
      "Common Entrance prep, verbal reasoning, and continuous assessment tests for Grade 1–6 Academy classes.",
    subServices: [
      "Common Entrance Mock Battery",
      "Verbal Reasoning Timed Drill",
      "Civic & Social Studies CA Test",
    ],
    basePrice: 12000,
    isPopular: false,
    isActive: false,
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
];

export const MOCK_ARTISANS: ArtisanRow[] = [
  {
    id: "tch_emeka",
    userId: null,
    name: "Mr. Emeka Okafor",
    email: "emeka.okafor@teachers.examinify.ng",
    phone: "+234 803 441 8820",
    trade: "Mathematics & Further Maths Teacher",
    categoryId: "cat_math",
    serviceKey: "mathematics",
    profileImage: "/images/landing/audience-teacher.svg",
    hourlyRate: "₦18,000",
    hourlyRateNumeric: 18000,
    about: "Senior Mathematics HOD & Lead CBT Paper Moderator for SS 1–3.",
    skills: ["Algebra", "WAEC Prep", "CBT Proctoring"],
    portfolioImages: [],
    rating: 4.9,
    reviewsCount: 42,
    completedJobs: 38,
    distance: "Guzape Branch",
    city: "Abuja (Guzape Branch)",
    address: "College Wing Staffroom, Guzape",
    latitude: 9.0765,
    longitude: 7.3986,
    isOnline: true,
    kycStatus: "verified",
    ninNumber: "TRCN-48192038",
    ninEncrypted: null,
    ninHash: null,
    kycSelfieUrl: null,
    kycIdDocumentUrl: null,
    kycIdType: "TRCN",
    kycRejectionReason: null,
    bankName: "SS 1 - SS 3",
    bankAccountNumber: "EXM-TCH-1042",
    bankAccountName: "Mr. Emeka Okafor",
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: "tch_zainab",
    userId: null,
    name: "Mrs. Zainab Ibrahim",
    email: "zainab.ibrahim@teachers.examinify.ng",
    phone: "+234 809 772 3105",
    trade: "English Language & Literature Lead",
    categoryId: "cat_english",
    serviceKey: "english",
    profileImage: "/images/landing/audience-teacher.svg",
    hourlyRate: "₦16,000",
    hourlyRateNumeric: 16000,
    about: "Coordinates Comprehension & Oral English CBT labs for JSS 1–SS 3.",
    skills: ["Lexis & Structure", "Oral English", "Script Review"],
    portfolioImages: [],
    rating: 4.8,
    reviewsCount: 31,
    completedJobs: 29,
    distance: "Maitama Branch",
    city: "Abuja (Maitama Branch)",
    address: "Humanities Block, Maitama",
    latitude: 6.4474,
    longitude: 3.4723,
    isOnline: true,
    kycStatus: "verified",
    ninNumber: "TRCN-59201477",
    ninEncrypted: null,
    ninHash: null,
    kycSelfieUrl: null,
    kycIdDocumentUrl: null,
    kycIdType: "TRCN",
    kycRejectionReason: null,
    bankName: "JSS 1 - SS 3",
    bankAccountNumber: "EXM-TCH-1089",
    bankAccountName: "Mrs. Zainab Ibrahim",
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: "tch_kunle",
    userId: null,
    name: "Mr. Kunle Adewale",
    email: "kunle.adewale@teachers.examinify.ng",
    phone: "+234 805 918 4412",
    trade: "Physics & ICT Lab Supervisor",
    categoryId: "cat_ict",
    serviceKey: "physics-ict",
    profileImage: "/images/landing/audience-teacher.svg",
    hourlyRate: "₦17,500",
    hourlyRateNumeric: 17500,
    about: "Manages offline LAN exam sync servers and Physics CBT banks.",
    skills: ["LAN Sync", "Physics CBT", "Lockdown Mode"],
    portfolioImages: [],
    rating: 4.7,
    reviewsCount: 19,
    completedJobs: 15,
    distance: "CBT Lab A",
    city: "Abuja (Main Campus)",
    address: "ICT Centre, Main Campus",
    latitude: 9.0765,
    longitude: 7.3986,
    isOnline: true,
    kycStatus: "pending",
    ninNumber: "TRCN-77310421",
    ninEncrypted: null,
    ninHash: null,
    kycSelfieUrl: null,
    kycIdDocumentUrl: null,
    kycIdType: "TRCN",
    kycRejectionReason: null,
    bankName: "SS 1 - SS 3",
    bankAccountNumber: "EXM-TCH-1104",
    bankAccountName: "Mr. Kunle Adewale",
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: "tch_ngozi",
    userId: null,
    name: "Ms. Ngozi Eze",
    email: "ngozi.eze@teachers.examinify.ng",
    phone: "+234 812 630 5591",
    trade: "Biology & Chemistry Teacher",
    categoryId: "cat_sciences",
    serviceKey: "sciences",
    profileImage: "/images/landing/audience-teacher.svg",
    hourlyRate: "₦15,500",
    hourlyRateNumeric: 15500,
    about: "Prepares alternative-to-practical CBT question banks for sciences.",
    skills: ["Biology", "Chemistry", "Diagram Questions"],
    portfolioImages: [],
    rating: 4.9,
    reviewsCount: 24,
    completedJobs: 21,
    distance: "Superstars Arm",
    city: "Wuse Branch",
    address: "Science Laboratory Block",
    latitude: 4.8156,
    longitude: 7.0498,
    isOnline: false,
    kycStatus: "pending",
    ninNumber: "TRCN-61928374",
    ninEncrypted: null,
    ninHash: null,
    kycSelfieUrl: null,
    kycIdDocumentUrl: null,
    kycIdType: "TRCN",
    kycRejectionReason: null,
    bankName: "JSS 3 - SS 3",
    bankAccountNumber: "EXM-TCH-1127",
    bankAccountName: "Ms. Ngozi Eze",
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: "tch_babatunde",
    userId: null,
    name: "Mr. Babatunde Cole",
    email: "babatunde.cole@teachers.examinify.ng",
    phone: "+234 807 204 6618",
    trade: "Academy Numeracy Invigilator",
    categoryId: "cat_primary",
    serviceKey: "primary",
    profileImage: "/images/landing/audience-teacher.svg",
    hourlyRate: "₦12,000",
    hourlyRateNumeric: 12000,
    about: "Grade 4–6 Common Entrance & continuous assessment coordinator.",
    skills: ["Quantitative", "Academy CBT", "Invigilation"],
    portfolioImages: [],
    rating: 4.5,
    reviewsCount: 11,
    completedJobs: 9,
    distance: "Academy Wing",
    city: "Guzape Branch",
    address: "Academy Wing, Guzape",
    latitude: 7.3775,
    longitude: 3.947,
    isOnline: false,
    kycStatus: "rejected",
    ninNumber: "TRCN-PENDING-09",
    ninEncrypted: null,
    ninHash: null,
    kycSelfieUrl: null,
    kycIdDocumentUrl: null,
    kycIdType: "TRCN",
    kycRejectionReason: "Awaiting updated TRCN certificate scan.",
    bankName: "Grade 4 - Grade 6",
    bankAccountNumber: "EXM-TCH-1155",
    bankAccountName: "Mr. Babatunde Cole",
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
];

export const MOCK_BOOKINGS: BookingRow[] = [
  {
    id: "exm_1",
    bookingCode: "EXM-2026-8891",
    clientId: "cust_1",
    clientName: "Amina Bello",
    clientEmail: "amina.bello@students.examinify.ng",
    clientPhone: "+234 809 332 1104",
    artisanId: "tch_emeka",
    artisanName: "Mr. Emeka Okafor",
    categoryId: "cat_math",
    serviceTitle: "JSS 3 Mathematics First Term CBT",
    description: "60-question timed objective + theory calculation exam.",
    status: "in_progress",
    scheduledDate: "2026-11-13",
    scheduledTime: "09:00 AM",
    address: "CBT Lab A · Main Campus, Abuja",
    agreedAmount: 60,
    paymentStatus: "escrowed",
    createdAt: new Date("2026-11-13T08:00:00.000Z"),
    updatedAt: new Date("2026-11-13T08:00:00.000Z"),
  },
  {
    id: "exm_2",
    bookingCode: "EXM-2026-8892",
    clientId: "cust_2",
    clientName: "Toluwalase Adeyemi",
    clientEmail: "tolu.adeyemi@students.examinify.ng",
    clientPhone: "+234 803 741 9920",
    artisanId: "tch_zainab",
    artisanName: "Mrs. Zainab Ibrahim",
    categoryId: "cat_english",
    serviceTitle: "SS 2 English Language Comprehension CBT",
    description: "Lexis, structure, and passage comprehension drill.",
    status: "accepted",
    scheduledDate: "2026-11-13",
    scheduledTime: "11:30 AM",
    address: "CBT Lab B · Lekki Campus, Lagos",
    agreedAmount: 50,
    paymentStatus: "escrowed",
    createdAt: new Date("2026-11-12T15:30:00.000Z"),
    updatedAt: new Date("2026-11-12T15:30:00.000Z"),
  },
  {
    id: "exm_3",
    bookingCode: "EXM-2026-8893",
    clientId: "cust_3",
    clientName: "Chidinma Nwosu",
    clientEmail: "chidinma.nwosu@students.examinify.ng",
    clientPhone: "+234 812 509 4418",
    artisanId: "tch_kunle",
    artisanName: "Mr. Kunle Adewale",
    categoryId: "cat_ict",
    serviceTitle: "SS 3 Physics Mechanics & Optics Mock",
    description: "WAEC standard physics mock with offline formula sheet.",
    status: "completed",
    scheduledDate: "2026-11-11",
    scheduledTime: "10:00 AM",
    address: "ICT Centre · Main Campus, Abuja",
    agreedAmount: 50,
    paymentStatus: "released",
    createdAt: new Date("2026-11-11T09:00:00.000Z"),
    updatedAt: new Date("2026-11-11T11:30:00.000Z"),
  },
  {
    id: "exm_4",
    bookingCode: "EXM-2026-8894",
    clientId: "cust_4",
    clientName: "Ibrahim Danjuma",
    clientEmail: "ibrahim.danjuma@students.examinify.ng",
    clientPhone: "+234 805 612 8830",
    artisanId: "tch_babatunde",
    artisanName: "Mr. Babatunde Cole",
    categoryId: "cat_primary",
    serviceTitle: "Grade 6 Quantitative Reasoning CA",
    description: "Timed continuous assessment for Grade 6 Explorers.",
    status: "pending",
    scheduledDate: "2026-11-14",
    scheduledTime: "08:30 AM",
    address: "Academy CBT Lab · Explorers",
    agreedAmount: 40,
    paymentStatus: "unpaid",
    createdAt: new Date("2026-11-10T14:00:00.000Z"),
    updatedAt: new Date("2026-11-10T14:00:00.000Z"),
  },
  {
    id: "exm_5",
    bookingCode: "EXM-2026-8895",
    clientId: "cust_1",
    clientName: "Amina Bello",
    clientEmail: "amina.bello@students.examinify.ng",
    clientPhone: "+234 809 332 1104",
    artisanId: "tch_ngozi",
    artisanName: "Ms. Ngozi Eze",
    categoryId: "cat_sciences",
    serviceTitle: "JSS 3 Basic Science Midterm CBT",
    description: "Objective science evaluation with cached diagrams.",
    status: "completed",
    scheduledDate: "2026-11-09",
    scheduledTime: "01:00 PM",
    address: "CBT Lab A · Main Campus, Abuja",
    agreedAmount: 45,
    paymentStatus: "released",
    createdAt: new Date("2026-11-09T12:00:00.000Z"),
    updatedAt: new Date("2026-11-09T14:00:00.000Z"),
  },
  {
    id: "exm_6",
    bookingCode: "EXM-2026-8896",
    clientId: "cust_3",
    clientName: "Chidinma Nwosu",
    clientEmail: "chidinma.nwosu@students.examinify.ng",
    clientPhone: "+234 812 509 4418",
    artisanId: "tch_ngozi",
    artisanName: "Ms. Ngozi Eze",
    categoryId: "cat_sciences",
    serviceTitle: "SS 3 Chemistry Practical Alternative",
    description: "Titration & qualitative analysis CBT simulation.",
    status: "pending",
    scheduledDate: "2026-11-15",
    scheduledTime: "10:00 AM",
    address: "Science CBT Lab · Port Harcourt",
    agreedAmount: 50,
    paymentStatus: "escrowed",
    createdAt: new Date("2026-11-08T10:00:00.000Z"),
    updatedAt: new Date("2026-11-08T10:00:00.000Z"),
  },
];

export const MOCK_PAYMENTS: PaymentRow[] = [
  {
    id: "pay_1",
    reference: "EXM-INV-202601",
    bachsTransactionId: "bchs_901241",
    bookingId: "exm_1",
    clientName: "Greenfield Model Academy",
    clientEmail: "bursar@greenfield.examinify.ng",
    artisanId: "tch_emeka",
    artisanName: "Full School Term License (500 Seats)",
    amount: 250000,
    platformFee: 25000,
    artisanPayout: 225000,
    currency: "NGN",
    paymentMethod: "bank_transfer",
    status: "settled",
    escrowStatus: "released",
    checkoutUrl: null,
    metadata: { term: "First Term 2026/2027" },
    paidAt: new Date("2026-11-02T10:15:00.000Z"),
    releasedAt: new Date("2026-11-02T10:30:00.000Z"),
    createdAt: new Date("2026-11-02T10:00:00.000Z"),
  },
  {
    id: "pay_2",
    reference: "EXM-INV-202602",
    bachsTransactionId: "bchs_901288",
    bookingId: "exm_2",
    clientName: "Crescent Heights College",
    clientEmail: "finance@crescentheights.edu.ng",
    artisanId: "tch_zainab",
    artisanName: "WAEC / NECO Mock Pack + Offline Sync",
    amount: 180000,
    platformFee: 18000,
    artisanPayout: 162000,
    currency: "NGN",
    paymentMethod: "card",
    status: "escrowed",
    escrowStatus: "held",
    checkoutUrl: null,
    metadata: { term: "First Term 2026/2027" },
    paidAt: new Date("2026-11-05T14:20:00.000Z"),
    releasedAt: null,
    createdAt: new Date("2026-11-05T14:00:00.000Z"),
  },
  {
    id: "pay_3",
    reference: "EXM-INV-202603",
    bachsTransactionId: "bchs_901315",
    bookingId: "exm_3",
    clientName: "St. Jude Grammar School",
    clientEmail: "admin@stjude.edu.ng",
    artisanId: "tch_kunle",
    artisanName: "Multi-Campus Desktop CBT Ownership",
    amount: 420000,
    platformFee: 42000,
    artisanPayout: 378000,
    currency: "NGN",
    paymentMethod: "bank_transfer",
    status: "settled",
    escrowStatus: "released",
    checkoutUrl: null,
    metadata: { term: "Annual School Ownership" },
    paidAt: new Date("2026-11-07T09:45:00.000Z"),
    releasedAt: new Date("2026-11-07T10:00:00.000Z"),
    createdAt: new Date("2026-11-07T09:30:00.000Z"),
  },
  {
    id: "pay_4",
    reference: "EXM-INV-202604",
    bachsTransactionId: "bchs_901390",
    bookingId: "exm_4",
    clientName: "Royal Crown Academy & College",
    clientEmail: "accounts@royalcrown.ng",
    artisanId: "tch_ngozi",
    artisanName: "Academy & College Term Seat Expansion",
    amount: 125000,
    platformFee: 12500,
    artisanPayout: 112500,
    currency: "NGN",
    paymentMethod: "mobile_money",
    status: "escrowed",
    escrowStatus: "held",
    checkoutUrl: null,
    metadata: { term: "First Term 2026/2027" },
    paidAt: new Date("2026-11-10T11:10:00.000Z"),
    releasedAt: null,
    createdAt: new Date("2026-11-10T11:00:00.000Z"),
  },
  {
    id: "pay_5",
    reference: "EXM-INV-202605",
    bachsTransactionId: null,
    bookingId: "exm_6",
    clientName: "Horizon Science Academy",
    clientEmail: "bursary@horizonacademy.ng",
    artisanId: "tch_emeka",
    artisanName: "Custom School Branding & Question Bank",
    amount: 95000,
    platformFee: 9500,
    artisanPayout: 85500,
    currency: "NGN",
    paymentMethod: "usdt",
    status: "initialized",
    escrowStatus: "pending",
    checkoutUrl: null,
    metadata: { term: "First Term 2026/2027" },
    paidAt: null,
    releasedAt: null,
    createdAt: new Date("2026-11-12T16:00:00.000Z"),
  },
];


import type {
  AdminRecord,
  AdminScopeOption,
  ArtisanUserFormData,
  CustomerRecord,
} from "./types";

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: "cust_1",
    name: "Amina Bello",
    email: "amina.bello@students.examinify.ng",
    phone: "+234 809 332 1104",
    city: "JSS 3 · Science Wing",
    bookingsCount: 8,
    status: "active",
    joinedAt: "Jan 14, 2026",
  },
  {
    id: "cust_2",
    name: "Toluwalase Adeyemi",
    email: "tolu.adeyemi@students.examinify.ng",
    phone: "+234 803 741 9920",
    city: "SSS 2 · Commercial",
    bookingsCount: 5,
    status: "active",
    joinedAt: "Feb 03, 2026",
  },
  {
    id: "cust_3",
    name: "Chidinma Nwosu",
    email: "chidinma.nwosu@students.examinify.ng",
    phone: "+234 812 509 4418",
    city: "SSS 3 · Sciences",
    bookingsCount: 3,
    status: "active",
    joinedAt: "Mar 19, 2026",
  },
  {
    id: "cust_4",
    name: "Ibrahim Danjuma",
    email: "ibrahim.danjuma@students.examinify.ng",
    phone: "+234 805 612 8830",
    city: "Primary 6 · Block A",
    bookingsCount: 2,
    status: "pending",
    joinedAt: "Oct 28, 2026",
  },
];

export const INITIAL_ADMINS: AdminRecord[] = [
  {
    id: "adm_1",
    name: "Elijah Admin",
    email: "admin@examinify.ng",
    phone: "+234 803 550 1920",
    roleTitle: "Super Administrator",
    permissions:
      "Full access: Users, Exams, Subjects, Billing & Settings",
    adminScope: "super_admin",
    status: "verified",
    lastActive: "Online now",
  },
  {
    id: "adm_2",
    name: "Funke Oladipo",
    email: "exams-officer@examinify.ng",
    phone: "+234 812 400 8821",
    roleTitle: "Verification & Appeals Officer",
    permissions:
      "Teacher credential verification, result appeals & feedback moderation",
    adminScope: "kyc_moderator",
    status: "verified",
    lastActive: "18 mins ago",
  },
  {
    id: "adm_3",
    name: "Sadiq Abdullahi",
    email: "cbt-support@examinify.ng",
    phone: "+234 805 700 9912",
    roleTitle: "CBT Lab & Support Lead",
    permissions:
      "Live exam session oversight, offline sync & school helpdesk",
    adminScope: "dispatch_support",
    status: "active",
    lastActive: "1 hour ago",
  },
];

export const USER_GROUP_OPTIONS = [
  { id: "artisan", label: "Teacher / Invigilator" },
  { id: "customer", label: "Student" },
  { id: "admin", label: "Administrator" },
] as const;

export const ARTISAN_KYC_OPTIONS = [
  { id: "verified", label: "Verified Teacher" },
  { id: "pending", label: "Pending Verification" },
  { id: "rejected", label: "Declined" },
] as const;

export const CUSTOMER_STATUS_OPTIONS = [
  { id: "active", label: "Active Student" },
  { id: "pending", label: "On Hold / Pending" },
  { id: "suspended", label: "Suspended" },
] as const;

export const ADMIN_STATUS_OPTIONS = [
  { id: "verified", label: "Verified Admin" },
  { id: "active", label: "Active Staff" },
  { id: "suspended", label: "Suspended / Revoked" },
] as const;

export const ADMIN_SCOPE_OPTIONS = [
  {
    id: "super_admin" as AdminScopeOption,
    label: "Super Admin (Full Access: Users, Roles, Exams, Billing & Settings)",
  },
  {
    id: "kyc_moderator" as AdminScopeOption,
    label: "Verification Officer (Teacher credential verification & Result Appeals)",
  },
  {
    id: "dispatch_support" as AdminScopeOption,
    label: "CBT Lab & Support Lead (Exam session monitoring, sync & Helpdesk)",
  },
] as const;

export const DEFAULT_USER_FORM_DATA: ArtisanUserFormData = {
  formGroup: "artisan",
  editingId: null,
  name: "",
  email: "",
  phone: "+234 803 550 1920",
  password: "",
  city: "Abuja (Main Campus)",
  trade: "Mathematics & Further Maths Teacher",
  hourlyRateNumeric: "15000",
  ninNumber: "TRCN-48192038",
  bankName: "SSS 1 - SSS 3",
  bankAccountNumber: "EXM-TCH-1042",
  kycStatus: "verified",
  customerStatus: "active",
  roleTitle: "CBT Operations Administrator",
  permissions: "Teacher verification, exam sessions & school support",
  adminScope: "dispatch_support",
  adminStatus: "verified",
};

import type { AdminSelectOption } from "@/components/admin/ui/admin-form-controls";

export const SCHOOL_BRANCH_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { id: "Guzape Branch", label: "Guzape Branch" },
  { id: "Maitama Branch", label: "Maitama Branch" },
  { id: "Wuse Branch", label: "Wuse Branch" },
];

export const SEX_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { id: "Male", label: "Male" },
  { id: "Female", label: "Female" },
];

export const MARITAL_STATUS_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { id: "Single", label: "Single" },
  { id: "Married", label: "Married" },
  { id: "Widowed", label: "Widowed" },
  { id: "Divorced", label: "Divorced" },
];

export const COUNTRY_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { id: "Nigeria", label: "Nigeria" },
  { id: "Ghana", label: "Ghana" },
  { id: "Kenya", label: "Kenya" },
  { id: "South Africa", label: "South Africa" },
  { id: "United Kingdom", label: "United Kingdom" },
  { id: "United States", label: "United States" },
];

export const NIGERIAN_STATE_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { id: "FCT Abuja", label: "FCT Abuja" },
  { id: "Abia", label: "Abia" },
  { id: "Adamawa", label: "Adamawa" },
  { id: "Akwa Ibom", label: "Akwa Ibom" },
  { id: "Anambra", label: "Anambra" },
  { id: "Bauchi", label: "Bauchi" },
  { id: "Bayelsa", label: "Bayelsa" },
  { id: "Benue", label: "Benue" },
  { id: "Borno", label: "Borno" },
  { id: "Cross River", label: "Cross River" },
  { id: "Delta", label: "Delta" },
  { id: "Ebonyi", label: "Ebonyi" },
  { id: "Edo", label: "Edo" },
  { id: "Ekiti", label: "Ekiti" },
  { id: "Enugu", label: "Enugu" },
  { id: "Gombe", label: "Gombe" },
  { id: "Imo", label: "Imo" },
  { id: "Jigawa", label: "Jigawa" },
  { id: "Kaduna", label: "Kaduna" },
  { id: "Kano", label: "Kano" },
  { id: "Katsina", label: "Katsina" },
  { id: "Kebbi", label: "Kebbi" },
  { id: "Kogi", label: "Kogi" },
  { id: "Kwara", label: "Kwara" },
  { id: "Lagos", label: "Lagos" },
  { id: "Nasarawa", label: "Nasarawa" },
  { id: "Niger", label: "Niger" },
  { id: "Ogun", label: "Ogun" },
  { id: "Ondo", label: "Ondo" },
  { id: "Osun", label: "Osun" },
  { id: "Oyo", label: "Oyo" },
  { id: "Plateau", label: "Plateau" },
  { id: "Rivers", label: "Rivers" },
  { id: "Sokoto", label: "Sokoto" },
  { id: "Taraba", label: "Taraba" },
  { id: "Yobe", label: "Yobe" },
  { id: "Zamfara", label: "Zamfara" },
];

export const PHONE_TYPE_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { id: "Father", label: "Father" },
  { id: "Mother", label: "Mother" },
  { id: "Guardian", label: "Guardian" },
  { id: "Personal Mobile", label: "Personal Mobile" },
  { id: "WhatsApp Line", label: "WhatsApp Line" },
];

export const EMAIL_TYPE_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { id: "Portal Primary", label: "Portal Primary Email" },
  { id: "Parent / Guardian", label: "Parent / Guardian Email" },
  { id: "Official School", label: "Official School Email" },
  { id: "Personal", label: "Personal Email" },
];

export const RELATIONSHIP_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { id: "Father", label: "Father" },
  { id: "Mother", label: "Mother" },
  { id: "Guardian", label: "Guardian" },
  { id: "Sibling", label: "Sibling" },
  { id: "Spouse", label: "Spouse" },
  { id: "Sponsor", label: "Sponsor" },
];

export const TEACHER_PREFIX_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { id: "Mr.", label: "Mr." },
  { id: "Mrs.", label: "Mrs." },
  { id: "Ms.", label: "Ms." },
  { id: "Dr.", label: "Dr." },
  { id: "Prof.", label: "Prof." },
];

export const STAFF_TYPE_OPTIONS: ReadonlyArray<
  AdminSelectOption<"Academic" | "Non-Academic">
> = [
  { id: "Academic", label: "Academic" },
  { id: "Non-Academic", label: "Non-Academic" },
];

export const STAFF_REGISTRATION_ROLE_OPTIONS: ReadonlyArray<
  AdminSelectOption<"Teacher" | "Class Teacher" | "Subject Teacher" | "Admin" | "Staff">
> = [
  { id: "Teacher", label: "Teacher" },
  { id: "Class Teacher", label: "Class Teacher" },
  { id: "Subject Teacher", label: "Subject Teacher" },
  { id: "Admin", label: "Admin" },
  { id: "Staff", label: "Staff" },
];

export const ASSIGNABLE_STAFF_ROLE_OPTIONS: ReadonlyArray<
  AdminSelectOption<
    | "Teacher"
    | "Class Teacher"
    | "Subject Teacher"
    | "Principal"
    | "Admin"
    | "Staff"
    | "Exam Officer"
  >
> = [
  { id: "Teacher", label: "Teacher" },
  { id: "Class Teacher", label: "Class Teacher" },
  { id: "Subject Teacher", label: "Subject Teacher" },
  { id: "Principal", label: "Principal" },
  { id: "Admin", label: "Admin" },
  { id: "Staff", label: "Staff" },
  { id: "Exam Officer", label: "Exam Officer" },
];

export const DEPARTMENT_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { id: "Sciences", label: "Sciences" },
  { id: "Mathematics & Computing", label: "Mathematics & Computing" },
  { id: "Languages & Literature", label: "Languages & Literature" },
  { id: "Humanities & Social Sciences", label: "Humanities & Social Sciences" },
  { id: "Commercial & Business", label: "Commercial & Business" },
  { id: "Vocational & Technical", label: "Vocational & Technical" },
];

export const STAFF_UNIT_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { id: "Exam Office", label: "Exam Office" },
  { id: "ICT & CBT Operations", label: "ICT & CBT Operations" },
  { id: "Admissions & Registry", label: "Admissions & Registry" },
  { id: "Finance & Bursary", label: "Finance & Bursary" },
  { id: "Student Support & Welfare", label: "Student Support & Welfare" },
];

export const EMPLOYMENT_TYPE_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { id: "Full-Time", label: "Full-Time" },
  { id: "Part-Time", label: "Part-Time" },
  { id: "Contract / Visiting", label: "Contract / Visiting" },
];

export const ACCOUNT_STATUS_OPTIONS: ReadonlyArray<
  AdminSelectOption<"active" | "inactive" | "pending">
> = [
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending Verification" },
  { id: "inactive", label: "Inactive / Suspended" },
];

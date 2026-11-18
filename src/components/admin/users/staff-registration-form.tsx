"use client";

import * as React from "react";
import { KeyRound, Shield, UserCheck } from "lucide-react";
import {
  AdminSelectField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import {
  ACCOUNT_STATUS_OPTIONS,
  CustomForm,
  EmailDetailSection,
  FormSection,
  IdGeneratorField,
  MARITAL_STATUS_OPTIONS,
  NextOfKinSection,
  OriginLocationFields,
  PhoneDetailSection,
  PhotoUploadField,
  SCHOOL_BRANCH_OPTIONS,
  SEX_OPTIONS,
  STAFF_REGISTRATION_ROLE_OPTIONS,
  STAFF_TYPE_OPTIONS,
} from "@/components/forms";
import type {
  AccountStatus,
  StaffProfile,
  StaffRegistrationRole,
  StaffRoleOption,
  StaffType,
  TeacherProfile,
} from "@/data/portal-mock-data";

export interface StaffRegistrationFormState {
  id: string;
  schoolBranch: string;
  staffCode: string;
  firstName: string;
  middleName: string;
  lastName: string;
  sex: string;
  maritalStatus: string;
  dateOfBirth: string;
  country: string;
  stateOfOrigin: string;
  cityOfResidence: string;
  photoDataUrl: string;
  staffType: StaffType;
  role: StaffRegistrationRole;
  phoneType: string;
  phone: string;
  alternatePhone: string;
  emailType: string;
  email: string;
  alternateEmail: string;
  nextOfKinName: string;
  nextOfKinRelationship: string;
  nextOfKinPhone: string;
  nextOfKinAddress: string;
  password: string;
  status: AccountStatus;
}

export interface StaffRegistrationFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: StaffRegistrationFormState;
  setFormState: React.Dispatch<React.SetStateAction<StaffRegistrationFormState>>;
  staffCount: number;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onPhotoError?: (message: string) => void;
  savedMessage?: string | null;
}

function normalizeRegistrationRole(
  role?: StaffRoleOption | string | null
): StaffRegistrationRole {
  if (
    role === "Teacher" ||
    role === "Class Teacher" ||
    role === "Subject Teacher" ||
    role === "Admin" ||
    role === "Staff"
  ) {
    return role;
  }
  if (role === "Principal" || role === "Exam Officer") {
    return "Admin";
  }
  return "Staff";
}

export function createInitialStaffFormState(
  staffCount: number,
  defaults?: { staffType?: StaffType; role?: StaffRegistrationRole }
): StaffRegistrationFormState {
  return {
    id: "",
    schoolBranch: SCHOOL_BRANCH_OPTIONS[0].id,
    staffCode: `STF/${String(staffCount + 11).padStart(3, "0")}`,
    firstName: "",
    middleName: "",
    lastName: "",
    sex: "Male",
    maritalStatus: "Married",
    dateOfBirth: "",
    country: "Nigeria",
    stateOfOrigin: "FCT Abuja",
    cityOfResidence: "",
    photoDataUrl: "",
    staffType: defaults?.staffType ?? "Academic",
    role: defaults?.role ?? "Teacher",
    phoneType: "Personal Mobile",
    phone: "",
    alternatePhone: "",
    emailType: "Official School",
    email: "",
    alternateEmail: "",
    nextOfKinName: "",
    nextOfKinRelationship: "Spouse",
    nextOfKinPhone: "",
    nextOfKinAddress: "",
    password: "Staff@2026",
    status: "active",
  };
}

export function staffRecordToFormState(
  record:
    | { kind: "teacher"; data: TeacherProfile }
    | { kind: "staff"; data: StaffProfile },
  staffCount: number
): StaffRegistrationFormState {
  const base = createInitialStaffFormState(staffCount);
  if (record.kind === "teacher") {
    const t = record.data;
    return {
      ...base,
      id: t.id,
      schoolBranch: t.schoolBranch ?? base.schoolBranch,
      staffCode: t.staffId,
      firstName: t.firstName,
      middleName: t.middleName ?? "",
      lastName: t.lastName,
      sex: t.sex ?? "Male",
      maritalStatus: t.maritalStatus ?? "Married",
      dateOfBirth: t.dateOfBirth ?? "",
      country: t.country ?? "Nigeria",
      stateOfOrigin: t.stateOfOrigin ?? "FCT Abuja",
      cityOfResidence: t.cityOfResidence ?? "",
      photoDataUrl:
        t.avatarUrl && t.avatarUrl.startsWith("data:image/") ? t.avatarUrl : "",
      staffType: t.staffType ?? "Academic",
      role: normalizeRegistrationRole(t.assignedRole ?? "Teacher"),
      phoneType: t.phoneType ?? "Personal Mobile",
      phone: t.phone,
      alternatePhone: t.alternatePhone ?? "",
      emailType: t.emailType ?? "Official School",
      email: t.email,
      alternateEmail: t.alternateEmail ?? "",
      nextOfKinName: t.nextOfKinName ?? "",
      nextOfKinRelationship: t.nextOfKinRelationship ?? "Spouse",
      nextOfKinPhone: t.nextOfKinPhone ?? "",
      nextOfKinAddress: t.nextOfKinAddress ?? "",
      password: t.password,
      status: t.status,
    };
  }

  const s = record.data;
  return {
    ...base,
    id: s.id,
    schoolBranch: s.schoolBranch ?? base.schoolBranch,
    staffCode: s.staffCode ?? `STF/${s.id.slice(-3).toUpperCase()}`,
    firstName: s.firstName,
    middleName: s.middleName ?? "",
    lastName: s.lastName,
    sex: s.sex ?? "Male",
    maritalStatus: s.maritalStatus ?? "Married",
    dateOfBirth: s.dateOfBirth ?? "",
    country: s.country ?? "Nigeria",
    stateOfOrigin: s.stateOfOrigin ?? "FCT Abuja",
    cityOfResidence: s.cityOfResidence ?? "",
    photoDataUrl:
      s.avatarUrl && s.avatarUrl.startsWith("data:image/") ? s.avatarUrl : "",
    staffType: s.staffType ?? "Non-Academic",
    role: normalizeRegistrationRole(s.assignedRole ?? s.roleTitle),
    phoneType: s.phoneType ?? "Personal Mobile",
    phone: s.phone,
    alternatePhone: s.alternatePhone ?? "",
    emailType: s.emailType ?? "Official School",
    email: s.email,
    alternateEmail: s.alternateEmail ?? "",
    nextOfKinName: s.nextOfKinName ?? "",
    nextOfKinRelationship: s.nextOfKinRelationship ?? "Spouse",
    nextOfKinPhone: s.nextOfKinPhone ?? "",
    nextOfKinAddress: s.nextOfKinAddress ?? "",
    password: s.password,
    status: s.status,
  };
}

export function StaffRegistrationForm({
  formRef,
  open,
  onOpenChange,
  formState,
  setFormState,
  staffCount,
  onReset,
  onSubmit,
  onPhotoError,
  savedMessage,
}: StaffRegistrationFormProps) {
  const isEditing = Boolean(formState.id);

  const generateStaffCode = () => {
    const seq = String(staffCount + Math.floor(100 + Math.random() * 899));
    return `STF/${seq}`;
  };

  return (
    <CustomForm
      id="staff-registration-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Staff Registration"
      title={isEditing ? "Edit Staff Details" : "Register Staff"}
      description="Enter staff personal details, staff type, role, contact details, and emergency contact."
      isEditing={isEditing}
      editingBadgeText={formState.staffCode || "Editing Staff"}
      onResetToCreate={onReset}
      savedMessage={savedMessage}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel={isEditing ? "Save Staff Record" : "Submit Registration"}
      cancelLabel="Cancel"
    >
      {/* Section 1: Staff Personal Information + Passport Photo */}
      <FormSection
        title="Staff Personal Information"
        subtitle="Fields marked * are required"
        icon={<Shield className="h-3.5 w-3.5" />}
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-9">
            <IdGeneratorField
              label="Staff ID"
              value={formState.staffCode}
              onChange={(val) =>
                setFormState((p) => ({ ...p, staffCode: val }))
              }
              onGenerate={generateStaffCode}
              placeholder="e.g. STF/012"
              required
            />

            <AdminTextField
              label="First Name *"
              value={formState.firstName}
              onChange={(e) =>
                setFormState((p) => ({ ...p, firstName: e.target.value }))
              }
              placeholder="e.g. Amina"
              required
            />

            <AdminTextField
              label="Middle Name"
              value={formState.middleName}
              onChange={(e) =>
                setFormState((p) => ({ ...p, middleName: e.target.value }))
              }
              placeholder="Optional middle name"
            />

            <AdminTextField
              label="Surname *"
              value={formState.lastName}
              onChange={(e) =>
                setFormState((p) => ({ ...p, lastName: e.target.value }))
              }
              placeholder="e.g. Bello"
              required
            />

            <AdminSelectField
              label="Sex *"
              value={formState.sex}
              onChange={(val) => setFormState((p) => ({ ...p, sex: val }))}
              options={SEX_OPTIONS}
            />

            <AdminSelectField
              label="Marital Status"
              value={formState.maritalStatus}
              onChange={(val) =>
                setFormState((p) => ({ ...p, maritalStatus: val }))
              }
              options={MARITAL_STATUS_OPTIONS}
            />

            <OriginLocationFields
              country={formState.country}
              setCountry={(val) => setFormState((p) => ({ ...p, country: val }))}
              stateOfOrigin={formState.stateOfOrigin}
              setStateOfOrigin={(val) =>
                setFormState((p) => ({ ...p, stateOfOrigin: val }))
              }
              cityOfResidence={formState.cityOfResidence}
              setCityOfResidence={(val) =>
                setFormState((p) => ({ ...p, cityOfResidence: val }))
              }
            />

            <AdminTextField
              label="Date of Birth *"
              type="date"
              value={formState.dateOfBirth}
              onChange={(e) =>
                setFormState((p) => ({ ...p, dateOfBirth: e.target.value }))
              }
              required
            />
          </div>

          <div className="lg:col-span-3">
            <PhotoUploadField
              label="Staff Photo"
              value={formState.photoDataUrl}
              onChange={(dataUrl) =>
                setFormState((p) => ({ ...p, photoDataUrl: dataUrl }))
              }
              onError={onPhotoError}
              className="h-full"
            />
          </div>
        </div>
      </FormSection>

      {/* Section 2: Staff Type & Role */}
      <FormSection
        title="Staff Type & Role"
        icon={<UserCheck className="h-3.5 w-3.5" />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminSelectField<StaffType>
            label="Staff Type *"
            value={formState.staffType}
            onChange={(val) => setFormState((p) => ({ ...p, staffType: val }))}
            options={STAFF_TYPE_OPTIONS}
          />

          <AdminSelectField<StaffRegistrationRole>
            label="Select Role *"
            value={formState.role}
            onChange={(val) => setFormState((p) => ({ ...p, role: val }))}
            options={STAFF_REGISTRATION_ROLE_OPTIONS}
          />
        </div>
      </FormSection>

      {/* Section 3: Phone Number Detail */}
      <PhoneDetailSection
        title="Staff Phone Number"
        phoneType={formState.phoneType}
        setPhoneType={(val) => setFormState((p) => ({ ...p, phoneType: val }))}
        phone={formState.phone}
        setPhone={(val) => setFormState((p) => ({ ...p, phone: val }))}
        alternatePhone={formState.alternatePhone}
        setAlternatePhone={(val) =>
          setFormState((p) => ({ ...p, alternatePhone: val }))
        }
        showAlternate
      />

      {/* Section 4: Email Detail */}
      <EmailDetailSection
        emailType={formState.emailType}
        setEmailType={(val) => setFormState((p) => ({ ...p, emailType: val }))}
        email={formState.email}
        setEmail={(val) => setFormState((p) => ({ ...p, email: val }))}
        alternateEmail={formState.alternateEmail}
        setAlternateEmail={(val) =>
          setFormState((p) => ({ ...p, alternateEmail: val }))
        }
      />

      {/* Section 5: Next of Kin */}
      <NextOfKinSection
        name={formState.nextOfKinName}
        setName={(val) => setFormState((p) => ({ ...p, nextOfKinName: val }))}
        relationship={formState.nextOfKinRelationship}
        setRelationship={(val) =>
          setFormState((p) => ({ ...p, nextOfKinRelationship: val }))
        }
        phone={formState.nextOfKinPhone}
        setPhone={(val) => setFormState((p) => ({ ...p, nextOfKinPhone: val }))}
        address={formState.nextOfKinAddress}
        setAddress={(val) =>
          setFormState((p) => ({ ...p, nextOfKinAddress: val }))
        }
      />

      {/* Section 6: Login Details & Account Status */}
      <FormSection
        title="Login Details & Account Status"
        icon={<KeyRound className="h-3.5 w-3.5" />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminTextField
            label="Portal Password *"
            value={formState.password}
            onChange={(e) =>
              setFormState((p) => ({ ...p, password: e.target.value }))
            }
            required
          />
          <AdminSelectField<AccountStatus>
            label="Account Status"
            value={formState.status}
            onChange={(val) => setFormState((p) => ({ ...p, status: val }))}
            options={ACCOUNT_STATUS_OPTIONS}
          />
        </div>
      </FormSection>
    </CustomForm>
  );
}

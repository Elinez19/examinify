"use client";

import * as React from "react";
import { KeyRound, Shield } from "lucide-react";
import {
  AdminSelectField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import {
  ACCOUNT_STATUS_OPTIONS,
  CustomForm,
  EmailDetailSection,
  EMPLOYMENT_TYPE_OPTIONS,
  FormSection,
  IdGeneratorField,
  MARITAL_STATUS_OPTIONS,
  NextOfKinSection,
  OriginLocationFields,
  PhoneDetailSection,
  PhotoUploadField,
  SCHOOL_BRANCH_OPTIONS,
  SEX_OPTIONS,
  STAFF_UNIT_OPTIONS,
  TEACHER_PREFIX_OPTIONS,
} from "@/components/forms";
import type { AccountStatus, StaffProfile } from "@/data/portal-mock-data";

export interface StaffRegistrationFormState {
  id: string;
  schoolBranch: string;
  staffCode: string;
  displayPrefix: string;
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
  roleTitle: string;
  departmentUnit: string;
  employmentType: string;
  employmentDate: string;
  adminScope: StaffProfile["adminScope"];
  permissions: string;
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

export function createInitialStaffFormState(
  staffCount: number
): StaffRegistrationFormState {
  return {
    id: "",
    schoolBranch: SCHOOL_BRANCH_OPTIONS[0].id,
    staffCode: `STF/ADM/${String(staffCount + 11).padStart(3, "0")}`,
    displayPrefix: "Mr.",
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
    roleTitle: "Examination Officer",
    departmentUnit: STAFF_UNIT_OPTIONS[0].id,
    employmentType: "Full-Time",
    employmentDate: "",
    adminScope: "kyc_moderator",
    permissions: "Exam Governance & Proctoring",
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
    password: "Admin@2026",
    status: "active",
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
    return `STF/ADM/${seq}`;
  };

  return (
    <CustomForm
      id="staff-registration-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Staff & Admin Registration Desk"
      title={
        isEditing
          ? "Edit Staff / Administrator Registration"
          : "Register Staff / Administrator"
      }
      description="Record staff bio-data, administrative role, governance permissions, contact details, and emergency next of kin."
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
            <AdminSelectField
              label="School Branch *"
              value={formState.schoolBranch}
              onChange={(val) =>
                setFormState((p) => ({ ...p, schoolBranch: val }))
              }
              options={SCHOOL_BRANCH_OPTIONS}
            />

            <IdGeneratorField
              label="Staff Code / ID"
              value={formState.staffCode}
              onChange={(val) =>
                setFormState((p) => ({ ...p, staffCode: val }))
              }
              onGenerate={generateStaffCode}
              placeholder="e.g. STF/ADM/012"
              required
            />

            <AdminSelectField
              label="Title *"
              value={formState.displayPrefix}
              onChange={(val) =>
                setFormState((p) => ({ ...p, displayPrefix: val }))
              }
              options={TEACHER_PREFIX_OPTIONS}
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

      {/* Section 2: Role, Unit & Permissions */}
      <FormSection
        title="Role, Administrative Unit & Permissions"
        icon={<KeyRound className="h-3.5 w-3.5" />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminTextField
            label="Role Title *"
            value={formState.roleTitle}
            onChange={(e) =>
              setFormState((p) => ({ ...p, roleTitle: e.target.value }))
            }
            placeholder="e.g. Chief Examination Officer"
            required
          />

          <AdminSelectField
            label="Department / Unit *"
            value={formState.departmentUnit}
            onChange={(val) =>
              setFormState((p) => ({ ...p, departmentUnit: val }))
            }
            options={STAFF_UNIT_OPTIONS}
          />

          <AdminSelectField<StaffProfile["adminScope"]>
            label="Governance Scope *"
            value={formState.adminScope}
            onChange={(val) =>
              setFormState((p) => ({ ...p, adminScope: val }))
            }
            options={[
              { id: "super_admin", label: "Super Admin (Full Governance)" },
              { id: "kyc_moderator", label: "Exam & Academic Moderator" },
              { id: "dispatch_support", label: "Support & Operations" },
            ]}
          />

          <AdminSelectField
            label="Employment Type *"
            value={formState.employmentType}
            onChange={(val) =>
              setFormState((p) => ({ ...p, employmentType: val }))
            }
            options={EMPLOYMENT_TYPE_OPTIONS}
          />

          <AdminTextField
            label="Employment Date"
            type="date"
            value={formState.employmentDate}
            onChange={(e) =>
              setFormState((p) => ({ ...p, employmentDate: e.target.value }))
            }
          />

          <AdminTextField
            label="Permissions Summary"
            value={formState.permissions}
            onChange={(e) =>
              setFormState((p) => ({ ...p, permissions: e.target.value }))
            }
            placeholder="e.g. Exam Governance & Proctoring"
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

      {/* Section 6: Portal Credentials */}
      <FormSection
        title="Portal Credentials & Account Status"
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

"use client";

import * as React from "react";
import { GraduationCap, KeyRound, Users } from "lucide-react";
import {
  AdminSelectField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import {
  ACCOUNT_STATUS_OPTIONS,
  COUNTRY_OPTIONS,
  CustomForm,
  EmailDetailSection,
  FormSection,
  IdGeneratorField,
  MARITAL_STATUS_OPTIONS,
  NIGERIAN_STATE_OPTIONS,
  OriginLocationFields,
  PhoneDetailSection,
  PhotoUploadField,
  RELATIONSHIP_OPTIONS,
  SCHOOL_BRANCH_OPTIONS,
  SEX_OPTIONS,
} from "@/components/forms";
import type {
  AcademicSessionTerm,
  AccountStatus,
  ClassArm,
} from "@/data/portal-mock-data";

export interface StudentRegistrationFormState {
  id: string;
  schoolBranch: string;
  admissionNo: string;
  firstName: string;
  middleName: string;
  lastName: string;
  sex: string;
  country: string;
  stateOfOrigin: string;
  cityOfResidence: string;
  dateOfBirth: string;
  photoDataUrl: string;
  classArmId: string;
  entrySession: string;
  password: string;
  status: AccountStatus;
  phoneType: string;
  phone: string;
  emailType: string;
  email: string;
  alternateEmail: string;
  parentId: string;
  parentFirstName: string;
  parentMiddleName: string;
  parentSurname: string;
  parentSex: string;
  parentRelationship: string;
  parentMaritalStatus: string;
  parentCountry: string;
  parentState: string;
}

export interface StudentRegistrationFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: StudentRegistrationFormState;
  setFormState: React.Dispatch<React.SetStateAction<StudentRegistrationFormState>>;
  classArms: ClassArm[];
  academicTerms: AcademicSessionTerm[];
  studentCount: number;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onPhotoError?: (message: string) => void;
  savedMessage?: string | null;
}

export function createInitialStudentFormState(
  classArms: ClassArm[],
  academicTerms: AcademicSessionTerm[],
  studentCount: number
): StudentRegistrationFormState {
  const activeTerm = academicTerms.find((t) => t.isActive) ?? academicTerms[0];
  return {
    id: "",
    schoolBranch: SCHOOL_BRANCH_OPTIONS[0].id,
    admissionNo: `EXM/2026/${String(studentCount + 45).padStart(3, "0")}`,
    firstName: "",
    middleName: "",
    lastName: "",
    sex: "Male",
    country: "Nigeria",
    stateOfOrigin: "FCT Abuja",
    cityOfResidence: "",
    dateOfBirth: "",
    photoDataUrl: "",
    classArmId: classArms[0]?.id ?? "arm_jss_3_superstars",
    entrySession: activeTerm
      ? `${activeTerm.session} · ${activeTerm.term}`
      : "2026/2027 · First Term",
    password: "Student@2026",
    status: "active",
    phoneType: "Father",
    phone: "",
    emailType: "Portal Primary",
    email: "",
    alternateEmail: "",
    parentId: "",
    parentFirstName: "",
    parentMiddleName: "",
    parentSurname: "",
    parentSex: "Male",
    parentRelationship: "Father",
    parentMaritalStatus: "Married",
    parentCountry: "Nigeria",
    parentState: "FCT Abuja",
  };
}

export function StudentRegistrationForm({
  formRef,
  open,
  onOpenChange,
  formState,
  setFormState,
  classArms,
  academicTerms,
  studentCount,
  onReset,
  onSubmit,
  onPhotoError,
  savedMessage,
}: StudentRegistrationFormProps) {
  const isEditing = Boolean(formState.id);

  const generateStudentId = () => {
    const seq = String(studentCount + Math.floor(100 + Math.random() * 899));
    return `EXM/2026/${seq}`;
  };

  const generateParentId = () => {
    const code = Math.floor(10000 + Math.random() * 89999);
    return `PAR/2026/${code}`;
  };

  const sessionOptions = academicTerms.map((term) => ({
    id: `${term.session} · ${term.term}`,
    label: `${term.session} · ${term.term}`,
  }));

  return (
    <CustomForm
      id="student-registration-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Student Registration Desk"
      title={isEditing ? "Edit Student Registration" : "Student Registration"}
      description="Complete student bio-data, entry class placement, contact channels, and parent/guardian details."
      isEditing={isEditing}
      editingBadgeText={formState.admissionNo || "Editing Student"}
      onResetToCreate={onReset}
      savedMessage={savedMessage}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel={isEditing ? "Save Student Record" : "Submit Registration"}
      cancelLabel="Cancel"
    >
      {/* Section 1: Student Information + Passport Photo */}
      <FormSection
        title="Student Information"
        subtitle="Fields marked * are required"
        icon={<GraduationCap className="h-3.5 w-3.5" />}
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-9">
            <IdGeneratorField
              label="Student ID"
              value={formState.admissionNo}
              onChange={(val) =>
                setFormState((p) => ({ ...p, admissionNo: val }))
              }
              onGenerate={generateStudentId}
              placeholder="e.g. EXM/2026/045"
              required
            />

            <AdminTextField
              label="First Name *"
              value={formState.firstName}
              onChange={(e) =>
                setFormState((p) => ({ ...p, firstName: e.target.value }))
              }
              placeholder="e.g. Chinedu"
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
              placeholder="e.g. Okafor"
              required
            />

            <AdminSelectField
              label="Sex *"
              value={formState.sex}
              onChange={(val) => setFormState((p) => ({ ...p, sex: val }))}
              options={SEX_OPTIONS}
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
              label="Student Photo"
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

      {/* Section 2: Student Entry Class & Portal Access */}
      <FormSection
        title="Student Entry Class & Portal Credentials"
        icon={<KeyRound className="h-3.5 w-3.5" />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminSelectField
            label="Class Name *"
            value={formState.classArmId}
            onChange={(val) =>
              setFormState((p) => ({ ...p, classArmId: val }))
            }
            options={classArms.map((arm) => ({
              id: arm.id,
              label: `${arm.name} (${arm.arm})`,
            }))}
          />

          <AdminSelectField
            label="Entry Session / Term"
            value={formState.entrySession}
            onChange={(val) =>
              setFormState((p) => ({ ...p, entrySession: val }))
            }
            options={
              sessionOptions.length > 0
                ? sessionOptions
                : [
                    {
                      id: "2026/2027 · First Term",
                      label: "2026/2027 · First Term",
                    },
                  ]
            }
          />

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

      {/* Section 3: Parent Phone Number */}
      <PhoneDetailSection
        title="Parent Phone Number"
        phoneType={formState.phoneType}
        setPhoneType={(val) => setFormState((p) => ({ ...p, phoneType: val }))}
        phone={formState.phone}
        setPhone={(val) => setFormState((p) => ({ ...p, phone: val }))}
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

      {/* Section 5: Parent Information */}
      <FormSection
        title="Parent / Guardian Information"
        icon={<Users className="h-3.5 w-3.5" />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <IdGeneratorField
            label="Parent ID"
            value={formState.parentId}
            onChange={(val) => setFormState((p) => ({ ...p, parentId: val }))}
            onGenerate={generateParentId}
            generateLabel="Generate ID"
            placeholder="e.g. PAR/2026/40219"
            required
          />

          <AdminTextField
            label="First Name *"
            value={formState.parentFirstName}
            onChange={(e) =>
              setFormState((p) => ({ ...p, parentFirstName: e.target.value }))
            }
            placeholder="Parent / guardian first name"
            required
          />

          <AdminTextField
            label="Middle Name"
            value={formState.parentMiddleName}
            onChange={(e) =>
              setFormState((p) => ({ ...p, parentMiddleName: e.target.value }))
            }
            placeholder="Optional middle name"
          />

          <AdminTextField
            label="Surname *"
            value={formState.parentSurname}
            onChange={(e) =>
              setFormState((p) => ({ ...p, parentSurname: e.target.value }))
            }
            placeholder="Parent / guardian surname"
            required
          />

          <AdminSelectField
            label="Sex"
            value={formState.parentSex}
            onChange={(val) =>
              setFormState((p) => ({ ...p, parentSex: val }))
            }
            options={SEX_OPTIONS}
          />

          <AdminSelectField
            label="Relationship *"
            value={formState.parentRelationship}
            onChange={(val) =>
              setFormState((p) => ({ ...p, parentRelationship: val }))
            }
            options={RELATIONSHIP_OPTIONS}
          />

          <AdminSelectField
            label="Marital Status"
            value={formState.parentMaritalStatus}
            onChange={(val) =>
              setFormState((p) => ({ ...p, parentMaritalStatus: val }))
            }
            options={MARITAL_STATUS_OPTIONS}
          />

          <AdminSelectField
            label="Parent / Guardian Country *"
            value={formState.parentCountry}
            onChange={(val) =>
              setFormState((p) => ({ ...p, parentCountry: val }))
            }
            options={COUNTRY_OPTIONS}
          />

          <AdminSelectField
            label="Parent / Guardian State *"
            value={formState.parentState}
            onChange={(val) =>
              setFormState((p) => ({ ...p, parentState: val }))
            }
            options={NIGERIAN_STATE_OPTIONS}
          />
        </div>
      </FormSection>
    </CustomForm>
  );
}

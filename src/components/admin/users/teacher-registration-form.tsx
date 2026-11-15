"use client";

import * as React from "react";
import { Briefcase, CheckCircle2, KeyRound, UserCheck } from "lucide-react";
import {
  AdminSelectField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import {
  ACCOUNT_STATUS_OPTIONS,
  CustomForm,
  DEPARTMENT_OPTIONS,
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
  TEACHER_PREFIX_OPTIONS,
} from "@/components/forms";
import type {
  AccountStatus,
  ClassArm,
  SubjectEnrollment,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

export interface TeacherRegistrationFormState {
  id: string;
  schoolBranch: string;
  staffId: string;
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
  department: string;
  qualification: string;
  employmentType: string;
  employmentDate: string;
  assignedClasses: string[];
  assignedSubjectIds: string[];
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

export interface TeacherRegistrationFormProps {
  formRef?: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: TeacherRegistrationFormState;
  setFormState: React.Dispatch<React.SetStateAction<TeacherRegistrationFormState>>;
  classArms: ClassArm[];
  subjects: SubjectEnrollment[];
  teacherCount: number;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onPhotoError?: (message: string) => void;
  savedMessage?: string | null;
}

export function createInitialTeacherFormState(
  classArms: ClassArm[],
  subjects: SubjectEnrollment[],
  teacherCount: number
): TeacherRegistrationFormState {
  return {
    id: "",
    schoolBranch: SCHOOL_BRANCH_OPTIONS[0].id,
    staffId: `STF/TCH/${String(teacherCount + 31).padStart(3, "0")}`,
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
    department: DEPARTMENT_OPTIONS[0].id,
    qualification: "B.Sc (Ed)",
    employmentType: "Full-Time",
    employmentDate: "",
    assignedClasses: classArms[0] ? [classArms[0].name] : [],
    assignedSubjectIds: subjects[0] ? [subjects[0].id] : [],
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
    password: "Teacher@2026",
    status: "active",
  };
}

export function TeacherRegistrationForm({
  formRef,
  open,
  onOpenChange,
  formState,
  setFormState,
  classArms,
  subjects,
  teacherCount,
  onReset,
  onSubmit,
  onPhotoError,
  savedMessage,
}: TeacherRegistrationFormProps) {
  const isEditing = Boolean(formState.id);

  const generateTeacherId = () => {
    const seq = String(teacherCount + Math.floor(100 + Math.random() * 899));
    return `STF/TCH/${seq}`;
  };

  return (
    <CustomForm
      id="teacher-registration-form"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Faculty Registration Desk"
      title={isEditing ? "Edit Teacher Registration" : "Teacher Registration"}
      description="Capture faculty bio-data, academic qualifications, subject/class allocations, contact channels, and emergency contact details."
      isEditing={isEditing}
      editingBadgeText={formState.staffId || "Editing Teacher"}
      onResetToCreate={onReset}
      savedMessage={savedMessage}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel={isEditing ? "Save Teacher Record" : "Submit Registration"}
      cancelLabel="Cancel"
    >
      {/* Section 1: Teacher Personal Information + Passport Photo */}
      <FormSection
        title="Teacher Information"
        subtitle="Fields marked * are required"
        icon={<UserCheck className="h-3.5 w-3.5" />}
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
              label="Teacher / Staff ID"
              value={formState.staffId}
              onChange={(val) => setFormState((p) => ({ ...p, staffId: val }))}
              onGenerate={generateTeacherId}
              placeholder="e.g. STF/TCH/031"
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
              placeholder="e.g. Emeka"
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
              label="Teacher Photo"
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

      {/* Section 2: Academic Department, Employment & Allocations */}
      <FormSection
        title="Academic Department & Teaching Allocations"
        icon={<Briefcase className="h-3.5 w-3.5" />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminSelectField
            label="Department *"
            value={formState.department}
            onChange={(val) =>
              setFormState((p) => ({ ...p, department: val }))
            }
            options={DEPARTMENT_OPTIONS}
          />

          <AdminTextField
            label="Highest Qualification"
            value={formState.qualification}
            onChange={(e) =>
              setFormState((p) => ({ ...p, qualification: e.target.value }))
            }
            placeholder="e.g. M.Sc Mathematics, PGDE"
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
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
              Assigned Class Arms
            </p>
            <div className="flex flex-wrap gap-2">
              {classArms.map((arm) => {
                const selected = formState.assignedClasses.includes(arm.name);
                return (
                  <button
                    key={arm.id}
                    type="button"
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        assignedClasses: selected
                          ? prev.assignedClasses.filter((c) => c !== arm.name)
                          : [...prev.assignedClasses, arm.name],
                      }))
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 font-display text-xs font-extrabold transition-colors cursor-pointer",
                      selected
                        ? "cta-surface-primary text-ink-on-blue"
                        : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 hover:bg-surface-mist"
                    )}
                  >
                    {selected && <CheckCircle2 className="h-3 w-3" />}
                    {arm.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
              Assigned Subjects
            </p>
            <div className="flex flex-wrap gap-2">
              {subjects.map((sub) => {
                const selected = formState.assignedSubjectIds.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        assignedSubjectIds: selected
                          ? prev.assignedSubjectIds.filter((id) => id !== sub.id)
                          : [...prev.assignedSubjectIds, sub.id],
                      }))
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors cursor-pointer",
                      selected
                        ? "bg-emerald-700 text-white"
                        : "border border-brand-200 bg-white text-brand-800 hover:bg-surface-mist"
                    )}
                  >
                    {selected && <CheckCircle2 className="h-3 w-3" />}
                    {sub.title} ({sub.code})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </FormSection>

      {/* Section 3: Phone Number Detail */}
      <PhoneDetailSection
        title="Teacher Phone Number"
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

      {/* Section 6: Portal Access */}
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

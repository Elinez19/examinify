"use client";

import * as React from "react";
import { Mail, MapPin, Phone, ShieldAlert } from "lucide-react";
import {
  AdminSelectField,
  AdminTextField,
} from "@/components/admin/ui/admin-form-controls";
import { FormSection } from "./form-section";
import {
  COUNTRY_OPTIONS,
  EMAIL_TYPE_OPTIONS,
  NIGERIAN_STATE_OPTIONS,
  PHONE_TYPE_OPTIONS,
  RELATIONSHIP_OPTIONS,
} from "./registration-options";

export interface OriginFieldsProps {
  country: string;
  setCountry: (v: string) => void;
  stateOfOrigin: string;
  setStateOfOrigin: (v: string) => void;
  cityOfResidence: string;
  setCityOfResidence: (v: string) => void;
  cityLabel?: string;
}

/**
 * Reusable Country / State / City fields shared across Student, Teacher, and Staff forms.
 */
export function OriginLocationFields({
  country,
  setCountry,
  stateOfOrigin,
  setStateOfOrigin,
  cityOfResidence,
  setCityOfResidence,
  cityLabel = "City of Residence",
}: OriginFieldsProps) {
  return (
    <>
      <AdminSelectField
        label="Country *"
        value={country}
        onChange={setCountry}
        options={COUNTRY_OPTIONS}
      />
      <AdminSelectField
        label="State of Origin *"
        value={stateOfOrigin}
        onChange={setStateOfOrigin}
        options={NIGERIAN_STATE_OPTIONS}
      />
      <AdminTextField
        label={cityLabel}
        leadingIcon={<MapPin className="h-3.5 w-3.5" />}
        value={cityOfResidence}
        onChange={(e) => setCityOfResidence(e.target.value)}
        placeholder="e.g. Guzape, Abuja"
      />
    </>
  );
}

export interface PhoneSectionProps {
  title?: string;
  phoneType: string;
  setPhoneType: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  alternatePhone?: string;
  setAlternatePhone?: (v: string) => void;
  showAlternate?: boolean;
}

export function PhoneDetailSection({
  title = "Phone Number Detail",
  phoneType,
  setPhoneType,
  phone,
  setPhone,
  alternatePhone = "",
  setAlternatePhone,
  showAlternate = false,
}: PhoneSectionProps) {
  return (
    <FormSection title={title} icon={<Phone className="h-3.5 w-3.5" />}>
      <div
        className={
          showAlternate
            ? "grid grid-cols-1 gap-4 sm:grid-cols-3"
            : "grid grid-cols-1 gap-4 sm:grid-cols-2"
        }
      >
        <AdminSelectField
          label="Type *"
          value={phoneType}
          onChange={setPhoneType}
          options={PHONE_TYPE_OPTIONS}
        />
        <AdminTextField
          label="Number *"
          type="tel"
          leadingIcon={<Phone className="h-3.5 w-3.5" />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+234 800 000 0000"
          required
        />
        {showAlternate && setAlternatePhone && (
          <AdminTextField
            label="Alternate Phone"
            type="tel"
            leadingIcon={<Phone className="h-3.5 w-3.5" />}
            value={alternatePhone}
            onChange={(e) => setAlternatePhone(e.target.value)}
            placeholder="Optional secondary line"
          />
        )}
      </div>
    </FormSection>
  );
}

export interface EmailSectionProps {
  title?: string;
  emailType: string;
  setEmailType: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  alternateEmail: string;
  setAlternateEmail: (v: string) => void;
}

export function EmailDetailSection({
  title = "Email Detail",
  emailType,
  setEmailType,
  email,
  setEmail,
  alternateEmail,
  setAlternateEmail,
}: EmailSectionProps) {
  return (
    <FormSection title={title} icon={<Mail className="h-3.5 w-3.5" />}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminSelectField
          label="Email Type *"
          value={emailType}
          onChange={setEmailType}
          options={EMAIL_TYPE_OPTIONS}
        />
        <AdminTextField
          label="Email *"
          type="email"
          leadingIcon={<Mail className="h-3.5 w-3.5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@school.edu.ng"
          required
        />
        <AdminTextField
          label="Alternate Email"
          type="email"
          leadingIcon={<Mail className="h-3.5 w-3.5" />}
          value={alternateEmail}
          onChange={(e) => setAlternateEmail(e.target.value)}
          placeholder="Optional backup email"
        />
      </div>
    </FormSection>
  );
}

export interface NextOfKinSectionProps {
  name: string;
  setName: (v: string) => void;
  relationship: string;
  setRelationship: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
}

export function NextOfKinSection({
  name,
  setName,
  relationship,
  setRelationship,
  phone,
  setPhone,
  address,
  setAddress,
}: NextOfKinSectionProps) {
  return (
    <FormSection
      title="Next of Kin / Emergency Contact"
      icon={<ShieldAlert className="h-3.5 w-3.5" />}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminTextField
          label="Full Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mrs. Ngozi Okonkwo"
          required
        />
        <AdminSelectField
          label="Relationship *"
          value={relationship}
          onChange={setRelationship}
          options={RELATIONSHIP_OPTIONS}
        />
        <AdminTextField
          label="Emergency Phone *"
          type="tel"
          leadingIcon={<Phone className="h-3.5 w-3.5" />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+234 800 000 0000"
          required
        />
        <AdminTextField
          label="Residential Address"
          leadingIcon={<MapPin className="h-3.5 w-3.5" />}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street / City"
        />
      </div>
    </FormSection>
  );
}

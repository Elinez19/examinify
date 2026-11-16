"use client";

import * as React from "react";
import { Camera, CheckCircle2, KeyRound, Save } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminTextField } from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { AVATAR_PRESETS } from "@/lib/portal-auth";
import { cn } from "@/lib/utils";

export function StudentProfileWorkspace() {
  const { store, updateStudentProfile } = usePortalStore();

  const [draftFirstName, setDraftFirstName] = React.useState<string | null>(
    null
  );
  const [draftLastName, setDraftLastName] = React.useState<string | null>(null);
  const [draftAvatarUrl, setDraftAvatarUrl] = React.useState<string | null>(
    null
  );
  const [profileMessage, setProfileMessage] = React.useState<string | null>(
    null
  );
  const [profileError, setProfileError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const firstName = draftFirstName ?? store.student.firstName;
  const lastName = draftLastName ?? store.student.lastName;
  const avatarUrl = draftAvatarUrl ?? store.student.avatarUrl ?? "avatar-1";

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileError("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }
    if (file.size > 1024 * 1024) {
      setProfileError("Profile picture must be smaller than 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraftAvatarUrl(reader.result);
        setProfileError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    setProfileMessage(null);
    setProfileError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setProfileError("First name and last name are both required.");
      return;
    }

    updateStudentProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      avatarUrl,
    });
    setDraftFirstName(null);
    setDraftLastName(null);
    setDraftAvatarUrl(null);
    setProfileMessage("Profile details and avatar updated.");
  };

  const previewName = `${firstName} ${lastName}`.trim() || store.student.name;

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow="Account Settings"
        eyebrowIcon="dot"
        headline="Profile Details."
        highlightWords={["Profile", "Details."]}
        subtitle={`Manage your display name and profile avatar picture for ${store.student.admissionNo}.`}
        primaryCta={{
          label: "Change Password",
          href: "/student/profile/password",
          variant: "primary",
          icon: <KeyRound className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Back to Overview",
          href: "/student",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <CustomForm
          id="student-profile-form"
          open
          eyebrow="Student Identity"
          title="Personal Details & Avatar"
          description="Update your first name, last name, and profile avatar picture."
          savedMessage={profileMessage}
          onSubmit={handleSaveProfile}
          submitLabel="Save Profile Details"
          submitIcon={<Save className="h-3.5 w-3.5" />}
        >
          <FormSection title="Profile Avatar">
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4">
              <AvatarBadge
                name={previewName}
                avatarUrl={avatarUrl}
                size="lg"
              />
              <div className="min-w-0 flex-1 space-y-2">
                <div>
                  <p className="font-display text-base font-extrabold text-brand-950">
                    {previewName}
                  </p>
                  <p className="text-xs font-medium text-ink-secondary">
                    {store.student.email} · {store.student.classLevel}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <CtaButton
                    type="button"
                    variant="secondary"
                    size="xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Upload Photo</span>
                  </CtaButton>
                  <div className="flex items-center gap-1.5">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        title={preset.label}
                        onClick={() => setDraftAvatarUrl(preset.id)}
                        className={cn(
                          "h-6 w-6 rounded-full bg-gradient-to-br transition-transform cursor-pointer",
                          preset.bg,
                          avatarUrl === preset.id
                            ? "scale-110 ring-2 ring-brand-950 ring-offset-2"
                            : "opacity-75 hover:opacity-100"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Full Name">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminTextField
                label="First Name *"
                value={firstName}
                onChange={(event) => setDraftFirstName(event.target.value)}
                placeholder="First name"
                required
              />
              <AdminTextField
                label="Last Name *"
                value={lastName}
                onChange={(event) => setDraftLastName(event.target.value)}
                placeholder="Last name"
                required
              />
            </div>

            {profileError && (
              <p className="mt-3 rounded-xl border border-accent-warm/40 bg-surface-mist px-3 py-2 text-xs font-semibold text-accent-warm-deep">
                {profileError}
              </p>
            )}
            {profileMessage && (
              <p className="mt-3 inline-flex w-full items-center gap-2 rounded-xl border border-accent-success/40 bg-accent-success/10 px-3 py-2 text-xs font-semibold text-brand-950">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-success" />
                {profileMessage}
              </p>
            )}
          </FormSection>
        </CustomForm>
      </AdminWorkspaceSlab>
    </div>
  );
}

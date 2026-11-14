"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Camera, CheckCircle2, KeyRound, Save, UserCheck } from "lucide-react";
import { AdminHeroBanner } from "@/components/admin/ui/admin-hero-banner";
import { AdminSectionCard } from "@/components/admin/ui/admin-section-card";
import { AdminTextField } from "@/components/admin/ui/admin-form-controls";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { AVATAR_PRESETS } from "@/lib/portal-auth";
import { cn } from "@/lib/utils";

export function StudentProfileWorkspace() {
  const { store, updateStudentProfile, changeStudentPassword } = usePortalStore();

  const [draftFirstName, setDraftFirstName] = React.useState<string | null>(null);
  const [draftLastName, setDraftLastName] = React.useState<string | null>(null);
  const [draftAvatarUrl, setDraftAvatarUrl] = React.useState<string | null>(null);
  const [profileMessage, setProfileMessage] = React.useState<string | null>(null);
  const [profileError, setProfileError] = React.useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordMessage, setPasswordMessage] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const firstName = draftFirstName ?? store.student.firstName;
  const lastName = draftLastName ?? store.student.lastName;
  const avatarUrl = draftAvatarUrl ?? store.student.avatarUrl ?? "avatar-1";

  const setFirstName = (val: string) => setDraftFirstName(val);
  const setLastName = (val: string) => setDraftLastName(val);
  const setAvatarUrl = (val: string) => setDraftAvatarUrl(val);

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
        setAvatarUrl(reader.result);
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

  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Complete all three password fields before saving.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    const result = changeStudentPassword(currentPassword, newPassword);
    if (!result.ok) {
      setPasswordError(result.error);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("Password changed successfully. Use your new password on your next sign-in.");
  };

  const previewName = `${firstName} ${lastName}`.trim() || store.student.name;

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        eyebrow="Account Settings"
        title="Profile Details"
        description={`Manage your display name, profile avatar picture, and sign-in password for ${store.student.admissionNo}.`}
        badgeLabel={store.student.classLevel}
        badgeTone="emerald"
        metrics={[
          { label: "Admission No", value: store.student.admissionNo },
          { label: "Class Arm", value: store.student.classLevel },
          { label: "Status", value: store.student.status === "active" ? "Active" : "Inactive" },
        ]}
        action={
          <Link
            href="/student"
            className="inline-flex items-center gap-2 rounded-pill border border-surface-porcelain/35 bg-surface-porcelain/15 px-4 py-2 font-display text-xs font-extrabold text-ink-on-blue transition-colors hover:bg-surface-porcelain/25"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Overview
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminSectionCard
          title="Personal Details & Avatar"
          description="Update your first name, last name, and profile avatar picture."
          action={<UserCheck className="h-4 w-4 text-brand-500" />}
        >
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-brand-100 bg-surface-pearl p-4">
              <AvatarBadge name={previewName} avatarUrl={avatarUrl} size="lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <div>
                  <p className="font-display text-base font-extrabold text-brand-950">
                    {previewName}
                  </p>
                  <p className="text-xs font-medium text-ink-secondary">
                    {store.student.email}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-900 hover:bg-brand-50 transition-colors cursor-pointer"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    Upload Photo
                  </button>
                  <div className="flex items-center gap-1.5">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        title={preset.label}
                        onClick={() => setAvatarUrl(preset.id)}
                        className={cn(
                          "h-6 w-6 rounded-full bg-gradient-to-br transition-transform cursor-pointer",
                          preset.bg,
                          avatarUrl === preset.id
                            ? "ring-2 ring-brand-950 ring-offset-2 scale-110"
                            : "opacity-75 hover:opacity-100"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminTextField
                label="First Name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="First name"
                required
              />
              <AdminTextField
                label="Last Name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Last name"
                required
              />
            </div>

            {profileError && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">
                {profileError}
              </p>
            )}
            {profileMessage && (
              <p className="inline-flex w-full items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {profileMessage}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="cta-surface-primary inline-flex items-center gap-2 rounded-pill px-5 py-2.5 font-display text-xs font-extrabold text-ink-on-blue transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Save Profile Details
              </button>
            </div>
          </form>
        </AdminSectionCard>

        <AdminSectionCard
          title="Change Password"
          description="Keep your CBT portal password private and up to date."
          action={<KeyRound className="h-4 w-4 text-brand-500" />}
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <AdminTextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
              required
            />
            <AdminTextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              required
            />
            <AdminTextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
              required
            />

            {passwordError && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">
                {passwordError}
              </p>
            )}
            {passwordMessage && (
              <p className="inline-flex w-full items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {passwordMessage}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="cta-surface-primary inline-flex items-center gap-2 rounded-pill px-5 py-2.5 font-display text-xs font-extrabold text-ink-on-blue transition-colors cursor-pointer"
              >
                <KeyRound className="h-3.5 w-3.5" />
                Update Password
              </button>
            </div>
          </form>
        </AdminSectionCard>
      </div>
    </div>
  );
}

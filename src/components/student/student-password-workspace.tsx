"use client";

import * as React from "react";
import { CheckCircle2, KeyRound, User } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminTextField } from "@/components/admin/ui/admin-form-controls";
import { CustomForm, FormSection } from "@/components/forms";
import { usePortalStore } from "@/hooks/portal/use-portal-store";

export function StudentPasswordWorkspace() {
  const { store, changeStudentPassword } = usePortalStore();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordMessage, setPasswordMessage] = React.useState<string | null>(
    null
  );
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

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
    setPasswordMessage(
      "Password changed successfully. Use your new password on your next sign-in."
    );
  };

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow="Account Settings"
        eyebrowIcon="dot"
        headline="Change Password."
        highlightWords={["Change", "Password."]}
        subtitle={`Keep your ${store.student.admissionNo} CBT portal password private and up to date.`}
        primaryCta={{
          label: "Profile Details",
          href: "/student/profile",
          variant: "primary",
          icon: <User className="h-4 w-4" />,
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
          id="student-password-form"
          open
          eyebrow="Portal Security"
          title="Update Sign-In Password"
          description="Verify your current password before setting a new minimum 6-character password."
          savedMessage={passwordMessage}
          onSubmit={handlePasswordSubmit}
          submitLabel="Update Password"
          submitIcon={<KeyRound className="h-3.5 w-3.5" />}
        >
          <FormSection title="Password Credentials">
            <div className="grid gap-4 sm:grid-cols-3">
              <AdminTextField
                label="Current Password *"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
                required
              />
              <AdminTextField
                label="New Password *"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                required
              />
              <AdminTextField
                label="Confirm New Password *"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                required
              />
            </div>

            {passwordError && (
              <p className="mt-3 rounded-xl border border-accent-warm/40 bg-surface-mist px-3 py-2 text-xs font-semibold text-accent-warm-deep">
                {passwordError}
              </p>
            )}
            {passwordMessage && (
              <p className="mt-3 inline-flex w-full items-center gap-2 rounded-xl border border-accent-success/40 bg-accent-success/10 px-3 py-2 text-xs font-semibold text-brand-950">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-success" />
                {passwordMessage}
              </p>
            )}
          </FormSection>
        </CustomForm>
      </AdminWorkspaceSlab>
    </div>
  );
}

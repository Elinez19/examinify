"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { ToolPattern } from "@/components/brand/exam-pattern";
import { BrandLogo } from "@/components/brand/logo";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { AdminTextField } from "@/components/admin/ui/admin-form-controls";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { getRoleHomePath } from "@/lib/portal-auth";

export function LoginForm() {
  const router = useRouter();
  const { authenticateUser } = usePortalStore();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    setSubmitting(true);
    const result = authenticateUser(email, password);
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    const nextPath = getRoleHomePath(result.role);
    router.replace(nextPath);
    router.refresh();
  };

  return (
    <div className="surface-gloss-card relative w-full max-w-md overflow-hidden rounded-card border-2 border-surface-porcelain">
      {/* Cobalt Signature Header Slab */}
      <div className="surface-slab-blue relative overflow-hidden px-6 py-5 sm:px-8 sm:py-6">
        <ToolPattern tone="on-blue" />
        <div className="relative z-10 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-sky rounded-xl"
          >
            <BrandLogo tone="on-blue" size="sm" />
          </Link>

          <PillBadge tone="porcelain" icon="shield">
            Protected
          </PillBadge>
        </div>

        <div className="relative z-10 mt-5">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-on-blue">
            Sign in to portal
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-medium text-ink-on-blue-muted">
            Enter your school credentials to access your Student, Teacher, or Administrator workspace.
          </p>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-surface-porcelain px-6 py-6 sm:px-8 sm:py-7">
        <AdminTextField
          id="login-email"
          label="School Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
          placeholder="name@school.examinify.ng"
          leadingIcon={<Mail className="h-4 w-4 text-brand-500" />}
        />

        <AdminTextField
          id="login-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter your password"
          leadingIcon={<Lock className="h-4 w-4 text-brand-500" />}
          trailingIcon={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="pointer-events-auto rounded-lg p-1 text-brand-500 transition-colors hover:bg-surface-mist hover:text-brand-800 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
        />

        {error && (
          <div
            role="alert"
            className="rounded-xl border-2 border-accent-warm/40 bg-accent-warm/10 px-3.5 py-2.5 text-xs font-bold text-accent-warm-deep"
          >
            {error}
          </div>
        )}

        <div className="pt-1">
          <CtaButton
            type="submit"
            variant="primary"
            size="md"
            trailingArrow
            disabled={submitting}
            className="w-full justify-center"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </CtaButton>
        </div>
      </form>

      {/* Footer Strip */}
      <div className="flex items-center justify-between border-t border-surface-frost bg-surface-pearl px-6 py-4 sm:px-8 text-xs font-semibold text-ink-secondary">
        <span>Greenfield Model Academy</span>
        <Link
          href="/"
          className="font-bold text-brand-700 transition-colors hover:text-brand-950 hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

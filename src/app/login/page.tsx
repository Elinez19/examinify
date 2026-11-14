import type { Metadata } from "next";
import { ToolPattern } from "@/components/brand/exam-pattern";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | Examinify CBT",
  description:
    "Sign in to your Examinify Student, Teacher, or School Administrator portal.",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-pearl px-4 py-10 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-55"
        style={{ backgroundImage: "url(/images/landing/pearl-bg.jpg)" }}
      />
      <div
        aria-hidden="true"
        className="contrast-halo-pearl pointer-events-none absolute inset-0 opacity-75"
      />
      <ToolPattern tone="on-light" />

      <div className="relative z-10 flex w-full justify-center">
        <LoginForm />
      </div>
    </main>
  );
}

"use client";

import * as React from "react";
import { CheckCircle2, Eye, Keyboard, ShieldCheck, Wifi } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminSelectPills } from "@/components/admin/ui/admin-form-controls";
import { useAdminToast } from "@/components/admin/ui/admin-toast";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";

export function StudentProfileWorkspace() {
  const { store, updateAccessibility } = usePortalStore();
  const toast = useAdminToast();
  const { student, accessibility } = store;

  const togglePref = (
    key: "highContrastOptions" | "showKeyboardHints" | "offlinePreloadEnabled",
    label: string
  ) => {
    const next = !accessibility[key];
    updateAccessibility({ [key]: next });
    toast.success(
      "Preference Updated",
      `${label} ${next ? "enabled" : "disabled"} for your CBT sessions.`
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow="Candidate Verification & Exam Comfort"
        eyebrowIcon="shield"
        headline="Candidate Slip & CBT Preferences."
        highlightWords={["Candidate", "Preferences."]}
        subtitle="Verify your school examination registration details and customize typography, contrast, and keyboard navigation inside the exam hall."
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Candidate Card */}
          <div className="lg:col-span-5 surface-slab-ink rounded-card border-2 border-brand-700 p-5 sm:p-6 text-ink-on-blue space-y-4">
            <div className="flex items-center justify-between">
              <PillBadge tone="porcelain" className="px-3 py-1 text-[11px]">
                Verified Candidate
              </PillBadge>
              <span className="font-mono text-xs font-bold text-accent-sky">
                {student.regNo}
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl font-extrabold">
                {student.name}
              </h2>
              <p className="text-xs font-semibold text-ink-on-blue-muted">
                {student.email}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-brand-700 bg-brand-950/50 p-3.5 text-xs">
              <div>
                <span className="block text-[10px] uppercase text-ink-on-blue-muted">
                  School
                </span>
                <span className="font-display font-extrabold">
                  {student.schoolName}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-ink-on-blue-muted">
                  Class Arm
                </span>
                <span className="font-display font-extrabold">
                  {student.classLevel}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-ink-on-blue-muted">
                  Campus
                </span>
                <span className="font-display font-extrabold">
                  {student.campus}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-ink-on-blue-muted">
                  Guardian Phone
                </span>
                <span className="font-display font-extrabold">
                  {student.guardianPhone}
                </span>
              </div>
            </div>
          </div>

          {/* Accessibility & Offline Controls */}
          <div className="lg:col-span-7 surface-gloss-card p-5 sm:p-6 space-y-5">
            <div>
              <h3 className="font-display text-lg font-extrabold text-brand-950">
                Exam Hall Accessibility & Sync
              </h3>
              <p className="text-xs font-medium text-ink-secondary">
                Changes apply immediately to `/exam/[examId]` on this device.
              </p>
            </div>

            <AdminSelectPills
              label="Question Text Size"
              columns={3}
              value={accessibility.fontSize}
              onChange={(val) => {
                updateAccessibility({ fontSize: val });
                toast.success("Font Scale Saved", `Exam text set to ${val}.`);
              }}
              options={[
                { id: "standard", label: "Standard (16px)" },
                { id: "large", label: "Large (18px)" },
                { id: "xlarge", label: "Extra Large (20px)" },
              ]}
            />

            <div className="space-y-2.5">
              {[
                {
                  key: "highContrastOptions" as const,
                  title: "High-Contrast Option Borders",
                  desc: "Stronger border outlines on MCQ choices and active question tiles.",
                  icon: <Eye className="h-4 w-4 text-brand-600" />,
                },
                {
                  key: "showKeyboardHints" as const,
                  title: "Show Keyboard Shortcut Badges",
                  desc: "Display A–D, N (Next), P (Prev), and F (Flag) key hints in the exam bar.",
                  icon: <Keyboard className="h-4 w-4 text-brand-600" />,
                },
                {
                  key: "offlinePreloadEnabled" as const,
                  title: "Pre-Cache Upcoming Exam Packs",
                  desc: "Keep scheduled papers synced locally so connection drops never interrupt timing.",
                  icon: <Wifi className="h-4 w-4 text-accent-success" />,
                },
              ].map((item) => {
                const enabled = accessibility[item.key];
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-3 rounded-2xl border-2 border-brand-100 bg-surface-pearl/70 p-3.5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-porcelain border border-brand-100">
                        {item.icon}
                      </span>
                      <div>
                        <p className="font-display text-xs sm:text-sm font-extrabold text-brand-950">
                          {item.title}
                        </p>
                        <p className="text-[11px] font-medium text-ink-secondary">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePref(item.key, item.title)}
                      className={
                        enabled
                          ? "cta-surface-primary inline-flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 font-display text-xs font-extrabold cursor-pointer shrink-0"
                          : "cta-surface-secondary inline-flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 font-display text-xs font-extrabold cursor-pointer shrink-0"
                      }
                    >
                      {enabled && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {enabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-brand-100 bg-brand-50/70 px-3.5 py-2.5 text-xs font-semibold text-brand-800">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-600" />
              <span>
                Need a name or class arm correction? Contact your school CBT administrator.
              </span>
            </div>
          </div>
        </div>
      </AdminWorkspaceSlab>
    </div>
  );
}


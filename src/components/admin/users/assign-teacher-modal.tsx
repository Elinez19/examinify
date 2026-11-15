"use client";

import * as React from "react";
import { CheckCircle2, UserCheck } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { CtaButton } from "@/components/landing/ui/cta-button";
import type {
  ClassArm,
  SubjectEnrollment,
  TeacherProfile,
} from "@/data/portal-mock-data";
import { cn } from "@/lib/utils";

export interface AssignTeacherModalProps {
  target: TeacherProfile | null;
  classesDraft: string[];
  setClassesDraft: React.Dispatch<React.SetStateAction<string[]>>;
  subjectsDraft: string[];
  setSubjectsDraft: React.Dispatch<React.SetStateAction<string[]>>;
  classArms: ClassArm[];
  subjects: SubjectEnrollment[];
  onClose: () => void;
  onConfirm: () => void;
}

export function AssignTeacherModal({
  target,
  classesDraft,
  setClassesDraft,
  subjectsDraft,
  setSubjectsDraft,
  classArms,
  subjects,
  onClose,
  onConfirm,
}: AssignTeacherModalProps) {
  return (
    <AdminModal
      open={Boolean(target)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      eyebrow="Teaching Assignments"
      title={
        target
          ? `Assign Classes & Subjects · ${target.name}`
          : "Assign Classes & Subjects"
      }
      description={
        target
          ? `Manage class arms and subjects allocated to ${target.staffId}.`
          : undefined
      }
      isEditing={Boolean(target)}
      editingBadgeText={target?.department}
      size="lg"
      footer={
        <>
          <CtaButton type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </CtaButton>
          <CtaButton type="button" variant="primary" size="sm" onClick={onConfirm}>
            <UserCheck className="h-3.5 w-3.5" />
            <span>Save Assignments</span>
          </CtaButton>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <p className="mb-2.5 font-display text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
            Assign Class Arms
          </p>
          <div className="flex flex-wrap gap-2">
            {classArms.map((arm) => {
              const selected = classesDraft.includes(arm.name);
              return (
                <button
                  key={arm.id}
                  type="button"
                  onClick={() =>
                    setClassesDraft((prev) =>
                      selected
                        ? prev.filter((item) => item !== arm.name)
                        : [...prev, arm.name]
                    )
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 font-display text-xs font-extrabold transition-colors cursor-pointer",
                    selected
                      ? "cta-surface-primary text-ink-on-blue"
                      : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 shadow-gloss-card hover:bg-surface-mist"
                  )}
                >
                  {selected && <CheckCircle2 className="h-3 w-3 text-accent-gold" />}
                  {arm.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-surface-frost pt-4">
          <p className="mb-2.5 font-display text-[11px] font-extrabold uppercase tracking-wider text-brand-900">
            Assign Subjects
          </p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((sub) => {
              const selected = subjectsDraft.includes(sub.id);
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() =>
                    setSubjectsDraft((prev) =>
                      selected
                        ? prev.filter((item) => item !== sub.id)
                        : [...prev, sub.id]
                    )
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 font-display text-xs font-extrabold transition-colors cursor-pointer",
                    selected
                      ? "border-2 border-accent-success bg-surface-porcelain text-brand-950 shadow-gloss-card"
                      : "border-2 border-brand-100 bg-surface-porcelain text-brand-800 hover:bg-surface-mist"
                  )}
                >
                  {selected && (
                    <CheckCircle2 className="h-3 w-3 text-accent-success" />
                  )}
                  {sub.title} ({sub.code})
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AdminModal>
  );
}

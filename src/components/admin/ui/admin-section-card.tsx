"use client";

import * as React from "react";
import { AdminWorkspaceSlab } from "@/components/admin/ui/admin-hero-banner";
import { cn } from "@/lib/utils";

export interface AdminSectionCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function AdminSectionCard({
  title,
  description,
  action,
  className,
  children,
}: AdminSectionCardProps) {
  return (
    <AdminWorkspaceSlab
      tone="pearl"
      className={cn("w-full", className)}
      innerClassName="p-4 sm:p-5 lg:p-6"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-brand-200/60 pb-3.5">
        <div className="min-w-0">
          <h2 className="font-display text-base sm:text-lg font-extrabold tracking-tight text-brand-950">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs font-medium text-ink-secondary">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </AdminWorkspaceSlab>
  );
}


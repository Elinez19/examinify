"use client";

import { Plus } from "lucide-react";
import { AdminHeroBanner, AdminWorkspaceSlab } from "@/components/admin/ui/admin-hero-banner";
import { AdminSearchInput } from "@/components/admin/ui/admin-form-controls";
import { AdminSegmentedTabs } from "@/components/admin/ui/admin-segmented-tabs";
import { useReviews } from "@/hooks/admin/use-feedback";
import { ReviewsKpiSummary } from "./feedback-kpi-summary";
import { ReviewModerationForm } from "./feedback-moderation-form";
import { ReviewsTable } from "./feedback-table";
import type { ReviewRecord } from "./types";

export interface ReviewsWorkspaceProps {
  initialReviews?: ReviewRecord[];
}

export function ReviewsWorkspace({ initialReviews }: ReviewsWorkspaceProps) {
  const {
    filtered,
    filter,
    setFilter,
    search,
    setSearch,
    selectedIds,
    tabOptions,
    verifiedCount,
    avgRating,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    verifySelected,
    deleteSelected,
    updateReviewStatus,
    deleteReview,
    formRef,
    formOpen,
    setFormOpen,
    editingId,
    clientName,
    setClientName,
    artisanName,
    setArtisanName,
    serviceTitle,
    setServiceTitle,
    rating,
    setRating,
    status,
    setStatus,
    comment,
    setComment,
    savedBanner,
    resetForm,
    loadReviewIntoForm,
    scrollToForm,
    handleSaveReview,
  } = useReviews(initialReviews);

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow="Student Feedback & Exam Quality"
        eyebrowIcon="dot"
        headline="Exam Feedback & Moderation."
        highlightWords={["Feedback", "Moderation."]}
        subtitle="Log, edit, and review student and teacher CBT experience feedback using the inline form and ledger below."
        primaryCta={{
          label: "Add CBT Feedback",
          onClick: () => {
            resetForm();
            scrollToForm();
          },
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "User Management Desk",
          href: "/admin/user-management",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <ReviewsKpiSummary
          avgRating={avgRating}
          verifiedCount={verifiedCount}
        />

        <ReviewModerationForm
          formRef={formRef}
          open={formOpen}
          onOpenChange={setFormOpen}
          editingId={editingId}
          clientName={clientName}
          setClientName={setClientName}
          artisanName={artisanName}
          setArtisanName={setArtisanName}
          serviceTitle={serviceTitle}
          setServiceTitle={setServiceTitle}
          rating={rating}
          setRating={setRating}
          status={status}
          setStatus={setStatus}
          comment={comment}
          setComment={setComment}
          savedMessage={savedBanner}
          onReset={resetForm}
          onSubmit={handleSaveReview}
        />

        <div className="mt-6 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <AdminSegmentedTabs
            options={tabOptions}
            value={filter}
            onChange={setFilter}
            ariaLabel="Filter feedback"
            layoutId="feedback-tab-pill"
          />

          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search student, teacher, or comment..."
          />
        </div>

        <ReviewsTable
          items={filtered}
          selectedIds={selectedIds}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectOne={toggleSelectOne}
          onClearSelection={clearSelection}
          onVerifySelected={verifySelected}
          onDeleteSelected={deleteSelected}
          onOpenCreate={() => {
            resetForm();
            scrollToForm();
          }}
          onLoadIntoForm={loadReviewIntoForm}
          onUpdateStatus={updateReviewStatus}
          onDelete={deleteReview}
        />
      </AdminWorkspaceSlab>
    </div>
  );
}


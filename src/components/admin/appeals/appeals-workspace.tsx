"use client";

import { Plus } from "lucide-react";
import { AdminHeroBanner, AdminWorkspaceSlab } from "@/components/admin/ui/admin-hero-banner";
import { AdminSearchInput } from "@/components/admin/ui/admin-form-controls";
import { AdminSegmentedTabs } from "@/components/admin/ui/admin-segmented-tabs";
import { useDisputes } from "@/hooks/admin/use-appeals";
import { DisputesKpiSummary } from "./appeals-kpi-summary";
import { DisputeCaseForm } from "./appeal-case-form";
import { DisputesTable } from "./appeals-table";
import type { DisputeItem } from "./types";

export interface DisputesWorkspaceProps {
  initialDisputes?: DisputeItem[];
}

export function DisputesWorkspace({ initialDisputes }: DisputesWorkspaceProps) {
  const {
    filtered,
    filter,
    setFilter,
    search,
    setSearch,
    selectedIds,
    tabOptions,
    openCount,
    frozenEscrow,
    resolvedCount,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    resolveSelected,
    deleteSelected,
    updateDisputeStatus,
    deleteDispute,
    formRef,
    formOpen,
    setFormOpen,
    editingId,
    editingCaseCode,
    bookingCode,
    setBookingCode,
    clientName,
    setClientName,
    artisanName,
    setArtisanName,
    serviceTitle,
    setServiceTitle,
    escrowAmount,
    setEscrowAmount,
    status,
    setStatus,
    reason,
    setReason,
    savedBanner,
    resetForm,
    loadDisputeIntoForm,
    scrollToForm,
    handleSaveDispute,
  } = useDisputes(initialDisputes);

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow="Student Script Appeals & Remarking"
        eyebrowIcon="shield"
        headline="Result Appeals & Script Review."
        highlightWords={["Appeals", "Script", "Review."]}
        subtitle="Log, review, and resolve student CBT result appeals and script remarking requests using the inline form below."
        primaryCta={{
          label: "Open Appeal Case",
          onClick: () => {
            resetForm();
            scrollToForm();
          },
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Open School Billing",
          href: "/admin/billing",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <DisputesKpiSummary
          openCount={openCount}
          frozenEscrow={frozenEscrow}
          resolvedCount={resolvedCount}
        />

        <DisputeCaseForm
          formRef={formRef}
          open={formOpen}
          onOpenChange={setFormOpen}
          editingId={editingId}
          editingCaseCode={editingCaseCode}
          bookingCode={bookingCode}
          setBookingCode={setBookingCode}
          clientName={clientName}
          setClientName={setClientName}
          artisanName={artisanName}
          setArtisanName={setArtisanName}
          serviceTitle={serviceTitle}
          setServiceTitle={setServiceTitle}
          escrowAmount={escrowAmount}
          setEscrowAmount={setEscrowAmount}
          status={status}
          setStatus={setStatus}
          reason={reason}
          setReason={setReason}
          savedMessage={savedBanner}
          onReset={resetForm}
          onSubmit={handleSaveDispute}
        />

        <div className="mt-6 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <AdminSegmentedTabs
            options={tabOptions}
            value={filter}
            onChange={setFilter}
            ariaLabel="Filter appeals by status"
            layoutId="appeals-tab-pill"
          />

          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search appeal code, exam, student, or teacher..."
          />
        </div>

        <DisputesTable
          items={filtered}
          selectedIds={selectedIds}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectOne={toggleSelectOne}
          onClearSelection={clearSelection}
          onResolveSelected={resolveSelected}
          onDeleteSelected={deleteSelected}
          onOpenCreate={() => {
            resetForm();
            scrollToForm();
          }}
          onLoadIntoForm={loadDisputeIntoForm}
          onUpdateStatus={updateDisputeStatus}
          onDelete={deleteDispute}
        />
      </AdminWorkspaceSlab>
    </div>
  );
}


"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import type { PaymentRow } from "@/components/admin/mock-data";
import { usePaymentFilters } from "@/hooks/admin/use-billing-filters";
import { usePaymentForm } from "@/hooks/admin/use-billing-form";
import { usePaymentsEscrow } from "@/hooks/admin/use-billing-ledger";
import { PaymentLedgerForm } from "./billing-ledger-form";
import { PaymentsEscrowTable } from "./billing-ledger-table";
import { PaymentsKpiSummary } from "./billing-kpi-summary";

export function PaymentsEscrowWorkspace({
  initialPayments,
}: {
  initialPayments: PaymentRow[];
}) {
  const {
    items,
    releasingId,
    saving,
    savedBanner,
    handleReleaseEscrow,
    updateEscrowStateLocal,
    deletePayment,
    savePayment,
    batchRelease,
    batchDelete,
    totalVolume,
    heldVolume,
    totalFee,
  } = usePaymentsEscrow(initialPayments);

  const {
    filter,
    setFilter,
    search,
    setSearch,
    selectedIds,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    tabOptions,
    filteredPayments,
  } = usePaymentFilters(items);

  const {
    formOpen,
    setFormOpen,
    formRef,
    formData,
    updateField,
    setPaymentMethod,
    setEscrowStatus,
    scrollToForm,
    resetForm,
    loadPaymentIntoForm,
  } = usePaymentForm();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await savePayment(formData);
    if (ok) {
      resetForm();
    }
  };

  const handleNewRecordClick = () => {
    resetForm();
    scrollToForm();
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow="School Licenses & Term Invoices"
        eyebrowIcon="dot"
        headline="Billing & License Ledger."
        highlightWords={["Billing", "License", "Ledger."]}
        subtitle="Manage school term licenses, campus deployment allocations, and invoice settlements using the inline form and ledger table below."
        primaryCta={{
          label: "Record License Invoice",
          onClick: handleNewRecordClick,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "CBT Exam Sessions",
          href: "/admin/exams",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        {/* Top 3 Escrow KPI Cards */}
        <PaymentsKpiSummary
          totalVolume={totalVolume}
          heldVolume={heldVolume}
          totalFee={totalFee}
          totalTransactionsCount={items.length}
        />

        {/* Inline Form to Add, Edit, and Manage Financials & Escrow Transactions */}
        <div className="mt-6">
          <PaymentLedgerForm
            formRef={formRef}
            open={formOpen}
            onOpenChange={setFormOpen}
            formData={formData}
            onUpdateField={updateField}
            onSetPaymentMethod={setPaymentMethod}
            onSetEscrowStatus={setEscrowStatus}
            onReset={resetForm}
            onSubmit={handleFormSubmit}
            saving={saving}
            savedMessage={savedBanner}
          />
        </div>

        {/* Payments Ledger Table */}
        <PaymentsEscrowTable
          filteredPayments={filteredPayments}
          totalFilteredCount={filteredPayments.length}
          selectedIds={selectedIds}
          tabOptions={tabOptions}
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectOne={toggleSelectOne}
          onClearSelection={clearSelection}
          onBatchRelease={() => {
            batchRelease(selectedIds);
            clearSelection();
          }}
          onBatchDelete={() => {
            batchDelete(selectedIds);
            clearSelection();
          }}
          onAddNewPayment={handleNewRecordClick}
          onEditPayment={loadPaymentIntoForm}
          onReleaseEscrow={handleReleaseEscrow}
          onUpdateEscrowState={updateEscrowStateLocal}
          onDeletePayment={(id) => {
            deletePayment(id, () => {
              if (formData.editingId === id) resetForm();
            });
          }}
          releasingId={releasingId}
        />
      </AdminWorkspaceSlab>
    </div>
  );
}


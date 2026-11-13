"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import type { BookingRow } from "@/components/admin/mock-data";
import { useBookingFilters } from "@/hooks/admin/use-exam-filters";
import { useBookingForm } from "@/hooks/admin/use-exam-form";
import { useBookingsDispatch } from "@/hooks/admin/use-exams-sessions";
import { BookingDispatchForm } from "./exam-session-form";
import { BookingDispatchTable } from "./exam-sessions-table";

export function BookingsDispatchWorkspace({
  initialBookings,
}: {
  initialBookings: BookingRow[];
}) {
  const {
    items,
    busyId,
    savedBanner,
    saving,
    updateBookingFields,
    deleteBooking,
    saveBooking,
    batchComplete,
    batchDelete,
  } = useBookingsDispatch(initialBookings);

  const {
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    selectedIds,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
    tabOptions,
    filteredBookings,
  } = useBookingFilters(items);

  const {
    formOpen,
    setFormOpen,
    formRef,
    editingId,
    editingCode,
    formData,
    updateField,
    setBookingStatus,
    setPaymentStatus,
    scrollToForm,
    resetForm,
    loadBookingIntoForm,
  } = useBookingForm();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await saveBooking(formData, editingId, editingCode);
    if (ok) {
      resetForm();
    }
  };

  const handleNewDispatchClick = () => {
    resetForm();
    scrollToForm();
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow="Offline-Ready CBT & Live Invigilation"
        eyebrowIcon="pin"
        headline="CBT Exams & Session Management."
        highlightWords={["Exams", "Session", "Management."]}
        subtitle="Schedule and monitor school CBT sessions using the inline form below, assign verified invigilators, and oversee resumption or script submission states."
        primaryCta={{
          label: "New Exam Session",
          onClick: handleNewDispatchClick,
          variant: "primary",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "School Billing",
          href: "/admin/billing",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        {/* Inline Form to Add, Edit & Manage Bookings */}
        <BookingDispatchForm
          formRef={formRef}
          open={formOpen}
          onOpenChange={setFormOpen}
          editingId={editingId}
          editingCode={editingCode}
          formData={formData}
          onUpdateField={updateField}
          onSetBookingStatus={setBookingStatus}
          onSetPaymentStatus={setPaymentStatus}
          onReset={resetForm}
          onSubmit={handleFormSubmit}
          saving={saving}
          savedMessage={savedBanner}
        />

        {/* Bookings Queue Table with Checkboxes, Filters & Actions */}
        <BookingDispatchTable
          filteredBookings={filteredBookings}
          totalFilteredCount={filteredBookings.length}
          selectedIds={selectedIds}
          tabOptions={tabOptions}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          search={search}
          onSearchChange={setSearch}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectOne={toggleSelectOne}
          onClearSelection={clearSelection}
          onBatchComplete={() => {
            batchComplete(selectedIds);
            clearSelection();
          }}
          onBatchDelete={() => {
            batchDelete(selectedIds);
            clearSelection();
          }}
          onAddNewBooking={handleNewDispatchClick}
          onEditBooking={loadBookingIntoForm}
          onUpdateBookingStatus={updateBookingFields}
          onDeleteBooking={(id) => {
            deleteBooking(id, () => {
              if (editingId === id) resetForm();
            });
          }}
          busyId={busyId}
        />
      </AdminWorkspaceSlab>
    </div>
  );
}


"use client";

import * as React from "react";
import { Clock, Flag, Megaphone, Radio, ShieldAlert } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminSearchInput } from "@/components/admin/ui/admin-form-controls";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import {
  AdminDialogModal,
  type ModalVariant,
} from "@/components/admin/ui/admin-dialog-modal";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { ProctorBroadcastModal } from "./proctor-broadcast-modal";

export function ProctoringWorkspace() {
  const {
    store,
    activeSessionTerm,
    extendCandidateTime,
    flagCandidateSession,
    forceSubmitCandidate,
    sendBroadcast,
  } = usePortalStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [broadcastModalOpen, setBroadcastModalOpen] = React.useState(false);
  const [broadcastMsg, setBroadcastMsg] = React.useState("");

  const [feedbackModal, setFeedbackModal] = React.useState<{
    variant: ModalVariant;
    eyebrow: string;
    title: string;
    description: string;
  } | null>(null);

  const q = searchQuery.trim().toLowerCase();
  const filteredCandidates = store.liveCandidates.filter(
    (cand) =>
      !q ||
      cand.studentName.toLowerCase().includes(q) ||
      cand.admissionNo.toLowerCase().includes(q) ||
      cand.seatLabel.toLowerCase().includes(q)
  );

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : "First Term · 2026/2027";

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Examination Governance · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Live Proctoring & Candidate Seats."
        highlightWords={["Live", "Proctoring"]}
        subtitle="Monitor focus-loss flags, adjust candidate timers, force submit scripts, or broadcast school-wide alerts via modal."
        primaryCta={{
          label: "Broadcast Alert",
          onClick: () => setBroadcastModalOpen(true),
          variant: "primary",
          icon: <Megaphone className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Exam Scheduling",
          href: "/admin/exams",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search candidate, admission no, or seat..."
          />
          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setBroadcastModalOpen(true)}
          >
            <Megaphone className="h-3.5 w-3.5" />
            <span>Broadcast Alert</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Proctoring Telemetry & Live Seats"
            subtitle="Track active candidates, tab switches, and remaining assessment duration."
            badge={`${filteredCandidates.length} seats`}
          >
            {filteredCandidates.length === 0 ? (
              <AdminEmptyState
                title="No Active Candidate Seats"
                description="No candidates matched your search query."
                icon={<Radio className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead>Candidate</AdminTableHead>
                    <AdminTableHead>Seat</AdminTableHead>
                    <AdminTableHead>Integrity Switches</AdminTableHead>
                    <AdminTableHead>Time Remaining</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead className="text-right">
                      Actions
                    </AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {filteredCandidates.map((cand) => (
                    <AdminTableRow key={cand.id}>
                      <AdminTableCell>
                        <p className="font-display font-extrabold text-brand-950">
                          {cand.studentName}
                        </p>
                        <p className="font-mono text-[11px] text-ink-secondary">
                          {cand.admissionNo}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell className="font-mono font-bold text-brand-800">
                        {cand.seatLabel}
                      </AdminTableCell>
                      <AdminTableCell className="font-bold text-brand-950">
                        {cand.tabSwitchCount} switch(es)
                      </AdminTableCell>
                      <AdminTableCell className="font-bold text-brand-900">
                        {cand.timeRemainingMinutes} mins
                      </AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusPill
                          status={cand.status}
                          variant={
                            cand.status === "flagged"
                              ? "danger"
                              : cand.status === "active"
                                ? "success"
                                : "neutral"
                          }
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Proctor ${cand.studentName}`}
                          items={[
                            {
                              id: "extend",
                              label: "Grant +5 Mins Extra Time",
                              icon: <Clock className="h-3.5 w-3.5" />,
                              disabled: cand.status === "submitted",
                              onClick: () => extendCandidateTime(cand.id, 5),
                            },
                            {
                              id: "flag",
                              label:
                                cand.status === "flagged"
                                  ? "Clear Proctor Flag"
                                  : "Flag Integrity Breach",
                              icon: <Flag className="h-3.5 w-3.5" />,
                              onClick: () => flagCandidateSession(cand.id),
                            },
                            {
                              id: "terminate",
                              label: "Force Submit Session",
                              icon: <ShieldAlert className="h-3.5 w-3.5" />,
                              variant: "danger",
                              dividerBefore: true,
                              disabled: cand.status === "submitted",
                              onClick: () => forceSubmitCandidate(cand.id),
                            },
                          ]}
                        />
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            )}
          </AdminDataTable>
        </div>
      </AdminWorkspaceSlab>

      <ProctorBroadcastModal
        open={broadcastModalOpen}
        onOpenChange={setBroadcastModalOpen}
        message={broadcastMsg}
        setMessage={setBroadcastMsg}
        onConfirm={() => {
          if (!broadcastMsg.trim()) return;
          const liveExamId =
            store.exams.find((ex) => ex.status === "live")?.id ??
            store.exams[0]?.id ??
            "exam_mth_midterm";
          sendBroadcast(liveExamId, broadcastMsg.trim(), "warning");
          setBroadcastMsg("");
          setBroadcastModalOpen(false);
          setFeedbackModal({
            variant: "success",
            eyebrow: "Broadcast Delivered",
            title: "Proctoring Notice Sent",
            description:
              "Your announcement has been pushed to all active candidate exam sessions.",
          });
        }}
      />

      <AdminDialogModal
        open={Boolean(feedbackModal)}
        onOpenChange={(open) => {
          if (!open) setFeedbackModal(null);
        }}
        variant={feedbackModal?.variant ?? "primary"}
        eyebrow={feedbackModal?.eyebrow}
        title={feedbackModal?.title ?? ""}
        description={feedbackModal?.description}
        confirmLabel="OK"
        cancelLabel="Close"
        onConfirm={() => setFeedbackModal(null)}
      />
    </div>
  );
}

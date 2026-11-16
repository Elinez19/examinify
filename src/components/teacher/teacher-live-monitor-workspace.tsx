"use client";

import * as React from "react";
import { Activity, Clock, Flag, Megaphone, ShieldAlert } from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import {
  AdminSearchInput,
  AdminSelectField,
} from "@/components/admin/ui/admin-form-controls";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminSortableTableHead,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  type SortDirection,
} from "@/components/admin/ui/admin-data-table";
import { AdminActionMenu } from "@/components/admin/ui/admin-action-menu";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import { AdminDialogModal } from "@/components/admin/ui/admin-dialog-modal";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { usePortalStore } from "@/hooks/portal/use-portal-store";
import { TeacherBroadcastModal } from "./teacher-broadcast-modal";

type MonitorSortKey =
  | "studentName"
  | "seatLabel"
  | "progressPercent"
  | "timeRemainingMinutes"
  | "status";

export function TeacherLiveMonitorWorkspace() {
  const {
    store,
    activeSessionTerm,
    extendCandidateTime,
    forceSubmitCandidate,
    flagCandidateSession,
    sendBroadcast,
  } = usePortalStore();

  const [monitorSearch, setMonitorSearch] = React.useState("");
  const [monitorStatusFilter, setMonitorStatusFilter] = React.useState("ALL");
  const [monitorSortKey, setMonitorSortKey] =
    React.useState<MonitorSortKey>("studentName");
  const [monitorSortDir, setMonitorSortDir] =
    React.useState<SortDirection>("asc");

  const [broadcastModalOpen, setBroadcastModalOpen] = React.useState(false);
  const [broadcastExamId, setBroadcastExamId] = React.useState(
    store.exams.find((e) => e.status === "live")?.id ?? store.exams[0]?.id ?? ""
  );
  const [broadcastMessage, setBroadcastMessage] = React.useState("");
  const [broadcastUrgency, setBroadcastUrgency] = React.useState<
    "info" | "warning"
  >("info");

  const [feedbackDialog, setFeedbackDialog] = React.useState<{
    variant: "success" | "warning";
    title: string;
    description: string;
  } | null>(null);

  const toggleMonitorSort = (key: MonitorSortKey) => {
    if (monitorSortKey === key)
      setMonitorSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setMonitorSortKey(key);
      setMonitorSortDir("asc");
    }
  };

  const handleBroadcastConfirm = () => {
    if (!broadcastMessage.trim() || !broadcastExamId) {
      setFeedbackDialog({
        variant: "warning",
        title: "Notice Incomplete",
        description:
          "Select a target examination and enter a notice message to broadcast.",
      });
      return;
    }
    sendBroadcast(broadcastExamId, broadcastMessage.trim(), broadcastUrgency);
    setBroadcastMessage("");
    setBroadcastModalOpen(false);
    setFeedbackDialog({
      variant: "success",
      title: "Invigilation Notice Broadcast",
      description:
        "Your notice has been delivered to active candidate workstations.",
    });
  };

  const filteredCandidates = React.useMemo(() => {
    const q = monitorSearch.trim().toLowerCase();
    const list = store.liveCandidates.filter((cand) => {
      if (monitorStatusFilter !== "ALL" && cand.status !== monitorStatusFilter)
        return false;
      if (!q) return true;
      return (
        (cand.studentName ?? "").toLowerCase().includes(q) ||
        (cand.admissionNo ?? "").toLowerCase().includes(q) ||
        (cand.seatLabel ?? "").toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (monitorSortKey === "studentName")
        cmp = (a.studentName ?? "").localeCompare(b.studentName ?? "");
      else if (monitorSortKey === "seatLabel")
        cmp = (a.seatLabel ?? "").localeCompare(b.seatLabel ?? "");
      else if (monitorSortKey === "progressPercent")
        cmp = (a.progressPercent ?? 0) - (b.progressPercent ?? 0);
      else if (monitorSortKey === "timeRemainingMinutes")
        cmp = (a.timeRemainingMinutes ?? 0) - (b.timeRemainingMinutes ?? 0);
      else if (monitorSortKey === "status")
        cmp = (a.status ?? "").localeCompare(b.status ?? "");
      return monitorSortDir === "asc" ? cmp : -cmp;
    });
  }, [
    monitorSearch,
    monitorSortDir,
    monitorSortKey,
    monitorStatusFilter,
    store.liveCandidates,
  ]);

  const termLabel = activeSessionTerm
    ? `${activeSessionTerm.term} · ${activeSessionTerm.session}`
    : store.teacher.termLabel;

  return (
    <div className="space-y-4">
      <AdminHeroBanner
        eyebrow={`Examinations · ${termLabel}`}
        eyebrowIcon="dot"
        headline="Live Invigilation Monitor."
        highlightWords={["Live", "Invigilation"]}
        subtitle="Track active workstations, extend candidate timing, flag focus switches, and broadcast notices via modal."
        primaryCta={{
          label: "Send Notice",
          onClick: () => setBroadcastModalOpen(true),
          variant: "primary",
          icon: <Megaphone className="h-4 w-4" />,
        }}
        secondaryCta={{
          label: "Assessments",
          href: "/teacher/exams",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <AdminSearchInput
              value={monitorSearch}
              onChange={setMonitorSearch}
              placeholder="Search candidate, seat, admission no..."
            />

            <AdminSelectField
              variant="filter"
              aria-label="Filter candidate status"
              value={monitorStatusFilter}
              onChange={setMonitorStatusFilter}
              options={[
                { id: "ALL", label: "All Candidates" },
                { id: "active", label: "Active" },
                { id: "flagged", label: "Flagged" },
                { id: "offline", label: "Offline Cache" },
                { id: "submitted", label: "Submitted" },
              ]}
            />
          </div>

          <CtaButton
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setBroadcastModalOpen(true)}
          >
            <Megaphone className="h-3.5 w-3.5" />
            <span>Send Notice</span>
          </CtaButton>
        </div>

        <div className="mt-4">
          <AdminDataTable
            title="Active Candidate Workstations"
            subtitle="Supervise candidate progress, focus switches, and remaining exam timers."
            badge={`${filteredCandidates.length} seats`}
          >
            {filteredCandidates.length === 0 ? (
              <AdminEmptyState
                title="No Candidate Seats Found"
                description="No live workstations match your current search or status filter."
                icon={<Activity className="h-5 w-5 text-accent-sky" />}
              />
            ) : (
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminSortableTableHead
                      label="Candidate"
                      sortKey="studentName"
                      activeSortKey={monitorSortKey}
                      sortDirection={monitorSortDir}
                      onSort={toggleMonitorSort}
                    />
                    <AdminSortableTableHead
                      label="Workstation"
                      sortKey="seatLabel"
                      activeSortKey={monitorSortKey}
                      sortDirection={monitorSortDir}
                      onSort={toggleMonitorSort}
                    />
                    <AdminSortableTableHead
                      label="Progress"
                      sortKey="progressPercent"
                      activeSortKey={monitorSortKey}
                      sortDirection={monitorSortDir}
                      onSort={toggleMonitorSort}
                    />
                    <AdminSortableTableHead
                      label="Time Left"
                      sortKey="timeRemainingMinutes"
                      activeSortKey={monitorSortKey}
                      sortDirection={monitorSortDir}
                      onSort={toggleMonitorSort}
                    />
                    <AdminSortableTableHead
                      label="Status"
                      sortKey="status"
                      activeSortKey={monitorSortKey}
                      sortDirection={monitorSortDir}
                      onSort={toggleMonitorSort}
                    />
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
                        <p className="text-[11px] font-medium text-ink-secondary">
                          {cand.admissionNo} · {cand.tabSwitchCount} focus
                          switch(es)
                        </p>
                      </AdminTableCell>
                      <AdminTableCell className="font-mono font-bold text-brand-800">
                        {cand.seatLabel}
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-brand-100">
                            <div
                              className="h-full rounded-full bg-brand-700"
                              style={{ width: `${cand.progressPercent}%` }}
                            />
                          </div>
                          <span className="font-bold">
                            {cand.progressPercent}%
                          </span>
                        </div>
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
                                : cand.status === "offline"
                                  ? "warning"
                                  : "neutral"
                          }
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-right">
                        <AdminActionMenu
                          ariaLabel={`Invigilate ${cand.studentName}`}
                          items={[
                            {
                              id: "extend",
                              label: "Extend Time (+5 mins)",
                              icon: <Clock className="h-3.5 w-3.5" />,
                              disabled: cand.status === "submitted",
                              onClick: () => extendCandidateTime(cand.id, 5),
                            },
                            {
                              id: "flag",
                              label:
                                cand.status === "flagged"
                                  ? "Clear Session Flag"
                                  : "Flag Session Integrity",
                              icon: <Flag className="h-3.5 w-3.5" />,
                              onClick: () => flagCandidateSession(cand.id),
                            },
                            {
                              id: "force",
                              label: "Force Submit Script",
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

      <TeacherBroadcastModal
        open={broadcastModalOpen}
        onOpenChange={setBroadcastModalOpen}
        exams={store.exams}
        examId={broadcastExamId}
        setExamId={setBroadcastExamId}
        urgency={broadcastUrgency}
        setUrgency={setBroadcastUrgency}
        message={broadcastMessage}
        setMessage={setBroadcastMessage}
        onConfirm={handleBroadcastConfirm}
      />

      <AdminDialogModal
        open={Boolean(feedbackDialog)}
        onOpenChange={(open) => {
          if (!open) setFeedbackDialog(null);
        }}
        variant={feedbackDialog?.variant ?? "success"}
        eyebrow={
          feedbackDialog?.variant === "warning" ? "Validation" : "Delivered"
        }
        title={feedbackDialog?.title ?? ""}
        description={feedbackDialog?.description}
        cancelLabel="Done"
      />
    </div>
  );
}

"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Megaphone,
  Plus,
  Send,
  ShieldAlert,
  WifiOff,
} from "lucide-react";
import {
  AdminHeroBanner,
  AdminWorkspaceSlab,
} from "@/components/admin/ui/admin-hero-banner";
import { AdminKpiCard } from "@/components/admin/ui/admin-kpi-card";
import { AdminStatusPill } from "@/components/admin/ui/admin-status-pill";
import {
  AdminDataTable,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/ui/admin-data-table";
import { useAdminToast } from "@/components/admin/ui/admin-toast";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { usePortalStore } from "@/hooks/portal/use-portal-store";

export function TeacherLiveMonitorWorkspace() {
  const {
    store,
    extendCandidateTime,
    forceSubmitCandidate,
    sendBroadcast,
  } = usePortalStore();
  const toast = useAdminToast();

  const monitorableExams = store.exams.filter(
    (e) => e.status === "live" || e.status === "scheduled"
  );
  const [selectedExamId, setSelectedExamId] = React.useState(
    monitorableExams[0]?.id ?? "exm_live_math"
  );
  const [announcement, setAnnouncement] = React.useState("");

  const candidates = React.useMemo(
    () =>
      store.liveCandidates.filter((c) => c.examId === selectedExamId),
    [store.liveCandidates, selectedExamId]
  );

  const broadcasts = React.useMemo(
    () => store.broadcasts.filter((b) => b.examId === selectedExamId),
    [store.broadcasts, selectedExamId]
  );

  const activeCount = candidates.filter((c) => c.status === "in_progress").length;
  const offlineCount = candidates.filter(
    (c) => c.status === "offline_cached"
  ).length;
  const flaggedCount = candidates.filter((c) => c.status === "flagged").length;
  const submittedCount = candidates.filter(
    (c) => c.status === "submitted"
  ).length;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    sendBroadcast(selectedExamId, announcement.trim());
    toast.success(
      "Broadcast Sent to Exam Room",
      "All active student exam screens now display your notice."
    );
    setAnnouncement("");
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <AdminHeroBanner
        eyebrow="Real-Time Exam Hall Invigilation"
        eyebrowIcon="dot"
        headline="Live Exam Room & Seat Monitor."
        highlightWords={["Live", "Monitor."]}
        subtitle="Track seated candidates, spot offline-cached terminals or focus switches, grant extra minutes, and broadcast hall announcements."
        primaryCta={{
          label: "Theory Grading",
          href: "/teacher/grading",
          variant: "secondary",
          trailingArrow: true,
        }}
      />

      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        {/* Exam Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="monitor-exam-select"
              className="font-display text-xs font-extrabold text-brand-950"
            >
              Active Room:
            </label>
            <select
              id="monitor-exam-select"
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="h-10 rounded-pill border-2 border-brand-200 bg-surface-porcelain px-4 font-display text-xs font-extrabold text-brand-950 shadow-gloss-card cursor-pointer"
            >
              {store.exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title} ({ex.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
          <PillBadge tone="sky" icon="dot" className="px-3 py-1 text-xs">
            {candidates.length} Seated Candidates
          </PillBadge>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <AdminKpiCard
            label="Active In Hall"
            value={String(activeCount)}
            numericValue={activeCount}
            badgeText="Connected Live"
            badgeTone="blue"
            tone="ink"
            icon={<Clock className="h-4 w-4 text-accent-gold" />}
          />
          <AdminKpiCard
            label="Offline Cached"
            value={String(offlineCount)}
            numericValue={offlineCount}
            badgeText="Saving Locally"
            badgeTone="sky"
            icon={<WifiOff className="h-4 w-4 text-brand-600" />}
          />
          <AdminKpiCard
            label="Focus Alerts"
            value={String(flaggedCount)}
            numericValue={flaggedCount}
            badgeText="Tab-Switch Flagged"
            badgeTone="porcelain"
            icon={<AlertTriangle className="h-4 w-4 text-accent-warm" />}
          />
          <AdminKpiCard
            label="Scripts Submitted"
            value={String(submittedCount)}
            numericValue={submittedCount}
            badgeText="Sealed & Synced"
            badgeTone="sky"
            icon={<CheckCircle2 className="h-4 w-4 text-accent-success" />}
          />
        </div>

        {/* Broadcast Bar */}
        <form
          onSubmit={handleBroadcast}
          className="mt-5 surface-gloss-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-3"
        >
          <div className="flex items-center gap-2 shrink-0">
            <Megaphone className="h-4 w-4 text-brand-600" />
            <span className="font-display text-xs sm:text-sm font-extrabold text-brand-950">
              Room Broadcast:
            </span>
          </div>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Send an instant banner notice to all candidates in this exam..."
            className="h-10 flex-1 rounded-pill border-2 border-brand-100 bg-surface-pearl px-4 font-sans text-xs sm:text-sm font-semibold text-brand-950 focus:border-brand-500 focus:outline-none"
          />
          <CtaButton variant="primary" size="xs" type="submit">
            <Send className="h-3.5 w-3.5" />
            Broadcast Notice
          </CtaButton>
        </form>

        {broadcasts.length > 0 && (
          <div className="mt-3 rounded-2xl border border-brand-100 bg-surface-porcelain px-4 py-2.5 text-xs font-semibold text-brand-800">
            Latest Notice ({broadcasts[0].sentAt}): {broadcasts[0].message}
          </div>
        )}

        {/* Candidates Table */}
        <div className="mt-5">
          <AdminDataTable
            title="Candidate Terminal Grid"
            subtitle="Extend time for disrupted terminals or force-submit completed seats."
            badge={`${candidates.length} Terminals`}
          >
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead>Candidate & Seat</AdminTableHead>
                  <AdminTableHead>Progress</AdminTableHead>
                  <AdminTableHead>Remaining</AdminTableHead>
                  <AdminTableHead>Focus Alerts</AdminTableHead>
                  <AdminTableHead>Status</AdminTableHead>
                  <AdminTableHead className="text-right">
                    Invigilator Actions
                  </AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {candidates.length === 0 ? (
                  <AdminTableRow>
                    <AdminTableCell colSpan={6} className="py-8 text-center">
                      <p className="font-display text-sm font-extrabold text-brand-950">
                        No live terminals seated for this paper yet
                      </p>
                    </AdminTableCell>
                  </AdminTableRow>
                ) : (
                  candidates.map((cand) => {
                    const pct =
                      cand.totalQuestions > 0
                        ? Math.round(
                            (cand.answeredCount / cand.totalQuestions) * 100
                          )
                        : 0;
                    const isDone = cand.status === "submitted";

                    return (
                      <AdminTableRow key={cand.id}>
                        <AdminTableCell>
                          <p className="font-display text-xs sm:text-sm font-extrabold text-brand-950">
                            {cand.studentName}
                          </p>
                          <p className="font-mono text-[11px] font-semibold text-ink-secondary">
                            {cand.seatNumber} · {cand.regNo}
                          </p>
                        </AdminTableCell>
                        <AdminTableCell>
                          <div className="w-32 space-y-1">
                            <div className="flex justify-between text-[11px] font-bold text-brand-950">
                              <span>
                                {cand.answeredCount}/{cand.totalQuestions}
                              </span>
                              <span>{pct}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-pill bg-brand-100">
                              <div
                                className="h-full rounded-pill bg-brand-600"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </AdminTableCell>
                        <AdminTableCell>
                          <span className="font-mono text-xs font-extrabold text-brand-950">
                            {isDone ? "0m" : `${cand.remainingMinutes}m`}
                          </span>
                          <p className="text-[10px] font-medium text-ink-muted">
                            {cand.lastSyncAgo}
                          </p>
                        </AdminTableCell>
                        <AdminTableCell>
                          {cand.tabSwitches > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-pill bg-surface-mist px-2.5 py-0.5 font-display text-[11px] font-extrabold text-accent-warm-deep border border-accent-warm">
                              <ShieldAlert className="h-3 w-3" />
                              {cand.tabSwitches} switch
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-ink-muted">
                              0 alerts
                            </span>
                          )}
                        </AdminTableCell>
                        <AdminTableCell>
                          <AdminStatusPill
                            status={
                              cand.status === "submitted"
                                ? "completed"
                                : cand.status === "flagged"
                                  ? "disputed"
                                  : cand.status === "offline_cached"
                                    ? "pending"
                                    : cand.status === "in_progress"
                                      ? "active"
                                      : "neutral"
                            }
                          />
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                          {!isDone && (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  extendCandidateTime(cand.id, 5);
                                  toast.success(
                                    "Time Extended (+5m)",
                                    `Added 5 minutes for ${cand.studentName}.`
                                  );
                                }}
                                className="inline-flex items-center gap-1 rounded-pill border border-brand-200 bg-surface-porcelain px-2.5 py-1 font-display text-[11px] font-extrabold text-brand-700 hover:bg-brand-50 cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                                5m
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  forceSubmitCandidate(cand.id);
                                  toast.warning(
                                    "Script Force-Submitted",
                                    `${cand.studentName}'s terminal was sealed.`
                                  );
                                }}
                                className="inline-flex items-center gap-1 rounded-pill border border-accent-warm bg-surface-mist px-2.5 py-1 font-display text-[11px] font-extrabold text-accent-warm-deep hover:bg-brand-50 cursor-pointer"
                              >
                                Force Submit
                              </button>
                            </div>
                          )}
                        </AdminTableCell>
                      </AdminTableRow>
                    );
                  })
                )}
              </AdminTableBody>
            </AdminTable>
          </AdminDataTable>
        </div>
      </AdminWorkspaceSlab>
    </div>
  );
}


"use client";

import { formatOpenStatus } from "@/lib/utils/opening-hours";
import { useOpenStatus } from "@/lib/hooks/useOpenStatus";
import type {
  LifecycleStatus,
  WeeklyOpeningHours,
} from "@/types/spot";

interface OpenStatusPanelProps {
  schedule: WeeklyOpeningHours;
  lifecycleStatus: LifecycleStatus;
  hasFridayPrayerBreak?: boolean;
}

export function OpenStatusPanel({
  schedule,
  lifecycleStatus,
  hasFridayPrayerBreak = false,
}: OpenStatusPanelProps) {
  const status = useOpenStatus(
    schedule,
    lifecycleStatus,
    hasFridayPrayerBreak
  );
  const copy = status ? formatOpenStatus(status) : null;
  const isPending = !status;
  const isOpen = status?.isOpenNow ?? false;
  const isFridayBreak = status?.kind === "friday_break";

  return (
    <div
      className="mt-3 flex w-full items-start gap-2.5 rounded-card border border-border bg-surface-pure px-3 py-2.5 sm:w-fit sm:min-w-[19rem] sm:px-3.5"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy={!status}
    >
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
          isPending
            ? "bg-text-subtle"
            : isOpen
            ? "bg-status-open-text"
            : isFridayBreak
              ? "bg-accent-terracotta"
              : "bg-status-closed-text"
        }`}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p
          className={`text-[13px] font-semibold leading-5 ${
            isPending
              ? "text-text-muted"
              : isOpen
              ? "text-status-open-text"
              : isFridayBreak
                ? "text-accent-terracotta"
                : "text-status-closed-text"
          }`}
        >
          {copy?.stateLabel ?? "Status operasional"}
        </p>
        <p className="mt-0.5 text-xs leading-4 text-text-muted">
          {copy?.detailLabel ?? "Memeriksa jam WIB"}
        </p>
      </div>
    </div>
  );
}

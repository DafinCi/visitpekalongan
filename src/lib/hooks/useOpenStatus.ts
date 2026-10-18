"use client";

import { useMemo } from "react";
import { calculateOpenStatus } from "@/lib/utils/opening-hours";
import type {
  LifecycleStatus,
  WeeklyOpeningHours,
} from "@/types/spot";
import { useNow } from "./useNow";

export function useOpenStatus(
  schedule?: WeeklyOpeningHours,
  lifecycleStatus: LifecycleStatus = "active",
  hasFridayPrayerBreak = false
) {
  const now = useNow();

  return useMemo(() => {
    if (!now || !schedule) return null;
    return calculateOpenStatus(
      schedule,
      lifecycleStatus,
      now,
      hasFridayPrayerBreak
    );
  }, [now, schedule, lifecycleStatus, hasFridayPrayerBreak]);
}

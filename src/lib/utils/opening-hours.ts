import type {
  DayOfWeek,
  LifecycleStatus,
  TimeSlot,
  WeeklyOpeningHours,
} from "../../types/spot";

const DAYS_ORDER: DayOfWeek[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export type OpenStatusKind =
  | "open"
  | "closed"
  | "friday_break"
  | "temporarily_closed"
  | "permanently_closed";

export interface OpenNextChange {
  action: "open" | "close";
  time: string;
  day: "today" | "tomorrow";
}

export interface OpenStatusResult {
  isOpenNow: boolean;
  kind: OpenStatusKind;
  nextChange: OpenNextChange | null;
}

export interface OpenStatusCopy {
  stateLabel: string;
  detailLabel: string | null;
  compactLabel: string;
  cardLabel: string;
}

/**
 * Mendapatkan representasi waktu WIB (UTC+7) dalam bentuk string HH:mm dan nama hari.
 */
function getWIBDateTime(date: Date): {
  currentDay: DayOfWeek;
  yesterdayDay: DayOfWeek;
  currentMinutes: number;
} {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
  });

  const parts = formatter.formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value || "00";
  const minute = parts.find((p) => p.type === "minute")?.value || "00";
  const weekday = (parts.find((p) => p.type === "weekday")?.value || "Sunday").toLowerCase();

  const currentDay = (
    DAYS_ORDER.includes(weekday as DayOfWeek) ? weekday : "sunday"
  ) as DayOfWeek;
  const currentIndex = DAYS_ORDER.indexOf(currentDay);
  const yesterdayIndex = (currentIndex - 1 + 7) % 7;
  const yesterdayDay = DAYS_ORDER[yesterdayIndex];

  return {
    currentDay,
    yesterdayDay,
    currentMinutes: Number(hour) * 60 + Number(minute),
  };
}

export function getWIBDay(date: Date): DayOfWeek {
  return getWIBDateTime(date).currentDay;
}

function timeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function sortSlots(slots: TimeSlot[]): TimeSlot[] {
  return [...slots].sort(
    (a, b) => timeToMinutes(a.open) - timeToMinutes(b.open)
  );
}

function getFirstOpenTime(schedule: WeeklyOpeningHours, day: DayOfWeek): string | null {
  const daySchedule = schedule[day];
  if (!daySchedule || daySchedule.is_closed || daySchedule.slots.length === 0) {
    return null;
  }
  return sortSlots(daySchedule.slots)[0]?.open ?? null;
}

/**
 * Algoritma Two-Day Sliding Window untuk menghitung status operasional tempat secara akurat,
 * termasuk tempat yang beroperasi melewati tengah malam (seperti Kopi Tahlil).
 */
export function calculateOpenStatus(
  schedule: WeeklyOpeningHours,
  lifecycleStatus: LifecycleStatus = "active",
  referenceDate: Date,
  hasFridayPrayerBreak = false
): OpenStatusResult {
  if (lifecycleStatus === "temporarily_closed") {
    return {
      isOpenNow: false,
      kind: "temporarily_closed",
      nextChange: null,
    };
  }

  if (lifecycleStatus === "permanently_closed") {
    return {
      isOpenNow: false,
      kind: "permanently_closed",
      nextChange: null,
    };
  }

  const { currentDay, yesterdayDay, currentMinutes } =
    getWIBDateTime(referenceDate);
  const todayIndex = DAYS_ORDER.indexOf(currentDay);
  const tomorrowDay = DAYS_ORDER[(todayIndex + 1) % 7];

  const yesterdaySchedule = schedule[yesterdayDay];
  if (yesterdaySchedule && !yesterdaySchedule.is_closed) {
    for (const slot of yesterdaySchedule.slots) {
      const openMinutes = timeToMinutes(slot.open);
      const closeMinutes = timeToMinutes(slot.close);
      if (closeMinutes < openMinutes && currentMinutes < closeMinutes) {
        return {
          isOpenNow: true,
          kind: "open",
          nextChange: {
            action: "close",
            time: slot.close,
            day: "today",
          },
        };
      }
    }
  }

  const todaySchedule = schedule[currentDay];
  const todaySlots =
    todaySchedule && !todaySchedule.is_closed
      ? sortSlots(todaySchedule.slots)
      : [];

  for (const slot of todaySlots) {
    const openMinutes = timeToMinutes(slot.open);
    const closeMinutes = timeToMinutes(slot.close);

    if (closeMinutes > openMinutes) {
      if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        return {
          isOpenNow: true,
          kind: "open",
          nextChange: {
            action: "close",
            time: slot.close,
            day: "today",
          },
        };
      }
    } else if (currentMinutes >= openMinutes) {
      return {
        isOpenNow: true,
        kind: "open",
        nextChange: {
          action: "close",
          time: slot.close,
          day: "tomorrow",
        },
      };
    }
  }

  const nextSlotToday = todaySlots.find(
    (slot) => timeToMinutes(slot.open) > currentMinutes
  );

  if (nextSlotToday) {
    const breakStarts = timeToMinutes("11:15");
    const isFridayBreak =
      hasFridayPrayerBreak &&
      currentDay === "friday" &&
      currentMinutes >= breakStarts &&
      timeToMinutes(nextSlotToday.open) >= timeToMinutes("13:00");

    return {
      isOpenNow: false,
      kind: isFridayBreak ? "friday_break" : "closed",
      nextChange: {
        action: "open",
        time: nextSlotToday.open,
        day: "today",
      },
    };
  }

  const tomorrowOpen = getFirstOpenTime(schedule, tomorrowDay);
  if (tomorrowOpen) {
    return {
      isOpenNow: false,
      kind: "closed",
      nextChange: {
        action: "open",
        time: tomorrowOpen,
        day: "tomorrow",
      },
    };
  }

  return {
    isOpenNow: false,
    kind: "closed",
    nextChange: null,
  };
}

export function formatOpenStatus(status: OpenStatusResult): OpenStatusCopy {
  const next = status.nextChange;
  const nextLabel =
    next === null
      ? null
      : `${next.action === "open" ? "Buka" : "Tutup"} ${next.time} WIB${
          next.day === "tomorrow" ? " besok" : ""
        }`;

  switch (status.kind) {
    case "open":
      return {
        stateLabel: "Buka sekarang",
        detailLabel: nextLabel,
        compactLabel: "Buka",
        cardLabel: "Buka",
      };
    case "friday_break":
      return {
        stateLabel: "Jeda salat Jumat",
        detailLabel: next ? `Buka lagi ${next.time} WIB` : null,
        compactLabel: "Jeda Jumat",
        cardLabel: next ? `Jeda Jumat · ${next.time}` : "Jeda Jumat",
      };
    case "temporarily_closed":
      return {
        stateLabel: "Tutup sementara",
        detailLabel: null,
        compactLabel: "Tutup sementara",
        cardLabel: "Tutup sementara",
      };
    case "permanently_closed":
      return {
        stateLabel: "Tutup permanen",
        detailLabel: null,
        compactLabel: "Tutup permanen",
        cardLabel: "Tutup permanen",
      };
    case "closed":
    default:
      return {
        stateLabel: "Tutup sekarang",
        detailLabel: nextLabel,
        compactLabel: "Tutup",
        cardLabel: next ? `Tutup · ${next.time}` : "Tutup",
      };
  }
}

/**
 * Menghasilkan tautan intent rute native Google Maps.
 */
export function getGoogleMapsIntentUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}


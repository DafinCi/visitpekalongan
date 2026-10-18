import { DayOfWeek, LifecycleStatus, WeeklyOpeningHours } from "@/types/spot";

const DAYS_ORDER: DayOfWeek[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const DAY_LABELS_ID: Record<DayOfWeek, string> = {
  sunday: "Minggu",
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
};

export interface OpenStatusResult {
  isOpenNow: boolean;
  statusLabel: string;
}

// Tanggal acuan deterministik untuk static prerender Next.js agar build SSG stabil (Senin 10:00 WIB)
const STATIC_PRERENDER_DATE = new Date("2026-03-02T10:00:00+07:00");

/**
 * Mendapatkan representasi waktu WIB (UTC+7) dalam bentuk string HH:mm dan nama hari.
 */
function getWIBDateTime(date?: Date): {
  currentDay: DayOfWeek;
  yesterdayDay: DayOfWeek;
  currentTimeString: string;
} {
  const targetDate =
    date ?? (typeof window === "undefined" ? STATIC_PRERENDER_DATE : new Date());

  // Buat formatter zona waktu Asia/Jakarta (WIB)
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "long",
  });

  const parts = formatter.formatToParts(targetDate);
  const hour = parts.find((p) => p.type === "hour")?.value || "00";
  const minute = parts.find((p) => p.type === "minute")?.value || "00";
  const weekday = (parts.find((p) => p.type === "weekday")?.value || "Sunday").toLowerCase();

  const currentDay = weekday as DayOfWeek;
  const currentIndex = DAYS_ORDER.indexOf(currentDay);
  const yesterdayIndex = (currentIndex - 1 + 7) % 7;
  const yesterdayDay = DAYS_ORDER[yesterdayIndex];

  return {
    currentDay,
    yesterdayDay,
    currentTimeString: `${hour}:${minute}`,
  };
}

/**
 * Algoritma Two-Day Sliding Window untuk menghitung status operasional tempat secara akurat,
 * termasuk tempat yang beroperasi melewati tengah malam (seperti Kopi Tahlil).
 */
export function calculateOpenStatus(
  schedule: WeeklyOpeningHours,
  lifecycleStatus: LifecycleStatus = "active",
  referenceDate?: Date,
  hasFridayPrayerBreak = false
): OpenStatusResult {
  if (lifecycleStatus === "temporarily_closed") {
    return {
      isOpenNow: false,
      statusLabel: "Tutup Sementara",
    };
  }

  if (lifecycleStatus === "permanently_closed") {
    return {
      isOpenNow: false,
      statusLabel: "Tutup Permanen",
    };
  }

  const dateToEvaluate =
    referenceDate ?? (typeof window === "undefined" ? STATIC_PRERENDER_DATE : new Date());
  const { currentDay, yesterdayDay, currentTimeString } = getWIBDateTime(dateToEvaluate);

  // Cek jeda ibadah Sholat Jumat (khusus hari Jumat pukul 11:30 - 13:00 WIB)
  if (
    hasFridayPrayerBreak &&
    currentDay === "friday" &&
    currentTimeString >= "11:30" &&
    currentTimeString < "13:00"
  ) {
    return {
      isOpenNow: false,
      statusLabel: "Jeda Sholat Jumat, buka 13:00",
    };
  }

  // 1. Cek luapan shift kemarin malam yang melewati tengah malam (misal buka 19:00, tutup 02:30)
  const yesterdaySchedule = schedule[yesterdayDay];
  if (yesterdaySchedule && !yesterdaySchedule.is_closed) {
    for (const slot of yesterdaySchedule.slots) {
      if (slot.close < slot.open) {
        // Shift melewati tengah malam
        if (currentTimeString < slot.close) {
          return {
            isOpenNow: true,
            statusLabel: `Buka hingga ${slot.close}`,
          };
        }
      }
    }
  }

  // 2. Cek slot jadwal aktif hari ini
  const todaySchedule = schedule[currentDay];
  if (!todaySchedule || todaySchedule.is_closed || todaySchedule.slots.length === 0) {
    return {
      isOpenNow: false,
      statusLabel: "Tutup hari ini",
    };
  }

  let nextSlotToday: string | null = null;

  for (const slot of todaySchedule.slots) {
    // Kasus A: Jam operasional standar dalam satu hari yang sama (misal 08:00 s.d. 22:00)
    if (slot.close > slot.open) {
      if (currentTimeString >= slot.open && currentTimeString < slot.close) {
        return {
          isOpenNow: true,
          statusLabel: `Buka hingga ${slot.close}`,
        };
      }
      if (currentTimeString < slot.open && !nextSlotToday) {
        nextSlotToday = slot.open;
      }
    } else {
      // Kasus B: Shift dimulai hari ini dan berakhir dini hari besok (misal 18:30 s.d. 02:00)
      if (currentTimeString >= slot.open) {
        return {
          isOpenNow: true,
          statusLabel: `Buka hingga ${slot.close}`,
        };
      }
      if (currentTimeString < slot.open && !nextSlotToday) {
        nextSlotToday = slot.open;
      }
    }
  }

  if (nextSlotToday) {
    return {
      isOpenNow: false,
      statusLabel: `Tutup, buka ${nextSlotToday}`,
    };
  }

  // Jika semua slot hari ini sudah lewat, cari jadwal besok
  const todayIndex = DAYS_ORDER.indexOf(currentDay);
  const tomorrowDay = DAYS_ORDER[(todayIndex + 1) % 7];
  const tomorrowSchedule = schedule[tomorrowDay];

  if (tomorrowSchedule && !tomorrowSchedule.is_closed && tomorrowSchedule.slots.length > 0) {
    return {
      isOpenNow: false,
      statusLabel: `Tutup, buka besok ${tomorrowSchedule.slots[0].open}`,
    };
  }

  return {
    isOpenNow: false,
    statusLabel: "Tutup",
  };
}

/**
 * Menghasilkan tautan intent rute native Google Maps.
 */
export function getGoogleMapsIntentUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}


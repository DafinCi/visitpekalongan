import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateOpenStatus,
  formatOpenStatus,
  getGoogleMapsIntentUrl,
  getWIBDay,
} from "../opening-hours.ts";
import type { DayOfWeek, WeeklyOpeningHours } from "../../../types/spot.ts";

function createEmptySchedule(): WeeklyOpeningHours {
  const days: DayOfWeek[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const schedule = {} as WeeklyOpeningHours;
  for (const day of days) {
    schedule[day] = { slots: [], is_closed: true };
  }
  return schedule;
}

function createStandardSchedule(
  open = "08:00",
  close = "17:00"
): WeeklyOpeningHours {
  const schedule = createEmptySchedule();
  const days: DayOfWeek[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  for (const day of days) {
    schedule[day] = {
      slots: [{ open, close }],
      is_closed: false,
    };
  }
  return schedule;
}

describe("opening-hours utility", () => {
  describe("getWIBDay", () => {
    it("converts UTC date to correct day in Western Indonesia Time (WIB / UTC+7)", () => {
      // 2026-10-18 18:00 UTC is 2026-10-19 01:00 WIB (Sunday UTC -> Monday WIB)
      const dateSundayUtc = new Date("2026-10-18T18:00:00Z");
      assert.equal(getWIBDay(dateSundayUtc), "monday");

      // 2026-10-23 03:00 UTC is 2026-10-23 10:00 WIB (Friday)
      const dateFridayUtc = new Date("2026-10-23T03:00:00Z");
      assert.equal(getWIBDay(dateFridayUtc), "friday");
    });
  });

  describe("calculateOpenStatus - lifecycle status overrides", () => {
    it("returns temporarily_closed when spot has temporarily_closed status", () => {
      const schedule = createStandardSchedule();
      const date = new Date("2026-10-20T03:00:00Z"); // 10:00 WIB
      const status = calculateOpenStatus(schedule, "temporarily_closed", date);

      assert.equal(status.isOpenNow, false);
      assert.equal(status.kind, "temporarily_closed");
      assert.equal(status.nextChange, null);

      const copy = formatOpenStatus(status);
      assert.equal(copy.stateLabel, "Tutup sementara");
      assert.equal(copy.detailLabel, null);
    });

    it("returns permanently_closed when spot has permanently_closed status", () => {
      const schedule = createStandardSchedule();
      const date = new Date("2026-10-20T03:00:00Z"); // 10:00 WIB
      const status = calculateOpenStatus(schedule, "permanently_closed", date);

      assert.equal(status.isOpenNow, false);
      assert.equal(status.kind, "permanently_closed");
      assert.equal(status.nextChange, null);

      const copy = formatOpenStatus(status);
      assert.equal(copy.stateLabel, "Tutup permanen");
      assert.equal(copy.detailLabel, null);
    });
  });

  describe("calculateOpenStatus - standard daytime shifts", () => {
    it("detects closed state before morning opening", () => {
      const schedule = createStandardSchedule("08:00", "17:00");
      // 06:30 WIB = 23:30 UTC previous day (2026-10-19T23:30:00Z -> 2026-10-20T06:30:00+07:00)
      const date = new Date("2026-10-19T23:30:00Z");
      const status = calculateOpenStatus(schedule, "active", date);

      assert.equal(status.isOpenNow, false);
      assert.equal(status.kind, "closed");
      assert.deepEqual(status.nextChange, {
        action: "open",
        time: "08:00",
        day: "today",
      });

      const copy = formatOpenStatus(status);
      assert.equal(copy.stateLabel, "Tutup sekarang");
      assert.equal(copy.detailLabel, "Buka 08:00 WIB");
      assert.equal(copy.cardLabel, "Tutup · 08:00");
    });

    it("detects open state during business hours", () => {
      const schedule = createStandardSchedule("08:00", "17:00");
      // 10:00 WIB = 03:00 UTC (2026-10-20T03:00:00Z)
      const date = new Date("2026-10-20T03:00:00Z");
      const status = calculateOpenStatus(schedule, "active", date);

      assert.equal(status.isOpenNow, true);
      assert.equal(status.kind, "open");
      assert.deepEqual(status.nextChange, {
        action: "close",
        time: "17:00",
        day: "today",
      });

      const copy = formatOpenStatus(status);
      assert.equal(copy.stateLabel, "Buka sekarang");
      assert.equal(copy.detailLabel, "Tutup 17:00 WIB");
      assert.equal(copy.compactLabel, "Buka");
      assert.equal(copy.cardLabel, "Buka");
    });

    it("detects closed state in the evening and points to tomorrow's opening", () => {
      const schedule = createStandardSchedule("08:00", "17:00");
      // 19:00 WIB = 12:00 UTC (2026-10-20T12:00:00Z)
      const date = new Date("2026-10-20T12:00:00Z");
      const status = calculateOpenStatus(schedule, "active", date);

      assert.equal(status.isOpenNow, false);
      assert.equal(status.kind, "closed");
      assert.deepEqual(status.nextChange, {
        action: "open",
        time: "08:00",
        day: "tomorrow",
      });

      const copy = formatOpenStatus(status);
      assert.equal(copy.stateLabel, "Tutup sekarang");
      assert.equal(copy.detailLabel, "Buka 08:00 WIB besok");
      assert.equal(copy.cardLabel, "Tutup · 08:00");
    });
  });

  describe("calculateOpenStatus - cross-midnight / sliding window logic", () => {
    const nightSpotSchedule = createEmptySchedule();
    // Opens 17:00 to 02:00 every day
    const days: DayOfWeek[] = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    for (const d of days) {
      nightSpotSchedule[d] = {
        slots: [{ open: "17:00", close: "02:00" }],
        is_closed: false,
      };
    }

    it("identifies evening opening with close set to tomorrow", () => {
      // Tuesday 21:00 WIB = 14:00 UTC (2026-10-20T14:00:00Z)
      const date = new Date("2026-10-20T14:00:00Z");
      const status = calculateOpenStatus(nightSpotSchedule, "active", date);

      assert.equal(status.isOpenNow, true);
      assert.equal(status.kind, "open");
      assert.deepEqual(status.nextChange, {
        action: "close",
        time: "02:00",
        day: "tomorrow",
      });

      const copy = formatOpenStatus(status);
      assert.equal(copy.detailLabel, "Tutup 02:00 WIB besok");
    });

    it("identifies early morning after midnight as still open from yesterday's slot", () => {
      // Wednesday 01:15 WIB = 18:15 UTC Tuesday (2026-10-20T18:15:00Z)
      const date = new Date("2026-10-20T18:15:00Z");
      const status = calculateOpenStatus(nightSpotSchedule, "active", date);

      assert.equal(status.isOpenNow, true);
      assert.equal(status.kind, "open");
      assert.deepEqual(status.nextChange, {
        action: "close",
        time: "02:00",
        day: "today",
      });

      const copy = formatOpenStatus(status);
      assert.equal(copy.detailLabel, "Tutup 02:00 WIB");
    });

    it("identifies closed state after cross-midnight closing time", () => {
      // Wednesday 03:30 WIB = 20:30 UTC Tuesday (2026-10-20T20:30:00Z)
      const date = new Date("2026-10-20T20:30:00Z");
      const status = calculateOpenStatus(nightSpotSchedule, "active", date);

      assert.equal(status.isOpenNow, false);
      assert.equal(status.kind, "closed");
      assert.deepEqual(status.nextChange, {
        action: "open",
        time: "17:00",
        day: "today",
      });
    });
  });

  describe("calculateOpenStatus - Friday prayer break", () => {
    // Friday with prayer break: morning slot 07:00-11:15, afternoon slot 13:00-21:00
    const fridaySchedule = createStandardSchedule("08:00", "21:00");
    fridaySchedule.friday = {
      slots: [
        { open: "07:00", close: "11:15" },
        { open: "13:00", close: "21:00" },
      ],
      is_closed: false,
    };

    it("triggers friday_break kind during Friday prayer hours when enabled", () => {
      // 2026-10-23 is Friday. 11:45 WIB = 04:45 UTC
      const date = new Date("2026-10-23T04:45:00Z");
      const status = calculateOpenStatus(
        fridaySchedule,
        "active",
        date,
        true // hasFridayPrayerBreak
      );

      assert.equal(status.isOpenNow, false);
      assert.equal(status.kind, "friday_break");
      assert.deepEqual(status.nextChange, {
        action: "open",
        time: "13:00",
        day: "today",
      });

      const copy = formatOpenStatus(status);
      assert.equal(copy.stateLabel, "Jeda salat Jumat");
      assert.equal(copy.detailLabel, "Buka lagi 13:00 WIB");
      assert.equal(copy.compactLabel, "Jeda Jumat");
      assert.equal(copy.cardLabel, "Jeda Jumat · 13:00");
    });

    it("falls back to standard closed kind if hasFridayPrayerBreak is false", () => {
      // 2026-10-23 11:45 WIB = 04:45 UTC
      const date = new Date("2026-10-23T04:45:00Z");
      const status = calculateOpenStatus(fridaySchedule, "active", date, false);

      assert.equal(status.isOpenNow, false);
      assert.equal(status.kind, "closed");
      assert.deepEqual(status.nextChange, {
        action: "open",
        time: "13:00",
        day: "today",
      });
    });
  });

  describe("calculateOpenStatus - completely closed schedule", () => {
    it("handles spot with no open slots throughout the week", () => {
      const schedule = createEmptySchedule();
      const date = new Date("2026-10-20T03:00:00Z");
      const status = calculateOpenStatus(schedule, "active", date);

      assert.equal(status.isOpenNow, false);
      assert.equal(status.kind, "closed");
      assert.equal(status.nextChange, null);

      const copy = formatOpenStatus(status);
      assert.equal(copy.stateLabel, "Tutup sekarang");
      assert.equal(copy.detailLabel, null);
      assert.equal(copy.cardLabel, "Tutup");
    });
  });

  describe("getGoogleMapsIntentUrl", () => {
    it("formats coordinates into official Google Maps navigation intent URL", () => {
      const url = getGoogleMapsIntentUrl(-6.8886, 109.6753);
      assert.equal(
        url,
        "https://www.google.com/maps/dir/?api=1&destination=-6.8886,109.6753"
      );
    });
  });
});


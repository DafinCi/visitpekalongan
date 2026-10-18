"use client";

import { Info } from "lucide-react";
import { DayOfWeek, WeeklyOpeningHours } from "@/types/spot";
import { getWIBDay } from "@/lib/utils/opening-hours";
import { useNow } from "@/lib/hooks/useNow";

interface ScheduleTableProps {
  schedule: WeeklyOpeningHours;
}

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

const ORDERED_DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function ScheduleTable({ schedule }: ScheduleTableProps) {
  const now = useNow();
  const currentDay = now ? getWIBDay(now) : null;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="p-4 sm:p-6 rounded-card bg-surface-pure border border-border">
        <div className="mb-4">
          <h2 className="font-display text-xl sm:text-2xl text-text-primary">
            Jadwal operasional
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            Semua jam dalam WIB (UTC+7)
          </p>
        </div>

        <table className="w-full table-fixed text-left text-[13px] sm:text-sm border-collapse">
          <caption className="sr-only">
            Jadwal operasional mingguan dalam WIB
          </caption>
          <colgroup>
            <col className="w-[42%]" />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-text-muted">
              <th className="py-2.5 pr-3 font-semibold">Hari</th>
              <th className="py-2.5 text-right font-semibold">
                Jam operasional
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {ORDERED_DAYS.map((day) => {
              const daySchedule = schedule[day];
              const isToday = currentDay !== null && day === currentDay;
              const slots =
                daySchedule && !daySchedule.is_closed
                  ? daySchedule.slots
                  : [];

              return (
                <tr
                  key={day}
                  aria-current={isToday ? "date" : undefined}
                  className={
                    isToday
                      ? "bg-accent-terracotta/[0.06] text-text-primary"
                      : "text-text-secondary"
                  }
                >
                  <th
                    scope="row"
                    className="py-3 pr-3 text-left align-top font-medium"
                  >
                    <span className="flex flex-wrap items-center gap-1.5">
                      {DAY_LABELS[day]}
                      {isToday && (
                        <span className="rounded-badge bg-accent-terracotta/10 px-1.5 py-0.5 text-[11px] font-semibold text-accent-terracotta">
                          Hari ini
                        </span>
                      )}
                    </span>
                  </th>
                  <td className="py-3 text-right align-top">
                    {slots.length > 0 ? (
                      <span className="flex flex-col items-end gap-0.5">
                        {slots.map((slot) => (
                          <span
                            key={`${slot.open}-${slot.close}`}
                            className="whitespace-nowrap"
                          >
                            {slot.open} - {slot.close}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-text-muted">Libur</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Catatan Khusus Operasional */}
        {schedule.notes && (
          <div className="mt-4 pt-4 border-t border-border flex items-start gap-2 text-xs text-text-muted leading-relaxed">
            <Info
              className="w-4 h-4 text-accent-terracotta shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p>
              <strong className="text-text-primary font-medium">
                Catatan Khusus:
              </strong>{" "}
              {schedule.notes}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

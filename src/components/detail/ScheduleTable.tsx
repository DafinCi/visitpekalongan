"use client";

import { useEffect, useState } from "react";
import { Clock, Info } from "lucide-react";
import { DayOfWeek, WeeklyOpeningHours } from "@/types/spot";

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

function getWIBDay(date: Date): DayOfWeek {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
  });
  return formatter.format(date).toLowerCase() as DayOfWeek;
}

export function ScheduleTable({ schedule }: ScheduleTableProps) {
  const [currentDay, setCurrentDay] = useState<DayOfWeek | null>(null);

  useEffect(() => {
    setCurrentDay(getWIBDay(new Date()));
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="p-6 rounded-card bg-surface-pure border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Clock
            className="w-4 h-4 text-accent-terracotta"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl sm:text-2xl text-text-primary">
            Jadwal Operasional Lengkap
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-text-muted">
                <th className="py-2.5 px-3 font-semibold">Hari</th>
                <th className="py-2.5 px-3 font-semibold">Jam Operasional</th>
                <th className="py-2.5 px-3 font-semibold text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {ORDERED_DAYS.map((day) => {
                const daySchedule = schedule[day];
                const isToday = currentDay !== null && day === currentDay;

                let hoursText = "Tutup";
                if (
                  daySchedule &&
                  !daySchedule.is_closed &&
                  daySchedule.slots.length > 0
                ) {
                  hoursText = daySchedule.slots
                    .map((slot) => `${slot.open} - ${slot.close}`)
                    .join(", ");
                }

                return (
                  <tr
                    key={day}
                    className={`transition-colors ${
                      isToday
                        ? "bg-accent-terracotta/5 font-semibold text-text-primary"
                        : "text-text-secondary hover:bg-canvas/50"
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span>{DAY_LABELS[day]}</span>
                        {isToday && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-button bg-accent-terracotta text-canvas">
                            Hari Ini
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">{hoursText}</td>
                    <td className="py-2.5 px-3 text-right">
                      {daySchedule && !daySchedule.is_closed ? (
                        <span className="text-xs text-accent-sage font-medium">
                          Buka
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">Libur</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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
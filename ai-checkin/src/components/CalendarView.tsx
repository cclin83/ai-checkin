"use client";

import { EnrichedSchedule } from "@/lib/client-store";

interface Props {
  schedule: EnrichedSchedule[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export default function CalendarView({ schedule, currentMonth, onMonthChange }: Props) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay(); // 0=Sun
  const totalDays = lastDay.getDate();

  const today = new Date().toISOString().split("T")[0];

  const scheduleMap: Record<string, EnrichedSchedule> = {};
  for (const s of schedule) {
    scheduleMap[s.date] = s;
  }

  const prevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-card-border/30 transition-colors text-muted hover:text-foreground"
        >
          ◀
        </button>
        <h3 className="text-lg font-semibold">
          {year}年{month + 1}月
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-card-border/30 transition-colors text-muted hover:text-foreground"
        >
          ▶
        </button>
      </div>

      {/* Week headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`pad-${idx}`} className="aspect-square" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const entry = scheduleMap[dateStr];
          const isToday = dateStr === today;

          return (
            <div
              key={dateStr}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all relative ${
                isToday ? "ring-2 ring-accent pulse-glow" : ""
              } ${
                entry
                  ? entry.completed
                    ? "bg-success/15 border border-success/30"
                    : "bg-card-bg border border-card-border"
                  : "bg-card-bg/30"
              }`}
            >
              <span className={`font-medium ${isToday ? "text-accent-light" : "text-foreground/70"}`}>
                {day}
              </span>
              {entry && (
                <div className="flex flex-col items-center mt-0.5">
                  <span className="text-xs leading-none">{entry.member_avatar}</span>
                  {entry.completed ? (
                    <span className="text-[10px] text-success mt-0.5">✓</span>
                  ) : (
                    isToday && <span className="text-[10px] text-warning mt-0.5">待打卡</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-muted justify-center">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-success/20 border border-success/40" /> 已打卡
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-card-bg border border-card-border" /> 未打卡
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded ring-2 ring-accent" /> 今天
        </span>
      </div>
    </div>
  );
}

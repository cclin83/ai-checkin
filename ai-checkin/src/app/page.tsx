"use client";

import { useState, useEffect, useCallback } from "react";
import { clientStore, MemberRow, EnrichedCheckin, EnrichedSchedule, Stats } from "@/lib/client-store";
import CheckinForm from "@/components/CheckinForm";
import Timeline from "@/components/Timeline";
import CalendarView from "@/components/CalendarView";
import StatsView from "@/components/StatsView";
import TeamView from "@/components/TeamView";

type Tab = "checkin" | "timeline" | "calendar" | "stats" | "team";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "checkin", label: "打卡", icon: "📝" },
  { key: "timeline", label: "时间线", icon: "📜" },
  { key: "calendar", label: "日历", icon: "📅" },
  { key: "stats", label: "统计", icon: "📊" },
  { key: "team", label: "团队", icon: "👥" },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("checkin");
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [checkins, setCheckins] = useState<EnrichedCheckin[]>([]);
  const [schedule, setSchedule] = useState<EnrichedSchedule[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [ready, setReady] = useState(false);

  const refreshAll = useCallback(() => {
    setMembers(clientStore.getMembers());
    setCheckins(clientStore.getCheckins({ limit: 50, offset: 0 }).checkins);
    const from = new Date();
    from.setDate(from.getDate() - 30);
    const to = new Date();
    to.setDate(to.getDate() + 30);
    setSchedule(clientStore.getSchedule(from.toISOString().split("T")[0], to.toISOString().split("T")[0]));
    setStats(clientStore.getStats());
  }, []);

  useEffect(() => {
    clientStore.init();
    refreshAll();
    setReady(true);
  }, [refreshAll]);

  const handleCheckinSubmit = () => refreshAll();
  const handleMemberAdded = () => refreshAll();

  const today = new Date().toISOString().split("T")[0];
  const todaySchedule = schedule.find((s) => s.date === today);

  if (!ready) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-card-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🧠</span>
              <div>
                <h1 className="text-lg font-bold leading-tight">AI 知识打卡</h1>
                <p className="text-xs text-muted">每天一点 AI，武装你的团队</p>
              </div>
            </div>
            {todaySchedule && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted">今日:</span>
                <span
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: todaySchedule.member_color + "20",
                    color: todaySchedule.member_color,
                  }}
                >
                  {todaySchedule.member_avatar} {todaySchedule.member_name}
                  {todaySchedule.completed ? " ✅" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 pb-24">
        {tab === "checkin" && (
          <div className="animate-fade-in">
            <div className="bg-card-bg border border-card-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                📝 今日打卡
                {todaySchedule && !todaySchedule.completed && (
                  <span className="text-xs text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                    轮到 {todaySchedule.member_name}
                  </span>
                )}
              </h2>
              <CheckinForm
                members={members}
                todayMemberId={todaySchedule?.member_id}
                onSubmit={handleCheckinSubmit}
              />
            </div>
          </div>
        )}

        {tab === "timeline" && (
          <div className="animate-fade-in">
            <Timeline checkins={checkins} />
          </div>
        )}

        {tab === "calendar" && (
          <div className="animate-fade-in">
            <div className="bg-card-bg border border-card-border rounded-2xl p-5">
              <CalendarView
                schedule={schedule}
                currentMonth={calendarMonth}
                onMonthChange={setCalendarMonth}
              />
            </div>
          </div>
        )}

        {tab === "stats" && (
          <div className="animate-fade-in">
            <StatsView stats={stats} />
          </div>
        )}

        {tab === "team" && (
          <div className="animate-fade-in">
            <TeamView
              members={members}
              schedule={schedule}
              onMemberAdded={handleMemberAdded}
            />
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card-bg/95 backdrop-blur-xl border-t border-card-border z-50">
        <div className="max-w-2xl mx-auto flex">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex flex-col items-center py-2.5 transition-all relative ${
                tab === t.key
                  ? "text-accent-light"
                  : "text-muted hover:text-foreground/70"
              }`}
            >
              <span className={`text-xl mb-0.5 ${tab === t.key ? "scale-110" : ""} transition-transform`}>
                {t.icon}
              </span>
              <span className="text-[10px] font-medium">{t.label}</span>
              {tab === t.key && (
                <span className="absolute top-0 w-8 h-0.5 bg-accent-light rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

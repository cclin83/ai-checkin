"use client";

import { useState } from "react";
import { Member, ScheduleEntry } from "@/lib/types";

interface Props {
  members: Member[];
  schedule: ScheduleEntry[];
  onMemberAdded: () => void;
}

const AVATAR_OPTIONS = ["🧑‍💻", "👩‍🔬", "🧑‍🎨", "👨‍🚀", "🧑‍🏫", "👩‍💼", "🧑‍🔧", "👨‍🍳", "🧑‍⚕️", "👩‍🎤", "🦊", "🐱", "🐶", "🐼", "🦄"];
const COLOR_OPTIONS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#14b8a6"];

export default function TeamView({ members, schedule, onMemberAdded }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🧑‍💻");
  const [color, setColor] = useState("#6366f1");
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const todaySchedule = schedule.find((s) => s.date === today);

  // Build upcoming schedule (next 7 days)
  const upcoming: ScheduleEntry[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const entry = schedule.find((s) => s.date === dateStr);
    if (entry) upcoming.push(entry);
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), avatar, color }),
      });
      setName("");
      setShowForm(false);
      onMemberAdded();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's duty */}
      {todaySchedule && (
        <div className="bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/30 rounded-2xl p-5 text-center">
          <p className="text-sm text-muted mb-2">今日轮值</p>
          <div className="flex items-center justify-center gap-3">
            <span
              className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: todaySchedule.member_color + "30" }}
            >
              {todaySchedule.member_avatar}
            </span>
            <div className="text-left">
              <p className="text-xl font-bold">{todaySchedule.member_name}</p>
              <p className="text-sm text-muted">
                {todaySchedule.completed ? "✅ 已完成打卡" : "⏳ 等待打卡中..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming schedule */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-muted mb-4">📅 未来7天排班</h3>
        <div className="space-y-2">
          {upcoming.map((entry) => {
            const d = new Date(entry.date + "T00:00:00");
            const isToday = entry.date === today;
            const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

            return (
              <div
                key={entry.date}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                  isToday
                    ? "bg-accent/10 border border-accent/30"
                    : "bg-background/50 border border-transparent hover:border-card-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted w-16">
                    {isToday ? "今天" : `${d.getMonth() + 1}/${d.getDate()}`}
                  </span>
                  <span className="text-xs text-muted/60 w-8">{dayNames[d.getDay()]}</span>
                  <span className="text-lg">{entry.member_avatar}</span>
                  <span className="text-sm font-medium">{entry.member_name}</span>
                </div>
                {entry.completed ? (
                  <span className="text-xs text-success">✅ 已打卡</span>
                ) : isToday ? (
                  <span className="text-xs text-warning">⏳ 待打卡</span>
                ) : (
                  <span className="text-xs text-muted">—</span>
                )}
              </div>
            );
          })}
          {upcoming.length === 0 && (
            <p className="text-center text-muted text-sm py-4">暂无排班数据</p>
          )}
        </div>
      </div>

      {/* Team members */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted">👥 团队成员</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs px-3 py-1.5 rounded-lg bg-accent/20 text-accent-light hover:bg-accent/30 transition-colors"
          >
            {showForm ? "取消" : "+ 添加成员"}
          </button>
        </div>

        {/* Add member form */}
        {showForm && (
          <form onSubmit={handleAddMember} className="mb-4 p-4 bg-background/50 rounded-xl space-y-3 animate-fade-in">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="成员名称"
              className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
              required
            />
            <div>
              <p className="text-xs text-muted mb-1.5">选择头像</p>
              <div className="flex flex-wrap gap-1.5">
                {AVATAR_OPTIONS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                      avatar === a ? "ring-2 ring-accent scale-110 bg-accent/20" : "bg-card-bg hover:bg-card-border/30"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted mb-1.5">选择颜色</p>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full transition-all ${
                      color === c ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="w-full py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-light disabled:opacity-40 transition-colors"
            >
              {submitting ? "添加中..." : "确认添加"}
            </button>
          </form>
        )}

        {/* Member list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex flex-col items-center p-4 rounded-xl bg-background/30 border border-card-border/50 hover:border-card-border transition-all"
            >
              <span
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2"
                style={{ backgroundColor: m.color + "25" }}
              >
                {m.avatar}
              </span>
              <span className="text-sm font-medium">{m.name}</span>
              <span
                className="w-2 h-2 rounded-full mt-1.5"
                style={{ backgroundColor: m.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

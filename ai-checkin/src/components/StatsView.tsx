"use client";

import { CATEGORIES } from "@/lib/types";
import { Stats } from "@/lib/client-store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

interface Props {
  stats: Stats | null;
}

const CHART_COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"];

export default function StatsView({ stats }: Props) {
  if (!stats) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-4xl mb-3">📊</p>
        <p>加载统计数据中...</p>
      </div>
    );
  }

  const categoryData = stats.byCategory.map((c) => ({
    name: CATEGORIES[c.category]?.label || c.category,
    value: c.count,
    emoji: CATEGORIES[c.category]?.emoji || "📌",
    color: CATEGORIES[c.category]?.color || "#6b7280",
  }));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card-bg border border-card-border rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-accent-light">{stats.totalCheckins}</p>
          <p className="text-xs text-muted mt-1">总打卡数</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-success">{stats.streak}</p>
          <p className="text-xs text-muted mt-1">连续打卡天数</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-warning">{stats.topTags.length}</p>
          <p className="text-xs text-muted mt-1">知识标签数</p>
        </div>
      </div>

      {/* Trend chart */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-muted mb-4">📈 打卡趋势（近30天）</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={stats.dailyCounts}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickFormatter={(v) => v.slice(5)}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a2e",
                border: "1px solid #2a2a4a",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              labelFormatter={(v) => `日期: ${v}`}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorCount)"
              name="打卡数"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category pie + Member bar side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category distribution */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-muted mb-4">📊 分类分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #2a2a4a",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value} 条`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {categoryData.map((c) => (
              <span key={c.name} className="text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                {c.emoji} {c.name} ({c.value})
              </span>
            ))}
          </div>
        </div>

        {/* Member contributions */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-muted mb-4">👥 成员贡献</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.byMember} layout="vertical">
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "#e8e8f0" }}
                width={50}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #2a2a4a",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value} 条`, "打卡数"]}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {stats.byMember.map((entry, index) => (
                  <Cell key={entry.id} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tag cloud */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-muted mb-4">🏷️ 热门标签</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {stats.topTags.map((tag, idx) => {
            const maxCount = stats.topTags[0]?.count || 1;
            const ratio = tag.count / maxCount;
            const size = 0.75 + ratio * 0.75; // 0.75rem to 1.5rem
            const opacity = 0.5 + ratio * 0.5;

            return (
              <span
                key={tag.name}
                className="tag-cloud-item px-3 py-1.5 rounded-full bg-accent/10 text-accent-light cursor-default"
                style={{
                  fontSize: `${size}rem`,
                  opacity,
                }}
                title={`${tag.count} 次`}
              >
                #{tag.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-muted mb-4">🔥 活跃热力图（近60天）</h3>
        <HeatmapGrid data={stats.heatmapData} members={stats.byMember} />
      </div>
    </div>
  );
}

function HeatmapGrid({
  data,
  members,
}: {
  data: Stats["heatmapData"];
  members: Stats["byMember"];
}) {
  // Build a set of all dates
  const dateSet = new Set<string>();
  for (const d of data) dateSet.add(d.date);
  const dates = Array.from(dateSet).sort();

  // Build lookup
  const lookup: Record<string, number> = {};
  for (const d of data) {
    lookup[`${d.member_name}-${d.date}`] = d.count;
  }

  if (dates.length === 0) {
    return <p className="text-center text-muted text-sm">暂无数据</p>;
  }

  // Show last 14 dates for readability
  const recentDates = dates.slice(-14);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Date headers */}
        <div className="flex">
          <div className="w-16 shrink-0" />
          {recentDates.map((d) => (
            <div key={d} className="flex-1 text-center text-[10px] text-muted">
              {d.slice(5)}
            </div>
          ))}
        </div>

        {/* Member rows */}
        {members.map((m) => (
          <div key={m.id} className="flex items-center mt-1">
            <div className="w-16 shrink-0 text-xs text-muted truncate pr-2">
              {m.avatar} {m.name}
            </div>
            {recentDates.map((d) => {
              const count = lookup[`${m.name}-${d}`] || 0;
              const intensity = count > 0 ? Math.min(count / 3, 1) : 0;

              return (
                <div key={d} className="flex-1 px-0.5">
                  <div
                    className="aspect-square rounded-sm transition-colors"
                    style={{
                      backgroundColor:
                        count > 0
                          ? `rgba(99, 102, 241, ${0.2 + intensity * 0.6})`
                          : "rgba(42, 42, 74, 0.3)",
                    }}
                    title={`${m.name} - ${d}: ${count} 条`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

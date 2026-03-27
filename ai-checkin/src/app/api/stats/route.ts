import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  // Total checkins
  const totalCheckins = db.prepare("SELECT COUNT(*) as count FROM checkins").get() as { count: number };

  // Checkins by category
  const byCategory = db.prepare(
    "SELECT category, COUNT(*) as count FROM checkins GROUP BY category ORDER BY count DESC"
  ).all();

  // Checkins by member
  const byMember = db.prepare(`
    SELECT m.id, m.name, m.avatar, m.color, COUNT(c.id) as count
    FROM members m
    LEFT JOIN checkins c ON m.id = c.member_id
    GROUP BY m.id
    ORDER BY count DESC
  `).all();

  // All tags aggregated
  const allCheckins = db.prepare("SELECT tags FROM checkins").all() as { tags: string }[];
  const tagCounts: Record<string, number> = {};
  for (const row of allCheckins) {
    try {
      const tags = JSON.parse(row.tags) as string[];
      for (const tag of tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    } catch {
      // skip malformed tags
    }
  }
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name, count]) => ({ name, count }));

  // Daily checkin counts for the last 30 days
  const dailyCounts = db.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM checkins
    WHERE created_at >= datetime('now', '-30 days')
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `).all();

  // Heatmap data: checkins per member per day (last 60 days)
  const heatmapData = db.prepare(`
    SELECT m.name as member_name, DATE(c.created_at) as date, COUNT(*) as count
    FROM checkins c
    JOIN members m ON c.member_id = m.id
    WHERE c.created_at >= datetime('now', '-60 days')
    GROUP BY m.name, DATE(c.created_at)
  `).all();

  // Streak: consecutive days with at least one checkin
  const allDates = db.prepare(`
    SELECT DISTINCT DATE(created_at) as date FROM checkins ORDER BY date DESC
  `).all() as { date: string }[];

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < allDates.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split("T")[0];
    if (allDates[i].date === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  return NextResponse.json({
    totalCheckins: totalCheckins.count,
    byCategory,
    byMember,
    topTags,
    dailyCounts,
    heatmapData,
    streak,
  });
}

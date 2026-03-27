"use client";

import { v4 as uuidv4 } from "uuid";

// Types
export interface MemberRow {
  id: string;
  name: string;
  avatar: string;
  color: string;
  created_at: string;
}

export interface CheckinRow {
  id: string;
  member_id: string;
  content: string;
  category: string;
  tags: string;
  source_url: string;
  created_at: string;
}

export interface ScheduleRow {
  id: string;
  member_id: string;
  date: string;
  completed: number;
}

export interface Stats {
  totalCheckins: number;
  byCategory: { category: string; count: number }[];
  byMember: { id: string; name: string; avatar: string; color: string; count: number }[];
  topTags: { name: string; count: number }[];
  dailyCounts: { date: string; count: number }[];
  heatmapData: { member_name: string; date: string; count: number }[];
  streak: number;
}

export interface EnrichedCheckin extends CheckinRow {
  member_name: string;
  member_avatar: string;
  member_color: string;
}

export interface EnrichedSchedule extends ScheduleRow {
  member_name: string;
  member_avatar: string;
  member_color: string;
}

// ── Seed data ──────────────────────────────────────────────

const SEED_MEMBERS: MemberRow[] = [
  { id: "m1", name: "小明", avatar: "🧑‍💻", color: "#6366f1", created_at: "2025-03-01 00:00:00" },
  { id: "m2", name: "小红", avatar: "👩‍🔬", color: "#ec4899", created_at: "2025-03-01 00:00:00" },
  { id: "m3", name: "小李", avatar: "🧑‍🎨", color: "#f59e0b", created_at: "2025-03-01 00:00:00" },
  { id: "m4", name: "小王", avatar: "👨‍🚀", color: "#10b981", created_at: "2025-03-01 00:00:00" },
  { id: "m5", name: "小张", avatar: "🧑‍🏫", color: "#3b82f6", created_at: "2025-03-01 00:00:00" },
];

const SEED_CHECKINS: CheckinRow[] = [
  { id: "c1",  member_id: "m1", content: "Claude 4 发布了，支持多模态推理和超长上下文窗口，对编程辅助场景提升巨大", category: "news",    tags: '["LLM","Claude","多模态"]',           source_url: "https://anthropic.com", created_at: "2025-03-13 09:00:00" },
  { id: "c2",  member_id: "m2", content: "试用了 Cursor 的 Agent 模式，可以自动读取项目结构并生成代码，效率提升明显", category: "insight", tags: '["AI编程","Cursor","Agent"]',           source_url: "",                      created_at: "2025-03-14 10:30:00" },
  { id: "c3",  member_id: "m3", content: "发现一个有趣的 AI 产品 Gamma，可以用 AI 自动生成精美 PPT，适合快速做汇报", category: "product", tags: '["AI产品","PPT","效率工具"]',            source_url: "https://gamma.app",     created_at: "2025-03-15 14:00:00" },
  { id: "c4",  member_id: "m4", content: "读了一篇关于 RAG 优化的论文，提出了 Adaptive RAG 方法，根据问题复杂度动态选择检索策略", category: "paper",   tags: '["RAG","论文","检索增强"]',            source_url: "",                      created_at: "2025-03-16 11:00:00" },
  { id: "c5",  member_id: "m5", content: "想法：能不能用 AI Agent 自动监控竞品动态，每天生成竞品分析报告？",             category: "idea",    tags: '["Agent","竞品分析","自动化"]',        source_url: "",                      created_at: "2025-03-17 16:00:00" },
  { id: "c6",  member_id: "m1", content: "OpenAI 推出了 GPT-4o 的图像生成功能，效果惊艳，可以生成高质量的插画和设计稿",  category: "news",    tags: '["GPT-4o","图像生成","OpenAI"]',      source_url: "",                      created_at: "2025-03-18 09:30:00" },
  { id: "c7",  member_id: "m2", content: "团队讨论：AI 代码审查工具的选型，对比了 CodeRabbit、Sourcery 和 Qodo",       category: "insight", tags: '["代码审查","工具选型","团队"]',        source_url: "",                      created_at: "2025-03-19 10:00:00" },
  { id: "c8",  member_id: "m3", content: "八卦：据说 Google DeepMind 在秘密研发 Gemini 3，性能将超越所有现有模型",      category: "gossip",  tags: '["Google","Gemini","八卦"]',          source_url: "",                      created_at: "2025-03-20 15:00:00" },
  { id: "c9",  member_id: "m4", content: "MCP (Model Context Protocol) 正在成为 AI 工具集成的标准协议，值得关注",       category: "news",    tags: '["MCP","协议","标准化"]',             source_url: "",                      created_at: "2025-03-21 11:30:00" },
  { id: "c10", member_id: "m5", content: "灵感：用 AI + 知识图谱做团队技能地图，自动识别团队能力缺口并推荐学习资源",       category: "idea",    tags: '["知识图谱","技能地图","学习"]',       source_url: "",                      created_at: "2025-03-22 14:30:00" },
  { id: "c11", member_id: "m1", content: "Anthropic 发布了 Claude Code，一个终端里的 AI 编程助手，支持直接操作文件系统",  category: "product", tags: '["Claude","编程","终端"]',            source_url: "",                      created_at: "2025-03-23 09:00:00" },
  { id: "c12", member_id: "m2", content: "学习了 Prompt Engineering 的最新技巧：Chain of Draft，比 Chain of Thought 更高效", category: "insight", tags: '["Prompt","技巧","CoD"]',        source_url: "",                      created_at: "2025-03-24 10:00:00" },
  { id: "c13", member_id: "m3", content: "Midjourney V7 发布，支持视频生成了！创意行业要被颠覆",                        category: "news",    tags: '["Midjourney","视频生成","创意"]',     source_url: "",                      created_at: "2025-03-25 13:00:00" },
  { id: "c14", member_id: "m4", content: "想法：做一个 AI 驱动的每日站会助手，自动总结昨日进展和今日计划",                 category: "idea",    tags: '["Agent","站会","项目管理"]',         source_url: "",                      created_at: "2025-03-26 11:00:00" },
];

function buildSchedule(): ScheduleRow[] {
  const memberIds = ["m1", "m2", "m3", "m4", "m5"];
  const rows: ScheduleRow[] = [];
  const today = new Date();
  for (let i = -14; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const memberIdx = ((i % memberIds.length) + memberIds.length) % memberIds.length;
    rows.push({
      id: `s${i + 15}`,
      member_id: memberIds[memberIdx],
      date: dateStr,
      completed: i < 0 ? 1 : 0,
    });
  }
  return rows;
}

// ── localStorage helpers ───────────────────────────────────

const KEYS = {
  members: "ai-checkin-members",
  checkins: "ai-checkin-checkins",
  schedule: "ai-checkin-schedule",
  initialized: "ai-checkin-initialized",
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

function ensureInitialized() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEYS.initialized)) return;
  save(KEYS.members, SEED_MEMBERS);
  save(KEYS.checkins, SEED_CHECKINS);
  save(KEYS.schedule, buildSchedule());
  localStorage.setItem(KEYS.initialized, "1");
}

// ── Public API ─────────────────────────────────────────────

export const clientStore = {
  init() {
    ensureInitialized();
  },

  // Members
  getMembers(): MemberRow[] {
    return load<MemberRow[]>(KEYS.members, []).sort((a, b) => a.created_at.localeCompare(b.created_at));
  },

  addMember(m: Omit<MemberRow, "id" | "created_at">) {
    const members = load<MemberRow[]>(KEYS.members, []);
    const row: MemberRow = {
      id: uuidv4(),
      ...m,
      created_at: new Date().toISOString().replace("T", " ").slice(0, 19),
    };
    members.push(row);
    save(KEYS.members, members);
    return row;
  },

  getMemberById(id: string): MemberRow | undefined {
    return load<MemberRow[]>(KEYS.members, []).find((m) => m.id === id);
  },

  // Checkins
  getCheckins(opts: { limit: number; offset: number; member_id?: string }): { checkins: EnrichedCheckin[]; total: number } {
    let list = load<CheckinRow[]>(KEYS.checkins, []);
    if (opts.member_id) list = list.filter((c) => c.member_id === opts.member_id);
    list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    const total = list.length;
    const sliced = list.slice(opts.offset, opts.offset + opts.limit);
    const members = load<MemberRow[]>(KEYS.members, []);
    const enriched = sliced.map((c) => {
      const m = members.find((mm) => mm.id === c.member_id);
      return { ...c, member_name: m?.name || "", member_avatar: m?.avatar || "", member_color: m?.color || "" };
    });
    return { checkins: enriched, total };
  },

  addCheckin(c: { member_id: string; content: string; category: string; tags: string[]; source_url: string }) {
    const checkins = load<CheckinRow[]>(KEYS.checkins, []);
    const row: CheckinRow = {
      id: uuidv4(),
      member_id: c.member_id,
      content: c.content,
      category: c.category,
      tags: JSON.stringify(c.tags),
      source_url: c.source_url,
      created_at: new Date().toISOString().replace("T", " ").slice(0, 19),
    };
    checkins.push(row);
    save(KEYS.checkins, checkins);

    // Mark today's schedule as completed
    const today = new Date().toISOString().split("T")[0];
    const schedule = load<ScheduleRow[]>(KEYS.schedule, []);
    const entry = schedule.find((s) => s.member_id === c.member_id && s.date === today);
    if (entry) {
      entry.completed = 1;
      save(KEYS.schedule, schedule);
    }

    return row;
  },

  // Schedule
  getSchedule(from?: string, to?: string): EnrichedSchedule[] {
    let list = load<ScheduleRow[]>(KEYS.schedule, []);
    if (from && to) list = list.filter((s) => s.date >= from && s.date <= to);
    list.sort((a, b) => a.date.localeCompare(b.date));
    const members = load<MemberRow[]>(KEYS.members, []);
    return list.map((s) => {
      const m = members.find((mm) => mm.id === s.member_id);
      return { ...s, member_name: m?.name || "", member_avatar: m?.avatar || "", member_color: m?.color || "" };
    });
  },

  // Stats
  getStats(): Stats {
    const checkins = load<CheckinRow[]>(KEYS.checkins, []);
    const members = load<MemberRow[]>(KEYS.members, []);
    const totalCheckins = checkins.length;

    const catMap: Record<string, number> = {};
    for (const c of checkins) catMap[c.category] = (catMap[c.category] || 0) + 1;
    const byCategory = Object.entries(catMap).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count);

    const memMap: Record<string, number> = {};
    for (const c of checkins) memMap[c.member_id] = (memMap[c.member_id] || 0) + 1;
    const byMember = members.map((m) => ({ id: m.id, name: m.name, avatar: m.avatar, color: m.color, count: memMap[m.id] || 0 })).sort((a, b) => b.count - a.count);

    const tagCounts: Record<string, number> = {};
    for (const c of checkins) {
      try {
        const tags = JSON.parse(c.tags) as string[];
        for (const t of tags) tagCounts[t] = (tagCounts[t] || 0) + 1;
      } catch { /* skip */ }
    }
    const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([name, count]) => ({ name, count }));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoff = thirtyDaysAgo.toISOString().split("T")[0];
    const dayMap: Record<string, number> = {};
    for (const c of checkins) {
      const d = c.created_at.split(" ")[0];
      if (d >= cutoff) dayMap[d] = (dayMap[d] || 0) + 1;
    }
    const dailyCounts = Object.entries(dayMap).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const cutoff60 = sixtyDaysAgo.toISOString().split("T")[0];
    const heatKey: Record<string, number> = {};
    for (const c of checkins) {
      const d = c.created_at.split(" ")[0];
      if (d >= cutoff60) {
        const m = members.find((mm) => mm.id === c.member_id);
        if (m) {
          const key = `${m.name}|||${d}`;
          heatKey[key] = (heatKey[key] || 0) + 1;
        }
      }
    }
    const heatmapData = Object.entries(heatKey).map(([key, count]) => {
      const [member_name, date] = key.split("|||");
      return { member_name, date, count };
    });

    const allDates = [...new Set(checkins.map((c) => c.created_at.split(" ")[0]))].sort().reverse();
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < allDates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().split("T")[0];
      if (allDates[i] === expectedStr) streak++;
      else break;
    }

    return { totalCheckins, byCategory, byMember, topTags, dailyCounts, heatmapData, streak };
  },
};

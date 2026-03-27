export interface Member {
  id: string;
  name: string;
  avatar: string;
  color: string;
  created_at: string;
}

export interface Checkin {
  id: string;
  member_id: string;
  content: string;
  category: string;
  tags: string; // JSON string
  source_url: string;
  created_at: string;
  member_name: string;
  member_avatar: string;
  member_color: string;
}

export interface ScheduleEntry {
  id: string;
  member_id: string;
  date: string;
  completed: number;
  member_name: string;
  member_avatar: string;
  member_color: string;
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

export const CATEGORIES: Record<string, { label: string; emoji: string; color: string }> = {
  news: { label: "资讯", emoji: "📰", color: "#3b82f6" },
  insight: { label: "感悟", emoji: "💡", color: "#f59e0b" },
  product: { label: "产品", emoji: "🚀", color: "#10b981" },
  paper: { label: "论文", emoji: "📄", color: "#8b5cf6" },
  idea: { label: "创意", emoji: "✨", color: "#ec4899" },
  gossip: { label: "八卦", emoji: "🗣️", color: "#6b7280" },
};

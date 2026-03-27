import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "checkin.db");

// Ensure data directory exists
import fs from "fs";
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL DEFAULT '',
    color TEXT NOT NULL DEFAULT '#6366f1',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS checkins (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'insight',
    tags TEXT NOT NULL DEFAULT '[]',
    source_url TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (member_id) REFERENCES members(id)
  );

  CREATE TABLE IF NOT EXISTS schedule (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    date TEXT NOT NULL UNIQUE,
    completed INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (member_id) REFERENCES members(id)
  );
`);

// Seed some demo members if table is empty
const memberCount = db.prepare("SELECT COUNT(*) as count FROM members").get() as { count: number };
if (memberCount.count === 0) {
  const insertMember = db.prepare("INSERT INTO members (id, name, avatar, color) VALUES (?, ?, ?, ?)");
  const demoMembers = [
    ["m1", "小明", "🧑‍💻", "#6366f1"],
    ["m2", "小红", "👩‍🔬", "#ec4899"],
    ["m3", "小李", "🧑‍🎨", "#f59e0b"],
    ["m4", "小王", "👨‍🚀", "#10b981"],
    ["m5", "小张", "🧑‍🏫", "#3b82f6"],
  ];
  const insertMany = db.transaction(() => {
    for (const [id, name, avatar, color] of demoMembers) {
      insertMember.run(id, name, avatar, color);
    }
  });
  insertMany();

  // Seed demo checkins for the past 2 weeks
  const insertCheckin = db.prepare(
    "INSERT INTO checkins (id, member_id, content, category, tags, source_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  const demoCheckins = [
    ["c1", "m1", "Claude 4 发布了，支持多模态推理和超长上下文窗口，对编程辅助场景提升巨大", "news", '["LLM","Claude","多模态"]', "https://anthropic.com", "2025-03-13 09:00:00"],
    ["c2", "m2", "试用了 Cursor 的 Agent 模式，可以自动读取项目结构并生成代码，效率提升明显", "insight", '["AI编程","Cursor","Agent"]', "", "2025-03-14 10:30:00"],
    ["c3", "m3", "发现一个有趣的 AI 产品 Gamma，可以用 AI 自动生成精美 PPT，适合快速做汇报", "product", '["AI产品","PPT","效率工具"]', "https://gamma.app", "2025-03-15 14:00:00"],
    ["c4", "m4", "读了一篇关于 RAG 优化的论文，提出了 Adaptive RAG 方法，根据问题复杂度动态选择检索策略", "paper", '["RAG","论文","检索增强"]', "", "2025-03-16 11:00:00"],
    ["c5", "m5", "想法：能不能用 AI Agent 自动监控竞品动态，每天生成竞品分析报告？", "idea", '["Agent","竞品分析","自动化"]', "", "2025-03-17 16:00:00"],
    ["c6", "m1", "OpenAI 推出了 GPT-4o 的图像生成功能，效果惊艳，可以生成高质量的插画和设计稿", "news", '["GPT-4o","图像生成","OpenAI"]', "", "2025-03-18 09:30:00"],
    ["c7", "m2", "团队讨论：AI 代码审查工具的选型，对比了 CodeRabbit、Sourcery 和 Qodo", "insight", '["代码审查","工具选型","团队"]', "", "2025-03-19 10:00:00"],
    ["c8", "m3", "八卦：据说 Google DeepMind 在秘密研发 Gemini 3，性能将超越所有现有模型", "gossip", '["Google","Gemini","八卦"]', "", "2025-03-20 15:00:00"],
    ["c9", "m4", "MCP (Model Context Protocol) 正在成为 AI 工具集成的标准协议，值得关注", "news", '["MCP","协议","标准化"]', "", "2025-03-21 11:30:00"],
    ["c10", "m5", "灵感：用 AI + 知识图谱做团队技能地图，自动识别团队能力缺口并推荐学习资源", "idea", '["知识图谱","技能地图","学习"]', "", "2025-03-22 14:30:00"],
    ["c11", "m1", "Anthropic 发布了 Claude Code，一个终端里的 AI 编程助手，支持直接操作文件系统", "product", '["Claude","编程","终端"]', "", "2025-03-23 09:00:00"],
    ["c12", "m2", "学习了 Prompt Engineering 的最新技巧：Chain of Draft，比 Chain of Thought 更高效", "insight", '["Prompt","技巧","CoD"]', "", "2025-03-24 10:00:00"],
    ["c13", "m3", "Midjourney V7 发布，支持视频生成了！创意行业要被颠覆", "news", '["Midjourney","视频生成","创意"]', "", "2025-03-25 13:00:00"],
    ["c14", "m4", "想法：做一个 AI 驱动的每日站会助手，自动总结昨日进展和今日计划", "idea", '["Agent","站会","项目管理"]', "", "2025-03-26 11:00:00"],
  ];
  const insertManyCheckins = db.transaction(() => {
    for (const [id, memberId, content, category, tags, url, date] of demoCheckins) {
      insertCheckin.run(id, memberId, content, category, tags, url, date);
    }
  });
  insertManyCheckins();

  // Seed schedule for the next 2 weeks (rotating through members)
  const insertSchedule = db.prepare("INSERT OR IGNORE INTO schedule (id, member_id, date, completed) VALUES (?, ?, ?, ?)");
  const memberIds = ["m1", "m2", "m3", "m4", "m5"];
  const insertManySchedule = db.transaction(() => {
    const today = new Date();
    for (let i = -14; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const memberIdx = ((i % memberIds.length) + memberIds.length) % memberIds.length;
      const completed = i < 0 ? 1 : 0;
      insertSchedule.run(`s${i + 15}`, memberIds[memberIdx], dateStr, completed);
    }
  });
  insertManySchedule();
}

export default db;

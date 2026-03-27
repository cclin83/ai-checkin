"use client";

import { useState } from "react";
import { Member, CATEGORIES } from "@/lib/types";

interface Props {
  members: Member[];
  todayMemberId?: string;
  onSubmit: () => void;
}

export default function CheckinForm({ members, todayMemberId, onSubmit }: Props) {
  const [memberId, setMemberId] = useState(todayMemberId || "");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("insight");
  const [tagsInput, setTagsInput] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !content.trim()) return;

    setSubmitting(true);
    try {
      const tags = tagsInput
        .split(/[,，、\s]+/)
        .map((t) => t.trim())
        .filter(Boolean);

      await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: memberId,
          content: content.trim(),
          category,
          tags,
          source_url: sourceUrl.trim(),
        }),
      });

      setContent("");
      setTagsInput("");
      setSourceUrl("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Member selector */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">打卡人</label>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMemberId(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                memberId === m.id
                  ? "ring-2 ring-accent-light scale-105 shadow-lg"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={{
                backgroundColor: memberId === m.id ? m.color + "30" : "var(--card-bg)",
                borderColor: m.color,
                border: `1px solid ${memberId === m.id ? m.color : "var(--card-border)"}`,
              }}
            >
              <span className="text-lg">{m.avatar}</span>
              <span>{m.name}</span>
              {todayMemberId === m.id && (
                <span className="text-xs bg-accent/20 text-accent-light px-1.5 py-0.5 rounded">
                  今日轮值
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Category selector */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">分类</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                category === key
                  ? "ring-2 scale-105"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={{
                backgroundColor: category === key ? cat.color + "25" : "var(--card-bg)",
                borderColor: cat.color,
                border: `1px solid ${category === key ? cat.color : "var(--card-border)"}`,
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          今日 AI 见闻 / 灵感 / 想法
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享你今天看到的、听到的、想到的关于 AI 的一切..."
          rows={4}
          className="w-full px-4 py-3 bg-background border border-card-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none transition-all"
          required
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          标签 <span className="text-muted/50">（用逗号或空格分隔）</span>
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="例如：LLM, Agent, RAG"
          className="w-full px-4 py-2.5 bg-background border border-card-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
        />
      </div>

      {/* Source URL */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          来源链接 <span className="text-muted/50">（可选）</span>
        </label>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://..."
          className="w-full px-4 py-2.5 bg-background border border-card-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !memberId || !content.trim()}
        className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
          success
            ? "bg-success"
            : "bg-accent hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed"
        }`}
      >
        {submitting ? "提交中..." : success ? "✅ 打卡成功！" : "📝 提交打卡"}
      </button>
    </form>
  );
}

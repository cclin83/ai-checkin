"use client";

import { Checkin, CATEGORIES } from "@/lib/types";

interface Props {
  checkins: Checkin[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays}天前`;

  return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export default function Timeline({ checkins }: Props) {
  if (checkins.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-4xl mb-3">📭</p>
        <p>还没有打卡记录</p>
        <p className="text-sm mt-1">去打卡页面提交第一条吧！</p>
      </div>
    );
  }

  // Group by date
  const grouped: Record<string, Checkin[]> = {};
  for (const c of checkins) {
    const date = c.created_at.split("T")[0].split(" ")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(c);
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} className="animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-card-border" />
            <span className="text-sm font-medium text-muted px-3 py-1 bg-card-bg rounded-full border border-card-border">
              {formatDate(date)}
            </span>
            <div className="h-px flex-1 bg-card-border" />
          </div>

          <div className="space-y-3">
            {items.map((checkin, idx) => {
              const cat = CATEGORIES[checkin.category] || CATEGORIES.insight;
              let tags: string[] = [];
              try {
                tags = JSON.parse(checkin.tags);
              } catch {
                // ignore
              }

              return (
                <div
                  key={checkin.id}
                  className="bg-card-bg border border-card-border rounded-2xl p-5 hover:border-accent/30 transition-all animate-slide-in"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: checkin.member_color + "25" }}
                      >
                        {checkin.member_avatar}
                      </span>
                      <div>
                        <span className="font-medium text-sm">{checkin.member_name}</span>
                        <span className="text-muted text-xs ml-2">
                          {new Date(checkin.created_at).toLocaleTimeString("zh-CN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: cat.color + "20",
                        color: cat.color,
                      }}
                    >
                      {cat.emoji} {cat.label}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {checkin.content}
                  </p>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent-light"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Source URL */}
                  {checkin.source_url && (
                    <a
                      href={checkin.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-xs text-accent-light hover:underline"
                    >
                      🔗 来源链接
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

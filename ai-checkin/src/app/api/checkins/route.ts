import { NextRequest, NextResponse } from "next/server";
import store from "@/lib/store";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const memberId = searchParams.get("member_id") || undefined;

  const { checkins, total } = store.getCheckins({ limit, offset, member_id: memberId });

  const enriched = checkins.map((c) => {
    const m = store.getMemberById(c.member_id);
    return { ...c, member_name: m?.name || "", member_avatar: m?.avatar || "", member_color: m?.color || "" };
  });

  return NextResponse.json({ checkins: enriched, total });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { member_id, content, category, tags, source_url } = body;

  if (!member_id || !content) {
    return NextResponse.json({ error: "member_id and content are required" }, { status: 400 });
  }

  const id = uuidv4();
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  store.addCheckin({
    id, member_id, content,
    category: category || "insight",
    tags: JSON.stringify(tags || []),
    source_url: source_url || "",
    created_at: now,
  });

  const m = store.getMemberById(member_id);
  return NextResponse.json({
    ...store.getCheckinById(id),
    member_name: m?.name || "", member_avatar: m?.avatar || "", member_color: m?.color || "",
  }, { status: 201 });
}

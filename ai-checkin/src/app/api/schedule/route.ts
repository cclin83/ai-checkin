import { NextRequest, NextResponse } from "next/server";
import store from "@/lib/store";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const schedule = store.getSchedule(from, to);
  const enriched = schedule.map((s) => {
    const m = store.getMemberById(s.member_id);
    return { ...s, member_name: m?.name || "", member_avatar: m?.avatar || "", member_color: m?.color || "" };
  });

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { member_id, date } = body;

  if (!member_id || !date) {
    return NextResponse.json({ error: "member_id and date are required" }, { status: 400 });
  }

  const id = uuidv4();
  const row = { id, member_id, date, completed: 0 };
  store.setSchedule(row);

  return NextResponse.json(row, { status: 201 });
}

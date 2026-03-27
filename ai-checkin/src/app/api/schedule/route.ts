import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let query = `
    SELECT s.*, m.name as member_name, m.avatar as member_avatar, m.color as member_color
    FROM schedule s
    JOIN members m ON s.member_id = m.id
  `;
  const params: string[] = [];

  if (from && to) {
    query += " WHERE s.date >= ? AND s.date <= ?";
    params.push(from, to);
  }

  query += " ORDER BY s.date ASC";

  const schedule = db.prepare(query).all(...params);
  return NextResponse.json(schedule);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { member_id, date } = body;

  if (!member_id || !date) {
    return NextResponse.json({ error: "member_id and date are required" }, { status: 400 });
  }

  const id = uuidv4();
  db.prepare("INSERT OR REPLACE INTO schedule (id, member_id, date, completed) VALUES (?, ?, ?, 0)").run(
    id,
    member_id,
    date
  );

  return NextResponse.json({ id, member_id, date, completed: 0 }, { status: 201 });
}

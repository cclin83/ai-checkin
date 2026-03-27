import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const memberId = searchParams.get("member_id");

  let query = `
    SELECT c.*, m.name as member_name, m.avatar as member_avatar, m.color as member_color
    FROM checkins c
    JOIN members m ON c.member_id = m.id
  `;
  const params: (string | number)[] = [];

  if (memberId) {
    query += " WHERE c.member_id = ?";
    params.push(memberId);
  }

  query += " ORDER BY c.created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const checkins = db.prepare(query).all(...params);
  const total = db.prepare(
    `SELECT COUNT(*) as count FROM checkins ${memberId ? "WHERE member_id = ?" : ""}`
  ).get(...(memberId ? [memberId] : [])) as { count: number };

  return NextResponse.json({ checkins, total: total.count });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { member_id, content, category, tags, source_url } = body;

  if (!member_id || !content) {
    return NextResponse.json({ error: "member_id and content are required" }, { status: 400 });
  }

  const id = uuidv4();
  const tagsJson = JSON.stringify(tags || []);

  db.prepare(
    "INSERT INTO checkins (id, member_id, content, category, tags, source_url) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, member_id, content, category || "insight", tagsJson, source_url || "");

  // Mark today's schedule as completed
  const today = new Date().toISOString().split("T")[0];
  db.prepare("UPDATE schedule SET completed = 1 WHERE member_id = ? AND date = ?").run(member_id, today);

  const checkin = db.prepare(
    `SELECT c.*, m.name as member_name, m.avatar as member_avatar, m.color as member_color
     FROM checkins c JOIN members m ON c.member_id = m.id WHERE c.id = ?`
  ).get(id);

  return NextResponse.json(checkin, { status: 201 });
}

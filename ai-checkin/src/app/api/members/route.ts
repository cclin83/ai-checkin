import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const members = db.prepare("SELECT * FROM members ORDER BY created_at").all();
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, avatar, color } = body;

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const id = uuidv4();
  db.prepare("INSERT INTO members (id, name, avatar, color) VALUES (?, ?, ?, ?)").run(
    id,
    name,
    avatar || "🧑",
    color || "#6366f1"
  );

  const member = db.prepare("SELECT * FROM members WHERE id = ?").get(id);
  return NextResponse.json(member, { status: 201 });
}

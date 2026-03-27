import { NextRequest, NextResponse } from "next/server";
import store from "@/lib/store";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  return NextResponse.json(store.getMembers());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, avatar, color } = body;

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const id = uuidv4();
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  const member = { id, name, avatar: avatar || "🧑", color: color || "#6366f1", created_at: now };
  store.addMember(member);

  return NextResponse.json(member, { status: 201 });
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { serializeCommunity } from "@/lib/serialize"

export async function GET() {
  try {
    const list = await prisma.community.findMany({ orderBy: { name: "asc" } })
    return NextResponse.json(list.map(serializeCommunity))
  } catch (e) {
    console.error("Communities list error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

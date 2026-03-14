import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  try {
    const { id } = await params
    const club = await prisma.club.findUnique({ where: { id } })
    if (!club) return NextResponse.json({ error: "Клуб не найден" }, { status: 404 })
    const body = (await request.json()) as { name?: string; grade?: string; contacts?: string }
    const existing = await prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: id, userId: session.userId } },
    })
    if (existing) {
      return NextResponse.json({ error: "Вы уже в клубе" }, { status: 400 })
    }
    await prisma.clubMember.create({
      data: {
        clubId: id,
        userId: session.userId,
      },
    })
    await prisma.club.update({
      where: { id },
      data: { memberCount: { increment: 1 } },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Join club error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

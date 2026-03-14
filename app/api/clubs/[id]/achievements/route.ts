import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { serializeAchievement } from "@/lib/serialize"
import { getSession } from "@/lib/auth"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const list = await prisma.achievement.findMany({
      where: { clubId: id },
      orderBy: { date: "desc" },
    })
    return NextResponse.json(list.map(serializeAchievement))
  } catch (e) {
    console.error("Achievements list error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  try {
    const { id } = await params
    const club = await prisma.club.findUnique({
      where: { id },
      include: { owners: { select: { userId: true } } },
    })
    if (!club) return NextResponse.json({ error: "Клуб не найден" }, { status: 404 })
    if (!club.owners.some((o) => o.userId === session.userId)) {
      return NextResponse.json({ error: "Только владелец может добавлять достижения" }, { status: 403 })
    }
    const body = (await request.json()) as { title: string; description: string; date: string; image?: string; icon?: string }
    if (!body.title?.trim() || !body.description?.trim() || !body.date) {
      return NextResponse.json({ error: "Название, описание и дата обязательны" }, { status: 400 })
    }
    const ach = await prisma.achievement.create({
      data: {
        clubId: id,
        title: body.title.trim(),
        description: body.description.trim(),
        date: body.date,
        image: body.image?.trim() || null,
        icon: body.icon?.trim() || null,
      },
    })
    return NextResponse.json(serializeAchievement(ach))
  } catch (e) {
    console.error("Achievement create error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

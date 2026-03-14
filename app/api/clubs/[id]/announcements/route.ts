import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { serializeAnnouncement } from "@/lib/serialize"
import { getSession } from "@/lib/auth"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const list = await prisma.announcement.findMany({
      where: { clubId: id },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        comments: { include: { user: { select: { name: true } } } },
        likes: { select: { userId: true } },
      },
    })
    return NextResponse.json(
      list.map((a) => ({ ...serializeAnnouncement(a), authorName: a.author.name }))
    )
  } catch (e) {
    console.error("Announcements list error:", e)
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
      return NextResponse.json({ error: "Только владелец может публиковать анонсы" }, { status: 403 })
    }
    const body = (await request.json()) as { title: string; content: string; image?: string }
    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json({ error: "Заголовок и текст обязательны" }, { status: 400 })
    }
    const ann = await prisma.announcement.create({
      data: {
        clubId: id,
        title: body.title.trim(),
        content: body.content.trim(),
        image: body.image?.trim() || null,
        authorId: session.userId,
      },
      include: {
        comments: { include: { user: { select: { name: true } } } },
        likes: { select: { userId: true } },
      },
    })
    return NextResponse.json(serializeAnnouncement(ann))
  } catch (e) {
    console.error("Announcement create error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { serializeClub } from "@/lib/serialize"
import { getSession } from "@/lib/auth"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const club = await prisma.club.findUnique({
      where: { id },
      include: { owners: { include: { user: true } } },
    })
    if (!club) return NextResponse.json({ error: "Клуб не найден" }, { status: 404 })
    const payload = serializeClub(club)
    payload.ownerIds = club.owners.map((o) => o.userId)
    const owners = club.owners.map((o) => ({
      id: o.user.id,
      name: o.user.name,
      email: o.user.email,
      role: o.user.role,
      grade: o.user.grade,
      phone: o.user.phone,
      bio: o.user.bio,
    }))
    return NextResponse.json({ ...payload, owners })
  } catch (e) {
    console.error("Club get error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  try {
    const { id } = await params
    const club = await prisma.club.findUnique({
      where: { id },
      include: { owners: { select: { userId: true } } },
    })
    if (!club) return NextResponse.json({ error: "Клуб не найден" }, { status: 404 })
    const isOwner = club.owners.some((o) => o.userId === session.userId)
    if (!isOwner && session.role !== "admin") {
      return NextResponse.json({ error: "Нет прав" }, { status: 403 })
    }
    const body = (await request.json()) as {
      description?: string
      schedule?: { day: string; time: string; room: string }[]
      links?: { telegram?: string; whatsapp?: string; website?: string }
    }
    const update: Record<string, unknown> = {}
    if (body.description != null) update.description = body.description
    if (body.schedule != null) update.schedule = JSON.stringify(body.schedule)
    if (body.links != null) update.links = JSON.stringify(body.links)
    const updated = await prisma.club.update({
      where: { id },
      data: update,
      include: { owners: { select: { userId: true } } },
    })
    const payload = serializeClub(updated)
    payload.ownerIds = updated.owners.map((o) => o.userId)
    return NextResponse.json(payload)
  } catch (e) {
    console.error("Club update error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

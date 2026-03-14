import { NextResponse } from "next/server"
import * as bcrypt from "bcryptjs"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { serializeUser } from "@/lib/serialize"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ user: null })
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      ownedClubs: { select: { clubId: true } },
      clubMemberships: { select: { clubId: true } },
    },
  })
  if (!user) {
    return NextResponse.json({ user: null })
  }
  const payload = serializeUser(user)
  payload.clubMemberships = user.clubMemberships.map((m) => m.clubId)
  payload.ownedClubs = user.ownedClubs.map((o) => o.clubId)
  return NextResponse.json({ user: payload })
}

export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }

  const body = (await request.json()) as {
    name?: string
    email?: string
    phone?: string
    password?: { current: string; next: string }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        ownedClubs: { select: { clubId: true } },
        clubMemberships: { select: { clubId: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    const data: Record<string, unknown> = {}

    if (body.name !== undefined) data.name = body.name.trim()
    if (body.email !== undefined) data.email = body.email.trim().toLowerCase()
    if (body.phone !== undefined) data.phone = body.phone.trim() || null

    if (body.password) {
      const ok = await bcrypt.compare(body.password.current, user.passwordHash)
      if (!ok) {
        return NextResponse.json({ error: "Текущий пароль неверен" }, { status: 400 })
      }
      data.passwordHash = await bcrypt.hash(body.password.next, 10)
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      include: {
        ownedClubs: { select: { clubId: true } },
        clubMemberships: { select: { clubId: true } },
      },
    })

    const payload = serializeUser(updated)
    payload.clubMemberships = updated.clubMemberships.map((m) => m.clubId)
    payload.ownedClubs = updated.ownedClubs.map((o) => o.clubId)

    return NextResponse.json({ user: payload })
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 409 })
    }
    console.error("Update profile error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

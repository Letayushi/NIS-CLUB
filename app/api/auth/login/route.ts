import { NextResponse } from "next/server"
import * as bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { createSession } from "@/lib/auth"
import { serializeUser } from "@/lib/serialize"

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string }
    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 })
    }
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: {
        ownedClubs: { select: { clubId: true } },
        clubMemberships: { select: { clubId: true } },
      },
    })
    if (!user) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
    }
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
    }
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })
    const payload = serializeUser(user)
    payload.clubMemberships = user.clubMemberships.map((m) => m.clubId)
    payload.ownedClubs = user.ownedClubs.map((o) => o.clubId)
    return NextResponse.json({ user: payload })
  } catch (e) {
    console.error("Login error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

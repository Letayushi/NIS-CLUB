import { NextResponse } from "next/server"
import * as bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { createSession } from "@/lib/auth"
import { serializeUser } from "@/lib/serialize"

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = (await request.json()) as {
      name?: string
      email?: string
      phone?: string
      password?: string
    }

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Имя, email и пароль обязательны" }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        passwordHash,
        role: "student",
      },
      include: {
        ownedClubs: { select: { clubId: true } },
        clubMemberships: { select: { clubId: true } },
      },
    })

    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    const payload = serializeUser(user)
    payload.clubMemberships = user.clubMemberships.map((m) => m.clubId)
    payload.ownedClubs = user.ownedClubs.map((o) => o.clubId)

    return NextResponse.json({ user: payload }, { status: 201 })
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 409 })
    }
    console.error("Register error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}


import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { serializeClubRequest } from "@/lib/serialize"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  if (session.role !== "admin") {
    const list = await prisma.clubRequest.findMany({
      where: { applicantId: session.userId },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(list.map(serializeClubRequest))
  }
  const list = await prisma.clubRequest.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(list.map(serializeClubRequest))
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  try {
    const body = (await request.json()) as {
      clubName: string
      description: string
      goals: string
      schedule: { day: string; time: string; room: string }[]
      curator?: string
      contacts: string
    }
    if (!body.clubName?.trim() || !body.description?.trim() || !body.goals?.trim() || !body.contacts?.trim()) {
      return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 })
    }
    if (!Array.isArray(body.schedule) || body.schedule.length === 0) {
      return NextResponse.json({ error: "Добавьте хотя бы одно занятие в расписание" }, { status: 400 })
    }
    const req = await prisma.clubRequest.create({
      data: {
        applicantId: session.userId,
        clubName: body.clubName.trim(),
        description: body.description.trim(),
        goals: body.goals.trim(),
        schedule: JSON.stringify(body.schedule),
        curator: body.curator?.trim() || null,
        contacts: body.contacts.trim(),
        status: "pending",
      },
    })
    return NextResponse.json(serializeClubRequest(req))
  } catch (e) {
    console.error("Request create error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

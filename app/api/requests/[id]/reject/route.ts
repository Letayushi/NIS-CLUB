import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Только администратор может отклонять заявки" }, { status: 403 })
  }
  try {
    const { id } = await params
    const body = (await request.json()) as { adminComment?: string }
    const req = await prisma.clubRequest.findUnique({ where: { id } })
    if (!req) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 })
    if (req.status !== "pending") {
      return NextResponse.json({ error: "Заявка уже рассмотрена" }, { status: 400 })
    }
    await prisma.clubRequest.update({
      where: { id },
      data: { status: "rejected", adminComment: body.adminComment?.trim() || null },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Reject request error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { serializeClub } from "@/lib/serialize"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Только администратор может одобрять заявки" }, { status: 403 })
  }
  try {
    const { id } = await params
    const clubRequest = await prisma.clubRequest.findUnique({
      where: { id },
      include: { applicant: true },
    })
    if (!clubRequest) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 })
    if (clubRequest.status !== "pending") {
      return NextResponse.json({ error: "Заявка уже рассмотрена" }, { status: 400 })
    }
    const body = (await request.json()) as {
      name: string
      shortDescription: string
      description: string
      coverImage: string
      schedule: { day: string; time: string; room: string }[]
    }
    if (!body.name?.trim() || !body.shortDescription?.trim() || !body.description?.trim() || !body.coverImage?.trim()) {
      return NextResponse.json({ error: "Заполните все поля клуба" }, { status: 400 })
    }
    const club = await prisma.club.create({
      data: {
        name: body.name.trim(),
        shortDescription: body.shortDescription.trim(),
        description: body.description.trim(),
        coverImage: body.coverImage.trim(),
        photos: "[]",
        schedule: JSON.stringify(body.schedule || []),
        links: "{}",
        city: "Школа",
        memberCount: 0,
        categories: "[]",
        owners: {
          create: { userId: clubRequest.applicantId },
        },
      },
      include: { owners: { select: { userId: true } } },
    })
    await prisma.clubMember.create({
      data: { clubId: club.id, userId: clubRequest.applicantId },
    })
    await prisma.club.update({
      where: { id: club.id },
      data: { memberCount: 1 },
    })
    await prisma.clubRequest.update({
      where: { id },
      data: { status: "approved", approvedClubId: club.id },
    })
    const payload = serializeClub(club)
    payload.ownerIds = club.owners.map((o) => o.userId)
    return NextResponse.json({ club: payload })
  } catch (e) {
    console.error("Approve request error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

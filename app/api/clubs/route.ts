import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { serializeClub } from "@/lib/serialize"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const category = searchParams.get("category")
    const clubs = await prisma.club.findMany({
      orderBy: { createdAt: "desc" },
      include: { owners: { select: { userId: true } } },
    })
    let list = clubs.map((c) => {
      const club = serializeClub(c)
      club.ownerIds = c.owners.map((o) => o.userId)
      return club
    })
    if (city && city !== "all") list = list.filter((c) => c.city === city)
    if (category && category !== "all") list = list.filter((c) => c.categories.includes(category))
    return NextResponse.json(list)
  } catch (e) {
    console.error("Clubs list error:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

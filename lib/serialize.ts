import type { Club, User, Announcement, Achievement, ClubRequest, Community } from "./types"

export function serializeUser(u: { id: string; name: string; email: string; role: string; grade: string | null; phone: string | null; bio: string | null; avatar: string | null }): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as User["role"],
    grade: u.grade ?? undefined,
    phone: u.phone ?? undefined,
    bio: u.bio ?? undefined,
    avatar: u.avatar ?? undefined,
    clubMemberships: [],
    ownedClubs: [],
  }
}

export function serializeClub(row: {
  id: string
  name: string
  description: string
  shortDescription: string
  coverImage: string
  photos: string
  schedule: string
  links: string
  city: string
  memberCount: number
  categories: string
  createdAt: Date
}): Club {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    shortDescription: row.shortDescription,
    coverImage: row.coverImage,
    photos: JSON.parse(row.photos || "[]") as string[],
    schedule: JSON.parse(row.schedule || "[]") as Club["schedule"],
    links: JSON.parse(row.links || "{}") as Club["links"],
    ownerIds: [],
    memberCount: row.memberCount,
    categories: JSON.parse(row.categories || "[]") as string[],
    city: row.city,
    createdAt: row.createdAt.toISOString().slice(0, 10),
  }
}

export function serializeAnnouncement(row: {
  id: string
  clubId: string
  title: string
  content: string
  image: string | null
  authorId: string
  createdAt: Date
  author?: { name: string }
  comments?: { id: string; userId: string; content: string; createdAt: Date; user: { name: string } }[]
  likes?: { userId: string }[]
}): Announcement {
  return {
    id: row.id,
    clubId: row.clubId,
    title: row.title,
    content: row.content,
    image: row.image ?? undefined,
    authorId: row.authorId,
    createdAt: row.createdAt.toISOString().slice(0, 10),
    likes: (row.likes || []).map((l) => l.userId),
    comments: (row.comments || []).map((c) => ({
      id: c.id,
      userId: c.userId,
      userName: c.user.name,
      content: c.content,
      createdAt: c.createdAt.toISOString().slice(0, 10),
    })),
  }
}

export function serializeAchievement(row: { id: string; clubId: string; title: string; description: string; date: string; image: string | null; icon: string | null }): Achievement {
  return {
    id: row.id,
    clubId: row.clubId,
    title: row.title,
    description: row.description,
    date: row.date,
    image: row.image ?? undefined,
    icon: row.icon ?? undefined,
  }
}

export function serializeClubRequest(row: {
  id: string
  applicantId: string
  clubName: string
  description: string
  goals: string
  schedule: string
  curator: string | null
  contacts: string
  status: string
  adminComment: string | null
  createdAt: Date
}): ClubRequest {
  return {
    id: row.id,
    applicantId: row.applicantId,
    clubName: row.clubName,
    description: row.description,
    goals: row.goals,
    schedule: JSON.parse(row.schedule || "[]") as ClubRequest["schedule"],
    curator: row.curator ?? undefined,
    contacts: row.contacts,
    status: row.status as ClubRequest["status"],
    adminComment: row.adminComment ?? undefined,
    createdAt: row.createdAt.toISOString(),
  }
}

export function serializeCommunity(row: { id: string; name: string; description: string; link: string; icon: string; platform: string; memberCount: number | null }): Community {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    link: row.link,
    icon: row.icon,
    platform: row.platform,
    memberCount: row.memberCount ?? undefined,
  }
}

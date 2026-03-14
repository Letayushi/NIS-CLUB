export type UserRole = "guest" | "student" | "owner" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  grade?: string
  phone?: string
  bio?: string
  avatar?: string
  clubMemberships: string[] // club IDs
  ownedClubs: string[] // club IDs
}

export interface Club {
  id: string
  name: string
  description: string
  shortDescription: string
  coverImage: string
  photos: string[]
  schedule: ScheduleSlot[]
  links: {
    telegram?: string
    whatsapp?: string
    website?: string
  }
  ownerIds: string[]
  memberCount: number
  categories: string[]
  city: string // Added city field for filtering
  createdAt: string
}

export interface ScheduleSlot {
  day: string
  time: string
  room: string
}

export interface Announcement {
  id: string
  clubId: string
  title: string
  content: string
  image?: string
  authorId: string
  authorName?: string // set by API
  createdAt: string
  likes: string[] // user IDs who liked
  comments: Comment[]
}

export interface Comment {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

export interface Achievement {
  id: string
  clubId: string
  title: string
  description: string
  date: string
  image?: string
  icon?: string
}

export interface ClubRequest {
  id: string
  applicantId: string
  clubName: string
  description: string
  goals: string
  schedule: ScheduleSlot[]
  curator?: string
  contacts: string
  status: "pending" | "approved" | "rejected"
  adminComment?: string
  createdAt: string
}

export interface JoinRequest {
  id: string
  clubId: string
  userId: string
  name: string
  grade: string
  contacts: string
  createdAt: string
}

export interface Community {
  id: string
  name: string
  description: string
  link: string
  icon: string
  platform: string
  memberCount?: number
}

"use client"

import { notFound } from "next/navigation"
import { useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { Club, Announcement, Achievement } from "@/lib/types"
import { useState, useEffect } from "react"
import { PhotoCarousel } from "@/components/photo-carousel"
import { ScheduleTable } from "@/components/schedule-table"
import { JoinClubDialog } from "@/components/join-club-dialog"
import { AnnouncementCard } from "@/components/announcement-card"
import { AchievementCard } from "@/components/achievement-card"
import { CreateAnnouncementDialog } from "@/components/create-announcement-dialog"
import { CreateAchievementDialog } from "@/components/create-achievement-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, ExternalLink, MessageCircle, Megaphone } from "lucide-react"
import { motion } from "framer-motion"

type ClubWithOwners = Club & { owners?: { id: string; name: string; email: string; grade?: string; phone?: string; bio?: string }[] }

export default function ClubPage() {
  const params = useParams()
  const id = typeof params?.id === "string" ? params.id : ""
  const { user, refreshUser } = useAuth()
  const [club, setClub] = useState<ClubWithOwners | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      api.clubs.get(id),
      api.clubs.announcements(id),
      api.clubs.achievements(id),
    ])
      .then(([clubData, anns, achievs]) => {
        setClub(clubData)
        setAnnouncements(anns)
        setAchievements(achievs)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  const refreshData = () => {
    if (!id) return
    api.clubs.get(id).then(setClub).catch(() => {})
    api.clubs.announcements(id).then(setAnnouncements).catch(() => {})
    api.clubs.achievements(id).then(setAchievements).catch(() => {})
    refreshUser()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6 max-w-5xl mx-auto">
          <div className="h-10 bg-muted rounded w-2/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (error || !club) {
    notFound()
  }

  const owners = club.owners || []
  const isOwner = user && club.ownerIds.includes(user.id)
  const isMember = user && user.clubMemberships.includes(club.id)

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-4">
            {club.categories.map((category) => (
              <Badge key={category} variant="secondary" className="bg-gradient-to-r from-indigo-100 to-purple-100">
                {category}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold mb-4 text-balance bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
            {club.name}
          </h1>
          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{club.memberCount} участников</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{club.schedule.length} занятий в неделю</span>
            </div>
          </div>
        </div>

        <PhotoCarousel photos={club.photos} alt={club.name} />

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="about" className="text-sm">
              О клубе
            </TabsTrigger>
            <TabsTrigger value="announcements" className="text-sm flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Анонсы
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-sm">
              Достижения
            </TabsTrigger>
            <TabsTrigger value="members" className="text-sm">
              Участники
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Описание</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{club.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Расписание занятий</CardTitle>
              </CardHeader>
              <CardContent>
                <ScheduleTable schedule={club.schedule} />
              </CardContent>
            </Card>

            {(club.links.telegram || club.links.whatsapp || club.links.website) && (
              <Card>
                <CardHeader>
                  <CardTitle>Ссылки и контакты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {club.links.telegram && (
                      <Button variant="outline" asChild>
                        <a href={club.links.telegram} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Telegram
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </a>
                      </Button>
                    )}
                    {club.links.whatsapp && (
                      <Button variant="outline" asChild>
                        <a href={club.links.whatsapp} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </a>
                      </Button>
                    )}
                    {club.links.website && (
                      <Button variant="outline" asChild>
                        <a href={club.links.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Веб-сайт
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Руководители клуба</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {owners.length > 0 ? (
                    owners.map((owner) => (
                      <div key={owner.id} className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shrink-0">
                          <span className="text-lg font-semibold text-white">{owner.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{owner.name}</h4>
                          {owner.grade && <p className="text-sm text-muted-foreground">{owner.grade} класс</p>}
                          {owner.bio && <p className="text-sm text-muted-foreground mt-1">{owner.bio}</p>}
                          {owner.phone && (
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">Телефон:</span> {owner.phone}
                            </p>
                          )}
                          {owner.email && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Email:</span> {owner.email}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Нет данных о руководителях</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6 mt-6">
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-violet-50 rounded-lg p-6 border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Megaphone className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-xl font-semibold">Анонсы клуба</h2>
                </div>
                {isOwner && (
                  <CreateAnnouncementDialog clubName={club.name} clubId={club.id} onSuccess={refreshData} />
                )}
              </div>
              <p className="text-sm text-muted-foreground">Следите за новостями, событиями и объявлениями клуба</p>
            </div>

            {announcements.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Пока нет анонсов</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    authorName={announcement.authorName ?? "Неизвестный"}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6 mt-6">
            <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-lg p-6 border border-amber-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏆</span>
                  <h2 className="text-xl font-semibold">Наши достижения</h2>
                </div>
                {isOwner && (
                  <CreateAchievementDialog clubName={club.name} clubId={club.id} onSuccess={refreshData} />
                )}
              </div>
              <p className="text-sm text-muted-foreground">Гордимся успехами и победами нашего клуба</p>
            </div>

            {achievements.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Пока нет достижений</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <AchievementCard key={achievement.id} achievement={achievement} index={index} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="members" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Участники клуба</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Всего участников</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">{club.memberCount}</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Список участников доступен только членам клуба
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {!isMember && (
          <div className="flex justify-center pt-4">
            <JoinClubDialog clubName={club.name} clubId={club.id} onSuccess={refreshData} />
          </div>
        )}
      </motion.div>
    </div>
  )
}

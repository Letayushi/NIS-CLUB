"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProposeClubDialog } from "@/components/propose-club-dialog"
import { EditClubDialog } from "@/components/edit-club-dialog"
import { CreateAnnouncementDialog } from "@/components/create-announcement-dialog"
import { api } from "@/lib/api"
import type { Club, ClubRequest } from "@/lib/types"
import { Users, Calendar, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, isLoading, refreshUser } = useAuth()
  const router = useRouter()
  const [clubs, setClubs] = useState<Club[]>([])
  const [requests, setRequests] = useState<ClubRequest[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [profileSaving, setProfileSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return
    setName(user.name)
    setEmail(user.email)
    setPhone(user.phone || "")
    api.clubs.list().then(setClubs).catch(() => setClubs([]))
    api.requests.list().then(setRequests).catch(() => setRequests([]))
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const myClubs = clubs.filter((club) => user.clubMemberships.includes(club.id))
  const ownedClubs = clubs.filter((club) => user.ownedClubs.includes(club.id))
  const myRequests = requests.filter((req) => req.applicantId === user.id)

  const refreshRequests = () => api.requests.list().then(setRequests).catch(() => {})
  const refreshClubs = () => api.clubs.list().then(setClubs).catch(() => {})

  const handleDeleteOwnedClub = async (club: Club) => {
    if (!confirm(`Удалить клуб "${club.name}"? Это действие необратимо.`)) return
    try {
      await api.clubs.delete(club.id)
      await refreshClubs()
    } catch (e) {
      console.error("Failed to delete club", e)
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить клуб",
        variant: "destructive",
      })
    }
  }
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    try {
      await api.auth.updateMe({
        name,
        email,
        phone,
        password: newPassword
          ? {
              current: currentPassword,
              next: newPassword,
            }
          : undefined,
      })
      await refreshUser()
      setCurrentPassword("")
      setNewPassword("")
      toast({ title: "Профиль обновлён" })
    } catch (err) {
      toast({
        title: "Ошибка обновления",
        description: err instanceof Error ? err.message : "Не удалось сохранить профиль",
        variant: "destructive",
      })
    } finally {
      setProfileSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Мой профиль</h1>
          <p className="text-muted-foreground text-lg">{user.name}</p>
        </div>

        <Card id="settings">
          <CardHeader>
            <CardTitle>Личные данные</CardTitle>
            <CardDescription>Измените имя, Gmail, номер телефона и при необходимости пароль</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Имя и фамилия</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Gmail</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone">Номер телефона</Label>
                <Input
                  id="profile-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Separator className="my-2" />
              <div className="space-y-2">
                <Label htmlFor="current-password">Текущий пароль (для смены)</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Оставьте пустым, если не меняете пароль"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Новый пароль</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Новый пароль"
                />
              </div>
              <Button type="submit" disabled={profileSaving}>
                {profileSaving ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Мои клубы</CardTitle>
            <CardDescription>Клубы, в которых вы состоите</CardDescription>
          </CardHeader>
          <CardContent>
            {myClubs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Вы пока не состоите ни в одном клубе</p>
                <Link href="/">
                  <Button>Смотреть все клубы</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myClubs.map((club) => (
                  <Link key={club.id} href={`/clubs/${club.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{club.name}</h3>
                        <p className="text-sm text-muted-foreground">{club.shortDescription}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{club.memberCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{club.schedule.length}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Я владелец</CardTitle>
            <CardDescription>Клубы, которыми вы управляете</CardDescription>
          </CardHeader>
          <CardContent>
            {ownedClubs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Вы не являетесь владельцем клубов</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ownedClubs.map((club) => (
                  <div key={club.id} className="p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{club.name}</h3>
                        <p className="text-sm text-muted-foreground">{club.shortDescription}</p>
                      </div>
                      <Badge variant="secondary">Владелец</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <EditClubDialog club={club} onSuccess={refreshClubs} />
                      <CreateAnnouncementDialog clubName={club.name} clubId={club.id} />
                      <Link href={`/clubs/${club.id}`}>
                        <Button variant="ghost" size="sm">
                          Просмотр
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteOwnedClub(club)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Предложить клуб</CardTitle>
            <CardDescription>Создайте заявку на новый клуб</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Есть идея для нового клуба? Отправьте заявку администратору для рассмотрения.
              </p>
              <ProposeClubDialog onSuccess={refreshRequests} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Мои заявки</CardTitle>
            <CardDescription>История заявок на создание клубов</CardDescription>
          </CardHeader>
          <CardContent>
            {myRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">У вас пока нет заявок</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map((request, index) => (
                  <div key={request.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{request.clubName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.createdAt).toLocaleDateString("ru-RU", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <Badge
                          variant={
                            request.status === "approved"
                              ? "default"
                              : request.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {request.status === "pending"
                            ? "Ожидает"
                            : request.status === "approved"
                              ? "Одобрено"
                              : "Отклонено"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                      {request.adminComment && (
                        <div className="mt-2 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Комментарий администратора:</p>
                          <p className="text-sm text-muted-foreground">{request.adminComment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

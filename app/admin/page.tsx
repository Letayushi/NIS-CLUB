"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ViewRequestDialog } from "@/components/view-request-dialog"
import { ApproveRequestDialog } from "@/components/approve-request-dialog"
import { RejectRequestDialog } from "@/components/reject-request-dialog"
import { api } from "@/lib/api"
import type { ClubRequest, Club } from "@/lib/types"
import { Eye, CheckCircle, XCircle, ExternalLink, Trash2, Users } from "lucide-react"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<ClubRequest[]>([])
  const [clubs, setClubs] = useState<Club[]>([])
  const [selectedRequest, setSelectedRequest] = useState<ClubRequest | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user?.role === "admin") {
      api.requests.list().then(setRequests).catch(() => setRequests([]))
      api.clubs.list().then(setClubs).catch(() => setClubs([]))
    }
  }, [user?.role])

  const refreshData = () => {
    api.requests.list().then(setRequests).catch(() => {})
    api.clubs.list().then(setClubs).catch(() => {})
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const handleViewRequest = (request: ClubRequest) => {
    setSelectedRequest(request)
    setViewDialogOpen(true)
  }

  const handleApproveRequest = (request: ClubRequest) => {
    setSelectedRequest(request)
    setApproveDialogOpen(true)
  }

  const handleRejectRequest = (request: ClubRequest) => {
    setSelectedRequest(request)
    setRejectDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Панель администратора</h1>
          <p className="text-muted-foreground text-lg">Управление клубами и заявками</p>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList>
            <TabsTrigger value="requests">Заявки на клубы</TabsTrigger>
            <TabsTrigger value="clubs">Все клубы</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Заявки на создание клубов</CardTitle>
                <CardDescription>Рассмотрите и одобрите или отклоните заявки от учеников</CardDescription>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Нет новых заявок</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Название клуба</TableHead>
                          <TableHead>Заявитель</TableHead>
                          <TableHead>Дата</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.clubName}</TableCell>
                            <TableCell>ID: {request.applicantId}</TableCell>
                            <TableCell>
                              {new Date(request.createdAt).toLocaleDateString("ru-RU", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleViewRequest(request)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {request.status === "pending" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleApproveRequest(request)}
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRejectRequest(request)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clubs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Все клубы</CardTitle>
                <CardDescription>Управление существующими клубами</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clubs.map((club) => (
                    <div key={club.id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{club.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{club.shortDescription}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{club.memberCount} участников</span>
                            </div>
                            <div>
                              <span>{club.schedule.length} занятий/нед</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {club.categories.map((category) => (
                            <Badge key={category} variant="secondary">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/clubs/${club.id}`}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Открыть
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedRequest && (
          <>
            <ViewRequestDialog request={selectedRequest} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
            <ApproveRequestDialog
              request={selectedRequest}
              open={approveDialogOpen}
              onOpenChange={setApproveDialogOpen}
              onSuccess={refreshData}
            />
            <RejectRequestDialog
              request={selectedRequest}
              open={rejectDialogOpen}
              onOpenChange={setRejectDialogOpen}
              onSuccess={refreshData}
            />
          </>
        )}
      </div>
    </div>
  )
}

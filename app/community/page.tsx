"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import type { Community } from "@/lib/types"
import { ExternalLink, Users } from "lucide-react"
import { motion } from "framer-motion"

export default function CommunityPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.communities
      .list()
      .then(setCommunities)
      .catch(() => setCommunities([]))
      .finally(() => setLoading(false))
  }, [])

  const kyzylordaHub = communities.filter((c) => c.name.includes("Kyzylorda Hub"))
  const others = communities.filter((c) => !c.name.includes("Kyzylorda Hub"))

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2 text-balance bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
            Комьюнити
          </h1>
          <p className="text-muted-foreground text-lg">
            Присоединяйтесь к сообществам для обмена идеями, поиска команды и новых знакомств
          </p>
        </div>

        {kyzylordaHub.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50 border-indigo-200">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="text-5xl">🚀</div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">Kyzylorda Hub Community</CardTitle>
                    <CardDescription className="text-base">
                      Сообщество в Кызылорде, где выкладывают мероприятия, собираются люди с идеями для стартапов и
                      общаются ради новых знакомств и совместных проектов. Здесь вы найдете единомышленников для
                      реализации своих идей!
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {kyzylordaHub.map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-white/80">
                        {c.platform}
                      </Badge>
                      {c.memberCount != null && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{c.memberCount} участников</span>
                        </div>
                      )}
                      <Button asChild size="sm" className="ml-auto">
                        <a href={c.link} target="_blank" rel="noopener noreferrer">
                          Присоединиться
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-4">Другие сообщества</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {others.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{community.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="mb-2">{community.name}</CardTitle>
                        <CardDescription>{community.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{community.platform}</Badge>
                        {community.memberCount != null && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{community.memberCount}</span>
                          </div>
                        )}
                      </div>
                      <Button asChild size="sm">
                        <a href={community.link} target="_blank" rel="noopener noreferrer">
                          Перейти
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Создать сообщество</CardTitle>
            <CardDescription>Хотите создать новое сообщество для школы?</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Свяжитесь с администрацией школы, чтобы добавить ваше сообщество на эту страницу.
            </p>
            <Button variant="outline">Связаться с администрацией</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { Achievement } from "@/lib/types"

interface AchievementCardProps {
  achievement: Achievement
  index: number
}

export function AchievementCard({ achievement, index }: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
        <CardContent className="p-0">
          {achievement.image ? (
            <div className="relative h-48 w-full bg-muted">
              <Image
                src={achievement.image || "/placeholder.svg"}
                alt={achievement.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          ) : (
            <div className="h-48 w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center">
              <span className="text-6xl">{achievement.icon || "🏅"}</span>
            </div>
          )}
          <div className="p-6 space-y-2">
            <div className="flex items-start gap-3">
              {!achievement.image && achievement.icon && <span className="text-3xl shrink-0">{achievement.icon}</span>}
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight mb-2">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(achievement.date).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Send } from "lucide-react"
import { motion } from "framer-motion"
import type { Announcement } from "@/lib/types"

interface AnnouncementCardProps {
  announcement: Announcement
  authorName: string
}

export function AnnouncementCard({ announcement, authorName }: AnnouncementCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(announcement.likes.length)
  const [comments, setComments] = useState(announcement.comments)
  const [newComment, setNewComment] = useState("")
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now().toString(),
          userId: "current-user",
          userName: "Вы",
          content: newComment,
          createdAt: new Date().toISOString(),
        },
      ])
      setNewComment("")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-white">{authorName.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{authorName}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(announcement.createdAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>

          {/* Image */}
          {announcement.image && (
            <div className="relative h-80 w-full bg-muted">
              <Image
                src={announcement.image || "/placeholder.svg"}
                alt={announcement.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={handleLike}>
                <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setShowComments(!showComments)}>
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>

            {/* Likes */}
            <p className="text-sm font-semibold">{likesCount} отметок "Нравится"</p>

            {/* Title and Content */}
            <div>
              <p className="text-sm">
                <span className="font-semibold">{authorName}</span> {announcement.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
            </div>

            {/* Comments */}
            {comments.length > 0 && !showComments && (
              <button
                onClick={() => setShowComments(true)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Посмотреть все комментарии ({comments.length})
              </button>
            )}

            {showComments && (
              <div className="space-y-2 pt-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <span className="font-semibold">{comment.userName}</span>{" "}
                    <span className="text-muted-foreground">{comment.content}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Input
                placeholder="Добавьте комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                className="border-0 focus-visible:ring-0 px-0"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

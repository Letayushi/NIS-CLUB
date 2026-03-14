"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { Megaphone } from "lucide-react"

interface CreateAnnouncementDialogProps {
  clubName: string
  clubId: string
  onSuccess?: () => void
}

export function CreateAnnouncementDialog({ clubName, clubId, onSuccess }: CreateAnnouncementDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.clubs.createAnnouncement(clubId, { title, content, image: imageUrl || undefined })
      toast({
        title: "Анонс опубликован!",
        description: "Новый анонс успешно добавлен в клуб.",
      })
      setOpen(false)
      setTitle("")
      setContent("")
      setImageUrl("")
      onSuccess?.()
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Не удалось опубликовать анонс",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Megaphone className="h-4 w-4 mr-2" />
          Новый анонс
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Создать анонс</DialogTitle>
          <DialogDescription>Опубликуйте новость или анонс для клуба "{clubName}"</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="announcement-title">Заголовок *</Label>
            <Input
              id="announcement-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Соревнования по робототехнике"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="announcement-content">Текст анонса *</Label>
            <Textarea
              id="announcement-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Расскажите подробнее о событии..."
              required
              minLength={20}
              maxLength={1000}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="announcement-image">URL изображения (опционально)</Label>
            <Input
              id="announcement-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Публикация..." : "Опубликовать анонс"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

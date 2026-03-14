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
import { Trophy } from "lucide-react"

interface CreateAchievementDialogProps {
  clubName: string
  clubId: string
  onSuccess?: () => void
}

export function CreateAchievementDialog({ clubName, clubId, onSuccess }: CreateAchievementDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [icon, setIcon] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.clubs.createAchievement(clubId, { title, description, date, image: imageUrl || undefined, icon: icon || undefined })
      toast({
        title: "Достижение добавлено!",
        description: "Новое достижение успешно добавлено в клуб.",
      })
      setOpen(false)
      setTitle("")
      setDescription("")
      setDate("")
      setImageUrl("")
      setIcon("")
      onSuccess?.()
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Не удалось добавить достижение",
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
          <Trophy className="h-4 w-4 mr-2" />
          Добавить достижение
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Добавить достижение</DialogTitle>
          <DialogDescription>Добавьте новое достижение для клуба "{clubName}"</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="achievement-title">Название *</Label>
            <Input
              id="achievement-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="1 место на региональной олимпиаде"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievement-description">Описание *</Label>
            <Textarea
              id="achievement-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Расскажите подробнее о достижении..."
              required
              minLength={20}
              maxLength={500}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievement-date">Дата *</Label>
            <Input id="achievement-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievement-icon">Эмодзи иконка (опционально)</Label>
            <Input
              id="achievement-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="🏆"
              maxLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievement-image">URL изображения (опционально)</Label>
            <Input
              id="achievement-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Добавление..." : "Добавить достижение"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

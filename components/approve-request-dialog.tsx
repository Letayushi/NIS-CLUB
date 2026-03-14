"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { ClubRequest, ScheduleSlot } from "@/lib/types"
import { Plus, X } from "lucide-react"

interface ApproveRequestDialogProps {
  request: ClubRequest
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ApproveRequestDialog({ request, open, onOpenChange, onSuccess }: ApproveRequestDialogProps) {
  const [name, setName] = useState(request.clubName)
  const [description, setDescription] = useState(request.description)
  const [shortDescription, setShortDescription] = useState("")
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(request.schedule)
  const [coverImage, setCoverImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const addScheduleSlot = () => {
    setSchedule([...schedule, { day: "", time: "", room: "" }])
  }

  const removeScheduleSlot = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index))
  }

  const updateScheduleSlot = (index: number, field: keyof ScheduleSlot, value: string) => {
    const newSchedule = [...schedule]
    newSchedule[index][field] = value
    setSchedule(newSchedule)
  }

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shortDescription.trim()) {
      toast({ title: "Введите краткое описание", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      await api.requests.approve(request.id, {
        name: name.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        coverImage: coverImage.trim(),
        schedule,
      })
      toast({
        title: "Клуб создан!",
        description: `Клуб "${name}" успешно создан и одобрен.`,
      })
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Не удалось создать клуб",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Одобрить и создать клуб</DialogTitle>
          <DialogDescription>Заполните данные для создания клуба на основе заявки</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleApprove} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="approve-name">Название клуба *</Label>
            <Input
              id="approve-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              maxLength={60}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="approve-short">Краткое описание *</Label>
            <Input
              id="approve-short"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Краткое описание для карточки клуба"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="approve-description">Полное описание *</Label>
            <Textarea
              id="approve-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={20}
              maxLength={1500}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="approve-cover">URL обложки *</Label>
            <Input
              id="approve-cover"
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Расписание *</Label>
            {schedule.map((slot, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Input
                  placeholder="День"
                  value={slot.day}
                  onChange={(e) => updateScheduleSlot(index, "day", e.target.value)}
                  required
                />
                <Input
                  placeholder="Время"
                  value={slot.time}
                  onChange={(e) => updateScheduleSlot(index, "time", e.target.value)}
                  required
                />
                <Input
                  placeholder="Кабинет"
                  value={slot.room}
                  onChange={(e) => updateScheduleSlot(index, "room", e.target.value)}
                  required
                />
                {schedule.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeScheduleSlot(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addScheduleSlot}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить занятие
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Создание..." : "Создать клуб"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

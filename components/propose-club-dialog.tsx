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
import { Plus, X } from "lucide-react"
import type { ScheduleSlot } from "@/lib/types"

interface ProposeClubDialogProps {
  onSuccess?: () => void
}

export function ProposeClubDialog({ onSuccess }: ProposeClubDialogProps = {}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [goals, setGoals] = useState("")
  const [curator, setCurator] = useState("")
  const [contacts, setContacts] = useState("")
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([{ day: "", time: "", room: "" }])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validSchedule = schedule.filter((s) => s.day.trim() && s.time.trim() && s.room.trim())
    if (validSchedule.length === 0) {
      toast({ title: "Добавьте расписание", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      await api.requests.create({
        clubName: name.trim(),
        description: description.trim(),
        goals: goals.trim(),
        schedule: validSchedule,
        curator: curator.trim() || undefined,
        contacts: contacts.trim(),
      })
      toast({
        title: "Заявка отправлена!",
        description: "Ваша заявка на создание клуба отправлена администратору на рассмотрение.",
      })
      setOpen(false)
      setName("")
      setDescription("")
      setGoals("")
      setCurator("")
      setContacts("")
      setSchedule([{ day: "", time: "", room: "" }])
      onSuccess?.()
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Не удалось отправить заявку",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Предложить клуб
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Предложить новый клуб</DialogTitle>
          <DialogDescription>Заполните форму для создания заявки на новый клуб</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="club-name">Название клуба *</Label>
            <Input
              id="club-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Клуб робототехники"
              required
              minLength={3}
              maxLength={60}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание клуба *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Расскажите о клубе, чем будете заниматься..."
              required
              minLength={20}
              maxLength={600}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Цели и задачи *</Label>
            <Textarea
              id="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Какие цели преследует клуб?"
              required
              minLength={20}
              maxLength={400}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Предполагаемое расписание *</Label>
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

          <div className="space-y-2">
            <Label htmlFor="curator">Куратор (опционально)</Label>
            <Input
              id="curator"
              value={curator}
              onChange={(e) => setCurator(e.target.value)}
              placeholder="Иванов И.И."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contacts">Ваши контакты *</Label>
            <Input
              id="contacts"
              value={contacts}
              onChange={(e) => setContacts(e.target.value)}
              placeholder="+7 777 123 4567 или email"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Отправка..." : "Отправить заявку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

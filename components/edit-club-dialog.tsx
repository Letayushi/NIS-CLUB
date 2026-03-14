"use client"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { Settings, Plus, X } from "lucide-react"
import type { Club, ScheduleSlot } from "@/lib/types"

interface EditClubDialogProps {
  club: Club
}

export function EditClubDialog({ club, onSuccess }: EditClubDialogProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState(club.description)
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(club.schedule)
  const [telegram, setTelegram] = useState(club.links.telegram || "")
  const [whatsapp, setWhatsapp] = useState(club.links.whatsapp || "")
  const [website, setWebsite] = useState(club.links.website || "")
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

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await api.clubs.update(club.id, {
        description,
        schedule,
        links: { telegram: telegram || undefined, whatsapp: whatsapp || undefined, website: website || undefined },
      })
      toast({
        title: "Изменения сохранены",
        description: "Информация о клубе успешно обновлена.",
      })
      setOpen(false)
      onSuccess?.()
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Не удалось сохранить",
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
          <Settings className="h-4 w-4 mr-2" />
          Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать клуб</DialogTitle>
          <DialogDescription>Управление информацией о клубе "{club.name}"</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
            <TabsTrigger value="links">Ссылки</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Описание клуба</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                minLength={20}
                maxLength={1500}
              />
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-2">
              <Label>Расписание занятий</Label>
              {schedule.map((slot, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input
                    placeholder="День"
                    value={slot.day}
                    onChange={(e) => updateScheduleSlot(index, "day", e.target.value)}
                  />
                  <Input
                    placeholder="Время"
                    value={slot.time}
                    onChange={(e) => updateScheduleSlot(index, "time", e.target.value)}
                  />
                  <Input
                    placeholder="Кабинет"
                    value={slot.room}
                    onChange={(e) => updateScheduleSlot(index, "room", e.target.value)}
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
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telegram">Telegram</Label>
              <Input
                id="telegram"
                type="url"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="https://t.me/yourgroup"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="url"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="https://wa.me/77771234567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Веб-сайт</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave} className="w-full" disabled={isLoading}>
          {isLoading ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

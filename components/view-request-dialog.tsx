"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { ClubRequest } from "@/lib/types"

interface ViewRequestDialogProps {
  request: ClubRequest
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewRequestDialog({ request, open, onOpenChange }: ViewRequestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Заявка на клуб</DialogTitle>
          <DialogDescription>Подробная информация о заявке</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Название клуба</Label>
            <p className="font-medium">{request.clubName}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Описание</Label>
            <p className="text-sm">{request.description}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Цели и задачи</Label>
            <p className="text-sm">{request.goals}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Предполагаемое расписание</Label>
            <div className="space-y-1 mt-1">
              {request.schedule.map((slot, index) => (
                <p key={index} className="text-sm">
                  {slot.day} - {slot.time} - {slot.room}
                </p>
              ))}
            </div>
          </div>

          {request.curator && (
            <div>
              <Label className="text-muted-foreground">Куратор</Label>
              <p className="text-sm">{request.curator}</p>
            </div>
          )}

          <div>
            <Label className="text-muted-foreground">Контакты</Label>
            <p className="text-sm">{request.contacts}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Дата подачи</Label>
            <p className="text-sm">
              {new Date(request.createdAt).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

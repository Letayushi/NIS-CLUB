"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { ClubRequest } from "@/lib/types"

interface RejectRequestDialogProps {
  request: ClubRequest
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RejectRequestDialog({ request, open, onOpenChange, onSuccess }: RejectRequestDialogProps) {
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.requests.reject(request.id, { adminComment: reason.trim() })
      toast({
        title: "Заявка отклонена",
        description: "Заявка отклонена с комментарием для заявителя.",
        variant: "destructive",
      })
      onOpenChange(false)
      setReason("")
      onSuccess?.()
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Не удалось отклонить заявку",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отклонить заявку</DialogTitle>
          <DialogDescription>Укажите причину отклонения заявки на клуб "{request.clubName}"</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleReject} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Причина отклонения *</Label>
            <Textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Объясните причину отклонения..."
              required
              minLength={10}
              maxLength={300}
              rows={4}
            />
          </div>

          <Button type="submit" variant="destructive" className="w-full" disabled={isLoading}>
            {isLoading ? "Отклонение..." : "Отклонить заявку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

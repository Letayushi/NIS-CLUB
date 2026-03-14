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
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { UserPlus } from "lucide-react"

interface JoinClubDialogProps {
  clubName: string
  clubId: string
  onSuccess?: () => void
}

export function JoinClubDialog({ clubName, clubId, onSuccess }: JoinClubDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: "Войдите в аккаунт", description: "Чтобы вступить в клуб, нужно войти.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      await api.clubs.join(clubId)
      toast({
        title: "Вы в клубе!",
        description: `Вы успешно вступили в клуб "${clubName}".`,
      })
      setOpen(false)
      onSuccess?.()
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Не удалось вступить в клуб",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <UserPlus className="h-4 w-4 mr-2" />
          Вступить в клуб
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вступить в клуб</DialogTitle>
          <DialogDescription>
            {user ? `Присоединиться к клубу "${clubName}"?` : `Войдите в аккаунт, чтобы вступить в клуб "${clubName}".`}
          </DialogDescription>
        </DialogHeader>
        {user ? (
          <form onSubmit={handleJoin} className="space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Вступление..." : "Вступить в клуб"}
            </Button>
          </form>
        ) : (
          <Button asChild>
            <a href="/login">Войти</a>
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}

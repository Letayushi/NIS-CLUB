import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"
import type { Club } from "@/lib/types"

interface ClubCardProps {
  club: Club
}

export function ClubCard({ club }: ClubCardProps) {
  return (
    <Link href={`/clubs/${club.id}`}>
      <Card className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer h-full">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={club.coverImage || "/placeholder.svg"}
            alt={club.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{club.name}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {club.categories[0]}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{club.shortDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{club.schedule.length} занятий/нед</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{club.memberCount} участников</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

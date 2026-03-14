import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ScheduleSlot } from "@/lib/types"

interface ScheduleTableProps {
  schedule: ScheduleSlot[]
}

const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]

export function ScheduleTable({ schedule }: ScheduleTableProps) {
  // Group schedule by day
  const scheduleByDay = daysOfWeek.map((day) => {
    const slots = schedule.filter((slot) => slot.day === day)
    return { day, slots }
  })

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">День недели</TableHead>
            <TableHead>Время</TableHead>
            <TableHead>Кабинет</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduleByDay.map(({ day, slots }) => (
            <TableRow key={day}>
              <TableCell className="font-medium">{day}</TableCell>
              <TableCell>
                {slots.length > 0 ? (
                  <div className="space-y-1">
                    {slots.map((slot, idx) => (
                      <div key={idx}>{slot.time}</div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {slots.length > 0 ? (
                  <div className="space-y-1">
                    {slots.map((slot, idx) => (
                      <div key={idx}>{slot.room}</div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

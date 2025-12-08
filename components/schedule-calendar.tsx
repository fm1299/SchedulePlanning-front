"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { weekDays, timeSlots, type Schedule } from "@/lib/mock-data"
import { Calendar } from "lucide-react"

interface ScheduleCalendarProps {
  schedules: Schedule[]
  title?: string
  description?: string
  onSlotClick?: (day: string, time: string) => void
  showEmptySlots?: boolean
  className?: string
}

export function ScheduleCalendar({
  schedules,
  title = "Calendario de Horarios",
  description = "Vista semanal de horarios",
  onSlotClick,
  showEmptySlots = true,
  className = "",
}: ScheduleCalendarProps) {
  const getScheduleForSlot = (day: string, time: string) => {
    return schedules.find((schedule) => schedule.day === day && schedule.startTime === time)
  }

  const isSlotOccupied = (day: string, time: string) => {
    return schedules.some((schedule) => {
      const startIndex = timeSlots.indexOf(schedule.startTime)
      const endIndex = timeSlots.indexOf(schedule.endTime)
      const currentIndex = timeSlots.indexOf(time)
      return schedule.day === day && currentIndex >= startIndex && currentIndex < endIndex
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-6 gap-1 mb-2">
              <div className="p-2 font-medium text-center">Hora</div>
              {weekDays.map((day) => (
                <div key={day} className="p-2 font-medium text-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Time slots */}
            {timeSlots.slice(0, 12).map((time) => (
              <div key={time} className="grid grid-cols-6 gap-1 mb-1">
                <div className="p-2 font-medium bg-muted rounded text-center text-sm">{time}</div>
                {weekDays.map((day) => {
                  const schedule = getScheduleForSlot(day, time)
                  const isOccupied = isSlotOccupied(day, time)

                  return (
                    <div key={day} className="min-h-[60px]">
                      {schedule ? (
                        <div
                          className={`p-2 bg-primary text-primary-foreground rounded cursor-pointer hover:opacity-80 h-full ${
                            onSlotClick ? "cursor-pointer" : ""
                          }`}
                          onClick={() => onSlotClick?.(day, time)}
                        >
                          <div className="text-xs font-medium">{schedule.courseName}</div>
                          <div className="text-xs opacity-80">{schedule.aulaName}</div>
                          <div className="text-xs opacity-80">
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            Grupo {schedule.group}
                          </Badge>
                        </div>
                      ) : showEmptySlots ? (
                        <div
                          className={`p-2 bg-muted/50 rounded h-full flex items-center justify-center text-xs text-muted-foreground ${
                            onSlotClick ? "cursor-pointer hover:bg-muted" : ""
                          }`}
                          onClick={() => onSlotClick?.(day, time)}
                        >
                          {onSlotClick ? "Libre" : ""}
                        </div>
                      ) : (
                        <div className="h-full" />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

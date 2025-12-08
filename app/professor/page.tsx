"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { weekDays, timeSlots } from "@/lib/mock-data"
import { Calendar, Clock, BookOpen, CheckCircle, Play, Square } from "lucide-react"

interface ClassSession {
  id: string
  courseName: string
  day: string
  startTime: string
  endTime: string
  aulaName: string
  syllabus: string[]
  completedItems: string[]
  isActive: boolean
}

export default function ProfessorDashboard() {
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null)
  const [completedItems, setCompletedItems] = useState<string[]>([])
  const [isClassActive, setIsClassActive] = useState(false)

  // Mock schedule data for the professor
  const professorSchedule: ClassSession[] = [
    {
      id: "1",
      courseName: "Cálculo I",
      day: "Lunes",
      startTime: "08:00",
      endTime: "10:00",
      aulaName: "Aula 101",
      syllabus: ["Límites", "Derivadas", "Integrales", "Aplicaciones"],
      completedItems: ["Límites", "Derivadas"],
      isActive: false,
    },
    {
      id: "2",
      courseName: "Cálculo I",
      day: "Miércoles",
      startTime: "10:00",
      endTime: "12:00",
      aulaName: "Aula 102",
      syllabus: ["Límites", "Derivadas", "Integrales", "Aplicaciones"],
      completedItems: ["Límites", "Derivadas"],
      isActive: false,
    },
    {
      id: "3",
      courseName: "Cálculo I",
      day: "Viernes",
      startTime: "14:00",
      endTime: "16:00",
      aulaName: "Aula 101",
      syllabus: ["Límites", "Derivadas", "Integrales", "Aplicaciones"],
      completedItems: ["Límites", "Derivadas"],
      isActive: false,
    },
  ]

  const handleStartClass = () => {
    setIsClassActive(true)
  }

  const handleEndClass = () => {
    setIsClassActive(false)
    // Save completed items logic here
  }

  const handleSyllabusItemToggle = (item: string) => {
    setCompletedItems((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
  }

  const getScheduleGrid = () => {
    const grid: { [key: string]: ClassSession | null } = {}

    weekDays.forEach((day) => {
      timeSlots.forEach((time) => {
        const key = `${day}-${time}`
        const classSession = professorSchedule.find((session) => session.day === day && session.startTime === time)
        grid[key] = classSession || null
      })
    })

    return grid
  }

  const scheduleGrid = getScheduleGrid()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard del Profesor</h1>
        <p className="text-muted-foreground">Gestiona tus clases y horarios</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clases Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{professorSchedule.length}</div>
            <p className="text-xs text-muted-foreground">3 cursos diferentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso del Syllabus</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">75%</div>
            <p className="text-xs text-muted-foreground">Cálculo I completado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Clase</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Lunes</div>
            <p className="text-xs text-muted-foreground">08:00 - Cálculo I</p>
          </CardContent>
        </Card>
      </div>

      {/* Personal Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Mi Horario Personal
          </CardTitle>
          <CardDescription>Haz clic en una clase para marcar asistencia y progreso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 gap-1 mb-2">
                <div className="p-2 font-medium text-center">Hora</div>
                {weekDays.map((day) => (
                  <div key={day} className="p-2 font-medium text-center">
                    {day}
                  </div>
                ))}
              </div>
              {timeSlots.slice(0, 12).map((time) => (
                <div key={time} className="grid grid-cols-6 gap-1 mb-1">
                  <div className="p-2 font-medium bg-muted rounded text-center text-sm">{time}</div>
                  {weekDays.map((day) => {
                    const classSession = scheduleGrid[`${day}-${time}`]
                    return (
                      <div key={day} className="min-h-[60px]">
                        {classSession ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="p-2 bg-primary text-primary-foreground rounded cursor-pointer hover:opacity-80 h-full">
                                <div className="text-xs font-medium">{classSession.courseName}</div>
                                <div className="text-xs opacity-80">{classSession.aulaName}</div>
                                <div className="text-xs opacity-80">
                                  {classSession.startTime} - {classSession.endTime}
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>{classSession.courseName}</DialogTitle>
                                <DialogDescription>
                                  {classSession.day} {classSession.startTime} - {classSession.endTime} en{" "}
                                  {classSession.aulaName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex gap-2">
                                  <Button
                                    onClick={handleStartClass}
                                    disabled={isClassActive}
                                    className="flex-1"
                                    size="sm"
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    {isClassActive ? "Clase Iniciada" : "Iniciar Clase"}
                                  </Button>
                                  <Button
                                    onClick={handleEndClass}
                                    disabled={!isClassActive}
                                    variant="outline"
                                    className="flex-1 bg-transparent"
                                    size="sm"
                                  >
                                    <Square className="h-4 w-4 mr-2" />
                                    Finalizar
                                  </Button>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Progreso del Syllabus</h4>
                                  <div className="space-y-2">
                                    {classSession.syllabus.map((item) => (
                                      <div key={item} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={item}
                                          checked={
                                            classSession.completedItems.includes(item) || completedItems.includes(item)
                                          }
                                          onCheckedChange={() => handleSyllabusItemToggle(item)}
                                        />
                                        <label htmlFor={item} className="text-sm">
                                          {item}
                                        </label>
                                        {classSession.completedItems.includes(item) && (
                                          <CheckCircle className="h-4 w-4 text-green-600" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <div className="p-2 bg-muted/50 rounded h-full" />
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
    </div>
  )
}

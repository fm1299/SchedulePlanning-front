"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockUsers, mockAulas, mockCourses, timeSlots, weekDays } from "@/lib/mock-data"
import { Calendar, Clock, Users, BookOpen } from "lucide-react"

export default function HorarioPage() {
  const [selectedProfessor, setSelectedProfessor] = useState("")
  const [selectedAula, setSelectedAula] = useState("")
  const [selectedDay, setSelectedDay] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [courseName, setCourseName] = useState("")
  const [courseCapacity, setCourseCapacity] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<"A" | "B">("A")

  const professors = mockUsers.filter((user) => user.role === "professor")
  const availableAulas = mockAulas.filter((aula) => aula.status === "available")

  const handleGenerateSchedule = () => {
    // Mock schedule generation logic
    console.log("Generating schedule with:", {
      professor: selectedProfessor,
      aula: selectedAula,
      day: selectedDay,
      startTime,
      endTime,
      courseName,
      courseCapacity,
      group: selectedGroup,
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestión de Horarios</h1>
        <p className="text-muted-foreground">Crear y administrar horarios de clases</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Crear Nuevo Horario
            </CardTitle>
            <CardDescription>Configure los detalles del horario de clase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professor">Profesor</Label>
                <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar profesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {professors.map((professor) => (
                      <SelectItem key={professor.id} value={professor.id}>
                        {professor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aula">Aula</Label>
                <Select value={selectedAula} onValueChange={setSelectedAula}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar aula" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAulas.map((aula) => (
                      <SelectItem key={aula.id} value={aula.id}>
                        {aula.name} (Cap: {aula.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Nombre del Curso</Label>
              <Input
                id="course"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Ej: Cálculo I"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day">Día</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Día" />
                  </SelectTrigger>
                  <SelectContent>
                    {weekDays.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-time">Hora Inicio</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Inicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">Hora Fin</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fin" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidad del Curso</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={courseCapacity}
                  onChange={(e) => setCourseCapacity(e.target.value)}
                  placeholder="Número de estudiantes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Grupo</Label>
                <Select value={selectedGroup} onValueChange={(value: "A" | "B") => setSelectedGroup(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Grupo A</SelectItem>
                    <SelectItem value="B">Grupo B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleGenerateSchedule} className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              Generar Horario
            </Button>
          </CardContent>
        </Card>

        {/* Schedule Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Vista Previa del Horario
            </CardTitle>
            <CardDescription>Horarios programados para esta semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCourses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{course.name}</h4>
                    <Badge variant="outline">Grupo {course.group}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {course.professor}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Martes 10:00 - 12:00
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Capacidad: {course.capacity} estudiantes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

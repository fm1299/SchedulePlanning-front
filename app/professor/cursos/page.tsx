"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { mockCourses, type Course } from "@/lib/mock-data"
import { BookOpen, Plus, Users, TrendingUp } from "lucide-react"

export default function CursosPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [newCourse, setNewCourse] = useState({
    name: "",
    capacity: "",
    syllabus: [""],
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddSyllabusItem = () => {
    setNewCourse((prev) => ({
      ...prev,
      syllabus: [...prev.syllabus, ""],
    }))
  }

  const handleSyllabusItemChange = (index: number, value: string) => {
    setNewCourse((prev) => ({
      ...prev,
      syllabus: prev.syllabus.map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleRemoveSyllabusItem = (index: number) => {
    setNewCourse((prev) => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== index),
    }))
  }

  const handleCreateCourse = () => {
    const course: Course = {
      id: Date.now().toString(),
      name: newCourse.name,
      professor: "Dr. Juan Pérez", // Current user
      professorId: "2",
      capacity: Number.parseInt(newCourse.capacity),
      group: "A",
      syllabus: newCourse.syllabus.filter((item) => item.trim() !== ""),
      progress: 0,
    }

    setCourses((prev) => [...prev, course])
    setNewCourse({ name: "", capacity: "", syllabus: [""] })
    setIsDialogOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Cursos</h1>
          <p className="text-muted-foreground">Gestiona tus cursos y contenido académico</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Curso</DialogTitle>
              <DialogDescription>Configura los detalles del curso y su syllabus</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course-name">Nombre del Curso</Label>
                  <Input
                    id="course-name"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Álgebra Lineal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-capacity">Capacidad</Label>
                  <Input
                    id="course-capacity"
                    type="number"
                    value={newCourse.capacity}
                    onChange={(e) => setNewCourse((prev) => ({ ...prev, capacity: e.target.value }))}
                    placeholder="Número de estudiantes"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Syllabus del Curso</Label>
                <div className="space-y-2">
                  {newCourse.syllabus.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleSyllabusItemChange(index, e.target.value)}
                        placeholder={`Tema ${index + 1}`}
                      />
                      {newCourse.syllabus.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveSyllabusItem(index)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={handleAddSyllabusItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Tema
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCourse} disabled={!newCourse.name || !newCourse.capacity}>
                  Crear Curso
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {course.name}
                </CardTitle>
                <Badge variant="outline">Grupo {course.group}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.capacity} estudiantes
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {course.progress}% completado
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progreso del Syllabus</span>
                  <span className="text-sm text-muted-foreground">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Contenido del Curso</h4>
                <div className="space-y-1">
                  {course.syllabus.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          index < Math.floor((course.progress / 100) * course.syllabus.length)
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                      <span
                        className={
                          index < Math.floor((course.progress / 100) * course.syllabus.length)
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No tienes cursos creados</h3>
          <p className="text-muted-foreground mb-4">Crea tu primer curso para comenzar</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Primer Curso
          </Button>
        </div>
      )}
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatsCard } from "@/components/stats-card"
import { DataExport } from "@/components/data-export"
import { mockCourses, mockReservations } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { BookOpen, Calendar, TrendingUp, Clock, Target, Award } from "lucide-react"
import { useState } from "react"

export default function ProfessorReportesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("semester")

  const professorReservations = mockReservations.filter((r) => r.professorId === "2")
  const professorCourses = mockCourses.filter((c) => c.professorId === "2")

  const classesData = [
    { month: "Ene", classes: 16, hours: 32, students: 140 },
    { month: "Feb", classes: 18, hours: 36, students: 155 },
    { month: "Mar", classes: 20, hours: 40, students: 160 },
    { month: "Abr", classes: 15, hours: 30, students: 135 },
    { month: "May", classes: 22, hours: 44, students: 170 },
  ]

  const performanceData = [
    { week: "Sem 1", attendance: 95, completion: 85 },
    { week: "Sem 2", attendance: 92, completion: 88 },
    { week: "Sem 3", attendance: 97, completion: 90 },
    { week: "Sem 4", attendance: 94, completion: 92 },
  ]

  const syllabusProgressData = professorCourses.map((course) => ({
    name: course.name,
    progress: course.progress,
    completed: Math.floor((course.progress / 100) * course.syllabus.length),
    total: course.syllabus.length,
    students: course.capacity,
  }))

  const reservationStatusData = [
    {
      name: "Aprobadas",
      value: professorReservations.filter((r) => r.status === "approved").length,
      color: "hsl(var(--primary))",
    },
    {
      name: "Pendientes",
      value: professorReservations.filter((r) => r.status === "pending").length,
      color: "hsl(var(--secondary))",
    },
    {
      name: "Rechazadas",
      value: professorReservations.filter((r) => r.status === "rejected").length,
      color: "hsl(var(--destructive))",
    },
  ]

  const totalClasses = classesData.reduce((acc, month) => acc + month.classes, 0)
  const totalHours = classesData.reduce((acc, month) => acc + month.hours, 0)
  const averageProgress = Math.round(
    professorCourses.reduce((acc, course) => acc + course.progress, 0) / professorCourses.length,
  )

  const exportData = [
    ...classesData.map((month) => ({
      tipo: "Clases Mensuales",
      periodo: month.month,
      valor: month.classes,
      horas: month.hours,
      estudiantes: month.students,
    })),
    ...syllabusProgressData.map((course) => ({
      tipo: "Progreso Curso",
      periodo: course.name,
      valor: course.progress,
      completados: course.completed,
      total: course.total,
    })),
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Reportes Académicos</h1>
          <p className="text-muted-foreground">Análisis detallado de tu desempeño y actividad</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="semester">Este semestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          <DataExport data={exportData} filename="reporte-profesor" title="Exportar Reporte" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Clases Impartidas"
          value={totalClasses}
          description="este semestre"
          icon={BookOpen}
          trend={{ value: 12.5, label: "vs semestre anterior", isPositive: true }}
        />
        <StatsCard
          title="Horas Académicas"
          value={totalHours}
          description="horas de enseñanza"
          icon={Clock}
          trend={{ value: 8.3, label: "incremento semestral", isPositive: true }}
        />
        <StatsCard
          title="Progreso Promedio"
          value={`${averageProgress}%`}
          description="del syllabus completado"
          icon={TrendingUp}
          trend={{ value: 15.2, label: "mejora continua", isPositive: true }}
        />
        <StatsCard
          title="Reservas Exitosas"
          value={`${Math.round((professorReservations.filter((r) => r.status === "approved").length / professorReservations.length) * 100)}%`}
          description="tasa de aprobación"
          icon={Target}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Académica Mensual</CardTitle>
            <CardDescription>Clases, horas y estudiantes por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="classes" fill="hsl(var(--primary))" name="Clases" />
                <Bar dataKey="hours" fill="hsl(var(--secondary))" name="Horas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento Semanal</CardTitle>
            <CardDescription>Asistencia y completitud de clases</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="hsl(var(--primary))" name="% Asistencia" />
                <Line type="monotone" dataKey="completion" stroke="hsl(var(--secondary))" name="% Completitud" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Reservas</CardTitle>
            <CardDescription>Distribución del estado de tus reservas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reservationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reservationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estudiantes por Mes</CardTitle>
            <CardDescription>Número total de estudiantes atendidos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="hsl(var(--accent))" name="Estudiantes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso Detallado del Syllabus</CardTitle>
          <CardDescription>Estado de avance de cada curso con métricas de rendimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {syllabusProgressData.map((course) => (
              <div key={course.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{course.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {course.completed} de {course.total} temas completados • {course.students} estudiantes
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={course.progress >= 75 ? "default" : course.progress >= 50 ? "secondary" : "outline"}
                    >
                      {course.progress}%
                    </Badge>
                    {course.progress >= 90 && <Award className="h-4 w-4 text-yellow-500" />}
                  </div>
                </div>
                <Progress value={course.progress} className="h-3" />
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="font-medium text-primary">{Math.round(course.progress * 0.95)}%</div>
                    <div className="text-muted-foreground">Asistencia</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="font-medium text-primary">{Math.round(course.progress * 0.88)}%</div>
                    <div className="text-muted-foreground">Participación</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="font-medium text-primary">{Math.round(course.progress * 0.92)}%</div>
                    <div className="text-muted-foreground">Evaluaciones</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Resumen de tu actividad académica reciente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="bg-primary p-2 rounded-full">
                  <BookOpen className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Clase de Cálculo I completada</p>
                  <p className="text-sm text-muted-foreground">Tema: Integrales - Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="bg-secondary p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Reserva aprobada</p>
                  <p className="text-sm text-muted-foreground">Lab Computación - Viernes 14:00 - Hace 1 día</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="bg-accent p-2 rounded-full">
                  <TrendingUp className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium">Progreso del syllabus actualizado</p>
                  <p className="text-sm text-muted-foreground">Cálculo I - 85% completado - Hace 3 días</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logros y Reconocimientos</CardTitle>
            <CardDescription>Tus logros académicos destacados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Award className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Excelencia Académica</p>
                  <p className="text-sm text-green-600">95% promedio de asistencia estudiantil</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Meta Cumplida</p>
                  <p className="text-sm text-blue-600">100% del syllabus completado a tiempo</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">Mejora Continua</p>
                  <p className="text-sm text-purple-600">+15% en evaluaciones estudiantiles</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatsCard } from "@/components/stats-card"
import { DataExport } from "@/components/data-export"
import { AulaStatusBadge } from "@/components/aula-status-badge"
import { mockAulas } from "@/lib/mock-data"
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
import { BarChart3, TrendingUp, Calendar, Clock, Filter } from "lucide-react"
import { useState } from "react"

export default function ReportesPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  const weeklyUsageData = [
    { day: "Lunes", usage: 85, classes: 12, hours: 24 },
    { day: "Martes", usage: 92, classes: 15, hours: 30 },
    { day: "Miércoles", usage: 78, classes: 11, hours: 22 },
    { day: "Jueves", usage: 88, classes: 14, hours: 28 },
    { day: "Viernes", usage: 76, classes: 10, hours: 20 },
  ]

  const monthlyTrendData = [
    { month: "Ene", usage: 82, reservations: 45 },
    { month: "Feb", usage: 88, reservations: 52 },
    { month: "Mar", usage: 85, reservations: 48 },
    { month: "Abr", usage: 91, reservations: 58 },
    { month: "May", usage: 87, reservations: 55 },
  ]

  const aulaUsageData = mockAulas.map((aula, index) => ({
    id: aula.id,
    name: aula.name,
    type: aula.type,
    capacity: aula.capacity,
    usage: Math.floor(Math.random() * 40) + 60,
    hours: Math.floor(Math.random() * 20) + 10,
    classes: Math.floor(Math.random() * 15) + 5,
    professor: index % 2 === 0 ? "Dr. Juan Pérez" : "Dra. María García",
    status: aula.status,
  }))

  const typeDistribution = [
    { name: "Aulas", value: 4, color: "hsl(var(--primary))" },
    { name: "Laboratorios", value: 2, color: "hsl(var(--secondary))" },
    { name: "Oficinas", value: 1, color: "hsl(var(--accent))" },
  ]

  const totalHours = aulaUsageData.reduce((acc, aula) => acc + aula.hours, 0)
  const averageUsage = Math.round(aulaUsageData.reduce((acc, aula) => acc + aula.usage, 0) / aulaUsageData.length)
  const topAula = aulaUsageData.reduce((prev, current) => (prev.usage > current.usage ? prev : current))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground">Análisis completo de uso y ocupación de aulas</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="semester">Este semestre</SelectItem>
            </SelectContent>
          </Select>
          <DataExport data={aulaUsageData} filename="reporte-aulas" title="Exportar Reporte" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Promedio de Ocupación"
          value={`${averageUsage}%`}
          description="de todas las aulas"
          icon={BarChart3}
          trend={{ value: 2.1, label: "desde la semana pasada", isPositive: true }}
        />
        <StatsCard
          title="Horas Totales"
          value={totalHours}
          description="horas de uso esta semana"
          icon={Clock}
          trend={{ value: 5.3, label: "vs semana anterior", isPositive: true }}
        />
        <StatsCard
          title="Aula Más Usada"
          value={topAula.name}
          description={`${topAula.usage}% de ocupación`}
          icon={TrendingUp}
        />
        <StatsCard
          title="Reservas Activas"
          value="47"
          description="reservas esta semana"
          icon={Calendar}
          trend={{ value: 8.2, label: "incremento semanal", isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ocupación por Día de la Semana</CardTitle>
            <CardDescription>Porcentaje de uso promedio y número de clases</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usage" fill="hsl(var(--primary))" name="% Ocupación" />
                <Bar dataKey="classes" fill="hsl(var(--secondary))" name="Clases" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendencia Mensual</CardTitle>
            <CardDescription>Evolución del uso y reservas por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="usage" stroke="hsl(var(--primary))" name="% Uso" />
                <Line type="monotone" dataKey="reservations" stroke="hsl(var(--secondary))" name="Reservas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Tipo</CardTitle>
            <CardDescription>Cantidad de espacios por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeDistribution.map((entry, index) => (
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
            <CardTitle>Horas de Uso por Día</CardTitle>
            <CardDescription>Total de horas utilizadas diariamente</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="hsl(var(--accent))" name="Horas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Usage Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Detalle de Uso por Aula</CardTitle>
              <CardDescription>Estadísticas detalladas de ocupación y rendimiento</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avanzados
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aula</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Horas Usadas</TableHead>
                <TableHead>Clases</TableHead>
                <TableHead>% Ocupación</TableHead>
                <TableHead>Profesor Principal</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Eficiencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aulaUsageData.map((aula) => (
                <TableRow key={aula.id}>
                  <TableCell className="font-medium">{aula.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {aula.type === "aula" ? "Aula" : aula.type === "laboratorio" ? "Laboratorio" : "Oficina"}
                    </Badge>
                  </TableCell>
                  <TableCell>{aula.capacity}</TableCell>
                  <TableCell>{aula.hours}h</TableCell>
                  <TableCell>{aula.classes}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${aula.usage}%` }} />
                      </div>
                      <span className="text-sm">{aula.usage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{aula.professor}</TableCell>
                  <TableCell>
                    <AulaStatusBadge status={aula.status} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={aula.usage > 85 ? "default" : aula.usage > 70 ? "secondary" : "outline"}>
                      {aula.usage > 85 ? "Alta" : aula.usage > 70 ? "Media" : "Baja"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights de Rendimiento</CardTitle>
          <CardDescription>Análisis automático y recomendaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-primary">Oportunidades de Mejora</h4>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Aula 201 subutilizada</p>
                  <p className="text-xs text-yellow-600">Solo 45% de ocupación - considerar reasignación</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Pico de demanda los martes</p>
                  <p className="text-xs text-blue-600">92% ocupación - evaluar capacidad adicional</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-primary">Logros Destacados</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Eficiencia general mejorada</p>
                  <p className="text-xs text-green-600">+5.3% vs mes anterior</p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">Laboratorios optimizados</p>
                  <p className="text-xs text-purple-600">88% ocupación promedio</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

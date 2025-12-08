"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockAulas, type Aula } from "@/lib/mock-data"
import { Building, Users, Search } from "lucide-react"

export default function AulasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredAulas = mockAulas.filter((aula) => {
    const matchesSearch =
      aula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aula.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || aula.type === filterType
    const matchesStatus = filterStatus === "all" || aula.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: Aula["status"]) => {
    switch (status) {
      case "available":
        return <Badge variant="default">Disponible</Badge>
      case "occupied":
        return <Badge variant="secondary">Ocupada</Badge>
      case "maintenance":
        return <Badge variant="destructive">Mantenimiento</Badge>
    }
  }

  const getTypeBadge = (type: Aula["type"]) => {
    switch (type) {
      case "aula":
        return <Badge variant="outline">Aula</Badge>
      case "laboratorio":
        return <Badge variant="outline">Laboratorio</Badge>
      case "oficina":
        return <Badge variant="outline">Oficina</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestión de Aulas</h1>
        <p className="text-muted-foreground">Administrar aulas, laboratorios y oficinas</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aulas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="aula">Aula</SelectItem>
            <SelectItem value="laboratorio">Laboratorio</SelectItem>
            <SelectItem value="oficina">Oficina</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="occupied">Ocupada</SelectItem>
            <SelectItem value="maintenance">Mantenimiento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Aulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAulas.map((aula) => (
          <Card key={aula.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  {aula.name}
                </CardTitle>
                {getStatusBadge(aula.status)}
              </div>
              <div className="flex items-center gap-2">
                {getTypeBadge(aula.type)}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {aula.capacity} personas
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{aula.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAulas.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron aulas</h3>
          <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  )
}

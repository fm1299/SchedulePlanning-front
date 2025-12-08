"use client"

import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

// Datos de ejemplo (luego vendrán de la BD)
const profesoresEjemplo = [
  {
    id_docente: 1,
    nombre: "Juan",
    apellidos: "Pérez García",
    departamento: "Ingeniería de Sistemas",
    tipo_docente: "nombrado",
    telefono: "123456789",
    especialidad: "Inteligencia Artificial",
    grado_academico: "Doctor",
    max_horas_sem: 40
  },
  {
    id_docente: 2,
    nombre: "María",
    apellidos: "López Hernández",
    departamento: "Matemáticas",
    tipo_docente: "contratado",
    telefono: "987654321",
    especialidad: "Cálculo Diferencial",
    grado_academico: "Magister",
    max_horas_sem: 35
  },
  {
    id_docente: 3,
    nombre: "Carlos",
    apellidos: "Rodríguez Silva",
    departamento: "Física",
    tipo_docente: "invitado",
    telefono: "555666777",
    especialidad: "Física Cuántica",
    grado_academico: "Doctor",
    max_horas_sem: 20
  }
]

const getTipoBadge = (tipo: string) => {
  const tipos: { [key: string]: string } = {
    contratado: "bg-blue-100 text-blue-800",
    nombrado: "bg-purple-100 text-purple-800",
    invitado: "bg-orange-100 text-orange-800"
  }
  return tipos[tipo] || "bg-gray-100 text-gray-800"
}

export default function ProfesoresPage() {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number, nombre: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar al profesor ${nombre}?`)) {
      setDeletingId(id)
      try {
        console.log("Eliminando profesor:", id)
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert("Profesor eliminado correctamente")
        window.location.reload()
      } catch (error) {
        console.error("Error al eliminar profesor:", error)
        alert("Error al eliminar el profesor")
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Profesores</h1>
          <p className="text-muted-foreground mt-2">
            Administra la información de los profesores del sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/profesores/nuevo" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Profesor
          </Link>
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Profesores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profesoresEjemplo.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nombrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {profesoresEjemplo.filter(p => p.tipo_docente === 'nombrado').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contratados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {profesoresEjemplo.filter(p => p.tipo_docente === 'contratado').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Profesores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Profesores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Nombre</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Departamento</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Tipo</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Grado</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Horas Máx.</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {profesoresEjemplo.map((profesor) => (
                  <tr key={profesor.id_docente} className="border-b">
                    <td className="p-4 align-middle">
                      <div>
                        <div className="font-medium">{profesor.nombre} {profesor.apellidos}</div>
                        <div className="text-sm text-muted-foreground">{profesor.especialidad}</div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">{profesor.departamento}</td>
                    <td className="p-4 align-middle">
                      <Badge variant="secondary" className={getTipoBadge(profesor.tipo_docente)}>
                        {profesor.tipo_docente}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">{profesor.grado_academico}</td>
                    <td className="p-4 align-middle">{profesor.max_horas_sem} h/sem</td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/profesores/${profesor.id_docente}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(profesor.id_docente, `${profesor.nombre} ${profesor.apellidos}`)}
                          disabled={deletingId === profesor.id_docente}
                        >
                          {deletingId === profesor.id_docente ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
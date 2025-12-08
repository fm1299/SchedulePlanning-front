"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DocentesAPI } from "@/lib/api"

const getTipoBadge = (tipo: string) => {
  const tipos: { [key: string]: string } = {
    contratado: "bg-blue-100 text-blue-800",
    nombrado: "bg-purple-100 text-purple-800",
    invitado: "bg-orange-100 text-orange-800"
  }
  return tipos[tipo] || "bg-gray-100 text-gray-800"
}

export default function ProfesoresPage() {
  const [profesores, setProfesores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    DocentesAPI.listar()
      .then((res) => setProfesores(res.items))
      .catch(() => alert("Error cargando profesores"))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar al profesor ${nombre}?`)) return
    setDeletingId(id)

    try {
      await DocentesAPI.eliminar(id)
      setProfesores(prev => prev.filter(p => p.id_docente !== id))
    } catch {
      alert("Error al eliminar profesor")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <p className="p-6">Cargando...</p>

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
            <div className="text-2xl font-bold">{profesores.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nombrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {profesores.filter(p => p.tipo_docente.nombre === 'nombrado').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contratados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {profesores.filter(p => p.tipo_docente.nombre === 'contratado').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Profesores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left font-medium">Nombre</th>
                  <th className="h-12 px-4 text-left font-medium">Departamento</th>
                  <th className="h-12 px-4 text-left font-medium">Tipo</th>
                  <th className="h-12 px-4 text-left font-medium">Grado</th>
                  <th className="h-12 px-4 text-left font-medium">Horas Máx.</th>
                  <th className="h-12 px-4 text-left font-medium">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {profesores.map((p) => (
                  <tr key={p.id_docente} className="border-b">
                    <td className="p-4">
                      <div className="font-medium">{p.nombre} {p.apellidos}</div>
                      <div className="text-sm text-muted-foreground">{p.especialidad}</div>
                    </td>

                    <td className="p-4">{p.departamento.nombre}</td>

                    <td className="p-4">
                      <Badge variant="secondary" className={getTipoBadge(p.tipo_docente.nombre)}>
                        {p.tipo_docente.nombre}
                      </Badge>
                    </td>

                    <td className="p-4">{p.grado_academico}</td>

                    <td className="p-4">{p.max_horas_sem} h/sem</td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/profesores/${p.id_docente}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(p.id_docente, `${p.nombre} ${p.apellidos}`)}
                          disabled={deletingId === p.id_docente}
                        >
                          {deletingId === p.id_docente ? (
                            <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
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

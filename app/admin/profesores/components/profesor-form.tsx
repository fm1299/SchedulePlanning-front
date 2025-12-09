"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { DocentesAPI } from "@/lib/api"

// Datos de ejemplo temporales
const departamentos = [
  { id: 1, nombre: "Departamento de Ingeniería de Sistemas" },
  { id: 2, nombre: "Departamento de Matemáticas" },
  { id: 3, nombre: "Departamento de Física" }
]

const tiposDocente = [
  { id: 1, nombre: "contratado" },
  { id: 2, nombre: "nombrado" },
  { id: 3, nombre: "invitado" }
]

const gradosAcademicos = ["Licenciado", "Magister", "Doctor"]

export function ProfesorForm({ profesor }: { profesor?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // CORRECCIÓN IMPORTANTE:
  // Si profesor viene del backend, convertimos su estructura COMPLEJA en algo simple
  useEffect(() => {
    if (profesor) {
      setFormData({
        nombre: profesor.nombre,
        apellidos: profesor.apellidos,
        telefono: profesor.telefono || "",
        especialidad: profesor.especialidad || "",
        grado_academico: profesor.grado_academico || "",
        max_horas_sem: profesor.max_horas_sem || 40,

        // CORRECCIÓN: extraer el ID REAL
        //id_departamento: profesor.departamento.id_departamento.toString(),
        id_tipo: profesor.tipo_docente.id_tipo.toString(),
      })
    }
  }, [profesor])

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    //id_departamento: "",
    id_tipo: "",
    telefono: "",
    especialidad: "",
    grado_academico: "",
    max_horas_sem: 40,
  })

  // Actualización de campos
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // ENVÍO CORREGIDO
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // PREPARAR PAYLOAD LIMPIO
    const payload = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      telefono: formData.telefono,
      especialidad: formData.especialidad,
      grado_academico: formData.grado_academico,

      // CORRECCIÓN: convertir a ENTEROS
      //id_departamento: Number(formData.id_departamento),
      id_tipo: Number(formData.id_tipo),
      max_horas_sem: Number(formData.max_horas_sem),
    }

    try {
      if (profesor) {
        await DocentesAPI.actualizar(profesor.id_docente, payload)
      } else {
        await DocentesAPI.crear(payload)
      }

      router.push("/admin/profesores")
    } catch (error) {
      alert("Error guardando profesor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Personal</h3>
            <div className="grid grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Apellidos *</Label>
                <Input
                  value={formData.apellidos}
                  onChange={(e) => handleChange("apellidos", e.target.value)}
                  required
                />
              </div>

            </div>

            <Label>Teléfono</Label>
            <Input
              value={formData.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
            />
          </div>

          {/* Información Académica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Académica</h3>

            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label>Departamento *</Label>
                <Select
                  //value={formData.id_departamento}
                  onValueChange={(v) => handleChange("id_departamento", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map(d => (
                      <SelectItem key={d.id} value={d.id.toString()}>{d.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Docente *</Label>
                <Select
                  value={formData.id_tipo}
                  onValueChange={(v) => handleChange("id_tipo", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDocente.map(t => (
                      <SelectItem key={t.id} value={t.id.toString()}>{t.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <Label>Grado Académico</Label>
                <Select
                  value={formData.grado_academico}
                  onValueChange={(v) => handleChange("grado_academico", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona grado" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradosAcademicos.map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Especialidad</Label>
                <Input
                  value={formData.especialidad}
                  onChange={(e) => handleChange("especialidad", e.target.value)}
                />
              </div>

            </div>
          </div>

          {/* Configuración */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configuración</h3>

            <div className="space-y-2">
              <Label>Máximo Horas Semanales</Label>
              <Input
                type="number"
                value={formData.max_horas_sem}
                onChange={(e) => handleChange("max_horas_sem", e.target.value)}
                min={1}
                max={60}
              />
            </div>

          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button variant="outline" asChild>
              <Link href="/admin/profesores">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : profesor ? "Actualizar" : "Guardar"}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

// Datos de ejemplo (luego los reemplazaremos con datos reales de la BD)
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

const gradosAcademicos = [
  "Licenciado",
  "Magister", 
  "Doctor"
]

export function ProfesorForm({ profesor }: { profesor?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Estado del formulario SIN el campo "estado"
  const [formData, setFormData] = useState({
    nombre: profesor?.nombre || "",
    apellidos: profesor?.apellidos || "",
    id_departamento: profesor?.id_departamento || "",
    id_tipo: profesor?.id_tipo || "",
    telefono: profesor?.telefono || "",
    especialidad: profesor?.especialidad || "",
    grado_academico: profesor?.grado_academico || "",
    max_horas_sem: profesor?.max_horas_sem || 40
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Aquí irá la lógica para guardar en la base de datos
    console.log("Datos del profesor:", formData)
    
    // Simulamos el guardado
    setTimeout(() => {
      setLoading(false)
      router.push("/admin/profesores")
    }, 1000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  placeholder="Ingresa el nombre"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => handleChange("apellidos", e.target.value)}
                  placeholder="Ingresa los apellidos"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                placeholder="Número de teléfono"
              />
            </div>
          </div>

          {/* Información Académica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Académica</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento *</Label>
                <Select value={formData.id_departamento} onValueChange={(value) => handleChange("id_departamento", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((depto) => (
                      <SelectItem key={depto.id} value={depto.id.toString()}>
                        {depto.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Docente *</Label>
                <Select value={formData.id_tipo} onValueChange={(value) => handleChange("id_tipo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDocente.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grado">Grado Académico</Label>
                <Select value={formData.grado_academico} onValueChange={(value) => handleChange("grado_academico", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona grado" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradosAcademicos.map((grado) => (
                      <SelectItem key={grado} value={grado}>
                        {grado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <Input
                  id="especialidad"
                  value={formData.especialidad}
                  onChange={(e) => handleChange("especialidad", e.target.value)}
                  placeholder="Área de especialización"
                />
              </div>
            </div>
          </div>

          {/* Configuración - SOLO horas máximas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configuración</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_horas">Máximo Horas Semanales</Label>
                <Input
                  id="max_horas"
                  type="number"
                  value={formData.max_horas_sem}
                  onChange={(e) => handleChange("max_horas_sem", e.target.value)}
                  min="1"
                  max="60"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/profesores">
                Cancelar
              </Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : (profesor ? "Actualizar Profesor" : "Guardar Profesor")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
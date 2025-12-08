"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProfesorForm } from "../components/profesor-form"
import { useParams } from "next/navigation"

export default function EditarProfesorPage() {
  const params = useParams()
  const id = params.id as string

  // Datos de ejemplo para edición SIN el campo "estado"
  const profesorEjemplo = {
    id_docente: parseInt(id),
    nombre: "Juan",
    apellidos: "Pérez García",
    id_departamento: "1",
    id_tipo: "2", 
    telefono: "123456789",
    especialidad: "Inteligencia Artificial",
    grado_academico: "Doctor",
    max_horas_sem: 40
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/profesores">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editar Profesor</h1>
          <p className="text-muted-foreground mt-2">
            Modifica la información del profesor
          </p>
          <p className="text-sm text-muted-foreground">
            ID: {id}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-2xl">
        <ProfesorForm profesor={profesorEjemplo} />
      </div>
    </div>
  )
} 

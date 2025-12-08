"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProfesorForm } from "../components/profesor-form"
import { useParams } from "next/navigation"
import { DocentesAPI } from "@/lib/api"

export default function EditarProfesorPage() {
  const params = useParams()
  const id = params.id as string

  const [profesor, setProfesor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    DocentesAPI.obtener(Number(id))
      .then((data) => setProfesor(data))
      .catch(() => alert("Error cargando profesor"))
      .finally(() => setLoading(false))
  }, [id])

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
        {loading && <p>Cargando datos...</p>}
        {profesor && <ProfesorForm profesor={profesor} />}
      </div>
    </div>
  )
}

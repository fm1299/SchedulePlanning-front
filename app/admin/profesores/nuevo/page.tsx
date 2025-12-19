"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProfesorForm } from "../components/profesor-form"

export default function NuevoProfesorPage() {
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
          <h1 className="text-3xl font-bold text-foreground">Nuevo Profesor</h1>
          <p className="text-muted-foreground mt-2">
            Completa la información para registrar un nuevo profesor
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-2xl">
        <ProfesorForm />
      </div>
    </div>
  )
}
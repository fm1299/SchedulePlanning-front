"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ReservaAPI } from "@/lib/reservas-api"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react"

interface Reserva {
  id_reserva: number
  id_aula: number
  id_docente: number
  fecha: string
  hora_inicio: string
  hora_fin: string
  descripcion?: string
  estado: string
}

export default function ReservaDetallePage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchReserva = async () => {
      try {
        const data = await ReservaAPI.getById(id)
        setReserva(data)
      } catch (err: any) {
        setError(err.message ?? "No se pudo cargar la reserva")
      } finally {
        setLoading(false)
      }
    }

    fetchReserva()
  }, [id])

  const renderEstado = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Pendiente
          </Badge>
        )
      case "aprobada":
      case "confirmada":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Aprobada
          </Badge>
        )
      case "rechazada":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rechazada
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => router.push("/professor/reserva")}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Mis Reservas
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Detalle de Reserva
          </CardTitle>
          <CardDescription>
            Información de la solicitud de reserva
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && (
            <div className="text-center py-6 text-muted-foreground">
              Cargando información de la reserva...
            </div>
          )}

          {error && (
            <div className="text-center py-6 text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && reserva && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Estado</span>
                {renderEstado(reserva.estado)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Aula</p>
                  <p className="font-medium">{reserva.id_aula}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium">{reserva.fecha}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Hora inicio</p>
                  <p className="font-medium">{reserva.hora_inicio}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Hora fin</p>
                  <p className="font-medium">{reserva.hora_fin}</p>
                </div>
              </div>

              {reserva.descripcion && (
                <div>
                  <p className="text-sm text-muted-foreground">Descripción</p>
                  <p className="font-medium">{reserva.descripcion}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

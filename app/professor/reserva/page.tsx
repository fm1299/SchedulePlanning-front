"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ReservaAPI } from "@/lib/reservas-api"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
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

export default function ReservaPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchReservas = async () => {
      try {
        const data = await ReservaAPI.getByDocente(Number(user.id))
        setReservas(data)
      } catch (err: any) {
        setError(err.message ?? "Error al cargar reservas")
      } finally {
        setLoading(false)
      }
    }

    fetchReservas()
  }, [user])

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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Mis Reservas
        </h1>
        <p className="text-muted-foreground">
          Consulta el estado de tus solicitudes de reserva de aulas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Solicitudes de Reserva
          </CardTitle>
          <CardDescription>
            Reservas asociadas a tu cuenta de profesor
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="text-center py-8 text-muted-foreground">
              Cargando reservas...
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && reservas.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                No tienes reservas registradas
              </p>
            </div>
          )}

          {!loading && !error && reservas.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aula</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {reservas.map((reserva) => (
                  <TableRow
                    key={reserva.id_reserva}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() =>
                      router.push(
                        `/professor/reserva/${reserva.id_reserva}`
                      )
                    }
                  >
                    <TableCell>{reserva.id_aula}</TableCell>
                    <TableCell>{reserva.fecha}</TableCell>
                    <TableCell>
                      {reserva.hora_inicio} – {reserva.hora_fin}
                    </TableCell>
                    <TableCell>
                      {renderEstado(reserva.estado)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

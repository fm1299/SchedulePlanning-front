"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockAulas, mockReservations, weekDays, timeSlots, type Reservation } from "@/lib/mock-data"
import { Calendar, Clock, Plus, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function ReservaPage() {
  const [reservations, setReservations] = useState<Reservation[]>(
    mockReservations.filter((r) => r.professorId === "2"), // Current professor's reservations
  )
  const [selectedAula, setSelectedAula] = useState("")
  const [selectedDay, setSelectedDay] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const availableAulas = mockAulas.filter((aula) => aula.status === "available")

  const handleCreateReservation = () => {
    const newReservation: Reservation = {
      id: Date.now().toString(),
      aulaId: selectedAula,
      aulaName: availableAulas.find((a) => a.id === selectedAula)?.name || "",
      courseId: "1",
      courseName: "Cálculo I",
      professorId: "2",
      professorName: "Dr. Juan Pérez",
      day: selectedDay,
      startTime: selectedTime,
      endTime: timeSlots[timeSlots.indexOf(selectedTime) + 1] || "20:00",
      status: "pending",
      requestDate: new Date().toISOString().split("T")[0],
    }

    setReservations((prev) => [...prev, newReservation])
    setSelectedAula("")
    setSelectedDay("")
    setSelectedTime("")
    setIsDialogOpen(false)
  }

  const getSlotStatus = (aulaId: string, day: string, time: string) => {
    const reservation = mockReservations.find(
      (r) => r.aulaId === aulaId && r.day === day && r.startTime === time && r.status === "approved",
    )
    return reservation ? { occupied: true, courseName: reservation.courseName } : { occupied: false }
  }

  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Pendiente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Aprobada
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rechazada
          </Badge>
        )
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Reservas</h1>
          <p className="text-muted-foreground">Solicita y gestiona reservas de aulas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reserva
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Reserva de Aula</DialogTitle>
              <DialogDescription>Selecciona el aula, día y hora para tu clase</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aula">Aula</Label>
                <Select value={selectedAula} onValueChange={setSelectedAula}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar aula" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAulas.map((aula) => (
                      <SelectItem key={aula.id} value={aula.id}>
                        {aula.name} - Capacidad: {aula.capacity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Día</Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar día" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDays.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Hora</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.slice(0, -1).map((time) => (
                        <SelectItem key={time} value={time}>
                          {time} - {timeSlots[timeSlots.indexOf(time) + 1]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateReservation} disabled={!selectedAula || !selectedDay || !selectedTime}>
                  Solicitar Reserva
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Disponibilidad de Aulas
          </CardTitle>
          <CardDescription>Haz clic en un espacio libre para solicitar reserva</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 gap-1 mb-2">
                <div className="p-2 font-medium text-center">Aula</div>
                {weekDays.map((day) => (
                  <div key={day} className="p-2 font-medium text-center">
                    {day}
                  </div>
                ))}
              </div>
              {availableAulas.slice(0, 4).map((aula) => (
                <div key={aula.id} className="grid grid-cols-6 gap-1 mb-1">
                  <div className="p-2 font-medium bg-muted rounded text-center">{aula.name}</div>
                  {weekDays.map((day) => {
                    const slot = getSlotStatus(aula.id, day, "10:00")
                    return (
                      <Dialog key={day}>
                        <DialogTrigger asChild>
                          <div
                            className={`p-2 rounded text-center text-xs cursor-pointer ${
                              slot.occupied
                                ? "bg-destructive text-destructive-foreground"
                                : "bg-primary text-primary-foreground hover:opacity-80"
                            }`}
                          >
                            {slot.occupied ? slot.courseName : "Libre"}
                          </div>
                        </DialogTrigger>
                        {!slot.occupied && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Solicitar Reserva</DialogTitle>
                              <DialogDescription>
                                {aula.name} - {day} 10:00-12:00
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>¿Deseas solicitar esta reserva?</p>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancelar</Button>
                                <Button
                                  onClick={() => {
                                    setSelectedAula(aula.id)
                                    setSelectedDay(day)
                                    setSelectedTime("10:00")
                                    handleCreateReservation()
                                  }}
                                >
                                  Confirmar Reserva
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Reservations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Mis Solicitudes de Reserva
          </CardTitle>
          <CardDescription>Estado de tus solicitudes de reserva</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead>Aula</TableHead>
                <TableHead>Día y Hora</TableHead>
                <TableHead>Fecha Solicitud</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.courseName}</TableCell>
                  <TableCell>{reservation.aulaName}</TableCell>
                  <TableCell>
                    {reservation.day} {reservation.startTime} - {reservation.endTime}
                  </TableCell>
                  <TableCell>{reservation.requestDate}</TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {reservations.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No tienes reservas solicitadas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

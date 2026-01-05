"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/ui/delete-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ReservaAPI } from "@/lib/reservas-api";

/* -------------------------
   Tipos REALES DEL BACKEND
--------------------------*/
type ReservaBD = {
  id_reserva: number;
  id_aula: number;
  id_docente: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  descripcion: string | null;
};

/* -------------------------
        Tipo UI
--------------------------*/
type ReservaUI = {
  id: string;
  profesor: string;
  aula: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  descripcion: string;
  estado: "approved" | "pending" | "rejected";
};

/* -------------------------
      CONFIG CALENDARIO
--------------------------*/
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const START_HOUR = 7;
const END_HOUR = 22;
const PX_PER_MIN = 1.2;

/* Semana Lunes → Sábado (sin shift de timezone) */
function getWeekDays(baseDate?: string, offset: number = 0) {
  const base = baseDate
    ? new Date(baseDate + "T00:00:00")
    : new Date(new Date().toISOString().split("T")[0] + "T00:00:00");

  base.setDate(base.getDate() + offset * 7);

  let day = base.getDay();
  if (day === 0) day = 7;

  const monday = new Date(base);
  monday.setDate(base.getDate() - (day - 1));

  const days = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }

  return days;
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/* -------------------------
          PAGE
--------------------------*/
export default function ReservasPage() {
  const router = useRouter();

  const [reservas, setReservas] = useState<ReservaUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroAula, setFiltroAula] = useState("");

  const [semanaOffset, setSemanaOffset] = useState(0);

  /* Modal delete */
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  const askDelete = (id: string) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await ReservaAPI.delete(Number(deleteId));
      setReservas((prev) => prev.filter((r) => r.id !== deleteId));
    } catch (err: any) {
      alert("Error al eliminar: " + err.message);
    } finally {
      setOpenDelete(false);
      setDeleteId(null);
    }
  };

  /* -------------------------
        Cargar reservas
  --------------------------*/
  useEffect(() => {
    ReservaAPI.getAll()
      .then((data: ReservaBD[]) => {
        const mapped: ReservaUI[] = data.map((r) => ({
          id: String(r.id_reserva),
          profesor: `Docente ${r.id_docente}`,
          aula: `Aula ${r.id_aula}`,
          fecha: r.fecha,
          hora_inicio: r.hora_inicio,
          hora_fin: r.hora_fin,
          descripcion: r.descripcion || "Sin descripción",
          estado: "approved" as const,
        }));

        setReservas(mapped);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Cargando reservas...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  /* -------------------------
          BADGE ESTADO
  --------------------------*/
  const getStatusBadge = (status: ReservaUI["estado"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Pendiente
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-[#7A1F1F] text-white flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Aprobada
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Rechazada
          </Badge>
        );
    }
  };

  /* -------------------------
           FILTROS
  --------------------------*/
  const reservasFiltradas = reservas.filter((r) => {
    const coincideFecha = filtroFecha ? r.fecha === filtroFecha : true;
    const coincideAula = filtroAula ? r.aula === `Aula ${filtroAula}` : true;
    return coincideFecha && coincideAula;
  });

  /* -------------------------
          CALENDARIO
  --------------------------*/
  const weekDays = getWeekDays(filtroFecha, semanaOffset);

  const reservasPorDia = weekDays.map((dia) =>
    reservas.filter(
      (r) => r.fecha === dia && (!filtroAula || r.aula === `Aula ${filtroAula}`)
    )
  );

  const totalHeight = (END_HOUR - START_HOUR) * 60 * PX_PER_MIN;

  /* -------------------------
             UI
  --------------------------*/
  return (
    <div className="max-w-8xl mx-auto px-10 py-10 space-y-10">


      {/* TITULO */}
      <div className="space-y-1">
        <h1 className="text-4xl font-bold text-[#7A1F1F]">Gestión de Reservas</h1>
        <p className="text-gray-600">Administrar reservas de aulas y horarios</p>
      </div>

      {/* FILTROS */}
      <div className="flex gap-6 items-end">
        <div>
          <p className="text-sm font-medium mb-1">Filtrar por fecha</p>
          <input
            type="date"
            className="border border-gray-300 p-2 rounded-md shadow-sm"
            value={filtroFecha}
            onChange={(e) => {
              setFiltroFecha(e.target.value);
              setSemanaOffset(0);
            }}
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Filtrar por aula (ID)</p>
          <input
            type="number"
            className="border border-gray-300 p-2 rounded-md shadow-sm"
            placeholder="Ej: 1"
            value={filtroAula}
            onChange={(e) => setFiltroAula(e.target.value)}
          />
        </div>

        <div className="ml-auto">
          <Button
            className="bg-[#7A1F1F] hover:bg-[#5E1717] text-white shadow-md px-5"
            onClick={() => router.push("/admin/reservas/nueva")}
          >
            Nueva Reserva
          </Button>
        </div>
      </div>

      {/* TABLA */}
      <Card className="border border-[#e5e5e5] bg-[#FAFAFA] shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-[#7A1F1F]" />
            Reservas Registradas
          </CardTitle>
          <CardDescription>Datos reales desde FastAPI</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f3f3f3] border-b border-gray-300">
                <TableHead className="uppercase text-xs tracking-wide text-gray-600">Profesor</TableHead>
                <TableHead className="uppercase text-xs tracking-wide text-gray-600">Aula</TableHead>
                <TableHead className="uppercase text-xs tracking-wide text-gray-600">Fecha</TableHead>
                <TableHead className="uppercase text-xs tracking-wide text-gray-600">Horario</TableHead>
                <TableHead className="uppercase text-xs tracking-wide text-gray-600">Descripción</TableHead>
                <TableHead className="uppercase text-xs tracking-wide text-gray-600">Estado</TableHead>
                <TableHead className="uppercase text-xs tracking-wide text-gray-600">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {reservasFiltradas.map((r) => (
                <TableRow
                  key={r.id}
                  className="hover:bg-[#f7f7f7] transition-colors border-b border-gray-200"
                >
                  <TableCell className="py-4">{r.profesor}</TableCell>
                  <TableCell className="py-4">{r.aula}</TableCell>
                  <TableCell className="py-4">{r.fecha}</TableCell>
                  <TableCell className="py-4">
                    {r.hora_inicio} - {r.hora_fin}
                  </TableCell>
                  <TableCell className="py-4">{r.descripcion}</TableCell>
                  <TableCell className="py-4">{getStatusBadge(r.estado)}</TableCell>

                  <TableCell className="py-4 space-x-2">
                    <Button
                      size="sm"
                      className="bg-[#7A1F1F] hover:bg-[#5E1717] text-white shadow-sm"
                      onClick={() => router.push(`/admin/reservas/${r.id}/editar`)}
                    >
                      Editar
                    </Button>

                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
                      onClick={() => askDelete(r.id)}
                    >
                      Cancelar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ----------------------------------- */}
      {/*      CALENDARIO SEMANAL UNSA         */}
      {/* ----------------------------------- */}
      <Card className="border border-[#e5e5e5] bg-[#FAFAFA] shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Calendario Semanal por Aula</CardTitle>
          <CardDescription>
            Semana: {weekDays[0]} → {weekDays[5]}
          </CardDescription>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              className="border-gray-400"
              onClick={() => setSemanaOffset((n) => n - 1)}
            >
              ← Semana anterior
            </Button>

            <Button
              variant="outline"
              className="border-gray-400"
              onClick={() => setSemanaOffset(0)}
            >
              Semana actual
            </Button>

            <Button
              variant="outline"
              className="border-gray-400"
              onClick={() => setSemanaOffset((n) => n + 1)}
            >
              Semana siguiente →
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {!filtroAula ? (
            <p className="text-sm text-gray-500">
              Selecciona un aula para mostrar el calendario semanal.
            </p>
          ) : (
            <div className="grid grid-cols-7 gap-3 bg-[#f5f5f5] p-4 rounded-xl border border-[#ddd]">

              {/* Horas */}
              <div className="bg-white rounded-lg border border-[#ddd] shadow-sm">
                <div className="h-10"></div>
                {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => {
                  const hour = START_HOUR + i;
                  return (
                    <div
                      key={hour}
                      className="h-[72px] text-xs border-b border-[#eee] p-1 text-gray-700"
                    >
                      {hour}:00
                    </div>
                  );
                })}
              </div>

              {/* Días */}
              {weekDays.map((dia, idx) => (
                <div
                  key={dia}
                  className="bg-white rounded-lg border border-[#ddd] shadow-sm overflow-hidden"
                >
                  <div className="text-center font-medium h-10 border-b bg-[#f1f1f1]">
                    {DAYS[idx]}
                  </div>

                  <div className="relative" style={{ height: totalHeight }}>
                    {reservasPorDia[idx].map((reserva) => {
                      const inicioMin =
                        timeToMinutes(reserva.hora_inicio) - START_HOUR * 60;
                      const finMin =
                        timeToMinutes(reserva.hora_fin) - START_HOUR * 60;

                      const top = inicioMin * PX_PER_MIN;
                      const height = (finMin - inicioMin) * PX_PER_MIN;

                      return (
                        <div
                          key={reserva.id}
                          className="absolute left-1 right-1 bg-[#7A1F1F] text-white text-xs p-2 rounded-lg shadow-md border-l-4 border-[#5E1717]"
                          style={{ top, height }}
                        >
                          <b>
                            {reserva.hora_inicio.slice(0, 5)} -{" "}
                            {reserva.hora_fin.slice(0, 5)}
                          </b>
                          <div className="text-[11px] opacity-80">
                            {reserva.descripcion}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL ELIMINAR */}
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        title="Eliminar Reserva"
        description="¿Seguro que deseas eliminar esta reserva? Esta acción no se puede deshacer."
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReservaAPI } from "@/lib/reservas-api";

export default function NuevaReservaPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    id_aula: "",
    id_docente: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    descripcion: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await ReservaAPI.create({
        id_aula: Number(form.id_aula),
        id_docente: Number(form.id_docente),
        fecha: form.fecha,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        descripcion: form.descripcion,
      });

      router.push("/admin/reservas");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Crear Nueva Reserva</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-red-600">{error}</p>}

            <div>
              <Label>Aula (ID)</Label>
              <Input name="id_aula" value={form.id_aula} onChange={handleChange} required />
            </div>

            <div>
              <Label>Docente (ID usuario)</Label>
              <Input name="id_docente" value={form.id_docente} onChange={handleChange} required />
            </div>

            <div>
              <Label>Fecha</Label>
              <Input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
            </div>

            <div>
              <Label>Hora inicio</Label>
              <Input type="time" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} required />
            </div>

            <div>
              <Label>Hora fin</Label>
              <Input type="time" name="hora_fin" value={form.hora_fin} onChange={handleChange} required />
            </div>

            <div>
              <Label>Descripción</Label>
              <Input name="descripcion" value={form.descripcion} onChange={handleChange} />
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Reserva"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

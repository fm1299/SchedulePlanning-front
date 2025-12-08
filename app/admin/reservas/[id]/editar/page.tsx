"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReservaAPI } from "@/lib/reservas-api";

export default function EditarReservaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    id_aula: "",
    id_docente: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // -------------------------------
  // GET /reservas/{id} → cargar datos existentes
  // -------------------------------
  useEffect(() => {
    ReservaAPI.getById(Number(id))
      .then((data) => {
        setForm({
          id_aula: String(data.id_aula),
          id_docente: String(data.id_docente),
          fecha: data.fecha,
          hora_inicio: data.hora_inicio,
          hora_fin: data.hora_fin,
          descripcion: data.descripcion || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -------------------------------
  // PUT /reservas/{id} → guardar cambios
  // -------------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await ReservaAPI.update(Number(id), {
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
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Cargando datos...</div>;

  return (
    <div className="p-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Editar Reserva #{id}</CardTitle>
        </CardHeader>

        <CardContent>
          {error && <p className="text-red-600">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Aula (ID)</Label>
              <Input
                name="id_aula"
                value={form.id_aula}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Docente (ID usuario)</Label>
              <Input
                name="id_docente"
                value={form.id_docente}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Fecha</Label>
              <Input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Hora inicio</Label>
              <Input
                type="time"
                name="hora_inicio"
                value={form.hora_inicio}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Hora fin</Label>
              <Input
                type="time"
                name="hora_fin"
                value={form.hora_fin}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Descripción</Label>
              <Input
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Guardando cambios..." : "Guardar cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

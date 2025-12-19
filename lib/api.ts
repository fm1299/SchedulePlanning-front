export const API_URL = "http://localhost:8000/api/v1"

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || "Error en el servidor")
  }

  return res.json()
}

export const DocentesAPI = {
  listar: () => apiFetch("/docentes/"),

  obtener: (id: number) => apiFetch(`/docentes/${id}`),

  crear: (data: any) =>
    apiFetch("/docentes/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  actualizar: (id: number, data: any) =>
    apiFetch(`/docentes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  eliminar: (id: number) =>
    apiFetch(`/docentes/${id}`, {
      method: "DELETE",
    }),
}
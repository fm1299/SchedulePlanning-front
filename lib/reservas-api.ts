const API_URL = "http://localhost:8000/api/v1";

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let message = "Error inesperado del servidor";
    try {
      const data = await res.json();
      message = data.detail || message;
    } catch (_) {}

    throw new Error(message);
  }

  return res.json();
}

export const ReservaAPI = {
  getAll: () => apiRequest("/reservas/"),


  getById: (id: number) => apiRequest(`/reservas/${id}`),

  create: (body: any) =>
    apiRequest("/reservas/", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: number, body: any) =>
    apiRequest(`/reservas/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (id: number) =>
    apiRequest(`/reservas/${id}`, {
      method: "DELETE",
    }),
};

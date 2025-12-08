const API_URL = "http://localhost:8000/api/v1";

export interface Aula {
  id: string;
  numero: string;
  nombre: string;
  tipo: 'Aula' | 'Laboratorio' | 'Oficina';
  capacidad: number;
  descripcion?: string;
  status: 'available' | 'occupied' | 'maintenance';
  ubicacion?: string;
}

export async function fetchAulas(): Promise<Aula[]> {
  const response = await fetch(`${API_URL}/aulas`);
  if (!response.ok) {
    throw new Error('Error al cargar las aulas');
  }
  return response.json();
}

export async function updateAulaStatus(id: string, status: Aula['status']): Promise<Aula> {
  const response = await fetch(`${API_URL}/aulas/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  return response.json();
}
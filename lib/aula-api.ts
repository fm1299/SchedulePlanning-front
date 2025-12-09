const API_URL = "http://localhost:8000/api/v1";

export interface Aula {
  id: string; 
  numero: string;
  nombre: string;
  tipo: string; 
  capacidad: number;
  descripcion?: string;
  ubicacion?: string;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface CreateAulaData {
  numero: string;
  nombre: string;
  tipo: string; 
  capacidad: number;
  descripcion?: string;
  ubicacion?: string;
}

// Obtener todas las aulas
export async function fetchAulas(): Promise<Aula[]> {
  const response = await fetch(`${API_URL}/aulas/frontend/all`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al cargar las aulas: ${errorText}`);
  }
  return response.json();
}

export async function createAula(aulaData: CreateAulaData): Promise<Aula> {
  const response = await fetch(`${API_URL}/aulas/frontend/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(aulaData),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear el aula: ${errorText}`);
  }
  
  return response.json();
}

export async function updateAulaStatus(aulaId: string, status: Aula['status']): Promise<Aula> {
  const response = await fetch(`${API_URL}/aulas/frontend/${aulaId}/status?status=${status}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar estado: ${errorText}`);
  }
  
  return response.json();
}

export async function searchAulas(query: string): Promise<Aula[]> {
  const response = await fetch(`${API_URL}/aulas/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre: query,
      codigo: query,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al buscar aulas: ${errorText}`);
  }
  
  const aulas = await response.json();
  
  return aulas.map((aula: any) => ({
    id: aula.id_aula.toString(),
    numero: aula.codigo,
    nombre: aula.nombre,
    tipo: aula.tipo_nombre || 'Aula',
    capacidad: aula.capacidad,
    descripcion: aula.descripcion,
    ubicacion: aula.ubicacion,
    status: mapEstadoToStatus(aula.estado),
  }));
}

function mapEstadoToStatus(estado: string): Aula['status'] {
  const estadoMap: Record<string, Aula['status']> = {
    'disponible': 'available',
    'ocupada': 'occupied',
    'mantenimiento': 'maintenance',
  };
  return estadoMap[estado] || 'available';
}
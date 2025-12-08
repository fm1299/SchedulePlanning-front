// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { AulaCard } from '@/components/aula-card';
import { SearchBar } from '@/components/aula-search-bar';
import { fetchAulas } from '@/lib/aula-api';
import type { Aula } from '@/lib/aula-api';

export default function GestionAulasPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [filteredAulas, setFilteredAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAulas();
  }, []);

  async function loadAulas() {
    try {
      const data = await fetchAulas();
      setAulas(data);
      setFilteredAulas(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredAulas(aulas);
      return;
    }
    
    const filtered = aulas.filter(aula =>
      aula.nombre.toLowerCase().includes(query.toLowerCase()) ||
      aula.numero.toLowerCase().includes(query.toLowerCase()) ||
      aula.tipo.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAulas(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestión de Aulas</h1>
              <p className="text-gray-600">Administrar aulas, laboratorios y oficinas</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Administrador UNSA</span>
              <button className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Aulas Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando aulas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAulas.map((aula) => (
              <AulaCard key={aula.id} aula={aula} onStatusChange={loadAulas} />
            ))}
          </div>
        )}

        {!loading && filteredAulas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron aulas</p>
          </div>
        )}
      </main>
    </div>
  );
}
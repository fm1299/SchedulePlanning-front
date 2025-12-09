'use client';

import { useState, useEffect } from 'react';
import { AulaCard } from '@/components/aula-card';
import { SearchBar } from '@/components/aula-search-bar';
import { CreateAulaModal } from '@/components/create-aula-modal';
import { fetchAulas,searchAulas } from '@/lib/aula-api';
import type { Aula } from '@/lib/aula-api';
import { Plus, Filter } from 'lucide-react';

export default function GestionAulasPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [filteredAulas, setFilteredAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAulas();
  }, []);

  async function loadAulas() {
    try {
      setLoading(true);
      const data = await fetchAulas();
      setAulas(data);
      setFilteredAulas(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar las aulas');
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredAulas(aulas);
      return;
    }
    
    try {
      const searchResults = await searchAulas(query);
      setFilteredAulas(searchResults);
    } catch (error) {
      console.error('Error en búsqueda:', error);

      const filtered = aulas.filter(aula =>
        aula.nombre.toLowerCase().includes(query.toLowerCase()) ||
        aula.numero.toLowerCase().includes(query.toLowerCase()) ||
        aula.tipo.toLowerCase().includes(query.toLowerCase()) ||
        aula.ubicacion?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAulas(filtered);
    }
  };


  const stats = {
    total: filteredAulas.length,
    disponibles: filteredAulas.filter(a => a.status === 'available').length,
    ocupadas: filteredAulas.filter(a => a.status === 'occupied').length,
    mantenimiento: filteredAulas.filter(a => a.status === 'maintenance').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestión de Aulas</h1>
              <p className="text-gray-600">Administrar aulas, laboratorios y oficinas</p>
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
            >
              <Plus className="w-5 h-5" />
              Agregar Aula
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Barra de búsqueda */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Estadísticas */}
        {!loading && filteredAulas.length > 0 && (
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600">Disponibles</div>
              <div className="text-2xl font-bold text-green-700">{stats.disponibles}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="text-sm text-yellow-600">Ocupadas</div>
              <div className="text-2xl font-bold text-yellow-700">{stats.ocupadas}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-sm text-red-600">Mantenimiento</div>
              <div className="text-2xl font-bold text-red-700">{stats.mantenimiento}</div>
            </div>
          </div>
        )}

        {/* Aulas Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Cargando aulas...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {filteredAulas.length} {filteredAulas.length === 1 ? 'aula' : 'aulas'} encontradas
                {searchQuery && ` para "${searchQuery}"`}
              </h2>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilteredAulas(aulas);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
            
            {filteredAulas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAulas.map((aula) => (
                  <AulaCard key={aula.id} aula={aula} onStatusChange={loadAulas} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border">
                <div className="text-gray-400 mb-4">
                  <Filter className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No se encontraron aulas
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? `No hay resultados para "${searchQuery}"`
                    : 'No hay aulas registradas en el sistema'
                  }
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Agregar primera aula
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal para crear aula */}
      <CreateAulaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAulaCreated={loadAulas}
      />
    </div>
  );
}
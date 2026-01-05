// components/create-aula-modal.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createAula } from '@/lib/aula-api';

interface CreateAulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAulaCreated: () => void;
}

export function CreateAulaModal({ isOpen, onClose, onAulaCreated }: CreateAulaModalProps) {
  const [formData, setFormData] = useState({
    numero: '',
    nombre: '',
    tipo: 'Aula' as 'Aula' | 'Laboratorio' | 'Oficina',
    capacidad: 30,
    descripcion: '',
    ubicacion: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.numero.trim()) {
      setError('El número de aula es obligatorio');
      setLoading(false);
      return;
    }

    if (!formData.nombre.trim()) {
      setError('El nombre del aula es obligatorio');
      setLoading(false);
      return;
    }

    if (formData.capacidad < 1) {
      setError('La capacidad debe ser mayor a 0');
      setLoading(false);
      return;
    }

    try {
      await createAula({
        numero: formData.numero,
        nombre: formData.nombre,
        tipo: formData.tipo,
        capacidad: formData.capacidad,
        descripcion: formData.descripcion || undefined,
        ubicacion: formData.ubicacion || undefined,
      });
      onAulaCreated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el aula');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      numero: '',
      nombre: '',
      tipo: 'Aula',
      capacidad: 30,
      descripcion: '',
      ubicacion: '',
    });
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Agregar Nueva Aula</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Aula *
            </label>
            <input
              type="text"
              value={formData.numero}
              onChange={(e) => setFormData({...formData, numero: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 101, A-201, LAB-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Aula Magna, Lab de Computación, Oficina de Decanato"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Aula">Aula</option>
              <option value="Laboratorio">Laboratorio</option>
              <option value="Oficina">Oficina</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad (personas) *
            </label>
            <input
              type="number"
              value={formData.capacidad}
              onChange={(e) => setFormData({...formData, capacidad: parseInt(e.target.value) || 0})}
              min="1"
              max="500"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              value={formData.ubicacion}
              onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Pabellón A, Segundo piso, Edificio Central"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del aula, equipamiento disponible, características especiales..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </>
              ) : (
                'Crear Aula'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
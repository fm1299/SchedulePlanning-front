'use client';

import { AulaStatusBadge } from '@/components/aula-status-badge';
import { updateAulaStatus } from '@/lib/aula-api';
import type { Aula } from '@/lib/aula-api';
import { Building, Users, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface AulaCardProps {
  aula: Aula;
  onStatusChange: () => void;
}

export function AulaCard({ aula, onStatusChange }: AulaCardProps) {
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Laboratorio':
        return <Building className="w-4 h-4" />;
      case 'Oficina':
        return <Building className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  const handleStatusChange = async (newStatus: Aula['status']) => {
    try {
      await updateAulaStatus(aula.id, newStatus);
      onStatusChange();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado del aula');
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Laboratorio':
        return 'bg-purple-50 text-purple-600';
      case 'Oficina':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getTipoIcon(aula.tipo)}
            <h3 className="font-semibold text-lg text-gray-800">{aula.nombre}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className={`px-2 py-1 rounded-md ${getTipoColor(aula.tipo)}`}>
              {aula.numero}
            </span>
            <span>{aula.tipo}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <AulaStatusBadge status={aula.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange('available')}>
                Marcar como Disponible
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('occupied')}>
                Marcar como Ocupada
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('maintenance')}>
                Marcar en Mantenimiento
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{aula.capacidad} personas</span>
        </div>
        
        {aula.ubicacion && (
          <div className="text-sm text-gray-600">
            📍 {aula.ubicacion}
          </div>
        )}
        
        <p className="text-gray-600 text-sm">
          {aula.descripcion || 'Sin descripción'}
        </p>
      </div>
    </div>
  );
}
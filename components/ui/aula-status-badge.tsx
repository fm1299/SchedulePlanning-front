import { Badge } from "@/components/ui/badge"

interface AulaStatusBadgeProps {
  status: 'available' | 'occupied' | 'maintenance'
}

export function AulaStatusBadge({ status }: AulaStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "available":
        return {
          variant: "default" as const,
          label: "Disponible",
          className: "bg-green-100 text-green-800 hover:bg-green-100"
        }
      case "occupied":
        return {
          variant: "secondary" as const,
          label: "Ocupada",
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        }
      case "maintenance":
        return {
          variant: "destructive" as const,
          label: "Mantenimiento",
          className: "bg-red-100 text-red-800 hover:bg-red-100"
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge 
      variant={config.variant} 
      className={config.className}
    >
      {config.label}
    </Badge>
  )
}
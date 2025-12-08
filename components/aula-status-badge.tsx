import { Badge } from "@/components/ui/badge"
import type { Aula } from "@/lib/mock-data"

interface AulaStatusBadgeProps {
  status: Aula["status"]
}

export function AulaStatusBadge({ status }: AulaStatusBadgeProps) {
  const getStatusConfig = (status: Aula["status"]) => {
    switch (status) {
      case "available":
        return {
          variant: "default" as const,
          label: "Disponible",
        }
      case "occupied":
        return {
          variant: "secondary" as const,
          label: "Ocupada",
        }
      case "maintenance":
        return {
          variant: "destructive" as const,
          label: "Mantenimiento",
        }
    }
  }

  const config = getStatusConfig(status)

  return <Badge variant={config.variant}>{config.label}</Badge>
}

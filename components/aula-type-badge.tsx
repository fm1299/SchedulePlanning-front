import { Badge } from "@/components/ui/badge"
import type { Aula } from "@/lib/mock-data"

interface AulaTypeBadgeProps {
  type: Aula["type"]
}

export function AulaTypeBadge({ type }: AulaTypeBadgeProps) {
  const getTypeLabel = (type: Aula["type"]) => {
    switch (type) {
      case "aula":
        return "Aula"
      case "laboratorio":
        return "Laboratorio"
      case "oficina":
        return "Oficina"
    }
  }

  return <Badge variant="outline">{getTypeLabel(type)}</Badge>
}

import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { Reservation } from "@/lib/mock-data"

interface ReservationStatusBadgeProps {
  status: Reservation["status"]
  showIcon?: boolean
}

export function ReservationStatusBadge({ status, showIcon = true }: ReservationStatusBadgeProps) {
  const getStatusConfig = (status: Reservation["status"]) => {
    switch (status) {
      case "pending":
        return {
          variant: "secondary" as const,
          icon: AlertCircle,
          label: "Pendiente",
        }
      case "approved":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          label: "Aprobada",
        }
      case "rejected":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          label: "Rechazada",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={showIcon ? "flex items-center gap-1" : ""}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  )
}

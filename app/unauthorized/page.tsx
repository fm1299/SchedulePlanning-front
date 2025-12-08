import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-destructive p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">Acceso No Autorizado</CardTitle>
          <CardDescription>No tienes permisos para acceder a esta página</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Por favor, inicia sesión con las credenciales correctas para acceder al sistema.
          </p>
          <Link href="/">
            <Button className="w-full">Volver al Inicio</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

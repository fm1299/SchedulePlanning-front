import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { ProfessorSidebar } from "@/components/professor-sidebar"

export default function ProfessorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["professor"]}>
      <div className="flex h-screen">
        <ProfessorSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  )
}

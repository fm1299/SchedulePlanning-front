export type UserRole = "admin" | "professor"

export interface User {
  id: string
  username: string
  role: UserRole
  name: string
}

// Mock users for demonstration
export const mockUsers: User[] = [
  { id: "1", username: "admin", role: "admin", name: "Administrador UNSA" },
  { id: "2", username: "profesor1", role: "professor", name: "Dr. Juan Pérez" },
  { id: "3", username: "profesor2", role: "professor", name: "Dra. María García" },
]

export const authenticateUser = (username: string, password: string): User | null => {
  // Simple mock authentication - in real app would validate against backend
  const user = mockUsers.find((u) => u.username === username)
  if (user && password === "password") {
    return user
  }
  return null
}

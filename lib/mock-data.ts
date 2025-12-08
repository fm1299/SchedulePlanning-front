export interface Aula {
  id: string
  name: string
  type: "aula" | "laboratorio" | "oficina"
  capacity: number
  description: string
  status: "available" | "occupied" | "maintenance"
}

export interface Course {
  id: string
  name: string
  professor: string
  professorId: string
  capacity: number
  group: "A" | "B"
  syllabus: string[]
  progress: number
}

export interface Reservation {
  id: string
  aulaId: string
  aulaName: string
  courseId: string
  courseName: string
  professorId: string
  professorName: string
  day: string
  startTime: string
  endTime: string
  status: "pending" | "approved" | "rejected"
  requestDate: string
}

export interface Schedule {
  id: string
  aulaId: string
  aulaName: string
  courseId: string
  courseName: string
  professorId: string
  professorName: string
  day: string
  startTime: string
  endTime: string
  group: "A" | "B"
}

// Mock data
export const mockAulas: Aula[] = [
  {
    id: "1",
    name: "Aula 101",
    type: "aula",
    capacity: 40,
    description: "Aula magna con proyector",
    status: "available",
  },
  { id: "2", name: "Aula 102", type: "aula", capacity: 35, description: "Aula estándar", status: "occupied" },
  {
    id: "3",
    name: "Lab Computación",
    type: "laboratorio",
    capacity: 25,
    description: "Laboratorio de computación con 25 PCs",
    status: "available",
  },
  {
    id: "4",
    name: "Lab Física",
    type: "laboratorio",
    capacity: 20,
    description: "Laboratorio de física experimental",
    status: "maintenance",
  },
  {
    id: "5",
    name: "Oficina Decanato",
    type: "oficina",
    capacity: 10,
    description: "Oficina del decanato",
    status: "available",
  },
  {
    id: "6",
    name: "Aula 201",
    type: "aula",
    capacity: 50,
    description: "Aula grande con aire acondicionado",
    status: "available",
  },
]

export const mockCourses: Course[] = [
  {
    id: "1",
    name: "Cálculo I",
    professor: "Dr. Juan Pérez",
    professorId: "2",
    capacity: 35,
    group: "A",
    syllabus: ["Límites", "Derivadas", "Integrales", "Aplicaciones"],
    progress: 75,
  },
  {
    id: "2",
    name: "Programación I",
    professor: "Dra. María García",
    professorId: "3",
    capacity: 25,
    group: "B",
    syllabus: ["Fundamentos", "Estructuras de control", "Funciones", "Arreglos"],
    progress: 60,
  },
]

export const mockReservations: Reservation[] = [
  {
    id: "1",
    aulaId: "1",
    aulaName: "Aula 101",
    courseId: "1",
    courseName: "Cálculo I",
    professorId: "2",
    professorName: "Dr. Juan Pérez",
    day: "Lunes",
    startTime: "08:00",
    endTime: "10:00",
    status: "pending",
    requestDate: "2024-01-15",
  },
  {
    id: "2",
    aulaId: "3",
    aulaName: "Lab Computación",
    courseId: "2",
    courseName: "Programación I",
    professorId: "3",
    professorName: "Dra. María García",
    day: "Miércoles",
    startTime: "14:00",
    endTime: "16:00",
    status: "approved",
    requestDate: "2024-01-14",
  },
]

export const mockSchedules: Schedule[] = [
  {
    id: "1",
    aulaId: "2",
    aulaName: "Aula 102",
    courseId: "1",
    courseName: "Cálculo I",
    professorId: "2",
    professorName: "Dr. Juan Pérez",
    day: "Martes",
    startTime: "10:00",
    endTime: "12:00",
    group: "A",
  },
]

export const timeSlots = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
]

export const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]

export interface User {
  id: string
  username: string
  role: "admin" | "professor"
  name: string
}

// Mock users for demonstration
export const mockUsers: User[] = [
  { id: "1", username: "admin", role: "admin", name: "Administrador UNSA" },
  { id: "2", username: "profesor1", role: "professor", name: "Dr. Juan Pérez" },
  { id: "3", username: "profesor2", role: "professor", name: "Dra. María García" },
]

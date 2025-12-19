export interface User {
  id: string
  name: string
  role: 'admin' | 'teacher' | 'student'
  email?: string
  password?: string
  // Teacher specific fields
  matricule?: string
  phone?: string
  specialty?: string
  department?: string
  campusAffection?: string
  teacherStatus?: 'permanent' | 'vacataire'
  isModuleResponsible?: boolean
  availableDays?: string[]
  availableTimeSlots?: string[]
  unavailableTimeSlots?: string[]
  preferredTimeSlots?: string[]
  weeklyHours?: number
  maxWeeklyHours?: number
  nonWorkingDays?: string[]
  // Student specific fields
  studentIdNumber?: string
  studentFiliere?: string
  studentNiveau?: string
  studentGroup?: string
  studentCampus?: string
  academicStatus?: 'enrolled' | 'suspended'
  academicYear?: string
}

// Mis à jour pour correspondre au CourseResponseDTO du backend
export interface Course {
  id: string
  name: string
  code: string
  responsibleTeacherName?: string // Nom de l'enseignant, optionnel
  associatedTeacherNames?: string[] // Noms des enseignants associés
  filiere?: string
  niveau?: string
  campus?: string
  totalHours?: number
  cmHours?: number
  tdHours?: number
  tpHours?: number
  sessionDurationMinutes?: number
  frequency?: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'AD_HOC' // Correspond aux enums Java
  groupsAffected?: string
  groupCapacity?: number
  allowedTimeSlots?: string
  forbiddenTimeSlots?: string
  requiredCampus?: string
  priority?: 'HIGH' | 'NORMAL' | 'LOW' // Correspond aux enums Java
  status?: 'PLANNED' | 'PENDING' | 'CANCELLED' | 'MODIFIED' // Correspond aux enums Java
  semester?: string
  description?: string
}

export interface Room {
  id: string
  name: string
  capacity: number
  campus?: string
  type?: 'AMPHI' | 'TD' | 'TP' | 'MEETING' // Correspond aux enums Java
  building?: string
  floor?: string
  // Equipment
  hasProjector?: boolean
  hasComputers?: boolean
  hasInteractiveBoard?: boolean
  hasInternet?: boolean
  specificEquipment?: string[]
  // Availability & Constraints
  availableTimeSlots?: string[]
  reservedTimeSlots?: string[]
  unavailablePeriods?: { start: Date; end: Date; reason: string }[]
  status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'OUT_OF_SERVICE' // Correspond aux enums Java
}

export type SessionType = 'CM' | 'TD' | 'TP'

// Mis à jour pour correspondre au ScheduleEventResponseDTO du backend
export interface ScheduleEvent {
  id: string
  courseId: string
  courseName: string
  roomId: string
  roomName: string
  startTime: string // Utiliser string pour LocalDateTime
  endTime: string // Utiliser string pour LocalDateTime
  sessionType: SessionType
  studentIds?: string[] // IDs des étudiants associés
  studentNames?: string[] // Noms des étudiants associés
  responsibleTeacherName?: string // Nom de l'enseignant responsable du cours
  isCancelled?: boolean
  isModified?: boolean
  hasConflict?: boolean
  isRoomOverloaded?: boolean
  academicYear?: string
  semester?: string
}

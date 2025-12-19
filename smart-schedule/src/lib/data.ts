import { User, Course, Room, ScheduleEvent } from '@/types'

// 3 test accounts with email and password
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@test.com',
    password: 'password123',
  },
  {
    id: '2',
    name: 'Dr. Alan Turing',
    role: 'teacher',
    email: 'teacher@test.com',
    password: 'password123',
    matricule: 'TURING001',
    phone: '0612345678',
    specialty: 'Computer Science',
    department: 'Informatique',
    campusAffection: 'Central',
    teacherStatus: 'permanent',
    isModuleResponsible: true,
    availableDays: ['Monday', 'Wednesday', 'Thursday'],
    availableTimeSlots: ['Morning', 'Afternoon'],
    unavailableTimeSlots: ['TuesdayMorning'],
    preferredTimeSlots: ['MondayMorning'],
    weeklyHours: 18,
    maxWeeklyHours: 20,
    nonWorkingDays: ['Friday'],
  },
  {
    id: '3',
    name: 'Ada Lovelace',
    role: 'student',
    email: 'student@test.com',
    password: 'password123',
    studentIdNumber: 'STU001',
    studentFiliere: 'Informatique',
    studentNiveau: 'L1',
    studentGroup: 'G1',
    studentCampus: 'Central',
    academicStatus: 'enrolled',
    academicYear: '2024-2025',
  },
  {
    id: '4',
    name: 'Grace Hopper',
    role: 'student',
    email: 'grace@test.com',
    password: 'password123',
    studentIdNumber: 'STU002',
    studentFiliere: 'Informatique',
    studentNiveau: 'L1',
    studentGroup: 'G2',
    studentCampus: 'Central',
    academicStatus: 'enrolled',
    academicYear: '2024-2025',
  },
  {
    id: '5',
    name: 'Dr. Tim Berners-Lee',
    role: 'teacher',
    email: 'timbl@test.com',
    password: 'password123',
    matricule: 'TIMBL001',
    phone: '0698765432',
    specialty: 'Web Technologies',
    department: 'Informatique',
    campusAffection: 'Annexe',
    teacherStatus: 'permanent',
    isModuleResponsible: false,
    availableDays: ['Tuesday', 'Wednesday', 'Friday'],
    availableTimeSlots: ['Afternoon', 'Evening'],
    weeklyHours: 15,
    maxWeeklyHours: 18,
    nonWorkingDays: ['Monday'],
  },
  {
    id: '6',
    name: 'John von Neumann',
    role: 'student',
    email: 'john@test.com',
    password: 'password123',
    studentIdNumber: 'STU003',
    studentFiliere: 'Maths',
    studentNiveau: 'M1',
    studentGroup: 'M1A',
    studentCampus: 'Central',
    academicStatus: 'enrolled',
    academicYear: '2024-2025',
  },
  {
    id: '7',
    name: 'Dr. Donald Knuth',
    role: 'teacher',
    email: 'knuth@test.com',
    password: 'password123',
    matricule: 'KNUTH001',
    phone: '0611223344',
    specialty: 'Algorithms',
    department: 'Maths',
    campusAffection: 'Central',
    teacherStatus: 'vacataire',
    isModuleResponsible: true,
    availableDays: ['Wednesday', 'Thursday'],
    availableTimeSlots: ['Morning'],
    weeklyHours: 10,
    maxWeeklyHours: 12,
    nonWorkingDays: ['Monday', 'Tuesday', 'Friday'],
  },
  {
    id: '8',
    name: 'Charles Babbage',
    role: 'student',
    email: 'charles@test.com',
    password: 'password123',
    studentIdNumber: 'STU004',
    studentFiliere: 'Informatique',
    studentNiveau: 'L2',
    studentGroup: 'G3',
    studentCampus: 'Annexe',
    academicStatus: 'enrolled',
    academicYear: '2024-2025',
  },
]

export const courses: Course[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    responsibleTeacherId: '2',
    associatedTeacherIds: ['5'],
    filiere: 'Informatique',
    niveau: 'L1',
    campus: 'Central',
    totalHours: 45,
    cmHours: 15,
    tdHours: 20,
    tpHours: 10,
    sessionDurationMinutes: 90,
    frequency: 'weekly',
    groupsAffected: ['G1', 'G2'],
    groupCapacity: 30,
    allowedTimeSlots: ['MonMorning', 'WedAfternoon'],
    forbiddenTimeSlots: ['TueEvening'],
    requiredCampus: 'Central',
    priority: 'high',
    status: 'planned',
    semester: 'S1',
    description: 'Fundamental concepts of computer science and programming.',
  },
  {
    id: '2',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    responsibleTeacherId: '2',
    associatedTeacherIds: [],
    filiere: 'Informatique',
    niveau: 'L2',
    campus: 'Central',
    totalHours: 60,
    cmHours: 20,
    tdHours: 20,
    tpHours: 20,
    sessionDurationMinutes: 120,
    frequency: 'weekly',
    groupsAffected: ['G3'],
    groupCapacity: 25,
    allowedTimeSlots: ['TueMorning', 'ThuAfternoon'],
    forbiddenTimeSlots: [],
    requiredCampus: 'Central',
    priority: 'high',
    status: 'planned',
    semester: 'S3',
    description: 'Study of common data structures and algorithmic techniques.',
  },
  {
    id: '3',
    name: 'Web Development Fundamentals',
    code: 'WEB301',
    responsibleTeacherId: '5',
    associatedTeacherIds: [],
    filiere: 'Informatique',
    niveau: 'L3',
    campus: 'Annexe',
    totalHours: 50,
    cmHours: 10,
    tdHours: 20,
    tpHours: 20,
    sessionDurationMinutes: 90,
    frequency: 'bi-weekly',
    groupsAffected: ['G4'],
    groupCapacity: 20,
    allowedTimeSlots: ['MonAfternoon', 'WedMorning'],
    forbiddenTimeSlots: ['FriEvening'],
    requiredCampus: 'Annexe',
    priority: 'normal',
    status: 'planned',
    semester: 'S5',
    description: 'Introduction to front-end and back-end web development.',
  },
  {
    id: '4',
    name: 'Advanced Algorithms',
    code: 'MA401',
    responsibleTeacherId: '7',
    associatedTeacherIds: [],
    filiere: 'Maths',
    niveau: 'M1',
    campus: 'Central',
    totalHours: 40,
    cmHours: 15,
    tdHours: 25,
    tpHours: 0,
    sessionDurationMinutes: 60,
    frequency: 'weekly',
    groupsAffected: ['M1A'],
    groupCapacity: 35,
    allowedTimeSlots: [],
    forbiddenTimeSlots: [],
    requiredCampus: 'Central',
    priority: 'normal',
    status: 'pending', // Example of pending status
    semester: 'S1',
    description: 'In-depth study of complex algorithms and their analysis.',
  },
  {
    id: '5',
    name: 'Machine Learning Basics',
    code: 'MA501',
    responsibleTeacherId: '7',
    associatedTeacherIds: [],
    filiere: 'Maths',
    niveau: 'M2',
    campus: 'Annexe',
    totalHours: 70,
    cmHours: 25,
    tdHours: 25,
    tpHours: 20,
    sessionDurationMinutes: 120,
    frequency: 'weekly',
    groupsAffected: ['M2B'],
    groupCapacity: 28,
    allowedTimeSlots: [],
    forbiddenTimeSlots: [],
    requiredCampus: 'Annexe',
    priority: 'high',
    status: 'planned',
    semester: 'S3',
    description: 'Foundations of machine learning, including supervised and unsupervised learning.',
  },
]

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Room 101',
    capacity: 30,
    campus: 'Central',
    type: 'td',
    building: 'Main',
    floor: '1st',
    hasProjector: true,
    hasComputers: true,
    hasInteractiveBoard: false,
    hasInternet: true,
    specificEquipment: [],
    availableTimeSlots: ['MonMorning', 'TueAfternoon'],
    unavailablePeriods: [],
    status: 'available',
  },
  {
    id: '2',
    name: 'Room 102',
    capacity: 30,
    campus: 'Central',
    type: 'td',
    building: 'Main',
    floor: '1st',
    hasProjector: true,
    hasComputers: false,
    hasInteractiveBoard: true,
    hasInternet: true,
    specificEquipment: [],
    availableTimeSlots: ['MonMorning', 'WedAfternoon'],
    unavailablePeriods: [],
    status: 'available',
  },
  {
    id: '3',
    name: 'Amphi A',
    capacity: 150,
    campus: 'Annexe',
    type: 'amphi',
    building: 'Amphi Building',
    floor: 'Ground',
    hasProjector: true,
    hasComputers: false,
    hasInteractiveBoard: true,
    hasInternet: true,
    specificEquipment: ['Sound System'],
    availableTimeSlots: ['MonMorning', 'TueEvening'],
    unavailablePeriods: [
      {
        start: new Date(2025, 11, 20, 0, 0),
        end: new Date(2025, 11, 22, 23, 59),
        reason: 'Maintenance',
      },
    ],
    status: 'maintenance',
  },
  {
    id: '4',
    name: 'Lab 203',
    capacity: 20,
    campus: 'Central',
    type: 'labo',
    building: 'Science',
    floor: '2nd',
    hasProjector: true,
    hasComputers: true,
    hasInteractiveBoard: false,
    hasInternet: true,
    specificEquipment: ['Microscopes', 'Chemical Fume Hoods'],
    availableTimeSlots: ['ThuAfternoon', 'FriMorning'],
    unavailablePeriods: [],
    status: 'available',
  },
]

// Raw schedule events
const rawScheduleEvents: ScheduleEvent[] = [
  {
    id: '1',
    courseId: '1',
    roomId: '3',
    startTime: new Date(2025, 11, 15, 9, 0), // Monday Morning
    endTime: new Date(2025, 11, 15, 10, 30),
    sessionType: 'CM',
    studentIds: ['3', '4', '6', '8'],
    isCancelled: false,
    isModified: false,
    academicYear: '2025-2026',
    semester: 'S1',
  },
  {
    id: '2',
    courseId: '2',
    roomId: '1',
    startTime: new Date(2025, 11, 15, 14, 0), // Monday Afternoon
    endTime: new Date(2025, 11, 15, 15, 30),
    sessionType: 'TD',
    studentIds: ['3', '4'],
    isCancelled: false,
    isModified: true, // Example of modified session
    academicYear: '2025-2026',
    semester: 'S3',
  },
  {
    id: '3',
    courseId: '3',
    roomId: '3',
    startTime: new Date(2025, 11, 16, 18, 0), // Tuesday Evening
    endTime: new Date(2025, 11, 16, 19, 30),
    sessionType: 'CM',
    studentIds: ['3', '4', '6', '8'],
    isCancelled: true, // Example of cancelled session
    academicYear: '2025-2026',
    semester: 'S5',
  },
  {
    id: '4',
    courseId: '4',
    roomId: '2',
    startTime: new Date(2025, 11, 17, 9, 0), // Wednesday Morning,
    endTime: new Date(2025, 11, 17, 10, 30),
    sessionType: 'TD',
    studentIds: ['6', '8'],
    isCancelled: false,
    isModified: false,
    academicYear: '2025-2026',
    semester: 'S1',
  },
  {
    id: '5',
    courseId: '5',
    roomId: '4',
    startTime: new Date(2025, 11, 18, 14, 0), // Thursday Afternoon
    endTime: new Date(2025, 11, 18, 15, 30),
    sessionType: 'TP',
    studentIds: ['6', '8'],
    isCancelled: false,
    isModified: false,
    academicYear: '2025-2026',
    semester: 'S3',
  },
  // --- Events for testing conflicts and overload ---
  // Conflict: Room 101, Monday Afternoon (overlaps with event 2)
  {
    id: '6',
    courseId: '1',
    roomId: '1',
    startTime: new Date(2025, 11, 15, 14, 30), // Overlaps with event 2
    endTime: new Date(2025, 11, 15, 16, 0),
    sessionType: 'CM',
    studentIds: ['3', '4'],
    isCancelled: false,
    isModified: false,
    academicYear: '2025-2026',
    semester: 'S1',
  },
  // Overload: Room 102 (capacity 30), many students
  {
    id: '7',
    courseId: '3',
    roomId: '2',
    startTime: new Date(2025, 11, 17, 10, 30), // Wednesday Morning, after event 4
    endTime: new Date(2025, 11, 17, 12, 0),
    sessionType: 'CM',
    studentIds: ['3', '4', '6', '8', '1', '2', '5', '7'], // 8 students
    isCancelled: false,
    isModified: false,
    academicYear: '2025-2026',
    semester: 'S5',
  },
  // Teacher conflict (Dr. Alan Turing - responsibleTeacherId '2')
  {
    id: '8',
    courseId: '1', // Course 1 is taught by teacher '2'
    roomId: '4',
    startTime: new Date(2025, 11, 15, 9, 30), // Overlaps with event 1 (same teacher, different room)
    endTime: new Date(2025, 11, 15, 11, 0),
    sessionType: 'TD',
    studentIds: ['3', '4'],
    isCancelled: false,
    isModified: false,
    academicYear: '2025-2026',
    semester: 'S1',
  },
]

// Helper maps for quick lookups
export const coursesById = courses.reduce((acc, course) => {
  acc[course.id] = course
  return acc
}, {} as Record<string, Course>)

export const roomsById = rooms.reduce((acc, room) => {
  acc[room.id] = room
  return acc
}, {} as Record<string, Room>)

export const usersById = users.reduce((acc, user) => {
  acc[user.id] = user
  return acc
}, {} as Record<string, User>)

// Function to process events for conflicts and overloads
export const processScheduleEvents = (
  events: ScheduleEvent[],
): ScheduleEvent[] => {
  return events.map((event) => {
    let hasConflict = false
    let isRoomOverloaded = false

    const currentCourse = coursesById[event.courseId]
    const currentRoom = roomsById[event.roomId]
    const currentTeacherId = currentCourse?.responsibleTeacherId // Use responsibleTeacherId

    // Check for room overload
    if (currentRoom && event.studentIds.length > currentRoom.capacity) {
      isRoomOverloaded = true
    }

    // Check for conflicts with other events
    events.forEach((otherEvent) => {
      if (event.id === otherEvent.id) return // Don't compare with itself

      // Check for time overlap
      const overlap =
        event.startTime < otherEvent.endTime && event.endTime > otherEvent.startTime

      if (overlap) {
        const otherCourse = coursesById[otherEvent.courseId]
        const otherTeacherId = otherCourse?.responsibleTeacherId // Use responsibleTeacherId

        // Room conflict
        if (event.roomId === otherEvent.roomId) {
          hasConflict = true
        }

        // Teacher conflict
        if (currentTeacherId && currentTeacherId === otherTeacherId) {
          hasConflict = true
        }

        // Student conflict (if any common student)
        const commonStudents = event.studentIds.some((studentId) =>
          otherEvent.studentIds.includes(studentId),
        )
        if (commonStudents) {
          hasConflict = true
        }
      }
    })

    return {
      ...event,
      hasConflict,
      isRoomOverloaded,
    }
  })
}

export const scheduleEvents = processScheduleEvents(rawScheduleEvents)

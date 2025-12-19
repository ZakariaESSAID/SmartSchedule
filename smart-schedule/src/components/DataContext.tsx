import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  users as initialUsers,
  courses as initialCourses,
  rooms as initialRooms,
  scheduleEvents as initialScheduleEvents,
  processScheduleEvents,
} from '@/lib/data'
import { Course, User, Room, ScheduleEvent } from '@/types'

// Define the shape of the context data
interface DataContextType {
  users: User[]
  courses: Course[]
  rooms: Room[]
  scheduleEvents: ScheduleEvent[]
  user: User | null // Add user to context
  login: (email: string, password: string) => void // Add login to context
  logout: () => void // Add logout to context
  addCourse: (course: Omit<Course, 'id'>) => void
  updateCourse: (course: Course) => void
  deleteCourse: (courseId: string) => void
  addScheduleEvent: (event: Omit<ScheduleEvent, 'id'>) => void
  updateScheduleEvent: (event: ScheduleEvent) => void
  deleteScheduleEvent: (eventId: string) => void
  addTeacher: (teacher: Omit<User, 'id'>) => void
  updateTeacher: (teacher: User) => void
  deleteTeacher: (teacherId: string) => void
  addStudent: (student: Omit<User, 'id'>) => void
  updateStudent: (student: User) => void
  deleteStudent: (studentId: string) => void
  addRoom: (room: Omit<Room, 'id'>) => void // New
  updateRoom: (room: Room) => void // New
  deleteRoom: (roomId: string) => void // New
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined)

// Create a provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [rawEvents, setRawEvents] = useState<ScheduleEvent[]>(initialScheduleEvents); // Store raw events
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(
    processScheduleEvents(initialScheduleEvents),
  )
  const [user, setUser] = useState<User | null>(null)

  // Re-process events whenever rawEvents, courses, or rooms change
  useEffect(() => {
    setScheduleEvents(processScheduleEvents(rawEvents));
  }, [rawEvents, courses, rooms]);


  // Auth logic (moved from useAuth hook)
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (email, password) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    )
    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser))
      setUser(foundUser)
      // Navigation will be handled by the LoginPage component
    } else {
      alert('Email ou mot de passe invalide')
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    // Navigation will be handled by the Header component
  }

  // Course CRUD
  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`, // Simple unique ID generation
    }
    setCourses((prevCourses) => [...prevCourses, newCourse])
  }

  const updateCourse = (updatedCourse: Course) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course,
      ),
    )
  }

  const deleteCourse = (courseId: string) => {
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== courseId),
    )
    setRawEvents((prevEvents) =>
      prevEvents.filter((event) => event.courseId !== courseId),
    )
  }

  // ScheduleEvent CRUD
  const addScheduleEvent = (eventData: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
    }
    setRawEvents((prevEvents) => [...prevEvents, newEvent])
  }

  const updateScheduleEvent = (updatedEvent: ScheduleEvent) => {
    setRawEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    )
  }

  const deleteScheduleEvent = (eventId: string) => {
    setRawEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId),
    )
  }

  // Teacher CRUD
  const addTeacher = (teacherData: Omit<User, 'id'>) => {
    const newTeacher: User = {
      ...teacherData,
      id: `teacher-${Date.now()}`,
      role: 'teacher', // Ensure role is teacher
    }
    setUsers((prevUsers) => [...prevUsers, newTeacher])
  }

  const updateTeacher = (updatedTeacher: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedTeacher.id ? updatedTeacher : user,
      ),
    )
  }

  const deleteTeacher = (teacherId: string) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== teacherId),
    )
    // Also remove teacher from courses they are responsible for or associated with
    setCourses((prevCourses) =>
      prevCourses.map((course) => ({
        ...course,
        responsibleTeacherId:
          course.responsibleTeacherId === teacherId
            ? ''
            : course.responsibleTeacherId,
        associatedTeacherIds: course.associatedTeacherIds?.filter(
          (id) => id !== teacherId,
        ),
      })),
    )
    // Also delete schedule events taught by this teacher (more complex, for now just remove from courses)
  }

  // Student CRUD
  const addStudent = (studentData: Omit<User, 'id'>) => {
    const newStudent: User = {
      ...studentData,
      id: `student-${Date.now()}`,
      role: 'student', // Ensure role is student
    }
    setUsers((prevUsers) => [...prevUsers, newStudent])
  }

  const updateStudent = (updatedStudent: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedStudent.id ? updatedStudent : user,
      ),
    )
  }

  const deleteStudent = (studentId: string) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== studentId),
    )
    // Also remove student from all schedule events
    setRawEvents((prevEvents) =>
      prevEvents.map((event) => ({
        ...event,
        studentIds: event.studentIds.filter((id) => id !== studentId),
      })),
    )
  }

  // Room CRUD
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`,
    }
    setRooms((prevRooms) => [...prevRooms, newRoom])
  }

  const updateRoom = (updatedRoom: Room) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === updatedRoom.id ? updatedRoom : room,
      ),
    )
  }

  const deleteRoom = (roomId: string) => {
    setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId))
    // Also delete schedule events happening in this room
    setRawEvents((prevEvents) =>
      prevEvents.filter((event) => event.roomId !== roomId),
    )
  }

  const value = {
    users,
    courses,
    rooms,
    scheduleEvents,
    user,
    login,
    logout,
    addCourse,
    updateCourse,
    deleteCourse,
    addScheduleEvent,
    updateScheduleEvent,
    deleteScheduleEvent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addStudent,
    updateStudent,
    deleteStudent,
    addRoom,
    updateRoom,
    deleteRoom,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// Create a custom hook to use the context
export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

import React from 'react'
import { scheduleEvents, courses, rooms, users } from '@/lib/data'
import { ScheduleEvent, SessionType } from '@/types'

// --- Configuration ---
const ALL_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] // Translated
const TIME_SLOTS = ['Matin', 'Après-midi', 'Soir'] // Translated
const SESSION_COLORS: Record<SessionType, string> = {
  CM: 'bg-blue-200 border-blue-400',
  TD: 'bg-green-200 border-green-400',
  TP: 'bg-yellow-200 border-yellow-400',
}

// --- Helper Functions ---
const getDayIndex = (date: Date): number => (date.getDay() + 6) % 7
const getTimeSlotIndex = (date: Date): number => {
  const hour = date.getHours()
  if (hour < 12) return 0
  if (hour < 17) return 1
  return 2
}

// --- Component Props ---
interface TimetableGridProps {
  viewMode: 'week' | 'day'
  viewType: 'student' | 'teacher' | 'room' | 'course' // Added 'course' view type
  selectedId: string
  selectedDay: number
  campusFilter: string
  filiereFilter: string
  niveauFilter: string
  searchQuery: string
  academicYearFilter: string
  semesterFilter: string
  onEventClick: (event: ScheduleEvent) => void // New prop for click handler
}

// --- Main Component ---
const TimetableGrid: React.FC<TimetableGridProps> = ({
  viewMode,
  viewType,
  selectedId,
  selectedDay,
  campusFilter,
  filiereFilter,
  niveauFilter,
  searchQuery,
  academicYearFilter,
  semesterFilter,
  onEventClick,
}) => {
  // 1. Filter events based on the selected view type and ID
  const initialFilteredEvents = scheduleEvents.filter((event) => {
    const course = courses.find((c) => c.id === event.courseId)
    if (!course) return false

    switch (viewType) {
      case 'teacher':
        return course.responsibleTeacherId === selectedId
      case 'room':
        return event.roomId === selectedId
      case 'student':
        return event.studentIds.includes(selectedId)
      case 'course': // New case for course view
        return event.courseId === selectedId
      default:
        return true
    }
  })

  // 2. Apply additional filters (campus, filiere, niveau, search, academicYear, semester)
  const finalFilteredEvents = initialFilteredEvents.filter((event) => {
    const course = courses.find((c) => c.id === event.courseId)
    const room = rooms.find((r) => r.id === event.roomId)
    const teacher = users.find((u) => u.id === course?.responsibleTeacherId)

    // Campus Filter (local)
    if (campusFilter && room?.campus !== campusFilter) {
      return false
    }

    // Filiere Filter (local)
    if (filiereFilter && course?.filiere !== filiereFilter) {
      return false
    }

    // Niveau Filter (local)
    if (niveauFilter && course?.niveau !== niveauFilter) {
      return false
    }

    // Academic Year Filter (global)
    if (academicYearFilter && event.academicYear !== academicYearFilter) {
      return false
    }

    // Semester Filter (global)
    if (semesterFilter && event.semester !== semesterFilter) {
      return false
    }

    // Search Query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      const matchesCourse = course?.name.toLowerCase().includes(lowerCaseQuery)
      const matchesCourseCode = course?.code.toLowerCase().includes(lowerCaseQuery)
      const matchesRoom = room?.name.toLowerCase().includes(lowerCaseQuery)
      const matchesTeacher = teacher?.name.toLowerCase().includes(lowerCaseQuery)
      const matchesSessionType = event.sessionType.toLowerCase().includes(lowerCaseQuery)

      if (!matchesCourse && !matchesCourseCode && !matchesRoom && !matchesTeacher && !matchesSessionType) {
        return false
      }
    }

    return true
  })

  // 3. Determine which days to display
  const daysToShow = viewMode === 'week' ? ALL_DAYS : [ALL_DAYS[selectedDay]]

  // 4. Create and populate the grid
  const grid: (ScheduleEvent | null)[][] = Array(TIME_SLOTS.length)
    .fill(null)
    .map(() => Array(daysToShow.length).fill(null))

  finalFilteredEvents.forEach((event) => {
    const dayIndex = getDayIndex(event.startTime)
    const timeSlotIndex = getTimeSlotIndex(event.startTime)

    // Adjust dayIndex for 'day' view to always be 0 (first column)
    const targetDayIndex = viewMode === 'week' ? dayIndex : 0;

    if (targetDayIndex >= 0 && targetDayIndex < daysToShow.length) {
      grid[timeSlotIndex][targetDayIndex] = event
    }
  })

  return (
    <div
      className="grid gap-1 p-4 bg-gray-100 rounded-lg"
      style={{ gridTemplateColumns: `auto repeat(${daysToShow.length}, 1fr)` }}
    >
      {/* Header */}
      <div className="font-bold text-center"></div>
      {daysToShow.map((day) => (
        <div key={day} className="font-bold text-center py-2">
          {day}
        </div>
      ))}

      {/* Rows */}
      {TIME_SLOTS.map((slot, slotIndex) => (
        <React.Fragment key={slot}>
          <div className="font-bold text-center py-8">{slot}</div>
          {daysToShow.map((_, dayIndex) => {
            const event = grid[slotIndex][dayIndex]
            const course = event
              ? courses.find((c) => c.id === event.courseId)
              : null
            const room = event
              ? rooms.find((r) => r.id === event.roomId)
              : null

            let cellClasses = `p-2 border rounded-md h-24 flex flex-col justify-center items-center cursor-pointer relative `
            let contentClasses = `text-center `

            if (event) {
              if (event.isCancelled) {
                cellClasses += `bg-gray-100 text-gray-500 line-through border-gray-300 `
              } else if (event.hasConflict) {
                cellClasses += `bg-red-100 border-red-500 `
              } else if (event.isRoomOverloaded) {
                cellClasses += `bg-orange-100 border-orange-500 `
              } else {
                cellClasses += SESSION_COLORS[event.sessionType]
              }
            } else {
              cellClasses += `bg-white `
            }

            return (
              <div
                key={dayIndex}
                className={cellClasses}
                onClick={() => event && onEventClick(event)}
              >
                {event && course && room ? (
                  <div className={contentClasses}>
                    {event.isModified && (
                      <span className="absolute top-1 right-1 bg-purple-500 text-white text-xs px-1 rounded-full">
                        MODIFIÉ {/* Translated */}
                      </span>
                    )}
                    {event.hasConflict && (
                      <span className="absolute top-1 left-1 text-red-700 text-lg" title="Conflit détecté"> {/* Translated */}
                        &#9888;
                      </span>
                    )}
                    {event.isRoomOverloaded && (
                      <span className="absolute bottom-1 left-1 text-orange-700 text-lg" title="Salle surchargée"> {/* Translated */}
                        &#9888;
                      </span>
                    )}
                    <div className="font-bold">{course.name}</div>
                    <div className="text-sm">{room.name}</div>
                    <div className="text-xs font-mono mt-1 p-1 bg-white bg-opacity-50 rounded">
                      {event.sessionType}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">Vide {/* Translated */}</div>
                )}
              </div>
            )
          })}
        </React.Fragment>
      ))}
    </div>
  )
}

export default TimetableGrid

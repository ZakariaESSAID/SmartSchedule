import React from 'react'
import { ScheduleEvent, Course, Room, User } from '@/types'

interface SessionDetailModalProps {
  event: ScheduleEvent
  course: Course
  room: Room
  teacher: User
  students: User[]
  onClose: () => void
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  event,
  course,
  room,
  teacher,
  students,
  onClose,
}) => {
  if (!event) return null

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{course.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <div className="space-y-3">
          {/* Status Indicators */}
          <div className="flex flex-wrap gap-2 mb-2">
            {event.isCancelled && (
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">ANNULÉ</span>
            )}
            {event.isModified && (
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">MODIFIÉ</span>
            )}
            {event.hasConflict && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">CONFLIT</span>
            )}
            {event.isRoomOverloaded && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">SURCHARGÉ</span>
            )}
          </div>

          <p><strong>Module:</strong> {course.name}</p>
          <p><strong>Type de séance:</strong> {event.sessionType}</p>
          <p><strong>Enseignant:</strong> {teacher.name}</p>
          <p><strong>Salle:</strong> {room.name} (Capacité: {room.capacity})</p>
          <p><strong>Campus:</strong> {room.campus || 'N/A'}</p>
          <p><strong>Filière:</strong> {course.filiere || 'N/A'}</p>
          <p><strong>Niveau:</strong> {course.niveau || 'N/A'}</p>
          <p><strong>Horaire:</strong> {`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}</p>
          <div>
            <p><strong>Étudiants ({students.length}):</strong></p>
            <div className="list-disc list-inside text-sm h-24 overflow-y-auto bg-gray-50 p-2 rounded border">
              {students.length > 0 ? (
                students.map(student => (
                  <div key={student.id}>{student.name}</div>
                ))
              ) : (
                <div>Aucun étudiant assigné.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionDetailModal

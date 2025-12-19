import React, { useState, useEffect, useMemo } from 'react'
import { ScheduleEvent } from '@/types'
import { useData } from './DataContext'
import { useNavigate, useParams } from 'react-router-dom' // Import useParams

interface SessionFormProps {
  initialEvent?: ScheduleEvent // Optional, for editing existing events
  courseId?: string // Pre-fill courseId when replanning from CourseDetail
}

const SessionForm: React.FC<SessionFormProps> = ({ initialEvent, courseId }) => {
  const { courses, rooms, users, addScheduleEvent, updateScheduleEvent } = useData()
  const navigate = useNavigate()
  const { roomId } = useParams<{ roomId: string }>(); // Get roomId from URL params

  const [formData, setFormData] = useState<ScheduleEvent>(
    initialEvent || {
      id: '', // Will be generated for new events
      courseId: courseId || '',
      roomId: roomId || '', // Pre-fill roomId if available from URL
      startTime: new Date(),
      endTime: new Date(),
      sessionType: 'CM',
      studentIds: [],
      academicYear: '',
      semester: '',
    },
  )

  useEffect(() => {
    if (initialEvent) {
      setFormData(initialEvent)
    } else if (courseId) {
      const course = courses.find(c => c.id === courseId);
      setFormData(prev => ({
        ...prev,
        courseId: courseId,
        academicYear: course?.academicYear || '', // Pre-fill from course if available
        semester: course?.semester || '', // Pre-fill from course if available
      }));
    } else if (roomId) { // New: Pre-fill roomId if from URL
      setFormData(prev => ({
        ...prev,
        roomId: roomId,
      }));
    }
  }, [initialEvent, courseId, roomId, courses])

  const availableCourses = useMemo(() => courses, [courses])
  const availableRooms = useMemo(() => rooms, [rooms])
  const availableStudents = useMemo(() => users.filter(u => u.role === 'student'), [users])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target
    if (type === 'datetime-local') {
      setFormData((prev) => ({ ...prev, [name]: new Date(value) }))
    } else if (name === 'studentIds') {
      const selectedOptions = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        (option) => option.value,
      )
      setFormData((prev) => ({ ...prev, studentIds: selectedOptions }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialEvent) {
      updateScheduleEvent(formData)
    } else {
      addScheduleEvent(formData)
    }
    // Redirect based on where we came from
    if (formData.courseId) {
      navigate(`/courses/${formData.courseId}`)
    } else if (formData.roomId) {
      navigate(`/rooms/${formData.roomId}`)
    } else {
      navigate('/dashboard') // Fallback
    }
  }

  // Format dates for datetime-local input
  const formatDateTime = (date: Date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {initialEvent ? 'Modifier la séance' : 'Ajouter une nouvelle séance'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Cours</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={!!initialEvent || !!courseId} // Disable if editing or pre-filled
          >
            <option value="">Sélectionner un cours</option>
            {availableCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </div>

        {/* Room Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Salle</label>
          <select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={!!initialEvent || !!roomId} // Disable if editing or pre-filled from URL
          >
            <option value="">Sélectionner une salle</option>
            {availableRooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} (Capacité: {room.capacity})
              </option>
            ))}
          </select>
        </div>

        {/* Session Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Type de séance</label>
          <select
            name="sessionType"
            value={formData.sessionType}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="CM">CM (Cours Magistral)</option>
            <option value="TD">TD (Travaux Dirigés)</option>
            <option value="TP">TP (Travaux Pratiques)</option>
          </select>
        </div>

        {/* Start and End Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Heure de début</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formatDateTime(formData.startTime)}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Heure de fin</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formatDateTime(formData.endTime)}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        {/* Academic Year and Semester */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Année académique</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., 2024-2025"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Semestre</label>
            <input
              type="text"
              name="semester"
              value={formData.semester || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., S1"
              required
            />
          </div>
        </div>

        {/* Student Selection (Multi-select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Étudiants affectés</label>
          <select
            name="studentIds"
            multiple
            value={formData.studentIds}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md h-32"
          >
            {availableStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.studentIdNumber})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl/Cmd pour sélectionner plusieurs étudiants.</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              if (formData.courseId) {
                navigate(`/courses/${formData.courseId}`);
              } else if (formData.roomId) {
                navigate(`/rooms/${formData.roomId}`);
              } else {
                navigate('/dashboard');
              }
            }}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {initialEvent ? 'Modifier la séance' : 'Ajouter la séance'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SessionForm

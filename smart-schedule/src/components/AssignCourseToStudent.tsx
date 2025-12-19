import React, { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from './DataContext'
import { ScheduleEvent } from '@/types'

const AssignCourseToStudent: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const { users, courses, scheduleEvents, updateScheduleEvent } = useData()

  const student = useMemo(() => users.find((u) => u.id === studentId && u.role === 'student'), [users, studentId])
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')

  const availableCourses = useMemo(() => {
    // Filter out courses where the student is already assigned to at least one event
    return courses.filter(course =>
      !scheduleEvents.some(event =>
        event.courseId === course.id && event.studentIds.includes(studentId || '')
      )
    );
  }, [courses, scheduleEvents, studentId]);


  useEffect(() => {
    if (!student) {
      navigate('/students') // Redirect if student not found
    }
  }, [student, navigate])

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourseId || !student) return

    // Find all schedule events for the selected course
    const eventsToUpdate = scheduleEvents.filter(event => event.courseId === selectedCourseId);

    eventsToUpdate.forEach(event => {
      // Add studentId if not already present
      if (!event.studentIds.includes(student.id)) {
        const updatedEvent: ScheduleEvent = {
          ...event,
          studentIds: [...event.studentIds, student.id]
        };
        updateScheduleEvent(updatedEvent);
      }
    });

    alert(`L'étudiant ${student.name} a été affecté au cours ${courses.find(c => c.id === selectedCourseId)?.name}.`);
    navigate(`/students/${studentId}`) // Go back to student detail page
  }

  if (!student) {
    return <div className="p-4 text-red-500">Étudiant non trouvé.</div>
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Affecter un cours à {student.name}</h2>
      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sélectionner un cours</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">-- Choisir un cours --</option>
            {availableCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code}) - {course.filiere} {course.niveau}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/students/${studentId}`)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={!selectedCourseId}
          >
            Affecter le cours
          </button>
        </div>
      </form>
    </div>
  )
}

export default AssignCourseToStudent

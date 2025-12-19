import React, { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from './DataContext'
import { Course } from '@/types'

const AssignCourseToTeacher: React.FC = () => {
  const { teacherId } = useParams<{ teacherId: string }>()
  const navigate = useNavigate()
  const { users, courses, updateCourse } = useData()

  const teacher = useMemo(() => users.find((u) => u.id === teacherId && u.role === 'teacher'), [users, teacherId])
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [assignmentType, setAssignmentType] = useState<'responsible' | 'associated'>('responsible')

  const availableCourses = useMemo(() => {
    // Filter out courses where this teacher is already responsible or associated
    return courses.filter(course =>
      course.responsibleTeacherId !== teacherId &&
      !course.associatedTeacherIds?.includes(teacherId || '')
    );
  }, [courses, teacherId]);


  useEffect(() => {
    if (!teacher) {
      navigate('/teachers') // Redirect if teacher not found
    }
  }, [teacher, navigate])

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourseId || !teacher) return

    const courseToUpdate = courses.find((c) => c.id === selectedCourseId)
    if (!courseToUpdate) return

    let updatedCourse: Course = { ...courseToUpdate }

    if (assignmentType === 'responsible') {
      updatedCourse.responsibleTeacherId = teacher.id
      // Remove from associated if they were there
      updatedCourse.associatedTeacherIds = updatedCourse.associatedTeacherIds?.filter(id => id !== teacher.id)
    } else {
      // Add to associated if not already responsible and not already associated
      if (updatedCourse.responsibleTeacherId !== teacher.id && !updatedCourse.associatedTeacherIds?.includes(teacher.id)) {
        updatedCourse.associatedTeacherIds = [...(updatedCourse.associatedTeacherIds || []), teacher.id]
      }
    }

    updateCourse(updatedCourse)
    navigate(`/teachers/${teacherId}`) // Go back to teacher detail page
  }

  if (!teacher) {
    return <div className="p-4 text-red-500">Enseignant non trouvé.</div>
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Affecter un cours à {teacher.name}</h2>
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
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type d'affectation</label>
          <div className="mt-1 flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="assignmentType"
                value="responsible"
                checked={assignmentType === 'responsible'}
                onChange={() => setAssignmentType('responsible')}
                className="form-radio"
              />
              <span className="ml-2">Enseignant responsable</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="assignmentType"
                value="associated"
                checked={assignmentType === 'associated'}
                onChange={() => setAssignmentType('associated')}
                className="form-radio"
              />
              <span className="ml-2">Enseignant associé</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/teachers/${teacherId}`)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Affecter le cours
          </button>
        </div>
      </form>
    </div>
  )
}

export default AssignCourseToTeacher

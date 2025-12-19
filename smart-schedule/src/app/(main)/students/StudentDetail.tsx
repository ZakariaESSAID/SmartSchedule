'use client'

import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '@/components/DataContext' // Import useData hook
import TimetableGrid from '@/components/TimetableGrid'
import SessionDetailModal from '@/components/SessionDetailModal'
import ConfirmationModal from '@/components/ConfirmationModal' // Import ConfirmationModal
import { ScheduleEvent } from '@/types'

const StudentDetailPage = () => {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const { users, courses, rooms, scheduleEvents, deleteStudent } = useData() // Use data from context
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false)

  const student = useMemo(() => {
    return users.find((u) => u.id === studentId && u.role === 'student')
  }, [studentId, users])

  const studentCourses = useMemo(() => {
    if (!student) return []
    // This logic assumes 'niveau' can act as a semester for filtering
    return courses.filter(
      (course) =>
        course.filiere === student.studentFiliere &&
        course.niveau === student.studentNiveau,
    )
  }, [student, courses])

  const uniqueNiveaux = useMemo(() => {
    const niveaux = new Set(
      courses
        .filter((c) => c.filiere === student?.studentFiliere)
        .map((c) => c.niveau)
        .filter(Boolean) as string[],
    )
    return ['', ...Array.from(niveaux)]
  }, [student, courses])

  const [selectedSemester, setSelectedSemester] = useState<string>(student?.studentNiveau || '') // Initialize with student's current niveau

  if (!student) {
    return (
      <div className="p-4 text-red-500">
        Étudiant non trouvé. <button onClick={() => navigate(-1)}>Retour</button>
      </div>
    )
  }

  // Data for the modal
  const modalData = selectedEvent
    ? {
        event: selectedEvent,
        course: courses.find((c) => c.id === selectedEvent.courseId)!,
        room: rooms.find((r) => r.id === selectedEvent.roomId)!,
        teacher: users.find(
          (u) =>
            u.id ===
            courses.find((c) => c.id === selectedEvent.courseId)?.responsibleTeacherId,
        )!,
        students: users.filter((u) =>
          selectedEvent.studentIds.includes(u.id),
        ),
      }
    : null

  const confirmDeleteStudent = () => {
    setShowDeleteStudentModal(true)
  }

  const executeDeleteStudent = () => {
    deleteStudent(student.id)
    setShowDeleteStudentModal(false)
    navigate('/students')
  }

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
        &larr; Retour aux étudiants
      </button>
      <h1 className="text-3xl font-bold mb-6">Étudiant: {student.name}</h1>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => navigate(`/students/${student.id}/edit`)} // Navigate to edit form
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Modifier l'étudiant
        </button>
        <button
          onClick={confirmDeleteStudent} // Use custom confirmation
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Supprimer l'étudiant
        </button>
        <button
          onClick={() => navigate(`/students/${student.id}/assign-course`)} // Navigate to assign course page
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Affecter à un groupe / module
        </button>
        <button onClick={() => navigate(`/dashboard?viewType=student&selectedId=${student.id}`)} className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
          Consulter emploi du temps
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-6">
        {/* 1. Informations générales */}
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Informations générales</h2>
          <p><strong>ID étudiant:</strong> {student.studentIdNumber || 'N/A'}</p>
          <p><strong>Email:</strong> {student.email || 'N/A'}</p>
          <p><strong>Filière:</strong> {student.studentFiliere || 'N/A'}</p>
          <p><strong>Niveau / Semestre:</strong> {student.studentNiveau || 'N/A'}</p>
          <p><strong>Groupe / Section:</strong> {student.studentGroup || 'N/A'}</p>
          <p><strong>Campus:</strong> {student.studentCampus || 'N/A'}</p>
        </div>

        {/* 2. Statut académique */}
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Statut académique</h2>
          <p><strong>Statut:</strong> {student.academicStatus || 'N/A'}</p>
          <p><strong>Année universitaire:</strong> {student.academicYear || 'N/A'}</p>
        </div>

        {/* Modules / cours suivis */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Modules / Cours suivis</h2>
          {studentCourses.length > 0 ? (
            <ul className="list-disc list-inside ml-4">
              {studentCourses.map((course) => (
                <li key={course.id}>{course.name} ({course.code})</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Aucun cours trouvé pour cet étudiant dans sa filière/niveau.</p>
          )}
        </div>
      </div>

      {/* 3. Emploi du temps étudiant (affichage) */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Emploi du temps personnel (vue hebdomadaire)</h2>
        <div className="mb-4">
          <label htmlFor="semesterFilter" className="mr-2">Filtrer par semestre:</label>
          <select
            id="semesterFilter"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Tous les semestres</option>
            {uniqueNiveaux.map((niveau) => (
              <option key={niveau} value={niveau}>
                {niveau}
              </option>
            ))}
          </select>
        </div>
        <TimetableGrid
          viewMode="week"
          viewType="student"
          selectedId={student.id}
          selectedDay={0} // Default to Monday for weekly view
          campusFilter=""
          filiereFilter={student.studentFiliere || ''} // Filter by student's filiere
          niveauFilter={selectedSemester} // Filter by selected semester
          searchQuery=""
          academicYearFilter={student.academicYear || ''} // Filter by student's academic year
          semesterFilter={selectedSemester} // Filter by selected semester
          onEventClick={(event) => setSelectedEvent(event)}
        />
      </div>

      {/* --- Modal --- */}
      {selectedEvent && modalData && (
        <SessionDetailModal
          {...modalData}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Student Delete Confirmation Modal */}
      {showDeleteStudentModal && (
        <ConfirmationModal
          message={`Êtes-vous sûr de vouloir supprimer l'étudiant "${student.name}" ? Cette action est irréversible et le retirera de toutes les séances.`}
          onConfirm={executeDeleteStudent}
          onCancel={() => setShowDeleteStudentModal(false)}
        />
      )}
    </div>
  )
}

export default StudentDetailPage

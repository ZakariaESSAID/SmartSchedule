'use client'

import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '@/components/DataContext'
import TimetableGrid from '@/components/TimetableGrid'
import SessionDetailModal from '@/components/SessionDetailModal'
import ConfirmationModal from '@/components/ConfirmationModal'
import { ScheduleEvent } from '@/types'

const TeacherDetailPage = () => {
  const { teacherId } = useParams<{ teacherId: string }>()
  const navigate = useNavigate()
  const { users, courses, rooms, scheduleEvents, deleteTeacher } = useData()
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [showDeleteTeacherModal, setShowDeleteTeacherModal] = useState(false)

  const teacher = useMemo(() => {
    return users.find((u) => u.id === teacherId && u.role === 'teacher')
  }, [teacherId, users])

  const taughtCourses = useMemo(() => {
    return courses.filter((c) => c.responsibleTeacherId === teacher?.id)
  }, [teacher, courses])

  if (!teacher) {
    return (
      <div className="p-4 text-red-500">
        Enseignant non trouvé. <button onClick={() => navigate(-1)}>Retour</button>
      </div>
    )
  }

  // Data for the modal (re-using logic from DashboardPage)
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

  const confirmDeleteTeacher = () => {
    setShowDeleteTeacherModal(true)
  }

  const executeDeleteTeacher = () => {
    deleteTeacher(teacher.id)
    setShowDeleteTeacherModal(false)
    navigate('/teachers')
  }

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
        &larr; Retour aux enseignants
      </button>
      <h1 className="text-3xl font-bold mb-6">Enseignant: {teacher.name}</h1>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => navigate(`/teachers/${teacher.id}/edit`)} // Navigate to edit form
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Modifier l'enseignant
        </button>
        <button
          onClick={confirmDeleteTeacher} // Use custom confirmation
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Supprimer l'enseignant
        </button>
        <button
          onClick={() => navigate(`/teachers/${teacher.id}/assign-course`)} // Navigate to assign course page
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Affecter un cours
        </button>
        <button
          onClick={() => navigate(`/teachers/${teacher.id}/edit`)} // Navigate to edit form for availabilities
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          Gérer les disponibilités
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-6">
        {/* 1. Informations générales */}
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Informations générales</h2>
          <p><strong>Matricule:</strong> {teacher.matricule || 'N/A'}</p>
          <p><strong>Email:</strong> {teacher.email || 'N/A'}</p>
          <p><strong>Téléphone:</strong> {teacher.phone || 'N/A'}</p>
          <p><strong>Spécialité:</strong> {teacher.specialty || 'N/A'}</p>
          <p><strong>Département:</strong> {teacher.department || 'N/A'}</p>
          <p><strong>Campus d'affectation:</strong> {teacher.campusAffection || 'N/A'}</p>
        </div>

        {/* 2. Statut et rôle */}
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Statut et rôle</h2>
          <p><strong>Statut:</strong> {teacher.teacherStatus || 'N/A'}</p>
          <p><strong>Responsable de module:</strong> {teacher.isModuleResponsible ? 'Oui' : 'Non'}</p>
        </div>

        {/* 3. Disponibilités */}
        <div>
          <h2 className="text-xl font-semibold mb-2">3. Disponibilités</h2>
          <p><strong>Jours disponibles:</strong> {teacher.availableDays?.join(', ') || 'Tous'}</p>
          <p><strong>Créneaux horaires disponibles:</strong> {teacher.availableTimeSlots?.join(', ') || 'Tous'}</p>
          <p><strong>Créneaux horaires indisponibles:</strong> {teacher.unavailableTimeSlots?.join(', ') || 'Aucun'}</p>
          <p><strong>Préférences horaires:</strong> {teacher.preferredTimeSlots?.join(', ') || 'Aucune'}</p>
        </div>

        {/* 4. Charge pédagogique */}
        <div>
          <h2 className="text-xl font-semibold mb-2">4. Charge pédagogique</h2>
          <p><strong>Heures hebdomadaires:</strong> {teacher.weeklyHours || 'N/A'} / {teacher.maxWeeklyHours || 'N/A'}</p>
          <p><strong>Modules enseignés:</strong> {taughtCourses.map(c => c.name).join(', ') || 'Aucun'}</p>
          {/* Groupes pris en charge - This would require more complex data linking */}
        </div>

        {/* 5. Contraintes liées à l’enseignant */}
        <div>
          <h2 className="text-xl font-semibold mb-2">5. Contraintes</h2>
          <p><strong>Jours non travaillés:</strong> {teacher.nonWorkingDays?.join(', ') || 'Aucun'}</p>
          {/* Other constraints like no overlap, max hours, multi-campus are handled by the scheduling logic */}
        </div>
      </div>

      {/* 6. Emploi du temps enseignant (affichage) */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Emploi du temps personnel (vue hebdomadaire)</h2>
        <TimetableGrid
          viewMode="week"
          viewType="teacher"
          selectedId={teacher.id}
          selectedDay={0} // Default to Monday for weekly view
          campusFilter=""
          filiereFilter=""
          niveauFilter=""
          searchQuery=""
          academicYearFilter="" // Assuming no academic year filter for teacher's personal view
          semesterFilter="" // Assuming no semester filter for teacher's personal view
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

      {/* Teacher Delete Confirmation Modal */}
      {showDeleteTeacherModal && (
        <ConfirmationModal
          message={`Êtes-vous sûr de vouloir supprimer l'enseignant "${teacher.name}" ? Cette action est irréversible et supprimera également toutes les références à cet enseignant dans les cours.`}
          onConfirm={executeDeleteTeacher}
          onCancel={() => setShowDeleteTeacherModal(false)}
        />
      )}
    </div>
  )
}

export default TeacherDetailPage

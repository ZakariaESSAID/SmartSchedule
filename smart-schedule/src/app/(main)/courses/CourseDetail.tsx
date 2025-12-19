'use client'

import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '@/components/DataContext' // Import useData hook
import { Course } from '@/types'
import ConfirmationModal from '@/components/ConfirmationModal' // Import ConfirmationModal

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { courses, users, rooms, scheduleEvents, deleteCourse, deleteScheduleEvent } = useData() // Use data from context

  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false)
  const [showDeleteSessionModal, setShowDeleteSessionModal] = useState(false)
  const [sessionToDeleteId, setSessionToDeleteId] = useState<string | null>(null)

  const course = useMemo(() => {
    return courses.find((c) => c.id === courseId)
  }, [courseId, courses])

  const responsibleTeacher = useMemo(() => {
    return course ? users.find((u) => u.id === course.responsibleTeacherId) : null
  }, [course, users])

  const associatedTeachers = useMemo(() => {
    return course?.associatedTeacherIds
      ? users.filter((u) => course.associatedTeacherIds?.includes(u.id))
      : []
  }, [course, users])

  const courseCampusRoom = useMemo(() => {
    return course ? rooms.find((r) => r.campus === course.campus) : null
  }, [course, rooms])

  const courseEvents = useMemo(() => {
    return scheduleEvents.filter((event) => event.courseId === course?.id)
  }, [course, scheduleEvents])

  if (!course) {
    return (
      <div className="p-4 text-red-500">
        Cours non trouvé. <button onClick={() => navigate(-1)}>Retour</button>
      </div>
    )
  }

  const handleViewInTimetable = () => {
    navigate(`/dashboard?courseId=${course.id}`)
  }

  const confirmDeleteCourse = () => {
    setShowDeleteCourseModal(true)
  }

  const executeDeleteCourse = () => {
    deleteCourse(course.id)
    setShowDeleteCourseModal(false)
    navigate('/courses')
  }

  const confirmDeleteSession = (eventId: string) => {
    setSessionToDeleteId(eventId)
    setShowDeleteSessionModal(true)
  }

  const executeDeleteSession = () => {
    if (sessionToDeleteId) {
      deleteScheduleEvent(sessionToDeleteId)
      setShowDeleteSessionModal(false)
      setSessionToDeleteId(null)
    }
  }

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
        &larr; Retour aux cours
      </button>
      <h1 className="text-3xl font-bold mb-6">{course.name} ({course.code})</h1>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => navigate(`/courses/${course.id}/edit`)} // Navigate to edit form
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Modifier le cours
        </button>
        <button
          onClick={confirmDeleteCourse} // Use custom confirmation
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Supprimer le cours
        </button>
        <button
          onClick={() => navigate(`/courses/${course.id}/sessions/new`)} // Navigate to add new session form
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Ajouter une séance
        </button>
        <button onClick={handleViewInTimetable} className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
          Voir dans l'emploi du temps
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {/* 1. Informations générales du cours */}
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Informations générales</h2>
          <p><strong>Nom:</strong> {course.name}</p>
          <p><strong>Code:</strong> {course.code}</p>
          <p><strong>Description:</strong> {course.description || 'N/A'}</p>
          <p><strong>Filière:</strong> {course.filiere || 'N/A'}</p>
          <p><strong>Niveau / Semestre:</strong> {course.niveau || 'N/A'} / {course.semester || 'N/A'}</p>
          <p><strong>Campus:</strong> {course.campus || 'N/A'}</p>
        </div>

        {/* 2. Type de cours */}
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Répartition des types de cours</h2>
          <p><strong>CM (Cours Magistral):</strong> {course.cmHours || 0} heures</p>
          <p><strong>TD (Travaux Dirigés):</strong> {course.tdHours || 0} heures</p>
          <p><strong>TP (Travaux Pratiques):</strong> {course.tpHours || 0} heures</p>
          <p><strong>Heures totales:</strong> {course.totalHours || 'N/A'}</p>
        </div>

        {/* 3. Enseignement */}
        <div>
          <h2 className="text-xl font-semibold mb-2">3. Personnel enseignant</h2>
          <p>
            <strong>Enseignant responsable:</strong> {responsibleTeacher?.name || 'N/A'} (
            {responsibleTeacher?.email || 'N/A'})
          </p>
          {associatedTeachers.length > 0 && (
            <p>
              <strong>Enseignants associés:</strong>{' '}
              {associatedTeachers.map((t) => t.name).join(', ')}
            </p>
          )}
        </div>

        {/* 4. Organisation horaire */}
        <div>
          <h2 className="text-xl font-semibold mb-2">4. Organisation de l'emploi du temps</h2>
          <p><strong>Durée de la séance:</strong> {course.sessionDurationMinutes || 'N/A'} minutes</p>
          <p><strong>Fréquence:</strong> {course.frequency || 'N/A'}</p>
        </div>

        {/* 5. Groupes concernés */}
        <div>
          <h2 className="text-xl font-semibold mb-2">5. Groupes affectés</h2>
          <p><strong>Groupes:</strong> {course.groupsAffected?.join(', ') || 'N/A'}</p>
          <p><strong>Capacité par groupe:</strong> {course.groupCapacity || 'N/A'} étudiants</p>
        </div>

        {/* 6. Ressources associées */}
        <div>
          <h2 className="text-xl font-semibold mb-2">6. Ressources associées</h2>
          <p><strong>Campus requis:</strong> {course.requiredCampus || 'N/A'}</p>
          <p><strong>Exemple de type de salle sur le campus:</strong> {courseCampusRoom?.type || 'N/A'} (Capacité: {courseCampusRoom?.capacity || 'N/A'})</p>
        </div>

        {/* 7. Contraintes liées au cours */}
        <div>
          <h2 className="text-xl font-semibold mb-2">7. Contraintes du cours</h2>
          <p><strong>Créneaux horaires autorisés:</strong> {course.allowedTimeSlots?.join(', ') || 'Aucun'}</p>
          <p><strong>Créneaux horaires interdits:</strong> {course.forbiddenTimeSlots?.join(', ') || 'Aucun'}</p>
          <p><strong>Priorité:</strong> {course.priority || 'Normale'}</p>
        </div>

        {/* 8. Statut du cours */}
        <div>
          <h2 className="text-xl font-semibold mb-2">8. Statut du cours</h2>
          <p><strong>Statut:</strong> <span className={`px-2 py-1 rounded-full text-white text-sm ${
            course.status === 'planned' ? 'bg-green-500' :
            course.status === 'pending' ? 'bg-yellow-500' :
            course.status === 'cancelled' ? 'bg-red-500' :
            course.status === 'modified' ? 'bg-purple-500' : 'bg-gray-500'
          }`}>{course.status?.toUpperCase() || 'N/A'}</span></p>
        </div>

        {/* 4. Séances programmées */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">9. Séances programmées</h2>
          {courseEvents.length > 0 ? (
            <ul className="space-y-3">
              {courseEvents.map((event) => {
                const room = rooms.find((r) => r.id === event.roomId)
                const teacher = users.find((u) => u.id === courses.find((c) => c.id === event.courseId)?.responsibleTeacherId)
                return (
                  <li key={event.id} className={`p-3 border rounded-md ${
                    event.isCancelled ? 'bg-gray-100 line-through' :
                    event.hasConflict ? 'bg-red-100' :
                    event.isModified ? 'bg-purple-100' : 'bg-blue-50'
                  }`}>
                    <p className="font-bold">
                      {event.sessionType} - {event.startTime.toLocaleString()} à {event.endTime.toLocaleString()}
                    </p>
                    <p className="text-sm">
                      Salle: {room?.name || 'N/A'} | Enseignant: {teacher?.name || 'N/A'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {event.isCancelled && <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">ANNULÉ</span>}
                      {event.isModified && <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">MODIFIÉ</span>}
                      {event.hasConflict && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">CONFLIT</span>}
                      {event.isRoomOverloaded && <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">SURCHARGÉ</span>}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent Link
                          navigate(`/sessions/${event.id}/edit`);
                        }}
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent Link
                          confirmDeleteSession(event.id); // Use custom confirmation
                        }}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-gray-600">Aucune séance programmée pour ce cours.</p>
          )}
        </div>
      </div>

      {/* Course Delete Confirmation Modal */}
      {showDeleteCourseModal && (
        <ConfirmationModal
          message={`Êtes-vous sûr de vouloir supprimer le cours "${course.name}" ? Cette action est irréversible et supprimera également toutes les séances associées.`}
          onConfirm={executeDeleteCourse}
          onCancel={() => setShowDeleteCourseModal(false)}
        />
      )}

      {/* Session Delete Confirmation Modal */}
      {showDeleteSessionModal && (
        <ConfirmationModal
          message="Êtes-vous sûr de vouloir supprimer cette séance ? Cette action est irréversible."
          onConfirm={executeDeleteSession}
          onCancel={() => setShowDeleteSessionModal(false)}
        />
      )}
    </div>
  )
}

export default CourseDetailPage

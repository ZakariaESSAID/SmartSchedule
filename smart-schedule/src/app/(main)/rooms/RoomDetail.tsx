'use client'

import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '@/components/DataContext' // Import useData hook
import TimetableGrid from '@/components/TimetableGrid'
import SessionDetailModal from '@/components/SessionDetailModal'
import ConfirmationModal from '@/components/ConfirmationModal' // Import ConfirmationModal
import { ScheduleEvent } from '@/types'

const RoomDetailPage = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { rooms, courses, users, deleteRoom } = useData() // Use data from context
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [showDeleteRoomModal, setShowDeleteRoomModal] = useState(false)

  const room = useMemo(() => {
    return rooms.find((r) => r.id === roomId)
  }, [roomId, rooms])

  if (!room) {
    return (
      <div className="p-4 text-red-500">
        Salle non trouvée. <button onClick={() => navigate(-1)}>Retour</button>
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

  const confirmDeleteRoom = () => {
    setShowDeleteRoomModal(true)
  }

  const executeDeleteRoom = () => {
    deleteRoom(room.id)
    setShowDeleteRoomModal(false)
    navigate('/rooms')
  }

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
        &larr; Retour aux salles
      </button>
      <h1 className="text-3xl font-bold mb-6">Salle: {room.name}</h1>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => navigate(`/rooms/${room.id}/edit`)} // Navigate to edit form
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Modifier la salle
        </button>
        <button
          onClick={confirmDeleteRoom} // Use custom confirmation
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Supprimer la salle
        </button>
        <button
          onClick={() => navigate(`/rooms/${room.id}/sessions/new`)} // Navigate to add new session for this room
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Affecter un cours
        </button>
        <button
          onClick={() => navigate(`/rooms/${room.id}/edit`)} // Navigate to edit form for equipment/availabilities
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          Gérer équipements et disponibilités
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-6">
        {/* 1. Informations générales */}
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Informations générales</h2>
          <p><strong>Nom / Code:</strong> {room.name}</p>
          <p><strong>Type:</strong> {room.type || 'N/A'}</p>
          <p><strong>Capacité:</strong> {room.capacity}</p>
          <p><strong>Campus:</strong> {room.campus || 'N/A'}</p>
          <p><strong>Bâtiment:</strong> {room.building || 'N/A'}</p>
          <p><strong>Étage:</strong> {room.floor || 'N/A'}</p>
        </div>

        {/* 2. Équipements disponibles */}
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Équipements disponibles</h2>
          <p><strong>Vidéoprojecteur:</strong> {room.hasProjector ? 'Oui' : 'Non'}</p>
          <p><strong>Ordinateurs:</strong> {room.hasComputers ? 'Oui' : 'Non'}</p>
          <p><strong>Tableau interactif:</strong> {room.hasInteractiveBoard ? 'Oui' : 'Non'}</p>
          <p><strong>Connexion Internet:</strong> {room.hasInternet ? 'Oui' : 'Non'}</p>
          {room.specificEquipment && room.specificEquipment.length > 0 && (
            <p><strong>Matériel spécifique:</strong> {room.specificEquipment.join(', ')}</p>
          )}
        </div>

        {/* 3. Disponibilité des salles */}
        <div>
          <h2 className="text-xl font-semibold mb-2">3. Disponibilité de la salle</h2>
          <p><strong>Créneaux horaires disponibles:</strong> {room.availableTimeSlots?.join(', ') || 'Tous'}</p>
          <p><strong>Créneaux horaires réservés:</strong> {room.reservedTimeSlots?.join(', ') || 'Aucun'}</p>
          {room.unavailablePeriods && room.unavailablePeriods.length > 0 && (
            <div>
              <strong>Indisponibilités:</strong>
              <ul className="list-disc list-inside ml-4">
                {room.unavailablePeriods.map((period, index) => (
                  <li key={index}>
                    Du {period.start.toLocaleDateString()} au {period.end.toLocaleDateString()} ({period.reason})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 6. Statut de la salle */}
        <div>
          <h2 className="text-xl font-semibold mb-2">6. Statut de la salle</h2>
          <p>
            <strong>Statut:</strong>{' '}
            <span
              className={`px-2 py-1 rounded-full text-white text-sm ${
                room.status === 'available'
                  ? 'bg-green-500'
                  : room.status === 'occupied'
                    ? 'bg-yellow-500'
                    : room.status === 'maintenance'
                          ? 'bg-orange-500'
                          : 'bg-red-500'
              }`}
            >
              {room.status === 'available' ? 'DISPONIBLE' :
               room.status === 'occupied' ? 'OCCUPÉE' :
               room.status === 'maintenance' ? 'EN MAINTENANCE' :
               room.status === 'out-of-service' ? 'HORS SERVICE' : 'N/A'}
            </span>
          </p>
        </div>
      </div>

      {/* 5. Emploi du temps des salles (affichage) */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Emploi du temps de la salle (vue hebdomadaire)</h2>
        <TimetableGrid
          viewMode="week"
          viewType="room"
          selectedId={room.id}
          selectedDay={0} // Default to Monday for weekly view
          campusFilter=""
          filiereFilter=""
          niveauFilter=""
          searchQuery=""
          academicYearFilter="" // Assuming no academic year filter for room's personal view
          semesterFilter="" // Assuming no semester filter for room's personal view
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

      {/* Room Delete Confirmation Modal */}
      {showDeleteRoomModal && (
        <ConfirmationModal
          message={`Êtes-vous sûr de vouloir supprimer la salle "${room.name}" ? Cette action est irréversible et supprimera toutes les séances qui y sont associées.`}
          onConfirm={executeDeleteRoom}
          onCancel={() => setShowDeleteRoomModal(false)}
        />
      )}
    </div>
  )
}

export default RoomDetailPage

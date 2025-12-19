import React, { useState, useEffect, useMemo } from 'react'
import { Room } from '@/types'
import { useData } from './DataContext'
import { useNavigate } from 'react-router-dom'

interface RoomFormProps {
  initialRoom?: Room // Optional, for editing existing rooms
}

const RoomForm: React.FC<RoomFormProps> = ({ initialRoom }) => {
  const { rooms, addRoom, updateRoom } = useData()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<Room>(
    initialRoom || {
      id: '', // Will be generated for new rooms
      name: '',
      capacity: 0,
      campus: '',
      type: 'td',
      building: '',
      floor: '',
      hasProjector: false,
      hasComputers: false,
      hasInteractiveBoard: false,
      hasInternet: false,
      specificEquipment: [],
      availableTimeSlots: [],
      reservedTimeSlots: [],
      unavailablePeriods: [],
      status: 'available',
    },
  )

  useEffect(() => {
    if (initialRoom) {
      setFormData(initialRoom)
    }
  }, [initialRoom])

  const uniqueCampuses = useMemo(() => {
    const campuses = new Set(rooms.map((r) => r.campus).filter(Boolean) as string[])
    return Array.from(campuses)
  }, [rooms])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement // Cast to HTMLInputElement

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }))
    } else if (name === 'specificEquipment' || name === 'availableTimeSlots' || name === 'reservedTimeSlots') {
      setFormData((prev) => ({ ...prev, [name]: value.split(',').map(item => item.trim()) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialRoom) {
      updateRoom(formData)
    } else {
      addRoom(formData)
    }
    navigate('/rooms') // Redirect to rooms list after submission
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {initialRoom ? 'Modifier la salle' : 'Ajouter une nouvelle salle'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom / Code de la salle</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacité</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type de salle</label>
            <select
              name="type"
              value={formData.type || 'td'}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="amphi">Amphi</option>
              <option value="td">TD</option>
              <option value="labo">Labo</option>
              <option value="meeting">Réunion</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Campus</label>
            <select
              name="campus"
              value={formData.campus || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner un campus</option>
              {uniqueCampuses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bâtiment</label>
            <input
              type="text"
              name="building"
              value={formData.building || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Étage</label>
            <input
              type="text"
              name="floor"
              value={formData.floor || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Equipment */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-2">Équipements</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasProjector"
              checked={formData.hasProjector || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="hasProjector" className="ml-2 block text-sm text-gray-900">Vidéoprojecteur</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasComputers"
              checked={formData.hasComputers || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="hasComputers" className="ml-2 block text-sm text-gray-900">Ordinateurs</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasInteractiveBoard"
              checked={formData.hasInteractiveBoard || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="hasInteractiveBoard" className="ml-2 block text-sm text-gray-900">Tableau interactif</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasInternet"
              checked={formData.hasInternet || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="hasInternet" className="ml-2 block text-sm text-gray-900">Connexion Internet</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Matériel spécifique (séparés par des virgules)</label>
            <input
              type="text"
              name="specificEquipment"
              value={formData.specificEquipment?.join(', ') || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ex: Microscopes, Imprimantes 3D"
            />
          </div>
        </div>

        {/* Availability & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Créneaux horaires disponibles (séparés par des virgules)</label>
            <input
              type="text"
              name="availableTimeSlots"
              value={formData.availableTimeSlots?.join(', ') || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ex: LundiMatin, MardiAprès-midi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Créneaux horaires réservés (séparés par des virgules)</label>
            <input
              type="text"
              name="reservedTimeSlots"
              value={formData.reservedTimeSlots?.join(', ') || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ex: MercrediMatin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Statut de la salle</label>
            <select
              name="status"
              value={formData.status || 'available'}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="available">Disponible</option>
              <option value="occupied">Occupée</option>
              <option value="maintenance">En maintenance</option>
              <option value="out-of-service">Hors service</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/rooms')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {initialRoom ? 'Mettre à jour la salle' : 'Ajouter la salle'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RoomForm

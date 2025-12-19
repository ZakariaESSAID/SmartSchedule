import React, { useState, useEffect, useMemo } from 'react'
import { User } from '@/types'
import { useData } from './DataContext'
import { useNavigate } from 'react-router-dom'

interface TeacherFormProps {
  initialTeacher?: User // Optional, for editing existing teachers
}

const TeacherForm: React.FC<TeacherFormProps> = ({ initialTeacher }) => {
  const { addTeacher, updateTeacher, users } = useData()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<User>(
    initialTeacher || {
      id: '', // Will be generated for new teachers
      name: '',
      role: 'teacher',
      email: '',
      password: '', // In a real app, password would be handled separately/securely
      matricule: '',
      phone: '',
      specialty: '',
      department: '',
      campusAffection: '',
      teacherStatus: 'permanent',
      isModuleResponsible: false,
      availableDays: [],
      availableTimeSlots: [],
      unavailableTimeSlots: [],
      preferredTimeSlots: [],
      weeklyHours: 0,
      maxWeeklyHours: 0,
      nonWorkingDays: [],
    },
  )

  useEffect(() => {
    if (initialTeacher) {
      setFormData(initialTeacher)
    }
  }, [initialTeacher])

  const uniqueDepartments = useMemo(() => {
    const departments = new Set(users.filter(u => u.role === 'teacher').map((t) => t.department).filter(Boolean) as string[])
    return Array.from(departments)
  }, [users])

  const uniqueCampuses = useMemo(() => {
    const campuses = new Set(users.filter(u => u.role === 'teacher').map((t) => t.campusAffection).filter(Boolean) as string[])
    return Array.from(campuses)
  }, [users])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement; // Cast to HTMLInputElement

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (name === 'availableDays' || name === 'availableTimeSlots' || name === 'unavailableTimeSlots' || name === 'preferredTimeSlots' || name === 'nonWorkingDays') {
      setFormData((prev) => ({ ...prev, [name]: value.split(',').map(item => item.trim()) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialTeacher) {
      updateTeacher(formData)
    } else {
      addTeacher(formData)
    }
    navigate('/teachers') // Redirect to teachers list after submission
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {initialTeacher ? 'Modifier l\'enseignant' : 'Ajouter un nouvel enseignant'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom complet</label>
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
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Matricule / Identifiant</label>
            <input
              type="text"
              name="matricule"
              value={formData.matricule || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Spécialité</label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Département</label>
            <select
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Sélectionner un département</option>
              {uniqueDepartments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Campus d'affectation</label>
            <select
              name="campusAffection"
              value={formData.campusAffection || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Sélectionner un campus</option>
              {uniqueCampuses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status and Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select
              name="teacherStatus"
              value={formData.teacherStatus || 'permanent'}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="permanent">Permanent</option>
              <option value="vacataire">Vacataire</option>
            </select>
          </div>
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              name="isModuleResponsible"
              checked={formData.isModuleResponsible || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="isModuleResponsible" className="ml-2 block text-sm text-gray-900">
              Responsable de module
            </label>
          </div>
        </div>

        {/* Availabilities */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Disponibilités</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Jours disponibles (séparés par des virgules)</label>
              <input
                type="text"
                name="availableDays"
                value={formData.availableDays?.join(', ') || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ex: Lundi, Mardi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Créneaux horaires disponibles (séparés par des virgules)</label>
              <input
                type="text"
                name="availableTimeSlots"
                value={formData.availableTimeSlots?.join(', ') || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ex: Matin, Après-midi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Créneaux horaires indisponibles (séparés par des virgules)</label>
              <input
                type="text"
                name="unavailableTimeSlots"
                value={formData.unavailableTimeSlots?.join(', ') || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ex: MardiMatin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Préférences horaires (séparés par des virgules)</label>
              <input
                type="text"
                name="preferredTimeSlots"
                value={formData.preferredTimeSlots?.join(', ') || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ex: LundiMatin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jours non travaillés (séparés par des virgules)</label>
              <input
                type="text"
                name="nonWorkingDays"
                value={formData.nonWorkingDays?.join(', ') || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ex: Vendredi"
              />
            </div>
          </div>
        </div>

        {/* Pedagogical Load */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Charge pédagogique</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Heures hebdomadaires</label>
              <input
                type="number"
                name="weeklyHours"
                value={formData.weeklyHours || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Heures hebdomadaires maximales</label>
              <input
                type="number"
                name="maxWeeklyHours"
                value={formData.maxWeeklyHours || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/teachers')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {initialTeacher ? 'Mettre à jour l\'enseignant' : 'Ajouter l\'enseignant'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TeacherForm

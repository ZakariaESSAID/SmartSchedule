import React, { useState, useEffect, useMemo } from 'react'
import { Course } from '@/types'
import { useData } from './DataContext' // Import useData hook
import { useNavigate } from 'react-router-dom'

interface CourseFormProps {
  initialCourse?: Course // Optional, for editing existing courses
}

const CourseForm: React.FC<CourseFormProps> = ({ initialCourse }) => {
  const { users, addCourse, updateCourse, courses } = useData() // Use courses from context
  const navigate = useNavigate()

  const [formData, setFormData] = useState<Course>(
    initialCourse || {
      id: '', // Will be generated for new courses
      name: '',
      code: '',
      responsibleTeacherId: '',
      filiere: '',
      niveau: '',
      campus: '',
      semester: '',
      description: '',
      totalHours: 0,
      cmHours: 0,
      tdHours: 0,
      tpHours: 0,
      sessionDurationMinutes: 0,
      frequency: 'weekly',
      groupsAffected: [],
      groupCapacity: 0,
      allowedTimeSlots: [],
      forbiddenTimeSlots: [],
      requiredCampus: '',
      priority: 'normal',
      status: 'planned',
    },
  )

  useEffect(() => {
    if (initialCourse) {
      setFormData(initialCourse)
    }
  }, [initialCourse])

  const teachers = useMemo(() => users.filter((u) => u.role === 'teacher'), [users])
  const uniqueFilieres = useMemo(() => {
    const filieres = new Set(courses.map((c) => c.filiere).filter(Boolean) as string[])
    return Array.from(filieres)
  }, [courses])
  const uniqueNiveaux = useMemo(() => {
    const niveaux = new Set(courses.map((c) => c.niveau).filter(Boolean) as string[])
    return Array.from(niveaux)
  }, [courses])
  const uniqueCampuses = useMemo(() => {
    const campuses = new Set(courses.map((c) => c.campus).filter(Boolean) as string[])
    return Array.from(campuses)
  }, [courses])
  const uniqueSemesters = useMemo(() => {
    const semesters = new Set(courses.map((c) => c.semester).filter(Boolean) as string[])
    return Array.from(semesters)
  }, [courses])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target
    if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }))
    } else if (name === 'groupsAffected' || name === 'allowedTimeSlots' || name === 'forbiddenTimeSlots') {
      setFormData((prev) => ({ ...prev, [name]: value.split(',').map(item => item.trim()) }))
    }
    else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialCourse) {
      updateCourse(formData)
    } else {
      addCourse(formData)
    }
    navigate('/courses') // Redirect to courses list after submission
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {initialCourse ? 'Modifier le cours' : 'Ajouter un nouveau cours'} {/* Translated */}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom du cours {/* Translated */}
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Code du cours {/* Translated */}
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Filière
            </label>
            <select
              name="filiere"
              value={formData.filiere}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner la filière</option> {/* Translated */}
              {uniqueFilieres.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Niveau
            </label>
            <select
              name="niveau"
              value={formData.niveau}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner le niveau</option> {/* Translated */}
              {uniqueNiveaux.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Semestre {/* Translated */}
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner le semestre</option> {/* Translated */}
              {uniqueSemesters.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Campus
            </label>
            <select
              name="campus"
              value={formData.campus}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner le campus</option> {/* Translated */}
              {uniqueCampuses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Teaching Staff */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enseignant responsable {/* Translated */}
          </label>
          <select
            name="responsibleTeacherId"
            value={formData.responsibleTeacherId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Sélectionner un enseignant</option> {/* Translated */}
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hours & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Heures totales {/* Translated */}
            </label>
            <input
              type="number"
              name="totalHours"
              value={formData.totalHours || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Heures CM {/* Translated */}
            </label>
            <input
              type="number"
              name="cmHours"
              value={formData.cmHours || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Heures TD {/* Translated */}
            </label>
            <input
              type="number"
              name="tdHours"
              value={formData.tdHours || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Heures TP {/* Translated */}
            </label>
            <input
              type="number"
              name="tpHours"
              value={formData.tpHours || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Durée de la séance (minutes) {/* Translated */}
            </label>
            <input
              type="number"
              name="sessionDurationMinutes"
              value={formData.sessionDurationMinutes || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fréquence {/* Translated */}
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="weekly">Hebdomadaire</option> {/* Translated */}
              <option value="bi-weekly">Bi-hebdomadaire</option> {/* Translated */}
              <option value="monthly">Mensuelle</option> {/* Translated */}
              <option value="ad-hoc">Ponctuelle</option> {/* Translated */}
            </select>
          </div>
        </div>

        {/* Groups & Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Groupes affectés (séparés par des virgules) {/* Translated */}
            </label>
            <input
              type="text"
              name="groupsAffected"
              value={formData.groupsAffected?.join(', ') || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Capacité par groupe {/* Translated */}
            </label>
            <input
              type="number"
              name="groupCapacity"
              value={formData.groupCapacity || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Constraints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Créneaux horaires autorisés (séparés par des virgules) {/* Translated */}
            </label>
            <input
              type="text"
              name="allowedTimeSlots"
              value={formData.allowedTimeSlots?.join(', ') || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Créneaux horaires interdits (séparés par des virgules) {/* Translated */}
            </label>
            <input
              type="text"
              name="forbiddenTimeSlots"
              value={formData.forbiddenTimeSlots?.join(', ') || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Campus requis {/* Translated */}
            </label>
            <select
              name="requiredCampus"
              value={formData.requiredCampus}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">N'importe quel campus</option> {/* Translated */}
              {uniqueCampuses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Priorité {/* Translated */}
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="high">Élevée</option> {/* Translated */}
              <option value="normal">Normale</option> {/* Translated */}
              <option value="low">Faible</option> {/* Translated */}
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Statut {/* Translated */}
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="planned">Planifié</option> {/* Translated */}
            <option value="pending">En attente</option> {/* Translated */}
            <option value="cancelled">Annulé</option> {/* Translated */}
            <option value="modified">Modifié</option> {/* Translated */}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Annuler {/* Translated */}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {initialCourse ? 'Mettre à jour le cours' : 'Ajouter le cours'} {/* Translated */}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CourseForm

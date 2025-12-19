import React, { useState, useEffect, useMemo } from 'react'
import { User } from '@/types'
import { useData } from './DataContext'
import { useNavigate } from 'react-router-dom'

interface StudentFormProps {
  initialStudent?: User // Optional, for editing existing students
}

const StudentForm: React.FC<StudentFormProps> = ({ initialStudent }) => {
  const { addStudent, updateStudent, users, courses } = useData()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<User>(
    initialStudent || {
      id: '', // Will be generated for new students
      name: '',
      role: 'student',
      email: '',
      password: '', // In a real app, password would be handled separately/securely
      studentIdNumber: '',
      studentFiliere: '',
      studentNiveau: '',
      studentGroup: '',
      studentCampus: '',
      academicStatus: 'enrolled',
      academicYear: '',
    },
  )

  useEffect(() => {
    if (initialStudent) {
      setFormData(initialStudent)
    }
  }, [initialStudent])

  const uniqueFilieres = useMemo(() => {
    const filieres = new Set(courses.map((c) => c.filiere).filter(Boolean) as string[])
    return Array.from(filieres)
  }, [courses])

  const uniqueNiveaux = useMemo(() => {
    const niveaux = new Set(courses.map((c) => c.niveau).filter(Boolean) as string[])
    return Array.from(niveaux)
  }, [courses])

  const uniqueGroups = useMemo(() => {
    const groups = new Set(users.filter(u => u.role === 'student').map((s) => s.studentGroup).filter(Boolean) as string[])
    return Array.from(groups)
  }, [users])

  const uniqueCampuses = useMemo(() => {
    const campuses = new Set(users.filter(u => u.role === 'student').map((s) => s.studentCampus).filter(Boolean) as string[])
    return Array.from(campuses)
  }, [users])

  const uniqueAcademicYears = useMemo(() => {
    const years = new Set(users.filter(u => u.role === 'student').map((s) => s.academicYear).filter(Boolean) as string[])
    return Array.from(years)
  }, [users])


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement; // Cast to HTMLInputElement
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialStudent) {
      updateStudent(formData)
    } else {
      addStudent(formData)
    }
    navigate('/students') // Redirect to students list after submission
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {initialStudent ? 'Modifier l\'étudiant' : 'Ajouter un nouvel étudiant'}
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
            <label className="block text-sm font-medium text-gray-700">Numéro étudiant / Matricule</label>
            <input
              type="text"
              name="studentIdNumber"
              value={formData.studentIdNumber || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Filière</label>
            <select
              name="studentFiliere"
              value={formData.studentFiliere || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner la filière</option>
              {uniqueFilieres.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Niveau / Semestre</label>
            <select
              name="studentNiveau"
              value={formData.studentNiveau || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner le niveau</option>
              {uniqueNiveaux.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Groupe / Section</label>
            <select
              name="studentGroup"
              value={formData.studentGroup || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner un groupe</option>
              {uniqueGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Campus</label>
            <select
              name="studentCampus"
              value={formData.studentCampus || ''}
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
        </div>

        {/* Academic Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Statut académique</label>
            <select
              name="academicStatus"
              value={formData.academicStatus || 'enrolled'}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="enrolled">Inscrit</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Année universitaire</label>
            <select
              name="academicYear"
              value={formData.academicYear || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner l'année</option>
              {uniqueAcademicYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/students')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {initialStudent ? 'Mettre à jour l\'étudiant' : 'Ajouter l\'étudiant'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StudentForm

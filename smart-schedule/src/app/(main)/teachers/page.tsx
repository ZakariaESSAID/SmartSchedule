'use client'

import { useState, useEffect, useMemo } from 'react'
import { User } from '@/types'
import { useNavigate } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

const TeacherFormModal = ({ teacher, onClose, onSave }) => {
  const [formData, setFormData] = useState(teacher || {
    name: '', email: '', matricule: '', specialty: '', department: '',
    teacherStatus: 'PERMANENT', isModuleResponsible: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Ajouter un Enseignant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom complet" className="w-full p-2 border rounded" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
          <input name="matricule" value={formData.matricule} onChange={handleChange} placeholder="Matricule" className="w-full p-2 border rounded" />
          <input name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Spécialité" className="w-full p-2 border rounded" />
          <input name="department" value={formData.department} onChange={handleChange} placeholder="Département" className="w-full p-2 border rounded" />
          <select name="teacherStatus" value={formData.teacherStatus} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="PERMANENT">Permanent</option>
            <option value="VACATAIRE">Vacataire</option>
          </select>
          <div className="flex items-center">
            <input type="checkbox" id="isModuleResponsible" name="isModuleResponsible" checked={formData.isModuleResponsible} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="isModuleResponsible" className="ml-2 block text-sm text-gray-900">Responsable de module</label>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const API_URL = 'http://localhost:8080/api/teachers';

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) throw new Error('Failed to fetch teachers.');
      
      const data = await response.json();
      setTeachers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [navigate]);

  const handleSave = async (teacherData) => {
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(teacherData),
      });

      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || `Failed to create teacher.`);
      }
      
      await fetchTeachers();
      setIsFormModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return teachers.slice(startIndex, startIndex + itemsPerPage);
  }, [teachers, currentPage]);

  const totalPages = Math.ceil(teachers.length / itemsPerPage);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Enseignants</h1>
        <button 
          onClick={() => setIsFormModalOpen(true)} 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Ajouter un Enseignant
        </button>
      </div>

      {isFormModalOpen && (
        <TeacherFormModal
          teacher={null}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSave}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spécialité</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedTeachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 whitespace-nowrap">{teacher.name}</td>
                <td className="py-4 px-6 whitespace-nowrap">{teacher.email}</td>
                <td className="py-4 px-6 whitespace-nowrap">{teacher.matricule || 'N/A'}</td>
                <td className="py-4 px-6 whitespace-nowrap">{teacher.specialty || 'N/A'}</td>
                <td className="py-4 px-6 whitespace-nowrap">{teacher.teacherStatus || 'N/A'}</td>
                <td className="py-4 px-6 text-center whitespace-nowrap">
                  <button onClick={() => navigate(`/teachers/${teacher.id}`)} className="text-blue-600 hover:text-blue-800 font-semibold">
                    Voir les détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <button 
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-white border rounded-md disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="mx-4">Page {currentPage} sur {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-white border rounded-md disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}

export default TeachersPage;

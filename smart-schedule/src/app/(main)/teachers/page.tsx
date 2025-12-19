'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const decoded: { roles: string[] } = jwtDecode(token);
        setIsAdmin(decoded.roles.includes('ROLE_ADMIN'));
      } catch (e) {
        setIsAdmin(false);
      }
    }
  }, []);
  return isAdmin;
};

const TeacherFormModal = ({ teacher, onClose, onSave, campuses, departements }) => { // Ajout de campuses et departements en prop
  const [formData, setFormData] = useState(teacher || {
    name: '', email: '', matricule: '', specialty: '', departmentId: '', campusAffectionId: '',
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
      <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{teacher ? 'Modifier' : 'Ajouter'} un Enseignant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom complet" className="w-full p-2 border rounded" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
          <input name="matricule" value={formData.matricule} onChange={handleChange} placeholder="Matricule" className="w-full p-2 border rounded" />
          <input name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Spécialité" className="w-full p-2 border rounded" />
          
          <select name="departmentId" value={formData.departmentId || ''} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">-- Sélectionner un Département --</option>
            {departements.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          <select name="campusAffectionId" value={formData.campusAffectionId || ''} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">-- Sélectionner un Campus --</option>
            {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select name="teacherStatus" value={formData.teacherStatus} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="PERMANENT">Permanent</option>
            <option value="VACATAIRE">Vacataire</option>
          </select>
          <div className="flex items-center">
            <input type="checkbox" id="isModuleResponsible" name="isModuleResponsible" checked={formData.isModuleResponsible} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="isModuleResponsible" className="ml-2 block text-sm text-gray-900">Responsable de module</label>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmDeleteModal = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer cet enseignant ?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Supprimer</button>
        </div>
      </div>
    </div>
);

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<User[]>([])
  const [campuses, setCampuses] = useState<{ id: string, name: string }[]>([]);
  const [departements, setDepartements] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const API_BASE_URL = 'http://localhost:8080/api';

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const [teachersRes, campusesRes, departementsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/teachers`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/campuses`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/departements`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      if (teachersRes.status === 401 || campusesRes.status === 401 || departementsRes.status === 401) { navigate('/auth/login'); return; }
      if (!teachersRes.ok) throw new Error('Failed to fetch teachers.');
      if (!campusesRes.ok) throw new Error('Failed to fetch campuses.');
      if (!departementsRes.ok) throw new Error('Failed to fetch departements.');
      
      const teachersData = await teachersRes.json();
      const campusesData = await campusesRes.json();
      const departementsData = await departementsRes.json();

      setTeachers(teachersData);
      setCampuses(campusesData);
      setDepartements(departementsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleSave = async (teacherData) => {
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const isUpdating = selectedTeacher !== null;
      const url = isUpdating ? `${API_BASE_URL}/teachers/${teacherData.id}` : `${API_BASE_URL}/teachers`;
      const method = isUpdating ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(teacherData),
      });

      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || `Failed to ${isUpdating ? 'update' : 'create'} teacher.`);
      }
      
      await fetchData();
      setIsFormModalOpen(false);
      setSelectedTeacher(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (teacherId: string) => {
    setTeacherToDelete(teacherId);
    setIsConfirmModalOpen(true);
  };

  const executeDelete = async () => {
    if (!teacherToDelete) return;
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch(`${API_BASE_URL}/teachers/${teacherToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) throw new Error('Failed to delete teacher.');
      
      await fetchData();
      setIsConfirmModalOpen(false);
      setTeacherToDelete(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des Enseignants</h1>
        {isAdmin && (
          <button onClick={() => { setSelectedTeacher(null); setIsFormModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Ajouter un Enseignant
          </button>
        )}
      </div>

      {isFormModalOpen && (
        <TeacherFormModal
          teacher={selectedTeacher}
          onClose={() => { setIsFormModalOpen(false); setSelectedTeacher(null); }}
          onSave={handleSave}
          campuses={campuses}
          departements={departements}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmDeleteModal
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={executeDelete}
        />
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left">Nom</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Matricule</th>
              <th className="py-3 px-6 text-left">Spécialité</th>
              <th className="py-3 px-6 text-left">Département</th>
              <th className="py-3 px-6 text-left">Campus</th>
              <th className="py-3 px-6 text-left">Statut</th>
              {isAdmin && <th className="py-3 px-6 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{teacher.name}</td>
                <td className="py-4 px-6">{teacher.email}</td>
                <td className="py-4 px-6">{teacher.matricule || 'N/A'}</td>
                <td className="py-4 px-6">{teacher.specialty || 'N/A'}</td>
                <td className="py-4 px-6">{teacher.departmentName || 'N/A'}</td>
                <td className="py-4 px-6">{teacher.campusAffectionName || 'N/A'}</td>
                <td className="py-4 px-6">{teacher.teacherStatus || 'N/A'}</td>
                {isAdmin && (
                  <td className="py-4 px-6 text-center space-x-2">
                    <button onClick={() => { setSelectedTeacher(teacher); setIsFormModalOpen(true); }} className="text-blue-600 hover:text-blue-800">Modifier</button>
                    <button onClick={() => handleDeleteClick(teacher.id)} className="text-red-600 hover:text-red-800">Supprimer</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TeachersPage;

'use client'

import { useState, useEffect } from 'react'
import { Course, User } from '@/types'
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

const CourseFormModal = ({ course, onClose, onSave, teachers, campuses, filieres, niveaux }) => { // Ajout de campuses, filieres, niveaux en prop
  const [formData, setFormData] = useState(course || {
    name: '', code: '', filiereId: '', niveauId: '', campusId: '',
    totalHours: 0, cmHours: 0, tdHours: 0, tpHours: 0,
    sessionDurationMinutes: 120, frequency: 'WEEKLY',
    groupsAffected: '', groupCapacity: 0,
    allowedTimeSlots: '', forbiddenTimeSlots: '',
    requiredCampus: '', priority: 'NORMAL', status: 'PLANNED',
    semester: '', description: '',
    responsibleTeacherId: null,
    associatedTeacherIds: [],
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{course ? 'Modifier le Cours' : 'Ajouter un Cours'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Colonne 1 */}
          <div className="space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom du cours" className="w-full p-2 border rounded" required />
            <input name="code" value={formData.code} onChange={handleChange} placeholder="Code du cours" className="w-full p-2 border rounded" required />
            
            <select name="filiereId" value={formData.filiereId || ''} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Sélectionner une Filière --</option>
              {filieres.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>

            <select name="niveauId" value={formData.niveauId || ''} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Sélectionner un Niveau --</option>
              {niveaux.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>

            <input name="semester" value={formData.semester} onChange={handleChange} placeholder="Semestre" className="w-full p-2 border rounded" />
            
            <select name="campusId" value={formData.campusId || ''} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Sélectionner un Campus --</option>
              {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
            <select name="responsibleTeacherId" value={formData.responsibleTeacherId || ''} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Sélectionner un responsable --</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          {/* Colonne 2 */}
          <div className="space-y-4">
            <input type="number" name="totalHours" value={formData.totalHours} onChange={handleChange} placeholder="Heures totales" className="w-full p-2 border rounded" />
            <input type="number" name="cmHours" value={formData.cmHours} onChange={handleChange} placeholder="Heures CM" className="w-full p-2 border rounded" />
            <input type="number" name="tdHours" value={formData.tdHours} onChange={handleChange} placeholder="Heures TD" className="w-full p-2 border rounded" />
            <input type="number" name="tpHours" value={formData.tpHours} onChange={handleChange} placeholder="Heures TP" className="w-full p-2 border rounded" />
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="HIGH">Haute</option>
              <option value="NORMAL">Normale</option>
              <option value="LOW">Basse</option>
            </select>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="PLANNED">Planifié</option>
              <option value="PENDING">En attente</option>
              <option value="CANCELLED">Annulé</option>
              <option value="MODIFIED">Modifié</option>
            </select>
          </div>
          <div className="col-span-1 md:col-span-2 mt-6 flex justify-end space-x-4">
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
        <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Supprimer</button>
        </div>
      </div>
    </div>
);

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  const [campuses, setCampuses] = useState<{ id: string, name: string }[]>([]);
  const [filieres, setFilieres] = useState<{ id: string, name: string }[]>([]);
  const [niveaux, setNiveaux] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const API_BASE_URL = 'http://localhost:8080/api';

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const [coursesRes, teachersRes, campusesRes, filieresRes, niveauxRes] = await Promise.all([
        fetch(`${API_BASE_URL}/courses`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/teachers`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/campuses`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/filieres`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/niveaux`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      if (coursesRes.status === 401 || teachersRes.status === 401 || campusesRes.status === 401 || filieresRes.status === 401 || niveauxRes.status === 401) { navigate('/auth/login'); return; }
      if (!coursesRes.ok) throw new Error('Failed to fetch courses.');
      if (!teachersRes.ok) throw new Error('Failed to fetch teachers.');
      if (!campusesRes.ok) throw new Error('Failed to fetch campuses.');
      if (!filieresRes.ok) throw new Error('Failed to fetch filieres.');
      if (!niveauxRes.ok) throw new Error('Failed to fetch niveaux.');
      
      const coursesData = await coursesRes.json();
      const teachersData = await teachersRes.json();
      const campusesData = await campusesRes.json();
      const filieresData = await filieresRes.json();
      const niveauxData = await niveauxRes.json();

      setCourses(coursesData);
      setTeachers(teachersData);
      setCampuses(campusesData);
      setFilieres(filieresData);
      setNiveaux(niveauxData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleSave = async (courseData) => {
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const isUpdating = selectedCourse !== null;
      const url = isUpdating ? `${API_BASE_URL}/courses/${courseData.id}` : `${API_BASE_URL}/courses`;
      const method = isUpdating ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(courseData),
      });

      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || `Failed to ${isUpdating ? 'update' : 'create'} course.`);
      }
      
      await fetchData(); // Re-fetch all courses to update the list
      setIsFormModalOpen(false);
      setSelectedCourse(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setIsConfirmModalOpen(true);
  };

  const executeDelete = async () => {
    if (!courseToDelete) return;
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch(`${API_BASE_URL}/courses/${courseToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) throw new Error('Failed to delete course.');
      
      await fetchData();
      setIsConfirmModalOpen(false);
      setCourseToDelete(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des Cours</h1>
        <button onClick={() => { setSelectedCourse(null); setIsFormModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Ajouter un Cours
        </button>
      </div>

      {isFormModalOpen && (
        <CourseFormModal
          course={selectedCourse}
          onClose={() => { setIsFormModalOpen(false); setSelectedCourse(null); }}
          onSave={handleSave}
          teachers={teachers}
          campuses={campuses}
          filieres={filieres}
          niveaux={niveaux}
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
              <th className="py-3 px-6 text-left">Code</th>
              <th className="py-3 px-6 text-left">Responsable</th>
              <th className="py-3 px-6 text-left">Filière</th>
              <th className="py-3 px-6 text-left">Niveau</th>
              <th className="py-3 px-6 text-left">Campus</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{course.name}</td>
                <td className="py-4 px-6">{course.code}</td>
                <td className="py-4 px-6">{course.responsibleTeacherName || 'N/A'}</td>
                <td className="py-4 px-6">{course.filiereName || 'N/A'}</td>
                <td className="py-4 px-6">{course.niveauName || 'N/A'}</td>
                <td className="py-4 px-6">{course.campusName || 'N/A'}</td>
                {isAdmin && (
                  <td className="py-4 px-6 text-center space-x-2">
                    <button onClick={() => { setSelectedCourse(course); setIsFormModalOpen(true); }} className="text-blue-600 hover:text-blue-800">Modifier</button>
                    <button onClick={() => handleDeleteClick(course.id)} className="text-red-600 hover:text-red-800">Supprimer</button>
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

export default CoursesPage;

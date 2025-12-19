'use client'

import { useState, useEffect } from 'react'
import { Course, User } from '@/types'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const decoded: { roles: string[] } = jwtDecode(token);
        setIsAdmin(decoded.roles.includes('ROLE_ADMIN'));
      } catch (e) { setIsAdmin(false); }
    }
  }, []);
  return isAdmin;
};

// --- Formulaire Modal Amélioré ---
const CourseFormModal = ({ course, onClose, onSave, teachers, campuses, filieres, niveaux }) => {
  const [formData, setFormData] = useState(course ? {
    ...course,
    responsibleTeacherId: course.responsibleTeacher?.id || '',
    campusId: course.campus?.id || '',
    filiereId: course.filiere?.id || '',
    niveauId: course.niveau?.id || '',
  } : {
    name: '', code: '', filiereId: '', niveauId: '', campusId: '',
    totalHours: 0, cmHours: 0, tdHours: 0, tpHours: 0,
    priority: 'NORMAL', status: 'PLANNED',
    responsibleTeacherId: null,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{course ? 'Modifier le Cours' : 'Ajouter un Cours'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Section Informations Générales */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Informations Générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom du cours" className="w-full p-2 border rounded-md" required />
              <input name="code" value={formData.code} onChange={handleChange} placeholder="Code du cours" className="w-full p-2 border rounded-md" required />
              <select name="filiereId" value={formData.filiereId} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="">-- Filière --</option>
                {filieres.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <select name="niveauId" value={formData.niveauId} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="">-- Niveau --</option>
                {niveaux.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
              </select>
              <select name="campusId" value={formData.campusId} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="">-- Campus --</option>
                {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select name="responsibleTeacherId" value={formData.responsibleTeacherId || ''} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="">-- Enseignant Responsable --</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          {/* Section Organisation Horaire */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Organisation Horaire</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">CM</span>
                    <input type="number" name="cmHours" value={formData.cmHours} onChange={handleChange} className="w-full p-2 border rounded-md pl-12" />
                </div>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">TD</span>
                    <input type="number" name="tdHours" value={formData.tdHours} onChange={handleChange} className="w-full p-2 border rounded-md pl-12" />
                </div>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">TP</span>
                    <input type="number" name="tpHours" value={formData.tpHours} onChange={handleChange} className="w-full p-2 border rounded-md pl-12" />
                </div>
                <input type="number" name="totalHours" value={formData.totalHours} onChange={handleChange} placeholder="Heures totales" className="w-full p-2 border rounded-md" />
            </div>
          </div>

          {/* Section Contraintes & Statut */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Contraintes & Statut</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="HIGH">Haute</option>
                <option value="NORMAL">Normale</option>
                <option value="LOW">Basse</option>
              </select>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="PLANNED">Planifié</option>
                <option value="PENDING">En attente</option>
                <option value="CANCELLED">Annulé</option>
                <option value="MODIFIED">Modifié</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annuler</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmDeleteModal = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer ce cours ?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annuler</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Supprimer</button>
        </div>
      </div>
    </div>
);

const StatusBadge = ({ status }) => {
  const statusStyles = {
    PLANNED: 'bg-blue-100 text-blue-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-red-100 text-red-800',
    MODIFIED: 'bg-purple-100 text-purple-800',
  };
  return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};


const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  const [campuses, setCampuses] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const API_URL = 'http://localhost:8080/api';

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const [coursesRes, teachersRes, campusesRes, filieresRes, niveauxRes] = await Promise.all([
        fetch(`${API_URL}/courses`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/teachers`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/campuses`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/filieres`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/niveaux`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      if (coursesRes.status === 401) { navigate('/auth/login'); return; }
      if (!coursesRes.ok) throw new Error('Failed to fetch courses.');
      
      setCourses(await coursesRes.json());
      setTeachers(await teachersRes.json());
      setCampuses(await campusesRes.json());
      setFilieres(await filieresRes.json());
      setNiveaux(await niveauxRes.json());

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
      const url = isUpdating ? `${API_URL}/courses/${courseData.id}` : `${API_URL}/courses`;
      const method = isUpdating ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(courseData),
      });

      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) throw new Error(`Failed to ${isUpdating ? 'update' : 'create'} course.`);
      
      await fetchData();
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
      await fetch(`${API_URL}/courses/${courseToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      await fetchData();
      setIsConfirmModalOpen(false);
      setCourseToDelete(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Cours</h1>
        {isAdmin && (
          <button onClick={() => { setSelectedCourse(null); setIsFormModalOpen(true); }} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors">
            <FaPlus className="mr-2" />
            Ajouter un Cours
          </button>
        )}
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filière</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              {isAdmin && <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 whitespace-nowrap">{course.name}</td>
                <td className="py-4 px-6 whitespace-nowrap">{course.code}</td>
                <td className="py-4 px-6 whitespace-nowrap">{course.responsibleTeacherName || 'N/A'}</td>
                <td className="py-4 px-6 whitespace-nowrap">{course.filiereName || 'N/A'}</td>
                <td className="py-4 px-6 whitespace-nowrap"><StatusBadge status={course.status} /></td>
                {isAdmin && (
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <button onClick={() => { setSelectedCourse(course); setIsFormModalOpen(true); }} className="text-blue-600 hover:text-blue-800 mr-4"><FaEdit /></button>
                    <button onClick={() => handleDeleteClick(course.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
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

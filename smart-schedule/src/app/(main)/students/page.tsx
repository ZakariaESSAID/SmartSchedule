'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { useNavigate } from 'react-router-dom'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

// --- Composants pour les statistiques ---
interface DashboardStats {
  totalStudents: number;
  enrolledStudents: number;
  suspendedStudents: number;
  detectedConflicts: number;
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-center">
    <div className="text-2xl mr-4">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);
// --- Fin des composants pour les statistiques ---


const StudentFormModal = ({ student, onClose, onSave }) => {
  const [formData, setFormData] = useState(student || {
    name: '', email: '', studentIdNumber: '', studentFiliere: '',
    studentNiveau: '', studentGroup: '', studentCampus: '',
    academicStatus: 'ENROLLED', academicYear: new Date().getFullYear().toString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{student ? 'Modifier' : 'Ajouter'} un Étudiant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom complet" className="w-full p-2 border rounded" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
          {/* Le champ mot de passe est supprimé car il est généré automatiquement */}
          <input name="studentIdNumber" value={formData.studentIdNumber} onChange={handleChange} placeholder="Numéro étudiant" className="w-full p-2 border rounded" />
          <input name="studentFiliere" value={formData.studentFiliere} onChange={handleChange} placeholder="Filière" className="w-full p-2 border rounded" />
          <input name="studentNiveau" value={formData.studentNiveau} onChange={handleChange} placeholder="Niveau" className="w-full p-2 border rounded" />
          <input name="studentGroup" value={formData.studentGroup} onChange={handleChange} placeholder="Groupe" className="w-full p-2 border rounded" />
          <select name="academicStatus" value={formData.academicStatus} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="ENROLLED">Inscrit</option>
            <option value="SUSPENDED">Suspendu</option>
          </select>
          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentsPage = () => {
  const [students, setStudents] = useState<User[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:8080/api';

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const [studentsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/students`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/dashboard/admin`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (studentsRes.status === 401 || statsRes.status === 401) { navigate('/auth/login'); return; }
      if (!studentsRes.ok) throw new Error('Failed to fetch students.');
      if (!statsRes.ok) throw new Error('Failed to fetch stats.');
      
      const studentsData = await studentsRes.json();
      const statsData = await statsRes.json();
      setStudents(studentsData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleSave = async (studentData) => {
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(studentData),
      });

      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || `Failed to create student.`);
      }
      
      await fetchData();
      setIsFormModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Étudiants" value={stats?.totalStudents ?? 0} icon="🧑‍🎓" />
        <StatCard title="Étudiants Inscrits" value={stats?.enrolledStudents ?? 0} icon="✅" />
        <StatCard title="Étudiants Suspendus" value={stats?.suspendedStudents ?? 0} icon="❌" />
        <StatCard title="Conflits Détectés" value={stats?.detectedConflicts ?? 0} icon="🔥" />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des Étudiants</h1>
        <button onClick={() => setIsFormModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Ajouter un Étudiant
        </button>
      </div>

      {isFormModalOpen && (
        <StudentFormModal
          student={null}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSave}
        />
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left">Nom</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Numéro Étudiant</th>
              <th className="py-3 px-6 text-left">Filière</th>
              <th className="py-3 px-6 text-left">Niveau</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{student.name}</td>
                <td className="py-4 px-6">{student.email}</td>
                <td className="py-4 px-6">{student.studentIdNumber || 'N/A'}</td>
                <td className="py-4 px-6">{student.studentFiliere || 'N/A'}</td>
                <td className="py-4 px-6">{student.studentNiveau || 'N/A'}</td>
                <td className="py-4 px-6 text-center">
                  <button 
                    onClick={() => navigate(`/students/${student.id}`)} 
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Voir les détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentsPage;

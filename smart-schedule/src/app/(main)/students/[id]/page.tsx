'use client'

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { User } from '@/types'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

// Le modal de formulaire accepte maintenant les listes pour les menus déroulants
const StudentFormModal = ({ student, onClose, onSave, campuses, filieres, niveaux, groupes }) => {
  const [formData, setFormData] = useState({
    ...student,
    studentCampusId: student?.studentCampus?.id || '',
    studentFiliereId: student?.studentFiliere?.id || '',
    studentNiveauId: student?.studentNiveau?.id || '',
    studentGroupId: student?.studentGroup?.id || '',
  });

  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
        studentCampusId: student?.studentCampus?.id || '',
        studentFiliereId: student?.studentFiliere?.id || '',
        studentNiveauId: student?.studentNiveau?.id || '',
        studentGroupId: student?.studentGroup?.id || '',
      });
    }
  }, [student]);

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
        <h2 className="text-xl font-bold mb-4">Modifier l'Étudiant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Nom complet" className="w-full p-2 border rounded" required />
          <input type="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
          <input name="studentIdNumber" value={formData.studentIdNumber || ''} onChange={handleChange} placeholder="Numéro étudiant" className="w-full p-2 border rounded" />
          
          <select name="studentFiliereId" value={formData.studentFiliereId} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">-- Sélectionner une Filière --</option>
            {filieres.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          
          <select name="studentNiveauId" value={formData.studentNiveauId} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">-- Sélectionner un Niveau --</option>
            {niveaux.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>

          <select name="studentGroupId" value={formData.studentGroupId} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">-- Sélectionner un Groupe --</option>
            {groupes.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>

          <select name="studentCampusId" value={formData.studentCampusId} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">-- Sélectionner un Campus --</option>
            {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select name="academicStatus" value={formData.academicStatus || 'ENROLLED'} onChange={handleChange} className="w-full p-2 border rounded">
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

const ConfirmDeleteModal = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer cet étudiant ?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Supprimer</button>
        </div>
      </div>
    </div>
);


const StudentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // States pour les listes de la structure
  const [campuses, setCampuses] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [groupes, setGroupes] = useState([]);

  const API_URL = 'http://localhost:8080/api';

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const [studentRes, campusesRes, filieresRes, niveauxRes, groupesRes] = await Promise.all([
        fetch(`${API_URL}/students/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/campuses`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/filieres`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/niveaux`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/groupes`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      if (studentRes.status === 401) { navigate('/auth/login'); return; }
      if (!studentRes.ok) throw new Error('Failed to fetch student details.');
      
      const studentData = await studentRes.json();
      setStudent(studentData);
      setCampuses(await campusesRes.json());
      setFilieres(await filieresRes.json());
      setNiveaux(await niveauxRes.json());
      setGroupes(await groupesRes.json());

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  const handleUpdate = async (studentData) => {
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch(`${API_URL}/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) throw new Error('Failed to update student.');
      
      await fetchData();
      setIsFormModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const executeDelete = async () => {
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      await fetch(`${API_URL}/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      setIsConfirmModalOpen(false);
      navigate('/students');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!student) return <div className="p-6">Student not found.</div>;

  return (
    <div className="p-6">
      <button onClick={() => navigate('/students')} className="mb-6 text-blue-600">&larr; Retour à la liste</button>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <p className="text-gray-500">{student.email}</p>
            <p className="mt-1 text-sm">ID: {student.id}</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setIsFormModalOpen(true)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg">Modifier</button>
            <button onClick={() => setIsConfirmModalOpen(true)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Supprimer</button>
          </div>
        </div>

        <div className="mt-6 border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Informations Générales</h3>
            <p><strong>Numéro Étudiant:</strong> {student.studentIdNumber || 'N/A'}</p>
            <p><strong>Filière:</strong> {student.studentFiliereName || 'N/A'}</p>
            <p><strong>Niveau:</strong> {student.studentNiveauName || 'N/A'}</p>
            <p><strong>Groupe:</strong> {student.studentGroupName || 'N/A'}</p>
            <p><strong>Campus:</strong> {student.studentCampusName || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Statut Académique</h3>
            <p><strong>Statut:</strong> {student.academicStatus || 'N/A'}</p>
            <p><strong>Année:</strong> {student.academicYear || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold text-lg mb-2">Actions Rapides</h3>
            <div className="flex space-x-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Consulter l'emploi du temps</button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Affecter à un Groupe/Module</button>
            </div>
        </div>
      </div>

      {isFormModalOpen && (
        <StudentFormModal
          student={student}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleUpdate}
          campuses={campuses}
          filieres={filieres}
          niveaux={niveaux}
          groupes={groupes}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmDeleteModal
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={executeDelete}
        />
      )}
    </div>
  );
};

export default StudentDetailPage;

'use client'

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { User } from '@/types'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

const TeacherDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = getAuthToken();
        if (!token) { navigate('/auth/login'); return; }

        const response = await fetch(`http://localhost:8080/api/teachers/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('Failed to fetch teacher details.');
        
        const data = await response.json();
        setTeacher(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeacher();
    }
  }, [id, navigate]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!teacher) return <div className="p-6">Teacher not found.</div>;

  return (
    <div className="p-6">
      <button onClick={() => navigate('/teachers')} className="mb-6 text-blue-600">&larr; Retour à la liste</button>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{teacher.name}</h1>
            <p className="text-gray-500">{teacher.email}</p>
            <p className="mt-1 text-sm">ID: {teacher.id}</p>
          </div>
          {/* Les boutons Modifier/Supprimer peuvent être ajoutés ici plus tard */}
        </div>

        <div className="mt-6 border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Informations Générales</h3>
            <p><strong>Matricule:</strong> {teacher.matricule || 'N/A'}</p>
            <p><strong>Spécialité:</strong> {teacher.specialty || 'N/A'}</p>
            <p><strong>Département:</strong> {teacher.department || 'N/A'}</p>
            <p><strong>Campus:</strong> {teacher.campusAffectionName || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Statut & Rôle</h3>
            <p><strong>Statut:</strong> {teacher.teacherStatus || 'N/A'}</p>
            <p><strong>Responsable de module:</strong> {teacher.isModuleResponsible ? 'Oui' : 'Non'}</p>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold text-lg mb-2">Actions Rapides</h3>
            <div className="flex space-x-2">
                <button 
                  onClick={() => navigate(`/teachers/${id}/availability`)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Gérer les disponibilités
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailPage;

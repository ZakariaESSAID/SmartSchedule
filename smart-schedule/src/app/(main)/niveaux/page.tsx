'use client'

import { useState, useEffect } from 'react'
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

const NiveauxPage = () => {
  const [niveaux, setNiveaux] = useState<{ id: string, name: string }[]>([]);
  const [newNiveauName, setNewNiveauName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const API_URL = 'http://localhost:8080/api/niveaux';

  const fetchNiveaux = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) throw new Error('Failed to fetch niveaux.');
      
      const data = await response.json();
      setNiveaux(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNiveaux();
  }, [navigate]);

  const handleAddNiveau = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNiveauName.trim()) return;
    try {
      const token = getAuthToken();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newNiveauName }),
      });
      if (!response.ok) throw new Error('Failed to add niveau.');
      
      setNewNiveauName('');
      await fetchNiveaux();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteNiveau = async (niveauId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce niveau ?')) {
      try {
        const token = getAuthToken();
        await fetch(`${API_URL}/${niveauId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        await fetchNiveaux();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des Niveaux</h1>

      {isAdmin && (
        <form onSubmit={handleAddNiveau} className="mb-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Ajouter un nouveau niveau</h2>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              value={newNiveauName} 
              onChange={(e) => setNewNiveauName(e.target.value)} 
              placeholder="Nom du niveau" 
              className="flex-grow p-2 border rounded"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Ajouter</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left">Nom du Niveau</th>
              {isAdmin && <th className="py-3 px-6 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {niveaux.map((niveau) => (
              <tr key={niveau.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{niveau.name}</td>
                {isAdmin && (
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => handleDeleteNiveau(niveau.id)} className="text-red-600 hover:text-red-800">Supprimer</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NiveauxPage;

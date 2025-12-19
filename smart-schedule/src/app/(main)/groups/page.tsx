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

const GroupsPage = () => {
  const [groups, setGroups] = useState<{ id: string, name: string }[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const API_URL = 'http://localhost:8080/api/groups';

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) throw new Error('Failed to fetch groups.');
      
      const data = await response.json();
      setGroups(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [navigate]);

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      const token = getAuthToken();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newGroupName }),
      });
      if (!response.ok) throw new Error('Failed to add group.');
      
      setNewGroupName('');
      await fetchGroups();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) {
      try {
        const token = getAuthToken();
        await fetch(`${API_URL}/${groupId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        await fetchGroups();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des Groupes</h1>

      {isAdmin && (
        <form onSubmit={handleAddGroup} className="mb-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Ajouter un nouveau groupe</h2>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              value={newGroupName} 
              onChange={(e) => setNewGroupName(e.target.value)} 
              placeholder="Nom du groupe" 
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
              <th className="py-3 px-6 text-left">Nom du Groupe</th>
              {isAdmin && <th className="py-3 px-6 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {groups.map((group) => (
              <tr key={group.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{group.name}</td>
                {isAdmin && (
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => handleDeleteGroup(group.id)} className="text-red-600 hover:text-red-800">Supprimer</button>
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

export default GroupsPage;

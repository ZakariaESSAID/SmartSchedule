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

const ConfirmDeleteModal = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer ce campus ?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Supprimer</button>
        </div>
      </div>
    </div>
);

const CampusesPage = () => {
  const [campuses, setCampuses] = useState<{ id: string, name: string }[]>([]);
  const [newCampusName, setNewCampusName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [campusToDelete, setCampusToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const API_URL = 'http://localhost:8080/api/campuses';

  const fetchCampuses = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) throw new Error('Failed to fetch campuses.');
      
      const data = await response.json();
      setCampuses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampuses();
  }, [navigate]);

  const handleAddCampus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampusName.trim()) return;
    try {
      const token = getAuthToken();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newCampusName }),
      });
      if (!response.ok) throw new Error('Failed to add campus.');
      
      setNewCampusName('');
      await fetchCampuses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (campusId: string) => {
    setCampusToDelete(campusId);
    setIsConfirmModalOpen(true);
  };

  const executeDelete = async () => {
    if (!campusToDelete) return;
    try {
      const token = getAuthToken();
      await fetch(`${API_URL}/${campusToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      await fetchCampuses();
      setIsConfirmModalOpen(false);
      setCampusToDelete(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des Campus</h1>

      {isAdmin && (
        <form onSubmit={handleAddCampus} className="mb-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Ajouter un nouveau campus</h2>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              value={newCampusName} 
              onChange={(e) => setNewCampusName(e.target.value)} 
              placeholder="Nom du campus" 
              className="flex-grow p-2 border rounded"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Ajouter</button>
          </div>
        </form>
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
              <th className="py-3 px-6 text-left">Nom du Campus</th>
              {isAdmin && <th className="py-3 px-6 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campuses.map((campus) => (
              <tr key={campus.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{campus.name}</td>
                {isAdmin && (
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => handleDeleteClick(campus.id)} className="text-red-600 hover:text-red-800">Supprimer</button>
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

export default CampusesPage;

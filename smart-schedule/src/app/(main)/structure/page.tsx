'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

// Hook générique pour gérer une ressource (CRUD simple)
const useResource = (resourceName: string) => {
  const [items, setItems] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const API_URL = `http://localhost:8080/api/${resourceName}`;

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) throw new Error(`Failed to fetch ${resourceName}.`);
      
      const data = await response.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const addItem = async (name: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error(`Failed to add ${resourceName}.`);
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteItem = async (id: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) {
      try {
        const token = getAuthToken();
        await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        await fetchData();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return { items, addItem, deleteItem, loading, error };
};

// Composant pour une carte de gestion
const ManagementCard = ({ title, resourceName }) => {
  const { items, addItem, deleteItem, loading, error } = useResource(resourceName);
  const [newItemName, setNewItemName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      addItem(newItemName);
      setNewItemName('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-4">
        <input 
          type="text" 
          value={newItemName} 
          onChange={(e) => setNewItemName(e.target.value)} 
          placeholder={`Nouveau ${title.slice(0, -1)}...`} 
          className="flex-grow p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Ajouter</button>
      </form>
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {items.map(item => (
          <li key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span>{item.name}</span>
            <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-700">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const StructurePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion de la Structure Universitaire</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ManagementCard title="Campus" resourceName="campuses" />
        <ManagementCard title="Filières" resourceName="filieres" />
        <ManagementCard title="Départements" resourceName="departements" />
        <ManagementCard title="Niveaux" resourceName="niveaux" />
        <ManagementCard title="Groupes" resourceName="groupes" />
        <ManagementCard title="Années Universitaires" resourceName="annees-universitaires" />
        <ManagementCard title="Semestres" resourceName="semestres" />
      </div>
    </div>
  );
};

export default StructurePage;

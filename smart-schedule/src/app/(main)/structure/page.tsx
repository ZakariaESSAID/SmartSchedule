'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrash, FaPlus } from 'react-icons/fa'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

// Hook générique pour gérer une ressource
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
  }, [navigate, resourceName]);

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

// Composant pour une carte de gestion (maintenant utilisé dans chaque onglet)
const ManagementCard = ({ title, resourceName, placeholder }) => {
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
    <div>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-4">
        <input 
          type="text" 
          value={newItemName} 
          onChange={(e) => setNewItemName(e.target.value)} 
          placeholder={placeholder} 
          className="flex-grow p-2 border border-gray-300 rounded-md"
        />
        <button type="submit" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <FaPlus className="mr-2" /> Ajouter
        </button>
      </form>
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
            <span className="text-gray-800">{item.name}</span>
            <button onClick={() => deleteItem(item.id)} className="text-gray-500 hover:text-red-600">
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const StructurePage = () => {
  const [activeTab, setActiveTab] = useState('campus');

  const tabs = [
    { id: 'campus', label: 'Campus', resource: 'campuses', placeholder: 'Nom du campus...' },
    { id: 'filieres', label: 'Filières', resource: 'filieres', placeholder: 'Nom de la filière...' },
    { id: 'departements', label: 'Départements', resource: 'departements', placeholder: 'Nom du département...' },
    { id: 'niveaux', label: 'Niveaux', resource: 'niveaux', placeholder: 'Nom du niveau...' },
    { id: 'groupes', label: 'Groupes', resource: 'groupes', placeholder: 'Nom du groupe...' },
    { id: 'annees', label: 'Années Universitaires', resource: 'annees-universitaires', placeholder: 'Ex: 2023-2024...' },
    { id: 'semestres', label: 'Semestres', resource: 'semestres', placeholder: 'Ex: Semestre 1...' },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestion de la Structure Universitaire</h1>

      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTabData && (
          <ManagementCard 
            title={activeTabData.label} 
            resourceName={activeTabData.resource} 
            placeholder={activeTabData.placeholder}
          />
        )}
      </div>
    </div>
  );
};

export default StructurePage;

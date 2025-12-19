'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

const GenerationPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch('http://localhost:8080/api/timetable/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || 'Failed to generate timetable.');
      }
      
      setMessage(responseText);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Génération des Emplois du Temps</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-gray-700">Lancer la génération automatique</h2>
          <p className="text-gray-500 mt-2 mb-6">
            Cliquez sur le bouton ci-dessous pour lancer le processus de génération de l'emploi du temps.
            Cela supprimera l'emploi du temps existant et en créera un nouveau basé sur les cours, enseignants et salles actuels.
          </p>
          
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-all"
          >
            {loading ? 'Génération en cours...' : 'Lancer la Génération'}
          </button>

          {message && (
            <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-md">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerationPage;

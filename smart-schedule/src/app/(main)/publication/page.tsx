'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

const PublicationPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir publier l'emploi du temps ? Cette action notifiera les utilisateurs concernés.")) {
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch('http://localhost:8080/api/timetable/publish', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || 'Failed to publish timetable.');
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Publication de l'Emploi du Temps</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-gray-700">Valider et Publier</h2>
          <p className="text-gray-500 mt-2 mb-6">
            Cette action publiera tous les événements en brouillon et les rendra visibles pour les enseignants et les étudiants.
            La publication échouera si des conflits sont détectés.
          </p>
          
          <button 
            onClick={handlePublish}
            disabled={loading}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 transition-all"
          >
            {loading ? 'Publication en cours...' : 'Publier l\'Emploi du Temps'}
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

export default PublicationPage;

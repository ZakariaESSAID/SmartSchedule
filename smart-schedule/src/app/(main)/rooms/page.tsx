'use client'

import { useState, useEffect } from 'react'
import { Room } from '@/types'
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

const RoomFormModal = ({ room, onClose, onSave, campuses }) => { // Ajout de campuses en prop
  const [formData, setFormData] = useState(room || {
    name: '', capacity: 0, campus: '', type: 'TD', building: '', floor: '',
    hasProjector: false, hasComputers: false, hasInteractiveBoard: false, hasInternet: false,
    specificEquipment: '', status: 'AVAILABLE',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value, 10) : value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{room ? 'Modifier' : 'Ajouter'} une Salle</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Colonne 1 */}
          <div className="space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom / Code" className="w-full p-2 border rounded" required />
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Capacité" className="w-full p-2 border rounded" required />
            
            {/* Remplacement du champ de texte par une liste déroulante */}
            <select name="campus" value={formData.campus} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Sélectionner un Campus --</option>
              {campuses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>

            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="AMPHI">Amphi</option>
              <option value="TD">Salle TD</option>
              <option value="TP">Salle TP / Labo</option>
              <option value="MEETING">Réunion</option>
            </select>
            <input name="building" value={formData.building} onChange={handleChange} placeholder="Bâtiment" className="w-full p-2 border rounded" />
            <input name="floor" value={formData.floor} onChange={handleChange} placeholder="Étage" className="w-full p-2 border rounded" />
             <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="AVAILABLE">Disponible</option>
              <option value="OCCUPIED">Occupée</option>
              <option value="MAINTENANCE">En maintenance</option>
              <option value="OUT_OF_SERVICE">Hors service</option>
            </select>
          </div>
          {/* Colonne 2 */}
          <div className="space-y-2">
            <h3 className="font-semibold">Équipements</h3>
            <div className="flex items-center"><input type="checkbox" name="hasProjector" checked={formData.hasProjector} onChange={handleChange} className="mr-2" /> Vidéoprojecteur</div>
            <div className="flex items-center"><input type="checkbox" name="hasComputers" checked={formData.hasComputers} onChange={handleChange} className="mr-2" /> Ordinateurs</div>
            <div className="flex items-center"><input type="checkbox" name="hasInteractiveBoard" checked={formData.hasInteractiveBoard} onChange={handleChange} className="mr-2" /> Tableau interactif</div>
            <div className="flex items-center"><input type="checkbox" name="hasInternet" checked={formData.hasInternet} onChange={handleChange} className="mr-2" /> Connexion Internet</div>
            <textarea name="specificEquipment" value={formData.specificEquipment} onChange={handleChange} placeholder="Matériel spécifique (ex: Oscilloscope, Paillasse...)" className="w-full p-2 border rounded mt-2" />
          </div>
          <div className="col-span-1 md:col-span-2 mt-6 flex justify-end space-x-4">
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
        <p>Êtes-vous sûr de vouloir supprimer cette salle ?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Supprimer</button>
        </div>
      </div>
    </div>
);

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [campuses, setCampuses] = useState<{ id: string, name: string }[]>([]); // State pour les campus
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const API_URL = 'http://localhost:8080/api';

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const [roomsRes, campusesRes] = await Promise.all([
        fetch(`${API_URL}/rooms`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/campuses`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (roomsRes.status === 401 || campusesRes.status === 401) { navigate('/auth/login'); return; }
      if (!roomsRes.ok) throw new Error('Failed to fetch rooms.');
      if (!campusesRes.ok) throw new Error('Failed to fetch campuses.');
      
      const roomsData = await roomsRes.json();
      const campusesData = await campusesRes.json();
      setRooms(roomsData);
      setCampuses(campusesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleSave = async (roomData) => {
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const isUpdating = selectedRoom !== null;
      const url = isUpdating ? `${API_URL}/rooms/${roomData.id}` : `${API_URL}/rooms`;
      const method = isUpdating ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(roomData),
      });

      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || `Failed to ${isUpdating ? 'update' : 'create'} room.`);
      }
      
      await fetchData();
      setIsFormModalOpen(false);
      setSelectedRoom(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (roomId: string) => {
    setRoomToDelete(roomId);
    setIsConfirmModalOpen(true);
  };

  const executeDelete = async () => {
    if (!roomToDelete) return;
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch(`${API_URL}/rooms/${roomToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) throw new Error('Failed to delete room.');
      
      await fetchData();
      setIsConfirmModalOpen(false);
      setRoomToDelete(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des Salles</h1>
        {isAdmin && (
          <button onClick={() => { setSelectedRoom(null); setIsFormModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Ajouter une Salle
          </button>
        )}
      </div>

      {isFormModalOpen && (
        <RoomFormModal
          room={selectedRoom}
          onClose={() => { setIsFormModalOpen(false); setSelectedRoom(null); }}
          onSave={handleSave}
          campuses={campuses}
        />
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
              <th className="py-3 px-6 text-left">Nom</th>
              <th className="py-3 px-6 text-left">Campus</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Capacité</th>
              <th className="py-3 px-6 text-left">Statut</th>
              {isAdmin && <th className="py-3 px-6 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{room.name}</td>
                <td className="py-4 px-6">{room.campus || 'N/A'}</td>
                <td className="py-4 px-6">{room.type || 'N/A'}</td>
                <td className="py-4 px-6">{room.capacity}</td>
                <td className="py-4 px-6">{room.status || 'N/A'}</td>
                {isAdmin && (
                  <td className="py-4 px-6 text-center space-x-2">
                    <button onClick={() => { setSelectedRoom(room); setIsFormModalOpen(true); }} className="text-blue-600 hover:text-blue-800">Modifier</button>
                    <button onClick={() => handleDeleteClick(room.id)} className="text-red-600 hover:text-red-800">Supprimer</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RoomsPage;

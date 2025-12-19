'use client'

import { useState, useEffect } from 'react'
import { Room } from '@/types'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { FaEdit, FaTrash, FaPlus, FaVideo, FaDesktop, FaChalkboardTeacher, FaWifi } from 'react-icons/fa'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const decoded: { roles: string[] } = jwtDecode(token);
        setIsAdmin(decoded.roles.includes('ROLE_ADMIN'));
      } catch (e) { setIsAdmin(false); }
    }
  }, []);
  return isAdmin;
};

// ... (Les composants Modaux restent les mêmes pour l'instant)
const RoomFormModal = ({ room, onClose, onSave, campuses }) => {
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
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{room ? 'Modifier' : 'Ajouter'} une Salle</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colonne 1 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Informations Générales</h3>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom / Code" className="w-full p-2 border rounded-md" required />
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Capacité" className="w-full p-2 border rounded-md" required />
            <select name="campus" value={formData.campus} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="">-- Sélectionner un Campus --</option>
              {campuses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="AMPHI">Amphi</option>
              <option value="TD">Salle TD</option>
              <option value="TP">Salle TP / Labo</option>
              <option value="MEETING">Réunion</option>
            </select>
            <input name="building" value={formData.building} onChange={handleChange} placeholder="Bâtiment" className="w-full p-2 border rounded-md" />
            <input name="floor" value={formData.floor} onChange={handleChange} placeholder="Étage" className="w-full p-2 border rounded-md" />
             <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="AVAILABLE">Disponible</option>
              <option value="OCCUPIED">Occupée</option>
              <option value="MAINTENANCE">En maintenance</option>
              <option value="OUT_OF_SERVICE">Hors service</option>
            </select>
          </div>
          {/* Colonne 2 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Équipements</h3>
            <div className="space-y-2">
                <label className="flex items-center"><input type="checkbox" name="hasProjector" checked={formData.hasProjector} onChange={handleChange} className="h-4 w-4 rounded" /> <span className="ml-2">Vidéoprojecteur</span></label>
                <label className="flex items-center"><input type="checkbox" name="hasComputers" checked={formData.hasComputers} onChange={handleChange} className="h-4 w-4 rounded" /> <span className="ml-2">Ordinateurs</span></label>
                <label className="flex items-center"><input type="checkbox" name="hasInteractiveBoard" checked={formData.hasInteractiveBoard} onChange={handleChange} className="h-4 w-4 rounded" /> <span className="ml-2">Tableau interactif</span></label>
                <label className="flex items-center"><input type="checkbox" name="hasInternet" checked={formData.hasInternet} onChange={handleChange} className="h-4 w-4 rounded" /> <span className="ml-2">Connexion Internet</span></label>
            </div>
            <textarea name="specificEquipment" value={formData.specificEquipment} onChange={handleChange} placeholder="Matériel spécifique (ex: Oscilloscope...)" className="w-full p-2 border rounded-md mt-2" rows="3" />
          </div>
          <div className="col-span-1 md:col-span-2 mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annuler</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmDeleteModal = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer cette salle ?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annuler</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Supprimer</button>
        </div>
      </div>
    </div>
);

const StatusIndicator = ({ status }) => {
  const statusStyles = {
    AVAILABLE: 'bg-green-100 text-green-800',
    OCCUPIED: 'bg-yellow-100 text-yellow-800',
    MAINTENANCE: 'bg-purple-100 text-purple-800',
    OUT_OF_SERVICE: 'bg-red-100 text-red-800',
  };
  return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const EquipmentIcons = ({ room }) => (
    <div className="flex items-center space-x-3 text-gray-600">
        {room.hasProjector && <div title="Vidéoprojecteur"><FaVideo /></div>}
        {room.hasComputers && <div title="Ordinateurs"><FaDesktop /></div>}
        {room.hasInteractiveBoard && <div title="Tableau Interactif"><FaChalkboardTeacher /></div>}
        {room.hasInternet && <div title="Internet"><FaWifi /></div>}
    </div>
);

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [campuses, setCampuses] = useState<{ id: string, name: string }[]>([]);
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

      if (roomsRes.status === 401) { navigate('/auth/login'); return; }
      if (!roomsRes.ok) throw new Error('Failed to fetch rooms.');
      if (!campusesRes.ok) throw new Error('Failed to fetch campuses.');
      
      setRooms(await roomsRes.json());
      setCampuses(await campusesRes.json());
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
      await fetch(`${API_URL}/rooms/${roomToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Salles</h1>
        {isAdmin && (
          <button onClick={() => { setSelectedRoom(null); setIsFormModalOpen(true); }} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors">
            <FaPlus className="mr-2" />
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacité</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipements</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              {isAdmin && <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 whitespace-nowrap">{room.name}</td>
                <td className="py-4 px-6 whitespace-nowrap">{room.campus || 'N/A'}</td>
                <td className="py-4 px-6 whitespace-nowrap">{room.type || 'N/A'}</td>
                <td className="py-4 px-6 whitespace-nowrap">{room.capacity}</td>
                <td className="py-4 px-6 whitespace-nowrap"><EquipmentIcons room={room} /></td>
                <td className="py-4 px-6 whitespace-nowrap"><StatusIndicator status={room.status} /></td>
                {isAdmin && (
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <button onClick={() => { setSelectedRoom(room); setIsFormModalOpen(true); }} className="text-blue-600 hover:text-blue-800 mr-4"><FaEdit /></button>
                    <button onClick={() => handleDeleteClick(room.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
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

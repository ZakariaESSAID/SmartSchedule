'use client'

import { useState, useEffect } from 'react'
import { ScheduleEvent, Course, Room, User } from '@/types'
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

// Helper function to format date-time for input fields
const formatDateTimeLocal = (date: Date | string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Modal pour le formulaire de création/modification d'événement
const ScheduleEventFormModal = ({ event, onClose, onSave, courses, rooms, students, filieres, niveaux, groups, campuses }) => {
  const [formData, setFormData] = useState(event ? {
    ...event,
    startTime: formatDateTimeLocal(event.startTime),
    endTime: formatDateTimeLocal(event.endTime),
    studentIds: event.studentIds || [],
  } : {
    courseId: '', roomId: '', startTime: formatDateTimeLocal(new Date()), endTime: formatDateTimeLocal(new Date(new Date().getTime() + 2 * 60 * 60 * 1000)), // Default 2 hours
    sessionType: 'CM', studentIds: [], isCancelled: false, isModified: false,
    academicYear: new Date().getFullYear().toString(), semester: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'studentIds') {
      // Gérer la sélection multiple d'étudiants
      const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
      setFormData(prev => ({ ...prev, studentIds: selectedOptions }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertir les chaînes de date/heure en objets Date ou LocalDateTime si nécessaire pour le backend
    const dataToSave = {
      ...formData,
      startTime: new Date(formData.startTime).toISOString(), // Convert to ISO string for backend
      endTime: new Date(formData.endTime).toISOString(),     // Convert to ISO string for backend
    };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{event ? 'Modifier' : 'Ajouter'} un Événement</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <select name="courseId" value={formData.courseId} onChange={handleChange} className="w-full p-2 border rounded" required>
              <option value="">-- Sélectionner un Cours --</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
            <select name="roomId" value={formData.roomId} onChange={handleChange} className="w-full p-2 border rounded" required>
              <option value="">-- Sélectionner une Salle --</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name} (Cap: {r.capacity})</option>)}
            </select>
            <label className="block text-sm font-medium text-gray-700">Début:</label>
            <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-2 border rounded" required />
            <label className="block text-sm font-medium text-gray-700">Fin:</label>
            <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full p-2 border rounded" required />
            <select name="sessionType" value={formData.sessionType} onChange={handleChange} className="w-full p-2 border rounded" required>
              <option value="CM">CM</option>
              <option value="TD">TD</option>
              <option value="TP">TP</option>
            </select>
          </div>
          <div className="space-y-4">
            <select name="studentIds" multiple={true} value={formData.studentIds} onChange={handleChange} className="w-full p-2 border rounded h-32">
              <option value="">-- Sélectionner des Étudiants (Ctrl+clic pour multiple) --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentIdNumber})</option>)}
            </select>
            <input name="academicYear" value={formData.academicYear} onChange={handleChange} placeholder="Année Académique" className="w-full p-2 border rounded" />
            <input name="semester" value={formData.semester} onChange={handleChange} placeholder="Semestre" className="w-full p-2 border rounded" />
            <div className="flex items-center"><input type="checkbox" name="isCancelled" checked={formData.isCancelled} onChange={handleChange} className="mr-2" /> Annulé</div>
            <div className="flex items-center"><input type="checkbox" name="isModified" checked={formData.isModified} onChange={handleChange} className="mr-2" /> Modifié</div>
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
        <p>Êtes-vous sûr de vouloir supprimer cet événement ?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Supprimer</button>
        </div>
      </div>
    </div>
);

const ScheduleEventsPage = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const API_BASE_URL = 'http://localhost:8080/api';

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const [eventsRes, coursesRes, roomsRes, studentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/schedule-events`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/courses`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/rooms`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/students`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      if (eventsRes.status === 401 || coursesRes.status === 401 || roomsRes.status === 401 || studentsRes.status === 401) {
        navigate('/auth/login');
        return;
      }
      if (!eventsRes.ok) throw new Error('Failed to fetch schedule events.');
      if (!coursesRes.ok) throw new Error('Failed to fetch courses.');
      if (!roomsRes.ok) throw new Error('Failed to fetch rooms.');
      if (!studentsRes.ok) throw new Error('Failed to fetch students.');
      
      const eventsData = await eventsRes.json();
      const coursesData = await coursesRes.json();
      const roomsData = await roomsRes.json();
      const studentsData = await studentsRes.json();

      setEvents(eventsData);
      setCourses(coursesData);
      setRooms(roomsData);
      setStudents(studentsData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleSave = async (eventData) => {
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const isUpdating = selectedEvent !== null;
      const url = isUpdating ? `${API_BASE_URL}/schedule-events/${eventData.id}` : `${API_BASE_URL}/schedule-events`;
      const method = isUpdating ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(eventData),
      });

      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || `Failed to ${isUpdating ? 'update' : 'create'} event.`);
      }
      
      await fetchData();
      setIsFormModalOpen(false);
      setSelectedEvent(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setIsConfirmModalOpen(true);
  };

  const executeDelete = async () => {
    if (!eventToDelete) return;
    try {
      const token = getAuthToken();
      if (!token) { navigate('/auth/login'); return; }

      const response = await fetch(`${API_BASE_URL}/schedule-events/${eventToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 401) { navigate('/auth/login'); return; }
      if (!response.ok) throw new Error('Failed to delete event.');
      
      await fetchData();
      setIsConfirmModalOpen(false);
      setEventToDelete(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="p-6">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des Événements d'Emploi du Temps</h1>
        {isAdmin && (
          <button onClick={() => { setSelectedEvent(null); setIsFormModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Ajouter un Événement
          </button>
        )}
      </div>

      {isFormModalOpen && (
        <ScheduleEventFormModal
          event={selectedEvent}
          onClose={() => { setIsFormModalOpen(false); setSelectedEvent(null); }}
          onSave={handleSave}
          courses={courses}
          rooms={rooms}
          students={students}
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
              <th className="py-3 px-6 text-left">Cours</th>
              <th className="py-3 px-6 text-left">Salle</th>
              <th className="py-3 px-6 text-left">Début</th>
              <th className="py-3 px-6 text-left">Fin</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Conflit</th>
              {isAdmin && <th className="py-3 px-6 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{event.courseName}</td>
                <td className="py-4 px-6">{event.roomName}</td>
                <td className="py-4 px-6">{new Date(event.startTime).toLocaleString()}</td>
                <td className="py-4 px-6">{new Date(event.endTime).toLocaleString()}</td>
                <td className="py-4 px-6">{event.sessionType}</td>
                <td className="py-4 px-6">{event.hasConflict ? 'Oui' : 'Non'}</td>
                {isAdmin && (
                  <td className="py-4 px-6 text-center space-x-2">
                    <button onClick={() => { setSelectedEvent(event); setIsFormModalOpen(true); }} className="text-blue-600 hover:text-blue-800">Modifier</button>
                    <button onClick={() => handleDeleteClick(event.id)} className="text-red-600 hover:text-red-800">Supprimer</button>
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

export default ScheduleEventsPage;

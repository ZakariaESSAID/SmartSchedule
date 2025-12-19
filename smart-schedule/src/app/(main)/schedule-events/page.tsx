'use client'

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ScheduleEvent, Course, Room, User } from '@/types'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

const localizer = momentLocalizer(moment)

const EventComponent = ({ event }) => (
  <div>
    <strong>{event.title}</strong>
    <p>{event.roomName}</p>
    <p>{event.responsibleTeacherName}</p>
  </div>
);

const ScheduleEventsPage = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  // TODO: Ajouter la récupération des groupes
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate();

  // États des filtres
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        if (!token) { navigate('/auth/login'); return; }

        const [eventsRes, roomsRes, teachersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/schedule-events`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/rooms`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/teachers`, { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);

        if (eventsRes.status === 401) { navigate('/auth/login'); return; }
        if (!eventsRes.ok || !roomsRes.ok || !teachersRes.ok) throw new Error('Failed to fetch data.');
        
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
        setRooms(await roomsRes.json());
        setTeachers(await teachersRes.json());

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const calendarEvents = useMemo(() => {
    let filteredEvents = events;

    if (selectedRoom) {
      filteredEvents = filteredEvents.filter(event => event.roomId === selectedRoom);
    }
    if (selectedTeacher) {
      // Note: Cette logique suppose que le nom de l'enseignant est dans le DTO de l'événement
      filteredEvents = filteredEvents.filter(event => event.responsibleTeacherName === teachers.find(t => t.id === selectedTeacher)?.name);
    }

    return filteredEvents.map(event => ({
      title: event.courseName,
      start: new Date(event.startTime),
      end: new Date(event.endTime),
      resource: event, // Garder l'événement original pour les détails
      roomName: event.roomName,
      responsibleTeacherName: event.responsibleTeacherName,
    }));
  }, [events, selectedRoom, selectedTeacher, teachers]);

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.resource.hasConflict ? '#F8D7DA' : '#D1ECF1', // Rouge pour conflit, Bleu sinon
      borderRadius: '5px',
      opacity: 0.8,
      color: 'black',
      border: '1px solid',
      borderColor: event.resource.hasConflict ? '#f5c6cb' : '#bee5eb',
      display: 'block'
    };
    return { style };
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Visualisation des Emplois du Temps</h1>

      {/* Filtres */}
      <div className="flex items-center space-x-4 mb-6 p-4 bg-white rounded-lg shadow">
        <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="p-2 border rounded-md">
          <option value="">-- Toutes les Salles --</option>
          {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} className="p-2 border rounded-md">
          <option value="">-- Tous les Enseignants --</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        {/* TODO: Ajouter le filtre par groupe/filière */}
      </div>

      <div className="bg-white p-4 rounded-lg shadow" style={{ height: '80vh' }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={['week', 'day', 'agenda']}
          step={60}
          timeslots={1}
          min={moment().hour(8).minute(0).toDate()}
          max={moment().hour(19).minute(0).toDate()}
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventComponent,
          }}
          // onSelectEvent={event => alert(event.title)} // TODO: Ouvrir un modal de détails
        />
      </div>
    </div>
  );
};

export default ScheduleEventsPage;

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

const localizer = momentLocalizer(moment)

// Définir les types d'événements pour le calendrier
const eventTypes = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  PREFERRED: 'preferred',
};

const AvailabilityPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `http://localhost:8080/api/teachers/${id}`;

  // Transformer les données de disponibilité en événements de calendrier
  const transformToEvents = useCallback((teacherData) => {
    const newEvents = [];
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    
    // Logique pour créer des créneaux pour chaque jour de la semaine
    for (let i = 0; i < days.length; i++) {
        for (let hour = 8; hour < 19; hour++) {
            const slotStart = moment().startOf('week').add(i + 1, 'days').hour(hour).minute(0).toDate();
            const slotEnd = moment(slotStart).add(1, 'hour').toDate();
            
            // Déterminer le type de créneau
            // TODO: Améliorer cette logique avec les données réelles
            let type = eventTypes.AVAILABLE;
            
            newEvents.push({
                title: type.charAt(0).toUpperCase() + type.slice(1),
                start: slotStart,
                end: slotEnd,
                resource: { type }
            });
        }
    }
    return newEvents;
  }, []);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = getAuthToken();
        if (!token) { navigate('/auth/login'); return; }

        const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('Failed to fetch teacher data.');
        
        const data = await response.json();
        setTeacher(data);
        setEvents(transformToEvents(data));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeacherData();
    }
  }, [id, navigate, transformToEvents]);

  const handleSelectSlot = ({ start, end }) => {
    // Logique pour changer le statut d'un créneau
    const updatedEvents = events.map(event => {
        if (moment(event.start).isSame(start) && moment(event.end).isSame(end)) {
            // Cycle à travers les statuts: available -> preferred -> unavailable -> available
            let newType = eventTypes.AVAILABLE;
            if (event.resource.type === eventTypes.AVAILABLE) newType = eventTypes.PREFERRED;
            else if (event.resource.type === eventTypes.PREFERRED) newType = eventTypes.UNAVAILABLE;
            
            return { ...event, resource: { type: newType }, title: newType.charAt(0).toUpperCase() + newType.slice(1) };
        }
        return event;
    });
    setEvents(updatedEvents);
  };

  const handleSaveChanges = async () => {
    // TODO: Convertir les événements du calendrier en chaînes de caractères et les sauvegarder
    alert('Sauvegarde des disponibilités (logique à implémenter)');
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: '#e0e0e0', // Gris par défaut
      borderRadius: '5px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block'
    };
    if (event.resource.type === eventTypes.AVAILABLE) {
      style.backgroundColor = '#D4EDDA'; // Vert pastel
    } else if (event.resource.type === eventTypes.PREFERRED) {
      style.backgroundColor = '#D1ECF1'; // Bleu pastel
    } else if (event.resource.type === eventTypes.UNAVAILABLE) {
      style.backgroundColor = '#F8D7DA'; // Rouge pastel
    }
    return { style };
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button onClick={() => navigate(`/teachers`)} className="mb-6 text-blue-600">&larr; Retour à la liste</button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Disponibilités de {teacher?.name}</h1>
        <button 
          onClick={handleSaveChanges}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Sauvegarder les changements
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow" style={{ height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={['week']}
          step={60}
          timeslots={1}
          min={moment().hour(8).minute(0).toDate()}
          max={moment().hour(19).minute(0).toDate()}
          selectable={true}
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
};

export default AvailabilityPage;

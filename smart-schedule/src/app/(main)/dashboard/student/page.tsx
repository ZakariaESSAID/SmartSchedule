'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

interface StudentDashboardData {
  studentName: string;
  studentEmail: string;
  studentFiliere: string;
  studentNiveau: string;
  studentGroup: string;
  upcomingEvents: any[]; // Remplacez 'any' par votre interface ScheduleEvent
  personalSchedule: any[]; // Remplacez 'any' par votre interface ScheduleEvent
  alerts: string[];
}

const StudentDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          navigate('/auth/login');
          return;
        }

        const response = await fetch('http://localhost:8080/api/dashboard/student', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.status === 401 || response.status === 403) {
          navigate('/unauthorized');
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch student dashboard data.');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return <div className="p-6">Loading Student Dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Étudiant</h1>
      
      {dashboardData && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Bienvenue, {dashboardData.studentName}</h2>
          <p>Email: {dashboardData.studentEmail}</p>
          <p>Filière: {dashboardData.studentFiliere}</p>
          <p>Niveau: {dashboardData.studentNiveau}</p>
          <p>Groupe: {dashboardData.studentGroup}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Prochains Cours</h2>
          {dashboardData?.upcomingEvents && dashboardData.upcomingEvents.length > 0 ? (
            <ul>
              {dashboardData.upcomingEvents.map((event, index) => (
                <li key={index} className="mb-2">
                  <p className="font-semibold">{event.courseName} ({event.sessionType})</p>
                  <p className="text-sm text-gray-600">{new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Salle: {event.roomName}</p>
                  {event.hasConflict && <span className="text-red-500 text-xs">Conflit!</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun cours à venir.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Notifications Importantes</h2>
          {dashboardData?.alerts && dashboardData.alerts.length > 0 ? (
            <ul>
              {dashboardData.alerts.map((alert, index) => (
                <li key={index} className="text-red-500 mb-2">{alert}</li>
              ))}
            </ul>
          ) : (
            <p>Aucune notification.</p>
          )}
        </div>
      </div>

      {/* Emploi du temps personnel (à implémenter plus tard avec une grille) */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Emploi du temps personnel</h2>
        {dashboardData?.personalSchedule && dashboardData.personalSchedule.length > 0 ? (
            <ul>
              {dashboardData.personalSchedule.map((event, index) => (
                <li key={index} className="mb-2">
                  <p className="font-semibold">{event.courseName} ({event.sessionType})</p>
                  <p className="text-sm text-gray-600">{new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Salle: {event.roomName}</p>
                  {event.hasConflict && <span className="text-red-500 text-xs">Conflit!</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun événement planifié pour cette semaine.</p>
          )}
      </div>
    </div>
  );
};

export default StudentDashboardPage;

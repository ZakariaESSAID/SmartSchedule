'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

interface DashboardStats {
  totalStudents: number;
  enrolledStudents: number;
  suspendedStudents: number; // Correction ici
  totalTeachers: number;
  totalRooms: number;
  occupiedRooms: number;
  roomOccupancyRate: number;
  totalCourses: number;
  plannedCourses: number;
  detectedConflicts: number;
  roomOverloadConflicts: number;
  teacherConflicts: number;
  studentConflicts: number;
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow flex items-center">
    <div className="text-3xl mr-4">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          navigate('/auth/login');
          return;
        }

        const response = await fetch('http://localhost:8080/api/dashboard/admin', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.status === 401 || response.status === 403) {
          navigate('/unauthorized');
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch admin dashboard stats.');
        }

        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return <div className="p-6">Loading Admin Dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Étudiants" value={stats?.totalStudents ?? 0} icon="🧑‍🎓" />
        <StatCard title="Étudiants Inscrits" value={stats?.enrolledStudents ?? 0} icon="✅" />
        <StatCard title="Étudiants Suspendus" value={stats?.suspendedStudents ?? 0} icon="❌" />
        <StatCard title="Total Enseignants" value={stats?.totalTeachers ?? 0} icon="👨‍🏫" />
        <StatCard title="Total Salles" value={stats?.totalRooms ?? 0} icon="🏫" />
        <StatCard title="Salles Occupées" value={stats?.occupiedRooms ?? 0} icon="🛋️" />
        <StatCard title="Taux Occupation Salles" value={`${(stats?.roomOccupancyRate ?? 0).toFixed(2)}%`} icon="📈" />
        <StatCard title="Total Cours" value={stats?.totalCourses ?? 0} icon="📚" />
        <StatCard title="Cours Planifiés" value={stats?.plannedCourses ?? 0} icon="🗓️" />
        <StatCard title="Conflits Détectés" value={stats?.detectedConflicts ?? 0} icon="🔥" />
      </div>

      {/* Vous pouvez ajouter d'autres sections spécifiques à l'admin ici */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold">Génération et Validation des Emplois du Temps (à venir)</h2>
        <p className="text-gray-500 mt-2">Les outils de génération et de validation seront affichés ici.</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

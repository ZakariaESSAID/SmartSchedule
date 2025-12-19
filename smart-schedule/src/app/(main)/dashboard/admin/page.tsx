'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalRooms: number;
  totalCourses: number;
  detectedConflicts: number;
  userDistribution: { name: string, value: number }[];
  courseDistributionByFiliere: { name: string, value: number }[];
  roomOccupancy: { name: string, value: number }[];
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className="text-3xl text-blue-500 mr-4">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getAuthToken();
        if (!token) { navigate('/auth/login'); return; }

        const response = await fetch('http://localhost:8080/api/dashboard/admin', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.status === 401 || response.status === 403) { navigate('/unauthorized'); return; }
        if (!response.ok) throw new Error('Failed to fetch admin dashboard stats.');

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

  if (loading) return <div className="p-6">Loading Admin Dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de bord Administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard title="Total Étudiants" value={stats?.totalStudents ?? 0} icon="🧑‍🎓" />
        <StatCard title="Total Enseignants" value={stats?.totalTeachers ?? 0} icon="👨‍🏫" />
        <StatCard title="Total Salles" value={stats?.totalRooms ?? 0} icon="🏫" />
        <StatCard title="Total Cours" value={stats?.totalCourses ?? 0} icon="📚" />
        <StatCard title="Conflits Détectés" value={stats?.detectedConflicts ?? 0} icon="🔥" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Répartition des Utilisateurs</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.userDistribution || []} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Nombre" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Taux d'Occupation des Salles</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats?.roomOccupancy || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {(stats?.roomOccupancy || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow col-span-1 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Répartition des Cours par Filière</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.courseDistributionByFiliere || []} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Nombre de cours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

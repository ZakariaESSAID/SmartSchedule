'use client'

import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

const useUserRoles = () => {
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const decoded: { roles: string[] } = jwtDecode(token);
        setRoles(decoded.roles || []);
      } catch (e) {
        console.error("Invalid token for role check", e);
        setRoles([]);
      }
    } else {
      setRoles([]);
    }
  }, []);
  return roles;
};

const Sidebar = () => {
  const roles = useUserRoles();
  const hasRole = (role: string) => roles.includes(role);

  const dashboardPath = React.useMemo(() => {
    if (hasRole('ROLE_ADMIN')) return '/dashboard/admin';
    if (hasRole('ROLE_TEACHER')) return '/dashboard/teacher';
    if (hasRole('ROLE_STUDENT')) return '/dashboard/student';
    return '/dashboard';
  }, [roles]);

  const baseLinkClasses =
    'flex items-center p-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white'
  const activeLinkClasses = 'bg-blue-600 text-white shadow-md'

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col shadow-lg z-10">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-center">SmartSchedule</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <ul>
          <li>
            <NavLink to={dashboardPath} className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
              <span className="mr-3">📊</span> Tableau de bord
            </NavLink>
          </li>
          {(hasRole('ROLE_ADMIN') || hasRole('ROLE_TEACHER')) && (
            <li>
              <NavLink to="/courses" className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                <span className="mr-3">📚</span> Cours
              </NavLink>
            </li>
          )}
          {hasRole('ROLE_ADMIN') && (
            <>
              <li>
                <NavLink to="/teachers" className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                  <span className="mr-3">👨‍🏫</span> Enseignants
                </NavLink>
              </li>
              <li>
                <NavLink to="/students" className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                  <span className="mr-3">🧑‍🎓</span> Étudiants
                </NavLink>
              </li>
              <li>
                <NavLink to="/rooms" className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                  <span className="mr-3">🏫</span> Salles
                </NavLink>
              </li>
              <li>
                <NavLink to="/schedule-events" className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                  <span className="mr-3">🗓️</span> Événements EDT
                </NavLink>
              </li>
              <li className="pt-4 mt-4 border-t border-gray-700">
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Administration</h3>
              </li>
              <li>
                <NavLink to="/structure" className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                  <span className="mr-3">🏛️</span> Gérer la Structure
                </NavLink>
              </li>
              <li>
                <NavLink to="/generation" className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                  <span className="mr-3">⚙️</span> Génération EDT
                </NavLink>
              </li>
              <li>
                <NavLink to="/publication" className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                  <span className="mr-3">🚀</span> Publication
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400 text-center">
        © 2023 SmartSchedule
      </div>
    </aside>
  )
}

export default Sidebar

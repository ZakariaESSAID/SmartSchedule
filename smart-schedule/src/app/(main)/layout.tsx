'use client'

import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import AuthLayoutClientWrapper from '@/components/AuthLayoutClientWrapper'
import '@/app/vendor.css'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const decoded: { roles: string[] } = jwtDecode(token);
        setUserRoles(decoded.roles || []);
      } catch (e) {
        console.error("Invalid token:", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
      }
    } else {
      navigate('/auth/login');
    }
    setIsAuthChecked(true);
  }, [navigate]);

  useEffect(() => {
    if (isAuthChecked && location.pathname === '/dashboard') {
      if (userRoles.includes('ROLE_ADMIN')) {
        navigate('/dashboard/admin', { replace: true });
      } else if (userRoles.includes('ROLE_TEACHER')) {
        navigate('/dashboard/teacher', { replace: true });
      } else if (userRoles.includes('ROLE_STUDENT')) {
        navigate('/dashboard/student', { replace: true });
      } else {
        navigate('/unauthorized', { replace: true });
      }
    }
  }, [isAuthChecked, location.pathname, navigate, userRoles]);

  if (!isAuthChecked) {
    return <div>Loading...</div>; // Ou un spinner de chargement
  }

  return (
    <AuthLayoutClientWrapper>
      <Outlet />
    </AuthLayoutClientWrapper>
  )
}

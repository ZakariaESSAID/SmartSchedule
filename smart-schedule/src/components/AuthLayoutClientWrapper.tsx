'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import LoadingSpinner from './LoadingSpinner';
import { jwtDecode } from 'jwt-decode'; // Importer jwt-decode

// Définir une interface pour l'utilisateur décodé du token
interface DecodedUser {
  id: string;
  sub: string; // L'email est dans le champ 'sub'
  roles: string[];
}

const AuthLayoutClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser: DecodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token'); // Nettoyer le token invalide
        navigate('/auth/login');
      }
    } else {
      navigate('/auth/login');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Si pas d'utilisateur, la redirection vers le login est en cours
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar user={user} /> {/* Passer l'utilisateur à la Sidebar */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 bg-gray-100 h-full">{children}</main>
      </div>
    </div>
  );
};

export default AuthLayoutClientWrapper;

'use client'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { FaEye, FaEyeSlash } from 'react-icons/fa' // Import des icônes

const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

interface DecodedUser {
  sub: string;
}

const PasswordInput = ({ value, onChange, placeholder }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div className="relative">
            <input 
                type={isVisible ? 'text' : 'password'} 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder} 
                className="w-full p-2 border rounded pr-10" 
                required 
            />
            <button 
                type="button" 
                onClick={() => setIsVisible(!isVisible)} 
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
            >
                {isVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
    );
};

const ChangePasswordModal = ({ onClose, onSave }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            await onSave(oldPassword, newPassword);
            setSuccess("Mot de passe changé avec succès !");
            // Fermer le modal après un court délai
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Changer le mot de passe</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <PasswordInput value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Ancien mot de passe" />
                    <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe" />
                    <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmer le nouveau mot de passe" />
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}

                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded" disabled={loading}>Annuler</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
                            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Header = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const decoded: DecodedUser = jwtDecode(token);
        setUserName(decoded.sub);
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/login');
  }

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    const token = getAuthToken();
    const response = await fetch('http://localhost:8080/api/profile/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to change password');
    }
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md">
      <h1 className="text-2xl font-bold">SmartSchedule</h1>
      {userName && (
        <div className="flex items-center space-x-4">
          <span>Connecté en tant que: {userName}</span>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-gray-200 rounded">Changer le mot de passe</button>
          <button onClick={handleLogout} className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">Déconnexion</button>
        </div>
      )}
      {isModalOpen && <ChangePasswordModal onClose={() => setIsModalOpen(false)} onSave={handleChangePassword} />}
    </header>
  )
}

export default Header;

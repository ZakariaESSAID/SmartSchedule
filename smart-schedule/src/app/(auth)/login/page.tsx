'use client'

import { useState } from 'react'
// Important : Utiliser useNavigate de react-router-dom comme dans votre configuration initiale
import { useNavigate } from 'react-router-dom' 

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Email ou mot de passe invalide' }));
        throw new Error(errorData.message || 'Email ou mot de passe invalide');
      }

      const data = await response.json()

      // Stocker le token et les informations utilisateur dans le localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ id: data.id, email: data.email, roles: data.roles }))

      // Rediriger vers le tableau de bord en cas de succès
      navigate('/dashboard') // Adapter le chemin si nécessaire

    } catch (err: any) {
      setError(err.message)
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-center text-3xl font-bold">SmartSchedule</h1>
        <h2 className="text-center text-xl font-bold">Connexion</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

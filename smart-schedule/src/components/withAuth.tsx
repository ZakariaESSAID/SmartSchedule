'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '@/components/DataContext' // Import useData hook
import { User } from '@/types'
import LoadingSpinner from './LoadingSpinner' // Import LoadingSpinner

const withAuth = (
  WrappedComponent: React.ComponentType,
  allowedRoles: User['role'][],
) => {
  const AuthComponent = (props: any) => {
    const { user } = useData() // Get user from DataContext
    const navigate = useNavigate()

    // Simulate loading for initial auth check (if needed, otherwise remove)
    const [loading, setLoading] = React.useState(true);
    useEffect(() => {
      // In a real app, this would check for a token or session
      // For now, we just simulate a brief loading period
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500); // Simulate 0.5 second loading
      return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
      if (!loading && !user) {
        // Only redirect if not loading and no user
        navigate('/auth/login')
      } else if (!loading && user && !allowedRoles.includes(user.role)) {
        // Only redirect if not loading, user exists, and not authorized
        navigate('/unauthorized') // Or some other page
      }
    }, [user, loading, navigate]) // Add loading to dependency array

    if (loading) {
      return <LoadingSpinner /> // Show loading spinner
    }

    if (!user || !allowedRoles.includes(user.role)) {
      return null // Or a more specific unauthorized component if needed
    }

    return <WrappedComponent {...props} />
  }

  return AuthComponent
}

export default withAuth

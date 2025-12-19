import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'
import RootLayout from './app/layout'
import AuthLayout from './app/(auth)/layout'
import MainLayout from './app/(main)/layout'
import LoginPage from './app/(auth)/login/page'
// Import des tableaux de bord spécifiques
import AdminDashboardPage from './app/(main)/dashboard/admin/page'
import TeacherDashboardPage from './app/(main)/dashboard/teacher/page'
import StudentDashboardPage from './app/(main)/dashboard/student/page'

import RoomsPage from './app/(main)/rooms/page'
import CoursesPage from './app/(main)/courses/page'
import StudentsPage from './app/(main)/students/page'
import StudentDetailPage from './app/(main)/students/[id]/page'
import TeachersPage from './app/(main)/teachers/page'
import TeacherAvailabilityPage from './app/(main)/teachers/[id]/availability/page'
import StructurePage from './app/(main)/structure/page'
import GenerationPage from './app/(main)/generation/page'
import PublicationPage from './app/(main)/publication/page' // Nouvelle page
import UnauthorizedPage from './app/(main)/unauthorized/page'
import ScheduleEventsPage from './app/(main)/schedule-events/page'
import './app/globals.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [{ path: 'login', element: <LoginPage /> }],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Routes des tableaux de bord spécifiques
      { path: 'dashboard/admin', element: <AdminDashboardPage /> },
      { path: 'dashboard/teacher', element: <TeacherDashboardPage /> },
      { path: 'dashboard/student', element: <StudentDashboardPage /> },
      { path: 'dashboard', element: <Navigate to="/dashboard/admin" replace /> },

      { path: 'rooms', element: <RoomsPage /> },
      { path: 'courses', element: <CoursesPage /> },
      { path: 'students', element: <StudentsPage /> },
      { path: 'students/:id', element: <StudentDetailPage /> },
      { path: 'teachers', element: <TeachersPage /> },
      { path: 'teachers/:id/availability', element: <TeacherAvailabilityPage /> },
      { path: 'schedule-events', element: <ScheduleEventsPage /> },
      { path: 'structure', element: <StructurePage /> },
      { path: 'generation', element: <GenerationPage /> },
      { path: 'publication', element: <PublicationPage /> }, // Nouvelle route
      { path: 'unauthorized', element: <UnauthorizedPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/auth/login" replace />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { OrganizerDashboard } from './pages/organizer/OrganizerDashboard';
import { CreateEvent } from './pages/organizer/CreateEvent';
import { OrganizerEventDetail } from './pages/organizer/EventDetail';
import { BrandDashboard } from './pages/brand/BrandDashboard';
import { EventDetail as BrandEventDetail } from './pages/brand/EventDetail';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentEventDetail } from './pages/student/EventDetail';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={user ? <Navigate to={`/dashboard/${user.role}`} replace /> : <Auth />} />

        {/* Protected Organizer Routes */}
        <Route
          path="/dashboard/organizer"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/organizer/create-event"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/organizer/event/:id"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerEventDetail />
            </ProtectedRoute>
          }
        />

        {/* Protected Brand Routes */}
        <Route
          path="/dashboard/brand"
          element={
            <ProtectedRoute allowedRoles={['brand']}>
              <BrandDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/brand/event/:id"
          element={
            <ProtectedRoute allowedRoles={['brand']}>
              <BrandEventDetail />
            </ProtectedRoute>
          }
        />

        {/* Protected Student Routes */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/event/:id"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentEventDetail />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to landing or dashboard */}
        <Route
          path="*"
          element={user ? <Navigate to={`/dashboard/${user.role}`} replace /> : <Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
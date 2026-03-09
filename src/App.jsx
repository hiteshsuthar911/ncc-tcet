import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import EventRegistration from './pages/EventRegistration'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEvents from './pages/admin/AdminEvents'
import AdminRegistrations from './pages/admin/AdminRegistrations'

import AdminCadets from './pages/admin/AdminCadets'
import AdminAttendance from './pages/admin/AdminAttendance'
import AdminApplications from './pages/admin/AdminApplications'
import AdminDeclarations from './pages/admin/AdminDeclarations'
import AdminBulkImport from './pages/admin/AdminBulkImport'
import CadetProfile from './pages/CadetProfile'
import MyRegistrations from './pages/MyRegistrations'
import InstallPrompt from './components/InstallPrompt'
import JoinNCC from './pages/JoinNCC'
import Rules from './pages/Rules'
import DeclarationForm from './pages/DeclarationForm'
import Training from './pages/Training'
import Achievements from './pages/Achievements'

// Public layout wrapper (with navbar + footer)
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <>
      <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/about"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />
      <Route
        path="/events"
        element={
          <PublicLayout>
            <EventRegistration />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />
      <Route
        path="/join"
        element={
          <PublicLayout>
            <JoinNCC />
          </PublicLayout>
        }
      />
      <Route
        path="/rules"
        element={
          <PublicLayout>
            <Rules />
          </PublicLayout>
        }
      />
      <Route
        path="/declaration"
        element={
          <PublicLayout>
            <DeclarationForm />
          </PublicLayout>
        }
      />
      <Route
        path="/training"
        element={
          <PublicLayout>
            <Training />
          </PublicLayout>
        }
      />
      <Route
        path="/achievements"
        element={
          <PublicLayout>
            <Achievements />
          </PublicLayout>
        }
      />

      {/* Protected cadet pages */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <CadetProfile />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-registrations"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <MyRegistrations />
            </PublicLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="registrations" element={<AdminRegistrations />} />
        <Route path="cadets" element={<AdminCadets />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="declarations" element={<AdminDeclarations />} />
        <Route path="bulk-import" element={<AdminBulkImport />} />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <p className="font-heading text-8xl text-army-800 mb-4">404</p>
                <h2 className="font-heading text-2xl text-white uppercase tracking-widest mb-2">
                  Page Not Found
                </h2>
                <p className="text-army-400 font-body mb-6">
                  The page you're looking for doesn't exist.
                </p>
                <a href="/" className="btn-primary inline-flex">Return to Home</a>
              </div>
            </div>
          </PublicLayout>
        }
      />
    </Routes>
    <InstallPrompt />
    </>
  )
}

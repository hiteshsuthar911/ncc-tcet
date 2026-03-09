import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Shield,
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  ClipboardCheck,
  UserPlus,
  FileText,
  Upload,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/events', label: 'Manage Events', icon: Calendar },
  { to: '/admin/registrations', label: 'Registrations', icon: ClipboardList },
  { to: '/admin/applications', label: 'Join Applications', icon: UserPlus },
  { to: '/admin/declarations', label: 'Declarations', icon: FileText },
  { to: '/admin/leave-applications', label: 'Leave Applications', icon: ClipboardList },
  { to: '/admin/cadets', label: 'Cadets', icon: Users },
  { to: '/admin/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/admin/bulk-import', label: 'Bulk Import', icon: Upload },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout, userProfile } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      toast.success('Logged out')
      navigate('/login')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="min-h-screen flex bg-military-dark">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-military-darker border-r border-army-800 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-army-800">
          <img
            src={`${import.meta.env.BASE_URL}ncc-logo.svg`}
            alt="NCC Logo"
            className="h-11 w-auto object-contain flex-shrink-0"
          />
          <div>
            <p className="font-heading text-xs text-gold-400 tracking-[0.2em] uppercase">NCC TCET</p>
            <p className="font-body text-xs text-army-500">Admin Portal</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto text-army-500 hover:text-army-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Officer info */}
        <div className="px-5 py-4 border-b border-army-800">
          <p className="text-army-500 text-xs font-body">Logged in as</p>
          <p className="text-white font-heading text-sm uppercase tracking-wider mt-0.5">
            {userProfile?.name || 'Administrator'}
          </p>
          <span className="badge-rank mt-1 inline-flex">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
          {ADMIN_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-army-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-army-400 hover:text-red-400 font-heading text-xs uppercase tracking-wider px-4 py-2 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-army-800 bg-military-darker">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-army-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-sm uppercase tracking-widest text-army-300 hidden lg:block">
            Command Center
          </h1>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative text-army-400 hover:text-gold-400 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Menu, X, LogOut, User, ChevronDown, ClipboardList, Settings,
  Camera, BookOpen, Flame, Calendar, Users, Trophy, LayoutDashboard,
  Shield, Bell,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const { currentUser, userProfile, logout, isAdmin } = useAuth()
  const { isActive: hasNotif } = useNotification()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { setIsOpen(false) }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleLogout() {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/')
    } catch {
      toast.error('Failed to log out')
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/events', label: 'Events' },
    { to: '/join', label: 'Join NCC' },
    { to: '/training', label: 'Training' },
    { to: '/forms', label: 'Forms' },
    { to: '/contact', label: 'Contact' },
  ]

  const exploreLinks = [
    { to: '/achievements', label: 'Achievements', icon: Trophy },
    { to: '/achievers',    label: 'Achievers',    icon: Trophy },
    { to: '/team',         label: 'Our Team',     icon: Users  },
    { to: '/activities',   label: 'Activities',   icon: Flame  },
    { to: '/calendar',     label: 'Calendar',     icon: Calendar },
    { to: '/gallery',      label: 'Gallery',      icon: Camera },
    { to: '/magazine',     label: 'Magazine',     icon: BookOpen },
  ]

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${hasNotif ? 'top-10' : 'top-0'} ${
        scrolled
          ? 'bg-white shadow-md border-b border-gray-200'
          : 'bg-navy-950 lg:bg-white/80 lg:backdrop-blur-sm border-b border-navy-800 lg:border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}ncc-logo.svg`}
              alt="NCC Logo"
              className="h-11 w-auto object-contain drop-shadow-sm flex-shrink-0"
            />
            <div className="hidden sm:block">
              <p className={`font-heading font-bold text-sm tracking-wide leading-none ${
                scrolled ? 'text-navy-900' : 'text-white lg:text-navy-900'
              }`}>
                NCC TCET
              </p>
              <p className={`font-body text-[11px] leading-none mt-0.5 ${
                scrolled ? 'text-gray-500' : 'text-navy-300 lg:text-gray-500'
              }`}>
                National Cadet Corps
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg font-heading font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-navy-900 bg-navy-50'
                      : 'text-gray-600 hover:text-navy-800 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Explore Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExploreOpen(o => !o)}
                onBlur={() => setTimeout(() => setExploreOpen(false), 150)}
                className={`px-3 py-2 rounded-lg font-heading font-medium text-sm flex items-center gap-1 transition-all duration-200 ${
                  exploreOpen ? 'text-navy-900 bg-navy-50' : 'text-gray-600 hover:text-navy-800 hover:bg-gray-50'
                }`}
              >
                Explore <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`} />
              </button>
              {exploreOpen && (
                <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50 py-1.5">
                  {exploreLinks.map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setExploreOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-4 py-2.5 font-heading font-medium text-sm transition-colors ${
                          isActive ? 'text-navy-900 bg-navy-50' : 'text-gray-700 hover:text-navy-800 hover:bg-gray-50'
                        }`
                      }
                    >
                      <link.icon className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg font-heading font-medium text-sm transition-all duration-200 ${
                    isActive ? 'text-navy-900 bg-navy-50' : 'text-gray-600 hover:text-navy-800 hover:bg-gray-50'
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </div>

          {/* Auth Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  onBlur={() => setTimeout(() => setProfileOpen(false), 150)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center ring-2 ring-navy-200">
                    <User className="w-4 h-4 text-navy-700" />
                  </div>
                  <div className="text-left">
                    <p className="font-heading font-semibold text-xs text-gray-900 leading-none">
                      {userProfile?.name?.split(' ')[0] || 'Cadet'}
                    </p>
                    <p className="font-body text-[10px] text-gray-500 leading-none mt-0.5">
                      {userProfile?.regimentalNo || 'Portal'}
                    </p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-navy-50">
                      <p className="font-heading font-semibold text-sm text-navy-900">
                        {userProfile?.name || 'Cadet'}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {userProfile?.rank || userProfile?.regimentalNo || ''}
                      </p>
                    </div>
                    <div className="py-1.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-saffron-600 hover:bg-saffron-50 transition-colors font-heading font-medium text-sm"
                      >
                        <LayoutDashboard className="w-4 h-4" /> My Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors font-heading font-medium text-sm"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link
                        to="/my-registrations"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors font-heading font-medium text-sm"
                      >
                        <ClipboardList className="w-4 h-4" /> My Registrations
                      </Link>
                      <Link
                        to="/polls"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors font-heading font-medium text-sm"
                      >
                        <Bell className="w-4 h-4" /> Session Polls
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-navy-700 hover:bg-navy-50 transition-colors font-heading font-medium text-sm border-t border-gray-100"
                        >
                          <Shield className="w-4 h-4" /> Admin Portal
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors font-heading font-medium text-sm"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2.5 px-5">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled
                ? 'text-gray-600 hover:text-navy-800 hover:bg-gray-50'
                : 'text-white hover:text-saffron-400 hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 lg:hidden w-[min(320px,88vw)] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-navy-950 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={`${import.meta.env.BASE_URL}ncc-logo.svg`} alt="NCC" className="h-9 w-auto object-contain" />
            <div>
              <p className="font-heading font-bold text-sm text-white leading-none">NCC TCET</p>
              <p className="font-body text-[10px] text-navy-300 leading-none mt-0.5">National Cadet Corps</p>
            </div>
          </Link>
          <button onClick={() => setIsOpen(false)} aria-label="Close menu" className="p-2 rounded-lg text-navy-300 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Links */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `block py-3.5 px-5 font-heading font-medium text-sm transition-colors border-l-[3px] ${
                    isActive
                      ? 'text-navy-900 border-navy-700 bg-navy-50'
                      : 'text-gray-700 border-transparent hover:text-navy-800 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="px-5 pb-2 font-heading font-semibold text-[10px] text-gray-400 uppercase tracking-widest">Explore</p>
              {exploreLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 px-5 pl-6 font-heading font-medium text-sm border-l-[3px] transition-colors ${
                      isActive
                        ? 'text-navy-900 border-navy-700 bg-navy-50'
                        : 'text-gray-600 border-transparent hover:text-navy-800 hover:bg-gray-50'
                    }`
                  }
                >
                  <link.icon className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                  {link.label}
                </NavLink>
              ))}
            </div>

            {isAdmin && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-5 font-heading font-medium text-sm border-l-[3px] transition-colors ${
                      isActive ? 'text-navy-900 border-navy-700 bg-navy-50' : 'text-gray-700 border-transparent hover:text-navy-800 hover:bg-gray-50'
                    }`
                  }
                >
                  <Settings className="w-4 h-4 flex-shrink-0" /> Admin Portal
                </NavLink>
              </div>
            )}

            {currentUser && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="px-5 pb-2 font-heading font-semibold text-[10px] text-gray-400 uppercase tracking-widest">My Account</p>
                <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-5 font-heading font-medium text-sm border-l-[3px] transition-colors ${isActive ? 'text-saffron-700 border-saffron-500 bg-saffron-50' : 'text-saffron-600 border-transparent hover:bg-saffron-50'}`}>
                  <LayoutDashboard className="w-4 h-4 flex-shrink-0" /> My Dashboard
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-5 font-heading font-medium text-sm border-l-[3px] transition-colors ${isActive ? 'text-navy-900 border-navy-700 bg-navy-50' : 'text-gray-700 border-transparent hover:text-navy-800 hover:bg-gray-50'}`}>
                  <User className="w-4 h-4 flex-shrink-0" /> My Profile
                </NavLink>
                <NavLink to="/my-registrations" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-5 font-heading font-medium text-sm border-l-[3px] transition-colors ${isActive ? 'text-navy-900 border-navy-700 bg-navy-50' : 'text-gray-700 border-transparent hover:text-navy-800 hover:bg-gray-50'}`}>
                  <ClipboardList className="w-4 h-4 flex-shrink-0" /> My Registrations
                </NavLink>
                <NavLink to="/polls" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-5 font-heading font-medium text-sm border-l-[3px] transition-colors ${isActive ? 'text-navy-900 border-navy-700 bg-navy-50' : 'text-gray-700 border-transparent hover:text-navy-800 hover:bg-gray-50'}`}>
                  <Bell className="w-4 h-4 flex-shrink-0" /> Session Polls
                </NavLink>
              </div>
            )}
            <div className="h-4" />
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 bg-gray-50">
          {currentUser ? (
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-navy-700" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm text-gray-900 truncate">{userProfile?.name || 'Cadet'}</p>
                  <p className="text-gray-500 text-xs">{userProfile?.regimentalNo || userProfile?.role || ''}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-heading font-medium text-sm transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary w-full text-center">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, User, ChevronDown, ClipboardList, Settings, Camera, BookOpen, Flame, Calendar, Users, Trophy, LayoutDashboard } from 'lucide-react'
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

  // Close drawer whenever the route changes
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
          ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={`${import.meta.env.BASE_URL}ncc-logo.svg`}
              alt="NCC Logo"
              className="h-14 w-auto object-contain drop-shadow-md flex-shrink-0"
              style={{ maxHeight: '56px' }}
            />
            <div>
              <p className="font-heading text-sm tracking-[0.3em] text-gold-400 uppercase leading-none">
                NCC TCET
              </p>
              <p className="font-body text-xs text-gray-500 leading-none mt-0.5">
                National Cadet Corps
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
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
                className={`nav-link flex items-center gap-1`}
              >
                Explore <ChevronDown className={`w-3 h-3 transition-transform ${exploreOpen ? 'rotate-180' : ''}`} />
              </button>
              {exploreOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-xl shadow-black/10 rounded-md overflow-hidden z-50">
                  {exploreLinks.map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setExploreOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2.5 font-heading text-xs uppercase tracking-wider transition-colors ${
                          isActive ? 'text-army-700 bg-army-50' : 'text-gray-700 hover:text-army-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      <link.icon className="w-3.5 h-3.5" /> {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Admin
              </NavLink>
            )}
          </div>

          {/* Auth Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-army-700 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-army-100 border border-army-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-army-700" />
                  </div>
                  <span className="font-heading text-xs uppercase tracking-wider text-gray-700">
                    {userProfile?.regimentalNo || 'Cadet'}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 shadow-xl shadow-black/10 rounded-md overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-army-700 font-heading text-xs uppercase tracking-wider">
                        {userProfile?.name || 'Cadet'}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {userProfile?.rank || userProfile?.regimentalNo || ''}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-gold-600 hover:text-gold-700 hover:bg-amber-50 transition-colors duration-200 font-heading text-xs uppercase tracking-wider border-b border-gray-100"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" /> My Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-gray-700 hover:text-army-700 hover:bg-gray-50 transition-colors duration-200 font-heading text-xs uppercase tracking-wider"
                    >
                      <User className="w-3.5 h-3.5" /> My Profile
                    </Link>
                    <Link
                      to="/my-registrations"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-gray-700 hover:text-army-700 hover:bg-gray-50 transition-colors duration-200 font-heading text-xs uppercase tracking-wider"
                    >
                      <ClipboardList className="w-3.5 h-3.5" /> My Registrations
                    </Link>
                    <Link
                      to="/polls"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-gray-700 hover:text-army-700 hover:bg-gray-50 transition-colors duration-200 font-heading text-xs uppercase tracking-wider"
                    >
                      <ClipboardList className="w-3.5 h-3.5" /> Session Polls
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-gray-700 hover:text-army-700 hover:bg-gray-50 transition-colors duration-200 font-heading text-xs uppercase tracking-wider border-t border-gray-100"
                      >
                        <Settings className="w-3.5 h-3.5" /> Admin Portal
                      </Link>
                    )}
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-heading text-xs uppercase tracking-wider"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-secondary text-sm py-2">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-700 hover:text-army-700 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer Panel — right-side slide-in */}
        <div
          className={`absolute top-0 right-0 h-full w-[min(300px,85vw)] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white flex-shrink-0">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={`${import.meta.env.BASE_URL}ncc-logo.svg`}
                alt="NCC Logo"
                className="h-10 w-auto object-contain"
              />
              <div>
                <p className="font-heading text-xs tracking-[0.25em] text-gold-500 uppercase leading-none">NCC TCET</p>
                <p className="font-body text-[10px] text-gray-400 leading-none mt-0.5">National Cadet Corps</p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="p-2 -mr-1 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Nav Content — iOS needs the style prop for touch scroll */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
          >
            <nav className="py-2">
              {/* Main Links */}
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center py-3.5 px-5 font-heading text-sm uppercase tracking-widest border-l-4 transition-colors ${
                      isActive
                        ? 'text-army-700 border-army-600 bg-army-50'
                        : 'text-gray-700 border-transparent hover:text-army-700 hover:border-army-400 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Explore Section */}
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="px-5 pt-2 pb-1 font-heading text-[10px] text-gray-400 uppercase tracking-[0.2em]">Explore</p>
                {exploreLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 py-3 px-5 pl-7 font-heading text-sm uppercase tracking-widest border-l-4 transition-colors ${
                        isActive
                          ? 'text-army-700 border-army-600 bg-army-50'
                          : 'text-gray-600 border-transparent hover:text-army-700 hover:border-army-400 hover:bg-gray-50'
                      }`
                    }
                  >
                    <link.icon className="w-3.5 h-3.5 flex-shrink-0" />{link.label}
                  </NavLink>
                ))}
              </div>

              {/* Admin */}
              {isAdmin && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 py-3.5 px-5 font-heading text-sm uppercase tracking-widest border-l-4 transition-colors ${
                        isActive
                          ? 'text-army-700 border-army-600 bg-army-50'
                          : 'text-gray-700 border-transparent hover:text-army-700 hover:border-army-400 hover:bg-gray-50'
                      }`
                    }
                  >
                    <Settings className="w-3.5 h-3.5 flex-shrink-0 mr-2" /> Admin Portal
                  </NavLink>
                </div>
              )}

              {/* Cadet Account Links */}
              {currentUser && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="px-5 pt-2 pb-1 font-heading text-[10px] text-gray-400 uppercase tracking-[0.2em]">My Account</p>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 py-3.5 px-5 font-heading text-sm uppercase tracking-widest border-l-4 transition-colors ${
                        isActive ? 'text-gold-700 border-gold-500 bg-amber-50' : 'text-gold-600 border-transparent bg-amber-50/50 hover:border-gold-400'
                      }`
                    }
                  >
                    <LayoutDashboard className="w-4 h-4 flex-shrink-0" /> My Dashboard
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 py-3.5 px-5 font-heading text-sm uppercase tracking-widest border-l-4 transition-colors ${
                        isActive ? 'text-army-700 border-army-600 bg-army-50' : 'text-gray-700 border-transparent hover:text-army-700 hover:border-army-400 hover:bg-gray-50'
                      }`
                    }
                  >
                    <User className="w-4 h-4 flex-shrink-0" /> My Profile
                  </NavLink>
                  <NavLink
                    to="/my-registrations"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 py-3.5 px-5 font-heading text-sm uppercase tracking-widest border-l-4 transition-colors ${
                        isActive ? 'text-army-700 border-army-600 bg-army-50' : 'text-gray-700 border-transparent hover:text-army-700 hover:border-army-400 hover:bg-gray-50'
                      }`
                    }
                  >
                    <ClipboardList className="w-4 h-4 flex-shrink-0" /> My Registrations
                  </NavLink>
                  <NavLink
                    to="/polls"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 py-3.5 px-5 font-heading text-sm uppercase tracking-widest border-l-4 transition-colors ${
                        isActive ? 'text-army-700 border-army-600 bg-army-50' : 'text-gray-700 border-transparent hover:text-army-700 hover:border-army-400 hover:bg-gray-50'
                      }`
                    }
                  >
                    <ClipboardList className="w-4 h-4 flex-shrink-0" /> Session Polls
                  </NavLink>
                </div>
              )}

              {/* Extra bottom spacer so last item isn't flush with footer */}
              <div className="h-4" />
            </nav>
          </div>

          {/* Drawer Footer — always visible at bottom */}
          <div className="flex-shrink-0 px-5 py-4 border-t border-gray-200 bg-gray-50">
            {currentUser ? (
              <div>
                <p className="font-heading text-xs text-army-700 uppercase tracking-widest truncate">{userProfile?.name || 'Cadet'}</p>
                <p className="text-gray-500 text-xs mb-3">{userProfile?.regimentalNo || ''}</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-heading text-xs uppercase tracking-wider transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary block w-full text-center py-3 text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

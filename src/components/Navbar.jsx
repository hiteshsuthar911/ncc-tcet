import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User, ChevronDown, ClipboardList, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { currentUser, userProfile, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

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
    { to: '/achievements', label: 'Achievements' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-military-dark/95 backdrop-blur-sm border-b border-army-800 shadow-lg shadow-black/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/ncc-logo.svg"
              alt="NCC Logo"
              className="h-14 w-auto object-contain drop-shadow-md flex-shrink-0"
              style={{ maxHeight: '56px' }}
            />
            <div>
              <p className="font-heading text-sm tracking-[0.3em] text-gold-400 uppercase leading-none">
                NCC TCET
              </p>
              <p className="font-body text-xs text-army-400 leading-none mt-0.5">
                National Cadet Corps
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
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
                  className="flex items-center gap-2 text-army-300 hover:text-gold-400 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-army-700 border border-army-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="font-heading text-xs uppercase tracking-wider">
                    {userProfile?.regimentalNo || 'Cadet'}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-army-950 border border-army-700 shadow-xl shadow-black/50 z-50">
                    <div className="px-4 py-3 border-b border-army-800">
                      <p className="text-gold-400 font-heading text-xs uppercase tracking-wider">
                        {userProfile?.name || 'Cadet'}
                      </p>
                      <p className="text-army-400 text-xs mt-0.5">
                        {userProfile?.rank || userProfile?.regimentalNo || ''}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 w-full px-4 py-3 text-army-300 hover:text-gold-400 hover:bg-army-900 transition-colors duration-200 font-heading text-xs uppercase tracking-wider"
                    >
                      <User className="w-3.5 h-3.5" /> My Profile
                    </Link>
                    <Link
                      to="/my-registrations"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 w-full px-4 py-3 text-army-300 hover:text-gold-400 hover:bg-army-900 transition-colors duration-200 font-heading text-xs uppercase tracking-wider"
                    >
                      <ClipboardList className="w-3.5 h-3.5" /> My Registrations
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 w-full px-4 py-3 text-army-300 hover:text-gold-400 hover:bg-army-900 transition-colors duration-200 font-heading text-xs uppercase tracking-wider border-t border-army-800"
                      >
                        <Settings className="w-3.5 h-3.5" /> Admin Portal
                      </Link>
                    )}
                    <div className="border-t border-army-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-army-300 hover:text-red-400 hover:bg-army-900 transition-colors duration-200 font-heading text-xs uppercase tracking-wider"
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
            className="lg:hidden text-army-300 hover:text-gold-400 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-military-dark border-t border-army-800">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 font-heading text-sm uppercase tracking-widest border-l-2 transition-all duration-200 ${
                    isActive
                      ? 'text-gold-400 border-gold-500 bg-army-900'
                      : 'text-army-300 border-transparent hover:text-gold-400 hover:border-army-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 font-heading text-sm uppercase tracking-widest border-l-2 transition-all duration-200 ${
                    isActive
                      ? 'text-gold-400 border-gold-500 bg-army-900'
                      : 'text-army-300 border-transparent hover:text-gold-400 hover:border-army-600'
                  }`
                }
              >
                Admin Portal
              </NavLink>
            )}
            {currentUser ? (
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-3 px-4 text-army-300 hover:text-gold-400 font-heading text-sm uppercase tracking-widest border-l-2 border-transparent hover:border-army-600 transition-all duration-200"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <Link
                    to="/my-registrations"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-3 px-4 text-army-300 hover:text-gold-400 font-heading text-sm uppercase tracking-widest border-l-2 border-transparent hover:border-army-600 transition-all duration-200"
                  >
                    <ClipboardList className="w-4 h-4" /> My Registrations
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false) }}
                    className="flex items-center gap-2 text-red-400 font-heading text-sm uppercase tracking-wider px-4 py-3 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gold-400 font-heading text-sm uppercase tracking-wider"
                >
                  Login
                </Link>
              )}
          </div>
        </div>
      )}
    </nav>
  )
}

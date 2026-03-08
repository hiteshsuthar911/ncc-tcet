import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sign in with regimental number mapped to email
  async function login(regimentalNo, password) {
    // Regimental number is used as the email prefix: regNo@ncc-tcet.in
    const email = `${regimentalNo.toLowerCase()}@ncc-tcet.in`
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid))
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data())
          }
        } catch {
          // Profile may not exist yet; ignore
        }
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    logout,
    isAdmin: userProfile?.role === 'admin',
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d1109',
          gap: '20px',
        }}
      >
        {/* Shield icon */}
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L40 10V22C40 31 33 39 24 44C15 39 8 31 8 22V10L24 4Z"
            fill="#1a2214" stroke="#b8860b" strokeWidth="1.5"
          />
          <path d="M24 12L33 15.5V22C33 27.5 29 32.5 24 35.5C19 32.5 15 27.5 15 22V15.5L24 12Z"
            fill="#111808" stroke="#d4a017" strokeWidth="1"
          />
          <text x="24" y="27" fontFamily="Arial" fontSize="10" fontWeight="900"
            textAnchor="middle" fill="#d4a017" letterSpacing="1"
          >NCC</text>
        </svg>
        {/* Spinner */}
        <div
          style={{
            width: '28px',
            height: '28px',
            border: '2px solid #2a3520',
            borderTop: '2px solid #d4a017',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#6b7d60', fontFamily: 'sans-serif', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' }}>
          Initializing
        </p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

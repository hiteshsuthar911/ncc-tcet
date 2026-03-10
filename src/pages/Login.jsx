import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Shield, Eye, EyeOff, Lock, Hash, AlertTriangle, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import toast from 'react-hot-toast'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  async function onSubmit({ regimentalNo, password }) {
    setLoading(true)
    try {
      const credential = await login(regimentalNo.trim(), password)
      // Fetch role from Firestore to redirect correctly
      let role = 'cadet'
      try {
        const profileSnap = await getDoc(doc(db, 'users', credential.user.uid))
        if (profileSnap.exists()) role = profileSnap.data()?.role || 'cadet'
      } catch { /* profile may not exist */ }

      if (role === 'admin') {
        toast.success('Welcome, Admin!', { icon: '🛡️' })
        navigate('/admin', { replace: true })
      } else {
        toast.success('Welcome back, Cadet!')
        const dest = from && from !== '/' && !from.startsWith('/admin') ? from : '/dashboard'
        navigate(dest, { replace: true })
      }
    } catch (err) {
      let msg = 'Login failed. Please try again.'
      const code = err.code || ''
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        msg = 'Regimental No. or password is incorrect.'
      } else if (code === 'auth/too-many-requests') {
        msg = 'Account temporarily locked. Try again later.'
      } else if (code === 'auth/network-request-failed') {
        msg = 'Network error. Check your internet connection.'
      } else if (code === 'auth/configuration-not-found' || code === 'auth/operation-not-allowed') {
        msg = 'Authentication not enabled. Enable Email/Password in Firebase Console.'
      }
      toast.error(msg, { duration: 5000 })
      console.error('Login error:', code, err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-camo-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-military-darker via-military-dark to-army-900" />

      {/* Decorative */}
      <div className="absolute top-20 left-10 w-20 h-20 border-t-2 border-l-2 border-gold-500/30" />
      <div className="absolute bottom-20 right-10 w-20 h-20 border-b-2 border-r-2 border-gold-500/30" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-army-700 border-2 border-gold-500 items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="font-heading text-3xl text-white uppercase tracking-widest">
            NCC TCET
          </h1>
          <p className="text-gray-300 font-body text-sm mt-1">Cadet &amp; Admin Portal</p>
        </div>

        {/* Login Form */}
        <div className="card-army relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          <div className="p-8">
            <h2 className="font-heading text-lg text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="h-px w-4 bg-gold-500 inline-block" />
              Sign In
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Regimental No */}
              <div>
                <label className="label-field">
                  Regimental No. <span className="text-gold-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
                  <input
                    type="text"
                    placeholder="e.g. MH-01234"
                    autoCapitalize="characters"
                    {...register('regimentalNo', {
                      required: 'Regimental number is required',
                      minLength: { value: 3, message: 'Enter a valid regimental number' },
                    })}
                    className={`input-field pl-10 ${errors.regimentalNo ? 'border-red-700' : ''}`}
                  />
                </div>
                {errors.regimentalNo && (
                  <p className="flex items-center gap-1 text-red-400 text-xs mt-1 font-body">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.regimentalNo.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label-field">
                  Password <span className="text-gold-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-700' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-army-500 hover:text-army-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1 text-red-400 text-xs mt-1 font-body">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-army-800 space-y-3">
              <div className="flex items-start gap-2 bg-gold-950/30 border border-gold-900/50 p-3">
                <ShieldCheck className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                <p className="text-army-400 text-xs font-body leading-relaxed">
                  <strong className="text-gold-400">Admins</strong> are automatically redirected to the Admin Dashboard upon login.
                </p>
              </div>
              <p className="text-gray-400 text-xs font-body text-center">
                Access is restricted to registered NCC cadets and staff of TCET.
              </p>
              <p className="text-center">
                <Link
                  to="/reset-password"
                  className="text-gold-500 hover:text-gold-300 text-xs font-body transition-colors"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-army-500 hover:text-gold-400 text-xs font-body transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>


      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Shield, Eye, EyeOff, Lock, Hash, AlertTriangle, Info } from 'lucide-react'
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
        msg = 'Authentication not enabled. Contact administrator.'
      }
      toast.error(msg, { duration: 5000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 pb-8">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 55%, #1d4ed8 100%)' }} />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-saffron-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-navy-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-saffron-400" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white">NCC TCET</h1>
          <p className="text-white/70 font-body text-sm mt-1">Cadet &amp; Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Card top accent */}
          <div className="h-1.5 bg-gradient-to-r from-navy-800 via-navy-600 to-saffron-500" />

          <div className="p-8">
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-6">Sign In to Your Account</h2>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Regimental No */}
              <div>
                <label className="label-field">Regimental No. <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. MH-01234"
                    autoCapitalize="characters"
                    {...register('regimentalNo', {
                      required: 'Regimental number is required',
                      minLength: { value: 3, message: 'Enter a valid regimental number' },
                    })}
                    className={`input-field pl-10 ${errors.regimentalNo ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                  />
                </div>
                {errors.regimentalNo && (
                  <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 font-body">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.regimentalNo.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label-field">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 font-body">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-heading font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
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

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <div className="flex items-start gap-2.5 bg-navy-50 border border-navy-100 rounded-xl p-3.5">
                <Info className="w-4 h-4 text-navy-600 mt-0.5 shrink-0" />
                <p className="text-navy-700 text-xs font-body leading-relaxed">
                  <strong className="font-semibold">Admins</strong> are automatically redirected to the Admin Dashboard upon login.
                </p>
              </div>
              <p className="text-gray-400 text-xs font-body text-center">
                Access is restricted to registered NCC cadets and staff of TCET.
              </p>
              <p className="text-center text-gray-400 text-xs font-body">
                Forgot your password?{' '}
                <Link to="/reset-password" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
                  Reset it here
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs font-body mt-6">
          &copy; {new Date().getFullYear()} NCC TCET — Thakur College of Engineering &amp; Technology
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../../firebase/config'
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle, Lock, Hash, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminAddAdmin() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(null)

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm()

  async function onSubmit(data) {
    setLoading(true)
    const email = `${data.regimentalNo.toLowerCase().trim()}@ncc-tcet.in`
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, data.password)
      const uid = credential.user.uid

      await setDoc(doc(db, 'users', uid), {
        uid,
        name:         data.name.trim(),
        regimentalNo: data.regimentalNo.trim().toUpperCase(),
        email,
        phone:        data.phone?.trim() || '',
        role:         'admin',
        rank:         'Admin',
        wing:         'HQ',
        createdAt:    serverTimestamp(),
      })

      setCreated({ name: data.name, regimentalNo: data.regimentalNo.trim().toUpperCase(), email })
      toast.success(`Admin "${data.name}" created successfully`)
      reset()
    } catch (err) {
      let msg = 'Failed to create admin account.'
      if (err.code === 'auth/email-already-in-use') {
        msg = `Regimental No. "${data.regimentalNo}" is already registered.`
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password must be at least 6 characters.'
      }
      toast.error(msg, { duration: 5000 })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-lg">
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-white uppercase tracking-widest">Add Admin</h1>
        <p className="text-army-400 font-body text-sm mt-1">Create a new admin account with full dashboard access</p>
        <div className="h-px w-16 bg-gold-500 mt-3" />
      </div>

      {/* Success Banner */}
      {created && (
        <div className="mb-6 border border-green-800 bg-green-950/30 p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-green-300 font-heading text-sm uppercase tracking-widest">Admin Created</p>
            <p className="text-army-300 font-body text-xs mt-1">
              <strong className="text-white">{created.name}</strong> ({created.regimentalNo}) can now log in with their regimental ID and password.
            </p>
          </div>
        </div>
      )}

      <div className="card-army relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="p-6 space-y-5">

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="label-field">Full Name <span className="text-gold-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
                <input
                  type="text"
                  placeholder="e.g. Hitesh Suthar"
                  {...register('name', { required: 'Full name is required' })}
                  className={`input-field pl-10 ${errors.name ? 'border-red-700' : ''}`}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 font-body flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />{errors.name.message}
                </p>
              )}
            </div>

            {/* Regimental / Admin ID */}
            <div>
              <label className="label-field">Admin ID / Regimental No. <span className="text-gold-500">*</span></label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
                <input
                  type="text"
                  placeholder="e.g. ADMIN001"
                  autoCapitalize="characters"
                  {...register('regimentalNo', {
                    required: 'Admin ID is required',
                    minLength: { value: 3, message: 'At least 3 characters' },
                    pattern: { value: /^[a-zA-Z0-9_-]+$/, message: 'Letters, numbers, - and _ only' },
                  })}
                  className={`input-field pl-10 ${errors.regimentalNo ? 'border-red-700' : ''}`}
                />
              </div>
              {errors.regimentalNo ? (
                <p className="text-red-400 text-xs mt-1 font-body flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />{errors.regimentalNo.message}
                </p>
              ) : (
                <p className="text-army-600 text-xs mt-1 font-body">
                  Login ID: <span className="text-army-400">{watch('regimentalNo') ? watch('regimentalNo').toLowerCase() + '@ncc-tcet.in' : '—'}</span>
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="label-field">Phone (optional)</label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                {...register('phone')}
                className="input-field"
              />
            </div>

            {/* Password */}
            <div>
              <label className="label-field">Password <span className="text-gold-500">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                  })}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-700' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-army-500 hover:text-army-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 font-body flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />{errors.password.message}
                </p>
              )}
            </div>

            {/* Info box */}
            <div className="border border-army-800 bg-army-900/40 p-3">
              <p className="text-army-500 text-xs font-body leading-relaxed">
                The new admin will log in using their <strong className="text-army-300">Admin ID</strong> as the regimental number on the login page. They will be automatically redirected to the Admin Dashboard.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating Admin…
                </>
              ) : (
                <><Shield className="w-4 h-4" /> Create Admin Account</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

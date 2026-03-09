/**
 * /setup — One-time admin bootstrap page.
 * Creates a Firebase Auth user + Firestore profile with role: 'admin'.
 * Protected by a setup key so random users can't create admins.
 * Default setup key: NCC-SETUP-2026 (change SETUP_KEY below after first use)
 */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
} from 'firebase/auth'
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle, Lock, Trash2, UserX } from 'lucide-react'
import toast from 'react-hot-toast'

const SETUP_KEY = 'NCC-SETUP-2026'

export default function Setup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showDelPassword, setShowDelPassword] = useState(false)
  const [tab, setTab] = useState('create') // 'create' | 'delete'
  const [step, setStep] = useState('key') // 'key' | 'form' | 'done'
  const [keyInput, setKeyInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [delLoading, setDelLoading] = useState(false)
  const [createdAdmin, setCreatedAdmin] = useState(null)
  const [deletedId, setDeletedId] = useState(null)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const delForm = useForm()

  function checkKey(e) {
    e.preventDefault()
    if (keyInput.trim() === SETUP_KEY) {
      setStep('form')
    } else {
      toast.error('Invalid setup key')
    }
  }

  async function handleDelete(data) {
    setDelLoading(true)
    const email = `${data.regimentalNo.toLowerCase().trim()}@ncc-tcet.in`
    try {
      // Sign in as that user then delete them
      const credential = await signInWithEmailAndPassword(auth, email, data.password)
      const uid = credential.user.uid
      // Delete Firestore doc
      await deleteDoc(doc(db, 'users', uid))
      // Delete Firebase Auth user
      await deleteUser(credential.user)
      setDeletedId(data.regimentalNo.trim().toUpperCase())
      toast.success(`User "${data.regimentalNo.toUpperCase()}" deleted`)
      delForm.reset()
    } catch (err) {
      let msg = 'Failed to delete user.'
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Incorrect Regimental No. or password.'
      }
      toast.error(msg, { duration: 5000 })
      console.error(err)
    } finally {
      setDelLoading(false)
    }
  }

  async function onSubmit(data) {
    setLoading(true)
    const email = `${data.regimentalNo.toLowerCase().trim()}@ncc-tcet.in`
    try {
      // Create Firebase Auth user
      const credential = await createUserWithEmailAndPassword(auth, email, data.password)
      const uid = credential.user.uid

      // Write Firestore profile with admin role
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

      setCreatedAdmin({
        name: data.name,
        regimentalNo: data.regimentalNo.trim().toUpperCase(),
        email,
      })
      setStep('done')
      toast.success('Admin account created!')
    } catch (err) {
      let msg = 'Failed to create admin.'
      if (err.code === 'auth/email-already-in-use') {
        msg = `A user with regimental no. "${data.regimentalNo}" already exists.`
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 bg-military-darker">
      <div className="absolute inset-0 bg-gradient-to-br from-military-darker via-military-dark to-army-900" />
      <div className="absolute top-20 left-10 w-20 h-20 border-t-2 border-l-2 border-gold-500/20" />
      <div className="absolute bottom-20 right-10 w-20 h-20 border-b-2 border-r-2 border-gold-500/20" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-army-700 border-2 border-gold-500 items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="font-heading text-2xl text-white uppercase tracking-widest">Admin Setup</h1>
          <p className="text-army-400 font-body text-sm mt-1">NCC TCET — Admin management utility</p>
        </div>

        {/* Tab switcher */}
        <div className="flex mb-0 border border-army-700">
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-2 font-heading text-xs uppercase tracking-widest transition-colors ${tab === 'create' ? 'bg-gold-900/40 text-gold-400 border-b-2 border-gold-500' : 'text-army-500 hover:text-white'}`}
          >
            Create Admin
          </button>
          <button
            onClick={() => setTab('delete')}
            className={`flex-1 py-2 font-heading text-xs uppercase tracking-widest transition-colors ${tab === 'delete' ? 'bg-red-900/30 text-red-400 border-b-2 border-red-600' : 'text-army-500 hover:text-white'}`}
          >
            Remove User
          </button>
        </div>

        <div className="card-army relative overflow-hidden" style={{ borderTop: 'none' }}>
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

          {/* Step 1: Setup Key */}
          {tab === 'create' && (<>
          {step === 'key' && (
            <div className="p-8">
              <h2 className="font-heading text-sm text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                <span className="h-px w-4 bg-gold-500 inline-block" /> Setup Key Required
              </h2>
              <p className="text-army-500 font-body text-xs mb-6">
                Enter the setup key to proceed. Contact your system administrator if you don't have it.
              </p>
              <form onSubmit={checkKey} className="space-y-4">
                <div>
                  <label className="label-field">Setup Key <span className="text-gold-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
                    <input
                      type="password"
                      value={keyInput}
                      onChange={e => setKeyInput(e.target.value)}
                      placeholder="Enter setup key"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full">
                  Verify Key
                </button>
              </form>
              <div className="mt-6 pt-4 border-t border-army-800 text-center">
                <Link to="/login" className="text-army-500 hover:text-gold-400 text-xs font-body transition-colors">
                  ← Back to Login
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Admin Creation Form */}
          {step === 'form' && (
            <div className="p-8">
              <h2 className="font-heading text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="h-px w-4 bg-gold-500 inline-block" /> Create Admin Account
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                {/* Name */}
                <div>
                  <label className="label-field">Full Name <span className="text-gold-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Hitesh Suthar"
                    {...register('name', { required: 'Name is required' })}
                    className={`input-field ${errors.name ? 'border-red-700' : ''}`}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1 font-body flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.name.message}</p>}
                </div>

                {/* Regimental No */}
                <div>
                  <label className="label-field">Regimental No. / Admin ID <span className="text-gold-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. ADMIN001"
                    {...register('regimentalNo', {
                      required: 'Regimental / Admin ID is required',
                      minLength: { value: 3, message: 'At least 3 characters' },
                      pattern: { value: /^[a-zA-Z0-9_-]+$/, message: 'Letters, numbers, - and _ only' },
                    })}
                    className={`input-field ${errors.regimentalNo ? 'border-red-700' : ''}`}
                  />
                  {errors.regimentalNo && <p className="text-red-400 text-xs mt-1 font-body flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.regimentalNo.message}</p>}
                  <p className="text-army-600 text-xs mt-1 font-body">Login email will be: <span className="text-army-400">{watch('regimentalNo') ? watch('regimentalNo').toLowerCase() + '@ncc-tcet.in' : '…@ncc-tcet.in'}</span></p>
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
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-army-500 hover:text-army-300 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1 font-body flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.password.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Creating…</>
                  ) : (
                    <><Shield className="w-4 h-4" /> Create Admin Account</>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 3: Done */}
          {step === 'done' && createdAdmin && (
            <div className="p-8 text-center space-y-5">
              <CheckCircle className="w-14 h-14 text-green-400 mx-auto" />
              <h2 className="font-heading text-lg text-white uppercase tracking-widest">Admin Created!</h2>
              <div className="bg-army-900/60 border border-army-700 p-4 text-left space-y-2">
                <div><p className="text-army-500 text-xs font-body uppercase tracking-widest">Name</p><p className="text-white font-body text-sm">{createdAdmin.name}</p></div>
                <div><p className="text-army-500 text-xs font-body uppercase tracking-widest">Regimental / Admin ID</p><p className="text-white font-body text-sm">{createdAdmin.regimentalNo}</p></div>
                <div><p className="text-army-500 text-xs font-body uppercase tracking-widest">Login Email</p><p className="text-white font-body text-sm break-all">{createdAdmin.email}</p></div>
              </div>
              <p className="text-army-500 text-xs font-body">
                Use the <strong className="text-gold-400">Regimental / Admin ID</strong> and your chosen password to log in.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" /> Go to Login
              </button>
            </div>
          )}
          </>)}

          {/* ── Remove User Tab ── */}
          {tab === 'delete' && (
            <div className="p-8">
              <h2 className="font-heading text-sm text-red-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                <UserX className="w-4 h-4" /> Remove User
              </h2>
              <p className="text-army-500 font-body text-xs mb-6">
                Sign in as the user to permanently delete their account and Firestore profile.
              </p>

              {deletedId && (
                <div className="mb-4 border border-green-800 bg-green-950/30 p-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  <p className="text-green-300 font-body text-xs">User <strong>{deletedId}</strong> deleted successfully.</p>
                </div>
              )}

              <form onSubmit={delForm.handleSubmit(handleDelete)} noValidate className="space-y-4">
                <div>
                  <label className="label-field">Regimental No. / Admin ID <span className="text-gold-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. ADMIN001"
                    {...delForm.register('regimentalNo', { required: 'Required' })}
                    className={`input-field ${delForm.formState.errors.regimentalNo ? 'border-red-700' : ''}`}
                  />
                </div>
                <div>
                  <label className="label-field">Password <span className="text-gold-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
                    <input
                      type={showDelPassword ? 'text' : 'password'}
                      placeholder="Current password of that account"
                      {...delForm.register('password', { required: 'Required' })}
                      className={`input-field pl-10 pr-10 ${delForm.formState.errors.password ? 'border-red-700' : ''}`}
                    />
                    <button type="button" onClick={() => setShowDelPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-army-500 hover:text-army-300 transition-colors">
                      {showDelPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={delLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-900/50 border border-red-700 text-red-300 font-heading text-xs uppercase tracking-widest hover:bg-red-800 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {delLoading ? (
                    <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Deleting…</>
                  ) : (
                    <><Trash2 className="w-4 h-4" /> Delete This User</>
                  )}
                </button>
              </form>
              <div className="mt-6 pt-4 border-t border-army-800 text-center">
                <Link to="/login" className="text-army-500 hover:text-gold-400 text-xs font-body transition-colors">
                  ← Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase/config'
import { doc, updateDoc } from 'firebase/firestore'
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { useForm } from 'react-hook-form'
import {
  User,
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  Award,
  Calendar,
  Phone,
  Mail,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function CadetProfile() {
  const { currentUser, userProfile } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [changingPwd, setChangingPwd] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPwd, setSavingPwd] = useState(false)

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: userProfile?.name || '',
      phone: userProfile?.phone || '',
      wing: userProfile?.wing || '',
      rank: userProfile?.rank || '',
      batch: userProfile?.batch || '',
    },
  })

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    watch: watchPwd,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm()

  async function onSaveProfile(data) {
    setSavingProfile(true)
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: data.name,
        phone: data.phone,
        wing: data.wing,
        rank: data.rank,
        batch: data.batch,
      })
      toast.success('Profile updated successfully!')
      setEditMode(false)
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  async function onChangePassword(data) {
    setSavingPwd(true)
    try {
      const email = `${userProfile?.regimentalNo?.toLowerCase()}@ncc-tcet.in`
      const credential = EmailAuthProvider.credential(email, data.currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, data.newPassword)
      toast.success('Password changed successfully!')
      resetPwd()
      setChangingPwd(false)
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        toast.error('Current password is incorrect.')
      } else {
        toast.error('Failed to change password. Try again.')
      }
    } finally {
      setSavingPwd(false)
    }
  }

  const newPwd = watchPwd('newPassword')

  const field = (label, value) => (
    <div>
      <p className="text-gray-400 font-body text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className="text-gray-900 font-body text-sm">{value || '—'}</p>
    </div>
  )

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="relative py-14 bg-army-900 overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-subtitle text-gold-400">Cadet</p>
          <h1 className="section-title text-4xl mb-2 text-white">My Profile</h1>
          <div className="divider-gold w-20 mt-3" />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* ── Identity Card ── */}
        <div className="card-army relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          <div className="absolute left-0 top-0 w-1 h-full bg-gold-500" />
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-army-800 border-2 border-gold-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-gold-400" />
                </div>
                <div>
                  <h2 className="font-heading text-xl text-white uppercase tracking-widest">
                    {userProfile?.name || 'Cadet'}
                  </h2>
                  <p className="text-gold-400 font-body text-sm mt-0.5">
                    {userProfile?.regimentalNo || '—'}
                  </p>
                  <span className="badge-rank mt-1 inline-flex">
                    {userProfile?.role === 'admin' ? 'Administrator' : userProfile?.rank || 'Cadet'}
                  </span>
                </div>
              </div>
              {userProfile?.role !== 'admin' && !editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="btn-secondary text-xs py-2"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleProfile(onSaveProfile)} noValidate>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label-field">Full Name <span className="text-gold-500">*</span></label>
                    <input
                      type="text"
                      {...regProfile('name', { required: 'Name is required' })}
                      className={`input-field ${profileErrors.name ? 'border-red-700' : ''}`}
                    />
                    {profileErrors.name && (
                      <p className="text-red-400 text-xs mt-1 flex gap-1 items-center">
                        <AlertTriangle className="w-3 h-3" />{profileErrors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-field">Phone</label>
                    <input
                      type="tel"
                      {...regProfile('phone')}
                      className="input-field"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <div>
                    <label className="label-field">Wing / Branch</label>
                    <select {...regProfile('wing')} className="select-field">
                      <option value="">— Select Wing —</option>
                      <option value="Army">Army</option>
                      <option value="Naval">Naval</option>
                      <option value="Air">Air</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Rank</label>
                    <input
                      type="text"
                      {...regProfile('rank')}
                      className="input-field"
                      placeholder="e.g. Cadet / JDUO / SUO"
                    />
                  </div>
                  <div>
                    <label className="label-field">Batch / Year</label>
                    <input
                      type="text"
                      {...regProfile('batch')}
                      className="input-field"
                      placeholder="e.g. 2023-24"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingProfile ? 'Saving...' : <><CheckCircle className="w-4 h-4" /> Save Changes</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="btn-secondary text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid sm:grid-cols-3 gap-6">
                {field('Regimental No.', userProfile?.regimentalNo)}
                {field('Wing / Branch', userProfile?.wing)}
                {field('Rank', userProfile?.rank)}
                {field('Batch / Year', userProfile?.batch)}
                {field('Phone', userProfile?.phone)}
                {field('Email Used', `${userProfile?.regimentalNo?.toLowerCase()}@ncc-tcet.in`)}
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/my-registrations"
            className="card-army p-5 flex items-center gap-4 hover:bg-army-900 transition-colors group"
          >
            <div className="w-10 h-10 bg-army-800 border border-gold-500/30 flex items-center justify-center group-hover:border-gold-500 transition-colors">
              <Award className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="font-heading text-sm text-gray-900 uppercase tracking-wide">My Registrations</p>
              <p className="text-army-400 font-body text-xs mt-0.5">Track event registration status</p>
            </div>
          </Link>
          <Link
            to="/events"
            className="card-army p-5 flex items-center gap-4 hover:bg-army-900 transition-colors group"
          >
            <div className="w-10 h-10 bg-army-800 border border-gold-500/30 flex items-center justify-center group-hover:border-gold-500 transition-colors">
              <Calendar className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="font-heading text-sm text-gray-900 uppercase tracking-wide">Browse Events</p>
              <p className="text-army-400 font-body text-xs mt-0.5">Register for upcoming events</p>
            </div>
          </Link>
        </div>

        {/* ── Change Password ── */}
        {!changingPwd ? (
          <div className="card-army p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gold-500" />
              <div>
                <p className="font-heading text-sm text-gray-900 uppercase tracking-wide">Password</p>
                <p className="text-army-500 font-body text-xs">Change your login password</p>
              </div>
            </div>
            <button onClick={() => setChangingPwd(true)} className="btn-secondary text-xs py-2">
              Change Password
            </button>
          </div>
        ) : (
          <div className="card-army relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-gold-500" />
            <div className="p-6 sm:p-8">
              <h3 className="font-heading text-base text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold-500" /> Change Password
              </h3>
              <form onSubmit={handlePwd(onChangePassword)} noValidate>
                <div className="space-y-4 max-w-sm">
                  <div>
                    <label className="label-field">Current Password <span className="text-gold-500">*</span></label>
                    <input
                      type="password"
                      {...regPwd('currentPassword', { required: 'Current password is required' })}
                      className={`input-field ${pwdErrors.currentPassword ? 'border-red-700' : ''}`}
                      autoComplete="current-password"
                    />
                    {pwdErrors.currentPassword && (
                      <p className="text-red-400 text-xs mt-1 flex gap-1 items-center">
                        <AlertTriangle className="w-3 h-3" />{pwdErrors.currentPassword.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-field">New Password <span className="text-gold-500">*</span></label>
                    <input
                      type="password"
                      {...regPwd('newPassword', {
                        required: 'New password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                      })}
                      className={`input-field ${pwdErrors.newPassword ? 'border-red-700' : ''}`}
                      autoComplete="new-password"
                    />
                    {pwdErrors.newPassword && (
                      <p className="text-red-400 text-xs mt-1 flex gap-1 items-center">
                        <AlertTriangle className="w-3 h-3" />{pwdErrors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-field">Confirm New Password <span className="text-gold-500">*</span></label>
                    <input
                      type="password"
                      {...regPwd('confirmPassword', {
                        required: 'Please confirm your new password',
                        validate: (v) => v === newPwd || 'Passwords do not match',
                      })}
                      className={`input-field ${pwdErrors.confirmPassword ? 'border-red-700' : ''}`}
                      autoComplete="new-password"
                    />
                    {pwdErrors.confirmPassword && (
                      <p className="text-red-400 text-xs mt-1 flex gap-1 items-center">
                        <AlertTriangle className="w-3 h-3" />{pwdErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={savingPwd}
                    className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingPwd ? 'Updating...' : <><CheckCircle className="w-4 h-4" /> Update Password</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setChangingPwd(false); resetPwd() }}
                    className="btn-secondary text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Account Info ── */}
        <div className="card-army p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-gold-500" />
            <h3 className="font-heading text-sm text-white uppercase tracking-widest">Account Security</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 text-army-400 font-body">
              <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
              {currentUser?.email}
            </div>
            <div className="flex items-center gap-3 text-army-400 font-body">
              <Shield className="w-4 h-4 text-gold-500 flex-shrink-0" />
              Role: <span className="text-gray-900 ml-1 capitalize">{userProfile?.role || 'cadet'}</span>
            </div>
          </div>
          <div className="mt-4 border-t border-army-800 pt-4">
            <p className="text-army-600 font-body text-xs">
              ⚠ Your login email is auto-generated from your Regimental No. Contact your unit administrator to change it.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

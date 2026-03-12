import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { db, auth } from '../firebase/config'
import { doc, updateDoc } from 'firebase/firestore'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { User, Shield, Lock, CheckCircle, AlertTriangle, Award, Calendar, Mail, ChevronRight } from 'lucide-react'
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
    reset: resetProfile,
  } = useForm({ defaultValues: userProfile || {} })

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    formState: { errors: pwdErrors },
    reset: resetPwd,
    watch,
  } = useForm()

  const onSaveProfile = async (data) => {
    setSavingProfile(true)
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: data.displayName,
        phone: data.phone,
        rollNo: data.rollNo,
        branch: data.branch,
        year: data.year,
        wing: data.wing,
      })
      toast.success('Profile updated successfully!')
      setEditMode(false)
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  const onChangePassword = async (data) => {
    setSavingPwd(true)
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, data.currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, data.newPassword)
      toast.success('Password changed successfully!')
      resetPwd()
      setChangingPwd(false)
    } catch {
      toast.error('Incorrect current password or session expired.')
    } finally {
      setSavingPwd(false)
    }
  }

  const details = [
    { label: 'Full Name', value: userProfile?.displayName || '—' },
    { label: 'Roll No', value: userProfile?.rollNo || '—' },
    { label: 'Branch', value: userProfile?.branch || '—' },
    { label: 'Year', value: userProfile?.year || '—' },
    { label: 'Wing', value: userProfile?.wing || '—' },
    { label: 'Phone', value: userProfile?.phone || '—' },
  ]

  const quickLinks = [
    { label: 'My Registrations', to: '/my-registrations', icon: Calendar },
    { label: 'Cadet Dashboard', to: '/cadet-dashboard', icon: Shield },
    { label: 'Forms', to: '/forms', icon: Award },
    { label: 'Declaration Form', to: '/declaration', icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <div
        className="relative py-16 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 60%, #1d4ed8 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-saffron-400 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-1">
            {userProfile?.displayName || currentUser?.email}
          </h1>
          <span className="inline-block bg-saffron-500 text-white text-sm font-semibold px-4 py-1 rounded-full mt-2">
            {userProfile?.wing ? `${userProfile.wing} Wing Cadet` : 'NCC Cadet'}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Profile Details Card */}
        <div className="card-army p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold font-poppins text-navy-900">Profile Details</h2>
              <div className="w-10 h-1 bg-saffron-500 rounded-full mt-1" />
            </div>
            {!editMode && (
              <button onClick={() => setEditMode(true)} className="btn-primary px-4 py-2 text-sm">
                Edit Profile
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-navy-900 font-semibold">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleProfile(onSaveProfile)} className="space-y-4 border-l-4 border-navy-600 pl-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Full Name</label>
                  <input className="input-field" {...regProfile('displayName', { required: 'Required' })} />
                  {profileErrors.displayName && <p className="text-red-500 text-xs mt-1">{profileErrors.displayName.message}</p>}
                </div>
                <div>
                  <label className="label-field">Phone</label>
                  <input className="input-field" type="tel" {...regProfile('phone')} />
                </div>
                <div>
                  <label className="label-field">Roll No</label>
                  <input className="input-field" {...regProfile('rollNo')} />
                </div>
                <div>
                  <label className="label-field">Branch</label>
                  <input className="input-field" {...regProfile('branch')} />
                </div>
                <div>
                  <label className="label-field">Year</label>
                  <select className="select-field" {...regProfile('year')}>
                    <option value="">Select year</option>
                    {['FY', 'SY', 'TY', 'Final Year'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Wing</label>
                  <select className="select-field" {...regProfile('wing')}>
                    <option value="">Select wing</option>
                    {['Army', 'Naval', 'Air'].map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button type="submit" disabled={savingProfile} className="btn-primary px-5 py-2 text-sm">
                  {savingProfile ? 'Saving…' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => { setEditMode(false); resetProfile(userProfile || {}) }} className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password Card */}
        <div className="card-army p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-navy-700" />
              <h2 className="text-xl font-bold font-poppins text-navy-900">Change Password</h2>
            </div>
            {!changingPwd && (
              <button onClick={() => setChangingPwd(true)} className="btn-primary px-4 py-2 text-sm">
                Change
              </button>
            )}
          </div>

          {changingPwd && (
            <form onSubmit={handlePwd(onChangePassword)} className="space-y-4 border-l-4 border-saffron-500 pl-5">
              <div>
                <label className="label-field">Current Password</label>
                <input type="password" className="input-field" {...regPwd('currentPassword', { required: 'Required' })} />
                {pwdErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.currentPassword.message}</p>}
              </div>
              <div>
                <label className="label-field">New Password</label>
                <input type="password" className="input-field" {...regPwd('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                {pwdErrors.newPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.newPassword.message}</p>}
              </div>
              <div>
                <label className="label-field">Confirm New Password</label>
                <input type="password" className="input-field" {...regPwd('confirmPassword', {
                  required: 'Required',
                  validate: v => v === watch('newPassword') || 'Passwords do not match',
                })} />
                {pwdErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.confirmPassword.message}</p>}
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={savingPwd} className="btn-primary px-5 py-2 text-sm">
                  {savingPwd ? 'Updating…' : 'Update Password'}
                </button>
                <button type="button" onClick={() => { setChangingPwd(false); resetPwd() }} className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick Links */}
        <div className="card-army p-6">
          <h2 className="text-xl font-bold font-poppins text-navy-900 mb-1">Quick Links</h2>
          <div className="w-10 h-1 bg-saffron-500 rounded-full mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 bg-navy-50 hover:bg-navy-100 rounded-xl p-4 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-navy-800 text-sm flex-1">{label}</span>
                <ChevronRight className="w-4 h-4 text-saffron-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Account Email</p>
            <p className="text-amber-700 text-sm flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {currentUser?.email}
            </p>
            <p className="text-amber-600 text-xs mt-1">Email cannot be changed. Contact admin for assistance.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

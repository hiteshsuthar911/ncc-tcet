import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase/config'
import { Shield, Mail, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [sentTo, setSentTo]  = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm()

  async function onSubmit({ regimentalNo }) {
    const reg = regimentalNo.trim().toLowerCase()
    const email = reg.includes('@') ? reg : `${reg}@ncc-tcet.in`
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSentTo(email)
      setSent(true)
    } catch (err) {
      const code = err.code || ''
      let msg = 'Failed to send reset email. Try again.'
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        // Don't reveal whether user exists — always show success for security
        setSentTo(email)
        setSent(true)
        return
      } else if (code === 'auth/too-many-requests') {
        msg = 'Too many requests. Please wait a few minutes and try again.'
      } else if (code === 'auth/network-request-failed') {
        msg = 'Network error. Check your internet connection.'
      }
      toast.error(msg, { duration: 5000 })
      console.error('Password reset error:', code, err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-camo-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-military-darker via-military-dark to-army-900" />
      <div className="absolute top-20 left-10 w-20 h-20 border-t-2 border-l-2 border-gold-500/30" />
      <div className="absolute bottom-20 right-10 w-20 h-20 border-b-2 border-r-2 border-gold-500/30" />

      <div className="relative z-10 w-full max-w-md px-4 py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-army-700 border-2 border-gold-500 items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="font-heading text-3xl text-white uppercase tracking-widest">NCC TCET</h1>
          <p className="font-body text-army-400 text-sm mt-1 tracking-wider">Cadet Portal</p>
        </div>

        <div className="card-army p-8">
          {!sent ? (
            <>
              <h2 className="font-heading text-lg text-white uppercase tracking-widest mb-1">
                Reset Password
              </h2>
              <p className="font-body text-army-400 text-sm mb-6 leading-relaxed">
                Enter your Regimental No. and we'll send a password reset link to your registered email.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div>
                  <label className="label-field">Regimental No.</label>
                  <input
                    type="text"
                    placeholder="e.g. MH2024SDIA4200621"
                    autoComplete="username"
                    className={`input-field uppercase ${errors.regimentalNo ? 'border-red-700' : ''}`}
                    {...register('regimentalNo', { required: 'Regimental No. is required' })}
                  />
                  {errors.regimentalNo && (
                    <p className="mt-1.5 text-red-400 text-xs font-body flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3" /> {errors.regimentalNo.message}
                    </p>
                  )}
                  <p className="mt-2 text-army-500 text-xs font-body">
                    Your login email is &nbsp;<span className="text-army-300 font-mono">{'{regimentalNo}'}@ncc-tcet.in</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                >
                  <Mail className="w-4 h-4" />
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-900/40 border border-green-700/50 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <h2 className="font-heading text-lg text-white uppercase tracking-widest mb-3">
                Email Sent!
              </h2>
              <p className="font-body text-army-300 text-sm leading-relaxed mb-2">
                If an account exists for
              </p>
              <p className="font-mono text-gold-400 text-sm break-all mb-4">{sentTo}</p>
              <p className="font-body text-army-400 text-sm leading-relaxed mb-6">
                a password reset link has been sent. Check your inbox (and spam folder).
                The link expires in <span className="text-white">1 hour</span>.
              </p>
              <button
                onClick={() => { setSent(false); setSentTo('') }}
                className="btn-secondary text-sm"
              >
                Try a different Regimental No.
              </button>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-army-800 flex items-center justify-between">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-army-400 hover:text-white font-body text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
            <Link
              to="/join"
              className="text-gold-500 hover:text-gold-300 font-body text-sm transition-colors"
            >
              Join NCC
            </Link>
          </div>
        </div>

        <p className="text-center text-army-600 text-xs font-body mt-6 leading-relaxed">
          Contact your unit administrator if you don't receive the email or your account was created via import.
        </p>
      </div>
    </div>
  )
}

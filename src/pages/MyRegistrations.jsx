import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Printer,
  Shield,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

function statusConfig(status) {
  switch (status) {
    case 'approved':
      return { label: 'Approved', color: 'text-green-400 border-green-700 bg-green-900/20', icon: CheckCircle }
    case 'rejected':
      return { label: 'Rejected', color: 'text-red-400 border-red-700 bg-red-900/20', icon: XCircle }
    default:
      return { label: 'Pending', color: 'text-yellow-400 border-yellow-700 bg-yellow-900/20', icon: Clock }
  }
}

function ReceiptModal({ reg, userProfile, onClose }) {
  if (!reg) return null

  const [eventFields, setEventFields] = useState([])
  const [loadingFields, setLoadingFields] = useState(true)

  useEffect(() => {
    async function fetchEventFields() {
      try {
        const snap = await getDoc(doc(db, 'events', reg.eventId))
        if (snap.exists()) {
          setEventFields(snap.data().fields || [])
        }
      } catch {
        // If fetch fails, fall back to raw keys
      } finally {
        setLoadingFields(false)
      }
    }
    fetchEventFields()
  }, [reg.eventId])

  // Build a map of fieldId -> label from the event's field definitions
  const fieldLabelMap = eventFields.reduce((acc, f) => {
    acc[f.id] = f.label
    return acc
  }, {})

  const cadetName = reg.name || userProfile?.name || ''
  const regNo = reg.regimentalNo || userProfile?.regimentalNo || ''

  const formatTs = (ts) => {
    if (!ts) return '—'
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  }

  const { label, color } = statusConfig(reg.status)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 no-print" onClick={onClose} />

      {/* Printable area */}
      <div id="print-receipt" className="relative w-full max-w-lg bg-military-darker border border-army-700 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-army-800 no-print">
          <h3 className="font-heading text-lg text-white uppercase tracking-widest">Registration Receipt</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={onClose} className="text-army-500 hover:text-white transition-colors ml-2 text-xl leading-none">✕</button>
          </div>
        </div>

        {/* Receipt body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {/* Header */}
          <div className="text-center pb-4 border-b border-army-800">
            <p className="text-gold-500 font-heading text-xs uppercase tracking-widest mb-1">NCC TCET — 1 Maharashtra Naval Unit</p>
            <h2 className="font-heading text-lg text-white uppercase tracking-widest">Event Registration Receipt</h2>
          </div>

          {/* Reg ID + Status */}
          <div className="flex justify-between items-center bg-army-900 border border-army-700 px-4 py-3">
            <div>
              <p className="text-army-500 text-xs font-body uppercase tracking-widest mb-0.5">Registration ID</p>
              <p className="text-gold-400 font-heading text-xs tracking-widest">{reg.id}</p>
            </div>
            <span className={`font-heading text-xs uppercase tracking-wider border px-3 py-1 ${color}`}>
              {label}
            </span>
          </div>

          {/* Cadet */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card-army p-3">
              <p className="text-army-500 text-xs font-body uppercase tracking-widest mb-1">Cadet Name</p>
              <p className="text-white font-body text-sm">{cadetName || '—'}</p>
            </div>
            <div className="card-army p-3">
              <p className="text-army-500 text-xs font-body uppercase tracking-widest mb-1">Regimental No.</p>
              <p className="text-gold-400 font-heading text-sm">{regNo || '—'}</p>
            </div>
          </div>

          {/* Event */}
          <div className="card-army p-4">
            <p className="text-army-500 text-xs font-body uppercase tracking-widest mb-2">Event</p>
            <p className="text-white font-heading text-sm uppercase tracking-wide">{reg.eventTitle}</p>
          </div>

          {/* Form data with proper field labels */}
          {reg.formData && Object.entries(reg.formData).filter(([k]) => k !== 'declaration').length > 0 && (
            <div>
              <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-2">Submitted Information</p>
              {loadingFields ? (
                <p className="text-army-600 text-xs font-body">Loading field details…</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(reg.formData)
                    .filter(([k]) => k !== 'declaration')
                    .map(([key, val]) => {
                      const fieldLabel = fieldLabelMap[key] || key.replace(/field_\d+_[a-z0-9]+/i, '').replace(/_/g, ' ').trim() || key
                      return (
                        <div key={key} className="flex justify-between border-b border-army-800 pb-1.5 gap-4">
                          <span className="text-army-400 font-body text-xs capitalize flex-shrink-0">{fieldLabel}</span>
                          <span className="text-white font-body text-xs text-right">{typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}</span>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-end pt-3 border-t border-army-800 text-xs font-body">
            <div>
              <p className="text-army-500">Submitted</p>
              <p className="text-army-300">{formatTs(reg.submittedAt)}</p>
            </div>
            <p className="text-army-600">Keep this receipt for reference</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MyRegistrations() {
  const { currentUser, userProfile } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReg, setSelectedReg] = useState(null)

  useEffect(() => {
    if (!currentUser) return
    async function fetchMyRegs() {
      try {
        const snap = await getDocs(
          query(collection(db, 'registrations'), where('userId', '==', currentUser.uid))
        )
        const regs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.submittedAt?.seconds ?? 0) - (a.submittedAt?.seconds ?? 0))
        setRegistrations(regs)
      } catch (err) {
        console.warn('Could not load registrations:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMyRegs()
  }, [currentUser])

  const formatTs = (ts) => {
    if (!ts) return '—'
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const counts = {
    total: registrations.length,
    pending: registrations.filter((r) => !r.status || r.status === 'pending').length,
    approved: registrations.filter((r) => r.status === 'approved').length,
    rejected: registrations.filter((r) => r.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="relative py-14 bg-military-darker overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-subtitle">Tracking</p>
          <h1 className="section-title text-4xl mb-2">My Registrations</h1>
          <div className="divider-gold w-24 mt-3" />
          <p className="text-army-300 font-body mt-3 text-sm">Track all your event registrations and their approval status.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', count: counts.total, color: 'text-white' },
            { label: 'Pending', count: counts.pending, color: 'text-yellow-400' },
            { label: 'Approved', count: counts.approved, color: 'text-green-400' },
            { label: 'Rejected', count: counts.rejected, color: 'text-red-400' },
          ].map(({ label, count, color }) => (
            <div key={label} className="card-army p-4 text-center">
              <p className={`font-heading text-3xl ${color}`}>{loading ? '—' : count}</p>
              <p className="text-army-500 font-body text-xs uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-army-900 animate-pulse" />
            ))}
          </div>
        ) : registrations.length === 0 ? (
          <div className="card-army p-14 text-center">
            <ClipboardList className="w-14 h-14 text-army-800 mx-auto mb-4" />
            <h3 className="font-heading text-lg text-white uppercase tracking-widest mb-2">No Registrations Yet</h3>
            <p className="text-army-500 font-body text-sm mb-6">You haven't registered for any events.</p>
            <Link to="/events" className="btn-primary text-sm inline-flex items-center gap-2">
              <Shield className="w-4 h-4" /> Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {registrations.map((reg) => {
              const { label, color, icon: StatusIcon } = statusConfig(reg.status)
              return (
                <div
                  key={reg.id}
                  className="card-army relative overflow-hidden hover:bg-army-900 transition-colors group"
                >
                  {/* Status indicator stripe */}
                  <div
                    className={`absolute left-0 top-0 w-1 h-full ${
                      reg.status === 'approved' ? 'bg-green-500' :
                      reg.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                  />
                  <div className="p-5 pl-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <StatusIcon
                        className={`w-5 h-5 flex-shrink-0 ${
                          reg.status === 'approved' ? 'text-green-400' :
                          reg.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="font-heading text-sm text-white uppercase tracking-wide truncate">
                          {reg.eventTitle}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-army-500 font-body">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Submitted {formatTs(reg.submittedAt)}
                          </span>
                          <span className="text-army-700">|</span>
                          <span className="text-army-500">ID: {reg.id.slice(0, 10)}…</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`font-heading text-xs uppercase tracking-wider border px-2.5 py-1 ${color}`}>
                        {label}
                      </span>
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="text-army-500 hover:text-gold-400 transition-colors p-1"
                        title="View Receipt"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Approved message */}
                  {reg.status === 'approved' && (
                    <div className="mx-5 mb-4 pl-1 flex items-center gap-2 border-l-2 border-green-600 pl-3">
                      <p className="text-green-400 font-body text-xs">
                        ✓ Your registration has been approved. Report to the event as scheduled.
                      </p>
                    </div>
                  )}
                  {reg.status === 'rejected' && (
                    <div className="mx-5 mb-4 border-l-2 border-red-600 pl-3">
                      <p className="text-red-400 font-body text-xs">
                        ✗ Your registration was not approved. Contact your unit officer for details.
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Back to profile */}
        <div className="mt-6 text-center">
          <Link to="/profile" className="text-army-400 hover:text-gold-400 font-body text-sm transition-colors">
            ← Back to Profile
          </Link>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReg && (
        <ReceiptModal
          reg={selectedReg}
          userProfile={userProfile}
          onClose={() => setSelectedReg(null)}
        />
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
  doc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import {
  Calendar,
  ClipboardList,
  Users,
  ChevronRight,
  TrendingUp,
  Clock,
  UserPlus,
  FileText,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    pendingRegistrations: 0,
    totalCadets: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalDeclarations: 0,
    pendingDeclarations: 0,
  })
  const [recentRegs, setRecentRegs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showClearModal, setShowClearModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [clearing, setClearing] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [eventsSnap, activeSnap, regsSnap, pendingSnap, cadetsSnap, recentSnap, appsSnap, pendingAppsSnap, declSnap, pendingDeclSnap] =
          await Promise.all([
            getDocs(collection(db, 'events')),
            getDocs(query(collection(db, 'events'), where('isActive', '==', true))),
            getDocs(collection(db, 'registrations')),
            getDocs(query(collection(db, 'registrations'), where('status', '==', 'pending'))),
            getDocs(collection(db, 'users')),
            getDocs(
              query(
                collection(db, 'registrations'),
                orderBy('submittedAt', 'desc'),
                limit(5)
              )
            ),
            getDocs(collection(db, 'joinApplications')),
            getDocs(query(collection(db, 'joinApplications'), where('status', '==', 'pending'))),
            getDocs(collection(db, 'declarations')),
            getDocs(query(collection(db, 'declarations'), where('status', '==', 'pending'))),
          ])

        setStats({
          totalEvents: eventsSnap.size,
          activeEvents: activeSnap.size,
          totalRegistrations: regsSnap.size,
          pendingRegistrations: pendingSnap.size,
          totalCadets: cadetsSnap.size,
          totalApplications: appsSnap.size,
          pendingApplications: pendingAppsSnap.size,
          totalDeclarations: declSnap.size,
          pendingDeclarations: pendingDeclSnap.size,
        })
        setRecentRegs(recentSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch {
        // Firestore not yet configured; show zeros
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  async function clearAllData() {
    setClearing(true)
    const COLLECTIONS = [
      'events', 'registrations', 'users',
      'joinApplications', 'declarations', 'leaveApplications', 'attendance',
    ]
    try {
      for (const col of COLLECTIONS) {
        const snap = await getDocs(collection(db, col))
        // Firestore writeBatch max 500 ops
        const chunks = []
        for (let i = 0; i < snap.docs.length; i += 400) {
          chunks.push(snap.docs.slice(i, i + 400))
        }
        for (const chunk of chunks) {
          const batch = writeBatch(db)
          chunk.forEach(d => batch.delete(doc(db, col, d.id)))
          await batch.commit()
        }
      }
      toast.success('All data cleared successfully')
      setShowClearModal(false)
      setConfirmText('')
      // Reset stats
      setStats({
        totalEvents: 0, activeEvents: 0,
        totalRegistrations: 0, pendingRegistrations: 0,
        totalCadets: 0, totalApplications: 0,
        pendingApplications: 0, totalDeclarations: 0, pendingDeclarations: 0,
      })
      setRecentRegs([])
    } catch (e) {
      toast.error('Failed to clear data: ' + e.message)
    } finally {
      setClearing(false)
    }
  }

  const STAT_CARDS = [
    { label: 'Total Events', value: stats.totalEvents, sub: `${stats.activeEvents} Active`, icon: Calendar, color: 'text-gold-400' },
    { label: 'Registrations', value: stats.totalRegistrations, sub: `${stats.pendingRegistrations} Pending`, icon: ClipboardList, color: 'text-green-400' },
    { label: 'Cadets', value: stats.totalCadets, sub: 'Registered', icon: Users, color: 'text-blue-400' },
    { label: 'Join Applications', value: stats.totalApplications, sub: `${stats.pendingApplications} Pending`, icon: UserPlus, color: 'text-orange-400' },
    { label: 'Declarations', value: stats.totalDeclarations, sub: `${stats.pendingDeclarations} Pending`, icon: FileText, color: 'text-purple-400' },
    { label: 'Recent Activity', value: recentRegs.length, sub: 'Last 5 submissions', icon: TrendingUp, color: 'text-teal-400' },
  ]

  const formatTs = (ts) => {
    if (!ts) return '—'
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      <div className="mb-8">
        <p className="section-subtitle">Overview</p>
        <h2 className="font-heading text-2xl text-white uppercase tracking-widest">Dashboard</h2>
        <div className="h-px w-16 bg-gold-500 mt-2" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <Icon className={`w-5 h-5 ${color} mb-3`} />
            <p className="font-heading text-3xl text-white mb-0.5">
              {loading ? '—' : value}
            </p>
            <p className="font-body text-xs text-army-400 uppercase tracking-widest">{label}</p>
            <p className="font-body text-xs text-army-600 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card-army p-6">
          <h3 className="font-heading text-sm text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="h-px w-4 bg-gold-500 inline-block" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            {[
              { to: '/admin/events', label: 'Create New Event', icon: Calendar },
              { to: '/admin/registrations', label: 'View Registrations', icon: ClipboardList },
              { to: '/admin/applications', label: 'Join Applications', icon: UserPlus },
              { to: '/admin/declarations', label: 'Declarations', icon: FileText },
              { to: '/admin/cadets', label: 'Manage Cadets', icon: Users },
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between p-3 border border-army-800 hover:border-army-600 hover:bg-army-900 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-gold-500" />
                  <span className="font-heading text-sm text-army-300 group-hover:text-white uppercase tracking-wider transition-colors">
                    {label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-army-600 group-hover:text-gold-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="card-army p-6">
          <h3 className="font-heading text-sm text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="h-px w-4 bg-gold-500 inline-block" />
            Recent Registrations
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-army-900 animate-pulse rounded" />
              ))}
            </div>
          ) : recentRegs.length === 0 ? (
            <p className="text-army-500 text-sm font-body text-center py-6">
              No registrations yet.
            </p>
          ) : (
            <div className="space-y-2">
              {recentRegs.map((reg) => (
                <div key={reg.id} className="flex items-center justify-between p-3 border border-army-800 text-sm">
                  <div>
                    <p className="font-heading text-white text-xs uppercase tracking-wider">
                      {reg.name || reg.regimentalNo || 'Cadet'}
                    </p>
                    <p className="text-army-500 text-xs font-body">{reg.eventTitle}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-heading uppercase tracking-wider ${
                      reg.status === 'approved' ? 'text-green-400' :
                      reg.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {reg.status || 'pending'}
                    </span>
                    <p className="text-army-600 text-xs font-body flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatTs(reg.submittedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-900 bg-red-950/20 p-6">
        <h3 className="font-heading text-sm text-red-400 uppercase tracking-widest mb-1 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </h3>
        <p className="text-army-500 font-body text-xs mb-4">
          Permanently delete all data from every collection — events, registrations, cadets, applications, declarations, leave applications, and attendance. This action cannot be undone.
        </p>
        <button
          onClick={() => { setShowClearModal(true); setConfirmText('') }}
          className="flex items-center gap-2 px-4 py-2 bg-red-900/40 border border-red-700 text-red-300 font-heading text-xs uppercase tracking-widest hover:bg-red-800/60 hover:text-white transition-all"
        >
          <Trash2 className="w-4 h-4" /> Clear All Data
        </button>
      </div>

      {/* Confirm Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => !clearing && setShowClearModal(false)} />
          <div className="relative w-full max-w-md bg-military-darker border border-red-800 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-red-600" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-red-900">
              <h3 className="font-heading text-base text-red-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Confirm Clear All Data
              </h3>
              {!clearing && (
                <button onClick={() => setShowClearModal(false)} className="text-army-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-6 space-y-4">
              <p className="text-army-300 font-body text-sm leading-relaxed">
                This will permanently erase <strong className="text-white">all</strong> records from:
              </p>
              <ul className="text-red-400 font-body text-xs space-y-1 list-disc list-inside">
                {['Events', 'Registrations', 'Cadets (users)', 'Join Applications', 'Declarations', 'Leave Applications', 'Attendance'].map(c => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="text-army-400 font-body text-xs">
                Type <strong className="text-white">DELETE ALL</strong> to confirm:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="DELETE ALL"
                disabled={clearing}
                className="w-full px-3 py-2 bg-black border border-red-800 text-white font-mono text-sm focus:outline-none focus:border-red-500 placeholder-army-700 disabled:opacity-50"
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowClearModal(false)}
                  disabled={clearing}
                  className="flex-1 px-4 py-2 border border-army-700 text-army-400 font-heading text-xs uppercase tracking-widest hover:text-white hover:border-army-500 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={clearAllData}
                  disabled={confirmText !== 'DELETE ALL' || clearing}
                  className="flex-1 px-4 py-2 bg-red-800 border border-red-700 text-white font-heading text-xs uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {clearing ? 'Clearing…' : 'Clear All Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

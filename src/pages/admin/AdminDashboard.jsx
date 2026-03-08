import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import {
  Calendar,
  ClipboardList,
  Users,
  ChevronRight,
  TrendingUp,
  Clock,
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    pendingRegistrations: 0,
    totalCadets: 0,
  })
  const [recentRegs, setRecentRegs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [eventsSnap, activeSnap, regsSnap, pendingSnap, cadetsSnap, recentSnap] =
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
          ])

        setStats({
          totalEvents: eventsSnap.size,
          activeEvents: activeSnap.size,
          totalRegistrations: regsSnap.size,
          pendingRegistrations: pendingSnap.size,
          totalCadets: cadetsSnap.size,
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

  const STAT_CARDS = [
    { label: 'Total Events', value: stats.totalEvents, sub: `${stats.activeEvents} Active`, icon: Calendar, color: 'text-gold-400' },
    { label: 'Registrations', value: stats.totalRegistrations, sub: `${stats.pendingRegistrations} Pending`, icon: ClipboardList, color: 'text-green-400' },
    { label: 'Cadets', value: stats.totalCadets, sub: 'Registered', icon: Users, color: 'text-blue-400' },
    { label: 'Recent Activity', value: recentRegs.length, sub: 'Last 5 submissions', icon: TrendingUp, color: 'text-purple-400' },
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
    </div>
  )
}

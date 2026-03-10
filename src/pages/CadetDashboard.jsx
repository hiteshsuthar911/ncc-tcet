import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import {
  Shield, CheckCircle, XCircle, Clock, Calendar, Award, User,
  ClipboardList, BarChart2, Star, ChevronRight, Printer,
  TrendingUp, BookOpen, Phone, Mail, Target,
} from 'lucide-react'

function statusConfig(status) {
  switch (status) {
    case 'approved':  return { label: 'Approved',  cls: 'text-green-400 border-green-700 bg-green-900/20',  Icon: CheckCircle }
    case 'rejected':  return { label: 'Rejected',  cls: 'text-red-400 border-red-700 bg-red-900/20',        Icon: XCircle     }
    default:          return { label: 'Pending',   cls: 'text-yellow-400 border-yellow-700 bg-yellow-900/20',Icon: Clock       }
  }
}

function formatDate(val) {
  if (!val) return '—'
  const d = typeof val === 'string' ? new Date(val) : (val.seconds ? new Date(val.seconds * 1000) : new Date(val))
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const SESSION_TYPE_COLOR = {
  Training:      'text-green-400 bg-green-900/10 border-green-800',
  Camp:          'text-sky-400 bg-sky-900/10 border-sky-800',
  ATC:           'text-blue-400 bg-blue-900/10 border-blue-800',
  TSC:           'text-purple-400 bg-purple-900/10 border-purple-800',
  Parade:        'text-gold-400 bg-gold-900/10 border-gold-800',
  Lecture:       'text-amber-400 bg-amber-900/10 border-amber-800',
  'Social Service': 'text-pink-400 bg-pink-900/10 border-pink-800',
  Other:         'text-army-400 bg-army-900/10 border-army-700',
}

export default function CadetDashboard() {
  const { currentUser, userProfile } = useAuth()

  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [registrations, setRegistrations]         = useState([])
  const [loadingAtt, setLoadingAtt]               = useState(true)
  const [loadingReg, setLoadingReg]               = useState(true)

  // ── Load attendance ──────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return
    async function fetchAttendance() {
      try {
        const snap = await getDocs(collection(db, 'attendance'))
        const myRecords = []
        snap.docs.forEach(d => {
          const data = d.data()
          const entry = (data.cadets || []).find(c => c.userId === currentUser.uid)
          if (entry) {
            myRecords.push({
              id: d.id,
              date:         data.date,
              sessionType:  data.sessionType,
              sessionTitle: data.sessionTitle || data.sessionType,
              present:      entry.present,
              createdAt:    data.createdAt,
            })
          }
        })
        // Sort newest first
        myRecords.sort((a, b) => {
          const aDate = a.date || ''
          const bDate = b.date || ''
          return bDate.localeCompare(aDate)
        })
        setAttendanceRecords(myRecords)
      } catch (err) {
        console.warn('Attendance fetch failed:', err.message)
      } finally {
        setLoadingAtt(false)
      }
    }
    fetchAttendance()
  }, [currentUser])

  // ── Load registrations ───────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return
    async function fetchRegs() {
      try {
        const snap = await getDocs(
          query(collection(db, 'registrations'), where('userId', '==', currentUser.uid))
        )
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.submittedAt?.seconds ?? 0) - (a.submittedAt?.seconds ?? 0))
        setRegistrations(list)
      } catch (err) {
        console.warn('Registrations fetch failed:', err.message)
      } finally {
        setLoadingReg(false)
      }
    }
    fetchRegs()
  }, [currentUser])

  // ── Derived stats ────────────────────────────────────────────
  const totalSessions  = attendanceRecords.length
  const presentSessions = attendanceRecords.filter(r => r.present).length
  const absentSessions  = totalSessions - presentSessions
  const attendancePct   = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : null

  const regStats = {
    total:    registrations.length,
    approved: registrations.filter(r => r.status === 'approved').length,
    pending:  registrations.filter(r => !r.status || r.status === 'pending').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  }

  const pctColor = attendancePct == null ? 'text-army-400'
    : attendancePct >= 75 ? 'text-green-400'
    : attendancePct >= 50 ? 'text-yellow-400'
    : 'text-red-400'

  return (
    <div className="min-h-screen pt-20">

      {/* Hero / Profile strip */}
      <section className="relative py-12 bg-army-900 overflow-hidden border-b border-army-700">
        <div className="absolute inset-0 bg-camo-pattern opacity-10" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Avatar */}
            <div className="w-20 h-20 bg-army-800 border-2 border-gold-500 flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 text-gold-400" />
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <p className="section-subtitle mb-0 text-gold-400">Cadet Dashboard</p>
              <h1 className="font-heading text-2xl sm:text-3xl text-white uppercase tracking-widest">
                {userProfile?.name || 'Cadet'}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center sm:justify-start">
                <span className="flex items-center gap-1.5 text-gold-400 font-heading text-xs uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />{userProfile?.rank || 'Cadet'}
                </span>
                {userProfile?.wing && (
                  <span className="text-gray-300 font-body text-xs">{userProfile.wing} Wing</span>
                )}
                {userProfile?.regimentalNo && (
                  <span className="text-gray-300 font-body text-xs">Reg: {userProfile.regimentalNo}</span>
                )}
                {userProfile?.department && (
                  <span className="text-gray-300 font-body text-xs">{userProfile.department}</span>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-3 flex-shrink-0">
              <Link to="/profile" className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">

            {/* Attendance % */}
            <div className="card-army p-5 text-center col-span-2 sm:col-span-1">
              <TrendingUp className="w-6 h-6 text-gold-500 mx-auto mb-2" />
              <p className={`font-heading text-3xl ${pctColor}`}>
                {attendancePct != null ? `${attendancePct}%` : '—'}
              </p>
              <p className="text-army-400 font-body text-xs mt-1">Attendance Rate</p>
              {attendancePct != null && (
                <p className={`font-body text-xs mt-1 ${attendancePct >= 75 ? 'text-green-400' : 'text-amber-400'}`}>
                  {attendancePct >= 75 ? '✓ Above 75%' : '⚠ Below 75%'}
                </p>
              )}
            </div>

            <div className="card-army p-5 text-center">
              <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="font-heading text-2xl text-gray-900">{loadingAtt ? '…' : presentSessions}</p>
              <p className="text-army-400 font-body text-xs mt-1">Sessions Present</p>
            </div>

            <div className="card-army p-5 text-center">
              <XCircle className="w-5 h-5 text-red-400 mx-auto mb-2" />
              <p className="font-heading text-2xl text-gray-900">{loadingAtt ? '…' : absentSessions}</p>
              <p className="text-army-400 font-body text-xs mt-1">Sessions Absent</p>
            </div>

            <div className="card-army p-5 text-center">
              <ClipboardList className="w-5 h-5 text-gold-400 mx-auto mb-2" />
              <p className="font-heading text-2xl text-gray-900">{loadingReg ? '…' : regStats.total}</p>
              <p className="text-army-400 font-body text-xs mt-1">Events Registered</p>
            </div>

            <div className="card-army p-5 text-center">
              <Award className="w-5 h-5 text-sky-400 mx-auto mb-2" />
              <p className="font-heading text-2xl text-gray-900">{loadingReg ? '…' : regStats.approved}</p>
              <p className="text-army-400 font-body text-xs mt-1">Events Approved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* ── ATTENDANCE ── */}
        <section>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <p className="section-subtitle">My Record</p>
              <h2 className="font-heading text-xl text-white uppercase tracking-widest">Attendance History</h2>
              <div className="h-px w-14 bg-gold-500 mt-2" />
            </div>
            {/* Attendance bar */}
            {totalSessions > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-40 h-2 bg-army-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${attendancePct >= 75 ? 'bg-green-500' : 'bg-amber-500'}`}
                    style={{ width: `${attendancePct}%` }}
                  />
                </div>
                <span className={`font-heading text-sm ${pctColor}`}>{attendancePct}%</span>
              </div>
            )}
          </div>

          {loadingAtt ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="card-army p-4 animate-pulse flex gap-4">
                  <div className="w-16 h-10 bg-army-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-army-700 w-1/3" />
                    <div className="h-2 bg-army-800 w-1/4" />
                  </div>
                  <div className="w-20 h-6 bg-army-800 rounded" />
                </div>
              ))}
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="card-army p-12 text-center">
              <BarChart2 className="w-12 h-12 text-army-700 mx-auto mb-4" />
              <p className="text-army-400 font-body text-sm">No attendance records found yet.</p>
              <p className="text-army-600 font-body text-xs mt-2">Attendance is marked by admin after each session.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {attendanceRecords.map((rec, i) => {
                const typeCls = SESSION_TYPE_COLOR[rec.sessionType] || SESSION_TYPE_COLOR.Other
                return (
                  <div key={rec.id} className={`card-army flex items-center gap-4 px-4 py-3.5 group transition-colors hover:bg-army-900 ${rec.present ? 'border-l-2 border-l-green-700' : 'border-l-2 border-l-red-800'}`}>
                    {/* Date */}
                    <div className="w-14 text-center flex-shrink-0">
                      <p className="font-heading text-lg text-gold-400 leading-none">
                        {rec.date ? rec.date.slice(8) : '—'}
                      </p>
                      <p className="text-army-500 font-body text-[10px] uppercase">
                        {rec.date ? new Date(rec.date + 'T00:00:00').toLocaleString('en-IN', { month: 'short' }) : ''}
                      </p>
                      <p className="text-army-600 font-body text-[10px]">
                        {rec.date ? rec.date.slice(0, 4) : ''}
                      </p>
                    </div>

                    {/* Separator */}
                    <div className="w-px h-10 bg-army-800 flex-shrink-0" />

                    {/* Session info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-xs text-gray-900 uppercase tracking-wide truncate">{rec.sessionTitle}</p>
                      <span className={`inline-flex items-center border px-2 py-0.5 font-heading text-[10px] uppercase tracking-wider mt-1 ${typeCls}`}>
                        {rec.sessionType}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      {rec.present ? (
                        <span className="flex items-center gap-1.5 font-heading text-xs text-green-400 uppercase tracking-wider border border-green-800 bg-green-900/20 px-3 py-1.5">
                          <CheckCircle className="w-3.5 h-3.5" /> Present
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 font-heading text-xs text-red-400 uppercase tracking-wider border border-red-800 bg-red-900/20 px-3 py-1.5">
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── REGISTRATIONS ── */}
        <section>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <p className="section-subtitle">My Events</p>
              <h2 className="font-heading text-xl text-white uppercase tracking-widest">Event Registrations</h2>
              <div className="h-px w-14 bg-gold-500 mt-2" />
            </div>
            <Link to="/my-registrations" className="btn-secondary flex items-center gap-2 text-xs py-2 px-4">
              <ClipboardList className="w-3.5 h-3.5" /> Full View & Receipts
            </Link>
          </div>

          {/* Mini stat bar */}
          {!loadingReg && regStats.total > 0 && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {[
                { label: 'Total',    val: regStats.total,    cls: 'text-army-300' },
                { label: 'Approved', val: regStats.approved, cls: 'text-green-400' },
                { label: 'Pending',  val: regStats.pending,  cls: 'text-yellow-400' },
                { label: 'Rejected', val: regStats.rejected, cls: 'text-red-400' },
              ].map(s => (
                <div key={s.label} className="card-army px-4 py-2.5 text-center min-w-[80px]">
                  <p className={`font-heading text-lg ${s.cls}`}>{s.val}</p>
                  <p className="text-army-500 text-xs font-body">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {loadingReg ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="card-army p-4 animate-pulse flex gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-army-700 w-1/2" />
                    <div className="h-2 bg-army-800 w-1/3" />
                  </div>
                  <div className="w-20 h-6 bg-army-800 rounded" />
                </div>
              ))}
            </div>
          ) : registrations.length === 0 ? (
            <div className="card-army p-12 text-center">
              <ClipboardList className="w-12 h-12 text-army-700 mx-auto mb-4" />
              <p className="text-army-400 font-body text-sm">No event registrations yet.</p>
              <Link to="/events" className="inline-flex items-center gap-2 mt-4 btn-secondary text-xs py-2 px-4">
                <ChevronRight className="w-3.5 h-3.5" /> Browse Events
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {registrations.slice(0, 10).map((reg, i) => {
                const { label, cls, Icon } = statusConfig(reg.status)
                return (
                  <div key={reg.id} className="card-army flex items-center gap-4 px-4 py-3.5 hover:bg-army-900 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-xs text-gray-900 uppercase tracking-wide truncate">{reg.eventTitle || 'Event'}</p>
                      <p className="text-army-500 font-body text-xs mt-0.5">{formatDate(reg.submittedAt)}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 font-heading text-xs uppercase tracking-wider border px-3 py-1.5 flex-shrink-0 ${cls}`}>
                      <Icon className="w-3 h-3" /> {label}
                    </span>
                  </div>
                )
              })}
              {registrations.length > 10 && (
                <div className="text-center pt-2">
                  <Link to="/my-registrations" className="text-gold-400 font-body text-xs hover:text-gold-300 transition-colors">
                    View all {registrations.length} registrations →
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── QUICK LINKS ── */}
        <section className="border-t border-army-800 pt-8">
          <h2 className="font-heading text-sm text-army-400 uppercase tracking-widest mb-5">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: '/events',           icon: Calendar,     label: 'Events'       },
              { to: '/polls',            icon: ClipboardList,label: 'Session Polls' },
              { to: '/my-registrations', icon: Star,         label: 'Receipts'     },
              { to: '/profile',          icon: User,         label: 'My Profile'   },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="card-army p-4 text-center group hover:bg-army-900 transition-colors"
              >
                <link.icon className="w-6 h-6 text-gold-400 mx-auto mb-2 group-hover:text-gold-300 transition-colors" />
                <p className="font-heading text-xs text-gray-600 uppercase tracking-widest group-hover:text-army-700 transition-colors">{link.label}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

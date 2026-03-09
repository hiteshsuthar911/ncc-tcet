import { useEffect, useState } from 'react'
import {
  collection, getDocs, query, orderBy, updateDoc, doc,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import {
  ClipboardList, Search, CheckCircle, XCircle, Clock,
  Eye, X,
} from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected']

function StatusBadge({ status }) {
  const map = {
    pending:  { cls: 'bg-yellow-900/60 text-yellow-300 border-yellow-700', icon: Clock,       label: 'Pending' },
    approved: { cls: 'bg-green-900/60  text-green-300  border-green-700',  icon: CheckCircle, label: 'Approved' },
    rejected: { cls: 'bg-red-900/60    text-red-300    border-red-700',    icon: XCircle,     label: 'Rejected' },
  }
  const s = map[status] || map.pending
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs border rounded-sm font-body ${s.cls}`}>
      <Icon className="w-3 h-3" />{s.label}
    </span>
  )
}

function DetailModal({ app, onClose }) {
  if (!app) return null
  const fmt = (ts) => {
    if (!ts) return '—'
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleString('en-IN')
  }
  const fields = [
    ['Full Name', app.name],
    ['Regimental No.', app.regimentalNo],
    ['Rank', app.rank],
    ['Wing', app.wing],
    ['Department', app.department],
    ['Year', app.year],
    ['Phone', app.phone],
    ['Email', app.email],
    ['Leave Type', app.leaveType],
    ['Session / Event', app.session],
    ['From Date', app.fromDate],
    ['To Date', app.toDate],
    ['Reason', app.reason],
    ['Submitted', fmt(app.submittedAt)],
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-military-darker border border-army-700 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-army-800">
          <h3 className="font-heading text-lg text-white uppercase tracking-widest">Leave Application Details</h3>
          <button onClick={onClose} className="text-army-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {fields.map(([label, val]) => (
              <div key={label} className="col-span-2 sm:col-span-1">
                <p className="text-army-500 font-body text-xs uppercase tracking-widest">{label}</p>
                <p className="text-white font-body text-sm mt-0.5 break-all">{val || '—'}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-army-800">
          <p className="text-army-500 font-body text-xs">ID: <span className="text-army-300">{app.id}</span></p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLeaveApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDocs(query(collection(db, 'leaveApplications'), orderBy('submittedAt', 'desc')))
        setApps(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch { toast.error('Failed to load leave applications') }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  async function updateStatus(id, status) {
    try {
      await updateDoc(doc(db, 'leaveApplications', id), { status })
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      toast.success(`Application ${status}`)
    } catch { toast.error('Failed to update status') }
  }

  const filtered = apps.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q || a.name?.toLowerCase().includes(q) || a.regimentalNo?.toLowerCase().includes(q) || a.leaveType?.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    total:    apps.length,
    pending:  apps.filter(a => a.status === 'pending').length,
    approved: apps.filter(a => a.status === 'approved').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  }

  const fmt = (ts) => {
    if (!ts) return '—'
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleDateString('en-IN')
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-white uppercase tracking-widest">Leave Applications</h1>
        <p className="text-army-400 font-body text-sm mt-1">Cadet leave requests submitted via the Forms page</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: counts.total, cls: 'text-white' },
          { label: 'Pending', value: counts.pending, cls: 'text-yellow-400' },
          { label: 'Approved', value: counts.approved, cls: 'text-green-400' },
          { label: 'Rejected', value: counts.rejected, cls: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-military-darker border border-army-800 p-4">
            <p className="text-army-500 text-xs font-body uppercase tracking-widest">{s.label}</p>
            <p className={`font-heading text-3xl font-bold mt-1 ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
          <input
            type="text"
            placeholder="Search by name, regimental no., leave type…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-military-darker border border-army-700 text-white font-body text-sm focus:outline-none focus:border-gold-500 placeholder-army-600"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-military-darker border border-army-700 text-white font-body text-sm focus:outline-none focus:border-gold-500"
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-army-400 font-body text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <ClipboardList className="w-10 h-10 text-army-700 mx-auto mb-3" />
          <p className="text-army-500 font-body text-sm">No leave applications found</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-army-800">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-military-darker border-b border-army-800 text-army-400 uppercase text-xs tracking-widest">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Reg. No.</th>
                <th className="px-4 py-3 text-left">Leave Type</th>
                <th className="px-4 py-3 text-left">From</th>
                <th className="px-4 py-3 text-left">To</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => (
                <tr key={app.id} className={`border-b border-army-900 hover:bg-military-darker/50 transition-colors ${i % 2 === 0 ? 'bg-transparent' : 'bg-military-darker/20'}`}>
                  <td className="px-4 py-3 text-white">{app.name || '—'}</td>
                  <td className="px-4 py-3 text-army-300">{app.regimentalNo || '—'}</td>
                  <td className="px-4 py-3 text-army-300">{app.leaveType || '—'}</td>
                  <td className="px-4 py-3 text-army-300">{app.fromDate || '—'}</td>
                  <td className="px-4 py-3 text-army-300">{app.toDate || '—'}</td>
                  <td className="px-4 py-3 text-army-400">{fmt(app.submittedAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(app)} className="text-army-400 hover:text-white transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      {app.status !== 'approved' && (
                        <button onClick={() => updateStatus(app.id, 'approved')} className="text-green-500 hover:text-green-300 transition-colors" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button onClick={() => updateStatus(app.id, 'rejected')} className="text-red-500 hover:text-red-300 transition-colors" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 border-t border-army-900 text-army-500 text-xs font-body">
            Showing {filtered.length} of {apps.length} applications
          </div>
        </div>
      )}

      <DetailModal app={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

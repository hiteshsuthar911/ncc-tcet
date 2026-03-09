import { useEffect, useState } from 'react'
import {
  collection, getDocs, query, orderBy, updateDoc, doc,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import {
  UserPlus, Search, CheckCircle, XCircle, Clock,
  Eye, X, Download,
} from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected']

function DetailModal({ app, onClose }) {
  if (!app) return null
  const fmt = (ts) => {
    if (!ts) return '—'
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleString('en-IN')
  }
  const fields = [
    ['Full Name', app.name], ['Date of Birth', app.dob], ['Gender', app.gender],
    ['Blood Group', app.bloodGroup], ['Aadhaar (Last 4)', app.aadhaarLast4 || '—'],
    ['Cadet Mobile', app.phone], ['Parent Mobile', app.parentPhone],
    ['College Email', app.email], ['Address', app.address],
    ['Department', app.department], ['Year', app.year],
    ['Roll No.', app.rollNo], ['College ID', app.collegeId || '—'],
    ['Wing Preference', app.wing], ['Previous NCC', app.prevNcc],
    ['Prev. Unit', app.prevUnit || '—'], ['Prev. Rank', app.prevRank || '—'],
    ['Prev. Certificate', app.prevCert || '—'],
    ['Submitted', fmt(app.submittedAt)],
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-military-darker border border-army-700 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-army-800">
          <h3 className="font-heading text-lg text-white uppercase tracking-widest">Application Details</h3>
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
          <p className="text-army-500 font-body text-xs">Application ID: <span className="text-army-300">{app.id}</span></p>
        </div>
      </div>
    </div>
  )
}

export default function AdminApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDocs(query(collection(db, 'joinApplications'), orderBy('submittedAt', 'desc')))
        setApps(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch { toast.error('Failed to load applications') }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  async function updateStatus(id, status) {
    try {
      await updateDoc(doc(db, 'joinApplications', id), { status })
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      toast.success(`Application ${status}`)
    } catch { toast.error('Update failed') }
  }

  function exportCSV() {
    const headers = ['Name', 'Department', 'Year', 'Roll No', 'Wing', 'Phone', 'Email', 'Status', 'Submitted']
    const rows = filtered.map(a => [
      a.name, a.department, a.year, a.rollNo, a.wing, a.phone, a.email, a.status,
      a.submittedAt?.seconds ? new Date(a.submittedAt.seconds * 1000).toLocaleString('en-IN') : '',
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c || ''}"`).join(',')).join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'join-applications.csv'; a.click()
  }

  const filtered = apps
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .filter(a => {
      const q = search.toLowerCase()
      return !q || (a.name || '').toLowerCase().includes(q) || (a.rollNo || '').toLowerCase().includes(q) || (a.department || '').toLowerCase().includes(q) || (a.wing || '').toLowerCase().includes(q)
    })

  const counts = { total: apps.length, pending: apps.filter(a => a.status === 'pending').length, approved: apps.filter(a => a.status === 'approved').length, rejected: apps.filter(a => a.status === 'rejected').length }

  const fmt = (ts) => {
    if (!ts) return '—'
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div>
      <div className="mb-6">
        <p className="section-subtitle">Admin</p>
        <h2 className="font-heading text-2xl text-white uppercase tracking-widest">Join NCC Applications</h2>
        <div className="h-px w-16 bg-gold-500 mt-2" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[['Total', counts.total, 'text-white'], ['Pending', counts.pending, 'text-yellow-400'], ['Approved', counts.approved, 'text-green-400'], ['Rejected', counts.rejected, 'text-red-400']].map(([label, val, color]) => (
          <div key={label} className="stat-card">
            <p className={`font-heading text-3xl ${color} mb-0.5`}>{loading ? '—' : val}</p>
            <p className="font-body text-xs text-army-400 uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, roll no, department…" className="input-field pl-9 w-full" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field sm:w-40">
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 whitespace-nowrap">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="card-army overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-army-800">
                {['Name', 'Department / Year', 'Wing', 'Phone', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-heading text-xs text-army-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-army-500 font-body text-sm">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-army-500 font-body text-sm">No applications found.</td></tr>
              ) : filtered.map(a => (
                <tr key={a.id} className="border-b border-army-900 hover:bg-army-900/50 transition-colors">
                  <td className="px-4 py-3 font-body text-sm text-white">{a.name || '—'}</td>
                  <td className="px-4 py-3 font-body text-xs text-army-400">{a.department}<br />{a.year}</td>
                  <td className="px-4 py-3 font-body text-sm text-army-300">{a.wing || '—'}</td>
                  <td className="px-4 py-3 font-body text-sm text-army-300">{a.phone || '—'}</td>
                  <td className="px-4 py-3 font-body text-xs text-army-500">{fmt(a.submittedAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-heading uppercase tracking-wide border ${
                      a.status === 'approved' ? 'border-green-700 text-green-400 bg-green-950/40' :
                      a.status === 'rejected' ? 'border-red-700 text-red-400 bg-red-950/40' :
                      'border-yellow-700 text-yellow-400 bg-yellow-950/40'
                    }`}>
                      {a.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : a.status === 'rejected' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(a)} title="View" className="text-army-400 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                      {a.status !== 'approved' && (
                        <button onClick={() => updateStatus(a.id, 'approved')} title="Approve" className="text-army-400 hover:text-green-400 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                      )}
                      {a.status !== 'rejected' && (
                        <button onClick={() => updateStatus(a.id, 'rejected')} title="Reject" className="text-army-400 hover:text-red-400 transition-colors"><XCircle className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-army-800 flex items-center justify-between">
          <p className="font-body text-xs text-army-500">Showing {filtered.length} of {apps.length} applications</p>
        </div>
      </div>

      {selected && <DetailModal app={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

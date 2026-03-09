import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  where,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Download,
  Eye,
  X,
  Printer,
} from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected']

function DetailModal({ reg, onClose }) {
  if (!reg) return null

  const formatTs = (ts) => {
    if (!ts) return '—'
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleString('en-IN')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-military-darker border border-army-700 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-army-800">
          <h3 className="font-heading text-lg text-white uppercase tracking-widest">
            Registration Details
          </h3>
          <button onClick={onClose} className="text-army-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-2 gap-4">
            <div className="card-army p-4">
              <p className="text-army-500 text-xs font-body mb-1">Cadet Name</p>
              <p className="text-white font-heading text-sm uppercase tracking-wide">{reg.name || '—'}</p>
            </div>
            <div className="card-army p-4">
              <p className="text-army-500 text-xs font-body mb-1">Regimental No.</p>
              <p className="text-gold-400 font-heading text-sm">{reg.regimentalNo || '—'}</p>
            </div>
          </div>
          <div className="card-army p-4">
            <p className="text-army-500 text-xs font-body mb-1">Event</p>
            <p className="text-white font-heading text-sm uppercase tracking-wide">{reg.eventTitle}</p>
          </div>
          <div className="card-army p-4">
            <p className="text-army-500 text-xs font-body mb-1">Submitted At</p>
            <p className="text-army-300 font-body text-sm">{formatTs(reg.submittedAt)}</p>
          </div>

          {/* Form Data */}
          {reg.formData && Object.keys(reg.formData).length > 0 && (
            <div>
              <p className="font-heading text-xs text-army-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="h-px w-3 bg-gold-500 inline-block" /> Form Responses
              </p>
              <div className="space-y-2">
                {Object.entries(reg.formData)
                  .filter(([k]) => k !== 'declaration')
                  .map(([key, value]) => (
                    <div key={key} className="card-army p-3">
                      <p className="text-army-500 text-xs font-body mb-0.5 capitalize">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-army-200 text-sm font-body">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('')
  const [events, setEvents] = useState([])
  const [detailReg, setDetailReg] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [regsSnap, eventsSnap] = await Promise.all([
          getDocs(query(collection(db, 'registrations'), orderBy('submittedAt', 'desc'))),
          getDocs(collection(db, 'events')),
        ])
        setRegistrations(regsSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setEvents(eventsSnap.docs.map((d) => ({ id: d.id, title: d.data().title })))
      } catch {
        toast.error('Failed to load registrations.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  async function updateStatus(id, status) {
    setUpdatingId(id)
    try {
      await updateDoc(doc(db, 'registrations', id), { status })
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
      toast.success(`Registration ${status}.`)
    } catch {
      toast.error('Failed to update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = registrations.filter((r) => {
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.regimentalNo?.toLowerCase().includes(search.toLowerCase()) ||
      r.eventTitle?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchEvent = eventFilter ? r.eventId === eventFilter : true
    return matchSearch && matchStatus && matchEvent
  })

  const formatTs = (ts) => {
    if (!ts) return '—'
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const statusBadge = (status) => {
    const map = {
      pending: 'text-yellow-400 border-yellow-700',
      approved: 'text-green-400 border-green-700',
      rejected: 'text-red-400 border-red-700',
    }
    return map[status] || 'text-army-400 border-army-700'
  }

  // Print table
  function printTable() {
    window.print()
  }

  // Export CSV
  function exportCSV() {
    if (filtered.length === 0) { toast.error('No data to export.'); return }
    const headers = ['Name', 'Regimental No', 'Event', 'Status', 'Submitted At']
    const rows = filtered.map((r) => [
      r.name || '',
      r.regimentalNo || '',
      r.eventTitle || '',
      r.status || 'pending',
      formatTs(r.submittedAt),
    ])
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `registrations_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-subtitle">Admin</p>
          <h2 className="font-heading text-2xl text-white uppercase tracking-widest">Registrations</h2>
          <div className="h-px w-16 bg-gold-500 mt-2" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={printTable}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            onClick={exportCSV}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
          <input
            type="text"
            placeholder="Search by name, reg. no, event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-field sm:w-40"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="select-field sm:w-48"
        >
          <option value="">All Events</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {[
          { label: 'Total', count: registrations.length, color: 'text-white' },
          { label: 'Pending', count: registrations.filter((r) => r.status === 'pending' || !r.status).length, color: 'text-yellow-400' },
          { label: 'Approved', count: registrations.filter((r) => r.status === 'approved').length, color: 'text-green-400' },
          { label: 'Rejected', count: registrations.filter((r) => r.status === 'rejected').length, color: 'text-red-400' },
        ].map(({ label, count, color }) => (
          <div key={label} className="flex items-center gap-2 border border-army-800 px-4 py-2 bg-army-950">
            <span className={`font-heading text-lg ${color}`}>{loading ? '—' : count}</span>
            <span className="text-army-500 text-xs font-body uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-army-900 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-army p-12 text-center">
          <ClipboardList className="w-12 h-12 text-army-700 mx-auto mb-3" />
          <p className="text-army-400 font-heading uppercase tracking-wider">No registrations found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-army-700">
                {['Cadet', 'Event', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-heading text-xs text-army-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg) => (
                <tr
                  key={reg.id}
                  className="border-b border-army-900 hover:bg-army-900/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <p className="font-heading text-sm text-white uppercase tracking-wide">
                      {reg.name || '—'}
                    </p>
                    <p className="text-gold-600 text-xs font-body">{reg.regimentalNo}</p>
                  </td>
                  <td className="px-4 py-4 text-army-300 text-sm font-body">
                    <span className="line-clamp-1">{reg.eventTitle}</span>
                  </td>
                  <td className="px-4 py-4 text-army-400 text-xs font-body">
                    {formatTs(reg.submittedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`font-heading text-xs uppercase tracking-wider border px-2 py-1 ${statusBadge(reg.status || 'pending')}`}
                    >
                      {reg.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDetailReg(reg)}
                        className="text-army-400 hover:text-gold-400 transition-colors p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(reg.status === 'pending' || !reg.status) && (
                        <>
                          <button
                            onClick={() => updateStatus(reg.id, 'approved')}
                            disabled={updatingId === reg.id}
                            className="text-army-600 hover:text-green-400 transition-colors p-1 disabled:opacity-50"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(reg.id, 'rejected')}
                            disabled={updatingId === reg.id}
                            className="text-army-600 hover:text-red-400 transition-colors p-1 disabled:opacity-50"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {reg.status === 'approved' && (
                        <button
                          onClick={() => updateStatus(reg.id, 'rejected')}
                          disabled={updatingId === reg.id}
                          className="text-green-600 hover:text-red-400 transition-colors p-1 disabled:opacity-50 text-xs font-body"
                          title="Revoke"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {detailReg && <DetailModal reg={detailReg} onClose={() => setDetailReg(null)} />}
    </div>
  )
}

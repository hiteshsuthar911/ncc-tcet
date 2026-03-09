import { useEffect, useState } from 'react'
import {
  collection, getDocs, query, orderBy, updateDoc, doc,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import {
  FileText, Search, CheckCircle, XCircle, Clock,
  Eye, X, Download,
} from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['all', 'pending', 'reviewed', 'rejected']

function DetailModal({ decl, onClose }) {
  if (!decl) return null
  const fmt = (ts) => {
    if (!ts) return '—'
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleString('en-IN')
  }
  const sections = [
    { title: 'Personal', fields: [
      ['Full Name', decl.name], ['Regimental No.', decl.regimentalNo || '—'],
      ['Father\'s Name', decl.fatherName], ['Mother\'s Name', decl.motherName],
      ['Date of Birth', decl.dob], ['Gender', decl.gender],
      ['Blood Group', decl.bloodGroup], ['Phone', decl.phone],
      ['Parent Phone', decl.parentPhone], ['Address', decl.address],
    ]},
    { title: 'Academic', fields: [
      ['Department', decl.department], ['Year', decl.year],
      ['Roll No.', decl.rollNo], ['College ID', decl.collegeIdNo || '—'],
      ['College Email', decl.collegeEmail || '—'], ['CGPA', decl.cgpa || '—'],
    ]},
    { title: 'NCC', fields: [
      ['Wing', decl.wing], ['Previous NCC', decl.prevNcc],
      ['Prev. Unit', decl.prevUnit || '—'], ['Prev. Rank', decl.prevRank || '—'],
      ['Certificate', decl.prevCert || '—'],
    ]},
    { title: 'Submission', fields: [
      ['Submitted At', fmt(decl.submittedAt)],
      ['Declarations Accepted', `${[1,2,3,4,5,6,7,8,9,10].filter(i => decl[`declare${i}`]).length} / 10`],
      ['Documents Enclosed', Object.keys(decl).filter(k => k.startsWith('doc') && decl[k]).length + ' / 7'],
    ]},
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-military-darker border border-army-700 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-army-800">
          <h3 className="font-heading text-lg text-white uppercase tracking-widest">Declaration Details</h3>
          <button onClick={onClose} className="text-army-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {sections.map(({ title, fields }) => (
            <div key={title}>
              <p className="font-heading text-xs text-gold-400 uppercase tracking-widest mb-3 pb-1 border-b border-army-800">{title}</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {fields.map(([label, val]) => (
                  <div key={label} className={label === 'Address' ? 'col-span-2' : ''}>
                    <p className="text-army-500 font-body text-xs uppercase tracking-widest">{label}</p>
                    <p className="text-white font-body text-sm mt-0.5 break-all">{val || '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-army-800">
          <p className="text-army-500 font-body text-xs">ID: <span className="text-army-300">{decl.id}</span></p>
        </div>
      </div>
    </div>
  )
}

export default function AdminDeclarations() {
  const [decls, setDecls] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDocs(query(collection(db, 'declarations'), orderBy('submittedAt', 'desc')))
        setDecls(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch { toast.error('Failed to load declarations') }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  async function updateStatus(id, status) {
    try {
      await updateDoc(doc(db, 'declarations', id), { status })
      setDecls(prev => prev.map(d => d.id === id ? { ...d, status } : d))
      toast.success(`Declaration marked as ${status}`)
    } catch { toast.error('Update failed') }
  }

  function exportCSV() {
    const headers = ['Name', 'Regimental No', 'Department', 'Year', 'Roll No', 'Wing', 'Phone', 'Declarations Accepted', 'Status', 'Submitted']
    const rows = filtered.map(d => [
      d.name, d.regimentalNo || '', d.department, d.year, d.rollNo, d.wing, d.phone,
      `${[1,2,3,4,5,6,7,8,9,10].filter(i => d[`declare${i}`]).length}/10`,
      d.status,
      d.submittedAt?.seconds ? new Date(d.submittedAt.seconds * 1000).toLocaleString('en-IN') : '',
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c || ''}"`).join(',')).join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'declarations.csv'; a.click()
  }

  const filtered = decls
    .filter(d => statusFilter === 'all' || d.status === statusFilter)
    .filter(d => {
      const q = search.toLowerCase()
      return !q || (d.name || '').toLowerCase().includes(q) || (d.rollNo || '').toLowerCase().includes(q) || (d.regimentalNo || '').toLowerCase().includes(q)
    })

  const counts = {
    total: decls.length,
    pending: decls.filter(d => d.status === 'pending').length,
    reviewed: decls.filter(d => d.status === 'reviewed').length,
    rejected: decls.filter(d => d.status === 'rejected').length,
  }

  const fmt = (ts) => {
    if (!ts) return '—'
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div>
      <div className="mb-6">
        <p className="section-subtitle">Admin</p>
        <h2 className="font-heading text-2xl text-white uppercase tracking-widest">Declaration Forms</h2>
        <div className="h-px w-16 bg-gold-500 mt-2" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[['Total', counts.total, 'text-white'], ['Pending', counts.pending, 'text-yellow-400'], ['Reviewed', counts.reviewed, 'text-green-400'], ['Rejected', counts.rejected, 'text-red-400']].map(([label, val, color]) => (
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, roll no, regimental no…" className="input-field pl-9 w-full" />
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
                {['Name', 'Dept / Year', 'Wing', 'Roll No.', 'Declarations', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-heading text-xs text-army-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-army-500 font-body text-sm">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-army-500 font-body text-sm">No declarations found.</td></tr>
              ) : filtered.map(d => {
                const acceptedCount = [1,2,3,4,5,6,7,8,9,10].filter(i => d[`declare${i}`]).length
                return (
                  <tr key={d.id} className="border-b border-army-900 hover:bg-army-900/50 transition-colors">
                    <td className="px-4 py-3 font-body text-sm text-white">{d.name || '—'}<br /><span className="text-army-500 text-xs">{d.regimentalNo || ''}</span></td>
                    <td className="px-4 py-3 font-body text-xs text-army-400">{d.department}<br />{d.year}</td>
                    <td className="px-4 py-3 font-body text-sm text-army-300">{d.wing || '—'}</td>
                    <td className="px-4 py-3 font-body text-sm text-army-300">{d.rollNo || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`font-heading text-xs ${acceptedCount === 10 ? 'text-green-400' : 'text-yellow-400'}`}>{acceptedCount}/10</span>
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-army-500">{fmt(d.submittedAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-heading uppercase tracking-wide border ${
                        d.status === 'reviewed' ? 'border-green-700 text-green-400 bg-green-950/40' :
                        d.status === 'rejected' ? 'border-red-700 text-red-400 bg-red-950/40' :
                        'border-yellow-700 text-yellow-400 bg-yellow-950/40'
                      }`}>
                        {d.status === 'reviewed' ? <CheckCircle className="w-3 h-3" /> : d.status === 'rejected' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(d)} title="View" className="text-army-400 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                        {d.status !== 'reviewed' && (
                          <button onClick={() => updateStatus(d.id, 'reviewed')} title="Mark Reviewed" className="text-army-400 hover:text-green-400 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                        )}
                        {d.status !== 'rejected' && (
                          <button onClick={() => updateStatus(d.id, 'rejected')} title="Reject" className="text-army-400 hover:text-red-400 transition-colors"><XCircle className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-army-800">
          <p className="font-body text-xs text-army-500">Showing {filtered.length} of {decls.length} declarations</p>
        </div>
      </div>

      {selected && <DetailModal decl={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

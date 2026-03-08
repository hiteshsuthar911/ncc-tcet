import { useEffect, useState, useMemo } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import {
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Download,
  Trash2,
  Eye,
  X,
  Save,
  Search,
  ClipboardCheck,
  BarChart2,
  CheckSquare,
  Shield,
} from 'lucide-react'
import toast from 'react-hot-toast'

const SESSION_TYPES = ['Training', 'Camp', 'ATC', 'TSC', 'Lecture', 'Parade', 'Social Service', 'Other']
const WINGS = ['All', 'Army', 'Navy', 'Air']

export default function AdminAttendance() {
  const { userProfile } = useAuth()

  const [tab, setTab] = useState('mark')

  // Cadets
  const [cadets, setCadets] = useState([])
  const [loadingCadets, setLoadingCadets] = useState(true)

  // Session config
  const [sessionType, setSessionType] = useState('Training')
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10))
  const [sessionTitle, setSessionTitle] = useState('')
  const [wingFilter, setWingFilter] = useState('All')
  const [searchQ, setSearchQ] = useState('')

  // Attendance: { [userId]: true (present) / false (absent) }
  const [attendance, setAttendance] = useState({})
  const [saving, setSaving] = useState(false)

  // Records
  const [records, setRecords] = useState([])
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [recordFilter, setRecordFilter] = useState('All')
  const [recordSearch, setRecordSearch] = useState('')

  // ── Load cadets ────────────────────────────────────────────────
  useEffect(() => {
    async function loadCadets() {
      try {
        const snap = await getDocs(collection(db, 'users'))
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(u => u.role !== 'admin')
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        setCadets(list)
        const init = {}
        list.forEach(c => { init[c.id] = true })
        setAttendance(init)
      } catch {
        toast.error('Failed to load cadets')
      } finally {
        setLoadingCadets(false)
      }
    }
    loadCadets()
  }, [])

  // ── Load records when tab switches ────────────────────────────
  useEffect(() => {
    if (tab !== 'records') return
    loadRecords()
  }, [tab])

  async function loadRecords() {
    setLoadingRecords(true)
    try {
      let list = []
      try {
        const q = query(collection(db, 'attendance'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      } catch {
        // Fallback without orderBy (index not yet ready)
        const snap = await getDocs(collection(db, 'attendance'))
        list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        list.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      }
      setRecords(list)
    } catch {
      toast.error('Failed to load records')
    } finally {
      setLoadingRecords(false)
    }
  }

  // ── Derived state ──────────────────────────────────────────────
  const filteredCadets = useMemo(() => {
    return cadets.filter(c => {
      const matchWing = wingFilter === 'All' || c.wing === wingFilter
      const q = searchQ.toLowerCase()
      const matchSearch = !q ||
        (c.name || '').toLowerCase().includes(q) ||
        (c.regimentalNo || '').toLowerCase().includes(q)
      return matchWing && matchSearch
    })
  }, [cadets, wingFilter, searchQ])

  const presentCount = useMemo(
    () => Object.values(attendance).filter(Boolean).length,
    [attendance]
  )
  const absentCount = cadets.length - presentCount

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchType = recordFilter === 'All' || r.sessionType === recordFilter
      const q = recordSearch.toLowerCase()
      const matchSearch = !q ||
        (r.sessionTitle || '').toLowerCase().includes(q) ||
        (r.date || '').includes(q) ||
        (r.sessionType || '').toLowerCase().includes(q)
      return matchType && matchSearch
    })
  }, [records, recordFilter, recordSearch])

  // ── Handlers ───────────────────────────────────────────────────
  function toggleCadet(id) {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function markFiltered(present) {
    const updated = { ...attendance }
    filteredCadets.forEach(c => { updated[c.id] = present })
    setAttendance(updated)
  }

  async function saveAttendance() {
    if (!sessionDate) return toast.error('Please select a date')
    if (cadets.length === 0) return toast.error('No cadets on roster')
    setSaving(true)
    try {
      const cadetData = cadets.map(c => ({
        userId: c.id,
        name: c.name || '',
        regimentalNo: c.regimentalNo || '',
        rank: c.rank || 'Cadet',
        wing: c.wing || 'Army',
        present: attendance[c.id] ?? true,
      }))
      const presentList = cadetData.filter(c => c.present)
      await addDoc(collection(db, 'attendance'), {
        date: sessionDate,
        sessionType,
        sessionTitle: sessionTitle.trim() || sessionType,
        totalCadets: cadets.length,
        presentCount: presentList.length,
        absentCount: cadets.length - presentList.length,
        cadets: cadetData,
        createdAt: serverTimestamp(),
        markedBy: userProfile?.name || 'Admin',
      })
      toast.success(`Attendance saved — ${presentList.length}/${cadets.length} present`)
      setSessionTitle('')
    } catch {
      toast.error('Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm('Delete this attendance record? This cannot be undone.')) return
    try {
      await deleteDoc(doc(db, 'attendance', id))
      setRecords(prev => prev.filter(r => r.id !== id))
      toast.success('Record deleted')
    } catch {
      toast.error('Failed to delete record')
    }
  }

  function exportCSV(record) {
    const rows = [
      ['#', 'Name', 'Regt. No', 'Rank', 'Wing', 'Status'],
      ...(record.cadets || []).map((c, i) => [
        i + 1, c.name, c.regimentalNo, c.rank, c.wing, c.present ? 'Present' : 'Absent',
      ]),
    ]
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance_${record.date}_${record.sessionType}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-white uppercase tracking-widest">Attendance</h1>
          <p className="text-army-400 font-body text-sm mt-0.5">
            Track cadet attendance for training, camps, lectures &amp; more
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-gold-500 font-heading text-sm">{cadets.length} Cadets</p>
            <p className="text-army-500 text-xs font-body">on roster</p>
          </div>
          <div className="w-10 h-10 bg-army-800 border border-army-700 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-gold-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-army-800 mb-6">
        {[
          { key: 'mark', label: 'Mark Attendance', icon: CheckSquare },
          { key: 'records', label: 'View Records', icon: BarChart2 },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-3 font-heading text-xs uppercase tracking-widest border-b-2 transition-colors ${
              tab === key
                ? 'border-gold-500 text-gold-400'
                : 'border-transparent text-army-400 hover:text-army-200'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* ══════════════ MARK ATTENDANCE TAB ══════════════ */}
      {tab === 'mark' && (
        <div className="space-y-5">

          {/* Session Config */}
          <div className="card-army p-5">
            <h2 className="font-heading text-sm text-white uppercase tracking-wide mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-500" /> Session Details
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={e => setSessionDate(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Session Type</label>
                <select
                  value={sessionType}
                  onChange={e => setSessionType(e.target.value)}
                  className="form-input"
                >
                  {SESSION_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Session Title (optional)</label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={e => setSessionTitle(e.target.value)}
                  placeholder="e.g. Weekly Drill #12"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card-army p-4 text-center">
              <p className="font-heading text-3xl text-white">{cadets.length}</p>
              <p className="text-army-400 font-body text-xs uppercase mt-1">Total Cadets</p>
            </div>
            <div className="card-army p-4 text-center border-t-2 border-green-700">
              <p className="font-heading text-3xl text-green-400">{presentCount}</p>
              <p className="text-army-400 font-body text-xs uppercase mt-1">Present</p>
            </div>
            <div className="card-army p-4 text-center border-t-2 border-red-800">
              <p className="font-heading text-3xl text-red-400">{absentCount}</p>
              <p className="text-army-400 font-body text-xs uppercase mt-1">Absent</p>
            </div>
          </div>

          {/* Filters + Bulk Actions Bar */}
          <div className="card-army p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Wing filter */}
              <div className="flex gap-1 flex-wrap">
                {WINGS.map(w => (
                  <button
                    key={w}
                    onClick={() => setWingFilter(w)}
                    className={`font-heading text-xs px-3 py-1.5 border uppercase tracking-wide transition-colors ${
                      wingFilter === w
                        ? 'bg-gold-700 border-gold-500 text-white'
                        : 'border-army-700 text-army-400 hover:border-army-500'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="flex-1 min-w-[160px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-army-500" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search by name or regt. no..."
                  className="form-input pl-9 py-1.5 text-sm"
                />
              </div>

              {/* Bulk mark */}
              <div className="flex gap-2">
                <button
                  onClick={() => markFiltered(true)}
                  className="font-heading text-xs px-3 py-1.5 bg-green-900/40 border border-green-800 text-green-400 hover:bg-green-900 transition-colors uppercase tracking-wide"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => markFiltered(false)}
                  className="font-heading text-xs px-3 py-1.5 bg-red-900/20 border border-red-900 text-red-400 hover:bg-red-900/40 transition-colors uppercase tracking-wide"
                >
                  Mark All Absent
                </button>
              </div>
            </div>
            <p className="text-army-500 text-xs font-body">
              Showing {filteredCadets.length} cadet{filteredCadets.length !== 1 ? 's' : ''}
              {wingFilter !== 'All' ? ` · ${wingFilter} Wing` : ''}
              {searchQ ? ` · filtered` : ''}. Click a row to toggle status.
            </p>
          </div>

          {/* Cadet List */}
          {loadingCadets ? (
            <div className="card-army p-12 text-center text-army-400 font-body">
              Loading cadet roster...
            </div>
          ) : cadets.length === 0 ? (
            <div className="card-army p-12 text-center">
              <Users className="w-10 h-10 text-army-700 mx-auto mb-3" />
              <p className="text-army-400 font-body">No cadets found. Add cadets from the Cadets section first.</p>
            </div>
          ) : (
            <div className="card-army overflow-hidden">
              <div className="overflow-y-auto max-h-[440px]">
                <table className="w-full">
                  <thead className="sticky top-0 bg-military-darker border-b border-army-800 z-10">
                    <tr>
                      <th className="text-left py-3 px-4 font-heading text-xs text-army-400 uppercase tracking-wide w-10">#</th>
                      <th className="text-left py-3 px-4 font-heading text-xs text-army-400 uppercase tracking-wide">Name</th>
                      <th className="text-left py-3 px-4 font-heading text-xs text-army-400 uppercase tracking-wide hidden sm:table-cell">Regt. No</th>
                      <th className="text-left py-3 px-4 font-heading text-xs text-army-400 uppercase tracking-wide hidden md:table-cell">Rank</th>
                      <th className="text-left py-3 px-4 font-heading text-xs text-army-400 uppercase tracking-wide hidden lg:table-cell">Wing</th>
                      <th className="text-center py-3 px-4 font-heading text-xs text-army-400 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCadets.map((cadet, i) => {
                      const isPresent = attendance[cadet.id] ?? true
                      return (
                        <tr
                          key={cadet.id}
                          onClick={() => toggleCadet(cadet.id)}
                          className={`border-b border-army-900 cursor-pointer select-none transition-colors ${
                            isPresent
                              ? 'hover:bg-green-900/10'
                              : 'bg-red-900/5 hover:bg-red-900/10'
                          }`}
                        >
                          <td className="py-3 px-4 text-army-600 font-body text-xs">{i + 1}</td>
                          <td className="py-3 px-4">
                            <p className="text-white font-heading text-xs uppercase tracking-wide">{cadet.name}</p>
                          </td>
                          <td className="py-3 px-4 text-army-400 font-body text-xs hidden sm:table-cell">{cadet.regimentalNo}</td>
                          <td className="py-3 px-4 text-army-400 font-body text-xs hidden md:table-cell">{cadet.rank}</td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            <span className="text-army-400 font-body text-xs">{cadet.wing}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {isPresent ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-900/30 border border-green-800 text-green-400 font-heading text-xs">
                                <CheckCircle className="w-3 h-3" /> Present
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-900/20 border border-red-900 text-red-400 font-heading text-xs">
                                <XCircle className="w-3 h-3" /> Absent
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Save */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={saveAttendance}
              disabled={saving || cadets.length === 0}
              className="btn-primary text-sm py-2 px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════ RECORDS TAB ══════════════ */}
      {tab === 'records' && (
        <div className="space-y-5">

          {/* Filters */}
          <div className="card-army p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {['All', ...SESSION_TYPES].map(t => (
                <button
                  key={t}
                  onClick={() => setRecordFilter(t)}
                  className={`font-heading text-xs px-3 py-1.5 border uppercase tracking-wide transition-colors ${
                    recordFilter === t
                      ? 'bg-gold-700 border-gold-500 text-white'
                      : 'border-army-700 text-army-400 hover:border-army-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-army-500" />
              <input
                type="text"
                value={recordSearch}
                onChange={e => setRecordSearch(e.target.value)}
                placeholder="Search by date, type or title..."
                className="form-input pl-9 py-1.5 text-sm"
              />
            </div>
          </div>

          {loadingRecords ? (
            <div className="card-army p-12 text-center text-army-400 font-body">Loading records...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="card-army p-12 text-center">
              <ClipboardCheck className="w-10 h-10 text-army-700 mx-auto mb-3" />
              <p className="text-army-400 font-body">No attendance records found.</p>
              <p className="text-army-600 font-body text-xs mt-1">Save an attendance session to see it here.</p>
            </div>
          ) : (
            <div className="card-army overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-military-darker border-b border-army-800">
                    <tr>
                      <th className="text-left py-3 px-4 font-heading text-xs text-army-400 uppercase tracking-wide">Date</th>
                      <th className="text-left py-3 px-4 font-heading text-xs text-army-400 uppercase tracking-wide">Session</th>
                      <th className="text-center py-3 px-4 font-heading text-xs text-army-400 uppercase tracking-wide hidden sm:table-cell">Present</th>
                      <th className="text-center py-3 px-4 font-heading text-xs text-army-400 uppercase tracking-wide hidden sm:table-cell">Absent</th>
                      <th className="text-center py-3 px-4 font-heading text-xs text-army-400 uppercase tracking-wide hidden md:table-cell">Rate</th>
                      <th className="text-center py-3 px-4 font-heading text-xs text-army-400 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map(record => {
                      const pct = record.totalCadets
                        ? Math.round((record.presentCount / record.totalCadets) * 100)
                        : 0
                      return (
                        <tr key={record.id} className="border-b border-army-900 hover:bg-army-900/30 transition-colors">
                          <td className="py-3 px-4">
                            <p className="text-white font-heading text-xs">{record.date}</p>
                            <p className="text-army-500 font-body text-xs mt-0.5">by {record.markedBy}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gold-500 font-heading text-xs uppercase tracking-wide">{record.sessionType}</span>
                            {record.sessionTitle && record.sessionTitle !== record.sessionType && (
                              <p className="text-army-400 font-body text-xs mt-0.5">{record.sessionTitle}</p>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center hidden sm:table-cell">
                            <span className="text-green-400 font-heading text-base">{record.presentCount}</span>
                            <span className="text-army-600 text-xs">/{record.totalCadets}</span>
                          </td>
                          <td className="py-3 px-4 text-center hidden sm:table-cell">
                            <span className="text-red-400 font-heading text-base">{record.absentCount}</span>
                          </td>
                          <td className="py-3 px-4 text-center hidden md:table-cell">
                            <span className={`font-heading text-base ${
                              pct >= 75 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {pct}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedRecord(record)}
                                title="View details"
                                className="p-1.5 text-army-400 hover:text-gold-400 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => exportCSV(record)}
                                title="Export CSV"
                                className="p-1.5 text-army-400 hover:text-green-400 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteRecord(record.id)}
                                title="Delete"
                                className="p-1.5 text-army-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ DETAIL MODAL ══════════════ */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="bg-military-darker border border-army-700 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-army-800">
              <div>
                <h3 className="font-heading text-sm text-white uppercase tracking-widest">
                  {selectedRecord.sessionTitle || selectedRecord.sessionType}
                </h3>
                <p className="text-army-400 text-xs font-body mt-0.5">
                  {selectedRecord.date} &nbsp;·&nbsp;
                  {selectedRecord.presentCount}/{selectedRecord.totalCadets} Present &nbsp;·&nbsp;
                  {selectedRecord.totalCadets
                    ? Math.round((selectedRecord.presentCount / selectedRecord.totalCadets) * 100)
                    : 0}% rate
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportCSV(selectedRecord)}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-army-400 hover:text-white p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full">
                <thead className="sticky top-0 bg-military-darker border-b border-army-800 z-10">
                  <tr>
                    <th className="text-left py-2.5 px-4 font-heading text-xs text-army-400 uppercase">#</th>
                    <th className="text-left py-2.5 px-4 font-heading text-xs text-army-400 uppercase">Name</th>
                    <th className="text-left py-2.5 px-4 font-heading text-xs text-army-400 uppercase hidden sm:table-cell">Regt. No</th>
                    <th className="text-left py-2.5 px-4 font-heading text-xs text-army-400 uppercase hidden sm:table-cell">Wing</th>
                    <th className="text-center py-2.5 px-4 font-heading text-xs text-army-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedRecord.cadets || []).map((c, i) => (
                    <tr
                      key={i}
                      className={`border-b border-army-900 ${!c.present ? 'bg-red-900/5' : ''}`}
                    >
                      <td className="py-2.5 px-4 text-army-600 text-xs">{i + 1}</td>
                      <td className="py-2.5 px-4 text-white font-heading text-xs uppercase tracking-wide">{c.name}</td>
                      <td className="py-2.5 px-4 text-army-400 text-xs hidden sm:table-cell">{c.regimentalNo}</td>
                      <td className="py-2.5 px-4 text-army-400 text-xs hidden sm:table-cell">{c.wing}</td>
                      <td className="py-2.5 px-4 text-center">
                        {c.present ? (
                          <span className="text-green-400 font-heading text-xs flex items-center justify-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Present
                          </span>
                        ) : (
                          <span className="text-red-400 font-heading text-xs flex items-center justify-center gap-1">
                            <XCircle className="w-3 h-3" /> Absent
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

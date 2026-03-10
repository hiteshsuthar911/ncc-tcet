import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import {
  Plus,
  X,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Clock,
  MapPin,
  ClipboardCheck,
  Trash2,
  Eye,
  Save,
  AlertTriangle,
  CheckSquare,
  Lock,
  RefreshCw,
  BarChart2,
} from 'lucide-react'
import toast from 'react-hot-toast'

const SESSION_TYPES = ['Training', 'Camp', 'ATC', 'TSC', 'Lecture', 'Parade', 'Social Service', 'Other']

// ── Create Poll Modal ─────────────────────────────────────────────────────────
function CreatePollModal({ onClose, onSaved }) {
  const { userProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    sessionType: 'Training',
    date: '',
    time: '',
    venue: '',
  })

  function handle(k, v) { setForm(p => ({ ...p, [k]: v })) }

  async function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Title is required')
    if (!form.date) return toast.error('Date is required')
    setSaving(true)
    try {
      await addDoc(collection(db, 'polls'), {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        venue: form.venue.trim(),
        status: 'open',
        createdAt: serverTimestamp(),
        createdBy: userProfile?.name || 'Admin',
      })
      toast.success('Poll created! Cadets can now respond.')
      onSaved()
    } catch {
      toast.error('Failed to create poll')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-military-darker border border-army-700 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-army-800">
          <h3 className="font-heading text-lg text-white uppercase tracking-widest">Create Attendance Poll</h3>
          <button onClick={onClose} className="text-army-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={submit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
            <div>
              <label className="label-field">Poll Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => handle('title', e.target.value)}
                placeholder="e.g. PT Training Tomorrow — Are You Coming?"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Description / Instructions</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={e => handle('description', e.target.value)}
                placeholder="Details about the session, what to bring, dress code..."
                className="input-field resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">Session Type</label>
                <select value={form.sessionType} onChange={e => handle('sessionType', e.target.value)} className="select-field">
                  {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => handle('date', e.target.value)}
                  className="input-field [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => handle('time', e.target.value)}
                  className="input-field [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="label-field">Venue</label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={e => handle('venue', e.target.value)}
                  placeholder="e.g. TCET Parade Ground"
                  className="input-field"
                />
              </div>
            </div>
            <div className="bg-army-900 border border-army-700 p-4 text-xs font-body text-army-400 leading-relaxed">
              <p className="text-gold-400 font-heading uppercase tracking-wider text-xs mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> How it works
              </p>
              Once created, cadets will see this poll and mark themselves as <strong className="text-white">Coming</strong> or <strong className="text-white">Not Coming</strong>.
              When ready to take attendance, click <strong className="text-white">"Take Attendance"</strong> — it will auto-fill only the cadets who responded <strong className="text-white">Coming</strong> as Present.
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-army-800 bg-military-dark">
            <button type="button" onClick={onClose} className="btn-secondary text-sm py-2">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50">
              {saving ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> : <Save className="w-4 h-4" />}
              Create Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Responses Modal ────────────────────────────────────────────────────────────
function ResponsesModal({ poll, onClose, onAttendanceSaved }) {
  const { userProfile } = useAuth()
  const [responses, setResponses] = useState([])
  const [allCadets, setAllCadets] = useState([])
  const [loading, setLoading] = useState(true)
  const [takingAttendance, setTakingAttendance] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [respSnap, cadetSnap] = await Promise.all([
          getDocs(query(collection(db, 'pollResponses'), where('pollId', '==', poll.id))),
          getDocs(collection(db, 'users')),
        ])
        setResponses(respSnap.docs.map(d => ({ id: d.id, ...d.data() })))
        setAllCadets(cadetSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(u => u.role !== 'admin'))
      } catch {
        toast.error('Failed to load responses')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [poll.id])

  const coming = responses.filter(r => r.response === 'coming')
  const notComing = responses.filter(r => r.response === 'not_coming')
  const respondedUids = new Set(responses.map(r => r.uid))
  const noResponse = allCadets.filter(c => !respondedUids.has(c.uid) && !respondedUids.has(c.id))

  async function closePoll() {
    setClosing(true)
    try {
      await updateDoc(doc(db, 'polls', poll.id), { status: 'closed' })
      toast.success('Poll closed — cadets can no longer respond.')
      onAttendanceSaved()
      onClose()
    } catch {
      toast.error('Failed to close poll')
    } finally {
      setClosing(false)
    }
  }

  async function takeAttendance() {
    if (coming.length === 0) return toast.error('No cadets have marked themselves as Coming.')
    setTakingAttendance(true)
    try {
      // Build cadet data — coming cadets present, everyone else absent
      const cadetData = allCadets.map(c => {
        const resp = responses.find(r => r.uid === (c.uid || c.id))
        return {
          userId: c.id,
          name: c.name || '',
          regimentalNo: c.regimentalNo || '',
          rank: c.rank || 'Cadet',
          wing: c.wing || '',
          present: resp?.response === 'coming',
          pollResponse: resp?.response || 'no_response',
        }
      })

      await addDoc(collection(db, 'attendance'), {
        date: poll.date,
        sessionType: poll.sessionType,
        sessionTitle: poll.title,
        totalCadets: allCadets.length,
        presentCount: coming.length,
        absentCount: allCadets.length - coming.length,
        cadets: cadetData,
        createdAt: serverTimestamp(),
        markedBy: userProfile?.name || 'Admin',
        fromPoll: true,
        pollId: poll.id,
      })

      // Mark poll as converted
      await updateDoc(doc(db, 'polls', poll.id), { status: 'converted' })

      toast.success(`Attendance saved! ${coming.length} present, ${allCadets.length - coming.length} absent.`)
      onAttendanceSaved()
      onClose()
    } catch (err) {
      toast.error('Failed to save attendance')
      console.error(err)
    } finally {
      setTakingAttendance(false)
    }
  }

  const fmt = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-12">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-military-darker border border-army-700 shadow-2xl mb-8">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-army-800">
          <div>
            <h3 className="font-heading text-lg text-white uppercase tracking-widest">{poll.title}</h3>
            <div className="flex flex-wrap gap-4 mt-1.5 text-xs font-body text-army-400">
              {poll.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{fmt(poll.date)}</span>}
              {poll.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{poll.time}</span>}
              {poll.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{poll.venue}</span>}
            </div>
          </div>
          <button onClick={onClose} className="text-army-500 hover:text-white transition-colors mt-1 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="stat-card text-center">
              <p className="font-heading text-2xl text-green-400">{coming.length}</p>
              <p className="text-army-500 text-xs uppercase tracking-wider mt-1">Coming</p>
            </div>
            <div className="stat-card text-center">
              <p className="font-heading text-2xl text-red-400">{notComing.length}</p>
              <p className="text-army-500 text-xs uppercase tracking-wider mt-1">Not Coming</p>
            </div>
            <div className="stat-card text-center">
              <p className="font-heading text-2xl text-army-400">{noResponse.length}</p>
              <p className="text-army-500 text-xs uppercase tracking-wider mt-1">No Response</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-10 bg-army-900 animate-pulse" />)}
            </div>
          ) : (
            <>
              {/* Coming */}
              {coming.length > 0 && (
                <div>
                  <h4 className="font-heading text-xs text-green-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5" /> Coming ({coming.length})
                  </h4>
                  <div className="space-y-1">
                    {coming.map(r => (
                      <div key={r.id} className="flex items-center gap-3 px-3 py-2 bg-army-900 border border-army-800">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                        <span className="font-heading text-sm text-white uppercase tracking-wide flex-1">{r.name}</span>
                        <span className="text-gold-500 text-xs font-body">{r.regimentalNo}</span>
                        <span className="text-army-500 text-xs font-body">{r.wing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Not Coming */}
              {notComing.length > 0 && (
                <div>
                  <h4 className="font-heading text-xs text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <XCircle className="w-3.5 h-3.5" /> Not Coming ({notComing.length})
                  </h4>
                  <div className="space-y-1">
                    {notComing.map(r => (
                      <div key={r.id} className="flex items-center gap-3 px-3 py-2 bg-army-900/50 border border-army-900">
                        <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        <span className="font-heading text-sm text-army-400 uppercase tracking-wide flex-1">{r.name}</span>
                        <span className="text-army-500 text-xs font-body">{r.regimentalNo}</span>
                        <span className="text-army-600 text-xs font-body">{r.wing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No response */}
              {noResponse.length > 0 && (
                <div>
                  <h4 className="font-heading text-xs text-army-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> No Response ({noResponse.length})
                  </h4>
                  <div className="space-y-1">
                    {noResponse.map(c => (
                      <div key={c.id} className="flex items-center gap-3 px-3 py-2 bg-army-950 border border-army-900 opacity-60">
                        <span className="w-3.5 h-3.5 border border-army-600 flex-shrink-0" />
                        <span className="font-heading text-sm text-army-500 uppercase tracking-wide flex-1">{c.name}</span>
                        <span className="text-army-600 text-xs font-body">{c.regimentalNo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-t border-army-800 bg-military-dark">
          {poll.status === 'open' && (
            <button
              onClick={closePoll}
              disabled={closing}
              className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider border border-army-600 hover:border-red-600 text-army-400 hover:text-red-400 px-4 py-2 transition-colors disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" /> Close Poll
            </button>
          )}
          {poll.status !== 'converted' && (
            <button
              onClick={takeAttendance}
              disabled={takingAttendance || coming.length === 0}
              className="btn-primary text-sm flex items-center gap-2 disabled:opacity-40"
            >
              {takingAttendance
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                : <ClipboardCheck className="w-4 h-4" />}
              Take Attendance ({coming.length} Present)
            </button>
          )}
          {poll.status === 'converted' && (
            <span className="flex items-center gap-2 text-green-400 font-heading text-xs uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" /> Attendance Already Saved
            </span>
          )}
          <button onClick={onClose} className="btn-secondary text-sm py-2 ml-auto">Close</button>
        </div>
      </div>
    </div>
  )
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    open:      'text-green-400 border-green-800 bg-green-900/20',
    closed:    'text-army-400 border-army-700 bg-army-900/40',
    converted: 'text-gold-400 border-gold-800 bg-gold-900/20',
  }
  const labels = { open: 'Open', closed: 'Closed', converted: 'Attendance Taken' }
  return (
    <span className={`font-heading text-xs uppercase tracking-wider border px-2 py-0.5 ${map[status] || map.closed}`}>
      {labels[status] || status}
    </span>
  )
}

// ── Main AdminPolls ───────────────────────────────────────────────────────────
export default function AdminPolls() {
  const [polls, setPolls] = useState([])
  const [responseCounts, setResponseCounts] = useState({}) // { pollId: { coming: n, not_coming: n } }
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [viewPoll, setViewPoll] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  async function fetchPolls() {
    try {
      let list = []
      try {
        const q = query(collection(db, 'polls'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      } catch {
        const snap = await getDocs(collection(db, 'polls'))
        list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      }
      setPolls(list)

      // Fetch response counts
      const respSnap = await getDocs(collection(db, 'pollResponses'))
      const counts = {}
      respSnap.docs.forEach(d => {
        const { pollId, response } = d.data()
        if (!counts[pollId]) counts[pollId] = { coming: 0, not_coming: 0 }
        if (response === 'coming') counts[pollId].coming++
        else if (response === 'not_coming') counts[pollId].not_coming++
      })
      setResponseCounts(counts)
    } catch (err) {
      toast.error('Failed to load polls')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPolls() }, [])

  async function deletePoll(id) {
    if (!window.confirm('Delete this poll? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'polls', id))
      setPolls(prev => prev.filter(p => p.id !== id))
      toast.success('Poll deleted')
    } catch {
      toast.error('Failed to delete poll')
    } finally {
      setDeletingId(null)
    }
  }

  const fmt = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '—'

  const open = polls.filter(p => p.status === 'open').length
  const closed = polls.filter(p => p.status === 'closed').length
  const converted = polls.filter(p => p.status === 'converted').length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="section-subtitle">Admin</p>
          <h2 className="font-heading text-2xl text-white uppercase tracking-widest">Attendance Polls</h2>
          <div className="h-px w-16 bg-gold-500 mt-2" />
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Poll
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="stat-card text-center">
          <p className="font-heading text-3xl text-green-400">{open}</p>
          <p className="text-army-500 text-xs uppercase tracking-wider mt-1">Open</p>
        </div>
        <div className="stat-card text-center">
          <p className="font-heading text-3xl text-army-400">{closed}</p>
          <p className="text-army-500 text-xs uppercase tracking-wider mt-1">Closed</p>
        </div>
        <div className="stat-card text-center">
          <p className="font-heading text-3xl text-gold-400">{converted}</p>
          <p className="text-army-500 text-xs uppercase tracking-wider mt-1">Converted</p>
        </div>
      </div>

      {/* How it works */}
      <div className="card-army p-4 mb-6 flex gap-4">
        <BarChart2 className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs font-body text-army-400 leading-relaxed">
          <span className="text-white font-heading uppercase tracking-wider text-xs">How Polls Work: </span>
          Create a poll for an upcoming session → cadets mark <span className="text-green-400">Coming</span> or <span className="text-red-400">Not Coming</span> from their portal →
          Click <span className="text-white">"Take Attendance"</span> to auto-generate an attendance record with <span className="text-green-400">Coming</span> cadets marked Present. No manual roll-call needed.
        </div>
      </div>

      {/* Poll List */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-army-900 animate-pulse" />)}</div>
      ) : polls.length === 0 ? (
        <div className="card-army p-12 text-center">
          <ClipboardCheck className="w-12 h-12 text-army-700 mx-auto mb-3" />
          <p className="text-army-400 font-heading uppercase tracking-wider">No polls created yet.</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary text-sm mt-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create First Poll
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {polls.map(poll => {
            const counts = responseCounts[poll.id] || { coming: 0, not_coming: 0 }
            return (
              <div key={poll.id} className="card-army p-5 hover:border-army-600 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-heading text-white text-sm uppercase tracking-wide">{poll.title}</h3>
                      <StatusBadge status={poll.status} />
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs font-body text-army-500 mb-3">
                      {poll.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{fmt(poll.date)}</span>}
                      {poll.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{poll.time}</span>}
                      {poll.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{poll.venue}</span>}
                      <span className="text-army-600">{poll.sessionType}</span>
                    </div>
                    {poll.description && (
                      <p className="text-army-500 text-xs font-body line-clamp-1 mb-3">{poll.description}</p>
                    )}
                    {/* Response counts */}
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5 text-xs font-body text-green-400">
                        <CheckCircle className="w-3.5 h-3.5" /> {counts.coming} Coming
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-body text-red-400">
                        <XCircle className="w-3.5 h-3.5" /> {counts.not_coming} Not Coming
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setViewPoll(poll)}
                      className="flex items-center gap-1.5 text-xs font-heading uppercase tracking-wider border border-army-600 hover:border-gold-600 text-army-400 hover:text-gold-400 px-3 py-2 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    {poll.status !== 'converted' && (
                      <button
                        onClick={() => setViewPoll(poll)}
                        className="flex items-center gap-1.5 text-xs font-heading uppercase tracking-wider border border-army-700 hover:border-gold-600 text-army-500 hover:text-gold-400 px-3 py-2 transition-colors"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" /> Attendance
                      </button>
                    )}
                    <button
                      onClick={() => deletePoll(poll.id)}
                      disabled={deletingId === poll.id}
                      className="text-army-600 hover:text-red-400 transition-colors p-2 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreatePollModal
          onClose={() => setShowCreate(false)}
          onSaved={() => { setShowCreate(false); fetchPolls() }}
        />
      )}

      {/* Responses modal */}
      {viewPoll && (
        <ResponsesModal
          poll={viewPoll}
          onClose={() => setViewPoll(null)}
          onAttendanceSaved={() => { setViewPoll(null); fetchPolls() }}
        />
      )}
    </div>
  )
}

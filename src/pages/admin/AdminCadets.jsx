import { useEffect, useState, useRef } from 'react'
import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../firebase/config'
import { useForm } from 'react-hook-form'
import { auth } from '../../firebase/config'
import { sendPasswordResetEmail } from 'firebase/auth'
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Search,
  X,
  Save,
  AlertTriangle,
  Shield,
  Upload,
  UserCircle,
  KeyRound,
  RefreshCw,
  Printer,
} from 'lucide-react'
import toast from 'react-hot-toast'

const RANKS = [
  'Cadet', 'Lance Corporal', 'Corporal', 'Sergeant',
  'Company Quarter Master Sergeant', 'Company Sergeant Major',
  'Regimental Quarter Master Sergeant', 'Regimental Sergeant Major',
  'Under Officer', 'Junior Under Officer', 'Senior Under Officer',
]

const WINGS = ['Army', 'Navy', 'Air']

// ── Helpers ──────────────────────────────────────────────────────────────────
function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

async function createFirebaseUser(email, password) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${import.meta.env.VITE_FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: false }),
    }
  )
  const json = await res.json()
  if (!res.ok) {
    const msg = json.error?.message || 'UNKNOWN_ERROR'
    if (msg.includes('EMAIL_EXISTS')) throw Object.assign(new Error(msg), { code: 'auth/email-already-in-use' })
    throw Object.assign(new Error(msg), { code: msg })
  }
  return json.localId
}

function printCredential({ name, regimentalNo, email, password, wing, rank }) {
  const win = window.open('', '_blank', 'width=520,height=700')
  if (!win) { alert('Allow popups to print credentials.'); return }
  win.document.write(`<!DOCTYPE html><html><head><title>NCC TCET – Cadet Credentials</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:#f5f5f5;display:flex;justify-content:center;padding:40px 20px}.card{background:#fff;border:2px solid #2d5016;border-radius:8px;padding:32px;max-width:420px;width:100%;box-shadow:0 4px 16px rgba(0,0,0,.15)}.hdr{text-align:center;border-bottom:1px solid #e5e7eb;padding-bottom:18px;margin-bottom:24px}.logo{font-size:36px;margin-bottom:10px}.t1{font-size:18px;color:#1a2e0d;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin-bottom:4px}.t2{font-size:11px;color:#6b7280;letter-spacing:2px;text-transform:uppercase}.row{margin-bottom:14px}.lbl{font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px}.val{font-size:15px;color:#111827;font-weight:600}.pwd-box{background:#fffbeb;border:1px solid #f59e0b;border-radius:6px;padding:12px 16px;margin-top:6px}.pwd-val{color:#92400e;font-family:'Courier New',monospace;font-size:22px;letter-spacing:3px;font-weight:700}.pwd-note{font-size:10px;color:#b45309;margin-top:6px}.ftr{margin-top:22px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:10px;color:#9ca3af;text-align:center;letter-spacing:1px}@media print{body{background:#fff;padding:0}.card{box-shadow:none;max-width:100%}}</style></head><body><div class="card"><div class="hdr"><div class="logo">🛡️</div><div class="t1">NCC TCET</div><div class="t2">Cadet Login Credentials — Confidential</div></div><div class="row"><div class="lbl">Cadet Name</div><div class="val">${name}</div></div><div class="row"><div class="lbl">Regimental No.</div><div class="val">${regimentalNo}</div></div><div class="row"><div class="lbl">Wing</div><div class="val">${wing||'—'}</div></div><div class="row"><div class="lbl">Rank</div><div class="val">${rank||'—'}</div></div><div class="row"><div class="lbl">Login Email</div><div class="val">${email}</div></div><div class="row"><div class="lbl">Login Password</div><div class="pwd-box"><div class="pwd-val">${password}</div><div class="pwd-note">⚠ Ask cadet to change this password after first login</div></div></div><div class="ftr">NCC TCET Cadet Portal · Strictly Confidential · Do not share</div></div><script>setTimeout(function(){window.print();},500);<\/script></body></html>`)
  win.document.close()
}

// ── Reset Password Modal ─────────────────────────────────────────────────────
function ResetPasswordModal({ cadet, onClose }) {
  const [password, setPassword]   = useState(() => generatePassword())
  const [sending, setSending]     = useState(false)
  const [sent, setSent]           = useState(false)
  const email = `${(cadet.regimentalNo || '').toLowerCase()}@ncc-tcet.in`

  async function handleSendReset() {
    setSending(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
      toast.success('Reset email sent to ' + email)
    } catch (err) {
      const code = err.code || ''
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        // Account may not exist in Auth — just show success silently
        setSent(true)
      } else if (code === 'auth/too-many-requests') {
        toast.error('Too many requests. Wait a few minutes.')
      } else {
        toast.error('Failed to send reset email: ' + (err.message || code))
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-16">
      <div className="card-army w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-army-500 hover:text-white"><X className="w-5 h-5" /></button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-army-800 border border-army-700">
            <KeyRound className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h3 className="font-heading text-white text-sm uppercase tracking-widest">Reset Password</h3>
            <p className="font-body text-army-400 text-xs">{cadet.name} · {cadet.regimentalNo}</p>
          </div>
        </div>

        {/* New password */}
        <div className="mb-5">
          <label className="label-field">New Password</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field font-mono tracking-widest flex-1"
            />
            <button
              onClick={() => setPassword(generatePassword())}
              className="btn-secondary flex items-center gap-1.5 flex-shrink-0"
              title="Generate random password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <p className="text-army-500 text-xs font-body mt-1.5">Login email: <span className="text-army-300 font-mono">{email}</span></p>
        </div>

        {/* Print credential */}
        <button
          onClick={() => printCredential({ name: cadet.name, regimentalNo: cadet.regimentalNo, email, password, wing: cadet.wing || '', rank: cadet.rank || '' })}
          className="btn-secondary w-full flex items-center justify-center gap-2 mb-3"
        >
          <Printer className="w-4 h-4" /> Print New Credential Card
        </button>

        {/* Send reset email */}
        {!sent ? (
          <button
            onClick={handleSendReset}
            disabled={sending}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            {sending ? 'Sending…' : 'Send Password Reset Email to Cadet'}
          </button>
        ) : (
          <div className="bg-green-900/30 border border-green-700/50 px-4 py-3 text-green-300 font-body text-xs text-center">
            ✓ Reset email sent to {email}
          </div>
        )}

        <p className="text-army-600 text-xs font-body mt-4 leading-relaxed">
          Print the credential card and give it to the cadet. The reset email lets them set their new password.
        </p>
      </div>
    </div>
  )
}

function CadetModal({ cadet, onClose, onSaved }) {
  const isEditing = !!cadet
  const [saving, setSaving]         = useState(false)
  const [photoFile, setPhotoFile]   = useState(null)
  const [photoPreview, setPhotoPreview] = useState(cadet?.photoUrl || null)
  const fileRef = useRef()

  function handlePhotoChange(e) {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return }
    setPhotoFile(f)
    setPhotoPreview(URL.createObjectURL(f))
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: cadet?.name || '',
      regimentalNo: cadet?.regimentalNo || '',
      rank: cadet?.rank || 'Cadet',
      wing: cadet?.wing || 'Army',
      year: cadet?.year || '',
      branch: cadet?.branch || '',
      phone: cadet?.phone || '',
      email: cadet?.email || '',
      role: cadet?.role || 'cadet',
      password: '',
    },
  })
  const regimentalNoValue = watch('regimentalNo', '')

  async function onSubmit(data) {
    setSaving(true)
    let photoUrl    = cadet?.photoUrl    || ''
    let storagePath = cadet?.storagePath || ''
    try {
      if (photoFile) {
        const path = `cadets/${Date.now()}_${photoFile.name.replace(/\s+/g, '_')}`
        const sRef = storageRef(storage, path)
        console.log('[Upload] Starting upload to', path, '| storage bucket:', storage.app.options.storageBucket)
        photoUrl    = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('TIMEOUT')), 20000)
          const task = uploadBytesResumable(sRef, photoFile)
          task.on(
            'state_changed',
            () => { clearTimeout(timer) },
            (err) => { clearTimeout(timer); reject(err) },
            async () => { clearTimeout(timer); try { resolve(await getDownloadURL(task.snapshot.ref)) } catch (e) { reject(e) } }
          )
        })
        storagePath = path
      }
      if (!isEditing) {
        if (!data.password || data.password.length < 6) { toast.error('Password must be at least 6 characters'); setSaving(false); return }
        const email = `${data.regimentalNo.toLowerCase()}@ncc-tcet.in`
        const uid = await createFirebaseUser(email, data.password)
        await setDoc(doc(db, 'users', uid), {
          uid,
          name: data.name,
          regimentalNo: data.regimentalNo.toUpperCase(),
          rank: data.rank,
          wing: data.wing,
          year: data.year,
          branch: data.branch,
          phone: data.phone,
          email,
          role: data.role,
          photoUrl,
          storagePath,
          createdAt: serverTimestamp(),
        })
        printCredential({ name: data.name, regimentalNo: data.regimentalNo.toUpperCase(), email, password: data.password, wing: data.wing, rank: data.rank })
        toast.success('Cadet account created! Credentials window opened.')
      } else {
        await updateDoc(doc(db, 'users', cadet.docId), {
          name: data.name,
          rank: data.rank,
          wing: data.wing,
          year: data.year,
          branch: data.branch,
          phone: data.phone,
          role: data.role,
          photoUrl,
          storagePath,
          updatedAt: serverTimestamp(),
        })
        toast.success('Cadet updated!')
      }
      onSaved()
    } catch (err) {
      console.error('[Upload] Error:', err)
      if (err.message === 'TIMEOUT') {
        toast.error('Upload timed out — Firebase Storage may not be enabled. Go to Firebase Console → Storage → Get Started.')
      } else if (err.code === 'auth/email-already-in-use') {
        toast.error('A cadet with this Regimental No. already exists.')
      } else if (err.code === 'storage/unauthorized') {
        toast.error('Permission denied — update Firebase Storage security rules to allow writes.')
      } else {
        toast.error(`Failed to save cadet: ${err.message || err.code || 'Unknown error'}`)
      }
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
          <h3 className="font-heading text-lg text-white uppercase tracking-widest">
            {isEditing ? 'Edit Cadet' : 'Add New Cadet'}
          </h3>
          <button onClick={onClose} className="text-army-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">

            {/* Photo upload */}
            <div>
              <label className="label-field">Cadet Photo</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-4 cursor-pointer"
              >
                <div className="relative w-16 h-16 flex-shrink-0 border border-army-700 hover:border-gold-500 overflow-hidden bg-army-800 flex items-center justify-center transition-colors">
                  {photoPreview
                    ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    : <UserCircle className="w-9 h-9 text-army-600" />}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-army-400 font-body text-xs mb-1.5">
                    {photoPreview ? 'Photo selected — will upload on save' : 'Optional — click to upload a photo (max 5 MB)'}
                  </p>
                  <span className="font-heading text-xs uppercase tracking-wider border border-army-700 hover:border-gold-500 text-army-400 hover:text-gold-400 px-3 py-1.5 transition-colors">
                    {photoPreview ? 'Change Photo' : 'Select Photo'}
                  </span>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label-field">Full Name *</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="e.g. Arjun Sharma"
                  className={`input-field ${errors.name ? 'border-red-700' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1 font-body flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />{errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label-field">Regimental No. *</label>
                <input
                  type="text"
                  {...register('regimentalNo', { required: 'Regimental no. is required' })}
                  placeholder="e.g. MH-01234"
                  readOnly={isEditing}
                  className={`input-field ${isEditing ? 'opacity-60 cursor-not-allowed' : ''} ${errors.regimentalNo ? 'border-red-700' : ''}`}
                />
                {errors.regimentalNo && (
                  <p className="text-red-400 text-xs mt-1 font-body flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />{errors.regimentalNo.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label-field">Role</label>
                <select {...register('role')} className="select-field">
                  <option value="cadet">Cadet</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="label-field">Rank</label>
                <select {...register('rank')} className="select-field">
                  {RANKS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Wing</label>
                <select {...register('wing')} className="select-field">
                  {WINGS.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Year of Study</label>
                <select {...register('year')} className="select-field">
                  <option value="">—</option>
                  {['FE', 'SE', 'TE', 'BE'].map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Branch / Department</label>
                <input
                  type="text"
                  {...register('branch')}
                  placeholder="e.g. Computer Engineering"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Phone</label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="e.g. 9876543210"
                  className="input-field"
                />
              </div>
              {!isEditing && (
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="label-field !mb-0">
                      Password * <span className="text-army-500 font-body normal-case tracking-normal">(for cadet login)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setValue('password', generatePassword())}
                      className="text-xs font-heading uppercase tracking-wider text-gold-500 hover:text-gold-300 border border-gold-700 hover:border-gold-500 px-2 py-1 transition-colors flex-shrink-0"
                    >
                      Auto-Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    {...register('password')}
                    placeholder="Min. 6 characters"
                    className="input-field font-mono tracking-wider"
                    autoComplete="new-password"
                  />
                  <p className="text-army-600 text-xs font-body mt-1">
                    Login email: {regimentalNoValue ? `${regimentalNoValue.toLowerCase()}@ncc-tcet.in` : '{regimentalNo}@ncc-tcet.in'}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-army-800 bg-military-dark">
            <button type="button" onClick={onClose} className="btn-secondary text-sm py-2">Cancel</button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : <Save className="w-4 h-4" />}
              {isEditing ? 'Update Cadet' : 'Add Cadet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminCadets() {
  const [cadets, setCadets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterWing, setFilterWing] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [filterRank, setFilterRank] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCadet, setEditingCadet] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [resetCadet, setResetCadet] = useState(null)

  async function fetchCadets() {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setCadets(snap.docs.map((d) => ({ docId: d.id, ...d.data() })))
    } catch {
      toast.error('Failed to load cadets.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCadets() }, [])

  async function handleDelete(cadet) {
    if (!window.confirm(`Delete cadet ${cadet.name}? This removes their Firestore profile.`)) return
    setDeletingId(cadet.docId)
    try {
      await deleteDoc(doc(db, 'users', cadet.docId))
      setCadets((prev) => prev.filter((c) => c.docId !== cadet.docId))
      toast.success('Cadet profile removed.')
    } catch {
      toast.error('Failed to delete cadet.')
    } finally {
      setDeletingId(null)
    }
  }

  function handleSaved() {
    setShowModal(false)
    setEditingCadet(null)
    fetchCadets()
  }

  const filtered = cadets.filter((c) => {
    const matchSearch =
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.regimentalNo?.toLowerCase().includes(search.toLowerCase()) ||
      c.branch?.toLowerCase().includes(search.toLowerCase())
    const matchWing = !filterWing || c.wing === filterWing
    const matchYear = !filterYear || c.year === filterYear
    const matchRank = !filterRank || c.rank === filterRank
    return matchSearch && matchWing && matchYear && matchRank
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-subtitle">Admin</p>
          <h2 className="font-heading text-2xl text-white uppercase tracking-widest">Cadets</h2>
          <div className="h-px w-16 bg-gold-500 mt-2" />
        </div>
        <button
          onClick={() => { setEditingCadet(null); setShowModal(true) }}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Cadet
        </button>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
          <input
            type="text"
            placeholder="Search by name, regimental no., branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={filterWing}
            onChange={(e) => setFilterWing(e.target.value)}
            className="select-field flex-1 min-w-[120px]"
          >
            <option value="">All Wings</option>
            {['Army', 'Navy', 'Air'].map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="select-field flex-1 min-w-[120px]"
          >
            <option value="">All Years</option>
            {['FE', 'SE', 'TE', 'BE'].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            value={filterRank}
            onChange={(e) => setFilterRank(e.target.value)}
            className="select-field flex-1 min-w-[160px]"
          >
            <option value="">All Ranks</option>
            {RANKS.filter(r => r !== 'All').map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {(filterWing || filterYear || filterRank || search) && (
            <button
              onClick={() => { setSearch(''); setFilterWing(''); setFilterYear(''); setFilterRank('') }}
              className="flex items-center gap-1.5 text-xs font-heading text-army-400 hover:text-white uppercase tracking-wider border border-army-700 hover:border-army-500 px-3 py-2 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
          <span className="text-army-500 text-xs font-body ml-auto">
            {filtered.length} of {cadets.length} cadets
          </span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-army-900 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-army p-12 text-center">
          <Users className="w-12 h-12 text-army-700 mx-auto mb-3" />
          <p className="text-army-400 font-heading uppercase tracking-wider">No cadets found.</p>
          <button
            onClick={() => { setEditingCadet(null); setShowModal(true) }}
            className="btn-primary text-sm mt-4 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add First Cadet
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-army-700">
                {['Cadet', 'Regimental No.', 'Rank', 'Wing', 'Year / Branch', 'Role', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-heading text-xs text-army-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((cadet) => (
                <tr key={cadet.docId} className="border-b border-army-900 hover:bg-army-900/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex-shrink-0 border border-army-700 overflow-hidden bg-army-800 flex items-center justify-center">
                        {cadet.photoUrl
                          ? <img src={cadet.photoUrl} alt={cadet.name} className="w-full h-full object-cover" />
                          : <Shield className="w-4 h-4 text-army-500" />}
                      </div>
                      <p className="font-heading text-sm text-white uppercase tracking-wide">{cadet.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gold-500 text-sm font-body">{cadet.regimentalNo}</td>
                  <td className="px-4 py-4 text-army-300 text-sm font-body">{cadet.rank}</td>
                  <td className="px-4 py-4">
                    <span className="badge-rank">{cadet.wing || '—'}</span>
                  </td>
                  <td className="px-4 py-4 text-army-400 text-xs font-body">
                    <p>{cadet.year || '—'}</p>
                    <p className="line-clamp-1">{cadet.branch}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`font-heading text-xs uppercase tracking-wider border px-2 py-1 ${
                      cadet.role === 'admin'
                        ? 'text-gold-400 border-gold-700'
                        : 'text-army-400 border-army-700'
                    }`}>
                      {cadet.role || 'cadet'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingCadet(cadet); setShowModal(true) }}
                        className="text-army-400 hover:text-gold-400 transition-colors p-1"
                        title="Edit cadet"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setResetCadet(cadet)}
                        className="text-army-400 hover:text-blue-400 transition-colors p-1"
                        title="Reset password"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cadet)}
                        disabled={deletingId === cadet.docId}
                        className="text-army-600 hover:text-red-400 transition-colors p-1 disabled:opacity-50"
                        title="Delete cadet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CadetModal
          cadet={editingCadet}
          onClose={() => { setShowModal(false); setEditingCadet(null) }}
          onSaved={handleSaved}
        />
      )}
      {resetCadet && (
        <ResetPasswordModal
          cadet={resetCadet}
          onClose={() => setResetCadet(null)}
        />
      )}
    </div>
  )
}

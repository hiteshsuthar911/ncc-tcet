import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../firebase/config'
import { useForm } from 'react-hook-form'
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
} from 'lucide-react'
import toast from 'react-hot-toast'

const RANKS = [
  'Cadet', 'Lance Corporal', 'Corporal', 'Sergeant',
  'Company Quarter Master Sergeant', 'Company Sergeant Major',
  'Regimental Quarter Master Sergeant', 'Regimental Sergeant Major',
  'Under Officer', 'Junior Under Officer', 'Senior Under Officer',
]

const WINGS = ['Army', 'Navy', 'Air', 'All']

function CadetModal({ cadet, onClose, onSaved }) {
  const isEditing = !!cadet
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
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

  async function onSubmit(data) {
    setSaving(true)
    try {
      if (!isEditing) {
        if (!data.password) { toast.error('Password is required for new cadets'); setSaving(false); return }
        // Create Firebase Auth user
        const email = `${data.regimentalNo.toLowerCase()}@ncc-tcet.in`
        const cred = await createUserWithEmailAndPassword(auth, email, data.password)
        // Save profile in Firestore
        await addDoc(collection(db, 'users'), {
          uid: cred.user.uid,
          name: data.name,
          regimentalNo: data.regimentalNo.toUpperCase(),
          rank: data.rank,
          wing: data.wing,
          year: data.year,
          branch: data.branch,
          phone: data.phone,
          email: `${data.regimentalNo.toLowerCase()}@ncc-tcet.in`,
          role: data.role,
          createdAt: serverTimestamp(),
        })
        toast.success('Cadet account created!')
      } else {
        await updateDoc(doc(db, 'users', cadet.docId), {
          name: data.name,
          rank: data.rank,
          wing: data.wing,
          year: data.year,
          branch: data.branch,
          phone: data.phone,
          role: data.role,
          updatedAt: serverTimestamp(),
        })
        toast.success('Cadet updated!')
      }
      onSaved()
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        toast.error('A cadet with this Regimental No. already exists.')
      } else {
        toast.error('Failed to save cadet.')
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
                  <label className="label-field">
                    Password * <span className="text-army-500 font-body normal-case tracking-normal">(for cadet login)</span>
                  </label>
                  <input
                    type="password"
                    {...register('password')}
                    placeholder="Min. 6 characters"
                    className="input-field"
                  />
                  <p className="text-army-600 text-xs font-body mt-1">
                    Login email will be: {'{regimentalNo}'}@ncc-tcet.in
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
  const [showModal, setShowModal] = useState(false)
  const [editingCadet, setEditingCadet] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

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

  const filtered = cadets.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.regimentalNo?.toLowerCase().includes(search.toLowerCase()) ||
    c.branch?.toLowerCase().includes(search.toLowerCase())
  )

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

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
        <input
          type="text"
          placeholder="Search by name, regimental no., branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
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
                      <div className="w-8 h-8 bg-army-700 border border-army-600 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-army-400" />
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
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cadet)}
                        disabled={deletingId === cadet.docId}
                        className="text-army-600 hover:text-red-400 transition-colors p-1 disabled:opacity-50"
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
    </div>
  )
}

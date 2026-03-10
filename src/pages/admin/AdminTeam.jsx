import { useEffect, useState, useRef } from 'react'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  serverTimestamp, query, orderBy,
} from 'firebase/firestore'
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../../firebase/config'
import { useForm } from 'react-hook-form'
import {
  Users, Plus, Trash2, Edit2, X, Save, Upload, UserCircle, AlertTriangle,
} from 'lucide-react'
import toast from 'react-hot-toast'

const MEMBER_TYPES = ['officer', 'staff', 'leader']
const WINGS = ['Army', 'Navy', 'Air']
const LEADER_RANKS = ['SUO', 'UO', 'JUO', 'CC', 'CSM', 'Sgt', 'Cpl', 'L/Cpl']

// ─── Reusable image uploader ─────────────────────────────────────────────────
function PhotoUploader({ currentUrl, storageFolder, onUploaded }) {
  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(currentUrl || null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileRef = useRef()

  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function upload() {
    if (!file) return null
    setUploading(true)
    setProgress(0)
    try {
      const path = `${storageFolder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
      const sRef = storageRef(storage, path)
      console.log('[Upload] Starting upload to', path, '| storage bucket:', storage.app.options.storageBucket)
      const url = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('TIMEOUT')), 20000)
        const task = uploadBytesResumable(sRef, file)
        task.on(
          'state_changed',
          (snap) => { clearTimeout(timer); setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)) },
          (err) => { clearTimeout(timer); reject(err) },
          async () => { clearTimeout(timer); try { resolve(await getDownloadURL(task.snapshot.ref)) } catch (e) { reject(e) } }
        )
      })
      onUploaded(url, path)
      return url
    } catch (err) {
      console.error('[Upload] Error:', err)
      if (err.message === 'TIMEOUT') {
        toast.error('Upload timed out — Firebase Storage may not be enabled. Go to Firebase Console → Storage → Get Started.')
      } else if (err.code === 'storage/unauthorized') {
        toast.error('Permission denied — update Firebase Storage security rules.')
      } else {
        toast.error(`Image upload failed: ${err.message || err.code}`)
      }
      return null
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div
        onClick={() => fileRef.current?.click()}
        className="relative w-20 h-20 flex-shrink-0 border border-army-700 hover:border-gold-500 cursor-pointer overflow-hidden bg-army-900 flex items-center justify-center transition-colors"
      >
        {preview ? (
          <img src={preview} alt="Photo" className="w-full h-full object-cover" />
        ) : (
          <UserCircle className="w-10 h-10 text-army-600" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Upload className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-army-300 font-body text-xs mb-1">
          {preview ? 'Photo selected — will upload on save' : 'Click to upload a photo'}
        </p>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="font-heading text-xs uppercase tracking-wider border border-army-700 hover:border-gold-600 text-army-400 hover:text-gold-400 px-3 py-1.5 transition-colors"
        >
          {preview ? 'Change Photo' : 'Select Photo'}
        </button>
        {uploading && <p className="text-army-500 text-xs font-body mt-1 animate-pulse">{progress > 0 ? `Uploading ${progress}%…` : 'Uploading…'}</p>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {/* expose upload function to parent via ref is complex, so we expose it via onUploaded callback */}
    </div>
  )
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────
function TeamMemberModal({ member, onClose, onSaved }) {
  const isEditing = !!member
  const [saving, setSaving]       = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(member?.photoUrl || null)
  const fileRef = useRef()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type:        member?.type        || 'officer',
      name:        member?.name        || '',
      designation: member?.designation || '',
      rank:        member?.rank        || 'UO',
      wing:        member?.wing        || 'Army',
      department:  member?.department  || '',
      email:       member?.email       || '',
      phone:       member?.phone       || '',
      bio:         member?.bio         || '',
      order:       member?.order       || 99,
    },
  })

  const memberType = watch('type')

  function handlePhotoChange(e) {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return }
    setPhotoFile(f)
    setPhotoPreview(URL.createObjectURL(f))
  }

  async function onSubmit(data) {
    setSaving(true)
    let photoUrl    = member?.photoUrl    || ''
    let storagePath = member?.storagePath || ''

    try {
      if (photoFile) {
        const path = `team/${Date.now()}_${photoFile.name.replace(/\s+/g, '_')}`
        const sRef = storageRef(storage, path)
        photoUrl    = await new Promise((resolve, reject) => {
          const task = uploadBytesResumable(sRef, photoFile)
          task.on(
            'state_changed',
            () => {},
            (err) => reject(err),
            async () => { try { resolve(await getDownloadURL(task.snapshot.ref)) } catch (e) { reject(e) } }
          )
        })
        storagePath = path
      }

      const payload = {
        ...data,
        order: Number(data.order),
        photoUrl,
        storagePath,
        updatedAt: serverTimestamp(),
      }

      if (!isEditing) {
        payload.createdAt = serverTimestamp()
        await addDoc(collection(db, 'team'), payload)
        toast.success('Member added!')
      } else {
        await updateDoc(doc(db, 'team', member.docId), payload)
        toast.success('Member updated!')
      }
      onSaved()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save member.')
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
            {isEditing ? 'Edit Member' : 'Add Team Member'}
          </h3>
          <button onClick={onClose} className="text-army-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">

            {/* Photo uploader */}
            <div>
              <label className="label-field">Photo</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-4 cursor-pointer"
              >
                <div className="relative w-20 h-20 flex-shrink-0 border border-army-700 hover:border-gold-500 overflow-hidden bg-army-900 flex items-center justify-center transition-colors">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-10 h-10 text-army-600" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-army-400 font-body text-xs mb-2">
                    {photoPreview ? 'Photo selected' : 'Click to select a photo (max 5 MB)'}
                  </p>
                  <span className="font-heading text-xs uppercase tracking-wider border border-army-700 hover:border-gold-500 text-army-400 hover:text-gold-400 px-3 py-1.5 transition-colors">
                    {photoPreview ? 'Change Photo' : 'Select Photo'}
                  </span>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">Member Type</label>
                <select {...register('type')} className="select-field">
                  <option value="officer">Officer</option>
                  <option value="staff">PI Staff</option>
                  <option value="leader">Cadet Leader</option>
                </select>
              </div>
              <div>
                <label className="label-field">Wing</label>
                <select {...register('wing')} className="select-field">
                  {WINGS.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="label-field">Full Name *</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="e.g. Lt Col Rajesh Sharma"
                  className={`input-field ${errors.name ? 'border-red-700' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1 font-body flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />{errors.name.message}
                  </p>
                )}
              </div>

              {memberType === 'leader' ? (
                <>
                  <div>
                    <label className="label-field">Rank</label>
                    <select {...register('rank')} className="select-field">
                      {LEADER_RANKS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Role / Position</label>
                    <input
                      type="text"
                      {...register('designation')}
                      placeholder="e.g. Battalion Commander"
                      className="input-field"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-2">
                    <label className="label-field">Designation *</label>
                    <input
                      type="text"
                      {...register('designation', { required: 'Designation is required' })}
                      placeholder="e.g. Associate NCC Officer (ANO)"
                      className={`input-field ${errors.designation ? 'border-red-700' : ''}`}
                    />
                    {errors.designation && (
                      <p className="text-red-400 text-xs mt-1 font-body flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />{errors.designation.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-field">Department</label>
                    <input
                      type="text"
                      {...register('department')}
                      placeholder="e.g. Mechanical Engineering"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field">Email</label>
                    <input type="email" {...register('email')} placeholder="email@tcetmumbai.in" className="input-field" />
                  </div>
                  <div>
                    <label className="label-field">Phone</label>
                    <input type="tel" {...register('phone')} placeholder="+91 98765 43210" className="input-field" />
                  </div>
                  <div className="col-span-2">
                    <label className="label-field">Bio</label>
                    <textarea
                      {...register('bio')}
                      rows={3}
                      placeholder="Brief description..."
                      className="input-field resize-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="label-field">Display Order</label>
                <input
                  type="number"
                  {...register('order')}
                  placeholder="1"
                  className="input-field"
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-army-800 bg-military-dark">
            <button type="button" onClick={onClose} className="btn-secondary text-sm py-2">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50">
              {saving
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                : <Save className="w-4 h-4" />}
              {isEditing ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminTeam() {
  const [members, setMembers]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [activeTab, setActiveTab]   = useState('officer') // officer | staff | leader

  async function fetchMembers() {
    try {
      const snap = await getDocs(query(collection(db, 'team'), orderBy('order')))
      setMembers(snap.docs.map(d => ({ docId: d.id, ...d.data() })))
    } catch {
      toast.error('Failed to load team.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMembers() }, [])

  async function handleDelete(m) {
    if (!window.confirm(`Remove ${m.name} from the team?`)) return
    setDeletingId(m.docId)
    try {
      if (m.storagePath) {
        try { await deleteObject(storageRef(storage, m.storagePath)) } catch {}
      }
      await deleteDoc(doc(db, 'team', m.docId))
      setMembers(prev => prev.filter(x => x.docId !== m.docId))
      toast.success('Member removed.')
    } catch {
      toast.error('Failed to delete.')
    } finally {
      setDeletingId(null)
    }
  }

  function handleSaved() {
    setShowModal(false)
    setEditing(null)
    fetchMembers()
  }

  const TABS = [
    { key: 'officer', label: 'Officers' },
    { key: 'staff',   label: 'PI Staff' },
    { key: 'leader',  label: 'Cadet Leaders' },
  ]

  const filtered = members.filter(m => m.type === activeTab)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-subtitle">Admin</p>
          <h2 className="font-heading text-2xl text-white uppercase tracking-widest">Team Management</h2>
          <div className="h-px w-16 bg-gold-500 mt-2" />
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true) }}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-army-800 mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-5 py-3 font-heading text-xs uppercase tracking-widest transition-colors border-b-2 -mb-px ${
              activeTab === t.key
                ? 'text-gold-400 border-gold-500'
                : 'text-army-500 border-transparent hover:text-army-200'
            }`}
          >
            {t.label}
            <span className="ml-2 text-army-600 font-body normal-case tracking-normal">
              ({members.filter(m => m.type === t.key).length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-army p-6 animate-pulse">
              <div className="w-16 h-16 bg-army-700 rounded-full mx-auto mb-4" />
              <div className="h-3 bg-army-700 w-3/4 mx-auto mb-2" />
              <div className="h-2 bg-army-800 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-army p-12 text-center">
          <Users className="w-10 h-10 text-army-700 mx-auto mb-3" />
          <p className="text-army-400 font-heading uppercase tracking-wider text-sm">
            No {TABS.find(t => t.key === activeTab)?.label.toLowerCase()} added yet.
          </p>
          <button
            onClick={() => { setEditing(null); setShowModal(true) }}
            className="btn-primary text-sm mt-4 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add First
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(m => (
            <div key={m.docId} className="card-army relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
              <div className="p-5">
                {/* Photo */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 flex-shrink-0 border border-army-700 overflow-hidden bg-army-800 flex items-center justify-center">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-8 h-8 text-army-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading text-xs text-white uppercase tracking-wide truncate">{m.name}</p>
                    <p className="text-gold-500 font-body text-[11px] mt-0.5">{m.designation}</p>
                    {m.type === 'leader' && m.rank && (
                      <span className="inline-block mt-1 font-heading text-[10px] text-army-400 border border-army-700 px-1.5 py-0.5">
                        {m.rank}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-army-500 font-body text-xs mb-3">
                  {m.wing} Wing{m.department ? ` · ${m.department}` : ''}
                </p>
                {m.bio && (
                  <p className="text-army-400 font-body text-xs leading-relaxed line-clamp-2 mb-3">{m.bio}</p>
                )}
                <div className="flex items-center gap-2 pt-3 border-t border-army-800/60">
                  <button
                    onClick={() => { setEditing(m); setShowModal(true) }}
                    className="flex items-center gap-1.5 text-army-400 hover:text-gold-400 font-heading text-xs uppercase tracking-wider transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m)}
                    disabled={deletingId === m.docId}
                    className="flex items-center gap-1.5 text-army-600 hover:text-red-400 font-heading text-xs uppercase tracking-wider transition-colors ml-auto disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TeamMemberModal
          member={editing}
          onClose={() => { setShowModal(false); setEditing(null) }}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

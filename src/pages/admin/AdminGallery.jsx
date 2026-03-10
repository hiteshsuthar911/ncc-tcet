import { useEffect, useState, useRef } from 'react'
import {
  collection, getDocs, addDoc, deleteDoc, doc,
  serverTimestamp, query, orderBy,
} from 'firebase/firestore'
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../../firebase/config'
import { Camera, Plus, Trash2, Upload, X, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Parade', 'Camp', 'Adventure', 'Training', 'Social', 'Cultural', 'Other']

function AddPhotoModal({ onClose, onAdded }) {
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [caption, setCaption]   = useState('')
  const [category, setCategory] = useState('Parade')
  const [year, setYear]         = useState(new Date().getFullYear().toString())
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileRef = useRef()

  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit() {
    if (!file)    { toast.error('Please select an image'); return }
    if (!caption) { toast.error('Caption is required');    return }
    setUploading(true)
    setUploadProgress(0)
    try {
      const path = `gallery/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
      const sRef = storageRef(storage, path)
      console.log('[Upload] Starting upload to', path, '| storage bucket:', storage.app.options.storageBucket)
      const imageUrl = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('TIMEOUT')), 20000)
        const task = uploadBytesResumable(sRef, file)
        task.on(
          'state_changed',
          (snap) => {
            clearTimeout(timer)
            setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100))
          },
          (err) => { clearTimeout(timer); reject(err) },
          async () => { clearTimeout(timer); try { resolve(await getDownloadURL(task.snapshot.ref)) } catch (e) { reject(e) } }
        )
      })
      await addDoc(collection(db, 'gallery'), {
        imageUrl,
        storagePath: path,
        caption,
        category,
        year,
        takenAt: serverTimestamp(),
      })
      toast.success('Photo uploaded!')
      onAdded()
    } catch (err) {
      console.error('[Upload] Error:', err)
      if (err.message === 'TIMEOUT') {
        toast.error('Upload timed out — Firebase Storage may not be enabled. Go to Firebase Console → Storage → Get Started.')
      } else if (err.code === 'storage/unauthorized') {
        toast.error('Permission denied — update Firebase Storage security rules to allow writes.')
      } else {
        toast.error(`Upload failed: ${err.message || err.code || 'Unknown error'}`)
      }
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md bg-military-darker border border-army-700 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-army-800">
          <h3 className="font-heading text-lg text-white uppercase tracking-widest">Add Photo</h3>
          <button onClick={onClose} className="text-army-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Image picker */}
          <div
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer border border-dashed border-army-600 hover:border-gold-500 transition-colors flex flex-col items-center justify-center h-44 bg-army-900/30 overflow-hidden"
          >
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-army-500 mb-2" />
                <p className="text-army-400 font-body text-xs">Click to select image (max 5 MB)</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          <div>
            <label className="label-field">Caption *</label>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="input-field"
              placeholder="e.g. Republic Day Parade 2024 — Mumbai"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="select-field">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Year</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                className="input-field"
                min="2015"
                max="2035"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-army-800 bg-military-dark">
          <button onClick={onClose} className="btn-secondary text-sm py-2">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {uploading
              ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
              : <Upload className="w-4 h-4" />}
            {uploading ? (uploadProgress > 0 ? `Uploading ${uploadProgress}%…` : 'Uploading…') : 'Upload Photo'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminGallery() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [catFilter, setCatFilter] = useState('All')
  const [deletingId, setDeletingId] = useState(null)

  async function fetchItems() {
    try {
      const snap = await getDocs(query(collection(db, 'gallery'), orderBy('takenAt', 'desc')))
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch {
      toast.error('Failed to load gallery.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item.caption}"? This cannot be undone.`)) return
    setDeletingId(item.id)
    try {
      if (item.storagePath) {
        try { await deleteObject(storageRef(storage, item.storagePath)) } catch {}
      }
      await deleteDoc(doc(db, 'gallery', item.id))
      setItems(prev => prev.filter(i => i.id !== item.id))
      toast.success('Photo deleted.')
    } catch {
      toast.error('Failed to delete.')
    } finally {
      setDeletingId(null)
    }
  }

  const allCats = ['All', ...CATEGORIES]
  const filtered = catFilter === 'All' ? items : items.filter(i => i.category === catFilter)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-subtitle">Admin</p>
          <h2 className="font-heading text-2xl text-white uppercase tracking-widest">Photo Gallery</h2>
          <div className="h-px w-16 bg-gold-500 mt-2" />
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <Filter className="w-4 h-4 text-army-500 flex-shrink-0" />
        {allCats.map(cat => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            className={`font-heading text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors ${
              catFilter === cat
                ? 'border-gold-600 text-gold-400 bg-gold-900/10'
                : 'border-army-700 text-army-400 hover:text-army-200'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="text-army-500 text-xs font-body ml-auto">
          {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-army-800 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-army p-16 text-center">
          <Camera className="w-12 h-12 text-army-700 mx-auto mb-4" />
          <p className="text-army-400 font-heading uppercase tracking-wider">No photos yet.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm mt-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(item => (
            <div key={item.id} className="group relative aspect-square overflow-hidden border border-army-800 hover:border-gold-600 transition-colors">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-army-900">
                  <Camera className="w-8 h-8 text-army-700" />
                </div>
              )}
              {/* Hover overlay with delete */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                  className="p-1.5 bg-red-900/90 hover:bg-red-700 text-red-300 transition-colors disabled:opacity-50 border border-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {/* Caption bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/75 px-2 py-1.5">
                <p className="text-white font-body text-[10px] truncate">{item.caption}</p>
                <p className="text-gold-400 font-heading text-[9px] uppercase tracking-wider mt-0.5">
                  {item.category} · {item.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddPhotoModal
          onClose={() => setShowModal(false)}
          onAdded={() => { setShowModal(false); fetchItems() }}
        />
      )}
    </div>
  )
}

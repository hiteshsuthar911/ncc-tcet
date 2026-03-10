import { useEffect, useState } from 'react'
import { getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { Bell, Save, BellOff, Eye, Megaphone, AlertTriangle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const TYPES = [
  { value: 'info',    label: 'Info (Gold)',    Icon: Megaphone,     cls: 'text-gold-400'  },
  { value: 'warning', label: 'Warning (Red)',  Icon: AlertTriangle, cls: 'text-red-400'   },
  { value: 'success', label: 'Success (Green)',Icon: CheckCircle,   cls: 'text-green-400' },
]

export default function AdminNotifications() {
  const [form, setForm] = useState({ message: '', type: 'info', link: '', isActive: false })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    async function fetchCurrent() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'notification'))
        if (snap.exists()) {
          const d = snap.data()
          setForm({ message: d.message || '', type: d.type || 'info', link: d.link || '', isActive: d.isActive || false })
        }
      } catch { /* ignore */ } finally {
        setLoading(false)
      }
    }
    fetchCurrent()
  }, [])

  async function handleSave() {
    if (!form.message.trim()) {
      toast.error('Please enter a notification message')
      return
    }
    setSaving(true)
    try {
      await setDoc(doc(db, 'settings', 'notification'), {
        message: form.message.trim(),
        type: form.type,
        link: form.link.trim(),
        isActive: form.isActive,
        updatedAt: serverTimestamp(),
      })
      toast.success('Notification saved!')
    } catch {
      toast.error('Failed to save notification')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeactivate() {
    setSaving(true)
    try {
      await setDoc(doc(db, 'settings', 'notification'), { isActive: false, updatedAt: serverTimestamp() }, { merge: true })
      setForm(f => ({ ...f, isActive: false }))
      toast.success('Notification hidden from site')
    } catch {
      toast.error('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const PreviewBar = () => {
    if (!form.message) return null
    const type = TYPES.find(t => t.value === form.type) || TYPES[0]
    const barCls = {
      info:    'bg-army-950 border-gold-700',
      warning: 'bg-red-950 border-red-800',
      success: 'bg-green-950 border-green-800',
    }[form.type]
    const textCls = {
      info: 'text-gold-200', warning: 'text-red-200', success: 'text-green-200',
    }[form.type]
    return (
      <div className={`w-full border-b ${barCls} flex items-center px-4 py-2.5 gap-3`}>
        <type.Icon className={`w-4 h-4 flex-shrink-0 ${type.cls}`} />
        <p className={`flex-1 font-body text-sm truncate ${textCls}`}>{form.message}</p>
        {form.link && <span className={`font-heading text-xs uppercase underline ${textCls}`}>Details</span>}
        <span className={`font-body text-xs opacity-50 ${textCls}`}>✕</span>
      </div>
    )
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="section-subtitle">Admin</p>
        <h2 className="font-heading text-2xl text-white uppercase tracking-widest">Notification Bar</h2>
        <div className="h-px w-16 bg-gold-500 mt-2" />
        <p className="text-army-400 font-body text-sm mt-3">
          Manage the announcement bar that appears at the top of every public page.
        </p>
      </div>

      {/* Status Banner */}
      <div className={`flex items-center gap-3 p-4 border mb-6 ${form.isActive ? 'border-green-800 bg-green-900/10' : 'border-army-700 bg-army-900/20'}`}>
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${form.isActive ? 'bg-green-400' : 'bg-army-600'}`} />
        <p className={`font-heading text-xs uppercase tracking-widest ${form.isActive ? 'text-green-400' : 'text-army-400'}`}>
          Notification bar is {form.isActive ? 'ACTIVE — visible to all visitors' : 'INACTIVE — hidden from site'}
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Message */}
        <div>
          <label className="label-field">Message <span className="text-gold-500">*</span></label>
          <textarea
            rows={3}
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            className="input-field w-full resize-none"
            placeholder="e.g. Enrollment open for AY 2025-26 — apply before 31 July!"
            maxLength={200}
          />
          <p className="text-army-600 font-body text-xs mt-1">{form.message.length}/200 characters</p>
        </div>

        {/* Type */}
        <div>
          <label className="label-field">Type</label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setForm(f => ({ ...f, type: t.value }))}
                className={`flex flex-col items-center gap-1.5 p-3 border transition-colors ${
                  form.type === t.value ? 'border-gold-600 bg-gold-900/10' : 'border-army-700 hover:border-army-500'
                }`}
              >
                <t.Icon className={`w-4 h-4 ${t.cls}`} />
                <span className="font-heading text-xs text-army-300 uppercase tracking-wider">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Optional link */}
        <div>
          <label className="label-field">Optional Link URL</label>
          <input
            type="url"
            value={form.link}
            onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
            className="input-field w-full"
            placeholder="https://… (optional — shows 'Details' button)"
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
            className={`relative w-12 h-6 rounded-full transition-colors ${form.isActive ? 'bg-green-600' : 'bg-army-700'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-6' : ''}`} />
          </button>
          <span className="text-army-300 font-body text-sm">
            {form.isActive ? 'Active — will show on site' : 'Inactive — hidden from site'}
          </span>
        </div>

        {/* Preview */}
        {form.message && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-3.5 h-3.5 text-army-500" />
              <p className="text-army-500 font-body text-xs uppercase tracking-wider">Preview</p>
            </div>
            <div className="border border-army-700 overflow-hidden">
              <PreviewBar />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 btn-primary disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save & Publish'}
          </button>
          {form.isActive && (
            <button
              onClick={handleDeactivate}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 border border-red-800 text-red-400 hover:bg-red-900/10 transition-colors font-heading text-xs uppercase tracking-wider disabled:opacity-50"
            >
              <BellOff className="w-4 h-4" /> Deactivate
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

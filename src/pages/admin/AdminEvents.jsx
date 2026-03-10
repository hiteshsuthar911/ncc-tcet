import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useForm } from 'react-hook-form'
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Calendar,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Save,
  X,
  AlertTriangle,
  MapPin,
  Clock,
  Image,
  Award,
  Phone,
  User,
  Shield,
  FileText,
  Link,
  Info,
} from 'lucide-react'
import toast from 'react-hot-toast'

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone Number' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date Picker' },
]

const CATEGORIES = ['Training', 'Camp', 'Competition', 'Social Service', 'Adventure', 'Workshop', 'Republic Day', 'Other']

const CERTIFICATE_TYPES = ['None', 'A Certificate', 'B Certificate', 'C Certificate', 'Participation Certificate']
const WINGS = ['Army', 'Navy', 'Air']
const YEARS = ['1st Year', '2nd Year', '3rd Year', 'All Years']

function generateId() {
  return `field_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

// ── Field Builder Item ────────────────────────────────────────────────────────
function FieldBuilderItem({ index, field, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(true)
  const needsOptions = ['select', 'radio'].includes(field.type)

  function handleChange(key, value) {
    onUpdate(index, { ...field, [key]: value })
  }

  function addOption() {
    const opts = field.options || []
    onUpdate(index, {
      ...field,
      options: [...opts, { label: '', value: `opt_${opts.length + 1}` }],
    })
  }

  function updateOption(optIdx, key, value) {
    const opts = [...(field.options || [])]
    opts[optIdx] = { ...opts[optIdx], [key]: value }
    onUpdate(index, { ...field, options: opts })
  }

  function removeOption(optIdx) {
    const opts = (field.options || []).filter((_, i) => i !== optIdx)
    onUpdate(index, { ...field, options: opts })
  }

  return (
    <div className="border border-army-700 bg-army-950">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-army-800">
        <GripVertical className="w-4 h-4 text-army-600 cursor-grab flex-shrink-0" />
        <span className="font-heading text-xs text-gold-400 uppercase tracking-wider flex-1">
          {field.label || `Field ${index + 1}`}
          <span className="text-army-600 ml-2 normal-case font-body tracking-normal">
            ({FIELD_TYPES.find((t) => t.value === field.type)?.label || field.type})
          </span>
        </span>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-army-500 hover:text-army-300 transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-army-600 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Field Label *</label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="e.g. Blood Group"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Field Type</label>
              <select
                value={field.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="select-field"
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Placeholder</label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                placeholder="Hint text..."
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Help Text</label>
              <input
                type="text"
                value={field.helpText || ''}
                onChange={(e) => handleChange('helpText', e.target.value)}
                placeholder="Additional guidance..."
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!field.required}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="accent-gold-500 w-4 h-4"
              />
              <span className="text-army-300 text-sm font-body">Required field</span>
            </label>
          </div>

          {/* Options for select/radio */}
          {needsOptions && (
            <div>
              <label className="label-field">Options</label>
              <div className="space-y-2 mb-2">
                {(field.options || []).map((opt, optIdx) => (
                  <div key={optIdx} className="flex gap-2">
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => updateOption(optIdx, 'label', e.target.value)}
                      placeholder={`Option ${optIdx + 1} label`}
                      className="input-field flex-1 py-2"
                    />
                    <input
                      type="text"
                      value={opt.value}
                      onChange={(e) => updateOption(optIdx, 'value', e.target.value)}
                      placeholder="value"
                      className="input-field w-28 py-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(optIdx)}
                      className="text-army-600 hover:text-red-400 transition-colors px-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addOption}
                className="text-xs font-heading text-army-400 hover:text-gold-400 uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Option
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Event Form Modal ──────────────────────────────────────────────────────────
function EventFormModal({ event, onClose, onSaved }) {
  const isEditing = !!event
  const [fields, setFields] = useState(event?.fields || [])
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      category: event?.category || '',
      date: event?.date
        ? new Date(event.date.seconds ? event.date.seconds * 1000 : event.date)
            .toISOString()
            .split('T')[0]
        : '',
      time: event?.time || '',
      registrationDeadline: event?.registrationDeadline || '',
      reportingTime: event?.reportingTime || '',
      duration: event?.duration || '',
      venue: event?.venue || '',
      venueAddress: event?.venueAddress || '',
      mapLink: event?.mapLink || '',
      bannerUrl: event?.bannerUrl || '',
      maxParticipants: event?.maxParticipants || '',
      wingArmy: event?.eligibleWings?.includes('Army') ?? true,
      wingNavy: event?.eligibleWings?.includes('Navy') ?? true,
      wingAir: event?.eligibleWings?.includes('Air') ?? true,
      minRank: event?.minRank || '',
      yearOfStudy: event?.yearOfStudy || '',
      pointsAwarded: event?.pointsAwarded || '',
      certificateType: event?.certificateType || 'None',
      instructions: event?.instructions || '',
      contactName: event?.contactName || '',
      contactPhone: event?.contactPhone || '',
      isActive: event?.isActive ?? true,
    },
  })

  function addField() {
    setFields((prev) => [
      ...prev,
      { id: generateId(), label: '', type: 'text', required: false, placeholder: '', helpText: '', options: [] },
    ])
  }

  function updateField(index, updated) {
    setFields((prev) => prev.map((f, i) => (i === index ? updated : f)))
  }

  function removeField(index) {
    setFields((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(data) {
    // Validate all field labels filled
    const emptyLabel = fields.find((f) => !f.label.trim())
    if (emptyLabel) {
      toast.error('All custom fields must have a label.')
      return
    }

    setSaving(true)
    try {
      const eligibleWings = WINGS.filter((w) => data[`wing${w}`])
      const { wingArmy, wingNavy, wingAir, ...rest } = data
      const payload = {
        ...rest,
        maxParticipants: data.maxParticipants ? Number(data.maxParticipants) : null,
        pointsAwarded: data.pointsAwarded ? Number(data.pointsAwarded) : null,
        isActive: Boolean(data.isActive),
        eligibleWings,
        fields: fields.map((f) => ({ ...f, label: f.label.trim() })),
        updatedAt: serverTimestamp(),
      }
      if (!isEditing) {
        payload.createdAt = serverTimestamp()
        await addDoc(collection(db, 'events'), payload)
        toast.success('Event created successfully!')
      } else {
        await updateDoc(doc(db, 'events', event.id), payload)
        toast.success('Event updated successfully!')
      }
      onSaved()
    } catch (err) {
      toast.error('Failed to save event.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-12">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-military-darker border border-army-700 shadow-2xl shadow-black/50 mb-8">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-army-800">
          <div>
            <h2 className="font-heading text-lg text-white uppercase tracking-widest">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h2>
            <p className="text-army-500 text-xs font-body mt-0.5">Fill in all relevant details for this event</p>
          </div>
          <button onClick={onClose} className="text-army-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-thin">

            {/* ── Section 1: Basic Info ─────────────────────── */}
            <div className="border border-army-800 p-4">
              <h3 className="font-heading text-xs text-gold-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" /> Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label-field">Event Title *</label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    placeholder="e.g. Annual Training Camp 2025"
                    className={`input-field ${errors.title ? 'border-red-700' : ''}`}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1 font-body flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />{errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label-field">Description *</label>
                  <textarea
                    rows={3}
                    {...register('description', { required: 'Description is required' })}
                    placeholder="Describe the event objectives, activities, and what cadets can expect..."
                    className={`input-field resize-none ${errors.description ? 'border-red-700' : ''}`}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-xs mt-1 font-body flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />{errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Category</label>
                    <select {...register('category')} className="select-field">
                      <option value="">— Select —</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Max Participants</label>
                    <input
                      type="number"
                      min="1"
                      {...register('maxParticipants')}
                      placeholder="Leave blank for unlimited"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-field flex items-center gap-1.5"><Image className="w-3.5 h-3.5" /> Banner Image URL</label>
                  <input
                    type="url"
                    {...register('bannerUrl')}
                    placeholder="https://example.com/banner.jpg"
                    className="input-field"
                  />
                  <p className="text-army-600 text-xs font-body mt-1">Paste a direct image link to show as the event banner.</p>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register('isActive')}
                    className="accent-gold-500 w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-army-300 text-sm font-body cursor-pointer">
                    Event is active <span className="text-army-500">(visible to cadets for registration)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* ── Section 2: Schedule ───────────────────────── */}
            <div className="border border-army-800 p-4">
              <h3 className="font-heading text-xs text-gold-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Schedule
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Event Date</label>
                    <input
                      type="date"
                      {...register('date')}
                      className="input-field [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="label-field">Start Time</label>
                    <input
                      type="time"
                      {...register('time')}
                      className="input-field [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Registration Deadline</label>
                    <input
                      type="date"
                      {...register('registrationDeadline')}
                      className="input-field [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="label-field">Reporting Time</label>
                    <input
                      type="time"
                      {...register('reportingTime')}
                      className="input-field [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-field">Duration</label>
                  <input
                    type="text"
                    {...register('duration')}
                    placeholder="e.g. 3 Days, Half Day, 2 Hours"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* ── Section 3: Location ───────────────────────── */}
            <div className="border border-army-800 p-4">
              <h3 className="font-heading text-xs text-gold-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Location
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label-field">Venue / Location Name</label>
                  <input
                    type="text"
                    {...register('venue')}
                    placeholder="e.g. TCET Parade Ground, NCC Camp Nashik"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-field">Full Address</label>
                  <textarea
                    rows={2}
                    {...register('venueAddress')}
                    placeholder="Street, Area, City, State — PIN"
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="label-field flex items-center gap-1.5"><Link className="w-3.5 h-3.5" /> Google Maps / Location Link</label>
                  <input
                    type="url"
                    {...register('mapLink')}
                    placeholder="https://maps.google.com/..."
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* ── Section 4: Eligibility & Awards ──────────── */}
            <div className="border border-army-800 p-4">
              <h3 className="font-heading text-xs text-gold-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Eligibility & Awards
              </h3>
              <div className="space-y-4">

                <div>
                  <label className="label-field">Eligible Wings</label>
                  <div className="flex gap-6 mt-2">
                    {WINGS.map((wing) => (
                      <label key={wing} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register(`wing${wing}`)}
                          className="accent-gold-500 w-4 h-4"
                        />
                        <span className="text-army-300 text-sm font-body">{wing}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-army-600 text-xs font-body mt-1">Select which NCC wings can register. Leave all checked for open event.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Minimum Rank Required</label>
                    <input
                      type="text"
                      {...register('minRank')}
                      placeholder="e.g. Lance Corporal, Cadet"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field">Year of Study</label>
                    <select {...register('yearOfStudy')} className="select-field">
                      <option value="">— Any Year —</option>
                      {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Points Awarded</label>
                    <input
                      type="number"
                      min="0"
                      {...register('pointsAwarded')}
                      placeholder="e.g. 10"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field">Certificate Type</label>
                    <select {...register('certificateType')} className="select-field">
                      {CERTIFICATE_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label-field flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Instructions / Special Notes</label>
                  <textarea
                    rows={3}
                    {...register('instructions')}
                    placeholder="List any items to bring, dress code, physical requirements, important rules, or other instructions for the cadets..."
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>

            {/* ── Section 5: Contact ────────────────────────── */}
            <div className="border border-army-800 p-4">
              <h3 className="font-heading text-xs text-gold-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> Contact Person
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Name</label>
                  <input
                    type="text"
                    {...register('contactName')}
                    placeholder="e.g. Lt. Col. Sharma"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</label>
                  <input
                    type="tel"
                    {...register('contactPhone')}
                    placeholder="e.g. 9876543210"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* ── Section 6: Custom Fields ──────────────────────── */}
            <div className="border border-army-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xs text-gold-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Custom Registration Fields
                </h3>
                <button
                  type="button"
                  onClick={addField}
                  className="flex items-center gap-1.5 text-xs font-heading text-gold-400 hover:text-gold-300 uppercase tracking-wider transition-colors border border-gold-600 hover:border-gold-400 px-3 py-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Field
                </button>
              </div>
              {fields.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-army-700">
                  <p className="text-army-500 text-sm font-body">No custom fields yet.</p>
                  <p className="text-army-600 text-xs font-body mt-1">
                    Add fields that cadets must fill when registering.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, idx) => (
                    <FieldBuilderItem
                      key={field.id}
                      index={idx}
                      field={field}
                      onUpdate={updateField}
                      onRemove={removeField}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-army-800 bg-military-dark">
            <button type="button" onClick={onClose} className="btn-secondary text-sm py-2">
              Cancel
            </button>
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
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditing ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Admin Events Page ───────────────────────────────────────────────────
export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  async function fetchEvents() {
    try {
      const snap = await getDocs(collection(db, 'events'))
      const evts = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      setEvents(evts)
    } catch (err) {
      toast.error('Failed to load events. Check Firestore is set up.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [])

  async function toggleActive(event) {
    try {
      await updateDoc(doc(db, 'events', event.id), { isActive: !event.isActive })
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, isActive: !e.isActive } : e))
      )
      toast.success(`Event ${event.isActive ? 'deactivated' : 'activated'}.`)
    } catch {
      toast.error('Failed to update event status.')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this event? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'events', id))
      setEvents((prev) => prev.filter((e) => e.id !== id))
      toast.success('Event deleted.')
    } catch {
      toast.error('Failed to delete event.')
    } finally {
      setDeletingId(null)
    }
  }

  function handleSaved() {
    setShowModal(false)
    setEditingEvent(null)
    fetchEvents()
  }

  const formatDate = (date) => {
    if (!date) return '—'
    const d = date.seconds ? new Date(date.seconds * 1000) : new Date(date)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-subtitle">Admin</p>
          <h2 className="font-heading text-2xl text-white uppercase tracking-widest">Manage Events</h2>
          <div className="h-px w-16 bg-gold-500 mt-2" />
        </div>
        <button
          onClick={() => { setEditingEvent(null); setShowModal(true) }}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      {/* Events Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-army-900 animate-pulse rounded" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="card-army p-12 text-center">
          <Calendar className="w-12 h-12 text-army-700 mx-auto mb-3" />
          <p className="text-army-400 font-heading uppercase tracking-wider">No events created yet.</p>
          <button
            onClick={() => { setEditingEvent(null); setShowModal(true) }}
            className="btn-primary text-sm mt-4 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create First Event
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-army-700">
                {['Event', 'Category', 'Date', 'Fields', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-heading text-xs text-army-400 uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-army-900 hover:bg-army-900/50 transition-colors duration-150"
                >
                  <td className="px-4 py-4">
                    <p className="font-heading text-sm text-white uppercase tracking-wide">
                      {event.title}
                    </p>
                    <p className="text-army-500 text-xs font-body mt-0.5 line-clamp-1">
                      {event.description}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="badge-rank">{event.category || '—'}</span>
                  </td>
                  <td className="px-4 py-4 text-army-400 text-sm font-body">
                    {formatDate(event.date)}
                  </td>
                  <td className="px-4 py-4 text-army-400 text-sm font-body text-center">
                    {event.fields?.length || 0}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleActive(event)}
                      className={`flex items-center gap-1.5 text-xs font-heading uppercase tracking-wider px-2 py-1 border transition-colors duration-200 ${
                        event.isActive
                          ? 'text-green-400 border-green-700 hover:border-red-700 hover:text-red-400'
                          : 'text-army-500 border-army-700 hover:border-green-700 hover:text-green-400'
                      }`}
                    >
                      {event.isActive ? (
                        <><Eye className="w-3 h-3" /> Active</>
                      ) : (
                        <><EyeOff className="w-3 h-3" /> Inactive</>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingEvent(event); setShowModal(true) }}
                        className="text-army-400 hover:text-gold-400 transition-colors p-1"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                        className="text-army-600 hover:text-red-400 transition-colors p-1 disabled:opacity-50"
                        title="Delete"
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

      {/* Modal */}
      {showModal && (
        <EventFormModal
          event={editingEvent}
          onClose={() => { setShowModal(false); setEditingEvent(null) }}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Search,
  AlertTriangle,
  CheckCircle,
  Shield,
  Filter,
} from 'lucide-react'
import toast from 'react-hot-toast'

// Renders a single dynamic field based on its type config
function DynamicField({ field, register, errors, watch }) {
  const errorMsg = errors[field.id]?.message
  const baseClass = `input-field ${errorMsg ? 'border-red-700' : ''}`
  const rules = {
    required: field.required ? `${field.label} is required` : false,
    ...(field.validation || {}),
  }

  switch (field.type) {
    case 'text':
    case 'email':
    case 'tel':
    case 'number':
      return (
        <div>
          <label className="label-field">
            {field.label}{field.required && <span className="text-gold-500 ml-0.5">*</span>}
          </label>
          <input
            type={field.type}
            placeholder={field.placeholder || ''}
            {...register(field.id, rules)}
            className={baseClass}
          />
          {field.helpText && !errorMsg && (
            <p className="text-army-500 text-xs mt-1 font-body">{field.helpText}</p>
          )}
          {errorMsg && (
            <p className="flex items-center gap-1 text-red-400 text-xs mt-1 font-body">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />{errorMsg}
            </p>
          )}
        </div>
      )

    case 'textarea':
      return (
        <div>
          <label className="label-field">
            {field.label}{field.required && <span className="text-gold-500 ml-0.5">*</span>}
          </label>
          <textarea
            rows={field.rows || 3}
            placeholder={field.placeholder || ''}
            {...register(field.id, rules)}
            className={`${baseClass} resize-none`}
          />
          {errorMsg && (
            <p className="flex items-center gap-1 text-red-400 text-xs mt-1 font-body">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />{errorMsg}
            </p>
          )}
        </div>
      )

    case 'select':
      return (
        <div>
          <label className="label-field">
            {field.label}{field.required && <span className="text-gold-500 ml-0.5">*</span>}
          </label>
          <div className="relative">
            <select {...register(field.id, rules)} className={`select-field ${errorMsg ? 'border-red-700' : ''}`}>
              <option value="">— Select —</option>
              {(field.options || []).map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {errorMsg && (
            <p className="flex items-center gap-1 text-red-400 text-xs mt-1 font-body">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />{errorMsg}
            </p>
          )}
        </div>
      )

    case 'radio':
      return (
        <div>
          <label className="label-field">
            {field.label}{field.required && <span className="text-gold-500 ml-0.5">*</span>}
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {(field.options || []).map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  value={opt.value}
                  {...register(field.id, rules)}
                  className="accent-gold-500"
                />
                <span className="text-army-300 text-sm font-body group-hover:text-white transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
          {errorMsg && (
            <p className="flex items-center gap-1 text-red-400 text-xs mt-1 font-body">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />{errorMsg}
            </p>
          )}
        </div>
      )

    case 'checkbox':
      return (
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register(field.id, rules)}
              className="mt-0.5 accent-gold-500 w-4 h-4 flex-shrink-0"
            />
            <span className="text-army-300 text-sm font-body group-hover:text-white transition-colors">
              {field.label}{field.required && <span className="text-gold-500 ml-0.5">*</span>}
            </span>
          </label>
          {errorMsg && (
            <p className="flex items-center gap-1 text-red-400 text-xs mt-1 font-body">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />{errorMsg}
            </p>
          )}
        </div>
      )

    case 'date':
      return (
        <div>
          <label className="label-field">
            {field.label}{field.required && <span className="text-gold-500 ml-0.5">*</span>}
          </label>
          <input
            type="date"
            {...register(field.id, rules)}
            className={`${baseClass} [color-scheme:dark]`}
          />
          {errorMsg && (
            <p className="flex items-center gap-1 text-red-400 text-xs mt-1 font-body">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />{errorMsg}
            </p>
          )}
        </div>
      )

    default:
      return null
  }
}

export default function EventRegistration() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [receiptData, setReceiptData] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const { currentUser, userProfile } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm()

  // Fetch events from Firestore (no composite index needed — filter & sort client-side)
  useEffect(() => {
    async function fetchEvents() {
      try {
        const snap = await getDocs(collection(db, 'events'))
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        const evts = all
          .filter((e) => e.isActive)
          .sort((a, b) => (a.date?.seconds ?? 0) - (b.date?.seconds ?? 0))
        setEvents(evts)

        // Auto-select if ?register=id in URL
        const registerId = searchParams.get('register')
        if (registerId) {
          const found = all.find((e) => e.id === registerId)
          if (found) setSelectedEvent(found)
        }
      } catch (err) {
        console.warn('Firestore not yet available:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  async function onSubmit(data) {
    if (!selectedEvent) return
    if (!currentUser) {
      toast.error('Please log in to register.')
      return
    }

    // Check duplicate registration
    setSubmitting(true)
    try {
      const existing = await getDocs(
        query(
          collection(db, 'registrations'),
          where('eventId', '==', selectedEvent.id),
          where('userId', '==', currentUser.uid)
        )
      )
      if (!existing.empty) {
        toast.error('You are already registered for this event.')
        setSubmitting(false)
        return
      }

      const docRef = await addDoc(collection(db, 'registrations'), {
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        userId: currentUser.uid,
        regimentalNo: userProfile?.regimentalNo || '',
        name: userProfile?.name || '',
        formData: data,
        submittedAt: serverTimestamp(),
        status: 'pending',
      })
      toast.success('Registration submitted successfully!')
      setReceiptData({
        regId: docRef.id,
        name: userProfile?.name || '',
        regimentalNo: userProfile?.regimentalNo || '',
        event: selectedEvent,
        formData: data,
        submittedAt: new Date(),
      })
      setSubmitted(true)
      reset()
    } catch (err) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleSelectEvent(event) {
    setSelectedEvent(event)
    setSubmitted(false)
    setReceiptData(null)
    reset()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categories = [...new Set(events.map((e) => e.category).filter(Boolean))]

  const filteredEvents = events.filter((e) => {
    const matchSearch = e.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = filterCategory ? e.category === filterCategory : true
    return matchSearch && matchCat
  })

  const formatDate = (date) => {
    if (!date) return 'TBA'
    const d = date.seconds ? new Date(date.seconds * 1000) : new Date(date)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="relative py-16 bg-military-darker overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-subtitle">Participate</p>
          <h1 className="section-title text-4xl md:text-5xl mb-2">Event Registration</h1>
          <div className="divider-gold w-24 mt-3" />
          <p className="text-army-300 font-body mt-4 max-w-xl">
            Browse active events and register with your cadet credentials. All fields are verified against the cadet register.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {selectedEvent ? (
          /* ── REGISTRATION FORM ── */
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => { setSelectedEvent(null); setSubmitted(false) }}
              className="flex items-center gap-2 text-army-400 hover:text-gold-400 font-body text-sm mb-6 transition-colors"
            >
              ← Back to Events
            </button>

            <div className="card-army relative overflow-hidden mb-6">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
              <div className="p-6">
                <span className="badge-rank mb-3 inline-flex">{selectedEvent.category || 'Event'}</span>
                <h2 className="font-heading text-2xl text-white uppercase tracking-widest mb-2">
                  {selectedEvent.title}
                </h2>
                <p className="text-army-300 font-body text-sm mb-4">{selectedEvent.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {selectedEvent.date && (
                    <div className="flex items-center gap-2 text-army-400">
                      <Calendar className="w-4 h-4 text-gold-500" />
                      <span className="font-body">{formatDate(selectedEvent.date)}</span>
                    </div>
                  )}
                  {selectedEvent.venue && (
                    <div className="flex items-center gap-2 text-army-400">
                      <MapPin className="w-4 h-4 text-gold-500" />
                      <span className="font-body">{selectedEvent.venue}</span>
                    </div>
                  )}
                  {selectedEvent.maxParticipants && (
                    <div className="flex items-center gap-2 text-army-400">
                      <Users className="w-4 h-4 text-gold-500" />
                      <span className="font-body">Max {selectedEvent.maxParticipants}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {submitted && receiptData ? (
              <div>
                {/* ── Printable Receipt ── */}
                <div id="print-receipt" className="card-army relative overflow-hidden mb-4">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-gold-500 font-heading text-xs uppercase tracking-widest mb-1">NCC TCET — 1 Maharashtra Naval Unit</p>
                        <h2 className="font-heading text-2xl text-white uppercase tracking-widest">Registration Receipt</h2>
                      </div>
                      <CheckCircle className="w-12 h-12 text-gold-500" />
                    </div>
                    <div className="divider-gold mb-6" />

                    {/* Registration ID */}
                    <div className="bg-army-900 border border-gold-500/30 px-4 py-3 mb-6">
                      <p className="text-army-400 font-body text-xs uppercase tracking-widest mb-1">Registration ID</p>
                      <p className="font-heading text-gold-400 text-sm tracking-widest">{receiptData.regId}</p>
                    </div>

                    {/* Cadet Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-1">Cadet Name</p>
                        <p className="text-white font-body font-medium">{receiptData.name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-1">Regimental No.</p>
                        <p className="text-white font-body font-medium">{receiptData.regimentalNo || '—'}</p>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="border border-army-700 p-4 mb-6">
                      <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-3">Event Details</p>
                      <p className="text-white font-heading text-lg uppercase tracking-wide mb-2">{receiptData.event.title}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {receiptData.event.date && (
                          <div className="flex items-center gap-2 text-army-400">
                            <Calendar className="w-3.5 h-3.5 text-gold-500" />
                            <span className="font-body">{formatDate(receiptData.event.date)}</span>
                          </div>
                        )}
                        {receiptData.event.venue && (
                          <div className="flex items-center gap-2 text-army-400">
                            <MapPin className="w-3.5 h-3.5 text-gold-500" />
                            <span className="font-body">{receiptData.event.venue}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dynamic form answers */}
                    {Object.entries(receiptData.formData).filter(([k]) => k !== 'declaration').length > 0 && (
                      <div className="mb-6">
                        <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-3">Submitted Information</p>
                        <div className="space-y-2">
                          {(receiptData.event.fields || []).map((field) => {
                            const val = receiptData.formData[field.id]
                            if (!val) return null
                            return (
                              <div key={field.id} className="flex justify-between border-b border-army-800 pb-2">
                                <span className="text-army-400 font-body text-sm">{field.label}</span>
                                <span className="text-white font-body text-sm">{String(val)}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-end pt-4 border-t border-army-800">
                      <div>
                        <p className="text-army-500 font-body text-xs">Submitted on</p>
                        <p className="text-army-300 font-body text-sm">
                          {receiptData.submittedAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-army-500 font-body text-xs">Status</p>
                        <span className="badge-rank">Pending Review</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="no-print flex gap-3 justify-center">
                  <button
                    onClick={() => window.print()}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    🖨️ Print Receipt
                  </button>
                  <button
                    onClick={() => { setSelectedEvent(null); setSubmitted(false); setReceiptData(null) }}
                    className="btn-secondary text-sm"
                  >
                    Back to Events
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-army relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gold-500" />
                <div className="p-8">
                  <h3 className="font-heading text-lg text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="h-px w-4 bg-gold-500 inline-block" />
                    Registration Form
                  </h3>

                  {!currentUser && (
                    <div className="flex items-start gap-3 border border-yellow-700/50 bg-yellow-900/20 p-4 mb-6">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-yellow-300 text-sm font-body">
                        You must{' '}
                        <Link to="/login" className="underline text-yellow-200">log in</Link>
                        {' '}to register for events.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-5">
                      {/* Auto-filled fields from profile */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label-field">Name</label>
                          <input
                            type="text"
                            value={userProfile?.name || ''}
                            readOnly
                            className="input-field opacity-60 cursor-not-allowed"
                            placeholder="From your profile"
                          />
                        </div>
                        <div>
                          <label className="label-field">Regimental No.</label>
                          <input
                            type="text"
                            value={userProfile?.regimentalNo || ''}
                            readOnly
                            className="input-field opacity-60 cursor-not-allowed"
                            placeholder="From your profile"
                          />
                        </div>
                      </div>

                      {/* Dynamic Fields from Admin */}
                      {(selectedEvent.fields || []).length > 0 ? (
                        (selectedEvent.fields || []).map((field) => (
                          <DynamicField
                            key={field.id}
                            field={field}
                            register={register}
                            errors={errors}
                            watch={watch}
                          />
                        ))
                      ) : (
                        <p className="text-army-500 text-sm font-body text-center py-4 border border-dashed border-army-700">
                          No additional fields for this event.
                        </p>
                      )}

                      {/* Declaration */}
                      <div className="pt-4 border-t border-army-800">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            {...register('declaration', { required: 'You must accept the declaration' })}
                            className="mt-0.5 accent-gold-500 w-4 h-4 flex-shrink-0"
                          />
                          <span className="text-army-300 text-sm font-body group-hover:text-white transition-colors">
                            I hereby declare that the information provided is accurate and I am a currently enrolled cadet of NCC TCET.
                            <span className="text-gold-500"> *</span>
                          </span>
                        </label>
                        {errors.declaration && (
                          <p className="flex items-center gap-1 text-red-400 text-xs mt-1 font-body">
                            <AlertTriangle className="w-3 h-3" />{errors.declaration.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || !currentUser}
                      className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Submit Registration
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── EVENT LIST ── */
          <div>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              {categories.length > 0 && (
                <div className="relative sm:w-48">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="select-field pl-10"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card-army p-6 animate-pulse">
                    <div className="h-4 bg-army-800 rounded mb-3 w-1/3" />
                    <div className="h-6 bg-army-800 rounded mb-2" />
                    <div className="h-4 bg-army-800 rounded w-2/3 mb-4" />
                    <div className="h-10 bg-army-800 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <Shield className="w-16 h-16 text-army-800 mx-auto mb-4" />
                <h3 className="font-heading text-xl text-white uppercase tracking-widest mb-2">
                  No Events Found
                </h3>
                <p className="text-army-500 font-body text-sm">
                  {searchTerm || filterCategory
                    ? 'Try adjusting your search or filter.'
                    : 'No active events at the moment. Check back soon.'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="card-army group hover:bg-army-900 transition-all duration-300 relative overflow-hidden flex flex-col"
                  >
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500/0 to-transparent group-hover:via-gold-500 transition-all duration-500" />
                    <div className="absolute left-0 top-0 w-1 h-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <span className="badge-rank">{event.category || 'Event'}</span>
                        {event.maxParticipants && (
                          <span className="text-army-500 text-xs font-body flex items-center gap-1">
                            <Users className="w-3 h-3" /> {event.maxParticipants}
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading text-lg text-white uppercase tracking-wide mb-2 group-hover:text-gold-400 transition-colors duration-200">
                        {event.title}
                      </h3>
                      <p className="text-army-400 text-sm font-body mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      <div className="space-y-1.5 mb-4">
                        {event.date && (
                          <div className="flex items-center gap-2 text-army-400 text-xs font-body">
                            <Calendar className="w-3.5 h-3.5 text-gold-600" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                        )}
                        {event.time && (
                          <div className="flex items-center gap-2 text-army-400 text-xs font-body">
                            <Clock className="w-3.5 h-3.5 text-gold-600" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.venue && (
                          <div className="flex items-center gap-2 text-army-400 text-xs font-body">
                            <MapPin className="w-3.5 h-3.5 text-gold-600" />
                            <span>{event.venue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <button
                        onClick={() => handleSelectEvent(event)}
                        className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                      >
                        Register <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

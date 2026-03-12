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
  Award,
  Phone,
  Info,
  Tag,
  UserCheck,
  BookOpen,
  ArrowRight,
  ClipboardList,
  Star,
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
                <span className="text-gray-600 text-sm font-body group-hover:text-army-700 transition-colors">
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
            <span className="text-gray-600 text-sm font-body group-hover:text-army-700 transition-colors">
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
      <section className="relative py-16 bg-army-900 overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-subtitle text-gold-400">Participate</p>
          <h1 className="section-title text-4xl md:text-5xl mb-2 text-white">Event Registration</h1>
          <div className="divider-gold w-24 mt-3" />
          <p className="text-gray-300 font-body mt-4 max-w-xl">
            Browse active events and register with your cadet credentials. All fields are verified against the cadet register.
          </p>
          {/* Quick stats strip */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2 text-gray-300 text-sm font-body">
              <Shield className="w-4 h-4 text-gold-400" />
              <span>{events.length} Active Event{events.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm font-body">
              <UserCheck className="w-4 h-4 text-gold-400" />
              <span>Cadet Credentials Required</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm font-body">
              <CheckCircle className="w-4 h-4 text-gold-400" />
              <span>Instant Confirmation</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {selectedEvent ? (
          /* ── REGISTRATION FORM ── */
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => { setSelectedEvent(null); setSubmitted(false) }}
              className="flex items-center gap-2 text-army-400 hover:text-gold-400 font-body text-sm mb-6 transition-colors"
            >
              ← Back to Events
            </button>

            {/* ── Event Briefing Card ── */}
            <div className="card-army relative overflow-hidden mb-6">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
              <div className="p-6">
                {/* Category + Title */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="badge-rank mb-3 inline-flex">{selectedEvent.category || 'Event'}</span>
                    <h2 className="font-heading text-2xl text-white uppercase tracking-widest mt-1">
                      {selectedEvent.title}
                    </h2>
                  </div>
                  {selectedEvent.maxParticipants && (
                    <div className="text-right">
                      <p className="text-army-500 text-xs font-body uppercase tracking-widest mb-1">Capacity</p>
                      <div className="flex items-center gap-2 text-gold-400 font-heading text-lg">
                        <Users className="w-4 h-4" />
                        {selectedEvent.maxParticipants}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <p className="text-army-300 font-body text-sm mb-5 leading-relaxed border-l-2 border-gold-500/40 pl-4">
                    {selectedEvent.description}
                  </p>
                )}

                <div className="divider-gold mb-5" />

                {/* Detail grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 text-sm mb-5">
                  {selectedEvent.date && (
                    <div>
                      <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Date
                      </p>
                      <p className="text-gray-900 font-body font-medium">{formatDate(selectedEvent.date)}</p>
                    </div>
                  )}
                  {selectedEvent.time && (
                    <div>
                      <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Time
                      </p>
                      <p className="text-gray-900 font-body font-medium">{selectedEvent.time}</p>
                    </div>
                  )}
                  {selectedEvent.venue && (
                    <div>
                      <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Venue
                      </p>
                      <p className="text-gray-900 font-body font-medium">{selectedEvent.venue}</p>
                    </div>
                  )}
                  {selectedEvent.duration && (
                    <div>
                      <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Duration
                      </p>
                      <p className="text-gray-900 font-body font-medium">{selectedEvent.duration}</p>
                    </div>
                  )}
                  {selectedEvent.eligibility && (
                    <div>
                      <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Award className="w-3 h-3" /> Eligibility
                      </p>
                      <p className="text-gray-900 font-body font-medium">{selectedEvent.eligibility}</p>
                    </div>
                  )}
                  {selectedEvent.organizer && (
                    <div>
                      <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> Organizer
                      </p>
                      <p className="text-gray-900 font-body font-medium">{selectedEvent.organizer}</p>
                    </div>
                  )}
                  {selectedEvent.reportingTime && (
                    <div>
                      <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Reporting Time
                      </p>
                      <p className="text-gray-900 font-body font-medium">{selectedEvent.reportingTime}</p>
                    </div>
                  )}
                  {selectedEvent.deadline && (
                    <div>
                      <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Registration Deadline
                      </p>
                      <p className="text-gold-400 font-body font-medium">{formatDate(selectedEvent.deadline)}</p>
                    </div>
                  )}
                  {selectedEvent.contact && (
                    <div>
                      <p className="text-army-500 font-body text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Contact
                      </p>
                      <p className="text-gray-900 font-body font-medium">{selectedEvent.contact}</p>
                    </div>
                  )}
                </div>

                {/* Instructions section */}
                {selectedEvent.instructions && (
                  <div className="bg-army-900 border border-army-700 p-4 mb-4">
                    <p className="text-gold-500 font-body text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" /> Instructions &amp; Guidelines
                    </p>
                    <p className="text-army-300 font-body text-sm leading-relaxed whitespace-pre-line">
                      {selectedEvent.instructions}
                    </p>
                  </div>
                )}

                {/* What to bring */}
                {selectedEvent.whatToBring && (
                  <div className="bg-army-900 border border-army-700 p-4">
                    <p className="text-gold-500 font-body text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                      <ClipboardList className="w-3.5 h-3.5" /> What to Bring
                    </p>
                    <p className="text-army-300 font-body text-sm leading-relaxed whitespace-pre-line">
                      {selectedEvent.whatToBring}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {submitted && receiptData ? (
              <div>

                {/* ── Screen success banner ── */}
                <div className="no-print flex items-center gap-3 border border-green-700/50 bg-green-900/20 p-4 mb-6">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-green-300 font-heading text-sm uppercase tracking-wider">Registration Submitted Successfully</p>
                    <p className="text-green-500 font-body text-xs mt-0.5">Your application is now pending review. Print or save your receipt below.</p>
                  </div>
                </div>

                {/* ── Printable Receipt ── */}
                <div id="print-receipt">
                  <div className="receipt-page">

                    {/* ══ LETTERHEAD ══ */}
                    <div className="receipt-letterhead flex items-center gap-4 border-b-2 border-army-600 pb-4 mb-3">
                      {/* NCC Shield SVG */}
                      <div className="receipt-crest flex-shrink-0">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M32 4L54 12V28C54 42 44 54 32 60C20 54 10 42 10 28V12L32 4Z" fill="#1a2214" stroke="#b8860b" strokeWidth="2"/>
                          <path d="M32 10L48 17V28C48 38 41 47 32 52C23 47 16 38 16 28V17L32 10Z" fill="#111808" stroke="#d4a017" strokeWidth="1.2"/>
                          <text x="32" y="30" fontFamily="Arial" fontSize="7" fontWeight="900" textAnchor="middle" fill="#d4a017" letterSpacing="0.5">NATIONAL</text>
                          <text x="32" y="38" fontFamily="Arial" fontSize="7" fontWeight="900" textAnchor="middle" fill="#d4a017" letterSpacing="0.5">CADET</text>
                          <text x="32" y="46" fontFamily="Arial" fontSize="7" fontWeight="900" textAnchor="middle" fill="#d4a017" letterSpacing="0.5">CORPS</text>
                        </svg>
                      </div>
                      <div className="receipt-org-name flex-1 text-center">
                        <span className="org-main block font-heading text-xl text-white uppercase tracking-widest">National Cadet Corps</span>
                        <span className="org-sub block font-body text-gold-400 text-sm mt-0.5">1 Maharashtra Naval Unit — Thakur College of Engineering &amp; Technology</span>
                        <span className="org-address block font-body text-army-400 text-xs mt-0.5">Kandivali (East), Mumbai — 400 101 &nbsp;|&nbsp; Ministry of Defence, Govt. of India</span>
                      </div>
                    </div>

                    {/* ══ DOCUMENT TITLE ══ */}
                    <div className="receipt-title-bar bg-army-800 border border-army-600 text-center py-2 mb-3">
                      <p className="font-heading text-sm text-white uppercase tracking-widest">Event Registration — Acknowledgement Receipt</p>
                    </div>

                    {/* ══ REG ID + DATE ROW ══ */}
                    <div className="receipt-regid-row flex flex-wrap justify-between items-center border border-army-700 bg-army-900/60 px-4 py-2 mb-5 gap-2">
                      <div>
                        <span className="text-army-500 font-body text-xs uppercase tracking-widest mr-2">Registration No.:</span>
                        <span className="font-heading text-gold-400 text-xs tracking-widest break-all">{receiptData.regId}</span>
                      </div>
                      <div>
                        <span className="text-army-500 font-body text-xs uppercase tracking-widest mr-2">Generated:</span>
                        <span className="text-army-300 font-body text-xs">
                          {receiptData.submittedAt.toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                        </span>
                      </div>
                    </div>

                    {/* ══ CADET PARTICULARS ══ */}
                    <div className="receipt-section-header bg-army-700 px-3 py-1.5 mb-0">
                      <p className="font-heading text-xs text-gold-400 uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-3 h-3" /> Part I — Cadet Particulars
                      </p>
                    </div>
                    <table className="receipt-table w-full border-collapse mb-5">
                      <tbody>
                        <tr className="border border-army-700">
                          <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider w-2/5">Full Name</td>
                          <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-body text-sm font-medium">{receiptData.name || '—'}</td>
                        </tr>
                        <tr className="border border-army-700">
                          <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider">Regimental No.</td>
                          <td className="bg-army-950 border border-army-700 px-3 py-2 text-gold-400 font-heading text-sm">{receiptData.regimentalNo || '—'}</td>
                        </tr>
                        <tr className="border border-army-700">
                          <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider">Rank</td>
                          <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-body text-sm">{userProfile?.rank || '—'}</td>
                        </tr>
                        <tr className="border border-army-700">
                          <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider">Wing</td>
                          <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-body text-sm">{userProfile?.wing || '—'}</td>
                        </tr>
                        <tr className="border border-army-700">
                          <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider">Batch / Year</td>
                          <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-body text-sm">{userProfile?.batch || '—'}</td>
                        </tr>
                        <tr className="border border-army-700">
                          <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider">Contact No.</td>
                          <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-body text-sm">{userProfile?.phone || '—'}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* ══ EVENT PARTICULARS ══ */}
                    <div className="receipt-section-header bg-army-700 px-3 py-1.5 mb-0">
                      <p className="font-heading text-xs text-gold-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Part II — Event Particulars
                      </p>
                    </div>
                    <table className="receipt-table w-full border-collapse mb-5">
                      <tbody>
                        <tr className="border border-army-700">
                          <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider w-2/5">Event Name</td>
                          <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-heading text-sm uppercase tracking-wide">{receiptData.event.title}</td>
                        </tr>
                        <tr className="border border-army-700">
                          <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider">Category</td>
                          <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-body text-sm">{receiptData.event.category || '—'}</td>
                        </tr>
                        <tr className="border border-army-700">
                          <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider">Date</td>
                          <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-body text-sm">{receiptData.event.date ? formatDate(receiptData.event.date) : '—'}</td>
                        </tr>
                        <tr className="border border-army-700">
                          <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider">Time</td>
                          <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-body text-sm">{receiptData.event.time || '—'}</td>
                        </tr>
                        <tr className="border border-army-700">
                          <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider">Venue</td>
                          <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-body text-sm">{receiptData.event.venue || '—'}</td>
                        </tr>
                        {receiptData.event.reportingTime && (
                          <tr className="border border-army-700">
                            <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider">Reporting Time</td>
                            <td className="bg-army-950 border border-army-700 px-3 py-2 text-gold-400 font-body text-sm">{receiptData.event.reportingTime}</td>
                          </tr>
                        )}
                        {receiptData.event.organizer && (
                          <tr className="border border-army-700">
                            <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider">Organized By</td>
                            <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-body text-sm">{receiptData.event.organizer}</td>
                          </tr>
                        )}
                        {receiptData.event.contact && (
                          <tr className="border border-army-700">
                            <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider">Event Contact</td>
                            <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-body text-sm">{receiptData.event.contact}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* ══ ADDITIONAL DETAILS (dynamic fields) ══ */}
                    {Object.entries(receiptData.formData).filter(([k]) => k !== 'declaration').length > 0 && (
                      <>
                        <div className="receipt-section-header bg-army-700 px-3 py-1.5 mb-0">
                          <p className="font-heading text-xs text-gold-400 uppercase tracking-widest flex items-center gap-2">
                            <ClipboardList className="w-3 h-3" /> Part III — Additional Information
                          </p>
                        </div>
                        <table className="receipt-table w-full border-collapse mb-5">
                          <tbody>
                            {(receiptData.event.fields || []).map((field) => {
                              const val = receiptData.formData[field.id]
                              if (!val) return null
                              return (
                                <tr key={field.id} className="border border-army-700">
                                  <td className="lbl bg-army-900 border border-army-700 px-3 py-2 text-army-400 font-body text-xs uppercase tracking-wider w-2/5">{field.label}</td>
                                  <td className="bg-white border border-gray-200 px-3 py-2 text-gray-900 font-body text-sm">
                                    {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </>
                    )}

                    {/* ══ CERTIFICATION ══ */}
                    <div className="receipt-cert-text border border-army-600 bg-army-900/40 p-4 mb-5">
                      <p className="text-army-300 font-body text-sm italic leading-relaxed text-justify">
                        This is to acknowledge that <strong className="text-gray-900">{receiptData.name || 'the above-named cadet'}</strong> bearing
                        Regimental No. <strong className="text-gold-600">{receiptData.regimentalNo || '—'}</strong> has
                        successfully submitted a registration application for the event titled
                        <strong className="text-gray-900"> &ldquo;{receiptData.event.title}&rdquo;</strong> organized under
                        1 Maharashtra Naval Unit, NCC TCET. This receipt is an
                        acknowledgement of submission only and does not constitute a confirmed participation.
                        Final approval is subject to review by the Officer-In-Charge.
                      </p>
                    </div>

                    {/* ══ STATUS STRIP ══ */}
                    <div className="receipt-status-strip flex flex-wrap justify-between items-center border border-army-600 bg-army-900/60 px-4 py-2 mb-6 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-army-400 font-body text-xs uppercase tracking-wider">Submission Status:</span>
                        <span className="receipt-status-pending font-heading text-xs text-yellow-400 uppercase tracking-widest border border-yellow-700 px-2 py-0.5">⏳ Pending Approval</span>
                      </div>
                      <div className="text-right">
                        <span className="text-army-400 font-body text-xs uppercase tracking-wider">Submitted: </span>
                        <span className="text-army-300 font-body text-xs">
                          {receiptData.submittedAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                    </div>

                    {/* ══ SIGNATURE BLOCKS ══ */}
                    <div className="receipt-signatures">
                      <div className="receipt-sig-block">
                        <div className="sig-line" />
                        <p>Cadet's Signature</p>
                        <p>{receiptData.name || ''}</p>
                        <p>{receiptData.regimentalNo || ''}</p>
                      </div>
                      <div className="receipt-sig-block">
                        <div className="sig-line" />
                        <p>Officer-In-Charge</p>
                        <p>1 Maharashtra Naval Unit</p>
                        <p>NCC TCET, Mumbai</p>
                      </div>
                    </div>

                    {/* ══ INSTRUCTIONS (screen-only) ══ */}
                    <div className="no-print bg-army-900 border border-gold-500/20 p-4 mb-5">
                      <p className="text-gold-500 font-body text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                        <ArrowRight className="w-3.5 h-3.5" /> Next Steps
                      </p>
                      <ul className="space-y-1.5 text-army-300 font-body text-sm">
                        {[
                          'Your registration is under review by the event coordinator.',
                          'You will be notified of approval via the NCC notice board.',
                          'Print this receipt and bring it to the venue on the day of the event.',
                          'Report in proper NCC uniform unless instructed otherwise.',
                        ].map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-gold-500 font-heading text-xs mt-0.5">{String(i + 1).padStart(2, '0')}.</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* ══ FOOTER ══ */}
                    <div className="receipt-footer border-t border-army-700 pt-3 text-center">
                      <p className="text-army-500 font-body text-xs">
                        This is a system-generated acknowledgement receipt from the NCC TCET Cadet Management Portal.
                      </p>
                      <p className="text-army-600 font-body text-xs mt-0.5">
                        For queries, contact the NCC Office, TCET Campus, Thakur Village, Kandivali (East), Mumbai — 400 101.
                      </p>
                    </div>

                  </div>{/* end receipt-page */}
                </div>

                {/* Action Buttons */}
                <div className="no-print flex flex-wrap gap-3 justify-center mt-6">
                  <button
                    onClick={() => window.print()}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    🖨️ Print / Save as PDF
                  </button>
                  <Link to="/my-registrations" className="btn-secondary text-sm flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" /> View My Registrations
                  </Link>
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
                  <h3 className="font-heading text-lg text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-gold-500" />
                    Registration Form
                  </h3>
                  <p className="text-army-500 font-body text-xs mb-6">All fields marked <span className="text-gold-500">*</span> are mandatory.</p>

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
                    <div className="space-y-6">

                      {/* ── Section 1: Cadet Identity ── */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Shield className="w-4 h-4 text-gold-500" />
                          <h4 className="font-heading text-sm text-gold-500 uppercase tracking-widest">Cadet Identity</h4>
                          <div className="flex-1 h-px bg-army-800" />
                        </div>
                        <p className="text-army-500 font-body text-xs mb-4">These fields are auto-filled from your cadet profile and cannot be edited here.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="label-field">Full Name</label>
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
                          <div>
                            <label className="label-field">Wing</label>
                            <input
                              type="text"
                              value={userProfile?.wing || ''}
                              readOnly
                              className="input-field opacity-60 cursor-not-allowed"
                              placeholder="From your profile"
                            />
                          </div>
                          <div>
                            <label className="label-field">Rank</label>
                            <input
                              type="text"
                              value={userProfile?.rank || ''}
                              readOnly
                              className="input-field opacity-60 cursor-not-allowed"
                              placeholder="From your profile"
                            />
                          </div>
                          <div>
                            <label className="label-field">Batch / Year</label>
                            <input
                              type="text"
                              value={userProfile?.batch || ''}
                              readOnly
                              className="input-field opacity-60 cursor-not-allowed"
                              placeholder="From your profile"
                            />
                          </div>
                          <div>
                            <label className="label-field">Phone</label>
                            <input
                              type="text"
                              value={userProfile?.phone || ''}
                              readOnly
                              className="input-field opacity-60 cursor-not-allowed"
                              placeholder="From your profile"
                            />
                          </div>
                        </div>
                        {currentUser && !userProfile?.wing && (
                          <div className="flex items-start gap-2 mt-3 p-3 border border-army-700 bg-army-900/50">
                            <Info className="w-4 h-4 text-army-500 flex-shrink-0 mt-0.5" />
                            <p className="text-army-500 text-xs font-body">
                              Some profile fields appear empty.{' '}
                              <Link to="/profile" className="text-gold-500 underline">Update your profile</Link> to ensure your registration is complete.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* ── Section 2: Event-Specific Fields ── */}
                      {(selectedEvent.fields || []).length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Star className="w-4 h-4 text-gold-500" />
                            <h4 className="font-heading text-sm text-gold-500 uppercase tracking-widest">Event-Specific Details</h4>
                            <div className="flex-1 h-px bg-army-800" />
                          </div>
                          <div className="space-y-5">
                            {(selectedEvent.fields || []).map((field) => (
                              <DynamicField
                                key={field.id}
                                field={field}
                                register={register}
                                errors={errors}
                                watch={watch}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── Section 3: Declaration ── */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <BookOpen className="w-4 h-4 text-gold-500" />
                          <h4 className="font-heading text-sm text-gold-500 uppercase tracking-widest">Declaration</h4>
                          <div className="flex-1 h-px bg-army-800" />
                        </div>
                        <div className="bg-army-900 border border-army-700 p-4 mb-4 text-army-400 font-body text-xs leading-relaxed space-y-2">
                          <p>By submitting this form, I confirm that:</p>
                          <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>I am a currently enrolled cadet of NCC TCET — 1 Maharashtra Naval Unit.</li>
                            <li>All information provided above is accurate and complete.</li>
                            <li>I understand that providing false information may result in disqualification.</li>
                            <li>I agree to abide by all event rules and NCC discipline standards.</li>
                          </ul>
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            {...register('declaration', { required: 'You must accept the declaration to proceed' })}
                            className="mt-0.5 accent-gold-500 w-4 h-4 flex-shrink-0"
                          />
                          <span className="text-gray-600 text-sm font-body group-hover:text-army-700 transition-colors">
                            I have read and hereby declare that the above statements are true and accurate.
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
                      className="btn-primary w-full mt-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Submitting Registration...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Submit Registration
                          <ArrowRight className="w-4 h-4" />
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
                      {/* Top row: category + capacity */}
                      <div className="flex items-start justify-between mb-3">
                        <span className="badge-rank">{event.category || 'Event'}</span>
                        {event.maxParticipants && (
                          <span className="text-army-500 text-xs font-body flex items-center gap-1">
                            <Users className="w-3 h-3" /> {event.maxParticipants} seats
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg text-white uppercase tracking-wide mb-2 group-hover:text-gold-400 transition-colors duration-200">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-army-400 text-sm font-body mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      {/* Detail rows */}
                      <div className="space-y-1.5 mb-4">
                        {event.date && (
                          <div className="flex items-center gap-2 text-army-400 text-xs font-body">
                            <Calendar className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                            <span>{formatDate(event.date)}</span>
                            {event.time && <span className="text-army-600">•</span>}
                            {event.time && <Clock className="w-3 h-3 text-gold-700 flex-shrink-0" />}
                            {event.time && <span>{event.time}</span>}
                          </div>
                        )}
                        {event.venue && (
                          <div className="flex items-center gap-2 text-army-400 text-xs font-body">
                            <MapPin className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                            <span>{event.venue}</span>
                          </div>
                        )}
                        {event.eligibility && (
                          <div className="flex items-center gap-2 text-army-400 text-xs font-body">
                            <Award className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                            <span>Eligible: {event.eligibility}</span>
                          </div>
                        )}
                        {event.organizer && (
                          <div className="flex items-center gap-2 text-army-400 text-xs font-body">
                            <UserCheck className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                            <span>{event.organizer}</span>
                          </div>
                        )}
                        {event.deadline && (
                          <div className="flex items-center gap-2 text-xs font-body text-yellow-600">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Closes: {formatDate(event.deadline)}</span>
                          </div>
                        )}
                      </div>

                      {/* Fields count indicator */}
                      {(event.fields || []).length > 0 && (
                        <div className="flex items-center gap-1.5 text-army-600 text-xs font-body">
                          <ClipboardList className="w-3 h-3" />
                          <span>{event.fields.length} additional field{event.fields.length !== 1 ? 's' : ''} required</span>
                        </div>
                      )}
                    </div>

                    <div className="px-6 pb-6">
                      <button
                        onClick={() => handleSelectEvent(event)}
                        className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                      >
                        Register Now <ChevronRight className="w-4 h-4" />
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

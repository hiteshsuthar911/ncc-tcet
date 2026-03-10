import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { collection, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'
import {
  Shield, CheckCircle, ChevronRight, BookOpen,
  Star, AlertTriangle, FileText, Clock,
  User, Phone, BookOpen as BookOpenIcon, Activity,
  Send, RefreshCw, Award, Lock,
} from 'lucide-react'

const eligibility = [
  'Indian citizen studying at TCET (enrolled student)',
  'Age between 13 – 26 years',
  'Medically fit (physically and mentally healthy)',
  'Minimum 75% attendance in academic year',
  'Good character and conduct — no disciplinary record',
  'Willing to undergo NCC training on specified days',
]

const documents = [
  { label: 'College Enrollment / Bonafide Certificate', icon: FileText },
  { label: 'Aadhaar Card (original + photocopy)', icon: FileText },
  { label: 'Date of Birth certificate / 10th Marksheet', icon: FileText },
  { label: '2 recent passport-size photographs (white background)', icon: FileText },
  { label: 'Medical fitness certificate from registered doctor', icon: FileText },
  { label: 'Parent / Guardian consent form (for students under 18)', icon: FileText },
]

const steps = [
  {
    no: '01',
    title: 'Pick Up Application',
    desc: 'Collect the NCC application form from the NCC office (Room 102, Main Building) or download it from this portal.',
  },
  {
    no: '02',
    title: 'Fill & Attach Documents',
    desc: 'Complete all sections of the application form and attach the required documents listed below.',
  },
  {
    no: '03',
    title: 'Submit to NCC Office',
    desc: 'Submit the filled form with documents to the NCC ANO (Associate NCC Officer) before the deadline.',
  },
  {
    no: '04',
    title: 'Medical Examination',
    desc: 'Appear for the medical fitness examination conducted by the Army Medical Corps at the college.',
  },
  {
    no: '05',
    title: 'Enrollment & Oath',
    desc: 'Successful candidates take the NCC oath and receive their Regimental Number and uniform.',
  },
  {
    no: '06',
    title: 'Training Begins',
    desc: 'Attend regular weekly drills, camps, and activities as part of the NCC training programme.',
  },
]

const benefits = [
  { title: 'Priority in Defence Recruitment', desc: 'NCC "C" certificate holders get bonus marks in SSB and direct NDA/CDS entries.' },
  { title: 'Leadership Development', desc: 'Develop command skills, public speaking, and crisis management abilities.' },
  { title: 'Scholarship Opportunities', desc: 'Access to Ministry of Defence and state-level NCC scholarships.' },
  { title: 'Adventure Activities', desc: 'Rock climbing, trekking, para-jumping, sailing, and national-level camps.' },
  { title: 'Republic Day Parade', desc: 'Top cadets selected for prestigious Republic Day parade at Rajpath, New Delhi.' },
  { title: 'Character Building', desc: 'Instils discipline, teamwork, national pride, and community service values.' },
]

const DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence & Data Science',
  'Artificial Intelligence & Machine Learning',
  'Other',
]
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '', dob: '', gender: '', bloodGroup: '', aadhaarLast4: '',
      phone: '', parentPhone: '', email: '', address: '',
      department: '', year: '', rollNo: '', collegeId: '',
      wing: '', prevNcc: 'No', prevUnit: '', prevRank: '', prevCert: '',
      agreeEligibility: false, agreeHonest: false,
    },
  })

  async function onSubmit(data) {
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'joinApplications'), {
        ...data,
        status: 'pending',
        submittedAt: serverTimestamp(),
      })
      setSubmitted(true)
    } catch (e) {
      setError('Submission failed. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="card-army relative overflow-hidden p-10 text-center">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="absolute left-0 top-0 w-1 h-full bg-gold-500" />
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-5" />
        <h3 className="font-heading text-xl text-white uppercase tracking-widest mb-3">Application Submitted!</h3>
        <p className="text-army-300 font-body text-sm leading-relaxed max-w-md mx-auto mb-6">
          Your application has been received. The NCC ANO will review it and contact you via phone or college email within 5–7 working days.
          Shortlisted candidates will be called for a medical examination.
        </p>
        <div className="bg-army-900 border border-army-700 p-4 mb-6 text-left max-w-sm mx-auto">
          <p className="text-army-400 font-body text-xs uppercase tracking-widest mb-2">Next Steps</p>
          {['Watch for a call from the NCC office.', 'Prepare required documents (see checklist below).', 'Attend the medical exam on the specified date.', 'Complete the declaration form once enrolled.'].map((s, i) => (
            <div key={i} className="flex items-start gap-2 mt-2">
              <span className="text-gold-500 font-heading text-xs flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}.</span>
              <p className="text-army-300 font-body text-xs">{s}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => { setSubmitted(false); reset() }}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Submit Another Application
        </button>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Section A – Personal */}
      <div className="card-army relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="absolute left-0 top-0 w-1 h-full bg-gold-500" />
        <div className="p-6 sm:p-8">
          <h3 className="font-heading text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <User className="w-4 h-4 text-gold-500" /> A — Personal Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="label-field">Full Name (as in Aadhaar) <span className="text-gold-500">*</span></label>
              <input type="text" {...register('name', { required: 'Required' })} className={`input-field uppercase ${errors.name ? 'border-red-700' : ''}`} placeholder="FIRST MIDDLE LAST" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label-field">Date of Birth <span className="text-gold-500">*</span></label>
              <input type="date" {...register('dob', { required: 'Required' })} className={`input-field [color-scheme:dark] ${errors.dob ? 'border-red-700' : ''}`} />
              {errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob.message}</p>}
            </div>
            <div>
              <label className="label-field">Gender <span className="text-gold-500">*</span></label>
              <select {...register('gender', { required: 'Required' })} className={`select-field ${errors.gender ? 'border-red-700' : ''}`}>
                <option value="">— Select —</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender.message}</p>}
            </div>
            <div>
              <label className="label-field">Blood Group <span className="text-gold-500">*</span></label>
              <select {...register('bloodGroup', { required: 'Required' })} className={`select-field ${errors.bloodGroup ? 'border-red-700' : ''}`}>
                <option value="">— Select —</option>
                {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
              </select>
              {errors.bloodGroup && <p className="text-red-400 text-xs mt-1">{errors.bloodGroup.message}</p>}
            </div>
            <div>
              <label className="label-field">Aadhaar No. (last 4 digits only)</label>
              <input type="text" {...register('aadhaarLast4', { maxLength: 4, pattern: { value: /^\d{0,4}$/, message: '4 digits only' } })} maxLength={4} className="input-field" placeholder="XXXX" />
              {errors.aadhaarLast4 && <p className="text-red-400 text-xs mt-1">{errors.aadhaarLast4.message}</p>}
            </div>
            <div>
              <label className="label-field">Cadet Mobile No. <span className="text-gold-500">*</span></label>
              <input type="tel" {...register('phone', { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' } })} className={`input-field ${errors.phone ? 'border-red-700' : ''}`} placeholder="10-digit mobile number" />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="label-field">Parent / Guardian Mobile <span className="text-gold-500">*</span></label>
              <input type="tel" {...register('parentPhone', { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' } })} className={`input-field ${errors.parentPhone ? 'border-red-700' : ''}`} placeholder="Parent's mobile number" />
              {errors.parentPhone && <p className="text-red-400 text-xs mt-1">{errors.parentPhone.message}</p>}
            </div>
            <div>
              <label className="label-field">College Email <span className="text-gold-500">*</span></label>
              <input type="email" {...register('email', { required: 'Required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter valid email' } })} className={`input-field ${errors.email ? 'border-red-700' : ''}`} placeholder="yourname@tcetmumbai.in" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">Permanent Address <span className="text-gold-500">*</span></label>
              <textarea rows={2} {...register('address', { required: 'Required' })} className={`input-field resize-none ${errors.address ? 'border-red-700' : ''}`} placeholder="House No., Street, Area, City, State — Pin Code" />
              {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Section B – Academic */}
      <div className="card-army relative overflow-hidden">
        <div className="absolute left-0 top-0 w-1 h-full bg-gold-500" />
        <div className="p-6 sm:p-8">
          <h3 className="font-heading text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <BookOpenIcon className="w-4 h-4 text-gold-500" /> B — Academic Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label-field">Department <span className="text-gold-500">*</span></label>
              <select {...register('department', { required: 'Required' })} className={`select-field ${errors.department ? 'border-red-700' : ''}`}>
                <option value="">— Select Department —</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
            </div>
            <div>
              <label className="label-field">Year of Study <span className="text-gold-500">*</span></label>
              <select {...register('year', { required: 'Required' })} className={`select-field ${errors.year ? 'border-red-700' : ''}`}>
                <option value="">— Select Year —</option>
                <option value="FE">First Year (FE)</option>
                <option value="SE">Second Year (SE)</option>
                <option value="TE">Third Year (TE)</option>
                <option value="BE">Final Year (BE)</option>
              </select>
              {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year.message}</p>}
            </div>
            <div>
              <label className="label-field">College Roll No. <span className="text-gold-500">*</span></label>
              <input type="text" {...register('rollNo', { required: 'Required' })} className={`input-field ${errors.rollNo ? 'border-red-700' : ''}`} placeholder="e.g. BV25-SD17" />
              {errors.rollNo && <p className="text-red-400 text-xs mt-1">{errors.rollNo.message}</p>}
            </div>
            <div>
              <label className="label-field">College ID No.</label>
              <input type="text" {...register('collegeId')} className="input-field" placeholder="e.g. 123" />
            </div>
          </div>
        </div>
      </div>

      {/* Section C – NCC Preference */}
      <div className="card-army relative overflow-hidden">
        <div className="absolute left-0 top-0 w-1 h-full bg-gold-500" />
        <div className="p-6 sm:p-8">
          <h3 className="font-heading text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-gold-500" /> C — NCC Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label-field">Wing Preference <span className="text-gold-500">*</span></label>
              <select {...register('wing', { required: 'Required' })} className={`select-field ${errors.wing ? 'border-red-700' : ''}`}>
                <option value="">— Select Wing —</option>
                <option value="Naval">Naval Wing</option>
                <option value="Army">Army Wing</option>
                <option value="Air">Air Wing</option>
              </select>
              {errors.wing && <p className="text-red-400 text-xs mt-1">{errors.wing.message}</p>}
            </div>
            <div>
              <label className="label-field">Previous NCC Enrollment</label>
              <select {...register('prevNcc')} className="select-field">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="label-field">Previous NCC Unit (if any)</label>
              <input type="text" {...register('prevUnit')} className="input-field" placeholder="e.g. 2 Mah NCC Unit" />
            </div>
            <div>
              <label className="label-field">Previous Rank (if any)</label>
              <input type="text" {...register('prevRank')} className="input-field" placeholder="e.g. Lance Corporal" />
            </div>
            <div>
              <label className="label-field">Certificate Obtained (if any)</label>
              <select {...register('prevCert')} className="select-field">
                <option value="">— None —</option>
                <option value="A">A Certificate</option>
                <option value="B">B Certificate</option>
                <option value="C">C Certificate</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Section D – Declarations */}
      <div className="card-army relative overflow-hidden">
        <div className="absolute left-0 top-0 w-1 h-full bg-gold-500" />
        <div className="p-6 sm:p-8">
          <h3 className="font-heading text-sm text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold-500" /> D — Undertaking
          </h3>
          <div className="space-y-4">
            <label className={`flex items-start gap-3 cursor-pointer group border p-3 transition-colors ${errors.agreeEligibility ? 'border-red-700 bg-red-950/20' : 'border-army-800 hover:border-gold-700/50'}`}>
              <input type="checkbox" {...register('agreeEligibility', { required: 'Required' })} className="mt-0.5 accent-gold-500 w-4 h-4 flex-shrink-0" />
              <span className="text-army-300 font-body text-sm leading-relaxed group-hover:text-white transition-colors">
                I confirm that I meet all the eligibility criteria listed above and that I am an enrolled student of TCET, Mumbai. I am medically fit and willing to undergo NCC training. <span className="text-gold-500">*</span>
              </span>
            </label>
            <label className={`flex items-start gap-3 cursor-pointer group border p-3 transition-colors ${errors.agreeHonest ? 'border-red-700 bg-red-950/20' : 'border-army-800 hover:border-gold-700/50'}`}>
              <input type="checkbox" {...register('agreeHonest', { required: 'Required' })} className="mt-0.5 accent-gold-500 w-4 h-4 flex-shrink-0" />
              <span className="text-army-300 font-body text-sm leading-relaxed group-hover:text-white transition-colors">
                I declare that all information provided in this application is true and correct to the best of my knowledge. I understand that any misrepresentation will lead to immediate rejection of this application. <span className="text-gold-500">*</span>
              </span>
            </label>
            {(errors.agreeEligibility || errors.agreeHonest) && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Please accept all undertakings before submitting.
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 border border-red-700 bg-red-950/30 p-4">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 font-body text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary inline-flex items-center gap-2 px-10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting
            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting…</>
            : <><Send className="w-4 h-4" /> Submit Application</>
          }
        </button>
        <p className="text-army-500 font-body text-xs text-center max-w-sm">
          By submitting you agree to the NCC enrollment terms. Submission does not guarantee enrollment — final selection is at the discretion of the ANO.
        </p>
      </div>

    </form>
  )
}

export default function JoinNCC() {
  // null = loading, true = open, false = closed
  const [isLive, setIsLive] = useState(null)

  useEffect(() => {
    async function fetchSetting() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'joinNcc'))
        setIsLive(snap.exists() ? (snap.data().isLive ?? false) : false)
      } catch {
        setIsLive(false)
      }
    }
    fetchSetting()
  }, [])

  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="relative py-20 bg-army-900 overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-army-800 border-2 border-gold-500 mb-6">
            <Shield className="w-10 h-10 text-gold-400" />
          </div>
          <p className="section-subtitle text-gold-400">Enroll Now</p>
          <h1 className="section-title text-4xl md:text-6xl mb-4 text-white">Join NCC TCET</h1>
          <div className="divider-gold w-24 mx-auto mt-3 mb-6" />
          <p className="text-gray-300 font-body text-lg max-w-2xl mx-auto leading-relaxed">
            Be part of India's premier youth development organisation. Train with discipline, serve the nation, and build a career.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#apply-online"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Apply Online
            </a>
            <a
              href="#how-to-join"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4" /> How to Join
            </a>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-16 bg-military-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Advantages</p>
            <h2 className="section-title text-3xl">Why Join NCC?</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="card-army p-6 group hover:bg-army-900 transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500/0 to-transparent group-hover:via-gold-500 transition-all duration-500" />
                <div className="absolute left-0 top-0 w-1 h-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Star className="w-6 h-6 text-gold-500 mb-3" />
                <h3 className="font-heading text-sm text-white uppercase tracking-wide mb-2">{b.title}</h3>
                <p className="text-army-400 font-body text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16 bg-military-darker">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-subtitle">Requirements</p>
            <h2 className="section-title text-3xl">Eligibility Criteria</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>
          <div className="card-army relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-gold-500" />
            <div className="p-8">
              <div className="grid sm:grid-cols-2 gap-4">
                {eligibility.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <p className="text-army-300 font-body text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-army-800 pt-5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-300/80 font-body text-sm">
                  Cadets with any criminal record or pending disciplinary action are not eligible for enrollment. NCC reserves the right to cancel enrollment at any stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section id="how-to-join" className="py-16 bg-military-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Process</p>
            <h2 className="section-title text-3xl">How to Join — Step by Step</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-army-800 hidden sm:block" />
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="flex-shrink-0 w-14 h-14 bg-army-900 border-2 border-gold-500 flex items-center justify-center group-hover:bg-army-800 transition-colors z-10">
                    <span className="font-heading text-gold-400 text-sm">{step.no}</span>
                  </div>
                  <div className="card-army flex-1 p-5 group-hover:bg-army-900 transition-colors">
                    <h3 className="font-heading text-sm text-white uppercase tracking-wide mb-1">{step.title}</h3>
                    <p className="text-army-400 font-body text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section className="py-16 bg-military-darker">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-subtitle">Checklist</p>
            <h2 className="section-title text-3xl">Documents Required</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {documents.map((d, i) => (
              <div key={i} className="card-army p-4 flex items-start gap-4">
                <div className="w-8 h-8 bg-army-800 border border-gold-500/40 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-gold-400" />
                </div>
                <p className="text-army-300 font-body text-sm leading-relaxed">{d.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-16 bg-military-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-subtitle">Timeline</p>
            <h2 className="section-title text-3xl">Important Dates</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { phase: 'Application Open', date: 'July 1 – July 31', note: 'New academic year enrollment window' },
              { phase: 'Medical Exam', date: 'August 10', note: 'Conducted at TCET campus, B-block ground floor' },
              { phase: 'Enrollment Ceremony', date: 'August 26', note: 'NEC Day — oath-taking and uniform issue' },
            ].map((item, i) => (
              <div key={i} className="card-army p-5 text-center group hover:bg-army-900 transition-colors">
                <Clock className="w-6 h-6 text-gold-500 mx-auto mb-3" />
                <p className="font-heading text-xs text-gold-400 uppercase tracking-widest mb-1">{item.phase}</p>
                <p className="font-heading text-xl text-white mb-2">{item.date}</p>
                <p className="text-army-500 font-body text-xs">{item.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 card-army p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-300/80 font-body text-sm">
              Dates are indicative. Contact the NCC office or check the notice board for confirmed dates each academic year.
            </p>
          </div>
        </div>
      </section>

      {/* Online Application Form */}
      <section id="apply-online" className="py-16 bg-military-darker">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-subtitle">Apply Online</p>
            <h2 className="section-title text-3xl">NCC Enrollment Application</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>

          {/* Loading */}
          {isLive === null && (
            <div className="card-army p-10 text-center">
              <RefreshCw className="w-8 h-8 text-gold-400 mx-auto mb-4 animate-spin" />
              <p className="text-army-400 font-body text-sm">Checking registration status…</p>
            </div>
          )}

          {/* Registration Closed */}
          {isLive === false && (
            <div className="card-army relative overflow-hidden p-8 sm:p-12 text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-700 to-transparent" />
              <div className="inline-flex items-center justify-center w-16 h-16 bg-army-800 border-2 border-red-700 mb-6 mx-auto">
                <Lock className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="font-heading text-xl text-white uppercase tracking-widest mb-3">
                Registration Currently Closed
              </h3>
              <div className="h-px w-16 bg-red-700 mx-auto mb-5" />
              <p className="text-army-300 font-body text-sm leading-relaxed max-w-md mx-auto mb-6">
                The NCC TCET enrollment window is not open at this time. Applications will be accepted during the official enrollment period announced by the ANO.
              </p>
              <div className="bg-army-900/60 border border-army-700 p-4 max-w-sm mx-auto text-left mb-6">
                <p className="font-heading text-xs text-gold-400 uppercase tracking-widest mb-2">Stay Updated</p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-army-400 font-body text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                    Watch the college notice board
                  </li>
                  <li className="flex items-center gap-2 text-army-400 font-body text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                    Check the NCC TCET WhatsApp group
                  </li>
                  <li className="flex items-center gap-2 text-army-400 font-body text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                    Visit the NCC office — B-block, Ground floor
                  </li>
                </ul>
              </div>
              <Link to="/about" className="btn-secondary inline-flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" /> Learn About NCC TCET
              </Link>
            </div>
          )}

          {/* Registration Open */}
          {isLive === true && (
            <>
              <p className="text-army-400 font-body text-sm mb-8 text-center max-w-xl mx-auto">
                Fill this form to express your interest in joining NCC TCET. This is a preliminary application — shortlisted candidates will be contacted for the medical exam and formal enrollment.
              </p>
              <div className="inline-flex items-center gap-2 bg-green-900/20 border border-green-800 px-4 py-2 mb-8 mx-auto flex">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_1px_rgba(74,222,128,0.5)]" />
                <span className="font-heading text-xs text-green-400 uppercase tracking-widest">Registration Open</span>
              </div>
              <ApplicationForm />
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-army-900 border-t border-army-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Shield className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h2 className="font-heading text-2xl text-white uppercase tracking-widest mb-3">
            Ready to Serve the Nation?
          </h2>
          <p className="text-gray-300 font-body mb-6">
            Apply online above, or download the declaration form and submit it at the NCC office to begin your enrollment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#apply-online" className="btn-primary inline-flex items-center gap-2">
              <Send className="w-4 h-4" /> Apply Online
            </a>
            <Link to="/declaration" className="btn-secondary inline-flex items-center gap-2">
              <FileText className="w-4 h-4" /> Declaration Form
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

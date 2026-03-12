import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import {
  Printer, Shield, AlertTriangle, User, BookOpen,
  Activity, ClipboardList, Award, Phone, FileText,
} from 'lucide-react'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const DEPARTMENTS = [
  'Computer Engineering', 'Information Technology', 'Electronics & Telecommunication',
  'Mechanical Engineering', 'Civil Engineering', 'Artificial Intelligence & Data Science',
  'Artificial Intelligence & Machine Learning', 'Other',
]
const YEARS = ['First Year (FE)', 'Second Year (SE)', 'Third Year (TE)', 'Final Year (BE)']

const DECLARATIONS = [
  'I hereby declare that all information furnished by me in this form is true, complete, and correct to the best of my knowledge and belief. I understand that any false statement or concealment of material facts at any stage shall render me liable to immediate disqualification and expulsion from the National Cadet Corps.',
  'I am medically fit to undergo NCC training activities, including physical drills, marching, camps, field exercises, and adventure programmes. I have no known physical disability, chronic illness, contagious disease, or condition that may adversely affect my active participation or endanger fellow cadets.',
  'I have read, understood, and undertake to fully abide by the National Cadet Corps Act 1948, NCC Rules and Regulations, NCC Act and Rules 1948 (as amended), and all standing orders, commands, and instructions issued by the Commanding Officer and the ANO from time to time.',
  'I voluntarily give my full consent to participate in NCC camps, institutional training activities, community service programmes, Republic Day/Independence Day parades, national integration events, and all other authorised activities as directed by the ANO/Commanding Officer during the period of my enrollment.',
  'I solemnly declare that I am not a member of any political organisation, communal group, proscribed organisation, or any other body whose activities are incompatible with the aims, objectives, and secular character of the National Cadet Corps.',
  'I declare that I have no criminal record, have never been convicted of any offence, am not involved in any pending criminal or civil legal proceedings, and have not been expelled, rusticated, or removed from any academic institution or organisation on grounds of misconduct, indiscipline, or moral turpitude.',
  'I give my full consent to the NCC unit to capture, publish, and use my photographs, videos, testimonials, and accounts of my participation in NCC activities in official publications, social media platforms, press releases, and broadcasts, as deemed appropriate by the Commanding Officer.',
  'I undertake to maintain the highest standards of military discipline, prescribed NCC uniform and dress code, punctuality, and personal conduct during all NCC activities. I shall report for mandatory parades, training sessions, and activities unless specifically exempted in writing by a competent authority.',
  'I clearly understand that the NCC enrollment is for a minimum prescribed period and I shall not withdraw from NCC training or discontinue participation without obtaining prior written permission from the ANO/Commanding Officer. Unauthorised absence may lead to appropriate disciplinary action.',
  'I solemnly affirm on oath that I shall serve the National Cadet Corps with utmost sincerity, integrity, and dedication; uphold the NCC Motto "Unity and Discipline"; strive to be a model citizen, responsible youth leader, and a future asset to the Nation as envisioned by the National Cadet Corps.',
]

const DOCUMENTS = [
  { key: 'docPhoto', label: '2 recent passport-size photographs (white background, in NCC uniform / formal attire)' },
  { key: 'docAadhaar', label: 'Aadhaar card — self-attested photocopy with original for verification' },
  { key: 'docCollegeId', label: 'College ID card — self-attested photocopy with original for verification' },
  { key: 'docMedical', label: 'Medical fitness certificate from a registered medical practitioner (on letterhead)' },
  { key: 'docParentConsent', label: 'Parent / Guardian consent letter in the prescribed format (mandatory for cadets below 18 years)' },
  { key: 'docNccRecords', label: 'Previous NCC records / Transfer certificate / Inter-unit NOC (if applicable)' },
  { key: 'docCaste', label: 'Caste / Category certificate — SC / ST / OBC (if applicable, for official records)' },
]

// ── Tiny helper to display filled value or blank underline in print ──
function Val({ v }) {
  return v
    ? <span style={{ fontWeight: 600 }}>{v}</span>
    : <span style={{ display: 'inline-block', width: '100%', borderBottom: '1px solid #666' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
}

export default function DeclarationForm() {
  const { userProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { register, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: userProfile?.name || '',
      regimentalNo: userProfile?.regimentalNo || '',
      fatherName: '', motherName: '',
      dob: '', gender: '', nationality: 'Indian', religion: '', aadhaarLast4: '',
      phone: userProfile?.phone || '', parentPhone: '', emergencyContact: '', emergencyRelation: '',
      bloodGroup: '', address: '', pinCode: '',
      height: '', weight: '', medicalCondition: 'NIL', allergies: 'NIL',
      department: '', year: '', admissionYear: '', rollNo: '',
      collegeIdNo: '', universityRegNo: '', collegeEmail: '', cgpa: '',
      wing: userProfile?.wing || '', prevNcc: 'No', prevUnit: '', prevRank: '', prevCert: '', prevCertYear: '',
      declare1: false, declare2: false, declare3: false, declare4: false, declare5: false,
      declare6: false, declare7: false, declare8: false, declare9: false, declare10: false,
      docPhoto: false, docAadhaar: false, docCollegeId: false, docMedical: false,
      docParentConsent: false, docNccRecords: false, docCaste: false,
    },
  })

  const v = watch()
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const formYear = `${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(2)}`

  return (
    <div className="min-h-screen pt-20">

      {/* ── Page Header (screen only) ── */}
      <section
        className="no-print relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 60%, #1d4ed8 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="section-subtitle-light">Official Document</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white uppercase tracking-wide mb-3">Cadet Declaration Form</h1>
          <div className="w-14 h-1 bg-saffron-500 rounded-full mx-auto mt-3 mb-4" />
          <p className="text-blue-200 font-body mt-3 text-sm max-w-xl mx-auto leading-relaxed">
            Fill in all fields and check all 10 declarations, then click Print to generate your official A4 form. Submit the signed printed copy with documents to the NCC office.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Instructions */}
        <div className="no-print flex items-start gap-4 border border-amber-200 bg-amber-50 rounded-xl p-4 mb-8">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 font-body text-sm leading-relaxed">
            Fill in <strong className="text-amber-800">block letters</strong>. After printing, sign in blue/black ink, obtain parent/guardian signature (mandatory if below 18), attach all required documents, and submit to the NCC office. All 10 declarations must be accepted before printing.
          </p>
        </div>

        {/* ════════════════════════════════════════
            INTERACTIVE SCREEN FORM (no-print)
            ════════════════════════════════════════ */}
        <div className="no-print">
          <form noValidate>

            {/* ── Section A: Personal Information ── */}
            <div className="card-army relative overflow-hidden mb-6">
              <div className="absolute left-0 top-0 w-1 h-full bg-navy-600" />
              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-base text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <User className="w-4 h-4 text-saffron-500" /> Section A — Personal Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label-field">Full Name (as in Aadhaar) <span className="text-red-500">*</span></label>
                    <input type="text" {...register('name', { required: 'Required' })} className={`input-field uppercase ${errors.name ? 'border-red-700' : ''}`} placeholder="FIRST MIDDLE LAST" />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Regimental No. (if already enrolled)</label>
                    <input type="text" {...register('regimentalNo')} className="input-field uppercase" placeholder="Leave blank if new applicant" />
                  </div>
                  <div>
                    <label className="label-field">Father's Name <span className="text-red-500">*</span></label>
                    <input type="text" {...register('fatherName', { required: 'Required' })} className={`input-field uppercase ${errors.fatherName ? 'border-red-700' : ''}`} placeholder="FATHER'S FULL NAME" />
                    {errors.fatherName && <p className="text-red-400 text-xs mt-1">{errors.fatherName.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Mother's Name <span className="text-red-500">*</span></label>
                    <input type="text" {...register('motherName', { required: 'Required' })} className={`input-field uppercase ${errors.motherName ? 'border-red-700' : ''}`} placeholder="MOTHER'S FULL NAME" />
                    {errors.motherName && <p className="text-red-400 text-xs mt-1">{errors.motherName.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Date of Birth <span className="text-red-500">*</span></label>
                    <input type="date" {...register('dob', { required: 'Required' })} className={`input-field [color-scheme:dark] ${errors.dob ? 'border-red-700' : ''}`} />
                    {errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Gender <span className="text-red-500">*</span></label>
                    <select {...register('gender', { required: 'Required' })} className={`select-field ${errors.gender ? 'border-red-700' : ''}`}>
                      <option value="">— Select —</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Nationality</label>
                    <input type="text" {...register('nationality')} className="input-field" placeholder="Indian" />
                  </div>
                  <div>
                    <label className="label-field">Religion</label>
                    <input type="text" {...register('religion')} className="input-field" placeholder="e.g. Hindu, Muslim, Christian..." />
                  </div>
                  <div>
                    <label className="label-field">Aadhaar No. (last 4 digits only)</label>
                    <input type="text" {...register('aadhaarLast4', { maxLength: 4, pattern: { value: /^\d{0,4}$/, message: '4 digits only' } })} className="input-field" maxLength={4} placeholder="XXXX" />
                  </div>
                  <div>
                    <label className="label-field">Blood Group <span className="text-red-500">*</span></label>
                    <select {...register('bloodGroup', { required: 'Required' })} className={`select-field ${errors.bloodGroup ? 'border-red-700' : ''}`}>
                      <option value="">— Select —</option>
                      {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {errors.bloodGroup && <p className="text-red-400 text-xs mt-1">{errors.bloodGroup.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Cadet Mobile No. <span className="text-red-500">*</span></label>
                    <input type="tel" {...register('phone', { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' } })} className={`input-field ${errors.phone ? 'border-red-700' : ''}`} placeholder="10-digit mobile number" />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Parent / Guardian Mobile <span className="text-red-500">*</span></label>
                    <input type="tel" {...register('parentPhone', { required: 'Required' })} className={`input-field ${errors.parentPhone ? 'border-red-700' : ''}`} placeholder="Parent's mobile number" />
                    {errors.parentPhone && <p className="text-red-400 text-xs mt-1">{errors.parentPhone.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Emergency Contact Name</label>
                    <input type="text" {...register('emergencyContact')} className="input-field" placeholder="Full name" />
                  </div>
                  <div>
                    <label className="label-field">Emergency Contact Relation</label>
                    <input type="text" {...register('emergencyRelation')} className="input-field" placeholder="e.g. Father, Sibling..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label-field">Permanent Address <span className="text-red-500">*</span></label>
                    <textarea rows={2} {...register('address', { required: 'Required' })} className={`input-field resize-none ${errors.address ? 'border-red-700' : ''}`} placeholder="House No., Street, Area, City, State — Pin Code" />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section B: Physical Details ── */}
            <div className="card-army relative overflow-hidden mb-6">
              <div className="absolute left-0 top-0 w-1 h-full bg-navy-600" />
              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-base text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-saffron-500" /> Section B — Physical Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label-field">Height (cm) <span className="text-red-500">*</span></label>
                    <input type="number" {...register('height', { required: 'Required', min: { value: 100, message: 'Enter valid height' } })} className={`input-field ${errors.height ? 'border-red-700' : ''}`} placeholder="e.g. 170" />
                    {errors.height && <p className="text-red-400 text-xs mt-1">{errors.height.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Weight (kg) <span className="text-red-500">*</span></label>
                    <input type="number" {...register('weight', { required: 'Required', min: { value: 30, message: 'Enter valid weight' } })} className={`input-field ${errors.weight ? 'border-red-700' : ''}`} placeholder="e.g. 65" />
                    {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Any Known Medical Condition</label>
                    <input type="text" {...register('medicalCondition')} className="input-field" placeholder="NIL if none" />
                  </div>
                  <div>
                    <label className="label-field">Known Allergies</label>
                    <input type="text" {...register('allergies')} className="input-field" placeholder="NIL if none" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section C: Academic Information ── */}
            <div className="card-army relative overflow-hidden mb-6">
              <div className="absolute left-0 top-0 w-1 h-full bg-navy-600" />
              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-base text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-saffron-500" /> Section C — Academic Information
                </h2>
                <div className="grid sm:grid-cols-3 gap-5">
                  <div>
                    <label className="label-field">Department / Branch <span className="text-red-500">*</span></label>
                    <select {...register('department', { required: 'Required' })} className={`select-field ${errors.department ? 'border-red-700' : ''}`}>
                      <option value="">— Select —</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Year of Study <span className="text-red-500">*</span></label>
                    <select {...register('year', { required: 'Required' })} className={`select-field ${errors.year ? 'border-red-700' : ''}`}>
                      <option value="">— Select —</option>
                      {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Admission Year <span className="text-red-500">*</span></label>
                    <input type="text" {...register('admissionYear', { required: 'Required' })} className={`input-field ${errors.admissionYear ? 'border-red-700' : ''}`} placeholder="e.g. 2023" />
                    {errors.admissionYear && <p className="text-red-400 text-xs mt-1">{errors.admissionYear.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">College Roll No. <span className="text-red-500">*</span></label>
                    <input type="text" {...register('rollNo', { required: 'Required' })} className={`input-field ${errors.rollNo ? 'border-red-700' : ''}`} placeholder="e.g. 22102035" />
                    {errors.rollNo && <p className="text-red-400 text-xs mt-1">{errors.rollNo.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">College ID No.</label>
                    <input type="text" {...register('collegeIdNo')} className="input-field" placeholder="As on ID card" />
                  </div>
                  <div>
                    <label className="label-field">University Reg. No.</label>
                    <input type="text" {...register('universityRegNo')} className="input-field" placeholder="Mumbai University No." />
                  </div>
                  <div>
                    <label className="label-field">College Email ID <span className="text-red-500">*</span></label>
                    <input type="email" {...register('collegeEmail', { required: 'Required' })} className={`input-field ${errors.collegeEmail ? 'border-red-700' : ''}`} placeholder="abc@tcetmumbai.in" />
                    {errors.collegeEmail && <p className="text-red-400 text-xs mt-1">{errors.collegeEmail.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">CGPA / Percentage (last sem)</label>
                    <input type="text" {...register('cgpa')} className="input-field" placeholder="e.g. 8.5 CGPA or 78%" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section D: NCC Details ── */}
            <div className="card-army relative overflow-hidden mb-6">
              <div className="absolute left-0 top-0 w-1 h-full bg-navy-600" />
              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-base text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Award className="w-4 h-4 text-saffron-500" /> Section D — NCC Details &amp; Wing Preference
                </h2>
                <div className="grid sm:grid-cols-3 gap-5">
                  <div>
                    <label className="label-field">Wing Preference <span className="text-red-500">*</span></label>
                    <select {...register('wing', { required: 'Required' })} className={`select-field ${errors.wing ? 'border-red-700' : ''}`}>
                      <option value="">— Select —</option>
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
                    <label className="label-field">Certificate Obtained (if any)</label>
                    <select {...register('prevCert')} className="select-field">
                      <option value="">— None —</option>
                      <option value="A">A Certificate</option>
                      <option value="B">B Certificate</option>
                      <option value="C">C Certificate</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Previous NCC Unit</label>
                    <input type="text" {...register('prevUnit')} className="input-field" placeholder="e.g. 2 Mah NCC Unit" />
                  </div>
                  <div>
                    <label className="label-field">Previous Rank Held</label>
                    <input type="text" {...register('prevRank')} className="input-field" placeholder="e.g. Lance Corporal" />
                  </div>
                  <div>
                    <label className="label-field">Certificate Year (if any)</label>
                    <input type="text" {...register('prevCertYear')} className="input-field" placeholder="e.g. 2022" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section E: Declarations ── */}
            <div className="card-army relative overflow-hidden mb-6">
              <div className="absolute left-0 top-0 w-1 h-full bg-navy-600" />
              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-base text-gray-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-saffron-500" /> Section E — Declarations
                </h2>
                <p className="text-gray-500 font-body text-xs mb-6">All 10 declarations must be accepted before you can print the form.</p>
                <div className="space-y-4">
                  {DECLARATIONS.map((text, i) => {
                    const key = `declare${i + 1}`
                    return (
                      <label key={key} className="flex items-start gap-3 cursor-pointer group border border-gray-200 hover:border-navy-200 p-3 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          {...register(key, { required: 'This declaration is required' })}
                          className="mt-0.5 accent-navy-700 w-4 h-4 flex-shrink-0"
                        />
              <span className="text-gray-600 font-body text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                          <span className="text-navy-600 font-heading text-xs mr-1.5">{String(i + 1).padStart(2, '0')}.</span>
                          {text} <span className="text-red-500">*</span>
                        </span>
                      </label>
                    )
                  })}
                  {Object.keys(errors).some((k) => k.startsWith('declare')) && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Please accept all declarations before printing.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Section F: Document Checklist ── */}
            <div className="card-army relative overflow-hidden mb-6">
              <div className="absolute left-0 top-0 w-1 h-full bg-navy-600" />
              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-base text-gray-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-saffron-500" /> Section F — Document Submission Checklist
                </h2>
                <p className="text-gray-500 font-body text-xs mb-5">Tick all documents you will be attaching with this form. Self-attested photocopies must be submitted with originals for verification.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {DOCUMENTS.map(({ key, label }) => (
                    <label key={key} className="flex items-start gap-3 cursor-pointer group border border-gray-200 hover:border-navy-200 p-3 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        {...register(key)}
                        className="mt-0.5 accent-navy-700 w-4 h-4 flex-shrink-0"
                      />
                      <span className="text-gray-600 font-body text-sm leading-snug group-hover:text-gray-700 transition-colors">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Section G: Signatures ── */}
            <div className="card-army relative overflow-hidden mb-8">
              <div className="absolute left-0 top-0 w-1 h-full bg-navy-600" />
              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-base text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-saffron-500" /> Section G — Signatures
                </h2>
                <p className="text-gray-500 font-body text-xs mb-6">Signatures are to be applied in ink on the printed form. The boxes below are for reference only.</p>
                <div className="grid sm:grid-cols-3 gap-8">
                  {[
                    { label: "Cadet's Signature", sub: 'Date: _______________' },
                    { label: 'Parent / Guardian Signature', sub: 'Mandatory for cadets below 18' },
                    { label: 'ANO / Enrollment Officer', sub: 'For office use only' },
                  ].map((sig) => (
                    <div key={sig.label} className="text-center">
                      <div className="h-16 border border-dashed border-gray-300 mb-2" />
                      <p className="text-gray-500 font-body text-xs uppercase tracking-wider">{sig.label}</p>
                      <p className="text-gray-400 font-body text-xs mt-0.5">{sig.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-6 text-gray-400 font-body text-xs">
                  <span>Date of Application: ___________________________</span>
                  <span>Place: TCET, Mumbai</span>
                </div>
              </div>
            </div>

            {/* Print button */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  // Save to Firestore
                  setSaving(true)
                  try {
                    const formData = watch()
                    await addDoc(collection(db, 'declarations'), {
                      ...formData,
                      status: 'pending',
                      submittedAt: serverTimestamp(),
                    })
                    setSaved(true)
                  } catch { /* non-blocking */ }
                  finally { setSaving(false) }
                  // Print
                  const prev = document.title
                  document.title = 'NCC TCET — Cadet Enrollment Declaration Form'
                  window.print()
                  setTimeout(() => { document.title = prev }, 500)
                }}
                className="btn-primary flex items-center gap-2 px-8"
              >
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </button>
              <p className="text-gray-500 font-body text-xs text-center max-w-md">
                In Chrome's print dialog, uncheck <strong className="text-gray-600">"Headers and footers"</strong> to remove the browser URL from the printed document.
              </p>
            </div>
          </form>

          {/* Submission note */}
          <div className="mt-8 card-army p-5 flex items-start gap-3">
            <Shield className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
            <div className="font-body text-sm text-gray-500 leading-relaxed">
              <span className="text-gray-900 font-medium">After printing:</span> Sign in blue/black ink, obtain parent/guardian signature, attach all checked documents, and submit to the NCC office (Room 102, TCET Main Building) during office hours (Mon–Fri, 10 AM – 4 PM). Retain a photocopy for your records.
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            PRINT-ONLY FORMAL A4 DOCUMENT
            (hidden on screen, shown on print)
            ════════════════════════════════════════ */}
        <div id="print-decl" style={{ display: 'none' }}>
          <div className="decl-page">

            {/* ── LETTERHEAD ── */}
            <div className="decl-letterhead">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <path d="M32 4L54 12V28C54 42 44 54 32 60C20 54 10 42 10 28V12L32 4Z" fill="#1a2214" stroke="#b8860b" strokeWidth="2" />
                <path d="M32 10L48 17V28C48 38 41 47 32 52C23 47 16 38 16 28V17L32 10Z" fill="#111808" stroke="#d4a017" strokeWidth="1.2" />
                <text x="32" y="28" fontFamily="Arial" fontSize="6" fontWeight="900" textAnchor="middle" fill="#d4a017" letterSpacing="0.3">NATIONAL</text>
                <text x="32" y="36" fontFamily="Arial" fontSize="6" fontWeight="900" textAnchor="middle" fill="#d4a017" letterSpacing="0.3">CADET</text>
                <text x="32" y="44" fontFamily="Arial" fontSize="6" fontWeight="900" textAnchor="middle" fill="#d4a017" letterSpacing="0.3">CORPS</text>
              </svg>
              <div className="decl-org-text">
                <span className="decl-org-main">National Cadet Corps</span>
                <span className="decl-org-sub">1 Maharashtra Naval Unit — Thakur College of Engineering &amp; Technology</span>
                <span className="decl-org-addr">Kandivali (East), Mumbai — 400 101 &nbsp;|&nbsp; Under Ministry of Defence, Government of India</span>
              </div>
              <div className="decl-photo-box">
                <span>Passport<br />Size<br />Photograph</span>
              </div>
            </div>

            {/* ── TITLE BAR ── */}
            <div className="decl-title-bar">
              Cadet Enrollment Declaration Form &nbsp;—&nbsp; Academic Year {formYear}
            </div>

            {/* ── FORM REF ROW ── */}
            <div className="decl-ref-row">
              <span>Form Ref No.: NCC/TCET/ENR/{formYear}/___________</span>
              <span>Date of Submission: ___________________________</span>
            </div>

            {/* ══ PART I — PERSONAL PARTICULARS ══ */}
            <div className="decl-sec-hdr">Part I — Personal Particulars</div>
            <table className="decl-table">
              <tbody>
                <tr>
                  <td className="decl-lbl" style={{ width: '22%' }}>Full Name</td>
                  <td className="decl-val" style={{ width: '28%' }}><Val v={v.name} /></td>
                  <td className="decl-lbl" style={{ width: '22%' }}>Regimental No.</td>
                  <td className="decl-val" style={{ width: '28%' }}><Val v={v.regimentalNo} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">Father's Name</td>
                  <td className="decl-val"><Val v={v.fatherName} /></td>
                  <td className="decl-lbl">Mother's Name</td>
                  <td className="decl-val"><Val v={v.motherName} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">Date of Birth</td>
                  <td className="decl-val"><Val v={v.dob} /></td>
                  <td className="decl-lbl">Gender</td>
                  <td className="decl-val"><Val v={v.gender} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">Nationality</td>
                  <td className="decl-val"><Val v={v.nationality || 'Indian'} /></td>
                  <td className="decl-lbl">Religion</td>
                  <td className="decl-val"><Val v={v.religion} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">Blood Group</td>
                  <td className="decl-val"><Val v={v.bloodGroup} /></td>
                  <td className="decl-lbl">Aadhaar (Last 4)</td>
                  <td className="decl-val"><Val v={v.aadhaarLast4 ? `XXXX-XXXX-${v.aadhaarLast4}` : ''} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">Cadet Mobile</td>
                  <td className="decl-val"><Val v={v.phone} /></td>
                  <td className="decl-lbl">Parent's Mobile</td>
                  <td className="decl-val"><Val v={v.parentPhone} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">Emergency Contact</td>
                  <td className="decl-val"><Val v={v.emergencyContact} /></td>
                  <td className="decl-lbl">Relation</td>
                  <td className="decl-val"><Val v={v.emergencyRelation} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">Permanent Address</td>
                  <td className="decl-val" colSpan={3} style={{ lineHeight: 1.4 }}><Val v={v.address} /></td>
                </tr>
              </tbody>
            </table>

            {/* ══ PART II — PHYSICAL DETAILS ══ */}
            <div className="decl-sec-hdr">Part II — Physical Details</div>
            <table className="decl-table">
              <tbody>
                <tr>
                  <td className="decl-lbl" style={{ width: '22%' }}>Height (cm)</td>
                  <td className="decl-val" style={{ width: '28%' }}><Val v={v.height} /></td>
                  <td className="decl-lbl" style={{ width: '22%' }}>Weight (kg)</td>
                  <td className="decl-val" style={{ width: '28%' }}><Val v={v.weight} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">Known Medical Condition</td>
                  <td className="decl-val"><Val v={v.medicalCondition} /></td>
                  <td className="decl-lbl">Known Allergies</td>
                  <td className="decl-val"><Val v={v.allergies} /></td>
                </tr>
              </tbody>
            </table>

            {/* ══ PART III — ACADEMIC PARTICULARS ══ */}
            <div className="decl-sec-hdr">Part III — Academic Particulars</div>
            <table className="decl-table">
              <tbody>
                <tr>
                  <td className="decl-lbl" style={{ width: '22%' }}>College</td>
                  <td className="decl-val" style={{ width: '28%' }}>TCET, Mumbai</td>
                  <td className="decl-lbl" style={{ width: '22%' }}>Department</td>
                  <td className="decl-val" style={{ width: '28%' }}><Val v={v.department} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">Year of Study</td>
                  <td className="decl-val"><Val v={v.year} /></td>
                  <td className="decl-lbl">Admission Year</td>
                  <td className="decl-val"><Val v={v.admissionYear} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">College Roll No.</td>
                  <td className="decl-val"><Val v={v.rollNo} /></td>
                  <td className="decl-lbl">College ID No.</td>
                  <td className="decl-val"><Val v={v.collegeIdNo} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">University Reg. No.</td>
                  <td className="decl-val"><Val v={v.universityRegNo} /></td>
                  <td className="decl-lbl">CGPA / Percentage</td>
                  <td className="decl-val"><Val v={v.cgpa} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">College Email</td>
                  <td className="decl-val" colSpan={3}><Val v={v.collegeEmail} /></td>
                </tr>
              </tbody>
            </table>

            {/* ══ PART IV — NCC PARTICULARS ══ */}
            <div className="decl-sec-hdr">Part IV — NCC Particulars &amp; Wing Preference</div>
            <table className="decl-table">
              <tbody>
                <tr>
                  <td className="decl-lbl" style={{ width: '22%' }}>Wing Preference</td>
                  <td className="decl-val" style={{ width: '28%' }}><Val v={v.wing ? `${v.wing} Wing` : ''} /></td>
                  <td className="decl-lbl" style={{ width: '22%' }}>Previous NCC</td>
                  <td className="decl-val" style={{ width: '28%' }}><Val v={v.prevNcc} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">Previous Unit</td>
                  <td className="decl-val"><Val v={v.prevUnit} /></td>
                  <td className="decl-lbl">Previous Rank</td>
                  <td className="decl-val"><Val v={v.prevRank} /></td>
                </tr>
                <tr>
                  <td className="decl-lbl">Certificate Obtained</td>
                  <td className="decl-val"><Val v={v.prevCert ? `${v.prevCert} Certificate` : 'None'} /></td>
                  <td className="decl-lbl">Certificate Year</td>
                  <td className="decl-val"><Val v={v.prevCertYear} /></td>
                </tr>
              </tbody>
            </table>

            {/* ══ PART V — DECLARATIONS ══ */}
            <div style={{ pageBreakBefore: 'always', breakBefore: 'page' }} />
            <div className="decl-sec-hdr">Part V — Declarations (Read Carefully and Sign)</div>
            <table className="decl-table" style={{ marginBottom: 6 }}>
              <thead>
                <tr>
                  <th style={{ width: '6%', border: '1px solid #555', padding: '4px 6px', background: '#111', color: '#fff', fontFamily: '"Times New Roman", serif', fontSize: '8pt', textAlign: 'center', fontWeight: 700, letterSpacing: '0.04em' }}>S.No.</th>
                  <th style={{ width: '8%', border: '1px solid #555', padding: '4px 6px', background: '#111', color: '#fff', fontFamily: '"Times New Roman", serif', fontSize: '8pt', textAlign: 'center', fontWeight: 700, letterSpacing: '0.04em' }}>Status</th>
                  <th style={{ border: '1px solid #555', padding: '4px 8px', background: '#111', color: '#fff', fontFamily: '"Times New Roman", serif', fontSize: '8pt', textAlign: 'left', fontWeight: 700, letterSpacing: '0.04em' }}>Declaration Statement</th>
                </tr>
              </thead>
              <tbody>
                {DECLARATIONS.map((text, i) => {
                  const accepted = v[`declare${i + 1}`]
                  return (
                    <tr key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid', background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                      <td style={{ border: '1px solid #bbb', padding: '5px 6px', textAlign: 'center', verticalAlign: 'top', fontFamily: '"Times New Roman", serif', fontSize: '9.5pt', fontWeight: 700, color: '#111', background: '#efefef' }}>
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td style={{ border: '1px solid #bbb', padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 6px',
                          fontSize: '7.5pt',
                          fontFamily: '"Times New Roman", serif',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          border: `1px solid ${accepted ? '#1a5c1a' : '#8b0000'}`,
                          color: accepted ? '#1a5c1a' : '#8b0000',
                          background: accepted ? '#eaf5ea' : '#fff5f5',
                          textTransform: 'uppercase',
                        }}>
                          {accepted ? '✓ Accepted' : '□ Pending'}
                        </span>
                      </td>
                      <td style={{ border: '1px solid #bbb', padding: '5px 8px', fontFamily: '"Times New Roman", serif', fontSize: '9pt', lineHeight: 1.55, color: '#111', textAlign: 'justify' }}>
                        {text}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* ══ PART VI — DOCUMENT CHECKLIST ══ */}
            <div className="decl-sec-hdr">Part VI — Documents Enclosed (Self-attested copies with originals for verification)</div>
            <table className="decl-table" style={{ marginBottom: 8 }}>
              <thead>
                <tr>
                  <th style={{ width: '5%', border: '1px solid #555', padding: '4px 6px', background: '#111', color: '#fff', fontFamily: '"Times New Roman", serif', fontSize: '8pt', textAlign: 'center', fontWeight: 700 }}>S.No.</th>
                  <th style={{ width: '8%', border: '1px solid #555', padding: '4px 6px', background: '#111', color: '#fff', fontFamily: '"Times New Roman", serif', fontSize: '8pt', textAlign: 'center', fontWeight: 700 }}>Enclosed</th>
                  <th style={{ border: '1px solid #555', padding: '4px 8px', background: '#111', color: '#fff', fontFamily: '"Times New Roman", serif', fontSize: '8pt', textAlign: 'left', fontWeight: 700 }}>Document Description</th>
                </tr>
              </thead>
              <tbody>
                {DOCUMENTS.map(({ key, label }, i) => {
                  const enclosed = v[key]
                  return (
                    <tr key={key} style={{ pageBreakInside: 'avoid', breakInside: 'avoid', background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                      <td style={{ border: '1px solid #bbb', padding: '5px 6px', textAlign: 'center', verticalAlign: 'middle', fontFamily: '"Times New Roman", serif', fontSize: '9pt', fontWeight: 700, color: '#111', background: '#efefef' }}>
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td style={{ border: '1px solid #bbb', padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 6px',
                          fontSize: '7.5pt',
                          fontFamily: '"Times New Roman", serif',
                          fontWeight: 700,
                          border: `1px solid ${enclosed ? '#1a5c1a' : '#999'}`,
                          color: enclosed ? '#1a5c1a' : '#777',
                          background: enclosed ? '#eaf5ea' : '#f5f5f5',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}>
                          {enclosed ? '✓ Yes' : '□ N/A'}
                        </span>
                      </td>
                      <td style={{ border: '1px solid #bbb', padding: '5px 8px', fontFamily: '"Times New Roman", serif', fontSize: '9pt', lineHeight: 1.5, color: '#111' }}>
                        {label}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* ══ PART VII — CERTIFICATION ══ */}
            <div style={{ pageBreakBefore: 'always', breakBefore: 'page' }} />
            <div className="decl-sec-hdr">Part VII — Certification</div>
            <div className="decl-cert-para">
              I, <strong>{v.name || '________________________________'}</strong>, bearing College Roll No.&nbsp;
              <strong>{v.rollNo || '__________'}</strong>, studying in{' '}
              <strong>{v.year || '__________'}</strong> of <strong>{v.department || '__________'}</strong> at
              Thakur College of Engineering &amp; Technology, Mumbai, do hereby solemnly affirm and certify that
              all information provided in this form is true, complete, and correct to the best of my knowledge
              and belief. I have read and understood all declarations above and accept them unconditionally.
              I understand that any misrepresentation of facts shall render my enrollment liable to immediate
              cancellation without notice.
            </div>

            {/* ══ PART VIII — SIGNATURES ══ */}
            <div className="decl-sec-hdr">Part VIII — Signatures &amp; Date</div>
            <div className="decl-sig-row">
              <div className="decl-sig-cell">
                <div className="decl-sig-line" />
                <p className="decl-sig-label">Cadet's Signature</p>
                <p className="decl-sig-sub">Name: {v.name || '___________________'}</p>
                <p className="decl-sig-sub">Date: _____________________</p>
              </div>
              <div className="decl-sig-cell">
                <div className="decl-sig-line" />
                <p className="decl-sig-label">Parent / Guardian Signature</p>
                <p className="decl-sig-sub">Name: ____________________</p>
                <p className="decl-sig-sub">Date: _____________________</p>
              </div>
              <div className="decl-sig-cell">
                <div className="decl-sig-line" />
                <p className="decl-sig-label">ANO / Enrollment Officer</p>
                <p className="decl-sig-sub">Rank &amp; Name: _______________</p>
                <p className="decl-sig-sub">Date: _____________________</p>
              </div>
            </div>

            {/* ══ OFFICE USE ONLY ══ */}
            <div className="decl-office-box">
              <div className="decl-office-hdr">For Office Use Only — Do Not Write Below This Line</div>
              <div className="decl-office-body">
                <div className="decl-office-fields">
                  <div className="decl-office-field">Enrollment No.: ___________________________</div>
                  <div className="decl-office-field">Date of Enrollment: _______________________</div>
                  <div className="decl-office-field" style={{ flex: '1 1 100%' }}>Commanding Officer's Approval: ______________________________________</div>
                </div>
                <div className="decl-office-stamp">
                  Seal /<br />Stamp<br />of Unit
                </div>
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="decl-footer">
              <p>This form is an official document of 1 Maharashtra Naval Unit, NCC TCET. Any tampering with this document is a punishable offence under the NCC Act 1948.</p>
              <p style={{ marginTop: 2 }}>NCC Office, Room 102, TCET Campus, Thakur Village, Kandivali (East), Mumbai — 400 101</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

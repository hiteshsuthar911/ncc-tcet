import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { FileText, Printer, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

export default function DeclarationForm() {
  const { userProfile } = useAuth()
  const printRef = useRef()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: {
      name: userProfile?.name || '',
      regimentalNo: userProfile?.regimentalNo || '',
      fatherName: '',
      motherName: '',
      dob: '',
      address: '',
      phone: '',
      parentPhone: '',
      bloodGroup: '',
      wing: userProfile?.wing || '',
      year: '',
      department: '',
      rollNo: '',
      declare1: false,
      declare2: false,
      declare3: false,
      declare4: false,
      declare5: false,
    },
  })

  const values = watch()

  function handlePrint() {
    window.print()
  }

  return (
    <div className="min-h-screen pt-20">

      {/* Header */}
      <section className="relative py-14 bg-military-darker overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-subtitle">Official Document</p>
          <h1 className="section-title text-4xl mb-2">Cadet Declaration Form</h1>
          <div className="divider-gold w-24 mt-3" />
          <p className="text-army-300 font-body mt-3 text-sm">
            Fill in all fields, check all declarations, and click Print to generate your form. Submit the printed copy to the NCC office.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Instructions */}
        <div className="flex items-start gap-4 border border-army-700 bg-army-900/50 p-4 mb-8">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-300/80 font-body text-sm leading-relaxed">
            This form is to be filled in <strong className="text-yellow-200">block letters</strong>. After printing, attach the required documents and submit to the ANO. All declarations must be checked before printing.
          </p>
        </div>

        {/* ── Printable Form ── */}
        <div id="print-receipt" ref={printRef}>

          {/* Official header that only shows in print */}
          <div className="hidden print:block text-center mb-6 pb-4 border-b-2 border-gray-800">
            <p className="text-lg font-bold tracking-widest uppercase">NCC TCET — 1 Maharashtra Naval Unit</p>
            <p className="text-sm uppercase tracking-wide">Thakur College of Engineering & Technology, Mumbai</p>
            <p className="text-base font-bold mt-2 uppercase tracking-widest">Cadet Enrollment Declaration Form</p>
          </div>

          <form noValidate>
            <div className="card-army relative overflow-hidden mb-6">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
              <div className="absolute left-0 top-0 w-1 h-full bg-gold-500" />

              {/* Section: Personal Details */}
              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-base text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="h-px w-4 bg-gold-500 inline-block" /> Section A — Personal Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">

                  <div>
                    <label className="label-field">Full Name (as in Aadhaar) <span className="text-gold-500">*</span></label>
                    <input
                      type="text"
                      {...register('name', { required: 'Required' })}
                      className={`input-field uppercase ${errors.name ? 'border-red-700' : ''}`}
                      placeholder="FIRST MIDDLE LAST"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="label-field">Regimental No. (if already enrolled)</label>
                    <input type="text" {...register('regimentalNo')} className="input-field uppercase" placeholder="Leave blank if new applicant" />
                  </div>

                  <div>
                    <label className="label-field">Father's Name <span className="text-gold-500">*</span></label>
                    <input type="text" {...register('fatherName', { required: 'Required' })} className={`input-field uppercase ${errors.fatherName ? 'border-red-700' : ''}`} placeholder="FATHER'S FULL NAME" />
                    {errors.fatherName && <p className="text-red-400 text-xs mt-1">{errors.fatherName.message}</p>}
                  </div>

                  <div>
                    <label className="label-field">Mother's Name <span className="text-gold-500">*</span></label>
                    <input type="text" {...register('motherName', { required: 'Required' })} className={`input-field uppercase ${errors.motherName ? 'border-red-700' : ''}`} placeholder="MOTHER'S FULL NAME" />
                    {errors.motherName && <p className="text-red-400 text-xs mt-1">{errors.motherName.message}</p>}
                  </div>

                  <div>
                    <label className="label-field">Date of Birth <span className="text-gold-500">*</span></label>
                    <input type="date" {...register('dob', { required: 'Required' })} className={`input-field [color-scheme:dark] ${errors.dob ? 'border-red-700' : ''}`} />
                    {errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob.message}</p>}
                  </div>

                  <div>
                    <label className="label-field">Blood Group <span className="text-gold-500">*</span></label>
                    <select {...register('bloodGroup', { required: 'Required' })} className={`select-field ${errors.bloodGroup ? 'border-red-700' : ''}`}>
                      <option value="">— Select —</option>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    {errors.bloodGroup && <p className="text-red-400 text-xs mt-1">{errors.bloodGroup.message}</p>}
                  </div>

                  <div>
                    <label className="label-field">Mobile Number <span className="text-gold-500">*</span></label>
                    <input type="tel" {...register('phone', { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit mobile number' } })} className={`input-field ${errors.phone ? 'border-red-700' : ''}`} placeholder="10-digit mobile number" />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="label-field">Parent / Guardian Mobile <span className="text-gold-500">*</span></label>
                    <input type="tel" {...register('parentPhone', { required: 'Required' })} className={`input-field ${errors.parentPhone ? 'border-red-700' : ''}`} placeholder="Parent's number" />
                    {errors.parentPhone && <p className="text-red-400 text-xs mt-1">{errors.parentPhone.message}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="label-field">Permanent Address <span className="text-gold-500">*</span></label>
                    <textarea rows={2} {...register('address', { required: 'Required' })} className={`input-field resize-none ${errors.address ? 'border-red-700' : ''}`} placeholder="Full address with pin code" />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section B — Academic Details */}
            <div className="card-army relative overflow-hidden mb-6">
              <div className="absolute left-0 top-0 w-1 h-full bg-gold-500" />
              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-base text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="h-px w-4 bg-gold-500 inline-block" /> Section B — Academic Information
                </h2>
                <div className="grid sm:grid-cols-3 gap-5">
                  <div>
                    <label className="label-field">Department / Branch <span className="text-gold-500">*</span></label>
                    <select {...register('department', { required: 'Required' })} className={`select-field ${errors.department ? 'border-red-700' : ''}`}>
                      <option value="">— Select —</option>
                      {['Computer Engineering', 'Information Technology', 'Electronics & TC', 'Mechanical', 'Civil', 'AI & Data Science', 'AIDS', 'Other'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Year of Study <span className="text-gold-500">*</span></label>
                    <select {...register('year', { required: 'Required' })} className={`select-field ${errors.year ? 'border-red-700' : ''}`}>
                      <option value="">— Select —</option>
                      {['First Year (FE)', 'Second Year (SE)', 'Third Year (TE)', 'Final Year (BE)'].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">College Roll No. <span className="text-gold-500">*</span></label>
                    <input type="text" {...register('rollNo', { required: 'Required' })} className={`input-field ${errors.rollNo ? 'border-red-700' : ''}`} placeholder="e.g. 22102035" />
                    {errors.rollNo && <p className="text-red-400 text-xs mt-1">{errors.rollNo.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">NCC Wing Preference <span className="text-gold-500">*</span></label>
                    <select {...register('wing', { required: 'Required' })} className={`select-field ${errors.wing ? 'border-red-700' : ''}`}>
                      <option value="">— Select —</option>
                      <option value="Naval">Naval Wing</option>
                      <option value="Army">Army Wing</option>
                      <option value="Air">Air Wing</option>
                    </select>
                    {errors.wing && <p className="text-red-400 text-xs mt-1">{errors.wing.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section C — Declarations */}
            <div className="card-army relative overflow-hidden mb-6">
              <div className="absolute left-0 top-0 w-1 h-full bg-gold-500" />
              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-base text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="h-px w-4 bg-gold-500 inline-block" /> Section C — Declarations
                </h2>
                <div className="space-y-4">
                  {[
                    { key: 'declare1', text: 'I hereby declare that all the information furnished by me in this form is true, complete, and correct to the best of my knowledge.' },
                    { key: 'declare2', text: 'I am medically fit and have no known physical disability, chronic illness, or condition that may hinder NCC training activities.' },
                    { key: 'declare3', text: 'I have read and understood the NCC Rules & Regulations and agree to abide by them throughout my period of enrollment.' },
                    { key: 'declare4', text: 'I give my consent to participate in NCC camps, training activities, and community service programmes as directed by the ANO/Commanding Officer.' },
                    { key: 'declare5', text: 'I understand that providing false information or concealing facts, if discovered at any time, will lead to immediate termination of my NCC enrollment.' },
                  ].map(({ key, text }) => (
                    <label key={key} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        {...register(key, { required: 'This declaration is required' })}
                        className="mt-0.5 accent-gold-500 w-4 h-4 flex-shrink-0"
                      />
                      <span className="text-army-300 font-body text-sm leading-relaxed group-hover:text-white transition-colors">
                        {text} <span className="text-gold-500">*</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Signature section */}
            <div className="card-army relative overflow-hidden mb-8">
              <div className="absolute left-0 top-0 w-1 h-full bg-gold-500" />
              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-base text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="h-px w-4 bg-gold-500 inline-block" /> Section D — Signatures
                </h2>
                <div className="grid sm:grid-cols-3 gap-8">
                  {[
                    { label: "Cadet's Signature", sub: 'With date' },
                    { label: "Parent / Guardian Signature", sub: 'Consent for minor cadets' },
                    { label: 'ANO / Enrollment Officer', sub: 'For office use only' },
                  ].map((sig) => (
                    <div key={sig.label} className="text-center">
                      <div className="h-16 border-b border-dashed border-army-600 mb-2" />
                      <p className="text-army-400 font-body text-xs uppercase tracking-wider">{sig.label}</p>
                      <p className="text-army-600 font-body text-xs">{sig.sub}</p>
                    </div>
                  ))}
                </div>
                <p className="text-army-600 font-body text-xs mt-6 border-t border-army-800 pt-4">
                  Date of Application: _____________________________ &nbsp;|&nbsp; Place: TCET, Mumbai
                </p>
              </div>
            </div>

            {/* Print Button */}
            <div className="no-print flex gap-4 justify-center">
              <button
                type="button"
                onClick={handlePrint}
                className="btn-primary flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Declaration Form
              </button>
            </div>
          </form>
        </div>

        {/* Note below */}
        <div className="no-print mt-8 card-army p-5 flex items-start gap-3">
          <Shield className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
          <div className="font-body text-sm text-army-400 leading-relaxed">
            <span className="text-white font-medium">After printing:</span> Sign the form in ink, get parent/guardian signature, attach all required documents, and submit to the NCC office (Room 102, TCET Main Building) during office hours (Mon–Fri, 10 AM – 4 PM).
          </div>
        </div>
      </div>
    </div>
  )
}

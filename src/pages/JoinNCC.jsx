import { Link } from 'react-router-dom'
import {
  Shield, CheckCircle, ChevronRight, BookOpen,
  Users, Award, Star, AlertTriangle, FileText, Clock
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

export default function JoinNCC() {
  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="relative py-20 bg-military-darker overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-army-800 border-2 border-gold-500 mb-6">
            <Shield className="w-10 h-10 text-gold-400" />
          </div>
          <p className="section-subtitle">Enroll Now</p>
          <h1 className="section-title text-4xl md:text-6xl mb-4">Join NCC TCET</h1>
          <div className="divider-gold w-24 mx-auto mt-3 mb-6" />
          <p className="text-army-300 font-body text-lg max-w-2xl mx-auto leading-relaxed">
            Be part of India's premier youth development organisation. Train with discipline, serve the nation, and build a career.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#how-to-join"
              className="btn-primary inline-flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4" /> How to Join
            </a>
            <Link to="/events" className="btn-secondary inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Register for Event
            </Link>
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

      {/* CTA */}
      <section className="py-14 bg-military-darker border-t border-army-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Shield className="w-12 h-12 text-gold-500 mx-auto mb-4" />
          <h2 className="font-heading text-2xl text-white uppercase tracking-widest mb-3">
            Ready to Serve the Nation?
          </h2>
          <p className="text-army-300 font-body mb-6">
            Download the declaration form, fill it, and submit it at the NCC office to begin your enrollment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/declaration" className="btn-primary inline-flex items-center gap-2">
              <FileText className="w-4 h-4" /> Download Declaration Form
            </Link>
            <Link to="/rules" className="btn-secondary inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Read NCC Rules
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

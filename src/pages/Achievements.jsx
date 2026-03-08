import { Trophy, Star, Users, Medal, Camera, ChevronRight, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Years Active', value: '15+' },
  { label: 'Cadets Trained', value: '1200+' },
  { label: 'Camps Attended', value: '80+' },
  { label: 'Awards Won', value: '45+' },
]

const achievements = [
  {
    year: '2024',
    title: 'Best NCC Unit – Maharashtra Directorate',
    desc: 'TCET NCC Unit was awarded the Best Unit trophy at the Maharashtra & Goa Directorate Annual Review for outstanding performance in all categories.',
    icon: Trophy,
    color: 'text-gold-500',
    bg: 'bg-gold-900/20 border-gold-800',
  },
  {
    year: '2024',
    title: 'Republic Day Camp – 3 Cadets Selected',
    desc: 'Three TCET cadets represented Maharashtra at the prestigious Republic Day Camp, New Delhi, and participated in the march-past at Kartavya Path.',
    icon: Star,
    color: 'text-army-400',
    bg: 'bg-army-900 border-army-700',
  },
  {
    year: '2023',
    title: 'Thal Sainik Camp – 1st Rank (Obstacle Course)',
    desc: 'Cadet Rajan Mehta won the first position in the obstacle course at the national-level Thal Sainik Camp, beating 28 state teams.',
    icon: Medal,
    color: 'text-amber-500',
    bg: 'bg-army-900 border-army-700',
  },
  {
    year: '2023',
    title: 'Best Drilled Cadet – State Level',
    desc: 'Cadet Priya Sharma was awarded "Best Drilled Cadet" at the CATC held in Pune, judged on precision drill, uniform, and bearing.',
    icon: Star,
    color: 'text-army-400',
    bg: 'bg-army-900 border-army-700',
  },
  {
    year: '2022',
    title: 'Youth Exchange Programme – Germany',
    desc: 'Two TCET cadets were selected for the NCC Youth Exchange Programme (YEP) to Germany, representing India in cultural and adventure activities.',
    icon: Globe,
    color: 'text-blue-400',
    bg: 'bg-army-900 border-army-700',
  },
  {
    year: '2022',
    title: 'National Integration Camp – Delhi',
    desc: 'A contingent of 8 cadets attended the NIC in New Delhi, fostering bonds with cadets from Assam, Rajasthan, Tamil Nadu, and Punjab.',
    icon: Users,
    color: 'text-green-400',
    bg: 'bg-army-900 border-army-700',
  },
  {
    year: '2021',
    title: 'COVID Seva — Vaccination Drive Support',
    desc: "TCET NCC Cadets volunteered 2000+ man-hours supporting the Mumbai Municipal Corporation's COVID-19 vaccination and awareness drive.",
    icon: Star,
    color: 'text-red-400',
    bg: 'bg-army-900 border-army-700',
  },
  {
    year: '2020',
    title: "Prime Minister's Rally – NCC Day Participant",
    desc: "Selected cadets participated in the national NCC Day PM's Rally, one of the most coveted events in the NCC calendar.",
    icon: Trophy,
    color: 'text-gold-500',
    bg: 'bg-gold-900/20 border-gold-800',
  },
]

const galleryPlaceholders = [
  { label: 'Republic Day Rehearsal 2024', tag: 'Parade' },
  { label: 'Annual Training Camp 2023', tag: 'Camp' },
  { label: 'Rock Climbing — Malshej Ghat', tag: 'Adventure' },
  { label: 'Blood Donation Drive 2023', tag: 'Social Service' },
  { label: 'Firing Practice (.22 Rifle)', tag: 'Training' },
  { label: 'Best Cadet Award Ceremony', tag: 'Achievement' },
  { label: 'Naval Cruise — Mumbai Harbour', tag: 'Naval Wing' },
  { label: 'Passing Out Parade 2022', tag: 'Parade' },
  { label: 'Trekking — Sahyadri Range', tag: 'Adventure' },
]

const notableAlumni = [
  { name: 'Lt. Col. Aarav Singh (Retd.)', batch: '2005', achievement: 'NDA topper, C Cert Gold Medalist' },
  { name: 'Sub-Lt. Meera Nair, Indian Navy', batch: '2011', achievement: 'YEP Germany participant, Best Cadet 2011' },
  { name: 'Capt. Rahul Joshi', batch: '2014', achievement: 'RDC 2013, TSC 1st rank' },
]

export default function Achievements() {
  return (
    <div className="min-h-screen pt-20">

      {/* Header */}
      <section className="relative py-16 bg-military-darker overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-subtitle">Pride & Legacy</p>
          <h1 className="section-title text-4xl md:text-5xl mb-2">Achievements & Gallery</h1>
          <div className="divider-gold w-24 mt-3 mb-4" />
          <p className="text-army-300 font-body max-w-2xl leading-relaxed">
            TCET NCC Unit has earned recognition at unit, state, and national levels. Our cadets carry the torch of excellence in every field they step onto.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-military-dark border-b border-army-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-army-800">
            {stats.map((s) => (
              <div key={s.label} className="bg-military-dark p-6 text-center">
                <p className="font-heading text-4xl text-gold-500 tracking-widest">{s.value}</p>
                <p className="font-body text-xs text-army-400 mt-1 uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Timeline */}
      <section className="py-16 bg-military-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Track Record</p>
            <h2 className="section-title text-3xl">Notable Achievements</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>
          <div className="relative space-y-4">
            <div className="absolute left-12 top-0 bottom-0 w-px bg-army-800 hidden sm:block" />
            {achievements.map((a, i) => {
              const Icon = a.icon
              return (
                <div key={i} className={`card-army border ${a.bg} p-5 sm:ml-20 relative`}>
                  <div className="hidden sm:flex absolute -left-[3.25rem] top-5 w-6 h-6 rounded-full items-center justify-center bg-military-darker border border-army-700">
                    <div className="w-2 h-2 rounded-full bg-gold-500" />
                  </div>
                  <div className="flex items-start gap-4">
                    <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${a.color}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading text-xs text-gold-600 tracking-widest">{a.year}</span>
                      </div>
                      <h3 className="font-heading text-sm text-white uppercase tracking-wide">{a.title}</h3>
                      <p className="text-army-400 font-body text-sm leading-relaxed mt-1">{a.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-military-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Moments</p>
            <h2 className="section-title text-3xl">Photo Gallery</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {galleryPlaceholders.map((g, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] bg-army-900 border border-army-800 flex items-end p-3 group overflow-hidden cursor-pointer hover:border-gold-700 transition-colors"
              >
                {/* Placeholder gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-army-800 to-military-darker" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-army-700 group-hover:text-army-600 transition-colors" />
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-military-darker to-transparent h-16 translate-y-full group-hover:translate-y-0 transition-transform" />
                <div className="relative z-10">
                  <span className="font-heading text-xs text-gold-600 block">{g.tag}</span>
                  <span className="font-body text-xs text-army-300">{g.label}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-army-600 font-body text-xs mt-6">
            Official gallery photos are periodically updated. Contact the unit for high-resolution images.
          </p>
        </div>
      </section>

      {/* Notable Alumni */}
      <section className="py-16 bg-military-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-subtitle">Exemplary Cadets</p>
            <h2 className="section-title text-3xl">Notable Alumni</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {notableAlumni.map((a, i) => (
              <div key={i} className="card-army p-5 text-center border-b-2 border-gold-700">
                <div className="w-12 h-12 rounded-full bg-army-800 border border-army-700 flex items-center justify-center mx-auto mb-3">
                  <Medal className="w-5 h-5 text-gold-500" />
                </div>
                <h3 className="font-heading text-sm text-white tracking-wide mb-0.5">{a.name}</h3>
                <p className="text-gold-600 font-body text-xs mb-2">Batch of {a.batch}</p>
                <p className="text-army-400 font-body text-xs leading-relaxed">{a.achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-military-darker border-t border-army-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-xl text-white uppercase tracking-widest mb-3">Write Your Own Legacy</h2>
          <p className="text-army-300 font-body text-sm mb-6">Join the ranks of cadets who went beyond the classroom and made their mark on history.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join" className="btn-primary inline-flex items-center gap-2">
              <Star className="w-4 h-4" /> Join NCC TCET
            </Link>
            <Link to="/training" className="btn-secondary inline-flex items-center gap-2">
              <ChevronRight className="w-4 h-4" /> View Training
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

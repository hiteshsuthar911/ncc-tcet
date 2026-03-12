import { Trophy, Star, Users, Medal, Camera, ArrowRight, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Years Active', value: '15+', color: 'bg-navy-50 text-navy-700' },
  { label: 'Cadets Trained', value: '1200+', color: 'bg-saffron-50 text-saffron-700' },
  { label: 'Camps Attended', value: '80+', color: 'bg-green-50 text-green-700' },
  { label: 'Awards Won', value: '45+', color: 'bg-purple-50 text-purple-700' },
]

const achievements = [
  { year: '2024', title: 'Best NCC Unit – Maharashtra Directorate', desc: 'TCET NCC Unit was awarded the Best Unit trophy at the Maharashtra & Goa Directorate Annual Review for outstanding performance in all categories.', icon: Trophy, accent: 'border-l-saffron-500' },
  { year: '2024', title: 'Republic Day Camp – 3 Cadets Selected', desc: 'Three TCET cadets represented Maharashtra at the prestigious Republic Day Camp, New Delhi, and participated in the march-past at Kartavya Path.', icon: Star, accent: 'border-l-navy-500' },
  { year: '2023', title: 'Thal Sainik Camp – 1st Rank (Obstacle Course)', desc: 'Cadet Rajan Mehta won the first position in the obstacle course at the national-level Thal Sainik Camp, beating 28 state teams.', icon: Medal, accent: 'border-l-amber-500' },
  { year: '2023', title: 'Best Drilled Cadet – State Level', desc: 'Cadet Priya Sharma was awarded "Best Drilled Cadet" at the CATC held in Pune, judged on precision drill, uniform, and bearing.', icon: Star, accent: 'border-l-navy-500' },
  { year: '2022', title: 'Youth Exchange Programme – Germany', desc: 'Two TCET cadets were selected for the NCC Youth Exchange Programme (YEP) to Germany, representing India in cultural and adventure activities.', icon: Globe, accent: 'border-l-blue-500' },
  { year: '2022', title: 'National Integration Camp – Delhi', desc: 'A contingent of 8 cadets attended the NIC in New Delhi, fostering bonds with cadets from Assam, Rajasthan, Tamil Nadu, and Punjab.', icon: Users, accent: 'border-l-green-500' },
  { year: '2021', title: 'COVID Seva — Vaccination Drive Support', desc: "TCET NCC Cadets volunteered 2000+ man-hours supporting the Mumbai Municipal Corporation's COVID-19 vaccination and awareness drive.", icon: Star, accent: 'border-l-red-500' },
  { year: '2020', title: "Prime Minister's Rally – NCC Day Participant", desc: "Selected cadets participated in the national NCC Day PM's Rally, one of the most coveted events in the NCC calendar.", icon: Trophy, accent: 'border-l-saffron-500' },
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
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 60%, #1d4ed8 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-subtitle-light">Pride &amp; Legacy</p>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-3">Achievements &amp; Gallery</h1>
          <div className="w-12 h-1 bg-saffron-400 rounded-full mb-5" />
          <p className="text-white/80 font-body max-w-2xl leading-relaxed">
            TCET NCC Unit has earned recognition at unit, state, and national levels. Our cadets carry the torch of excellence in every field they step onto.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {stats.map((s) => (
              <div key={s.label} className="stat-card p-6 text-center">
                <p className={`font-heading font-extrabold text-4xl ${s.color.split(' ')[1]} tracking-tight`}>{s.value}</p>
                <p className="font-body text-xs text-gray-500 mt-1 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Track Record</p>
            <h2 className="section-title text-3xl">Notable Achievements</h2>
            <div className="divider-gold mx-auto mt-3" />
          </div>
          <div className="space-y-4">
            {achievements.map((a, i) => {
              const Icon = a.icon
              return (
                <div key={i} className={`card-army p-5 border-l-4 ${a.accent} hover:-translate-y-0.5`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-saffron-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge-pill">{a.year}</span>
                      </div>
                      <h3 className="font-heading font-bold text-gray-900 text-base mb-1">{a.title}</h3>
                      <p className="text-gray-500 font-body text-sm leading-relaxed">{a.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <p className="section-subtitle">Moments</p>
              <h2 className="section-title text-3xl">Photo Gallery</h2>
              <div className="divider-gold mt-3" />
            </div>
            <Link to="/gallery" className="btn-ghost text-sm self-start sm:self-auto">
              Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {galleryPlaceholders.map((g, i) => (
              <div key={i} className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden group cursor-pointer border border-gray-100 hover:border-navy-300 hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-gray-300 group-hover:text-gray-400 transition-colors" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="badge-pill text-[10px] mb-1 inline-flex">{g.tag}</span>
                  <p className="text-white font-body text-xs leading-tight">{g.label}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 font-body text-xs mt-6">
            Official gallery photos are periodically updated. Contact the unit for high-resolution images.
          </p>
        </div>
      </section>

      {/* Notable Alumni */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-subtitle">Exemplary Cadets</p>
            <h2 className="section-title text-3xl">Notable Alumni</h2>
            <div className="divider-gold mx-auto mt-3" />
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {notableAlumni.map((a, i) => (
              <div key={i} className="card-army p-6 text-center hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-saffron-50 flex items-center justify-center mx-auto mb-4">
                  <Medal className="w-7 h-7 text-saffron-500" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 text-sm mb-1">{a.name}</h3>
                <p className="badge-pill mb-3">Batch of {a.batch}</p>
                <p className="text-gray-500 font-body text-xs leading-relaxed">{a.achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading font-extrabold text-2xl text-white mb-3">Write Your Own Legacy</h2>
          <p className="text-white/70 font-body text-sm mb-7">Join the ranks of cadets who went beyond the classroom and made their mark on history.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join" className="inline-flex items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-heading font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-0.5">
              <Star className="w-4 h-4" /> Join NCC TCET
            </Link>
            <Link to="/training" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-heading font-semibold px-7 py-3.5 rounded-xl transition-all duration-300">
              View Training <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

import { Shield, Star, Target, Users, Award, ChevronRight, CheckCircle } from 'lucide-react'

const TIMELINE = [
  { year: '2008', title: 'Unit Established', desc: 'NCC unit founded at TCET with an initial strength of 30 cadets.' },
  { year: '2011', title: 'First Republic Day Camp', desc: 'Cadets participate in the prestigious Republic Day Camp, New Delhi.' },
  { year: '2014', title: 'Best Unit Award', desc: 'Awarded Best NCC Unit in Mumbai district for academic year 2013-14.' },
  { year: '2017', title: 'Thal Sainik Camp', desc: 'Cadet achieves All India rank in Thal Sainik Camp shooting competition.' },
  { year: '2020', title: 'Digital Training', desc: 'Adapted to virtual training and online camps during challenging times.' },
  { year: '2024', title: 'Silver Jubilee Strength', desc: 'Unit strength crosses 120 cadets with a fully equipped training facility.' },
]

const ACTIVITIES = [
  'Annual Training Camps (ATC)',
  'National Integration Camps (NIC)',
  'Republic Day Camp (RDC)',
  'Thal Sainik Camp (TSC)',
  'Army Attachment Camps',
  'Adventure Activities & Trekking',
  'Disaster Management Training',
  'Social Service & NSS Integration',
  'Shooting & Obstacle Course',
  'Community Development Programs',
]

const OFFICERS = [
  { rank: 'Lt Col', name: 'Associate NCC Officer', role: 'Commanding Officer', img: null },
  { rank: 'Capt', name: 'ANO', role: 'Associate NCC Officer', img: null },
  { rank: 'SUO', name: 'Senior Under Officer', role: 'Senior Under Officer', img: null },
  { rank: 'JUO', name: 'Junior Under Officer', role: 'Junior Under Officer', img: null },
]

export default function About() {
  return (
    <div className="min-h-screen pt-20">
      {/* ── HERO ── */}
      <section className="relative py-24 bg-army-900 overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-subtitle text-gold-400">Who We Are</p>
            <h1 className="section-title text-4xl md:text-6xl mb-4 text-white">
              About NCC TCET
            </h1>
            <div className="divider-gold w-24 mb-6" />
            <p className="text-gray-300 font-body text-lg leading-relaxed">
              The NCC Unit of Thakur College of Engineering &amp; Technology — a premier cadet corps committed to creating disciplined, patriotic, and well-rounded leaders.
            </p>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute bottom-0 right-10 w-32 h-32 border border-gold-500/20" />
        <div className="absolute top-10 right-32 w-16 h-16 border border-gold-500/10" />
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-army p-8 relative">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold-500 to-transparent" />
              <Shield className="w-8 h-8 text-gold-500 mb-4" />
              <h3 className="font-heading text-2xl text-gray-900 uppercase tracking-widest mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 font-body leading-relaxed">
                To develop the qualities of character, courage, comradeship, discipline, leadership, secular outlook, spirit of adventure, and the ideal of selfless service among the youth of the country so that they can become useful citizens.
              </p>
            </div>
            <div className="card-army p-8 relative">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold-500 to-transparent" />
              <Star className="w-8 h-8 text-gold-500 mb-4" />
              <h3 className="font-heading text-2xl text-gray-900 uppercase tracking-widest mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 font-body leading-relaxed">
                To be recognized as the best NCC Unit in Maharashtra, producing cadets who exemplify the NCC motto — <em className="text-gold-600">"Unity and Discipline"</em> — and go on to serve the nation in military and civilian capacities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NCC MOTTO ── */}
      <section className="py-14 bg-army-900 border-y border-army-700">
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="font-heading text-xl md:text-2xl text-gray-300 tracking-[0.2em] uppercase mb-2">
            NCC Motto
          </p>
          <h2 className="font-heading text-4xl md:text-6xl text-gold-400 tracking-widest uppercase text-glow-gold mb-2">
            एकता और अनुशासन
          </h2>
          <p className="font-heading text-xl md:text-2xl text-gold-600 tracking-[0.4em] uppercase">
            Unity &amp; Discipline
          </p>
        </div>
      </section>

      {/* ── ACTIVITIES ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subtitle">What We Do</p>
              <h2 className="section-title text-3xl md:text-4xl mb-4">
                Training &amp; Activities
              </h2>
              <div className="divider-gold w-24 mb-6" />
              <p className="text-gray-600 font-body leading-relaxed mb-8">
                Our cadets undergo comprehensive training spanning military skills, adventure, leadership, and social responsibility. From local drills to national-level camps, every activity builds character and capability.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACTIVITIES.map((activity) => (
                  <div key={activity} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm font-body">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="card-army p-8 text-center">
                <Target className="w-16 h-16 text-gold-500 mx-auto mb-6" />
                <h3 className="font-heading text-2xl text-gray-900 uppercase tracking-widest mb-4">
                  NCC B &amp; C Certificate
                </h3>
                <p className="text-gray-600 font-body leading-relaxed mb-6">
                  Cadets work towards NCC B and C certificates, which provide numerous benefits in higher education admissions, government job applications, and direct military entry schemes.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'B Cert Holders', value: '60+' },
                    { label: 'C Cert Holders', value: '25+' },
                    { label: 'Military Entry', value: '8+' },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="font-heading text-2xl text-gold-600">{value}</p>
                      <p className="text-gray-500 text-xs font-body">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 border border-gold-500/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Our Journey</p>
            <h2 className="section-title text-3xl md:text-4xl">Unit History</h2>
            <div className="divider-gold w-24 mx-auto mt-4" />
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-px" />
            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex gap-6 md:gap-0 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-3 h-3 bg-gold-500 rounded-full -translate-x-1.5 md:-translate-x-1.5 border-2 border-white mt-1" />
                  {/* Content */}
                  <div className={`ml-14 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="card-army p-5">
                      <span className="badge-rank mb-2 inline-flex">{item.year}</span>
                      <h3 className="font-heading text-gray-900 uppercase tracking-wide text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm font-body">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Chain of Command</p>
            <h2 className="section-title text-3xl md:text-4xl">Leadership</h2>
            <div className="divider-gold w-24 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {OFFICERS.map(({ rank, name, role }) => (
              <div key={role} className="card-army p-6 text-center group transition-all duration-300">
                <div className="w-20 h-20 bg-army-50 border-2 border-army-200 group-hover:border-gold-500 transition-colors duration-300 flex items-center justify-center rounded-full mx-auto mb-4">
                  <Users className="w-8 h-8 text-army-500 group-hover:text-gold-500 transition-colors duration-300" />
                </div>
                <span className="badge-rank mb-2 inline-flex">{rank}</span>
                <h4 className="font-heading text-gray-900 text-sm uppercase tracking-wider mt-2">{name}</h4>
                <p className="text-gray-500 text-xs font-body mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-army-900 border-t border-army-700">
        <div className="max-w-3xl mx-auto text-center px-4">
          <Award className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h2 className="section-title text-3xl mb-4 text-white">Be Part of the Unit</h2>
          <p className="text-gray-300 font-body mb-8">
            Join us and be part of a legacy of discipline, service, and excellence.
          </p>
          <a href="/events" className="btn-primary inline-flex items-center gap-2">
            Register for Events <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  )
}

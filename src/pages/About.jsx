import { Shield, Star, Target, Users, Award, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

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
  { rank: 'Lt Col', name: 'Associate NCC Officer', role: 'Commanding Officer' },
  { rank: 'Capt', name: 'ANO', role: 'Associate NCC Officer' },
  { rank: 'SUO', name: 'Senior Under Officer', role: 'Senior Under Officer' },
  { rank: 'JUO', name: 'Junior Under Officer', role: 'Junior Under Officer' },
]

export default function About() {
  return (
    <div className="min-h-screen pt-20">

      {/* HERO */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 60%, #1d4ed8 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-saffron-400/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-3.5 h-3.5 text-saffron-400" />
              <span className="font-body text-xs text-white/80 tracking-[0.15em] uppercase">Who We Are</span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-white mb-4 leading-tight">About NCC TCET</h1>
            <div className="w-12 h-1 bg-saffron-400 rounded-full mb-6" />
            <p className="text-white/80 font-body text-lg leading-relaxed">
              The NCC Unit of Thakur College of Engineering &amp; Technology — a premier cadet corps committed to creating disciplined, patriotic, and well-rounded leaders.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Our Guiding Principles</p>
            <h2 className="section-title text-3xl md:text-4xl">Mission &amp; Vision</h2>
            <div className="divider-gold mx-auto mt-3" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-army p-8 relative overflow-hidden group hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy-600 to-navy-400 rounded-t-2xl" />
              <div className="w-14 h-14 bg-navy-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-navy-700" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 font-body leading-relaxed">
                To develop the qualities of character, courage, comradeship, discipline, leadership, secular outlook, spirit of adventure, and the ideal of selfless service among the youth of the country so that they can become useful citizens.
              </p>
            </div>
            <div className="card-army p-8 relative overflow-hidden group hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron-500 to-saffron-400 rounded-t-2xl" />
              <div className="w-14 h-14 bg-saffron-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-7 h-7 text-saffron-600" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 font-body leading-relaxed">
                To be recognized as the best NCC Unit in Maharashtra, producing cadets who exemplify the NCC motto —{' '}
                <em className="text-navy-700 font-medium not-italic">"Unity and Discipline"</em> — and serve the nation in military and civilian capacities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NCC MOTTO */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 100%)' }}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="font-body text-navy-300 text-xs uppercase tracking-[0.3em] mb-3">NCC Motto</p>
          <h2 className="font-heading font-extrabold text-4xl md:text-6xl text-saffron-400 tracking-wider mb-3">एकता और अनुशासन</h2>
          <p className="font-heading font-bold text-xl md:text-2xl text-white/80 tracking-[0.3em] uppercase">Unity &amp; Discipline</p>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="section-subtitle">What We Do</p>
              <h2 className="section-title text-3xl md:text-4xl mb-3">Training &amp; Activities</h2>
              <div className="divider-gold mb-6" />
              <p className="text-gray-600 font-body leading-relaxed mb-8 text-base">
                Our cadets undergo comprehensive training spanning military skills, adventure, leadership, and social responsibility. From local drills to national-level camps, every activity builds character and capability.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {ACTIVITIES.map((activity) => (
                  <div key={activity} className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm font-body">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-army p-8 text-center">
              <div className="w-20 h-20 bg-navy-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-navy-700" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-gray-900 mb-4">NCC B &amp; C Certificate</h3>
              <p className="text-gray-600 font-body leading-relaxed mb-8">
                Cadets work towards NCC B and C certificates, which provide numerous benefits in higher education admissions, government job applications, and direct military entry schemes.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[{ label: 'B Cert Holders', value: '60+' }, { label: 'C Cert Holders', value: '25+' }, { label: 'Military Entry', value: '8+' }].map(({ label, value }) => (
                  <div key={label} className="p-3 bg-navy-50 rounded-xl">
                    <p className="font-heading font-extrabold text-2xl text-navy-800">{value}</p>
                    <p className="text-gray-500 text-xs font-body mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Our Journey</p>
            <h2 className="section-title text-3xl md:text-4xl">Unit History</h2>
            <div className="divider-gold mx-auto mt-3" />
          </div>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-px" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-6 md:left-1/2 w-3 h-3 bg-saffron-500 rounded-full -translate-x-1.5 border-2 border-white mt-2 shadow-sm" />
                  <div className={`ml-14 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="card-army p-5">
                      <span className="badge-pill mb-2 inline-flex">{item.year}</span>
                      <h3 className="font-heading font-bold text-gray-900 text-base mb-1">{item.title}</h3>
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

      {/* LEADERSHIP */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Chain of Command</p>
            <h2 className="section-title text-3xl md:text-4xl">Leadership</h2>
            <div className="divider-gold mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {OFFICERS.map(({ rank, name, role }) => (
              <div key={role} className="card-army p-6 text-center group hover:-translate-y-1">
                <div className="w-16 h-16 bg-navy-50 border-2 border-navy-100 group-hover:border-saffron-400 transition-colors duration-300 flex items-center justify-center rounded-2xl mx-auto mb-4">
                  <Users className="w-8 h-8 text-navy-600 group-hover:text-saffron-600 transition-colors duration-300" />
                </div>
                <span className="badge-rank mb-2">{rank}</span>
                <h4 className="font-heading font-semibold text-gray-900 text-sm mt-2">{name}</h4>
                <p className="text-gray-500 text-xs font-body mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <div className="w-16 h-16 bg-saffron-500/10 border border-saffron-400/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Award className="w-8 h-8 text-saffron-400" />
          </div>
          <h2 className="font-heading font-extrabold text-3xl text-white mb-4">Be Part of the Unit</h2>
          <p className="text-white/75 font-body mb-8">Join us and be part of a legacy of discipline, service, and excellence.</p>
          <Link to="/events" className="inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-heading font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Register for Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

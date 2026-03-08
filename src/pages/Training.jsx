import { Shield, Calendar, MapPin, Clock, Award, ChevronRight, AlertTriangle, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const trainingTypes = [
  {
    title: 'Weekly Drills',
    schedule: 'Every Saturday, 6:00 AM – 9:00 AM',
    venue: 'TCET Ground, B-Block',
    desc: 'Foot drill, arms training, physical fitness exercises, and weapon handling under JCO supervision.',
    badge: 'Mandatory',
    badgeColor: 'text-red-400 border-red-700',
  },
  {
    title: 'Physical Training (PT)',
    schedule: 'Every Wednesday, 6:30 AM – 8:00 AM',
    venue: 'TCET Sports Complex',
    desc: '5 BFT (Basic Fitness Test) standards: running, push-ups, sit-ups, pull-ups, and obstacle course.',
    badge: 'Mandatory',
    badgeColor: 'text-red-400 border-red-700',
  },
  {
    title: 'Map Reading & Navigation',
    schedule: 'Monthly (1st Sunday)',
    venue: 'Classroom + Field',
    desc: 'Topographical map reading, compass navigation, and field craft exercises.',
    badge: 'Theory + Field',
    badgeColor: 'text-blue-400 border-blue-700',
  },
  {
    title: 'Firing Practice',
    schedule: 'Quarterly',
    venue: 'Firing Range, Worli (Army Premises)',
    desc: '.22 rifle shooting practice under certified range officer supervision. Merit-based selection for advance courses.',
    badge: 'Selected Cadets',
    badgeColor: 'text-yellow-400 border-yellow-700',
  },
  {
    title: 'Community Service',
    schedule: 'Monthly (as notified)',
    venue: 'Various locations, Mumbai',
    desc: 'Blood donation camps, beach cleaning, disaster awareness drives, and traffic management assistance.',
    badge: 'All Cadets',
    badgeColor: 'text-green-400 border-green-700',
  },
  {
    title: 'First Aid & Disaster Mgmt',
    schedule: 'Bi-monthly',
    venue: 'TCET Seminar Hall',
    desc: 'Basic life support (BLS), CPR, bandaging, and civil defence drills in coordination with Red Cross.',
    badge: 'Classroom',
    badgeColor: 'text-army-400 border-army-600',
  },
]

const camps = [
  {
    name: 'Annual Training Camp (ATC)',
    duration: '10 days',
    frequency: 'Once a year',
    level: 'Unit Level',
    desc: 'Core NCC camp covering all training subjects — drill, firing, map reading, obstacle course, cultural activities, and sports. Mandatory for B and C certificate examinations.',
    highlights: ['Weapons training', 'Night navigation', 'Cultural programme', 'Formal parade'],
  },
  {
    name: 'Combined Annual Training Camp (CATC)',
    duration: '10 days',
    frequency: 'Once a year',
    level: 'Group Level',
    desc: 'Cadets from multiple units train together. Promotes inter-unit competition and national integration.',
    highlights: ['Inter-unit competitions', 'Table tennis, volleyball', 'Best cadet award', 'Formal passing out parade'],
  },
  {
    name: 'Republic Day Camp (RDC)',
    duration: '30 days',
    frequency: 'Annual (Dec – Jan)',
    level: 'National Level',
    desc: 'Prestigious national camp at Parade Ground, New Delhi. Top cadets from each state compete for the honour to march on Rajpath on 26 January.',
    highlights: ['National NCC parade', 'PM Rally', 'Cultural night', 'Inter-directorate competitions'],
  },
  {
    name: 'Rock Climbing Camp',
    duration: '7 days',
    frequency: 'Annual',
    level: 'Zonal Level',
    desc: 'Held at designated adventure locations (Malshej Ghat / Bhandardara). Teaches basic and advanced rock climbing techniques.',
    highlights: ['Rock face climbing', 'Rappelling', 'Trekking', 'Night camping'],
  },
  {
    name: 'Naval Wing Cruise',
    duration: '5–7 days',
    frequency: 'Annual',
    level: 'Directorate Level',
    desc: 'Naval cadets get the opportunity to sail aboard INS (Indian Naval Ship) and experience life at sea.',
    highlights: ['Sea navigation', 'Deck duties', 'Ship operations tour', 'Naval ceremonies'],
  },
  {
    name: 'Thal Sainik Camp (TSC)',
    duration: '10 days',
    frequency: 'Biennial',
    level: 'National Level',
    desc: 'National level inter-directorate army competition camp. Cadets compete in drill, obstacle course, firing, and sports.',
    highlights: ['Army skills competition', 'Best drilled cadet', 'Athletic events', 'Valedictory parade'],
  },
]

const certificates = [
  {
    name: '"A" Certificate',
    year: '1st Year',
    subjects: ['Drill', 'PT', 'Map Reading', 'NCC Organization', 'Social Awareness'],
    passing: '45% aggregate, min. 75% attendance',
    color: 'border-army-600',
    badge: 'Junior Cadet',
  },
  {
    name: '"B" Certificate',
    year: '2nd Year',
    subjects: ['Advanced Drill', 'Firing (.22 Rifle)', 'Field Craft', 'Armed Forces', 'Disaster Mgmt'],
    passing: '50% aggregate, min. 75% attendance, A Cert preferred',
    color: 'border-gold-700',
    badge: 'Senior Cadet',
  },
  {
    name: '"C" Certificate',
    year: '3rd Year',
    subjects: ['Advanced Firing', 'Leadership', 'Environment', 'YEP / National Integration', 'Project Work'],
    passing: '60% aggregate, B Cert preferred, 1 camp compulsory',
    color: 'border-gold-400',
    badge: 'Elite — Defence Bonus',
  },
]

export default function Training() {
  return (
    <div className="min-h-screen pt-20">

      {/* Header */}
      <section className="relative py-16 bg-military-darker overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-subtitle">Develop. Excel. Lead.</p>
          <h1 className="section-title text-4xl md:text-5xl mb-2">Training & Camps</h1>
          <div className="divider-gold w-24 mt-3 mb-4" />
          <p className="text-army-300 font-body max-w-2xl leading-relaxed">
            NCC training transforms ordinary students into disciplined, capable, and service-oriented leaders. Explore the training calendar, camp opportunities, and certificate pathways.
          </p>
        </div>
      </section>

      {/* Weekly Training */}
      <section className="py-16 bg-military-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Regular Programme</p>
            <h2 className="section-title text-3xl">Weekly Training Activities</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingTypes.map((t, i) => (
              <div key={i} className="card-army p-6 flex flex-col group hover:bg-army-900 transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500/0 to-transparent group-hover:via-gold-500 transition-all duration-500" />
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-heading text-sm text-white uppercase tracking-wide">{t.title}</h3>
                  <span className={`font-heading text-xs border px-2 py-0.5 flex-shrink-0 ml-2 ${t.badgeColor}`}>{t.badge}</span>
                </div>
                <p className="text-army-400 font-body text-sm leading-relaxed mb-4 flex-1">{t.desc}</p>
                <div className="space-y-1.5 border-t border-army-800 pt-3">
                  <div className="flex items-center gap-2 text-army-500 text-xs font-body">
                    <Clock className="w-3.5 h-3.5 text-gold-600" /> {t.schedule}
                  </div>
                  <div className="flex items-center gap-2 text-army-500 text-xs font-body">
                    <MapPin className="w-3.5 h-3.5 text-gold-600" /> {t.venue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Camps */}
      <section className="py-16 bg-military-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Immersive Experience</p>
            <h2 className="section-title text-3xl">NCC Camps</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {camps.map((camp, i) => (
              <div key={i} className="card-army relative overflow-hidden group hover:bg-army-900 transition-colors">
                <div className="absolute left-0 top-0 w-1 h-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading text-base text-white uppercase tracking-wide">{camp.name}</h3>
                      <p className="text-army-500 font-body text-xs mt-1">{camp.level} &nbsp;·&nbsp; {camp.duration} &nbsp;·&nbsp; {camp.frequency}</p>
                    </div>
                    <Award className="w-5 h-5 text-gold-500 flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-army-400 font-body text-sm leading-relaxed mb-4">{camp.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {camp.highlights.map((h) => (
                      <span key={h} className="text-army-400 font-body text-xs border border-army-700 px-2 py-0.5">{h}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section className="py-16 bg-military-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Career Advantage</p>
            <h2 className="section-title text-3xl">NCC Proficiency Certificates</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {certificates.map((cert, i) => (
              <div key={i} className={`card-army border-t-4 ${cert.color} p-6`}>
                <span className="badge-rank mb-3 inline-flex text-xs">{cert.badge}</span>
                <h3 className="font-heading text-xl text-white tracking-widest mb-1">{cert.name}</h3>
                <p className="text-gold-600 font-body text-xs mb-4">{cert.year} of NCC</p>
                <ul className="space-y-1.5 mb-5">
                  {cert.subjects.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-army-400 font-body text-xs">
                      <ChevronRight className="w-3 h-3 text-gold-600 flex-shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-army-800 pt-3">
                  <p className="text-army-500 font-body text-xs leading-relaxed">{cert.passing}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 card-army p-5 flex items-start gap-3">
            <Star className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
            <p className="text-army-300 font-body text-sm leading-relaxed">
              <strong className="text-white">NCC "C" Certificate Bonus:</strong> Holders get up to 5% bonus marks in NDA/CDS selection, direct entry to Indian Military/Naval/Air Force as commissioned officers through NCC Special Entry, and weightage in state government jobs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-military-darker border-t border-army-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-xl text-white uppercase tracking-widest mb-3">Begin Your Training Journey</h2>
          <p className="text-army-300 font-body text-sm mb-6">Apply to join NCC TCET and start building the discipline and skills that last a lifetime.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join" className="btn-primary inline-flex items-center gap-2">
              <Shield className="w-4 h-4" /> Join NCC
            </Link>
            <Link to="/events" className="btn-secondary inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Register for Event
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

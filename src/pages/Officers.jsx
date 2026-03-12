import { Anchor, Shield, Star, ChevronRight, Award, BookOpen, Target, Users, Phone, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

/* ─────────────────────────────────────────────
   Officer data — expand with real info as needed
───────────────────────────────────────────── */
const OFFICERS = [
  {
    id: 'vps',
    initials: 'VPS',
    name: 'Cdr. Vijay Pratap Singh (Retd.)',
    displayName: 'Cdr. Vijay Pratap Singh',
    role: 'Mentor & Officer In-Charge',
    unit: 'TCET NCC Unit',
    wing: 'Naval Wing',
    wingIcon: Anchor,
    accentFrom: '#0f1f47',
    accentTo: '#1d4ed8',
    badgeColor: 'bg-navy-700',
    ribbonColor: 'from-navy-900 to-navy-700',
    tagColor: 'bg-navy-50 text-navy-700',
    about: [
      'Commander Vijay Pratap Singh (Retd.) is a distinguished Naval Officer who served the Indian Navy with exemplary dedication before taking on the vital role of Mentor and Officer In-Charge of the TCET NCC Unit.',
      'With decades of experience in naval operations, leadership, and cadet development, he brings unmatched strategic insight and discipline to the NCC programme at Thakur College of Engineering and Technology.',
      'Under his guidance, the unit has grown in strength, discipline, and competitive achievement — producing cadets who excel at district, state, and national levels.',
    ],
    responsibilities: [
      'Overall administration and command of the TCET NCC Unit',
      'Strategic planning of annual training calendar and camp participation',
      'Mentoring senior cadets for Republic Day, Independence Day camps',
      'Coordination with the Directorate of NCC, Maharashtra & Goa',
      'Evaluation of cadet performance and promotion recommendations',
      'Liaison with TCET institute management for unit welfare',
    ],
    expertise: [
      'Naval Operations & Strategy',
      'Leadership Development',
      'Defence Training & Drills',
      'Cadet Administration',
      'Crisis Management',
      'Inter-wing Coordination',
    ],
    highlights: [
      { label: 'Wing', value: 'Naval Wing' },
      { label: 'Designation', value: 'Officer In-Charge' },
      { label: 'Status', value: 'Retired Commander, IN' },
      { label: 'Unit', value: 'TCET NCC Unit' },
    ],
  },
  {
    id: 'nk',
    initials: 'NK',
    name: 'Lt. Dr. Nivant Kambale',
    displayName: 'Lt. Dr. Nivant Kambale',
    role: 'Associate NCC Officer',
    unit: 'Army Wing',
    wing: 'Army Wing',
    wingIcon: Shield,
    accentFrom: '#7c2d12',
    accentTo: '#c2410c',
    badgeColor: 'bg-saffron-600',
    ribbonColor: 'from-saffron-700 to-saffron-500',
    tagColor: 'bg-saffron-50 text-saffron-700',
    about: [
      'Lieutenant Dr. Nivant Kambale serves as the Associate NCC Officer for the Army Wing at TCET. A highly qualified academic and an NCC-commissioned officer, he brings the rare combination of scholarly excellence and military discipline to the cadet programme.',
      'Dr. Kambale is actively involved in the day-to-day training and welfare of Army Wing cadets, ensuring they are well-prepared for all NCC examinations, parades, and adventure activities.',
      'His approachable demeanour and commitment to holistic cadet development make him a trusted figure among the cadets at TCET.',
    ],
    responsibilities: [
      'Day-to-day training supervision of Army Wing cadets',
      'Conducting and coordinating NCC B & C certificate examinations',
      'Planning and executing weapon training and field craft activities',
      'Supervising annual training camps (ATC) and combined annual training camps (CATC)',
      'Maintaining cadet attendance and progress records',
      'Conducting motivational sessions and academic guidance for cadets',
    ],
    expertise: [
      'Army Drills & Weapon Training',
      'Field Craft & Battle Craft',
      'NCC Syllabus & Examinations',
      'Academic Research',
      'Adventure Activities',
      'Cadet Welfare & Mentoring',
    ],
    highlights: [
      { label: 'Wing', value: 'Army Wing' },
      { label: 'Designation', value: 'Associate NCC Officer' },
      { label: 'Rank', value: 'Lieutenant (Lt.)' },
      { label: 'Qualification', value: 'Doctorate (PhD)' },
    ],
  },
  {
    id: 'sk',
    initials: 'SK',
    name: 'Mr. Sunil Khatri',
    displayName: 'Mr. Sunil Khatri',
    role: 'Care Taker Officer',
    unit: 'Navy Wing',
    wing: 'Navy Wing',
    wingIcon: Anchor,
    accentFrom: '#0f1f47',
    accentTo: '#0e7490',
    badgeColor: 'bg-navy-800',
    ribbonColor: 'from-navy-800 to-cyan-700',
    tagColor: 'bg-cyan-50 text-cyan-700',
    about: [
      'Mr. Sunil Khatri serves as the Care Taker Officer for the Navy Wing of TCET NCC. He plays a pivotal support role in ensuring the smooth day-to-day functioning of the unit — managing logistics, equipment, and cadet welfare at the ground level.',
      'His behind-the-scenes dedication ensures that cadets always have the resources, equipment, and administrative support they need for training and activities.',
      "Mr. Khatri's institutional knowledge and commitment to the unit make him an indispensable part of the TCET NCC family.",
    ],
    responsibilities: [
      'Management and upkeep of NCC unit equipment and stores',
      'Logistics coordination for training events and camps',
      'Cadet welfare and accommodation arrangements during camps',
      'Maintenance of unit records, documentation, and correspondences',
      'Coordination of uniform distribution and equipment issuance',
      'Supporting officers in administrative functions of the unit',
    ],
    expertise: [
      'Unit Administration & Logistics',
      'Equipment & Store Management',
      'Camp Coordination',
      'Cadet Support Services',
      'Documentation & Record-Keeping',
      'Inter-department Coordination',
    ],
    highlights: [
      { label: 'Wing', value: 'Navy Wing' },
      { label: 'Designation', value: 'Care Taker Officer' },
      { label: 'Focus', value: 'Logistics & Welfare' },
      { label: 'Unit', value: 'TCET NCC Unit' },
    ],
  },
]

/* ─── Sub-components ─── */

function OfficerCard({ officer, index }) {
  const { wingIcon: WingIcon } = officer
  const isEven = index % 2 === 0

  return (
    <div id={officer.id} className="scroll-mt-24">
      <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-0 rounded-3xl overflow-hidden shadow-lg border border-gray-100`}>

        {/* ── Sidebar ── */}
        <div
          className="lg:w-72 flex-shrink-0 flex flex-col items-center justify-start p-10 text-white relative overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${officer.accentFrom} 0%, ${officer.accentTo} 100%)` }}
        >
          {/* Decorative circle */}
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5" />

          {/* Avatar */}
          <div className={`w-28 h-28 rounded-2xl ${officer.badgeColor} flex items-center justify-center mb-5 shadow-xl ring-4 ring-white/20 relative z-10`}>
            <span className="text-white font-bold text-3xl font-poppins tracking-wider">{officer.initials}</span>
          </div>

          {/* Wing badge */}
          <div className="flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1 mb-5 relative z-10">
            <WingIcon className="w-3.5 h-3.5 text-white/80" />
            <span className="text-white/90 text-[11px] font-bold uppercase tracking-widest">{officer.wing}</span>
          </div>

          {/* Name & role */}
          <h2 className="font-bold font-poppins text-lg text-center leading-snug mb-1 relative z-10">{officer.displayName}</h2>
          <div className="w-10 h-0.5 bg-white/40 rounded-full my-3 relative z-10" />
          <p className="text-white/80 text-sm font-medium text-center relative z-10">{officer.role}</p>
          <p className="text-white/50 text-xs mt-1 text-center relative z-10">({officer.unit})</p>

          {/* Highlights */}
          <div className="w-full mt-8 space-y-2.5 relative z-10">
            {officer.highlights.map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-white/50 text-xs">{label}</span>
                <span className="text-white/90 text-xs font-semibold text-right max-w-[55%]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 bg-white p-8 lg:p-10 flex flex-col gap-8">

          {/* About */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-saffron-500" />
              <h3 className="font-bold font-poppins text-navy-900 text-sm uppercase tracking-widest">About</h3>
            </div>
            <div className="space-y-3">
              {officer.about.map((para, i) => (
                <p key={i} className="text-gray-600 text-[15px] leading-relaxed">{para}</p>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Responsibilities */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-saffron-500" />
                <h3 className="font-bold font-poppins text-navy-900 text-sm uppercase tracking-widest">Responsibilities</h3>
              </div>
              <ul className="space-y-2">
                {officer.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <ChevronRight className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Areas of Expertise */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-saffron-500" />
                <h3 className="font-bold font-poppins text-navy-900 text-sm uppercase tracking-widest">Areas of Expertise</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {officer.expertise.map((skill) => (
                  <span key={skill} className={`${officer.tagColor} text-[11px] font-semibold px-3 py-1.5 rounded-full border border-current/10`}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Page ─── */
export default function Officers() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">

      {/* ── Hero ── */}
      <div
        className="relative py-20 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 60%, #1d4ed8 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-saffron-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-saffron-500/20 border border-saffron-400/30 rounded-full px-4 py-1.5 mb-6">
            <Users className="w-3.5 h-3.5 text-saffron-400" />
            <span className="text-saffron-300 text-xs font-semibold uppercase tracking-widest">Leadership</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">Controlling Officers</h1>
          <div className="w-16 h-1 bg-saffron-500 rounded-full mx-auto mb-5" />
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Meet the dedicated officers responsible for the training, welfare, and activities of TCET NCC cadets.
            Their expertise and commitment shape the future leaders of India.
          </p>

          {/* Quick jump links */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {OFFICERS.map((o) => (
              <a
                key={o.id}
                href={`#${o.id}`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">{o.initials}</span>
                {o.displayName.split(' ').slice(-2).join(' ')}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Officer Cards ── */}
      <div className="max-w-6xl mx-auto px-4 py-14 space-y-10">
        {OFFICERS.map((officer, index) => (
          <OfficerCard key={officer.id} officer={officer} index={index} />
        ))}
      </div>

      {/* ── Unit Info Banner ── */}
      <div className="max-w-6xl mx-auto px-4 pb-14">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-saffron-500" />
              <span className="text-saffron-600 text-xs font-bold uppercase tracking-widest">About the Unit</span>
            </div>
            <h2 className="text-2xl font-bold font-poppins text-navy-900 mb-3">TCET NCC Unit</h2>
            <div className="w-10 h-0.5 bg-saffron-500 rounded-full mb-4" />
            <p className="text-gray-600 text-sm leading-relaxed">
              The NCC unit at Thakur College of Engineering & Technology operates under the Ministry of Defence, 
              Government of India. The unit comprises both Army and Naval Wings, training cadets to become 
              responsible, disciplined, and service-oriented citizens prepared for national challenges.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Phone, label: 'Phone', value: '+91 22 2885 0088', href: 'tel:+912228850088' },
              { icon: Mail, label: 'Email', value: 'ncc@tcetmumbai.in', href: 'mailto:ncc@tcetmumbai.in' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="flex flex-col gap-2 bg-gray-50 hover:bg-navy-50 border border-gray-100 rounded-2xl p-4 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-navy-100 group-hover:bg-navy-200 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-navy-700" />
                </div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</span>
                <span className="text-navy-800 font-semibold text-xs leading-snug">{value}</span>
              </a>
            ))}
            <Link
              to="/contact"
              className="col-span-2 flex items-center justify-center gap-2 bg-navy-950 hover:bg-navy-800 text-white text-sm font-semibold rounded-2xl p-4 transition-colors"
            >
              View Full Contact Details →
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}

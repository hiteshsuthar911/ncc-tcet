import { MapPin, Phone, Mail, Clock, ExternalLink, Shield, Star, Anchor } from 'lucide-react'

const OFFICERS = [
  {
    name: 'Cdr. Vijay Pratap Singh (Retd.)',
    shortName: 'Cdr. Vijay Pratap Singh',
    role: 'Mentor & Officer In-Charge',
    unit: 'TCET NCC Unit',
    wing: 'Naval Wing',
    icon: Anchor,
    color: 'bg-navy-700',
    initials: 'VPS',
  },
  {
    name: 'Lt. Dr. Nivant Kambale',
    shortName: 'Lt. Dr. Nivant Kambale',
    role: 'Associate NCC Officer',
    unit: 'Army Wing',
    wing: 'Army Wing',
    icon: Shield,
    color: 'bg-saffron-600',
    initials: 'NK',
  },
  {
    name: 'Mr. Sunil Khatri',
    shortName: 'Mr. Sunil Khatri',
    role: 'Care Taker Officer',
    unit: 'Navy Wing',
    wing: 'Navy Wing',
    icon: Anchor,
    color: 'bg-navy-800',
    initials: 'SK',
  },
]

const INFO_CARDS = [
  {
    icon: MapPin,
    title: 'Office Location',
    lines: [
      'NCC Office, TCET Campus',
      'Thakur Village, Kandivali (East)',
      'Mumbai — 400 101',
      'Maharashtra, India',
    ],
    action: {
      label: 'Get Directions',
      href: 'https://maps.google.com/?q=Thakur+College+of+Engineering+Technology+Kandivali+Mumbai',
    },
  },
  {
    icon: Phone,
    title: 'Phone',
    lines: ['+91 22 2885 0088', 'Monday – Saturday', '9:00 AM – 5:00 PM'],
    action: { label: 'Call Now', href: 'tel:+912228850088' },
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['ncc@tcetmumbai.in', 'For official correspondence,', 'forms & event queries'],
    action: { label: 'Send Email', href: 'mailto:ncc@tcetmumbai.in' },
  },
  {
    icon: Clock,
    title: 'Office Hours',
    lines: [
      'Mon – Fri: 9:00 AM – 5:00 PM',
      'Saturday: 9:00 AM – 1:00 PM',
      'Sunday & Holidays: Closed',
      'Training days may vary',
    ],
  },
]

export default function Contact() {
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
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-saffron-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-saffron-500/20 border border-saffron-400/30 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 text-saffron-400" />
            <span className="text-saffron-300 text-xs font-semibold uppercase tracking-widest">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">Contact Us</h1>
          <div className="w-16 h-1 bg-saffron-500 rounded-full mx-auto mb-5" />
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Reach out to the NCC TCET unit for queries on events, training, enrolment, or any other matter.
            We're here to assist every cadet and aspiring candidate.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-16">

        {/* ── Contact Info Cards ── */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-poppins text-navy-900 mb-2">Contact Information</h2>
            <div className="w-12 h-1 bg-saffron-500 rounded-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INFO_CARDS.map(({ icon: Icon, title, lines, action }) => (
              <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-navy-700" />
                </div>
                <h3 className="font-bold font-poppins text-navy-900 text-sm uppercase tracking-wide mb-3">{title}</h3>
                <div className="space-y-1 flex-1">
                  {lines.map((line, i) => (
                    <p key={i} className={`text-sm ${i === 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>{line}</p>
                  ))}
                </div>
                {action && (
                  <a
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-navy-700 hover:text-navy-900 font-semibold text-sm transition-colors"
                  >
                    {action.label} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Controlling Officers ── */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-poppins text-navy-900 mb-2">Controlling Officers</h2>
            <div className="w-12 h-1 bg-saffron-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Meet the dedicated officers responsible for the training and activities of TCET NCC Cadets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OFFICERS.map(({ name, shortName, role, unit, wing, icon: Icon, color, initials }) => (
              <div key={name} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                {/* Card top strip */}
                <div
                  className="h-2"
                  style={{ background: 'linear-gradient(90deg, #0f1f47, #1d4ed8)' }}
                />
                <div className="p-7 text-center">
                  {/* Avatar */}
                  <div className={`w-20 h-20 rounded-full ${color} flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-white`}>
                    <span className="text-white font-bold text-xl font-poppins tracking-wide">{initials}</span>
                  </div>

                  {/* Wing badge */}
                  <span className="inline-flex items-center gap-1.5 bg-navy-50 text-navy-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                    <Icon className="w-3 h-3" /> {wing}
                  </span>

                  <h3 className="font-bold font-poppins text-navy-900 text-base leading-snug mb-1">{shortName}</h3>

                  <div className="w-8 h-0.5 bg-saffron-500 rounded-full mx-auto my-3" />

                  <p className="text-navy-700 font-semibold text-sm">{role}</p>
                  <p className="text-gray-400 text-xs mt-1">({unit})</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Map + Quick Details ── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Map embed */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-sm border border-gray-100 min-h-[320px]">
            <iframe
              title="TCET Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.183!2d72.8398!3d19.2095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b7c4b1e8a3b7%3A0x7d8c9b3a2e1f4c5d!2sThakur%20College%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '320px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Quick details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold font-poppins text-navy-900 text-base mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-saffron-500" /> Unit Address
              </h3>
              <div className="space-y-1 text-sm text-gray-600 leading-relaxed">
                <p className="font-semibold text-gray-800">1 Maharashtra Naval Unit</p>
                <p>NCC TCET, Thakur Village</p>
                <p>Kandivali (East), Mumbai — 400 101</p>
                <p>Ministry of Defence, Govt. of India</p>
              </div>
              <a
                href="https://maps.google.com/?q=Thakur+College+of+Engineering+Technology+Kandivali+Mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-navy-900 transition-colors"
              >
                Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-navy-950 rounded-2xl p-6 text-white">
              <h3 className="font-bold font-poppins text-base mb-3 text-saffron-400">Quick Contacts</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-saffron-400 flex-shrink-0" />
                  <a href="tel:+912228850088" className="text-blue-200 hover:text-white transition-colors">+91 22 2885 0088</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-saffron-400 flex-shrink-0" />
                  <a href="mailto:ncc@tcetmumbai.in" className="text-blue-200 hover:text-white transition-colors">ncc@tcetmumbai.in</a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-saffron-400 flex-shrink-0 mt-0.5" />
                  <span className="text-blue-200">Mon–Sat: 9 AM – 5 PM</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="rounded-2xl text-white text-center py-12 px-8"
          style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 60%, #1d4ed8 100%)' }}
        >
          <h2 className="text-2xl font-bold font-poppins mb-3">Want to Join NCC?</h2>
          <p className="text-blue-200 mb-6 max-w-lg mx-auto text-sm leading-relaxed">
            Applications for new cadets open every academic year. Visit our Join NCC page or walk into the NCC office
            with your college ID for more details.
          </p>
          <a href="/ncc-tcet/join" className="inline-block bg-saffron-500 hover:bg-saffron-600 text-white font-bold px-8 py-3 rounded-xl transition-colors text-sm">
            Apply to Join NCC →
          </a>
        </section>

      </div>
    </div>
  )
}

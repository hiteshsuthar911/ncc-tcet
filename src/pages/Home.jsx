import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Star, Users, Award, ChevronRight, Target, Zap, Globe,
  ArrowRight, Calendar, BookOpen, Trophy, CheckCircle, Sparkles,
} from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

const STATS = [
  { label: 'Active Cadets', value: '120+', icon: Users, color: 'text-navy-700', bg: 'bg-navy-50' },
  { label: 'Years of Service', value: '15+', icon: Award, color: 'text-saffron-600', bg: 'bg-saffron-50' },
  { label: 'Camps Attended', value: '80+', icon: Target, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'National Awards', value: '12+', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
]

const CORE_VALUES = [
  {
    icon: Shield,
    title: 'Discipline',
    desc: 'We uphold the highest standards of conduct and military bearing at all times.',
    color: 'bg-navy-100 text-navy-700',
  },
  {
    icon: Users,
    title: 'Unity',
    desc: 'Strength through solidarity — every cadet is a vital link in our chain of command.',
    color: 'bg-saffron-100 text-saffron-700',
  },
  {
    icon: Target,
    title: 'Service',
    desc: 'Dedicated to nation, community, and selfless service beyond self.',
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: Zap,
    title: 'Excellence',
    desc: 'Pushing the limits — physically, mentally, and academically.',
    color: 'bg-purple-100 text-purple-700',
  },
]

const HIGHLIGHTS = [
  { icon: Trophy, label: 'Best NCC Unit 2024', sub: 'Maharashtra Directorate' },
  { icon: Globe, label: 'Youth Exchange 2023', sub: 'Germany Programme' },
  { icon: Star, label: 'Republic Day Camp', sub: '3 Cadets Selected' },
  { icon: BookOpen, label: 'C Certificate Holders', sub: '25+ Cadets' },
]

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const snap = await getDocs(collection(db, 'events'))
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        const active = all
          .filter((e) => e.isActive)
          .sort((a, b) => {
            const aTs = a.date?.seconds ?? 0
            const bTs = b.date?.seconds ?? 0
            return aTs - bTs
          })
          .slice(0, 3)
        setUpcomingEvents(active)
      } catch {
        // Firestore not yet set up — silently ignore
      } finally {
        setLoadingEvents(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 50%, #1d4ed8 100%)' }} />
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* Radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy-400/20 rounded-full blur-3xl" />

        {/* Floating decorative shapes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-saffron-400 rounded-full animate-float opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white/20 rounded-full animate-float opacity-40" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-saffron-300 rounded-full animate-float opacity-50" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* College badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
            <span className="font-body text-xs text-white/90 tracking-[0.15em] uppercase">
              Thakur College of Engineering &amp; Technology
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-heading font-extrabold text-5xl md:text-7xl lg:text-8xl text-white mb-3 leading-tight tracking-tight">
            NCC TCET
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-10 h-px bg-saffron-400" />
            <p className="font-body text-saffron-300 text-sm md:text-base tracking-[0.3em] uppercase">
              National Cadet Corps
            </p>
            <span className="w-10 h-px bg-saffron-400" />
          </div>

          <p className="font-body text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Forging disciplined, patriotic, and capable leaders for tomorrow. Join us in the pursuit of excellence, unity, and service to the nation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="inline-flex items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-heading font-semibold text-sm px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Register for Events
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-heading font-semibold text-sm px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-sm">
              Discover More
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-60">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="stat-card flex flex-col items-center text-center p-6">
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <p className="font-heading font-extrabold text-3xl md:text-4xl text-gray-900 mb-1">{value}</p>
                <p className="font-body text-xs text-gray-500 tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS BANNER ── */}
      <section className="py-8 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 bg-saffron-500/10 border border-saffron-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-saffron-400" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm text-white leading-none">{label}</p>
                  <p className="font-body text-xs text-navy-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SNIPPET ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="section-subtitle">Our Mission</p>
              <h2 className="section-title text-3xl md:text-4xl mb-3">
                Building Leaders of Tomorrow
              </h2>
              <div className="divider-gold mb-7" />
              <p className="text-gray-600 font-body leading-relaxed mb-4 text-base">
                The NCC unit at TCET is committed to developing young men and women into disciplined, responsible citizens and future leaders through rigorous military training, community service, and character building programs.
              </p>
              <p className="text-gray-500 font-body leading-relaxed mb-8 text-base">
                Our cadets participate in national-level camps, adventure activities, social service initiatives, and receive training that instills values of patriotism, integrity, and excellence.
              </p>
              <div className="space-y-3 mb-8">
                {['NCC B & C Certificate preparation', 'National-level camp participation', 'Community service & social impact', 'Defence career advantage'].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-saffron-500 flex-shrink-0" />
                    <span className="text-gray-700 font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn-primary">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {CORE_VALUES.map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="card-army p-6 group hover:-translate-y-1">
                  <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-base mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm font-body leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
            <div>
              <p className="section-subtitle">What's Ahead</p>
              <h2 className="section-title text-3xl md:text-4xl">Upcoming Events</h2>
              <div className="divider-gold mt-3" />
            </div>
            <Link to="/events" className="btn-ghost text-sm self-start sm:self-auto">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingEvents ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-army p-6 animate-pulse">
                  <div className="h-3 bg-gray-100 rounded-full mb-4 w-1/3" />
                  <div className="h-5 bg-gray-100 rounded-full mb-3" />
                  <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-navy-400" />
              </div>
              <p className="text-gray-600 font-body font-medium">No upcoming events at the moment.</p>
              <p className="text-gray-400 text-sm font-body mt-1">Check back soon for new events.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 60%, #1d4ed8 100%)' }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-saffron-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-navy-400/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 bg-saffron-500/10 border border-saffron-400/20 rounded-full px-4 py-1.5 mb-6">
            <Shield className="w-3.5 h-3.5 text-saffron-400" />
            <span className="font-body text-xs text-saffron-300 tracking-[0.15em] uppercase">Ready to Serve?</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white mb-5 leading-tight">
            Join the Corps Today
          </h2>
          <p className="text-white/75 font-body mb-10 max-w-xl mx-auto leading-relaxed text-base">
            Take the first step towards becoming a part of something bigger. Build character, earn certificates, and serve the nation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join" className="inline-flex items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-heading font-semibold text-sm px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-heading font-semibold text-sm px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-sm">
              Cadet Login
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

function EventCard({ event }) {
  const dateStr = event.date
    ? new Date(event.date.seconds ? event.date.seconds * 1000 : event.date).toLocaleDateString(
        'en-IN', { day: 'numeric', month: 'short', year: 'numeric' }
      )
    : 'TBA'

  return (
    <div className="card-army p-6 group hover:-translate-y-1 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="badge-pill">{event.category || 'Event'}</span>
        <span className="font-body text-xs text-gray-400">{dateStr}</span>
      </div>
      <h3 className="font-heading font-bold text-gray-900 text-lg mb-2 group-hover:text-navy-800 transition-colors line-clamp-2">
        {event.title}
      </h3>
      <p className="text-gray-500 text-sm font-body mb-5 line-clamp-2 flex-1">{event.description}</p>
      <Link
        to={`/events?register=${event.id}`}
        className="flex items-center gap-1 text-navy-700 hover:text-navy-900 text-sm font-heading font-semibold transition-colors"
      >
        Register <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

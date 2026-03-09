import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Star,
  Users,
  Award,
  ChevronRight,
  Target,
  Zap,
  Globe,
} from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

const STATS = [
  { label: 'Active Cadets', value: '120+', icon: Users },
  { label: 'Years of Service', value: '15+', icon: Award },
  { label: 'Camps Attended', value: '80+', icon: Target },
  { label: 'National Awards', value: '12+', icon: Star },
]

const CORE_VALUES = [
  {
    icon: Shield,
    title: 'Discipline',
    desc: 'We uphold the highest standards of conduct and military bearing at all times.',
  },
  {
    icon: Users,
    title: 'Unity',
    desc: 'Strength through solidarity — every cadet is a vital link in our chain of command.',
  },
  {
    icon: Target,
    title: 'Service',
    desc: 'Dedicated to nation, community, and selfless service beyond self.',
  },
  {
    icon: Zap,
    title: 'Excellence',
    desc: 'Pushing the limits — physically, mentally, and academically.',
  },
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
        {/* Background base layer */}
        <div className="absolute inset-0 bg-military-dark" />
        {/* Dark gradient overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-military-dark/95" />
        {/* Subtle camo texture on top */}
        <div className="absolute inset-0 bg-camo-pattern opacity-10" />

        {/* Decorative corner brackets */}
        <div className="absolute top-24 left-6 w-16 h-16 border-t-2 border-l-2 border-gold-500 opacity-60" />
        <div className="absolute top-24 right-6 w-16 h-16 border-t-2 border-r-2 border-gold-500 opacity-60" />
        <div className="absolute bottom-12 left-6 w-16 h-16 border-b-2 border-l-2 border-gold-500 opacity-60" />
        <div className="absolute bottom-12 right-6 w-16 h-16 border-b-2 border-r-2 border-gold-500 opacity-60" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-gold-500/50 bg-gold-500/10 px-5 py-2 mb-8">
            <Globe className="w-4 h-4 text-gold-400" />
            <span className="font-heading text-xs text-gold-400 tracking-[0.3em] uppercase">
              Thakur College of Engineering &amp; Technology
            </span>
          </div>

          <h1 className="section-title text-5xl md:text-7xl lg:text-8xl mb-4 text-glow-gold">
            NCC TCET
          </h1>
          <p className="font-heading text-lg md:text-2xl text-gold-500 tracking-[0.4em] uppercase mb-3">
            National Cadet Corps
          </p>
          <div className="divider-gold w-48 mx-auto mb-6" />
          <p className="font-body text-army-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Forging disciplined, patriotic, and capable leaders for tomorrow. Join us in the pursuit of excellence, unity, and service to the nation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="btn-primary text-sm">
              Register for Events
              <ChevronRight className="inline-block w-4 h-4 ml-1 -mr-1" />
            </Link>
            <Link to="/about" className="btn-secondary text-sm">
              Discover More
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-slow">
            <div className="w-px h-12 bg-gradient-to-b from-gold-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-military-darker border-y border-army-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="stat-card text-center">
                <Icon className="w-6 h-6 text-gold-500 mx-auto mb-3" />
                <p className="font-heading text-3xl md:text-4xl text-white mb-1">{value}</p>
                <p className="font-body text-xs text-army-400 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SNIPPET ── */}
      <section className="py-20 bg-military-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subtitle">Our Mission</p>
              <h2 className="section-title text-3xl md:text-4xl mb-6">
                Building Leaders of Tomorrow
              </h2>
              <div className="divider-gold w-24 mb-6" />
              <p className="text-army-300 font-body leading-relaxed mb-4">
                The NCC unit at TCET is committed to developing young men and women into disciplined, responsible citizens and future leaders through rigorous military training, community service, and character building programs.
              </p>
              <p className="text-army-400 font-body leading-relaxed mb-8">
                Our cadets participate in national-level camps, adventure activities, social service initiatives, and receive training that instills values of patriotism, integrity, and excellence.
              </p>
              <Link to="/about" className="btn-primary inline-flex items-center gap-2">
                Learn More <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {CORE_VALUES.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="card-army p-5 group hover:bg-army-900 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-army-800 border border-army-600 flex items-center justify-center mb-3 group-hover:border-gold-500 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-gold-500" />
                    </div>
                    <h3 className="font-heading text-white text-sm uppercase tracking-widest mb-2">
                      {title}
                    </h3>
                    <p className="text-army-400 text-xs font-body leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-gold-500/20" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-army-600/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="py-20 bg-military-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">What's Ahead</p>
            <h2 className="section-title text-3xl md:text-4xl">Upcoming Events</h2>
            <div className="divider-gold w-24 mx-auto mt-4" />
          </div>

          {loadingEvents ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-army p-6 animate-pulse">
                  <div className="h-4 bg-army-800 rounded mb-3 w-1/3" />
                  <div className="h-6 bg-army-800 rounded mb-2" />
                  <div className="h-4 bg-army-800 rounded w-2/3" />
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
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-army-700 mx-auto mb-4" />
              <p className="text-army-500 font-body">No upcoming events at the moment.</p>
              <p className="text-army-600 text-sm font-body mt-1">Check back soon for new events.</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/events" className="btn-secondary">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-army-900 border-y border-army-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <p className="section-subtitle">Ready to Serve?</p>
          <h2 className="section-title text-3xl md:text-5xl mb-4">
            Join the Corps
          </h2>
          <div className="divider-gold w-24 mx-auto mb-6" />
          <p className="text-army-300 font-body mb-8 max-w-xl mx-auto leading-relaxed">
            Take the first step towards becoming a part of something bigger. Register for our upcoming events and let your journey begin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="btn-primary">
              Register Now
            </Link>
            <Link to="/login" className="btn-secondary">
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
        'en-IN',
        { day: 'numeric', month: 'short', year: 'numeric' }
      )
    : 'TBA'

  return (
    <div className="card-army p-6 group hover:bg-army-900 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="badge-rank mb-3 inline-flex">{event.category || 'Event'}</span>
      <h3 className="font-heading text-white text-lg uppercase tracking-wide mb-2 group-hover:text-gold-400 transition-colors duration-200">
        {event.title}
      </h3>
      <p className="text-army-400 text-sm font-body mb-4 line-clamp-2">{event.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-gold-500 text-xs font-heading tracking-wider">{dateStr}</span>
        <Link
          to={`/events?register=${event.id}`}
          className="text-xs font-heading text-army-400 hover:text-gold-400 uppercase tracking-wider flex items-center gap-1 transition-colors duration-200"
        >
          Register <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

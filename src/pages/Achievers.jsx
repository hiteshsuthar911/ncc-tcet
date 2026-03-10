import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Award, Star, Filter, UserCircle, Trophy, Medal } from 'lucide-react'

const CATEGORIES = ['All', 'RDC', 'NIC', 'TSC', 'Best Cadet', 'National', 'State', 'Republic Day']

const CATEGORY_COLOR = {
  RDC:          'border-green-700 text-green-400 bg-green-900/10',
  NIC:          'border-blue-700 text-blue-400 bg-blue-900/10',
  TSC:          'border-sky-700 text-sky-400 bg-sky-900/10',
  'Best Cadet': 'border-gold-700 text-gold-400 bg-gold-900/10',
  National:     'border-red-700 text-red-400 bg-red-900/10',
  State:        'border-purple-700 text-purple-400 bg-purple-900/10',
  'Republic Day': 'border-orange-700 text-orange-400 bg-orange-900/10',
}

const DEMO_ACHIEVERS = [
  { name: 'Cadet Priya Mehta',       rank: 'Senior Under Officer', category: 'RDC',          achievement: 'Republic Day Camp, Delhi — Selected cadet representing Maharashtra Directorate', year: '2024', wing: 'Army' },
  { name: 'Cadet Rohan Gupta',       rank: 'Under Officer',        category: 'National',      achievement: 'All India Shooting Competition — Gold Medal (Air Rifle)', year: '2024', wing: 'Air' },
  { name: 'Cadet Sneha Patil',       rank: 'Cadet Captain',        category: 'Best Cadet',    achievement: 'Best Cadet Award — Maharashtra & Goa Directorate, Annual Training Camp', year: '2023', wing: 'Navy' },
  { name: 'Cadet Farhan Khan',       rank: 'Cadet Captain',        category: 'TSC',           achievement: 'Thal Sainik Camp, Delhi — Army Wing Representative', year: '2023', wing: 'Army' },
  { name: 'Cadet Anjali Desai',      rank: 'Under Officer',        category: 'State',         achievement: 'State Level Essay Competition  — First Place', year: '2023', wing: 'Air' },
  { name: 'Cadet Vineet Sharma',     rank: 'Lance Corporal',       category: 'NIC',           achievement: 'National Integration Camp — Cultural Performance Award', year: '2022', wing: 'Army' },
  { name: 'Cadet Meera Nair',        rank: 'Corporal',             category: 'Republic Day',  achievement: 'Republic Day Parade, Mumbai — Selected for Maharashtra Contingent', year: '2022', wing: 'Navy' },
  { name: 'Cadet Aditya Joshi',      rank: 'Cadet',                category: 'Best Cadet',    achievement: 'Best Cadet, Combined Annual Training Camp 2022', year: '2022', wing: 'Army' },
]

export default function Achievers() {
  const [achievers, setAchievers] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [catFilter, setCatFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')

  useEffect(() => {
    async function fetchAchievers() {
      try {
        const snap = await getDocs(query(collection(db, 'achievers'), orderBy('year', 'desc')))
        setAchievers(snap.empty
          ? DEMO_ACHIEVERS
          : snap.docs.map(d => ({ id: d.id, ...d.data() }))
        )
      } catch {
        setAchievers(DEMO_ACHIEVERS)
      } finally {
        setLoading(false)
      }
    }
    fetchAchievers()
  }, [])

  const years = ['All', ...new Set((achievers || []).map(a => a.year).filter(Boolean).sort((a, b) => b - a))]

  const filtered = (achievers || []).filter(a => {
    const matchCat  = catFilter  === 'All' || a.category === catFilter
    const matchYear = yearFilter === 'All' || a.year === yearFilter
    return matchCat && matchYear
  })

  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="relative py-20 bg-army-900 overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-army-800 border-2 border-gold-500 mb-6">
            <Trophy className="w-10 h-10 text-gold-400" />
          </div>
          <p className="section-subtitle">Hall of Fame</p>
          <h1 className="section-title text-4xl md:text-6xl mb-4">Achievers</h1>
          <div className="divider-gold w-24 mx-auto mt-3 mb-6" />
          <p className="text-army-300 font-body text-lg max-w-2xl mx-auto leading-relaxed">
            Celebrating the cadets who have distinguished themselves at state and national levels.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-military-dark border-b border-army-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'National Selections', value: '30+', icon: Medal },
              { label: 'State Awards',         value: '55+', icon: Star  },
              { label: 'Best Cadet Titles',    value: '12',  icon: Award },
              { label: 'RDC Participants',     value: '8',   icon: Trophy},
            ].map((s, i) => (
              <div key={i} className="card-army p-4 text-center">
                <s.icon className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <p className="font-heading text-xl text-gray-900">{s.value}</p>
                <p className="text-army-400 font-body text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-16 bg-military-darker">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center mb-8">
            <Filter className="w-4 h-4 text-army-500" />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className={`font-heading text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors ${
                    catFilter === cat
                      ? 'border-gold-600 text-gold-400 bg-gold-900/10'
                      : 'border-army-700 text-army-400 hover:text-army-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              className="select-field text-xs py-1.5 px-3 ml-auto"
            >
              {years.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>

          {/* Count */}
          <p className="text-army-500 font-body text-xs mb-6">{filtered.length} achiever{filtered.length !== 1 ? 's' : ''} shown</p>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="card-army p-5 animate-pulse">
                  <div className="h-3 bg-army-700 w-1/3 mb-3" />
                  <div className="h-4 bg-army-700 w-2/3 mb-2" />
                  <div className="h-3 bg-army-800 w-full" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card-army p-12 text-center">
              <Trophy className="w-10 h-10 text-army-700 mx-auto mb-4" />
              <p className="text-army-500 font-body">No achievers found for the selected filters.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((a, i) => {
                const cls = CATEGORY_COLOR[a.category] ?? 'border-army-700 text-army-400 bg-army-900/10'
                return (
                  <div key={i} className="card-army relative overflow-hidden p-5 group hover:bg-army-900 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold-500/30 group-hover:bg-gold-500/60 transition-colors" />
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-army-800 border border-army-600 flex items-center justify-center flex-shrink-0">
                        <UserCircle className="w-6 h-6 text-army-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading text-xs text-gray-900 uppercase tracking-wide truncate">{a.name}</p>
                        <p className="text-army-500 font-body text-xs">{a.rank}</p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-1 border px-2 py-0.5 text-xs font-heading uppercase tracking-wider mb-3 ${cls}`}>
                      <Award className="w-3 h-3" /> {a.category}
                    </div>
                    <p className="text-army-300 font-body text-xs leading-relaxed">{a.achievement}</p>
                    <div className="mt-3 pt-3 border-t border-army-800 flex items-center justify-between">
                      <span className="text-army-500 font-body text-xs">{a.year}</span>
                      {a.wing && <span className="text-army-500 font-body text-xs">{a.wing} Wing</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

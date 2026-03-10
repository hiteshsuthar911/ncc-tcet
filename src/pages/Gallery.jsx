import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Camera, Filter, X, ZoomIn } from 'lucide-react'

const DEMO_GALLERY = [
  { id: '1', imageUrl: '', caption: 'Republic Day Parade 2024 — Mumbai',   category: 'Parade',      year: '2024' },
  { id: '2', imageUrl: '', caption: 'Annual Training Camp — Nashik',         category: 'Camp',        year: '2024' },
  { id: '3', imageUrl: '', caption: 'Trekking Expedition — Rajmachi',        category: 'Adventure',   year: '2024' },
  { id: '4', imageUrl: '', caption: 'Firing Practice — Service Range',        category: 'Training',    year: '2023' },
  { id: '5', imageUrl: '', caption: 'Blood Donation Camp — TCET Campus',     category: 'Social',      year: '2023' },
  { id: '6', imageUrl: '', caption: 'NCC Day Celebration',                    category: 'Cultural',    year: '2023' },
  { id: '7', imageUrl: '', caption: 'National Integration Camp — Delhi',      category: 'Camp',        year: '2023' },
  { id: '8', imageUrl: '', caption: 'Yoga Day on Campus',                     category: 'Training',    year: '2023' },
  { id: '9', imageUrl: '', caption: 'Inter-Unit Drill Competition',            category: 'Parade',      year: '2022' },
]

const CATEGORIES = ['All', 'Parade', 'Camp', 'Adventure', 'Training', 'Social', 'Cultural']

// Generate a deterministic gradient placeholder based on index
const GRAD_COLORS = [
  'from-army-900 to-army-800',
  'from-green-950 to-army-900',
  'from-sky-950 to-army-900',
  'from-red-950 to-army-900',
  'from-purple-950 to-army-900',
  'from-amber-950 to-army-900',
]

export default function Gallery() {
  const [items, setItems]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('All')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const snap = await getDocs(query(collection(db, 'gallery'), orderBy('takenAt', 'desc')))
        setItems(snap.empty
          ? DEMO_GALLERY
          : snap.docs.map(d => ({ id: d.id, ...d.data() }))
        )
      } catch {
        setItems(DEMO_GALLERY)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  const years = ['All', ...new Set((items || []).map(i => i.year).filter(Boolean).sort((a, b) => b - a))]
  const [yearFilter, setYearFilter] = useState('All')

  const filtered = (items || []).filter(item => {
    const matchCat  = filter    === 'All' || item.category === filter
    const matchYear = yearFilter === 'All' || item.year     === yearFilter
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
            <Camera className="w-10 h-10 text-gold-400" />
          </div>
          <p className="section-subtitle">Memories</p>
          <h1 className="section-title text-4xl md:text-6xl mb-4">Photo Gallery</h1>
          <div className="divider-gold w-24 mx-auto mt-3 mb-6" />
          <p className="text-army-300 font-body text-lg max-w-2xl mx-auto leading-relaxed">
            Moments captured from parades, camps, expeditions, and celebrations across the NCC TCET journey.
          </p>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="py-16 bg-military-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Filter className="w-4 h-4 text-army-500" />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`font-heading text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors ${
                    filter === cat
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

          <p className="text-army-500 font-body text-xs mb-6">{filtered.length} photo{filtered.length !== 1 ? 's' : ''}</p>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-army-800 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card-army p-16 text-center">
              <Camera className="w-12 h-12 text-army-700 mx-auto mb-4" />
              <p className="text-army-500 font-body text-sm">No photos found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  className="group relative aspect-square cursor-pointer overflow-hidden border border-army-800 hover:border-gold-600 transition-colors"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${GRAD_COLORS[i % GRAD_COLORS.length]} p-4`}>
                      <Camera className="w-8 h-8 text-army-600 mb-2" />
                      <p className="text-army-600 font-body text-xs text-center leading-tight">{item.category}</p>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                    <ZoomIn className="w-6 h-6 text-gold-400" />
                    <p className="text-white font-body text-xs text-center leading-tight">{item.caption}</p>
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-2 left-2">
                    <span className="font-heading text-[10px] uppercase tracking-wider bg-army-950/80 text-gold-400 px-1.5 py-0.5 border border-army-700">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightbox(null)}>
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            {lightbox.imageUrl ? (
              <img src={lightbox.imageUrl} alt={lightbox.caption} className="w-full max-h-[75vh] object-contain" />
            ) : (
              <div className="w-full aspect-video bg-army-900 flex items-center justify-center border border-army-700">
                <Camera className="w-16 h-16 text-army-700" />
              </div>
            )}
            <div className="mt-4 text-center">
              <p className="text-white font-body text-sm">{lightbox.caption}</p>
              <p className="text-army-500 font-body text-xs mt-1">{lightbox.category} · {lightbox.year}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

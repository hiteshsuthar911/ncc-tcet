import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Camera, Filter, X, ZoomIn, ImageIcon } from 'lucide-react'

const DEMO_GALLERY = [
  { id: '1', imageUrl: '', caption: 'Republic Day Parade 2024 — Mumbai',   category: 'Parade',    year: '2024' },
  { id: '2', imageUrl: '', caption: 'Annual Training Camp — Nashik',         category: 'Camp',      year: '2024' },
  { id: '3', imageUrl: '', caption: 'Trekking Expedition — Rajmachi',        category: 'Adventure', year: '2024' },
  { id: '4', imageUrl: '', caption: 'Firing Practice — Service Range',        category: 'Training',  year: '2023' },
  { id: '5', imageUrl: '', caption: 'Blood Donation Camp — TCET Campus',     category: 'Social',    year: '2023' },
  { id: '6', imageUrl: '', caption: 'NCC Day Celebration',                    category: 'Cultural',  year: '2023' },
  { id: '7', imageUrl: '', caption: 'National Integration Camp — Delhi',      category: 'Camp',      year: '2023' },
  { id: '8', imageUrl: '', caption: 'Yoga Day on Campus',                     category: 'Training',  year: '2023' },
  { id: '9', imageUrl: '', caption: 'Inter-Unit Drill Competition',            category: 'Parade',    year: '2022' },
]

const CATEGORIES = ['All', 'Parade', 'Camp', 'Adventure', 'Training', 'Social', 'Cultural']

const CAT_COLORS = {
  Parade:    'bg-navy-100 text-navy-700',
  Camp:      'bg-green-100 text-green-700',
  Adventure: 'bg-orange-100 text-orange-700',
  Training:  'bg-blue-100 text-blue-700',
  Social:    'bg-pink-100 text-pink-700',
  Cultural:  'bg-purple-100 text-purple-700',
}

const GRAD_BG = [
  'from-navy-100 to-navy-200',
  'from-saffron-100 to-orange-100',
  'from-green-100 to-emerald-100',
  'from-purple-100 to-violet-100',
  'from-blue-100 to-sky-100',
  'from-amber-100 to-yellow-100',
]

export default function Gallery() {
  const [items, setItems]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('All')
  const [yearFilter, setYearFilter] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const snap = await getDocs(query(collection(db, 'gallery'), orderBy('takenAt', 'desc')))
        setItems(snap.empty ? DEMO_GALLERY : snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch {
        setItems(DEMO_GALLERY)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  const years = ['All', ...new Set((items || []).map(i => i.year).filter(Boolean).sort((a, b) => b - a))]

  const filtered = (items || []).filter(item => {
    const matchCat  = filter    === 'All' || item.category === filter
    const matchYear = yearFilter === 'All' || item.year     === yearFilter
    return matchCat && matchYear
  })

  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1f47 0%, #1e3a8a 60%, #1d4ed8 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-saffron-400" />
          </div>
          <p className="section-subtitle-light mb-2">Memories</p>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-white mb-4">Photo Gallery</h1>
          <div className="w-12 h-1 bg-saffron-400 rounded-full mx-auto mb-6" />
          <p className="text-white/75 font-body text-lg max-w-2xl mx-auto leading-relaxed">
            Moments captured from parades, camps, expeditions, and celebrations across the NCC TCET journey.
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="flex items-center gap-2 text-gray-500">
              <Filter className="w-4 h-4" />
              <span className="font-heading font-medium text-sm">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2 flex-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`font-heading font-medium text-xs px-4 py-2 rounded-full border transition-all duration-200 ${
                    filter === cat
                      ? 'bg-navy-900 border-navy-900 text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-navy-400 hover:text-navy-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              className="input-field w-auto text-sm py-2 px-3"
            >
              {years.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>

          <p className="text-gray-400 font-body text-xs mb-6">
            {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
          </p>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card-army p-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 font-body text-sm">No photos found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border-2 border-transparent hover:border-navy-400 transition-all duration-300 shadow-sm hover:shadow-card-hover"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${GRAD_BG[i % GRAD_BG.length]} p-4`}>
                      <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-gray-500 font-body text-xs text-center leading-tight">{item.category}</p>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-3">
                    <ZoomIn className="w-7 h-7 text-white" />
                    <p className="text-white font-body text-xs text-center leading-tight">{item.caption}</p>
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`font-heading font-semibold text-[10px] px-2 py-0.5 rounded-full ${CAT_COLORS[item.category] || 'bg-gray-100 text-gray-600'}`}>
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            {lightbox.imageUrl ? (
              <img src={lightbox.imageUrl} alt={lightbox.caption} className="w-full max-h-[75vh] object-contain rounded-2xl" />
            ) : (
              <div className="w-full aspect-video bg-gray-800 flex items-center justify-center rounded-2xl">
                <Camera className="w-16 h-16 text-gray-600" />
              </div>
            )}
            <div className="mt-4 text-center">
              <p className="text-white font-body font-medium text-sm">{lightbox.caption}</p>
              <p className="text-gray-400 font-body text-xs mt-1">{lightbox.category} · {lightbox.year}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


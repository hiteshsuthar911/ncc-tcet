import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { BookOpen, Download, ExternalLink, Calendar, FileText, Search } from 'lucide-react'

const DEMO_MAGAZINES = [
  {
    id: '1',
    title: 'Veer — NCC TCET Magazine 2024',
    description: 'Annual magazine featuring cadet achievements, camp reports, motivational articles, and photo essays from the academic year 2023–24.',
    issue: 'vol5',
    month: 'March',
    year: '2024',
    url: '',
    coverUrl: '',
    tags: ['Annual', 'Achievements', 'Camp Reports'],
  },
  {
    id: '2',
    title: 'Veer — NCC TCET Magazine 2023',
    description: 'Vol 4 covers RDC selections, TSC camp, community service activities, and the inspirational stories of our cadets.',
    issue: 'vol4',
    month: 'March',
    year: '2023',
    url: '',
    coverUrl: '',
    tags: ['RDC', 'TSC', 'Community Service'],
  },
  {
    id: '3',
    title: 'NCC TCET Newsletter — Autumn 2023',
    description: 'Quarterly newsletter covering monsoon trek, blood donation camp, NCC Day celebrations, and upcoming event schedule.',
    issue: 'q3-2023',
    month: 'October',
    year: '2023',
    url: '',
    coverUrl: '',
    tags: ['Newsletter', 'Quarterly', 'Events'],
  },
  {
    id: '4',
    title: 'Veer — NCC TCET Magazine 2022',
    description: 'Vol 3 celebrating 10 years of NCC at TCET, featuring alumni interviews, national camp experiences, and a special photo journal.',
    issue: 'vol3',
    month: 'April',
    year: '2022',
    url: '',
    coverUrl: '',
    tags: ['10th Anniversary', 'Alumni', 'Special Edition'],
  },
]

const TAG_COLORS = [
  'border-gold-800 text-gold-400',
  'border-green-800 text-green-400',
  'border-sky-800 text-sky-400',
  'border-purple-800 text-purple-400',
]

export default function Magazine() {
  const [magazines, setMagazines] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    async function fetchMagazines() {
      try {
        const snap = await getDocs(query(collection(db, 'magazines'), orderBy('year', 'desc')))
        setMagazines(snap.empty
          ? DEMO_MAGAZINES
          : snap.docs.map(d => ({ id: d.id, ...d.data() }))
        )
      } catch {
        setMagazines(DEMO_MAGAZINES)
      } finally {
        setLoading(false)
      }
    }
    fetchMagazines()
  }, [])

  const filtered = (magazines || []).filter(m => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      m.title?.toLowerCase().includes(q) ||
      m.description?.toLowerCase().includes(q) ||
      m.year?.toString().includes(q) ||
      (m.tags || []).some(t => t.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="relative py-20 bg-army-900 overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-army-800 border-2 border-gold-500 mb-6">
            <BookOpen className="w-10 h-10 text-gold-400" />
          </div>
          <p className="section-subtitle">Publications</p>
          <h1 className="section-title text-4xl md:text-6xl mb-4">Magazine</h1>
          <div className="divider-gold w-24 mx-auto mt-3 mb-6" />
          <p className="text-army-300 font-body text-lg max-w-2xl mx-auto leading-relaxed">
            The voice of NCC TCET — annual magazines, newsletters, and special publications authored by our cadets.
          </p>
        </div>
      </section>

      {/* Search + Grid */}
      <section className="py-16 bg-military-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search */}
          <div className="relative mb-10 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-army-500" />
            <input
              type="text"
              placeholder="Search magazines…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 w-full"
            />
          </div>

          {loading ? (
            <div className="space-y-5">
              {[1,2,3].map(i => (
                <div key={i} className="card-army p-6 animate-pulse">
                  <div className="h-4 bg-army-700 w-1/2 mb-3" />
                  <div className="h-3 bg-army-800 w-3/4 mb-2" />
                  <div className="h-3 bg-army-800 w-2/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card-army p-16 text-center">
              <BookOpen className="w-12 h-12 text-army-700 mx-auto mb-4" />
              <p className="text-army-500 font-body text-sm">No publications found.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {filtered.map((mag, i) => (
                <div key={mag.id} className="card-army relative overflow-hidden group hover:bg-army-900 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gold-500/30 group-hover:bg-gold-500/60 transition-colors" />
                  <div className="p-6 flex gap-5">

                    {/* Cover placeholder */}
                    <div className="flex-shrink-0 w-20 bg-army-800 border border-army-700 flex flex-col items-center justify-center gap-1 hidden sm:flex">
                      {mag.coverUrl ? (
                        <img src={mag.coverUrl} alt={mag.title} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <FileText className="w-8 h-8 text-army-600" />
                          <p className="font-heading text-[9px] text-army-500 uppercase tracking-wider text-center px-1">
                            {mag.year}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="font-heading text-sm text-white uppercase tracking-wide mb-1">{mag.title}</h3>
                          <div className="flex items-center gap-2 text-army-500 font-body text-xs mb-3">
                            <Calendar className="w-3 h-3" />
                            <span>{mag.month} {mag.year}</span>
                            {mag.issue && <span className="text-army-700">·</span>}
                            {mag.issue && <span className="uppercase">{mag.issue}</span>}
                          </div>
                        </div>
                        {/* Download / View buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {mag.url ? (
                            <>
                              <a
                                href={mag.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 font-heading text-xs uppercase tracking-wider px-3 py-2 border border-gold-700 text-gold-400 hover:bg-gold-900/10 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" /> Download
                              </a>
                              <a
                                href={mag.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 font-heading text-xs uppercase tracking-wider px-3 py-2 border border-army-700 text-army-400 hover:text-army-200 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> View
                              </a>
                            </>
                          ) : (
                            <span className="font-heading text-xs text-army-600 uppercase tracking-wider border border-army-800 px-3 py-2">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-army-400 font-body text-xs leading-relaxed mb-4">{mag.description}</p>

                      {/* Tags */}
                      {(mag.tags || []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {mag.tags.map((tag, j) => (
                            <span key={j} className={`font-heading text-[10px] uppercase tracking-wider border px-2 py-0.5 ${TAG_COLORS[j % TAG_COLORS.length]}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contribute CTA */}
      <section className="py-14 bg-army-900 border-t border-army-800 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <BookOpen className="w-10 h-10 text-gold-500 mx-auto mb-4" />
          <h2 className="font-heading text-xl text-white uppercase tracking-widest mb-3">Write for Veer</h2>
          <p className="text-army-300 font-body text-sm mb-6 max-w-md mx-auto">
            Cadets are invited to contribute articles, poems, camp reports, and artwork to the NCC TCET annual magazine. Contact the editorial team at the NCC office.
          </p>
          <a
            href="mailto:ncc@tcetmumbai.in"
            className="btn-secondary inline-flex items-center gap-2 text-sm"
          >
            <FileText className="w-4 h-4" /> Submit Your Work
          </a>
        </div>
      </section>
    </div>
  )
}

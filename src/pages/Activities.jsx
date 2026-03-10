import { useState } from 'react'
import { Shield, Crosshair, Mountain, Heart, Music2, BookOpen, Bike, Flame, Target, ChevronRight, Filter } from 'lucide-react'

const ACTIVITIES = [
  {
    category: 'Training',
    title: 'Drill & Parade',
    icon: Shield,
    color: 'text-green-400 border-green-800 bg-green-900/10',
    description: 'Precision parade and drill ground training held every Tuesday and Thursday. Cadets learn formations, march discipline, and military bearing that builds confidence and coordination.',
    highlights: ['Weekly drill sessions', 'Republic Day contingent selection', 'ANO Inspection parades', 'Inter-unit drill competition'],
  },
  {
    category: 'Training',
    title: 'Weapon Training',
    icon: Crosshair,
    color: 'text-red-400 border-red-800 bg-red-900/10',
    description: '.22 rifle firing on the indoor range and .303 on camp ranges. Cadets gain proficiency in weapon handling, safety procedures, aiming, and firing techniques.',
    highlights: ['Indoor .22 range sessions', 'Firing Camp at Service Range', 'National shooting selections', 'B & C certificate firing tests'],
  },
  {
    category: 'Adventure',
    title: 'Trekking & Mountaineering',
    icon: Mountain,
    color: 'text-sky-400 border-sky-800 bg-sky-900/10',
    description: 'Annual trekking expeditions organised to the Sahyadri ranges, Rajmachi, and Harishchandragad. Building physical endurance, teamwork, and a spirit of adventure.',
    highlights: ['Annual monsoon trek', 'Himalayan mountaineering camp', 'Rock climbing workshops', 'Sahyadri night treks'],
  },
  {
    category: 'Social',
    title: 'Community Service',
    icon: Heart,
    color: 'text-pink-400 border-pink-800 bg-pink-900/10',
    description: 'NCC cadets lead social welfare drives — blood donation camps, cleanliness drives (Swachh Bharat), tree plantation, and awareness campaigns in local communities.',
    highlights: ['Blood donation drives', 'Village adoption program', 'Swachh Bharat campaigns', 'Disaster relief volunteer'],
  },
  {
    category: 'Cultural',
    title: 'Cultural Programmes',
    icon: Music2,
    color: 'text-purple-400 border-purple-800 bg-purple-900/10',
    description: 'Cadets participate in national integration camps, cultural evenings, and inter-directorate competitions showcasing India\'s rich diversity through dance, music, and drama.',
    highlights: ['National Integration Camps', 'NCC Day celebrations', 'Independence Day events', 'Inter-unit cultural meet'],
  },
  {
    category: 'Academic',
    title: 'NCC Syllabus & Exams',
    icon: BookOpen,
    color: 'text-gold-400 border-gold-800 bg-gold-900/10',
    description: 'Structured theoretical syllabus covering military history, maps, first aid, disaster management, and leadership to prepare cadets for B & C certificate examinations.',
    highlights: ['Theory classes twice a week', 'B Certificate exam', 'C Certificate exam', 'Subject-wise coaching camps'],
  },
  {
    category: 'Adventure',
    title: 'Cycling Expeditions',
    icon: Bike,
    color: 'text-orange-400 border-orange-800 bg-orange-900/10',
    description: 'Long-distance cycling rallies promoting fitness, environmental awareness, and the spirit of adventure. Cadets have covered routes across Maharashtra.',
    highlights: ['Mumbai–Pune cycling rally', 'Green cycling campaign', 'Endurance certificate rides', 'Coastal cycling expeditions'],
  },
  {
    category: 'Training',
    title: 'Camp Training',
    icon: Flame,
    color: 'text-amber-400 border-amber-800 bg-amber-900/10',
    description: 'Annual Training Camps (ATC), Combined Annual Training Camps (CATC), and special camps at NCC training institutes across India for rigorous field training.',
    highlights: ['Annual Training Camp (ATC)', 'Republic Day Camp (RDC)', 'Thal Sainik Camp (TSC)', 'Air Wing Flying camps'],
  },
  {
    category: 'Social',
    title: 'Yoga & Physical Training',
    icon: Target,
    color: 'text-teal-400 border-teal-800 bg-teal-900/10',
    description: 'Daily PT sessions including yoga, cross-training, and fitness drills to meet NCC physical standards and maintain peak operational readiness.',
    highlights: ['Morning PT schedule', 'Yoga on International Yoga Day', 'Cross-fit sessions', 'Physical fitness tests'],
  },
]

const CATEGORIES = ['All', 'Training', 'Adventure', 'Social', 'Cultural', 'Academic']

export default function Activities() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? ACTIVITIES : ACTIVITIES.filter(a => a.category === filter)

  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="relative py-20 bg-army-900 overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-army-800 border-2 border-gold-500 mb-6">
            <Flame className="w-10 h-10 text-gold-400" />
          </div>
          <p className="section-subtitle text-gold-400">What We Do</p>
          <h1 className="section-title text-4xl md:text-6xl mb-4 text-white">Activities</h1>
          <div className="divider-gold w-24 mx-auto mt-3 mb-6" />
          <p className="text-gray-300 font-body text-lg max-w-2xl mx-auto leading-relaxed">
            From weapons to community service — NCC TCET trains, challenges, and inspires cadets across every domain.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Activities', value: '9+' },
              { label: 'Training Days/Year', value: '80+' },
              { label: 'Camps Annually', value: '6+' },
              { label: 'Community Drives', value: '12+' },
            ].map((s, i) => (
              <div key={i}>
                <p className="font-heading text-2xl text-gold-600">{s.value}</p>
                <p className="text-gray-500 font-body text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category filter */}
          <div className="flex items-center gap-3 flex-wrap mb-10">
            <Filter className="w-4 h-4 text-gray-400" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-heading text-xs uppercase tracking-wider px-3.5 py-2 border transition-all duration-150 rounded-sm ${
                  filter === cat
                    ? 'border-army-600 text-army-700 bg-army-50'
                    : 'border-gray-300 text-gray-600 hover:text-army-700 hover:border-army-400 bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((activity, i) => {
              const Icon = activity.icon
              return (
                <div key={i} className="card-army relative overflow-hidden group transition-colors">
                  <div className={`absolute top-0 left-0 w-full h-1 ${activity.color.split(' ').find(c => c.startsWith('bg-'))} group-hover:h-1.5 transition-all`} />
                  <div className="p-6">
                    <div className={`inline-flex items-center gap-2 border px-2.5 py-1 text-xs font-heading uppercase tracking-wider mb-4 ${activity.color}`}>
                      <Icon className="w-3.5 h-3.5" /> {activity.category}
                    </div>
                    <h3 className="font-heading text-sm text-gray-900 uppercase tracking-wide mb-3">{activity.title}</h3>
                    <p className="text-gray-500 font-body text-xs leading-relaxed mb-5">{activity.description}</p>
                    <div className="space-y-2">
                      {activity.highlights.map((h, j) => (
                        <div key={j} className="flex items-center gap-2 text-gray-500">
                          <ChevronRight className="w-3 h-3 text-gold-600 flex-shrink-0" />
                          <span className="font-body text-xs">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-army-900 border-t border-army-700 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Shield className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h2 className="font-heading text-2xl text-white uppercase tracking-widest mb-3">Ready to Join?</h2>
          <p className="text-gray-300 font-body mb-6">Enroll in NCC TCET and be part of all these activities and more.</p>
          <a href="/ncc-tcet/join" className="btn-primary inline-flex items-center gap-2">
            <ChevronRight className="w-4 h-4" /> Apply Now
          </a>
        </div>
      </section>
    </div>
  )
}

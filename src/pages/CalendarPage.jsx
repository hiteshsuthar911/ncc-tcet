import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, X } from 'lucide-react'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function formatDate(ts) {
  if (!ts) return ''
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function CalendarPage() {
  const today = new Date()
  const [displayDate, setDisplayDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null) // selected day events popup

  useEffect(() => {
    async function fetchEvents() {
      try {
        const snap = await getDocs(collection(db, 'events'))
        setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch { /* ignore */ } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  function prevMonth() {
    setDisplayDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
    setSelected(null)
  }
  function nextMonth() {
    setDisplayDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
    setSelected(null)
  }

  const year  = displayDate.getFullYear()
  const month = displayDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth     = new Date(year, month + 1, 0).getDate()

  // Build calendar cells (null = blank, number = day)
  const cells = []
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  // Map events by day string "YYYY-MM-DD"
  const eventsByDay = {}
  events.forEach(e => {
    if (!e.date) return
    const d = e.date.seconds ? new Date(e.date.seconds * 1000) : new Date(e.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate()
      if (!eventsByDay[key]) eventsByDay[key] = []
      eventsByDay[key].push(e)
    }
  })

  // Upcoming events (future, sorted)
  const now = Date.now()
  const upcoming = events
    .filter(e => {
      if (!e.date) return false
      const d = e.date.seconds ? new Date(e.date.seconds * 1000) : new Date(e.date)
      return d >= now
    })
    .sort((a, b) => {
      const aS = a.date?.seconds ?? 0
      const bS = b.date?.seconds ?? 0
      return aS - bS
    })
    .slice(0, 8)

  const isToday = (day) =>
    day && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="relative py-20 bg-army-900 overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-army-800 border-2 border-gold-500 mb-6">
            <Calendar className="w-10 h-10 text-gold-400" />
          </div>
          <p className="section-subtitle">Schedule</p>
          <h1 className="section-title text-4xl md:text-6xl mb-4">NCC Calendar</h1>
          <div className="divider-gold w-24 mx-auto mt-3 mb-6" />
          <p className="text-army-300 font-body text-lg max-w-2xl mx-auto">
            Events, training sessions, camps, and important dates throughout the academic year.
          </p>
        </div>
      </section>

      {/* Calendar + Upcoming */}
      <section className="py-16 bg-military-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Month Calendar */}
            <div className="lg:col-span-2 card-army overflow-hidden">
              {/* Month nav */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-army-800">
                <button onClick={prevMonth} className="text-army-400 hover:text-gold-400 transition-colors p-1">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="font-heading text-sm text-white uppercase tracking-widest">
                  {MONTH_NAMES[month]} {year}
                </h2>
                <button onClick={nextMonth} className="text-army-400 hover:text-gold-400 transition-colors p-1">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-army-800">
                {DAY_NAMES.map(d => (
                  <div key={d} className="py-3 text-center font-heading text-xs text-army-500 uppercase tracking-wider">
                    {d}
                  </div>
                ))}
              </div>

              {/* Cells */}
              <div className="grid grid-cols-7">
                {cells.map((day, i) => {
                  const dayEvents = day ? (eventsByDay[day] || []) : []
                  const today_ = isToday(day)
                  return (
                    <div
                      key={i}
                      onClick={() => day && dayEvents.length > 0 && setSelected({ day, events: dayEvents })}
                      className={`min-h-[60px] border-b border-r border-army-800/50 p-1.5 text-right transition-colors ${
                        day ? 'cursor-default' : ''
                      } ${dayEvents.length > 0 ? 'cursor-pointer hover:bg-army-900' : ''}`}
                    >
                      {day && (
                        <>
                          <span className={`inline-flex items-center justify-center w-6 h-6 font-heading text-xs ${
                            today_
                              ? 'bg-gold-500 text-black font-bold'
                              : 'text-army-300'
                          }`}>
                            {day}
                          </span>
                          {dayEvents.length > 0 && (
                            <div className="flex flex-wrap gap-0.5 mt-1 justify-end">
                              {dayEvents.slice(0, 2).map((e, j) => (
                                <div key={j} className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                              ))}
                              {dayEvents.length > 2 && <span className="text-[8px] text-gold-500">+{dayEvents.length - 2}</span>}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="px-6 py-3 border-t border-army-800 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                  <span className="text-army-500 font-body text-xs">Event on this day</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-gold-500 flex items-center justify-center">
                    <span className="text-[10px] font-heading text-black">T</span>
                  </div>
                  <span className="text-army-500 font-body text-xs">Today</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="card-army overflow-hidden">
              <div className="px-5 py-4 border-b border-army-800">
                <h3 className="font-heading text-xs text-white uppercase tracking-widest">Upcoming Events</h3>
              </div>
              {loading ? (
                <div className="p-5 space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-3 bg-army-700 w-1/2 mb-2" />
                      <div className="h-2 bg-army-800 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : upcoming.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-8 h-8 text-army-700 mx-auto mb-3" />
                  <p className="text-army-500 font-body text-xs">No upcoming events</p>
                </div>
              ) : (
                <div className="divide-y divide-army-800/60">
                  {upcoming.map((e, i) => {
                    const d = e.date?.seconds ? new Date(e.date.seconds * 1000) : new Date(e.date)
                    return (
                      <div key={i} className="px-5 py-4 hover:bg-army-900 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="text-center flex-shrink-0 w-10">
                            <p className="font-heading text-lg text-gold-400 leading-none">{d.getDate()}</p>
                            <p className="text-army-500 font-body text-[10px] uppercase">{MONTH_NAMES[d.getMonth()].slice(0,3)}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading text-xs text-gray-900 uppercase tracking-wide truncate">{e.title}</p>
                            {e.venue && (
                              <p className="flex items-center gap-1 text-army-500 text-xs mt-1">
                                <MapPin className="w-2.5 h-2.5" /> {e.venue}
                              </p>
                            )}
                            {e.time && (
                              <p className="flex items-center gap-1 text-army-500 text-xs mt-0.5">
                                <Clock className="w-2.5 h-2.5" /> {e.time}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Day Events Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="card-army w-full max-w-sm relative">
            <div className="absolute inset-0 pointer-events-none border border-gold-500/20" />
            <div className="flex items-center justify-between px-5 py-4 border-b border-army-800">
              <h3 className="font-heading text-xs text-white uppercase tracking-widest">
                {selected.day} {MONTH_NAMES[month]} {year}
              </h3>
              <button onClick={() => setSelected(null)} className="text-army-500 hover:text-army-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-80 overflow-y-auto">
              {selected.events.map((e, i) => (
                <div key={i} className="border-l-2 border-gold-500 pl-3">
                  <p className="font-heading text-xs text-gray-900 uppercase tracking-wide">{e.title}</p>
                  {e.description && <p className="text-army-400 font-body text-xs mt-1 leading-relaxed">{e.description}</p>}
                  {e.venue && <p className="flex items-center gap-1 text-army-500 text-xs mt-1"><MapPin className="w-2.5 h-2.5" />{e.venue}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

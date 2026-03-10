import { useEffect, useState } from 'react'
import { collection, getDocs, setDoc, getDoc, doc, serverTimestamp, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  Lock,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function CadetPolls() {
  const { currentUser, userProfile } = useAuth()
  const [polls, setPolls] = useState([])
  const [myResponses, setMyResponses] = useState({}) // { pollId: 'coming' | 'not_coming' }
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState({}) // { pollId: true }

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, 'polls'))
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        // Show open + closed (not converted) sorted by date desc
        const visible = all
          .filter(p => p.status !== 'converted')
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
        setPolls(visible)

        // Load my responses
        if (currentUser) {
          const uid = currentUser.uid
          const respMap = {}
          await Promise.all(
            all.map(async p => {
              const respDoc = await getDoc(doc(db, 'pollResponses', `${p.id}_${uid}`))
              if (respDoc.exists()) {
                respMap[p.id] = respDoc.data().response
              }
            })
          )
          setMyResponses(respMap)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentUser])

  async function respond(poll, response) {
    if (!currentUser) return toast.error('Please log in to respond.')
    if (poll.status !== 'open') return toast.error('This poll is closed.')
    setSubmitting(p => ({ ...p, [poll.id]: true }))
    try {
      await setDoc(doc(db, 'pollResponses', `${poll.id}_${currentUser.uid}`), {
        pollId: poll.id,
        uid: currentUser.uid,
        regimentalNo: userProfile?.regimentalNo || '',
        name: userProfile?.name || '',
        wing: userProfile?.wing || '',
        rank: userProfile?.rank || 'Cadet',
        response,
        respondedAt: serverTimestamp(),
      })
      setMyResponses(p => ({ ...p, [poll.id]: response }))
      toast.success(response === 'coming' ? "Marked as Coming ✓" : "Marked as Not Coming")
    } catch {
      toast.error('Failed to save response. Try again.')
    } finally {
      setSubmitting(p => ({ ...p, [poll.id]: false }))
    }
  }

  const fmt = (d) => d
    ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-military-dark py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="section-subtitle">Cadet Portal</p>
          <h1 className="font-heading text-3xl text-gray-900 uppercase tracking-widest">Session Polls</h1>
          <div className="h-px w-16 bg-gold-500 mt-2 mb-3" />
          <p className="font-body text-army-400 text-sm">
            Mark your availability for upcoming NCC sessions. Your response helps the admin prepare attendance in advance.
          </p>
        </div>

        {!currentUser && (
          <div className="card-army p-8 text-center mb-6">
            <Lock className="w-10 h-10 text-army-600 mx-auto mb-3" />
            <p className="text-army-400 font-body mb-4">You must be logged in to respond to polls.</p>
            <Link to="/login" className="btn-primary inline-flex items-center gap-2 text-sm">
              Login <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-40 bg-army-900 animate-pulse" />)}
          </div>
        ) : polls.length === 0 ? (
          <div className="card-army p-12 text-center">
            <ClipboardCheck className="w-12 h-12 text-army-700 mx-auto mb-3" />
            <p className="text-army-400 font-heading uppercase tracking-wider">No active polls right now.</p>
            <p className="text-army-600 text-sm font-body mt-2">Check back when the admin creates a new session poll.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {polls.map(poll => {
              const myResp = myResponses[poll.id]
              const isClosed = poll.status !== 'open'
              const isSubmitting = submitting[poll.id]

              return (
                <div key={poll.id} className={`card-army overflow-hidden ${isClosed ? 'opacity-70' : ''}`}>
                  {/* Gold top bar */}
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

                  <div className="p-5">
                    {/* Title + status */}
                    <div className="flex flex-wrap items-start gap-3 mb-3">
                      <h2 className="font-heading text-white uppercase tracking-wide text-base flex-1">{poll.title}</h2>
                      {isClosed ? (
                        <span className="flex items-center gap-1 text-army-500 font-heading text-xs uppercase tracking-wider border border-army-700 px-2 py-0.5">
                          <Lock className="w-3 h-3" /> Closed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-400 font-heading text-xs uppercase tracking-wider border border-green-800 px-2 py-0.5 bg-green-900/20">
                          Open
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-4 text-xs font-body text-army-400 mb-3">
                      {poll.date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gold-500" />
                          {fmt(poll.date)}
                        </span>
                      )}
                      {poll.time && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gold-500" />
                          {poll.time}
                        </span>
                      )}
                      {poll.venue && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gold-500" />
                          {poll.venue}
                        </span>
                      )}
                    </div>

                    {poll.description && (
                      <p className="text-army-400 text-sm font-body leading-relaxed mb-4">{poll.description}</p>
                    )}

                    {/* Current response display */}
                    {myResp && (
                      <div className={`flex items-center gap-2 text-sm font-body mb-4 px-3 py-2 border ${
                        myResp === 'coming'
                          ? 'text-green-400 border-green-800 bg-green-900/20'
                          : 'text-red-400 border-red-900 bg-red-900/10'
                      }`}>
                        {myResp === 'coming'
                          ? <><CheckCircle className="w-4 h-4" /> Your response: <strong>I'm Coming</strong></>
                          : <><XCircle className="w-4 h-4" /> Your response: <strong>Not Coming</strong></>
                        }
                        {!isClosed && (
                          <span className="ml-auto text-army-500 text-xs">Click below to change</span>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    {!isClosed && currentUser && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => respond(poll, 'coming')}
                          disabled={isSubmitting}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 font-heading text-sm uppercase tracking-wider border transition-all duration-200 disabled:opacity-50 ${
                            myResp === 'coming'
                              ? 'bg-green-700 border-green-600 text-white'
                              : 'border-green-800 text-green-400 hover:bg-green-900/40'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" /> I'm Coming
                        </button>
                        <button
                          onClick={() => respond(poll, 'not_coming')}
                          disabled={isSubmitting}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 font-heading text-sm uppercase tracking-wider border transition-all duration-200 disabled:opacity-50 ${
                            myResp === 'not_coming'
                              ? 'bg-red-900 border-red-700 text-white'
                              : 'border-army-700 text-army-400 hover:border-red-800 hover:text-red-400'
                          }`}
                        >
                          <XCircle className="w-4 h-4" /> Not Coming
                        </button>
                      </div>
                    )}

                    {isClosed && (
                      <div className="text-center py-2 text-army-500 text-xs font-body">
                        This poll is closed. Responses are no longer accepted.
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

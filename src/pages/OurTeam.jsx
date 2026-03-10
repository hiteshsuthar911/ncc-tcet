import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Shield, Users, Star, Mail, Phone, UserCircle, Award } from 'lucide-react'

const PLACEHOLDER_TEAM = [
  {
    name: 'Lt Col Rajesh Sharma',
    designation: 'Associate NCC Officer (ANO)',
    wing: 'Army Wing',
    department: 'Mechanical Engineering',
    email: 'ano@tcetmumbai.in',
    phone: '+91 98765 00001',
    bio: 'Commanding Officer of NCC TCET Unit. Over 15 years of service guiding cadets towards excellence.',
    order: 1,
    type: 'officer',
  },
  {
    name: 'Sub Maj (Retd.) Pradeep Kamble',
    designation: 'PI Staff',
    wing: 'Army Wing',
    department: 'NCC Office',
    email: '',
    phone: '',
    bio: 'Permanent Instructor responsible for drill, training schedules and cadet welfare.',
    order: 2,
    type: 'officer',
  },
]

const CADET_LEADERS = [
  { name: 'Senior Under Officer Priya Mehta',   rank: 'SUO',  role: 'Battalion Commander',    wing: 'Army' },
  { name: 'Under Officer Rohan Gupta',           rank: 'UO',   role: 'Company Commander (A)',  wing: 'Army' },
  { name: 'Under Officer Sneha Patil',           rank: 'UO',   role: 'Company Commander (B)',  wing: 'Navy' },
  { name: 'Cadet Captain Farhan Khan',           rank: 'CC',   role: 'Quartermaster',           wing: 'Army' },
  { name: 'Cadet Captain Anjali Desai',          rank: 'CC',   role: 'Training In-charge',      wing: 'Air'  },
  { name: 'Cadet Captain Yash Narayan',          rank: 'CC',   role: 'Discipline NCO',          wing: 'Army' },
]

const WING_COLOR = {
  Army: 'text-green-400 border-green-800 bg-green-900/10',
  Navy: 'text-blue-400 border-blue-800 bg-blue-900/10',
  Air:  'text-sky-400 border-sky-800 bg-sky-900/10',
}

export default function OurTeam() {
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTeam() {
      try {
        const snap = await getDocs(query(collection(db, 'team'), orderBy('order')))
        if (!snap.empty) {
          setTeam(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        } else {
          setTeam(PLACEHOLDER_TEAM)
        }
      } catch {
        setTeam(PLACEHOLDER_TEAM)
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  const officers = (team || []).filter(m => m.type === 'officer' || m.type === 'staff')
  const leaders  = (team || []).filter(m => m.type === 'leader')

  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="relative py-20 bg-army-900 overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-army-800 border-2 border-gold-500 mb-6">
            <Users className="w-10 h-10 text-gold-400" />
          </div>
          <p className="section-subtitle text-gold-400">Meet the People</p>
          <h1 className="section-title text-4xl md:text-6xl mb-4 text-white">Our Team</h1>
          <div className="divider-gold w-24 mx-auto mt-3 mb-6" />
          <p className="text-gray-300 font-body text-lg max-w-2xl mx-auto leading-relaxed">
            The officers, instructors, and cadet leaders who make NCC TCET one of the finest units in Maharashtra.
          </p>
        </div>
      </section>

      {/* Officers & PI Staff */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Command</p>
            <h2 className="section-title text-3xl">Officers & PI Staff</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="card-army p-6 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-gray-200 w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-gray-100 w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-8">
              {officers.map((member, i) => (
                <div key={i} className="card-army relative overflow-hidden p-6 text-center group transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
                  <div className="w-24 h-24 border-2 border-gold-400 overflow-hidden flex items-center justify-center mx-auto mb-4 rounded-full bg-gray-100">
                    {member.photoUrl
                      ? <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                      : <UserCircle className="w-14 h-14 text-army-400" />}
                  </div>
                  <h3 className="font-heading text-sm text-gray-900 uppercase tracking-widest mb-1">{member.name}</h3>
                  <p className="text-gold-600 font-body text-xs mb-1">{member.designation}</p>
                  <p className="text-gray-500 font-body text-xs mb-4">{member.wing} · {member.department}</p>
                  {member.bio && (
                    <p className="text-gray-600 font-body text-xs leading-relaxed mb-4 max-w-xs mx-auto">{member.bio}</p>
                  )}
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 text-gray-500 hover:text-army-700 font-body text-xs transition-colors">
                        <Mail className="w-3.5 h-3.5" /> {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="flex items-center gap-1.5 text-gray-500 hover:text-army-700 font-body text-xs transition-colors">
                        <Phone className="w-3.5 h-3.5" /> {member.phone}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cadet Leaders */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Leadership</p>
            <h2 className="section-title text-3xl">Cadet Leadership</h2>
            <div className="divider-gold w-20 mx-auto mt-3" />
            <p className="text-gray-500 font-body text-sm mt-4">
              Senior cadets who lead by example, coordinating training, welfare, and discipline.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(leaders.length > 0 ? leaders : CADET_LEADERS).map((leader, i) => (
              <div key={i} className="card-army p-5 group transition-colors">
                {/* Photo if available */}
                {leader.photoUrl && (
                  <div className="w-12 h-12 border border-army-600 overflow-hidden bg-army-800 mb-3 mx-auto">
                    <img src={leader.photoUrl} alt={leader.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-heading uppercase tracking-wider mb-3 ${WING_COLOR[leader.wing] ?? WING_COLOR.Army}`}>
                  <Shield className="w-3 h-3" /> {leader.wing} Wing
                </div>
                <p className="font-heading text-xs text-gray-900 uppercase tracking-wide mb-0.5">{leader.name}</p>
                <p className="text-gold-600 font-body text-xs mb-1">{leader.role}</p>
                <div className="h-px bg-gray-100 my-3" />
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-army-50 border border-army-200 rounded-sm">
                  <Award className="w-3 h-3 text-army-600" />
                  <span className="font-heading text-xs text-army-700">{leader.rank}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unit Structure */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subtitle">Organisation</p>
          <h2 className="section-title text-3xl mb-10">Unit Structure</h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-xl mx-auto">
            {[
              { wing: 'Army Wing', color: 'border-green-600 text-green-700', bg: 'bg-green-50' },
              { wing: 'Naval Wing', color: 'border-blue-600 text-blue-700',  bg: 'bg-blue-50'  },
              { wing: 'Air Wing',   color: 'border-sky-600 text-sky-700',    bg: 'bg-sky-50'   },
            ].map(w => (
              <div key={w.wing} className={`card-army ${w.bg} border ${w.color.split(' ')[0]} p-6 text-center`}>
                <Shield className={`w-8 h-8 mx-auto mb-3 ${w.color.split(' ')[1]}`} />
                <p className={`font-heading text-xs uppercase tracking-widest ${w.color.split(' ')[1]}`}>{w.wing}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

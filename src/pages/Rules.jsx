import { useState } from 'react'
import { BookOpen, Shield, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'

const sections = [
  {
    id: 'general',
    title: 'General Rules & Conduct',
    rules: [
      'Every cadet shall be loyal to the nation and uphold the dignity of the NCC.',
      'Cadets must display exemplary behaviour both inside and outside the college campus.',
      'Consumption of alcohol, tobacco, or any controlled substance is strictly prohibited.',
      'Involvement in any political activity, demonstrations, or strikes is forbidden.',
      'Cadets shall not indulge in ragging, bullying, eve-teasing, or any form of harassment.',
      'Any act of indiscipline, insubordination, or disobedience will invite strict action including dismissal.',
      'Cadets shall treat seniors, peers, and juniors with respect and dignity at all times.',
      'Use of social media to defame NCC, fellow cadets, or officers is a punishable offence.',
    ],
  },
  {
    id: 'uniform',
    title: 'Uniform & Dress Code',
    rules: [
      'The NCC uniform shall be worn correctly and kept in a clean, neat, and well-ironed condition.',
      'Shoes must be polished to a mirror finish before every parade or official function.',
      'The cap/beret shall be worn at all times when in uniform outside the college.',
      'Wearing of the NCC uniform at private parties, cinema halls, or social events is prohibited.',
      'No jewellery (including ear rings for male cadets) is permitted while in uniform.',
      'Hair shall be neatly trimmed; male cadets must not have hair touching the collar or ears.',
      'Female cadets must tie hair in a neat bun; no coloured hair is permitted in uniform.',
      'Cadets shall never appear in a partially-uniformed state in public.',
      'The NCC badge and insignia shall be worn exactly as prescribed in dress regulations.',
    ],
  },
  {
    id: 'attendance',
    title: 'Attendance & Training',
    rules: [
      'Minimum 75% attendance in NCC training is mandatory to appear in proficiency exams.',
      'Absence from parade/training without prior written permission will be marked as absent.',
      'Three consecutive absences without notice may result in initiation of removal proceedings.',
      'Cadets must report to the parade ground at least 5 minutes before the scheduled time.',
      'Late arrivals (more than 10 minutes) will be marked absent for that parade.',
      'Cadets selected for camps must participate; declining without valid reason is a serious offence.',
      'Leave applications must be submitted in writing to the ANO at least 48 hours in advance.',
      'Medical leave requires a certificate from a registered doctor submitted within 48 hours of return.',
    ],
  },
  {
    id: 'camps',
    title: 'Camps & Activities',
    rules: [
      'Cadets attending camps must carry all specified kit items; incomplete kit may disqualify participation.',
      'Ragging in any form during camps is absolutely prohibited and is a criminal offence.',
      'Cadets must follow orders of camp commandant and conducting officers without question.',
      'Mobile phones should be used only during designated periods; photography in restricted areas is banned.',
      'Cadets are not permitted to leave camp limits without written permission from the commandant.',
      'Any injury or medical emergency must be reported immediately to the medical officer.',
      'Damage to government or institutional property during camps must be compensated by the cadet.',
      'Cadets are responsible for safe-keeping of equipment issued to them during camps.',
    ],
  },
  {
    id: 'arms',
    title: 'Arms & Ammunition',
    rules: [
      'Handling of arms and ammunition is permitted only under direct supervision of authorised instructors.',
      'Weapons must be inspected and cleared before signing out from the armoury.',
      'Never point a weapon at any person — whether loaded or unloaded.',
      'Cadets must not carry weapons outside designated training areas without written authority.',
      'Any defect or malfunction in a weapon must be reported immediately to the instructor.',
      'Unauthorized purchase, possession, or use of any weapon is a criminal offence.',
      'Armoury duty cadets are fully responsible for security and accounting of all arms.',
    ],
  },
  {
    id: 'social',
    title: 'Social & Community Service',
    rules: [
      'Cadets selected for community service activities must participate with full commitment.',
      'During flood relief or disaster response, cadets must follow civil authority directives.',
      'Cadets representing NCC at external events are ambassadors of the corps and must conduct accordingly.',
      'Acceptance of monetary gifts or remuneration for NCC community service is prohibited.',
      'Cadets shall collaborate with police, NDRF, or civil agencies only under officer command.',
    ],
  },
  {
    id: 'dismissal',
    title: 'Grounds for Dismissal',
    rules: [
      'Failure to maintain the minimum attendance prescribed by DG NCC.',
      'Persistent indiscipline after formal warnings recorded in personal file.',
      'Conviction in a criminal court for any offence.',
      'Involvement in ragging — as per UGC Anti-Ragging guidelines 2009.',
      'Forging documents, medical certificates, or impersonating another cadet.',
      'Misuse of NCC uniform, badge, or identity card for personal gain.',
      'Disobeying a lawful order given by a commissioned or JCO of the NCC.',
    ],
  },
]

function RuleSection({ section }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card-army overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-army-900 transition-colors group text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gold-500" />
          <span className="font-heading text-sm text-white uppercase tracking-widest group-hover:text-gold-400 transition-colors">
            {section.title}
          </span>
          <span className="text-army-600 font-body text-xs">({section.rules.length} rules)</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gold-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-army-500 flex-shrink-0" />}
      </button>
      {open && (
        <div className="border-t border-army-800 px-6 py-5">
          <ol className="space-y-3">
            {section.rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-heading text-gold-600 text-xs flex-shrink-0 mt-0.5 w-5">
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <p className="text-army-300 font-body text-sm leading-relaxed">{rule}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default function Rules() {
  const [allOpen, setAllOpen] = useState(false)

  return (
    <div className="min-h-screen pt-20">

      {/* Header */}
      <section className="relative py-16 bg-military-darker overflow-hidden">
        <div className="absolute inset-0 bg-camo-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-subtitle">Regulations</p>
          <h1 className="section-title text-4xl md:text-5xl mb-2">Rules & Regulations</h1>
          <div className="divider-gold w-24 mt-3 mb-4" />
          <p className="text-army-300 font-body max-w-2xl leading-relaxed">
            All cadets enrolled in the NCC TCET unit are bound by the following rules and regulations as prescribed by the Directorate General NCC and the unit's Standing Orders.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Warning banner */}
        <div className="flex items-start gap-4 border border-yellow-700/50 bg-yellow-900/10 p-5 mb-8">
          <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-heading text-yellow-400 text-sm uppercase tracking-wide mb-1">Important Notice</p>
            <p className="text-yellow-300/80 font-body text-sm leading-relaxed">
              Ignorance of rules is not an excuse. Every cadet is expected to read, understand, and follow these regulations from the day of enrollment. Violations will be dealt with as per DG NCC orders.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-army-400 font-body text-sm">{sections.length} sections • {sections.reduce((a, s) => a + s.rules.length, 0)} rules</p>
          <button
            onClick={() => setAllOpen(!allOpen)}
            className="btn-secondary text-xs py-2"
          >
            {allOpen ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((s) => (
            <ExpandableSection key={s.id} section={s} forceOpen={allOpen} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 card-army p-6 flex items-start gap-4">
          <BookOpen className="w-6 h-6 text-gold-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-heading text-sm text-white uppercase tracking-wide mb-1">Official Reference</p>
            <p className="text-army-400 font-body text-sm leading-relaxed">
              These rules are based on the NCC Act 1948, NCC Rules 1948 (amended), DG NCC Training Instructions, and TCET Unit Standing Orders. For the complete gazette-notified regulations, refer to the NCC Cadet's Handbook issued at enrollment.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

// Controlled expandable version that respects forceOpen
function ExpandableSection({ section, forceOpen }) {
  const [localOpen, setLocalOpen] = useState(false)
  const isOpen = forceOpen || localOpen

  return (
    <div className="card-army overflow-hidden">
      <button
        onClick={() => setLocalOpen(!localOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-army-900 transition-colors group text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gold-500" />
          <span className="font-heading text-sm text-white uppercase tracking-widest group-hover:text-gold-400 transition-colors">
            {section.title}
          </span>
          <span className="text-army-600 font-body text-xs">({section.rules.length})</span>
        </div>
        {isOpen
          ? <ChevronUp className="w-4 h-4 text-gold-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-army-500 flex-shrink-0" />}
      </button>
      {isOpen && (
        <div className="border-t border-army-800 px-6 py-5">
          <ol className="space-y-3">
            {section.rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-heading text-gold-600 text-xs flex-shrink-0 mt-0.5 w-5">
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <p className="text-army-300 font-body text-sm leading-relaxed">{rule}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

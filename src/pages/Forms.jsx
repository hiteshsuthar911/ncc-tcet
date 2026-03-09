import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import {
  Printer, FileText, ChevronRight, ArrowLeft,
  ClipboardList, Users, Tent, Shuffle,
} from 'lucide-react'

// ── Small helper: underlined blank or bold value ─────────────────────────────
function Val({ v, width = '120px' }) {
  if (v) return <strong>{v}</strong>
  return (
    <span
      style={{
        display: 'inline-block',
        minWidth: width,
        borderBottom: '1px solid #555',
        verticalAlign: 'bottom',
      }}
    />
  )
}

// ── Letterhead shared across all forms ────────────────────────────────────────
function Letterhead({ subtitle }) {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  return (
    <>
      <div className="pf-letterhead">
        <div className="pf-org-text">
          <span className="pf-org-main">National Cadet Corps</span>
          <span className="pf-org-sub">Thakur College of Engineering &amp; Technology, Mumbai</span>
          <span className="pf-org-addr">Kandivali (East), Mumbai – 400 101 &nbsp;|&nbsp; Maharashtra Directorate</span>
        </div>
      </div>
      <div className="pf-title-bar">{subtitle}</div>
      <div className="pf-ref-row">
        <span>Date: {today}</span>
        <span>Unit: 1 MH TECH BN NCC</span>
        <span>Ref No.: _____________</span>
      </div>
    </>
  )
}

// ── Form 1: Leave Application ─────────────────────────────────────────────────
function LeaveApplicationPrint({ d }) {
  return (
    <div id="print-form" className="pf-page">
      <Letterhead subtitle="Application for Leave / Absence — NCC" />

      <div className="pf-sec-hdr">Part I — Cadet Details</div>
      <table className="pf-table">
        <tbody>
          <tr>
            <td className="pf-lbl" style={{ width: '30%' }}>Full Name</td>
            <td className="pf-val"><Val v={d.name} /></td>
            <td className="pf-lbl" style={{ width: '22%' }}>Regimental No.</td>
            <td className="pf-val"><Val v={d.regimentalNo} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Rank</td>
            <td className="pf-val"><Val v={d.rank} /></td>
            <td className="pf-lbl">Wing</td>
            <td className="pf-val"><Val v={d.wing} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Department</td>
            <td className="pf-val"><Val v={d.department} /></td>
            <td className="pf-lbl">Year</td>
            <td className="pf-val"><Val v={d.year} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Phone</td>
            <td className="pf-val"><Val v={d.phone} /></td>
            <td className="pf-lbl">Email</td>
            <td className="pf-val"><Val v={d.email} /></td>
          </tr>
        </tbody>
      </table>

      <div className="pf-sec-hdr">Part II — Leave Details</div>
      <table className="pf-table">
        <tbody>
          <tr>
            <td className="pf-lbl" style={{ width: '30%' }}>Type of Leave</td>
            <td className="pf-val"><Val v={d.leaveType} /></td>
            <td className="pf-lbl" style={{ width: '22%' }}>Session / Event</td>
            <td className="pf-val"><Val v={d.session} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Leave From</td>
            <td className="pf-val"><Val v={d.fromDate} /></td>
            <td className="pf-lbl">Leave To</td>
            <td className="pf-val"><Val v={d.toDate} /></td>
          </tr>
        </tbody>
      </table>

      <div className="pf-sec-hdr">Part III — Reason for Leave</div>
      <table className="pf-table">
        <tbody>
          <tr>
            <td className="pf-val" style={{ minHeight: '60px', verticalAlign: 'top', padding: '8px 8px 30px' }}>
              {d.reason || ''}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="pf-cert-para">
        I, the above-named cadet, hereby request that leave of absence be granted to me for the period
        and reason stated above. I undertake to attend all NCC activities punctually upon resumption and
        shall comply with any conditions stipulated by the ANO/Commanding Officer.
      </div>

      <div className="pf-sig-row">
        <div className="pf-sig-cell">
          <div className="pf-sig-line" />
          <p className="pf-sig-label">Cadet's Signature</p>
          <p className="pf-sig-sub">Name &amp; Regimental No.</p>
        </div>
        <div className="pf-sig-cell">
          <div className="pf-sig-line" />
          <p className="pf-sig-label">Parent / Guardian Signature</p>
          <p className="pf-sig-sub">Name &amp; Contact</p>
        </div>
        <div className="pf-sig-cell">
          <div className="pf-sig-line" />
          <p className="pf-sig-label">ANO Remarks &amp; Signature</p>
          <p className="pf-sig-sub">Approved / Not Approved</p>
        </div>
      </div>

      <div className="pf-office-box">
        <div className="pf-office-hdr">For Office Use Only</div>
        <div className="pf-office-body">
          <div className="pf-office-fields">
            <div className="pf-office-field">Application Received: ________________</div>
            <div className="pf-office-field">Leave Sanctioned: &nbsp;Yes / No</div>
            <div className="pf-office-field">Attendance Impact: ________________</div>
            <div className="pf-office-field">File No.: ________________</div>
          </div>
          <div className="pf-office-stamp">OFFICIAL<br />STAMP<br />&amp;<br />SIGNATURE</div>
        </div>
      </div>

      <div className="pf-footer">
        This form must be submitted at least 48 hours before the scheduled NCC session / activity.
        Late applications may not be entertained. Keep a copy for your own records.
      </div>
    </div>
  )
}

// ── Form 2: Parent / Guardian Consent for Camp ────────────────────────────────
function ParentConsentPrint({ d }) {
  return (
    <div id="print-form" className="pf-page">
      <Letterhead subtitle="Parent / Guardian Consent Form — NCC Camp / Activity" />

      <div className="pf-sec-hdr">Part I — Cadet Details</div>
      <table className="pf-table">
        <tbody>
          <tr>
            <td className="pf-lbl" style={{ width: '30%' }}>Cadet Name</td>
            <td className="pf-val"><Val v={d.cadetName} /></td>
            <td className="pf-lbl" style={{ width: '22%' }}>Regimental No.</td>
            <td className="pf-val"><Val v={d.regimentalNo} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Rank</td>
            <td className="pf-val"><Val v={d.rank} /></td>
            <td className="pf-lbl">Wing</td>
            <td className="pf-val"><Val v={d.wing} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Department / Year</td>
            <td className="pf-val"><Val v={d.department} /></td>
            <td className="pf-lbl">Date of Birth</td>
            <td className="pf-val"><Val v={d.dob} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Blood Group</td>
            <td className="pf-val"><Val v={d.bloodGroup} /></td>
            <td className="pf-lbl">Known Allergies</td>
            <td className="pf-val"><Val v={d.allergies || 'None'} /></td>
          </tr>
        </tbody>
      </table>

      <div className="pf-sec-hdr">Part II — Activity / Camp Details</div>
      <table className="pf-table">
        <tbody>
          <tr>
            <td className="pf-lbl" style={{ width: '30%' }}>Activity / Camp Name</td>
            <td className="pf-val" colSpan={3}><Val v={d.activityName} width="300px" /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Venue / Location</td>
            <td className="pf-val"><Val v={d.venue} /></td>
            <td className="pf-lbl" style={{ width: '22%' }}>Dates</td>
            <td className="pf-val"><Val v={d.activityDates} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Reporting Time</td>
            <td className="pf-val"><Val v={d.reportingTime} /></td>
            <td className="pf-lbl">Estimated Return</td>
            <td className="pf-val"><Val v={d.returnDate} /></td>
          </tr>
        </tbody>
      </table>

      <div className="pf-sec-hdr">Part III — Parent / Guardian Details</div>
      <table className="pf-table">
        <tbody>
          <tr>
            <td className="pf-lbl" style={{ width: '30%' }}>Parent / Guardian Name</td>
            <td className="pf-val"><Val v={d.parentName} /></td>
            <td className="pf-lbl" style={{ width: '22%' }}>Relation</td>
            <td className="pf-val"><Val v={d.relation} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Contact No.</td>
            <td className="pf-val"><Val v={d.parentPhone} /></td>
            <td className="pf-lbl">Alternate No.</td>
            <td className="pf-val"><Val v={d.altPhone} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Residential Address</td>
            <td className="pf-val" colSpan={3}><Val v={d.address} width="350px" /></td>
          </tr>
        </tbody>
      </table>

      <div className="pf-cert-para">
        I, <Val v={d.parentName} width="180px" />, parent/guardian of Cadet <Val v={d.cadetName} width="160px" />,
        hereby give my full consent for the participation of my ward in the above-mentioned NCC activity/camp.
        I declare that my ward is medically fit to participate. I undertake to ensure my ward carries all prescribed
        equipment and uniform. I indemnify the NCC Unit, TCET, and the Maharashtra Directorate from any liability
        arising from accidents or injuries during the said activity unless attributable to gross negligence.
      </div>

      <div className="pf-sig-row">
        <div className="pf-sig-cell">
          <div className="pf-sig-line" style={{ height: 55 }} />
          <p className="pf-sig-label">Parent / Guardian Signature</p>
          <p className="pf-sig-sub">Name &amp; Date</p>
        </div>
        <div className="pf-sig-cell">
          <div className="pf-sig-line" style={{ height: 55 }} />
          <p className="pf-sig-label">Cadet's Signature</p>
          <p className="pf-sig-sub">With Date</p>
        </div>
        <div className="pf-sig-cell">
          <div className="pf-sig-line" style={{ height: 55 }} />
          <p className="pf-sig-label">ANO / Commanding Officer</p>
          <p className="pf-sig-sub">Signature &amp; Stamp</p>
        </div>
      </div>

      <div className="pf-footer">
        This form must be submitted to the ANO before the start of the activity. One copy to be retained by parent.
      </div>
    </div>
  )
}

// ── Form 3: Camp Nomination Form ──────────────────────────────────────────────
function CampNominationPrint({ d }) {
  return (
    <div id="print-form" className="pf-page">
      <Letterhead subtitle="Cadet Nomination Form — NCC Camp / Course" />

      <div className="pf-sec-hdr">Part I — Camp / Course Details</div>
      <table className="pf-table">
        <tbody>
          <tr>
            <td className="pf-lbl" style={{ width: '30%' }}>Camp / Course Name</td>
            <td className="pf-val" colSpan={3}><Val v={d.campName} width="300px" /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Venue</td>
            <td className="pf-val"><Val v={d.campVenue} /></td>
            <td className="pf-lbl" style={{ width: '22%' }}>Dates</td>
            <td className="pf-val"><Val v={d.campDates} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Organised By</td>
            <td className="pf-val"><Val v={d.organisedBy} /></td>
            <td className="pf-lbl">Category</td>
            <td className="pf-val"><Val v={d.campCategory} /></td>
          </tr>
        </tbody>
      </table>

      <div className="pf-sec-hdr">Part II — Cadet Details</div>
      <table className="pf-table">
        <tbody>
          <tr>
            <td className="pf-lbl" style={{ width: '30%' }}>Full Name</td>
            <td className="pf-val"><Val v={d.name} /></td>
            <td className="pf-lbl" style={{ width: '22%' }}>Regimental No.</td>
            <td className="pf-val"><Val v={d.regimentalNo} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Rank</td>
            <td className="pf-val"><Val v={d.rank} /></td>
            <td className="pf-lbl">Wing</td>
            <td className="pf-val"><Val v={d.wing} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Department</td>
            <td className="pf-val"><Val v={d.department} /></td>
            <td className="pf-lbl">Year of Study</td>
            <td className="pf-val"><Val v={d.year} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Blood Group</td>
            <td className="pf-val"><Val v={d.bloodGroup} /></td>
            <td className="pf-lbl">NCC Cert. Level</td>
            <td className="pf-val"><Val v={d.certLevel} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Phone</td>
            <td className="pf-val"><Val v={d.phone} /></td>
            <td className="pf-lbl">Previous Camps</td>
            <td className="pf-val"><Val v={d.prevCamps} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Academic Performance</td>
            <td className="pf-val"><Val v={d.academicPerf} /></td>
            <td className="pf-lbl">Attendance %</td>
            <td className="pf-val"><Val v={d.attendancePct} /></td>
          </tr>
        </tbody>
      </table>

      <div className="pf-sec-hdr">Part III — ANO Recommendation</div>
      <table className="pf-table">
        <tbody>
          <tr>
            <td style={{ padding: '8px', verticalAlign: 'top', minHeight: 60, paddingBottom: 30, fontSize: '9pt' }}>
              {d.anoRemarks || 'The above-named cadet is recommended for nomination to the above camp/course. The cadet has demonstrated good discipline, regular attendance, and keenness to participate in NCC activities. The cadet is medically fit and is in possession of valid NCC enrollment.'}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="pf-sig-row">
        <div className="pf-sig-cell">
          <div className="pf-sig-line" style={{ height: 55 }} />
          <p className="pf-sig-label">Cadet's Signature</p>
          <p className="pf-sig-sub">Name &amp; Date</p>
        </div>
        <div className="pf-sig-cell">
          <div className="pf-sig-line" style={{ height: 55 }} />
          <p className="pf-sig-label">ANO Signature &amp; Stamp</p>
          <p className="pf-sig-sub">Name, Rank &amp; Date</p>
        </div>
        <div className="pf-sig-cell">
          <div className="pf-sig-line" style={{ height: 55 }} />
          <p className="pf-sig-label">Commanding Officer</p>
          <p className="pf-sig-sub">Signature &amp; Date</p>
        </div>
      </div>

      <div className="pf-footer">
        To be forwarded to the Group HQ / Battalion HQ along with a copy of the cadet's NCC identity card.
      </div>
    </div>
  )
}

// ── Form 4: Inter-Unit Transfer NOC ───────────────────────────────────────────
function TransferNOCPrint({ d }) {
  return (
    <div id="print-form" className="pf-page">
      <Letterhead subtitle="No Objection Certificate — Cadet Inter-Unit Transfer" />

      <div className="pf-sec-hdr">Part I — Cadet Details</div>
      <table className="pf-table">
        <tbody>
          <tr>
            <td className="pf-lbl" style={{ width: '30%' }}>Full Name</td>
            <td className="pf-val"><Val v={d.name} /></td>
            <td className="pf-lbl" style={{ width: '22%' }}>Regimental No.</td>
            <td className="pf-val"><Val v={d.regimentalNo} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Rank</td>
            <td className="pf-val"><Val v={d.rank} /></td>
            <td className="pf-lbl">Wing</td>
            <td className="pf-val"><Val v={d.wing} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">NCC Certificate Level</td>
            <td className="pf-val"><Val v={d.certLevel} /></td>
            <td className="pf-lbl">Year of Enrollment</td>
            <td className="pf-val"><Val v={d.enrollYear} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Current Institution</td>
            <td className="pf-val"><Val v={d.currentInstitution || 'TCET Mumbai'} /></td>
            <td className="pf-lbl">Phone</td>
            <td className="pf-val"><Val v={d.phone} /></td>
          </tr>
        </tbody>
      </table>

      <div className="pf-sec-hdr">Part II — Transfer Details</div>
      <table className="pf-table">
        <tbody>
          <tr>
            <td className="pf-lbl" style={{ width: '30%' }}>Reason for Transfer</td>
            <td className="pf-val" colSpan={3}><Val v={d.reason} width="300px" /></td>
          </tr>
          <tr>
            <td className="pf-lbl">New Institution</td>
            <td className="pf-val"><Val v={d.newInstitution} /></td>
            <td className="pf-lbl" style={{ width: '22%' }}>New Unit</td>
            <td className="pf-val"><Val v={d.newUnit} /></td>
          </tr>
          <tr>
            <td className="pf-lbl">Transfer Effective From</td>
            <td className="pf-val"><Val v={d.effectiveDate} /></td>
            <td className="pf-lbl">Dues Cleared</td>
            <td className="pf-val">Yes / No</td>
          </tr>
        </tbody>
      </table>

      <div className="pf-cert-para">
        This is to certify that <Val v={d.name} width="180px" /> bearing Regimental No.&nbsp;<Val v={d.regimentalNo} width="100px" />,
        has been enrolled as a cadet with this unit and has served the NCC with discipline and sincerity.
        The unit has <strong>No Objection</strong> to the transfer of the above cadet to the receiving unit
        as mentioned above. All dues against the cadet have been settled / are to be settled before
        the transfer is effected. NCC records and ID documents are enclosed herewith.
      </div>

      <div className="pf-sec-hdr">Part III — Documents Enclosed</div>
      <table className="pf-table" style={{ marginBottom: 6 }}>
        <tbody>
          {[
            'Original NCC Enrollment Card',
            'Copy of NCC Identity Card',
            'Attendance / Training record sheet',
            'Clearance certificate from current unit',
            'Copy of last examination marksheet',
          ].map((doc, i) => (
            <tr key={i}>
              <td style={{ width: 28, border: '1px solid #888', padding: '2px 6px', fontSize: '9pt', textAlign: 'center' }}>{i + 1}</td>
              <td style={{ border: '1px solid #888', padding: '2px 8px', fontSize: '9pt' }}>{doc}</td>
              <td style={{ width: 80, border: '1px solid #888', padding: '2px 6px', fontSize: '9pt', textAlign: 'center' }}>
                Enclosed / N.A.
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pf-sig-row">
        <div className="pf-sig-cell">
          <div className="pf-sig-line" style={{ height: 55 }} />
          <p className="pf-sig-label">Cadet's Signature</p>
          <p className="pf-sig-sub">With Date</p>
        </div>
        <div className="pf-sig-cell">
          <div className="pf-sig-line" style={{ height: 55 }} />
          <p className="pf-sig-label">ANO — Issuing Unit</p>
          <p className="pf-sig-sub">Signature, Stamp &amp; Date</p>
        </div>
        <div className="pf-sig-cell">
          <div className="pf-sig-line" style={{ height: 55 }} />
          <p className="pf-sig-label">Commanding Officer</p>
          <p className="pf-sig-sub">Signature &amp; Date</p>
        </div>
      </div>

      <div className="pf-footer">
        Original to be submitted to the receiving unit. Copy to be retained by issuing unit records.
      </div>
    </div>
  )
}

// ── Screen fill-forms ─────────────────────────────────────────────────────────

const RANKS = ['Cadet', 'Lance Corporal', 'Corporal', 'Sergeant', 'CQMS', 'CSM', 'RQMS', 'RSM', 'Under Officer', 'JUO', 'SUO']
const WINGS = ['Army', 'Navy', 'Air']
const YEARS = ['FE', 'SE', 'TE', 'BE']
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const DEPARTMENTS = ['Computer Engineering', 'Information Technology', 'Electronics & Telecommunication', 'Mechanical Engineering', 'Civil Engineering', 'AI & Data Science', 'Other']

function LeaveForm({ onPrint, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onPrint)} noValidate className="space-y-6">
      <SectionHeader>Cadet Details</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name *" error={errors.name}>
          <input className="input-field" {...register('name', { required: 'Required' })} placeholder="e.g. Arjun Sharma" />
        </Field>
        <Field label="Regimental No. *" error={errors.regimentalNo}>
          <input className="input-field" {...register('regimentalNo', { required: 'Required' })} placeholder="e.g. MH-01234" />
        </Field>
        <Field label="Rank">
          <select className="select-field" {...register('rank')}>
            {RANKS.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Wing">
          <select className="select-field" {...register('wing')}>
            {WINGS.map(w => <option key={w}>{w}</option>)}
          </select>
        </Field>
        <Field label="Department">
          <select className="select-field" {...register('department')}>
            <option value="">— Select —</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Year">
          <select className="select-field" {...register('year')}>
            <option value="">— Select —</option>
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
        </Field>
        <Field label="Phone">
          <input className="input-field" type="tel" {...register('phone')} placeholder="10-digit mobile" />
        </Field>
        <Field label="Email">
          <input className="input-field" type="email" {...register('email')} placeholder="your@email.com" />
        </Field>
      </div>

      <SectionHeader>Leave Details</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Type of Leave *" error={errors.leaveType}>
          <select className="select-field" {...register('leaveType', { required: 'Required' })}>
            <option value="">— Select —</option>
            {['Sick Leave', 'Casual Leave', 'Special Leave', 'Academic Duty', 'Family Emergency', 'Other'].map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Session / Event">
          <input className="input-field" {...register('session')} placeholder="e.g. Weekly Parade on 15 Jan" />
        </Field>
        <Field label="Leave From *" error={errors.fromDate}>
          <input className="input-field" type="date" {...register('fromDate', { required: 'Required' })} />
        </Field>
        <Field label="Leave To *" error={errors.toDate}>
          <input className="input-field" type="date" {...register('toDate', { required: 'Required' })} />
        </Field>
      </div>

      <Field label="Reason for Leave *" error={errors.reason}>
        <textarea className="input-field" rows={4} {...register('reason', { required: 'Required' })} placeholder="Explain your reason in detail…" />
      </Field>

      <PrintButton />
    </form>
  )
}

function ParentConsentForm({ onPrint, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onPrint)} noValidate className="space-y-6">
      <SectionHeader>Cadet Details</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Cadet Full Name *" error={errors.cadetName}>
          <input className="input-field" {...register('cadetName', { required: 'Required' })} placeholder="e.g. Arjun Sharma" />
        </Field>
        <Field label="Regimental No. *" error={errors.regimentalNo}>
          <input className="input-field" {...register('regimentalNo', { required: 'Required' })} placeholder="e.g. MH-01234" />
        </Field>
        <Field label="Rank">
          <select className="select-field" {...register('rank')}>
            {RANKS.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Wing">
          <select className="select-field" {...register('wing')}>
            {WINGS.map(w => <option key={w}>{w}</option>)}
          </select>
        </Field>
        <Field label="Department / Year">
          <input className="input-field" {...register('department')} placeholder="e.g. Computer Engg., SE" />
        </Field>
        <Field label="Date of Birth">
          <input className="input-field" type="date" {...register('dob')} />
        </Field>
        <Field label="Blood Group">
          <select className="select-field" {...register('bloodGroup')}>
            <option value="">— Select —</option>
            {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Known Allergies / Conditions">
          <input className="input-field" {...register('allergies')} placeholder="None / specify" />
        </Field>
      </div>

      <SectionHeader>Activity / Camp Details</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Activity / Camp Name *" error={errors.activityName} className="col-span-2">
          <input className="input-field" {...register('activityName', { required: 'Required' })} placeholder="e.g. Annual Training Camp 2026" />
        </Field>
        <Field label="Venue / Location *" error={errors.venue}>
          <input className="input-field" {...register('venue', { required: 'Required' })} placeholder="e.g. Nashik Military Base" />
        </Field>
        <Field label="Dates of Activity *" error={errors.activityDates}>
          <input className="input-field" {...register('activityDates', { required: 'Required' })} placeholder="e.g. 15 Mar – 22 Mar 2026" />
        </Field>
        <Field label="Reporting Time">
          <input className="input-field" {...register('reportingTime')} placeholder="e.g. 06:00 AM on 15 Mar" />
        </Field>
        <Field label="Estimated Return Date *" error={errors.returnDate}>
          <input className="input-field" {...register('returnDate', { required: 'Required' })} placeholder="e.g. 22 Mar 2026, 06:00 PM" />
        </Field>
      </div>

      <SectionHeader>Parent / Guardian Details</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Parent / Guardian Name *" error={errors.parentName}>
          <input className="input-field" {...register('parentName', { required: 'Required' })} placeholder="e.g. Rajesh Sharma" />
        </Field>
        <Field label="Relation">
          <select className="select-field" {...register('relation')}>
            {['Father', 'Mother', 'Guardian', 'Other'].map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Contact No. *" error={errors.parentPhone}>
          <input className="input-field" type="tel" {...register('parentPhone', { required: 'Required' })} placeholder="10-digit mobile" />
        </Field>
        <Field label="Alternate Contact No.">
          <input className="input-field" type="tel" {...register('altPhone')} placeholder="optional" />
        </Field>
        <Field label="Residential Address" className="col-span-2">
          <textarea className="input-field" rows={2} {...register('address')} placeholder="Full residential address" />
        </Field>
      </div>

      <PrintButton />
    </form>
  )
}

function CampNominationForm({ onPrint, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onPrint)} noValidate className="space-y-6">
      <SectionHeader>Camp / Course Details</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Camp / Course Name *" error={errors.campName} className="col-span-2">
          <input className="input-field" {...register('campName', { required: 'Required' })} placeholder="e.g. Army Attachment Camp 2026" />
        </Field>
        <Field label="Venue *" error={errors.campVenue}>
          <input className="input-field" {...register('campVenue', { required: 'Required' })} placeholder="e.g. Deolali Camp, Nashik" />
        </Field>
        <Field label="Dates *" error={errors.campDates}>
          <input className="input-field" {...register('campDates', { required: 'Required' })} placeholder="e.g. 10–20 Apr 2026" />
        </Field>
        <Field label="Organised By">
          <input className="input-field" {...register('organisedBy')} placeholder="e.g. 1 MH Bn NCC / Maharashtra Dir." />
        </Field>
        <Field label="Category">
          <select className="select-field" {...register('campCategory')}>
            {['ATC', 'TSC', 'CATC', 'RDC', 'NIC', 'Adventure', 'Special Camp', 'Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <SectionHeader>Cadet Details</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name *" error={errors.name}>
          <input className="input-field" {...register('name', { required: 'Required' })} placeholder="e.g. Arjun Sharma" />
        </Field>
        <Field label="Regimental No. *" error={errors.regimentalNo}>
          <input className="input-field" {...register('regimentalNo', { required: 'Required' })} placeholder="e.g. MH-01234" />
        </Field>
        <Field label="Rank">
          <select className="select-field" {...register('rank')}>
            {RANKS.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Wing">
          <select className="select-field" {...register('wing')}>
            {WINGS.map(w => <option key={w}>{w}</option>)}
          </select>
        </Field>
        <Field label="Department">
          <select className="select-field" {...register('department')}>
            <option value="">— Select —</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Year">
          <select className="select-field" {...register('year')}>
            <option value="">— Select —</option>
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
        </Field>
        <Field label="Blood Group">
          <select className="select-field" {...register('bloodGroup')}>
            <option value="">— Select —</option>
            {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="NCC Certificate Level">
          <select className="select-field" {...register('certLevel')}>
            {['A Certificate', 'B Certificate', 'C Certificate', 'Enrolled (No cert yet)'].map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Phone">
          <input className="input-field" type="tel" {...register('phone')} placeholder="10-digit mobile" />
        </Field>
        <Field label="Previous Camps Attended">
          <input className="input-field" {...register('prevCamps')} placeholder="e.g. ATC 2025, TSC 2024" />
        </Field>
        <Field label="Academic CGPA / %">
          <input className="input-field" {...register('academicPerf')} placeholder="e.g. 8.5 CGPA" />
        </Field>
        <Field label="NCC Attendance %">
          <input className="input-field" {...register('attendancePct')} placeholder="e.g. 92%" />
        </Field>
      </div>

      <SectionHeader>ANO Recommendation</SectionHeader>
      <Field label="Remarks (optional — default text will be used if left blank)">
        <textarea className="input-field" rows={3} {...register('anoRemarks')} placeholder="Additional remarks by ANO…" />
      </Field>

      <PrintButton />
    </form>
  )
}

function TransferNOCForm({ onPrint, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onPrint)} noValidate className="space-y-6">
      <SectionHeader>Cadet Details</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name *" error={errors.name}>
          <input className="input-field" {...register('name', { required: 'Required' })} placeholder="e.g. Arjun Sharma" />
        </Field>
        <Field label="Regimental No. *" error={errors.regimentalNo}>
          <input className="input-field" {...register('regimentalNo', { required: 'Required' })} placeholder="e.g. MH-01234" />
        </Field>
        <Field label="Rank">
          <select className="select-field" {...register('rank')}>
            {RANKS.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Wing">
          <select className="select-field" {...register('wing')}>
            {WINGS.map(w => <option key={w}>{w}</option>)}
          </select>
        </Field>
        <Field label="NCC Certificate Level">
          <select className="select-field" {...register('certLevel')}>
            {['A Certificate', 'B Certificate', 'C Certificate', 'Enrolled (No cert yet)'].map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Year of Enrollment">
          <input className="input-field" {...register('enrollYear')} placeholder="e.g. 2023" />
        </Field>
        <Field label="Current Institution">
          <input className="input-field" {...register('currentInstitution')} placeholder="TCET Mumbai" />
        </Field>
        <Field label="Phone">
          <input className="input-field" type="tel" {...register('phone')} placeholder="10-digit mobile" />
        </Field>
      </div>

      <SectionHeader>Transfer Details</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Reason for Transfer *" error={errors.reason} className="col-span-2">
          <input className="input-field" {...register('reason', { required: 'Required' })} placeholder="e.g. College transfer / change of institution" />
        </Field>
        <Field label="New Institution *" error={errors.newInstitution}>
          <input className="input-field" {...register('newInstitution', { required: 'Required' })} placeholder="Full name of new college" />
        </Field>
        <Field label="New NCC Unit">
          <input className="input-field" {...register('newUnit')} placeholder="e.g. 2 MH TECH BN NCC" />
        </Field>
        <Field label="Effective Transfer Date *" error={errors.effectiveDate}>
          <input className="input-field" type="date" {...register('effectiveDate', { required: 'Required' })} />
        </Field>
      </div>

      <PrintButton />
    </form>
  )
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-army-800" />
      <span className="font-heading text-xs text-gold-500 uppercase tracking-[0.25em]">{children}</span>
      <span className="h-px flex-1 bg-army-800" />
    </div>
  )
}

function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="label-field">{label}</label>
      {children}
      {error && (
        <p className="text-red-400 text-xs mt-1 font-body">{error.message}</p>
      )}
    </div>
  )
}

function PrintButton() {
  return (
    <div className="flex justify-end pt-2">
      <button type="submit" className="btn-primary flex items-center gap-2">
        <Printer className="w-4 h-4" />
        Generate &amp; Print
      </button>
    </div>
  )
}

// ── Form configs ──────────────────────────────────────────────────────────────

const FORM_CONFIGS = [
  {
    id: 'leave',
    label: 'Leave Application',
    description: 'Apply for absence from NCC sessions, parades, camps or activities. Requires ANO approval.',
    icon: ClipboardList,
    color: 'text-green-400',
    FormComponent: LeaveForm,
    PrintComponent: LeaveApplicationPrint,
  },
  {
    id: 'consent',
    label: 'Parent / Guardian Consent',
    description: 'Mandatory parental consent for NCC camps, outstation activities, and adventure programmes.',
    icon: Users,
    color: 'text-blue-400',
    FormComponent: ParentConsentForm,
    PrintComponent: ParentConsentPrint,
  },
  {
    id: 'nomination',
    label: 'Camp Nomination Form',
    description: 'Nominate a cadet for a camp, course, or competition — with ANO recommendation.',
    icon: Tent,
    color: 'text-gold-400',
    FormComponent: CampNominationForm,
    PrintComponent: CampNominationPrint,
  },
  {
    id: 'noc',
    label: 'Inter-Unit Transfer NOC',
    description: 'No Objection Certificate for cadets transferring to another NCC unit or institution.',
    icon: Shuffle,
    color: 'text-orange-400',
    FormComponent: TransferNOCForm,
    PrintComponent: TransferNOCPrint,
  },
]

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Forms() {
  const { userProfile } = useAuth()
  const [selectedId, setSelectedId] = useState(null)
  const [printData, setPrintData] = useState(null)

  const config = FORM_CONFIGS.find(f => f.id === selectedId)

  // Pre-fill from logged-in profile
  const defaultValues = {
    name:         userProfile?.name         || '',
    regimentalNo: userProfile?.regimentalNo || '',
    rank:         userProfile?.rank         || 'Cadet',
    wing:         userProfile?.wing         || 'Army',
    department:   userProfile?.branch       || '',
    year:         userProfile?.year         || '',
    phone:        userProfile?.phone        || '',
    email:        userProfile?.email        || '',
  }

  function handlePrint(data) {
    setPrintData(data)
    const prev = document.title
    document.title = `NCC TCET — ${config.label}`
    setTimeout(() => {
      window.print()
      document.title = prev
    }, 120)
  }

  const PrintComp = config?.PrintComponent

  return (
    <div className="min-h-screen bg-military-dark py-24 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="section-subtitle">NCC TCET</p>
          <h1 className="section-title mb-3">Official Forms</h1>
          <div className="h-px w-20 bg-gold-500 mb-4" />
          <p className="font-body text-army-400 text-sm max-w-xl">
            Fill out NCC official forms digitally and print a formatted A4 copy ready for submission.
            Fields are pre-filled from your profile where available.
          </p>
        </div>

        {/* Breadcrumb */}
        {selectedId && (
          <button
            onClick={() => { setSelectedId(null); setPrintData(null) }}
            className="flex items-center gap-2 text-army-400 hover:text-gold-400 transition-colors text-sm font-body mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            All Forms
          </button>
        )}

        {/* ── Form selector ── */}
        {!selectedId && (
          <div className="grid md:grid-cols-2 gap-4">
            {FORM_CONFIGS.map(({ id, label, description, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => { setSelectedId(id); setPrintData(null) }}
                className="card-army p-6 text-left hover:border-army-600 transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 border border-army-700 group-hover:border-army-500 transition-colors flex-shrink-0">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-white uppercase tracking-widest text-sm mb-1">{label}</p>
                    <p className="font-body text-army-400 text-xs leading-relaxed">{description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-army-600 group-hover:text-gold-400 transition-colors mt-1 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Fill form ── */}
        {selectedId && config && (
          <div className="card-army p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <config.icon className={`w-5 h-5 ${config.color}`} />
              <h2 className="font-heading text-white uppercase tracking-widest text-base">{config.label}</h2>
            </div>

            <config.FormComponent
              onPrint={handlePrint}
              defaultValues={defaultValues}
            />

            {printData && (
              <p className="text-green-400 text-xs font-body mt-4 text-center">
                ✓ Print dialog opened — if it didn't appear, click Generate &amp; Print again.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Hidden print area (visually hidden on screen, visible during print via CSS) ── */}
      {printData && PrintComp && (
        <div
          style={{
            visibility: 'hidden',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            pointerEvents: 'none',
            zIndex: -1,
          }}
          aria-hidden="true"
        >
          <PrintComp d={printData} />
        </div>
      )}
    </div>
  )
}

import { useState, useRef } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import {
  Upload,
  Download,
  Users,
  Calendar,
  ClipboardList,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Loader,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Eye,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── CSV Utilities ─────────────────────────────────────────────────────────────

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return { headers: [], rows: [] }

  function parseLine(line) {
    const result = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
        else inQuotes = !inQuotes
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += ch
      }
    }
    result.push(current.trim())
    return result
  }

  // Strip BOM if present
  const firstLine = lines[0].replace(/^\uFEFF/, '')
  const headers = parseLine(firstLine).map(h => h.replace(/^"|"$/g, '').trim())
  const rows = lines.slice(1)
    .filter(l => l.trim())
    .map(l => {
      const vals = parseLine(l)
      const obj = {}
      headers.forEach((h, i) => { obj[h] = (vals[i] ?? '').replace(/^"|"$/g, '').trim() })
      return obj
    })
  return { headers, rows }
}

// Remap CSV headers to canonical column keys, tolerating different capitalisation/spacing
function normalizeRows(rows, columns) {
  const keyMap = {}
  columns.forEach(col => {
    const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, '')
    keyMap[normalize(col.key)]   = col.key
    keyMap[normalize(col.label)] = col.key
  })
  return rows.map(row => {
    const out = {}
    Object.entries(row).forEach(([h, v]) => {
      const lookup = h.toLowerCase().replace(/[^a-z0-9]/g, '')
      out[keyMap[lookup] ?? h] = v
    })
    return out
  })
}

function downloadCSV(filename, columns, sampleRows) {
  const escape = (v) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  const headers = columns.map(c => c.key)
  const lines = [
    headers.join(','),
    ...sampleRows.map(row => headers.map(h => escape(row[h] ?? '')).join(',')),
  ]
  const csv = lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ── Helper Functions ──────────────────────────────────────────────────────────

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

async function createFirebaseUser(email, password) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${import.meta.env.VITE_FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: false }),
    }
  )
  const json = await res.json()
  if (!res.ok) {
    const msg = json.error?.message || 'UNKNOWN_ERROR'
    if (msg.includes('EMAIL_EXISTS')) throw Object.assign(new Error(msg), { code: 'auth/email-already-in-use' })
    throw Object.assign(new Error(msg), { code: msg })
  }
  return json.localId
}

function printAllCredentials(credentials) {
  const win = window.open('', '_blank', 'width=700,height=900')
  if (!win) { alert('Allow popups to print credentials.'); return }
  const rows = credentials.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>${c.regimentalNo}</td>
      <td>${c.wing || '—'}</td>
      <td>${c.rank || '—'}</td>
      <td>${c.email}</td>
      <td class="pwd">${c.password}</td>
    </tr>`).join('')
  win.document.write(`<!DOCTYPE html><html><head><title>NCC TCET – Bulk Credentials</title><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:32px;color:#111}
    h1{font-size:20px;text-transform:uppercase;letter-spacing:3px;color:#1a2e0d;margin-bottom:4px}
    p{font-size:11px;color:#6b7280;margin-bottom:24px;letter-spacing:1px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th{background:#1a2e0d;color:#fff;text-align:left;padding:8px 10px;text-transform:uppercase;letter-spacing:1px;font-size:10px}
    td{padding:7px 10px;border-bottom:1px solid #e5e7eb}
    tr:nth-child(even) td{background:#f9fafb}
    .pwd{font-family:'Courier New',monospace;font-weight:700;color:#92400e;background:#fffbeb;letter-spacing:2px}
    .warn{margin-top:20px;font-size:10px;color:#b45309;border:1px solid #f59e0b;padding:8px 12px;background:#fffbeb}
    @media print{body{padding:16px}}
  </style></head><body>
    <h1>🛡️ NCC TCET — Cadet Login Credentials</h1>
    <p>STRICTLY CONFIDENTIAL · Bulk Import · ${new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</p>
    <table><thead><tr><th>Name</th><th>Regimental No.</th><th>Wing</th><th>Rank</th><th>Email</th><th>Password</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <div class="warn">⚠ Ask each cadet to change their password after first login. Do not share this document.</div>
    <script>setTimeout(function(){window.print();},600);<\/script>
  </body></html>`)
  win.document.close()
}

// ── Constants ─────────────────────────────────────────────────────────────────

const RANKS = [
  'Cadet', 'Lance Corporal', 'Corporal', 'Sergeant',
  'Company Quarter Master Sergeant', 'Company Sergeant Major',
  'Regimental Quarter Master Sergeant', 'Regimental Sergeant Major',
  'Under Officer', 'Junior Under Officer', 'Senior Under Officer',
]
const WINGS = ['Army', 'Navy', 'Air']
const YEARS = ['FE', 'SE', 'TE', 'BE']
const SESSION_TYPES = ['Training', 'Camp', 'ATC', 'TSC', 'Lecture', 'Parade', 'Social Service', 'Other']
const EVENT_CATEGORIES = ['Training', 'Camp', 'Competition', 'Social Service', 'Adventure', 'Workshop', 'Republic Day', 'Other']

// ── Import Configurations ─────────────────────────────────────────────────────

const IMPORT_CONFIGS = {
  cadets: {
    label: 'Cadets',
    description:
      'Import cadet roster profiles into the system. Note: Firebase login accounts must still be created individually via "Add Cadet". Rows with duplicate Regimental Numbers are skipped automatically.',
    icon: Users,
    color: 'text-blue-400',
    templateFile: 'cadets_template.csv',
    columns: [
      { key: 'name',          label: 'Name',           required: true,  example: 'Arjun Sharma',          hint: 'Full name of the cadet' },
      { key: 'regimentalNo',  label: 'Regimental No',  required: true,  example: 'MH2024SDIA4200621',      hint: 'Alphanumeric regimental number (e.g. MH2024SDIA4200621)' },
      { key: 'rank',          label: 'Rank',           required: false, example: 'Cadet',                  hint: RANKS.slice(0, 4).join(', ') + ' …' },
      { key: 'wing',          label: 'Wing',           required: false, example: 'Army',                   hint: WINGS.join(' / ') },
      { key: 'year',          label: 'Year',           required: false, example: 'SE',                     hint: YEARS.join(' / ') },
      { key: 'branch',        label: 'Branch',         required: false, example: 'Computer Engineering',   hint: 'Department / branch name' },
      { key: 'phone',         label: 'Phone',          required: false, example: '9876543210',             hint: '10-digit mobile number' },
    ],
    sampleRows: [
      { name: 'Arjun Sharma',  regimentalNo: 'MH2024SDIA4200001', rank: 'Cadet',          wing: 'Army',  year: 'SE', branch: 'Computer Engineering', phone: '9876543210' },
      { name: 'Priya Nair',    regimentalNo: 'MH2024SDIA4200002', rank: 'Lance Corporal',  wing: 'Navy',  year: 'TE', branch: 'Electronics',          phone: '8765432109' },
      { name: 'Rohan Mehta',   regimentalNo: 'MH2024SDIA4200003', rank: 'Corporal',        wing: 'Air',   year: 'BE', branch: 'Mechanical',           phone: '7654321098' },
    ],
    validate(row) {
      const errs = []
      if (!row.name?.trim())          errs.push('Name is required')
      if (!row.regimentalNo?.trim())  errs.push('Regimental No is required')
      else if (!/^[A-Za-z0-9]{4,30}$/.test(row.regimentalNo.trim()))
                                      errs.push('Regimental No must be alphanumeric with no spaces (e.g. MH2024SDIA4200621)')
      if (row.wing && !WINGS.includes(row.wing))  errs.push(`Wing must be one of: ${WINGS.join(', ')}`)
      if (row.year && !YEARS.includes(row.year))  errs.push(`Year must be one of: ${YEARS.join(', ')}`)
      if (row.phone && !/^\d{10}$/.test(row.phone.replace(/\s/g, '')))
                                      errs.push('Phone must be 10 digits')
      return errs
    },
    async doImport(rows, setProgress) {
      const snap = await getDocs(collection(db, 'users'))
      const existingRegnos = new Set(
        snap.docs.map(d => (d.data().regimentalNo || '').toUpperCase())
      )
      let imported = 0, skipped = 0, failed = 0
      const credentials = []
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const regtNo = row.regimentalNo.toUpperCase().trim()
        if (existingRegnos.has(regtNo)) { skipped++; setProgress(i + 1); continue }
        try {
          const password = generatePassword()
          const email = `${regtNo.toLowerCase()}@ncc-tcet.in`
          const uid = await createFirebaseUser(email, password)
          if (!uid) { skipped++; setProgress(i + 1); continue } // auth account already existed
          await setDoc(doc(db, 'users', uid), {
            name: row.name.trim(),
            regimentalNo: regtNo,
            rank: row.rank?.trim() || 'Cadet',
            wing: row.wing?.trim() || 'Army',
            year: row.year?.trim() || '',
            branch: row.branch?.trim() || '',
            phone: row.phone?.trim() || '',
            email,
            role: 'cadet',
            uid,
            createdAt: serverTimestamp(),
            importedAt: serverTimestamp(),
          })
          credentials.push({ name: row.name.trim(), regimentalNo: regtNo, email, password, wing: row.wing?.trim() || 'Army', rank: row.rank?.trim() || 'Cadet' })
          existingRegnos.add(regtNo)
          imported++
        } catch (err) { console.error('Import error', row.regimentalNo, err); failed++ }
        setProgress(i + 1)
      }
      return { imported, skipped, failed, credentials }
    },
  },

  attendance: {
    label: 'Attendance',
    description:
      'Import past attendance records. Each row represents one cadet in one session. Rows sharing the same Date + Session Title are grouped into a single attendance document.',
    icon: ClipboardList,
    color: 'text-green-400',
    templateFile: 'attendance_template.csv',
    columns: [
      { key: 'date',          label: 'Date',           required: true,  example: '2026-01-15',      hint: 'YYYY-MM-DD format' },
      { key: 'sessionType',   label: 'Session Type',   required: false, example: 'Training',        hint: SESSION_TYPES.join(', ') },
      { key: 'sessionTitle',  label: 'Session Title',  required: false, example: 'Weekly Parade',   hint: 'Descriptive name for the session' },
      { key: 'regimentalNo',  label: 'Regimental No',  required: true,  example: 'MH-01001',        hint: '' },
      { key: 'cadetName',     label: 'Cadet Name',     required: false, example: 'Arjun Sharma',    hint: 'Optional — for readability' },
      { key: 'wing',          label: 'Wing',           required: false, example: 'Army',            hint: WINGS.join(' / ') },
      { key: 'present',       label: 'Present',        required: true,  example: 'Yes',             hint: 'Yes or No' },
    ],
    sampleRows: [
      { date: '2026-01-15', sessionType: 'Training', sessionTitle: 'Weekly Parade',   regimentalNo: 'MH-01001', cadetName: 'Arjun Sharma', wing: 'Army', present: 'Yes' },
      { date: '2026-01-15', sessionType: 'Training', sessionTitle: 'Weekly Parade',   regimentalNo: 'MH-01002', cadetName: 'Priya Nair',   wing: 'Navy', present: 'No'  },
      { date: '2026-01-15', sessionType: 'Training', sessionTitle: 'Weekly Parade',   regimentalNo: 'MH-01003', cadetName: 'Rohan Mehta',  wing: 'Air',  present: 'Yes' },
      { date: '2026-01-22', sessionType: 'Parade',   sessionTitle: 'Republic Day PT', regimentalNo: 'MH-01001', cadetName: 'Arjun Sharma', wing: 'Army', present: 'Yes' },
    ],
    validate(row) {
      const errs = []
      if (!row.date?.trim())         errs.push('Date is required')
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date.trim()))
                                     errs.push('Date must be YYYY-MM-DD (e.g. 2026-01-15)')
      if (!row.regimentalNo?.trim()) errs.push('Regimental No is required')
      if (!row.present?.trim())      errs.push('Present is required (Yes / No)')
      else if (!['yes', 'no'].includes(row.present.trim().toLowerCase()))
                                     errs.push('Present must be "Yes" or "No"')
      return errs
    },
    async doImport(rows, setProgress) {
      // Group rows by [date + sessionTitle]
      const sessionMap = {}
      rows.forEach(row => {
        const key = `${row.date.trim()}||${(row.sessionTitle || row.sessionType || 'Session').trim()}`
        if (!sessionMap[key]) {
          sessionMap[key] = {
            date:         row.date.trim(),
            sessionType:  row.sessionType?.trim() || 'Training',
            sessionTitle: (row.sessionTitle?.trim() || row.sessionType?.trim() || 'Session'),
            cadets: [],
          }
        }
        sessionMap[key].cadets.push({
          regimentalNo: row.regimentalNo?.trim() || '',
          name:         row.cadetName?.trim()    || '',
          wing:         row.wing?.trim()         || '',
          present:      row.present?.trim().toLowerCase() === 'yes',
        })
      })

      const sessions = Object.values(sessionMap)
      let imported = 0, failed = 0
      for (let i = 0; i < sessions.length; i++) {
        const sess = sessions[i]
        const presentCount = sess.cadets.filter(c => c.present).length
        try {
          await addDoc(collection(db, 'attendance'), {
            date:         sess.date,
            sessionType:  sess.sessionType,
            sessionTitle: sess.sessionTitle,
            totalCadets:  sess.cadets.length,
            presentCount,
            absentCount:  sess.cadets.length - presentCount,
            cadets:       sess.cadets,
            createdAt:    serverTimestamp(),
            markedBy:     'Bulk Import',
          })
          imported++
        } catch { failed++ }
        // progress is per session
        setProgress(i + 1)
      }
      return {
        imported,
        skipped: 0,
        failed,
        note: `${sessions.length} session record(s) created from ${rows.length} cadet rows`,
        totalSteps: sessions.length,
      }
    },
  },

  events: {
    label: 'Events',
    description:
      'Import events in bulk. Each row creates one event with an empty registration form. You can edit form fields afterwards using the Events manager.',
    icon: Calendar,
    color: 'text-gold-400',
    templateFile: 'events_template.csv',
    columns: [
      { key: 'title',           label: 'Title',            required: true,  example: 'Annual Camp 2026',      hint: 'Event name' },
      { key: 'description',     label: 'Description',      required: false, example: 'Training camp at Pune', hint: 'Short description' },
      { key: 'category',        label: 'Category',         required: false, example: 'Camp',                  hint: EVENT_CATEGORIES.join(', ') },
      { key: 'date',            label: 'Date',             required: false, example: '2026-03-15',            hint: 'YYYY-MM-DD format' },
      { key: 'venue',           label: 'Venue',            required: false, example: 'Pune Military Base',    hint: '' },
      { key: 'maxParticipants', label: 'Max Participants', required: false, example: '50',                    hint: 'Leave blank for unlimited' },
      { key: 'isActive',        label: 'Is Active',        required: false, example: 'Yes',                   hint: 'Yes / No — visible to cadets' },
    ],
    sampleRows: [
      { title: 'Annual Camp 2026',     description: 'Annual training camp at Pune',    category: 'Camp',         date: '2026-03-15', venue: 'Pune Military Base', maxParticipants: '50', isActive: 'Yes' },
      { title: 'Republic Day Parade',  description: 'Participation in R-Day parade',   category: 'Republic Day', date: '2026-01-26', venue: 'Azad Maidan',        maxParticipants: '30', isActive: 'No'  },
      { title: 'Social Service Drive', description: 'Community service at rural areas', category: 'Social Service', date: '2026-02-10', venue: 'Thane District',    maxParticipants: '',   isActive: 'Yes' },
    ],
    validate(row) {
      const errs = []
      if (!row.title?.trim())  errs.push('Title is required')
      if (row.date && !/^\d{4}-\d{2}-\d{2}$/.test(row.date.trim()))
                               errs.push('Date must be YYYY-MM-DD')
      if (row.maxParticipants && isNaN(Number(row.maxParticipants)))
                               errs.push('Max Participants must be a number')
      if (row.category && !EVENT_CATEGORIES.includes(row.category))
                               errs.push(`Category must be one of: ${EVENT_CATEGORIES.join(', ')}`)
      if (row.isActive && !['yes', 'no', ''].includes(row.isActive.trim().toLowerCase()))
                               errs.push('Is Active must be "Yes" or "No"')
      return errs
    },
    async doImport(rows, setProgress) {
      let imported = 0, failed = 0
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        try {
          await addDoc(collection(db, 'events'), {
            title:           row.title.trim(),
            description:     row.description?.trim()  || '',
            category:        row.category?.trim()     || 'Other',
            date:            row.date?.trim()         || '',
            venue:           row.venue?.trim()        || '',
            maxParticipants: row.maxParticipants ? Number(row.maxParticipants) : null,
            isActive:        row.isActive?.trim().toLowerCase() === 'yes',
            formFields:      [],
            createdAt:       serverTimestamp(),
            importedAt:      serverTimestamp(),
          })
          imported++
        } catch { failed++ }
        setProgress(i + 1)
      }
      return { imported, skipped: 0, failed }
    },
  },

  applications: {
    label: 'Join Applications',
    description:
      'Import NCC join applications received offline or from paper forms. All imported applications get status "pending" and are visible in the Join Applications admin page.',
    icon: UserPlus,
    color: 'text-orange-400',
    templateFile: 'join_applications_template.csv',
    columns: [
      { key: 'name',        label: 'Full Name',       required: true,  example: 'Kavya Reddy',        hint: '' },
      { key: 'dob',         label: 'Date of Birth',   required: false, example: '2004-05-12',         hint: 'YYYY-MM-DD' },
      { key: 'gender',      label: 'Gender',          required: false, example: 'Female',             hint: 'Male / Female / Other' },
      { key: 'bloodGroup',  label: 'Blood Group',     required: false, example: 'O+',                 hint: 'e.g. A+, B-, O+, AB+' },
      { key: 'phone',       label: 'Phone',           required: false, example: '9876543210',         hint: '10 digits' },
      { key: 'parentPhone', label: 'Parent Phone',    required: false, example: '9123456789',         hint: '10 digits' },
      { key: 'email',       label: 'Email',           required: false, example: 'kavya@example.com',  hint: 'Student email' },
      { key: 'address',     label: 'Address',         required: false, example: '123 Marine Drive',   hint: 'Full residential address' },
      { key: 'department',  label: 'Department',      required: false, example: 'Computer Engineering', hint: '' },
      { key: 'year',        label: 'Year',            required: false, example: 'FE',                 hint: YEARS.join(' / ') },
      { key: 'rollNo',      label: 'Roll No',         required: false, example: '2024101',            hint: 'College roll number' },
      { key: 'collegeId',   label: 'College ID',      required: false, example: 'TCET2024001',        hint: '' },
      { key: 'wingPref',    label: 'Wing Preference', required: false, example: 'Army',               hint: WINGS.join(' / ') },
      { key: 'prevNccExp',  label: 'Prev NCC Exp',    required: false, example: 'No',                 hint: 'Yes / No' },
      { key: 'prevUnit',    label: 'Prev Unit',       required: false, example: '1 MH NCC Btn',       hint: 'If prevNccExp is Yes' },
      { key: 'prevRank',    label: 'Prev Rank',       required: false, example: 'Cadet',              hint: 'If prevNccExp is Yes' },
    ],
    sampleRows: [
      { name: 'Kavya Reddy',  dob: '2004-05-12', gender: 'Female', bloodGroup: 'O+',  phone: '9876543210', parentPhone: '9123456789', email: 'kavya@example.com', address: '123 Marine Drive Mumbai', department: 'Computer Engineering', year: 'FE', rollNo: '2024101', collegeId: 'TCET2024001', wingPref: 'Army',  prevNccExp: 'No',  prevUnit: '',             prevRank: ''      },
      { name: 'Siddharth Das', dob: '2003-11-30', gender: 'Male',   bloodGroup: 'A+',  phone: '8765432109', parentPhone: '8123456789', email: 'sid@example.com',   address: '45 BKC Bandra Mumbai',    department: 'Mechanical',          year: 'SE', rollNo: '2023205', collegeId: 'TCET2023002', wingPref: 'Navy',  prevNccExp: 'Yes', prevUnit: '1 MH NCC Btn',  prevRank: 'Cadet' },
    ],
    validate(row) {
      const errs = []
      if (!row.name?.trim())  errs.push('Full Name is required')
      if (row.dob && !/^\d{4}-\d{2}-\d{2}$/.test(row.dob.trim()))
                              errs.push('Date of Birth must be YYYY-MM-DD')
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email.trim()))
                              errs.push('Invalid email format')
      if (row.phone && !/^\d{10}$/.test(row.phone.replace(/\s/g, '')))
                              errs.push('Phone must be 10 digits')
      return errs
    },
    async doImport(rows, setProgress) {
      let imported = 0, failed = 0
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        try {
          await addDoc(collection(db, 'joinApplications'), {
            name:        row.name?.trim()        || '',
            dob:         row.dob?.trim()         || '',
            gender:      row.gender?.trim()      || '',
            bloodGroup:  row.bloodGroup?.trim()  || '',
            phone:       row.phone?.trim()       || '',
            parentPhone: row.parentPhone?.trim() || '',
            email:       row.email?.trim()       || '',
            address:     row.address?.trim()     || '',
            department:  row.department?.trim()  || '',
            year:        row.year?.trim()        || '',
            rollNo:      row.rollNo?.trim()      || '',
            collegeId:   row.collegeId?.trim()   || '',
            wingPref:    row.wingPref?.trim()    || '',
            prevNccExp:  row.prevNccExp?.trim()  || 'No',
            prevUnit:    row.prevUnit?.trim()    || '',
            prevRank:    row.prevRank?.trim()    || '',
            status:      'pending',
            submittedAt: serverTimestamp(),
            source:      'bulk_import',
          })
          imported++
        } catch { failed++ }
        setProgress(i + 1)
      }
      return { imported, skipped: 0, failed }
    },
  },

  declarations: {
    label: 'Declaration Forms',
    description:
      'Import NCC declaration/enrollment forms submitted on paper. Each row creates one declaration record visible in the Declarations admin page.',
    icon: FileText,
    color: 'text-purple-400',
    templateFile: 'declarations_template.csv',
    columns: [
      { key: 'name',          label: 'Cadet Name',      required: true,  example: 'Arjun Sharma',        hint: '' },
      { key: 'regimentalNo',  label: 'Regimental No',   required: false, example: 'MH-01234',            hint: '' },
      { key: 'rank',          label: 'Rank',            required: false, example: 'Cadet',               hint: '' },
      { key: 'wing',          label: 'Wing',            required: false, example: 'Army',                hint: WINGS.join(' / ') },
      { key: 'dob',           label: 'Date of Birth',   required: false, example: '2004-05-12',          hint: 'YYYY-MM-DD' },
      { key: 'bloodGroup',    label: 'Blood Group',     required: false, example: 'O+',                  hint: '' },
      { key: 'height',        label: 'Height (cm)',     required: false, example: '172',                 hint: 'In centimetres' },
      { key: 'weight',        label: 'Weight (kg)',     required: false, example: '65',                  hint: 'In kilograms' },
      { key: 'phone',         label: 'Phone',           required: false, example: '9876543210',          hint: '' },
      { key: 'email',         label: 'Email',           required: false, example: 'arjun@example.com',   hint: '' },
      { key: 'address',       label: 'Address',         required: false, example: '123 Main St Mumbai',  hint: '' },
      { key: 'department',    label: 'Department',      required: false, example: 'Computer Engineering', hint: '' },
      { key: 'year',          label: 'Year',            required: false, example: 'SE',                  hint: YEARS.join(' / ') },
      { key: 'rollNo',        label: 'Roll No',         required: false, example: '2024101',             hint: '' },
      { key: 'academicYear',  label: 'Academic Year',   required: false, example: '2025-26',             hint: 'e.g. 2025-26' },
    ],
    sampleRows: [
      { name: 'Arjun Sharma', regimentalNo: 'MH-01001', rank: 'Cadet', wing: 'Army', dob: '2004-05-12', bloodGroup: 'O+', height: '172', weight: '65', phone: '9876543210', email: 'arjun@example.com', address: '123 Main St Mumbai', department: 'Computer Engineering', year: 'SE', rollNo: '2024101', academicYear: '2025-26' },
    ],
    validate(row) {
      const errs = []
      if (!row.name?.trim()) errs.push('Cadet Name is required')
      if (row.dob && !/^\d{4}-\d{2}-\d{2}$/.test(row.dob.trim()))
                             errs.push('Date of Birth must be YYYY-MM-DD')
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email.trim()))
                             errs.push('Invalid email format')
      return errs
    },
    async doImport(rows, setProgress) {
      let imported = 0, failed = 0
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        try {
          await addDoc(collection(db, 'declarations'), {
            name:         row.name?.trim()         || '',
            regimentalNo: row.regimentalNo?.trim() || '',
            rank:         row.rank?.trim()         || 'Cadet',
            wing:         row.wing?.trim()         || '',
            dob:          row.dob?.trim()          || '',
            bloodGroup:   row.bloodGroup?.trim()   || '',
            height:       row.height?.trim()       || '',
            weight:       row.weight?.trim()       || '',
            phone:        row.phone?.trim()        || '',
            email:        row.email?.trim()        || '',
            address:      row.address?.trim()      || '',
            department:   row.department?.trim()   || '',
            year:         row.year?.trim()         || '',
            rollNo:       row.rollNo?.trim()       || '',
            academicYear: row.academicYear?.trim() || '',
            status:       'pending',
            submittedAt:  serverTimestamp(),
            source:       'bulk_import',
          })
          imported++
        } catch { failed++ }
        setProgress(i + 1)
      }
      return { imported, skipped: 0, failed }
    },
  },
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminBulkImport() {
  const [typeId,        setTypeId]        = useState(null)
  const [step,          setStep]          = useState('select')   // select | upload | preview | importing | done
  const [parsedRows,    setParsedRows]    = useState([])
  const [validationMap, setValidationMap] = useState({})
  const [progress,      setProgress]      = useState(0)
  const [totalSteps,    setTotalSteps]    = useState(0)
  const [result,        setResult]        = useState(null)
  const [isDragging,    setIsDragging]    = useState(false)
  const fileRef = useRef()

  const config    = typeId ? IMPORT_CONFIGS[typeId] : null
  const validRows = parsedRows.filter((_, i) => !validationMap[i]?.length)
  const errorRows = parsedRows.filter((_, i) =>  validationMap[i]?.length)

  function handleSelectType(id) {
    setTypeId(id)
    setStep('upload')
    setParsedRows([])
    setValidationMap({})
    setProgress(0)
    setResult(null)
  }

  function handleFileInput(file) {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please upload a .csv file')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const { rows: rawRows } = parseCSV(e.target.result)
      if (rawRows.length === 0) { toast.error('No data rows found in the file'); return }
      const rows = normalizeRows(rawRows, config.columns)
      const map = {}
      rows.forEach((row, i) => {
        const errs = config.validate(row)
        if (errs.length) map[i] = errs
      })
      setParsedRows(rows)
      setValidationMap(map)
      setStep('preview')
    }
    reader.readAsText(file)
  }

  async function runImport() {
    const steps = typeId === 'attendance'
      ? /* count sessions */ (() => {
          const keys = new Set()
          validRows.forEach(r => keys.add(`${r.date?.trim()}||${(r.sessionTitle || r.sessionType || 'Session').trim()}`))
          return keys.size
        })()
      : validRows.length

    setTotalSteps(steps)
    setProgress(0)
    setStep('importing')
    try {
      const res = await config.doImport(validRows, setProgress)
      setResult(res)
      setStep('done')
    } catch (err) {
      toast.error('Import failed: ' + (err.message || 'Unknown error'))
      setStep('preview')
    }
  }

  function reset() {
    setTypeId(null)
    setStep('select')
    setParsedRows([])
    setValidationMap({})
    setProgress(0)
    setResult(null)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    handleFileInput(e.dataTransfer.files[0])
  }

  const progressPct = totalSteps ? Math.round((progress / totalSteps) * 100) : 0

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <p className="section-subtitle">Admin</p>
        <h2 className="font-heading text-2xl text-white uppercase tracking-widest">Bulk Import</h2>
        <div className="h-px w-16 bg-gold-500 mt-2" />
      </div>

      {/* Breadcrumb */}
      {step !== 'select' && (
        <div className="flex items-center gap-2 text-xs font-body text-army-500 mb-6">
          <button onClick={reset} className="hover:text-gold-400 transition-colors">
            All Types
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-army-300">{config?.label}</span>
          {step !== 'upload' && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-army-300 capitalize">
                {step === 'importing' ? 'Importing…' : step}
              </span>
            </>
          )}
        </div>
      )}

      {/* ── STEP: Select Type ─────────────────────────────────────────────── */}
      {step === 'select' && (
        <div>
          <p className="font-body text-army-400 text-sm mb-6">
            Select the type of data you want to import in bulk. Each type has its own CSV template you can download.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(IMPORT_CONFIGS).map(([id, cfg]) => {
              const Icon = cfg.icon
              return (
                <button
                  key={id}
                  onClick={() => handleSelectType(id)}
                  className="card-army p-6 text-left hover:border-army-600 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 border border-army-700 group-hover:border-army-500 transition-colors flex-shrink-0">
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-white uppercase tracking-widest text-sm mb-1">
                        {cfg.label}
                      </p>
                      <p className="font-body text-army-400 text-xs leading-relaxed">
                        {cfg.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-army-600 group-hover:text-gold-400 transition-colors mt-1 flex-shrink-0" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── STEP: Upload ──────────────────────────────────────────────────── */}
      {step === 'upload' && config && (
        <div className="space-y-6">

          {/* Step 1 — Template */}
          <div className="card-army p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div>
                <h3 className="font-heading text-white text-sm uppercase tracking-widest mb-1">
                  Step 1 — Download the CSV Template
                </h3>
                <p className="font-body text-army-400 text-xs">
                  Fill the template with your data, save as CSV, then upload below.
                </p>
              </div>
              <button
                onClick={() => {
                  downloadCSV(config.templateFile, config.columns, config.sampleRows)
                  toast.success('Template downloaded')
                }}
                className="btn-primary flex items-center gap-2 whitespace-nowrap flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>

            {/* Column reference table */}
            <div className="overflow-x-auto border border-army-800">
              <table className="w-full text-xs font-body">
                <thead>
                  <tr className="bg-army-900 border-b border-army-800">
                    <th className="text-left text-army-400 py-2 px-4 uppercase tracking-wider font-heading">Column Key</th>
                    <th className="text-left text-army-400 py-2 px-4 uppercase tracking-wider font-heading">Label</th>
                    <th className="text-left text-army-400 py-2 px-4 uppercase tracking-wider font-heading">Required</th>
                    <th className="text-left text-army-400 py-2 px-4 uppercase tracking-wider font-heading">Example Value</th>
                    <th className="text-left text-army-400 py-2 px-4 uppercase tracking-wider font-heading">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {config.columns.map((col, i) => (
                    <tr key={col.key} className={`border-b border-army-900 ${i % 2 === 0 ? '' : 'bg-army-950/40'}`}>
                      <td className="py-2 px-4 text-gold-400 font-mono">{col.key}</td>
                      <td className="py-2 px-4 text-army-300">{col.label}</td>
                      <td className="py-2 px-4">
                        {col.required
                          ? <span className="text-red-400 font-heading text-xs uppercase tracking-wider">Required</span>
                          : <span className="text-army-600 text-xs">Optional</span>}
                      </td>
                      <td className="py-2 px-4 text-army-300 font-mono">{col.example}</td>
                      <td className="py-2 px-4 text-army-500">{col.hint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 2 — Upload */}
          <div className="card-army p-6">
            <h3 className="font-heading text-white text-sm uppercase tracking-widest mb-4">
              Step 2 — Upload Your Filled CSV
            </h3>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`
                border-2 border-dashed cursor-pointer transition-all duration-200 p-12 text-center select-none
                ${isDragging ? 'border-gold-500 bg-gold-500/5' : 'border-army-700 hover:border-army-500 hover:bg-army-900/30'}
              `}
            >
              <FileSpreadsheet className="w-10 h-10 text-army-500 mx-auto mb-3" />
              <p className="font-heading text-army-300 text-sm uppercase tracking-widest mb-1">
                Drop CSV file here
              </p>
              <p className="font-body text-army-500 text-xs">or click to browse files</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => { handleFileInput(e.target.files[0]); e.target.value = '' }}
            />
          </div>
        </div>
      )}

      {/* ── STEP: Preview ─────────────────────────────────────────────────── */}
      {step === 'preview' && config && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="stat-card">
              <p className="font-heading text-3xl text-white">{parsedRows.length}</p>
              <p className="font-body text-xs text-army-400 uppercase tracking-widest mt-1">Total Rows</p>
            </div>
            <div className="stat-card">
              <p className="font-heading text-3xl text-green-400">{validRows.length}</p>
              <p className="font-body text-xs text-army-400 uppercase tracking-widest mt-1">Valid</p>
            </div>
            <div className="stat-card">
              <p className={`font-heading text-3xl ${errorRows.length ? 'text-red-400' : 'text-army-600'}`}>
                {errorRows.length}
              </p>
              <p className="font-body text-xs text-army-400 uppercase tracking-widest mt-1">With Errors</p>
            </div>
          </div>

          {/* Validation errors panel */}
          {errorRows.length > 0 && (
            <div className="card-army p-5 border border-red-900/50">
              <p className="font-heading text-xs text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {errorRows.length} row{errorRows.length !== 1 ? 's' : ''} with errors — these will be skipped
              </p>
              <div className="space-y-1.5 max-h-44 overflow-y-auto scrollbar-thin pr-1">
                {parsedRows.map((row, i) => {
                  const errs = validationMap[i]
                  if (!errs?.length) return null
                  return (
                    <div key={i} className="text-xs font-body flex items-start gap-3">
                      <span className="text-army-500 flex-shrink-0 w-16">Row {i + 2}:</span>
                      <span className="text-red-300">{errs.join('; ')}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Data preview table */}
          <div className="card-army overflow-hidden">
            <div className="px-6 py-4 border-b border-army-800 flex items-center justify-between">
              <span className="font-heading text-sm text-white uppercase tracking-widest flex items-center gap-2">
                <Eye className="w-4 h-4 text-army-400" />
                Data Preview
                {parsedRows.length > 20 && (
                  <span className="text-army-500 font-body text-xs normal-case tracking-normal">
                    (showing first 20 of {parsedRows.length})
                  </span>
                )}
              </span>
              <button
                onClick={() => { setStep('upload'); setParsedRows([]); setValidationMap({}) }}
                className="text-xs text-army-400 hover:text-white transition-colors font-body flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" /> Re-upload
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-body">
                <thead>
                  <tr className="bg-army-900 border-b border-army-800">
                    <th className="text-left text-army-500 py-3 px-3 uppercase tracking-wider font-heading">#</th>
                    <th className="text-left text-army-500 py-3 px-3 uppercase tracking-wider font-heading">OK</th>
                    {config.columns.map(c => (
                      <th key={c.key} className="text-left text-army-500 py-3 px-3 uppercase tracking-wider font-heading whitespace-nowrap">
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 20).map((row, i) => {
                    const errs = validationMap[i] || []
                    const hasErr = errs.length > 0
                    return (
                      <tr
                        key={i}
                        className={`border-b border-army-900 ${hasErr ? 'opacity-40' : ''} ${i % 2 === 0 ? '' : 'bg-army-950/30'}`}
                        title={hasErr ? errs.join('; ') : undefined}
                      >
                        <td className="py-2 px-3 text-army-600">{i + 1}</td>
                        <td className="py-2 px-3">
                          {hasErr
                            ? <XCircle     className="w-3.5 h-3.5 text-red-500" />
                            : <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                        </td>
                        {config.columns.map(c => (
                          <td key={c.key} className="py-2 px-3 text-army-300 max-w-36 truncate whitespace-nowrap">
                            {row[c.key] || <span className="text-army-700">—</span>}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {parsedRows.length > 20 && (
                <p className="text-center text-army-600 text-xs font-body py-3">
                  … {parsedRows.length - 20} more rows not shown
                </p>
              )}
            </div>
          </div>

          {validRows.length === 0 ? (
            <div className="card-army p-8 text-center">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-army-400 font-body text-sm">
                No valid rows to import. Fix the errors in your CSV and re-upload.
              </p>
              <button
                onClick={() => { setStep('upload'); setParsedRows([]); setValidationMap({}) }}
                className="btn-secondary mt-4"
              >
                Re-upload
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 items-center">
              <button onClick={runImport} className="btn-primary flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import {validRows.length} Valid Row{validRows.length !== 1 ? 's' : ''}
              </button>
              {errorRows.length > 0 && (
                <span className="font-body text-army-500 text-sm">
                  ({errorRows.length} row{errorRows.length !== 1 ? 's' : ''} with errors will be skipped)
                </span>
              )}
              <button onClick={reset} className="btn-secondary ml-auto">Cancel</button>
            </div>
          )}
        </div>
      )}

      {/* ── STEP: Importing ───────────────────────────────────────────────── */}
      {step === 'importing' && (
        <div className="card-army p-16 text-center">
          <Loader className="w-12 h-12 text-gold-400 mx-auto mb-5 animate-spin" />
          <p className="font-heading text-white uppercase tracking-widest text-sm mb-2">
            Importing Data…
          </p>
          <p className="font-body text-army-400 text-sm mb-6">
            {progress} of {totalSteps} processed — do not close this tab
          </p>
          <div className="w-72 h-1.5 bg-army-800 mx-auto rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="font-body text-army-600 text-xs mt-2">{progressPct}%</p>
        </div>
      )}

      {/* ── STEP: Done ────────────────────────────────────────────────────── */}
      {step === 'done' && result && (
        <div className="space-y-6">
          <div className="card-army p-10 text-center">
            <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-5" />
            <h3 className="font-heading text-white uppercase tracking-widest text-lg mb-1">
              Import Complete
            </h3>
            <p className="font-body text-army-400 text-sm mb-8">
              {config.label} data has been saved to the database.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-6">
              <div className="stat-card">
                <p className="font-heading text-2xl text-green-400">{result.imported}</p>
                <p className="font-body text-xs text-army-400 uppercase tracking-widest mt-1">Imported</p>
              </div>
              <div className="stat-card">
                <p className={`font-heading text-2xl ${result.skipped ? 'text-yellow-400' : 'text-army-600'}`}>
                  {result.skipped}
                </p>
                <p className="font-body text-xs text-army-400 uppercase tracking-widest mt-1">Skipped</p>
              </div>
              <div className="stat-card">
                <p className={`font-heading text-2xl ${result.failed ? 'text-red-400' : 'text-army-600'}`}>
                  {result.failed}
                </p>
                <p className="font-body text-xs text-army-400 uppercase tracking-widest mt-1">Failed</p>
              </div>
            </div>

            {result.note && (
              <p className="font-body text-army-400 text-xs mb-6 max-w-md mx-auto">{result.note}</p>
            )}

            {typeId === 'cadets' && result.credentials?.length > 0 && (
              <div className="card-army p-5 max-w-md mx-auto mb-6 text-left border border-gold-700/40">
                <p className="font-heading text-xs text-gold-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" /> {result.credentials.length} Login Account{result.credentials.length !== 1 ? 's' : ''} Created
                </p>
                <p className="font-body text-army-400 text-xs leading-relaxed mb-4">
                  Firebase Auth accounts and passwords were generated for {result.credentials.length} cadet(s).
                  Print their credentials now — passwords cannot be retrieved later.
                </p>
                <button
                  onClick={() => printAllCredentials(result.credentials)}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  🖨️ Print All Credentials PDF
                </button>
              </div>
            )}

            <div className="flex justify-center gap-3 flex-wrap">
              <button onClick={reset} className="btn-primary flex items-center gap-2">
                <Upload className="w-4 h-4" /> Import More
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

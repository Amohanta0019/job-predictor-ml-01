import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ResultCard from './ResultCard'

/* Numeric fields (0-100 or small ratings) */
const NUMERIC_FIELDS = [
  { key: 'Acedamic percentage in Operating Systems', label: 'Operating Systems %',       hint: '0 – 100' },
  { key: 'percentage in Algorithms',                  label: 'Algorithms %',              hint: '0 – 100' },
  { key: 'Percentage in Programming Concepts',        label: 'Programming Concepts %',    hint: '0 – 100' },
  { key: 'Percentage in Software Engineering',        label: 'Software Engineering %',    hint: '0 – 100' },
  { key: 'Percentage in Computer Networks',           label: 'Computer Networks %',       hint: '0 – 100' },
  { key: 'Percentage in Electronics Subjects',        label: 'Electronics %',             hint: '0 – 100' },
  { key: 'Percentage in Computer Architecture',       label: 'Computer Architecture %',   hint: '0 – 100' },
  { key: 'Percentage in Mathematics',                 label: 'Mathematics %',             hint: '0 – 100' },
  { key: 'Percentage in Communication skills',        label: 'Communication Skills %',    hint: '0 – 100' },
  { key: 'Hours working per day',                     label: 'Hours Working / Day',       hint: '1 – 24'  },
  { key: 'Logical quotient rating',                   label: 'Logical Quotient Rating',   hint: '1 – 10'  },
  { key: 'hackathons',                                label: 'Hackathons Attended',        hint: '0 – 10'  },
  { key: 'coding skills rating',                      label: 'Coding Skills Rating',      hint: '1 – 10'  },
  { key: 'public speaking points',                    label: 'Public Speaking Points',    hint: '1 – 10'  },
]

/* Categorical fields — shown as selects */
const CATEGORICAL_FIELDS = [
  {
    key: 'can work long time before system?',
    label: 'Can work long hours at system?',
    options: ['Yes', 'No'],
  },
  {
    key: 'self-learning capability?',
    label: 'Self-learning capability?',
    options: ['Yes', 'No'],
  },
  {
    key: 'Extra-courses did',
    label: 'Extra courses done?',
    options: ['Yes', 'No'],
  },
  {
    key: 'certifications',
    label: 'Certifications earned?',
    options: ['Yes', 'No'],
  },
  {
    key: 'workshops',
    label: 'Attended workshops?',
    options: ['Yes', 'No'],
  },
  {
    key: 'talent tests taken?',
    label: 'Talent tests taken?',
    options: ['Yes', 'No'],
  },
  {
    key: 'olympiads',
    label: 'Participated in Olympiads?',
    options: ['Yes', 'No'],
  },
  {
    key: 'reading and writing skills',
    label: 'Reading & Writing Skills',
    options: ['Excellent', 'Medium', 'Poor'],
  },
  {
    key: 'memory capability score',
    label: 'Memory Capability',
    options: ['Excellent', 'Medium', 'Poor'],
  },
  {
    key: 'Interested subjects',
    label: 'Most Interested Subject',
    options: ['Computer Architecture','Networks','Software Engineering','Programming',
               'Database','Algorithms','Operating Systems','Data Science','Computer Science'],
  },
  {
    key: 'interested career area',
    label: 'Interested Career Area',
    options: ['System Developer','Business process analyst','Security','Cloud Computing',
               'Testing','Developer','Data Engineer','Business','Networking','Mobile Development'],
  },
  {
    key: 'Job/Higher Studies?',
    label: 'After graduation plan?',
    options: ['Job', 'Higher Studies'],
  },
  {
    key: 'Type of company want to settle in?',
    label: 'Preferred company type?',
    options: ['BPA', 'Cloud Services', 'Finance', 'Product based', 'Service Based', 'Testing'],
  },
  {
    key: 'Taken inputs from seniors or elders',
    label: 'Taken guidance from seniors?',
    options: ['Yes', 'No'],
  },
  {
    key: 'interested in games',
    label: 'Interested in games?',
    options: ['Yes', 'No'],
  },
  {
    key: 'Interested Type of Books',
    label: 'Preferred book type?',
    options: ['Series','Autobiographies','Travel','Guide','Health','Journals',
               'Action and Adventure','Comics','Horror','Self help','Fantasy','History','Satire'],
  },
  {
    key: 'Salary Range Expected',
    label: 'Expected salary range',
    options: ['0-3 Lakh', '3-5 Lakh', '5-8 Lakh', '8-15 Lakh', '15+ Lakh'],
  },
  {
    key: 'In a Realtionship?',
    label: 'In a relationship?',
    options: ['Yes', 'No'],
  },
  {
    key: 'Gentle or Tuff behaviour?',
    label: 'General behaviour?',
    options: ['Gentle', 'Tough'],
  },
  {
    key: 'Management or Technical',
    label: 'Preference?',
    options: ['Management', 'Technical'],
  },
  {
    key: 'Salary/work',
    label: 'Priority: Salary or Work?',
    options: ['Salary', 'Work'],
  },
  {
    key: 'hard/smart worker',
    label: 'Work style?',
    options: ['Hard Worker', 'Smart Worker'],
  },
  {
    key: 'worked in teams ever?',
    label: 'Worked in teams before?',
    options: ['Yes', 'No'],
  },
  {
    key: 'Introvert',
    label: 'Personality type?',
    options: ['Yes (Introvert)', 'No (Extrovert)'],
  },
]

const SECTIONS = [
  { id: 'academic',  label: '📚 Academic Marks',    fields: NUMERIC_FIELDS.slice(0, 9)  },
  { id: 'skills',    label: '💡 Skills & Activity',  fields: NUMERIC_FIELDS.slice(9)     },
  { id: 'profile',   label: '🙋 Personal Profile',   fields: CATEGORICAL_FIELDS           },
]

export default function MarksPredictor() {
  const navigate  = useNavigate()
  const [form,    setForm]    = useState({})
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const totalFields = NUMERIC_FIELDS.length + CATEGORICAL_FIELDS.length
  const filled      = Object.keys(form).filter(k => form[k] !== '').length
  const pct         = Math.round((filled / totalFields) * 100)

  const handleNum = (key, val) => setForm(p => ({ ...p, [key]: val }))
  const handleCat = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleSubmit = async () => {
    if (filled < totalFields) {
      setError(`Please fill all fields. ${totalFields - filled} remaining.`)
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/marks', { marks: form })
      setResults(res.data.predictions)
    } catch {
      setError('Cannot connect to server. Make sure Flask is running on port 5000.')
    }
    setLoading(false)
  }

  if (results) {
    return (
      <div style={s.page}>
        <button onClick={() => navigate('/')} style={s.back}>← Home</button>
        <h2 style={s.pageTitle} className="fade-up">Your Results</h2>
        <ResultCard
          predictions={results}
          mode="marks"
          onRetry={() => { setResults(null); setForm({}) }}
        />
      </div>
    )
  }

  return (
    <div style={s.page}>

      {/* Nav + progress */}
      <div style={s.nav}>
        <button onClick={() => navigate('/')} style={s.back}>← Home</button>
        <div style={s.progressWrap}>
          <div style={s.progressBar}>
            <div style={{ ...s.progressFill, width: `${pct}%` }} />
          </div>
          <span style={s.progressLabel}>{filled} / {totalFields}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={s.hero} className="fade-up">
        <h1 style={s.title}>📊 Career Predictor by Marks</h1>
        <p style={s.subtitle}>Fill in your academic scores and personal profile. All fields are required.</p>
      </div>

      {/* Sections */}
      {SECTIONS.map((section, si) => (
        <div key={section.id} style={s.section} className={`fade-up delay-${si + 1}`}>
          <div style={s.sectionTitle}>{section.label}</div>
          <div style={s.grid}>
            {section.fields.map(field => (
              <div key={field.key} style={s.card}>
                <label style={s.label}>{field.label}</label>

                {/* Numeric input */}
                {field.hint ? (
                  <div style={s.inputWrap}>
                    <input
                      type="number"
                      style={s.input}
                      placeholder={field.hint}
                      value={form[field.key] ?? ''}
                      onChange={e => handleNum(field.key, e.target.value)}
                    />
                  </div>
                ) : (
                  /* Categorical select */
                  <select
                    style={s.select}
                    value={form[field.key] ?? ''}
                    onChange={e => handleCat(field.key, e.target.value)}
                  >
                    <option value="">Select…</option>
                    {field.options.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Submit */}
      <div style={s.submitWrap}>
        {error && <p style={s.error}>{error}</p>}
        <button
          style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Analysing your profile…' : 'Predict My Career →'}
        </button>
      </div>

    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh', background: 'var(--bg)',
    padding: 'clamp(1rem, 3vw, 2rem) clamp(1.5rem, 5vw, 4rem)',
    display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center',
  },
  nav: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    width: '100%', maxWidth: 860,
  },
  back: {
    background: 'transparent', border: 'none', color: 'var(--muted)',
    fontSize: '0.9rem', cursor: 'pointer', flexShrink: 0,
  },
  progressWrap: { display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 },
  progressBar:  { flex: 1, height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', background: '#1a1917', borderRadius: 99, transition: 'width 0.3s ease' },
  progressLabel:{ fontSize: '0.8rem', color: 'var(--muted)', flexShrink: 0 },

  hero: { textAlign: 'center', maxWidth: 580 },
  title: { fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '0.5rem' },
  subtitle: { fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7 },
  pageTitle: { fontSize: '2rem', fontFamily: "'DM Serif Display', serif" },

  section: { width: '100%', maxWidth: 860 },
  sectionTitle: {
    fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--muted)',
    marginBottom: '0.9rem', paddingBottom: '0.5rem',
    borderBottom: '1px solid var(--border)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '0.85rem',
  },
  card: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '1rem',
  },
  label: { display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--muted)', marginBottom: '0.5rem' },
  inputWrap: {},
  input: {
    width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8,
    border: '1px solid var(--border)', background: 'var(--bg)',
    color: 'var(--text)', fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box',
  },
  select: {
    width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8,
    border: '1px solid var(--border)', background: 'var(--bg)',
    color: 'var(--text)', fontSize: '0.9rem', cursor: 'pointer',
  },

  submitWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '0.75rem', padding: '1rem 0 3rem',
  },
  submitBtn: {
    background: '#1a1917', color: '#f8f7f4', border: 'none',
    padding: '1rem 3rem', borderRadius: 12,
    fontSize: '1rem', fontWeight: 500, cursor: 'pointer',
  },
  error: { fontSize: '0.88rem', color: '#dc2626', textAlign: 'center' },
}

import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ResultCard from './ResultCard'

const SKILLS = [
  { key: 'Database Fundamentals',          label: 'Database Fundamentals',          emoji: '🗄️' },
  { key: 'Computer Architecture',          label: 'Computer Architecture',          emoji: '🖥️' },
  { key: 'Distributed Computing Systems',  label: 'Distributed Computing',          emoji: '☁️' },
  { key: 'Cyber Security',                 label: 'Cyber Security',                 emoji: '🔐' },
  { key: 'Networking',                     label: 'Networking',                     emoji: '🌐' },
  { key: 'Software Development',           label: 'Software Development',           emoji: '💻' },
  { key: 'Programming Skills',             label: 'Programming Skills',             emoji: '⌨️' },
  { key: 'Project Management',             label: 'Project Management',             emoji: '📋' },
  { key: 'Computer Forensics Fundamentals',label: 'Computer Forensics',             emoji: '🔍' },
  { key: 'Technical Communication',        label: 'Technical Communication',        emoji: '📝' },
  { key: 'AI ML',                          label: 'AI & Machine Learning',          emoji: '🤖' },
  { key: 'Software Engineering',           label: 'Software Engineering',           emoji: '⚙️' },
  { key: 'Business Analysis',              label: 'Business Analysis',              emoji: '📈' },
  { key: 'Communication skills',           label: 'Communication Skills',           emoji: '🗣️' },
  { key: 'Data Science',                   label: 'Data Science',                   emoji: '📊' },
  { key: 'Troubleshooting skills',         label: 'Troubleshooting',                emoji: '🛠️' },
  { key: 'Graphics Designing',             label: 'Graphics Designing',             emoji: '🎨' },
]

const LEVELS = ['Not Interested', 'Poor', 'Beginner', 'Average', 'Intermediate', 'Excellent', 'Professional']

const LEVEL_COLORS = {
  'Not Interested': '#f0ece4',
  'Poor':           '#fee2e2',
  'Beginner':       '#fef3e2',
  'Average':        '#fefce8',
  'Intermediate':   '#e8f0fe',
  'Excellent':      '#dcfce7',
  'Professional':   '#d1fae5',
}

export default function QuizApp() {
  const navigate   = useNavigate()
  const [answers,  setAnswers]  = useState({})
  const [results,  setResults]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const answered = Object.keys(answers).length
  const total    = SKILLS.length
  const pct      = Math.round((answered / total) * 100)

  const handleChange = (key, val) =>
    setAnswers(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async () => {
    if (answered < total) {
      setError(`Please answer all ${total} questions. You have ${total - answered} remaining.`)
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/quiz', { answers })
      setResults(res.data.predictions)
    } catch {
      setError('Cannot connect to the server. Make sure Flask is running on port 5000.')
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
          mode="quiz"
          onRetry={() => { setResults(null); setAnswers({}) }}
        />
      </div>
    )
  }

  return (
    <div style={s.page}>

      {/* Nav */}
      <div style={s.nav}>
        <button onClick={() => navigate('/')} style={s.back}>← Home</button>
        <div style={s.progressWrap}>
          <div style={s.progressBar}>
            <div style={{ ...s.progressFill, width: `${pct}%` }} />
          </div>
          <span style={s.progressLabel}>{answered} / {total}</span>
        </div>
      </div>

      {/* Title */}
      <div style={s.hero} className="fade-up">
        <h1 style={s.title}>🧠 Skill Interest Quiz</h1>
        <p style={s.subtitle}>Rate your current level in each area. Be honest — there are no wrong answers.</p>
      </div>

      {/* Skill cards */}
      <div style={s.grid}>
        {SKILLS.map((skill, i) => {
          const val = answers[skill.key]
          return (
            <div key={skill.key} style={{
              ...s.card,
              borderColor: val ? '#c8d8fe' : 'var(--border)',
              background: val ? '#f8fbff' : 'var(--surface)',
            }}
              className={`fade-up delay-${(i % 4) + 1}`}
            >
              <div style={s.cardTop}>
                <span style={s.skillEmoji}>{skill.emoji}</span>
                <span style={s.skillLabel}>{skill.label}</span>
                {val && <span style={{...s.pill, background: LEVEL_COLORS[val]}}>{val}</span>}
              </div>
              <div style={s.levelRow}>
                {LEVELS.map(lvl => (
                  <button key={lvl}
                    onClick={() => handleChange(skill.key, lvl)}
                    style={{
                      ...s.lvlBtn,
                      background: val === lvl ? '#1a1917' : 'transparent',
                      color: val === lvl ? '#f8f7f4' : 'var(--muted)',
                      borderColor: val === lvl ? '#1a1917' : 'var(--border)',
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Submit */}
      <div style={s.submitWrap}>
        {error && <p style={s.error}>{error}</p>}
        <button
          style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Analysing your profile…' : `Predict My Career →`}
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
  progressBar: {
    flex: 1, height: 6, background: 'var(--border)',
    borderRadius: 99, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', background: '#1a1917', borderRadius: 99,
    transition: 'width 0.3s ease',
  },
  progressLabel: { fontSize: '0.8rem', color: 'var(--muted)', flexShrink: 0 },

  hero: { textAlign: 'center', maxWidth: 560 },
  title: { fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '0.5rem' },
  subtitle: { fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7 },
  pageTitle: { fontSize: '2rem', fontFamily: "'DM Serif Display', serif" },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '1rem', width: '100%', maxWidth: 860,
  },
  card: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '1.25rem',
    transition: 'border-color 0.2s, background 0.2s',
  },
  cardTop: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.9rem', flexWrap: 'wrap' },
  skillEmoji: { fontSize: '1.2rem' },
  skillLabel: { fontSize: '0.93rem', fontWeight: 500, flex: 1 },
  pill: {
    fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem',
    borderRadius: 99, letterSpacing: '0.04em',
  },

  levelRow: { display: 'flex', flexWrap: 'wrap', gap: '0.35rem' },
  lvlBtn: {
    fontSize: '0.75rem', fontWeight: 500, padding: '0.3rem 0.65rem',
    borderRadius: 99, border: '1px solid', cursor: 'pointer',
    transition: 'all 0.15s ease',
  },

  submitWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '0.75rem', padding: '1rem 0 2rem',
  },
  submitBtn: {
    background: '#1a1917', color: '#f8f7f4', border: 'none',
    padding: '1rem 3rem', borderRadius: 12,
    fontSize: '1rem', fontWeight: 500, cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  error: { fontSize: '0.88rem', color: '#dc2626', textAlign: 'center' },
}

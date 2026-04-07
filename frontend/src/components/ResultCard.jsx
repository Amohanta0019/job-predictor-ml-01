import { useRef } from 'react'

/* ── colour per rank ── */
const RANK_COLORS = ['#2d5be3', '#1d8a5e', '#c47c1a']
const RANK_LABELS = ['Best Match', '2nd Match', '3rd Match']

export default function ResultCard({ predictions, mode, onRetry }) {
  const cardRef = useRef(null)

  const handleScreenshot = () => {
    /* guide user since we can't auto-screenshot in browser */
    alert('Press  Ctrl + Shift + S  (Windows Snipping Tool) or use your browser\'s screenshot extension to capture this card.\n\nTip: zoom out a little for the full card to fit.')
  }

  return (
    <div style={s.wrap}>

      {/* ── The result card ── */}
      <div ref={cardRef} style={s.card} id="result-card">

        {/* Card header */}
        <div style={s.cardHeader}>
          <div style={s.logoSmall}>CP</div>
          <div>
            <div style={s.cardMode}>{mode === 'quiz' ? '🧠 Quiz Result' : '📊 Marks Result'}</div>
            <div style={s.cardDate}>{new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</div>
          </div>
          <div style={s.badge}>CareerPath</div>
        </div>

        <div style={s.divider} />

        {/* Predictions */}
        <div style={s.predictions}>
          {predictions.map((p, i) => (
            <div key={i} style={s.predRow} className={`fade-up delay-${i + 1}`}>

              {/* Rank dot + role */}
              <div style={s.predLeft}>
                <div style={{...s.dot, background: RANK_COLORS[i]}} />
                <div>
                  <div style={s.rankLabel}>{RANK_LABELS[i]}</div>
                  <div style={s.roleName}>{p.role}</div>
                  {p.career_path && (
                    <div style={s.careerPath}>↳ {p.career_path}</div>
                  )}
                </div>
              </div>

              {/* Probability bar */}
              <div style={s.predRight}>
                <div style={s.pct}>{p.probability}%</div>
                <div style={s.barBg}>
                  <div style={{
                    ...s.barFill,
                    width: `${Math.min(p.probability, 100)}%`,
                    background: RANK_COLORS[i],
                    animationName: 'barGrow',
                    animationDuration: '0.9s',
                    animationDelay: `${0.2 + i * 0.15}s`,
                    animationFillMode: 'both',
                  }} />
                </div>
              </div>

            </div>
          ))}
        </div>

        <div style={s.divider} />

        {/* Skills sections side by side */}
        <div style={s.skillsGrid}>

          {/* Top match career path skills */}
          {predictions[0]?.skills_needed?.length > 0 && (
            <div style={s.skillsBlock}>
              <div style={s.skillsHeading}>Career path skills</div>
              <div style={s.tagRow}>
                {predictions[0].skills_needed.map(sk => (
                  <span key={sk} style={{...s.tag, ...s.tagBlue}}>{sk}</span>
                ))}
              </div>
            </div>
          )}

          {/* Skills to improve */}
          {predictions[0]?.improve?.length > 0 && (
            <div style={s.skillsBlock}>
              <div style={s.skillsHeading}>Skills to build</div>
              <div style={s.tagRow}>
                {predictions[0].improve.map(sk => (
                  <span key={sk} style={{...s.tag, ...s.tagAmber}}>{sk}</span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Card footer watermark */}
        <div style={s.cardFooter}>
          Powered by CareerPath ML · careerpath.local
        </div>

      </div>

      {/* ── Action buttons (outside card so they don't appear in screenshot) ── */}
      <div style={s.actions}>
        <button style={s.btnOutline} onClick={handleScreenshot}>
          📸 Screenshot Card
        </button>
        <button style={s.btnPrimary} onClick={onRetry}>
          ↩ Try Again
        </button>
      </div>

    </div>
  )
}

const s = {
  wrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' },

  card: {
    background: '#ffffff', borderRadius: 20, padding: '2rem',
    width: '100%', maxWidth: 680,
    border: '1px solid var(--border)',
    boxShadow: '0 8px 48px rgba(0,0,0,0.10)',
  },

  cardHeader: { display: 'flex', alignItems: 'center', gap: '0.85rem' },
  logoSmall: {
    width: 36, height: 36, borderRadius: 8,
    background: '#1a1917', color: '#f8f7f4',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', flexShrink: 0,
  },
  cardMode: { fontSize: '0.95rem', fontWeight: 600, color: '#1a1917' },
  cardDate: { fontSize: '0.78rem', color: '#9e9a93', marginTop: 2 },
  badge: {
    marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: '#9e9a93', border: '1px solid #e8e4dc',
    padding: '0.3rem 0.75rem', borderRadius: 99,
  },

  divider: { height: 1, background: 'var(--border)', margin: '1.5rem 0' },

  predictions: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  predRow: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
  predLeft: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: '1 1 220px' },
  dot: { width: 10, height: 10, borderRadius: '50%', marginTop: 6, flexShrink: 0 },
  rankLabel: { fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: '#9e9a93', marginBottom: 2 },
  roleName: { fontSize: '1.05rem', fontWeight: 600, color: '#1a1917',
    fontFamily: "'DM Serif Display', serif" },
  careerPath: { fontSize: '0.8rem', color: '#9e9a93', marginTop: 2 },

  predRight: { flex: '1 1 180px' },
  pct: { fontSize: '1.5rem', fontWeight: 600, color: '#1a1917',
    fontFamily: "'DM Serif Display', serif", marginBottom: 6 },
  barBg: { height: 6, background: '#f0ece4', borderRadius: 99, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99 },

  skillsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  skillsBlock: {},
  skillsHeading: {
    fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#9e9a93', marginBottom: '0.6rem',
  },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem' },
  tag: { fontSize: '0.78rem', padding: '0.3rem 0.7rem', borderRadius: 99, fontWeight: 500 },
  tagBlue: { background: '#e8f0fe', color: '#2d5be3' },
  tagAmber: { background: '#fef3e2', color: '#c47c1a' },

  cardFooter: {
    marginTop: '1.5rem', textAlign: 'center',
    fontSize: '0.72rem', color: '#c8c3bb', letterSpacing: '0.05em',
  },

  actions: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' },
  btnOutline: {
    padding: '0.7rem 1.5rem', borderRadius: 10, fontSize: '0.9rem', fontWeight: 500,
    background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)',
    cursor: 'pointer',
  },
  btnPrimary: {
    padding: '0.7rem 1.5rem', borderRadius: 10, fontSize: '0.9rem', fontWeight: 500,
    background: 'var(--text)', color: 'var(--bg)', border: 'none', cursor: 'pointer',
  },
}

import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>

      {/* Header */}
      <header style={s.header} className="fade-up">
        <div style={s.logoMark}>CC</div>
        <span style={s.logoText}>CareerCompass</span>
      </header>

      {/* Hero */}
      <main style={s.main}>
        <div className="fade-up" style={s.eyebrow}>Discover your direction</div>
        <h1 style={s.headline} className="fade-up delay-1">
          Find the career<br />
          <em>built for you.</em>
        </h1>
        <p style={s.sub} className="fade-up delay-2">
          Two ways to explore. Pick the one that fits how you think about yourself.
        </p>

        {/* Cards */}
        <div style={s.cards} className="fade-up delay-3">

          <button style={s.card} onClick={() => navigate('/marks')}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={s.cardTop}>
              <span style={s.num}>01</span>
              <span style={{...s.tag, background:'#e8f0fe', color:'#2d5be3'}}>Academic</span>
            </div>
            <div style={s.cardIcon}>📊</div>
            <h2 style={s.cardTitle}>Predict by Marks</h2>
            <p style={s.cardDesc}>
              Enter your academic scores and subject percentages. Our model analyses your
              performance profile and maps it to real career outcomes.
            </p>
            <div style={s.cardArrow}>
              <span>Get started</span>
              <span style={s.arrow}>→</span>
            </div>
          </button>

          <button style={{...s.card, ...s.cardDark}} onClick={() => navigate('/quiz')}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={s.cardTop}>
              <span style={{...s.num, color:'#c8b89a'}}>02</span>
              <span style={{...s.tag, background:'rgba(200,184,154,0.2)', color:'#c8b89a'}}>Interest-based</span>
            </div>
            <div style={s.cardIcon}>🧠</div>
            <h2 style={{...s.cardTitle, color:'#f8f7f4'}}>Take the Quiz</h2>
            <p style={{...s.cardDesc, color:'#9e9a93'}}>
              Rate your interest and skill across 17 technology areas. Takes 3 minutes.
              Tells you where you naturally belong.
            </p>
            <div style={{...s.cardArrow, color:'#c8b89a'}}>
              <span>Start quiz</span>
              <span style={s.arrow}>→</span>
            </div>
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer style={s.footer} className="fade-up delay-4">
        Built with ML · Scikit-learn · React · Flask
      </footer>

    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    padding: '0 clamp(1.5rem, 5vw, 5rem)',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    padding: '1.75rem 0', borderBottom: '1px solid var(--border)',
  },
  logoMark: {
    width: 36, height: 36, borderRadius: 8,
    background: 'var(--text)', color: 'var(--bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em',
  },
  logoText: { fontSize: '1rem', fontWeight: 500, letterSpacing: '-0.01em' },

  main: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '4rem 0 2rem', textAlign: 'center',
  },
  eyebrow: {
    fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem',
  },
  headline: {
    fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', lineHeight: 1.1,
    marginBottom: '1.25rem', color: 'var(--text)',
  },
  sub: {
    fontSize: '1.05rem', color: 'var(--muted)', maxWidth: 460,
    lineHeight: 1.7, marginBottom: '3.5rem',
  },

  cards: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.25rem', width: '100%', maxWidth: 780, textAlign: 'left',
  },
  card: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '2rem', cursor: 'pointer',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    boxShadow: 'var(--shadow)', textAlign: 'left',
  },
  cardDark: { background: '#1a1917', border: '1px solid #2e2c28' },

  cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' },
  num: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em' },
  tag: {
    fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.06em',
    padding: '0.25rem 0.7rem', borderRadius: 99, textTransform: 'uppercase',
  },

  cardIcon: { fontSize: '2rem', marginBottom: '1rem' },
  cardTitle: { fontSize: '1.4rem', marginBottom: '0.75rem', color: 'var(--text)' },
  cardDesc: {
    fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.7,
    marginBottom: '1.75rem',
  },
  cardArrow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    fontSize: '0.88rem', fontWeight: 500, color: 'var(--text)',
    borderTop: '1px solid var(--border)', paddingTop: '1rem',
  },
  arrow: { fontSize: '1.1rem' },

  footer: {
    textAlign: 'center', padding: '1.5rem 0',
    borderTop: '1px solid var(--border)',
    fontSize: '0.8rem', color: 'var(--muted)',
  },
}

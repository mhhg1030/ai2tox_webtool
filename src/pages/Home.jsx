import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const s = {
  page: { minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' },
  hero: {
    background: 'linear-gradient(135deg, #EBF2FB 0%, #FCEEF5 100%)',
    padding: '72px 40px 60px', textAlign: 'center', borderBottom: '1px solid var(--border)',
  },
  tag: {
    display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent)',
    fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
    padding: '4px 14px', borderRadius: '99px', marginBottom: '20px',
  },
  h1: {
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 600, lineHeight: 1.2,
    letterSpacing: '-0.02em', color: 'var(--text-1)', maxWidth: '700px', margin: '0 auto 16px',
  },
  sub: { fontSize: '1.05rem', color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.7 },
  btnRow: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    background: 'var(--brand)', color: '#fff', padding: '11px 28px',
    borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', border: 'none',
  },
  btnAccent: {
    background: 'var(--accent)', color: '#fff', padding: '11px 28px',
    borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', border: 'none',
  },
  btnSecondary: {
    background: '#fff', color: 'var(--text-1)', padding: '11px 28px',
    borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 500,
    cursor: 'pointer', border: '1px solid var(--border)',
  },
  statsRow: { display: 'flex', justifyContent: 'center', background: '#fff', borderBottom: '1px solid var(--border)' },
  stat: { padding: '24px 40px', textAlign: 'center', borderRight: '1px solid var(--border)' },
  statNum: { fontSize: '1.6rem', fontWeight: 600, color: 'var(--brand)', letterSpacing: '-0.02em' },
  statLabel: { fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '2px' },
  section: { padding: '48px 40px', maxWidth: '960px', margin: '0 auto', width: '100%' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 600, marginBottom: '24px', color: 'var(--text-1)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' },
  card: { background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' },
  cardIcon: {
    width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem', marginBottom: '12px',
  },
  cardTitle: { fontWeight: 600, marginBottom: '6px', fontSize: '0.95rem' },
  cardBody: { fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6 },
}

const STATS = [
  { num: '580', label: 'Total records' },
  { num: '500+', label: 'Protein features' },
  { num: '3', label: 'NP types' },
  { num: '10', label: 'NP sub-types' },
]

const FEATURES = [
  {
    icon: '🧬', iconBg: 'var(--brand-light)', iconColor: 'var(--brand)',
    title: 'Protein Corona Data',
    body: 'Quantitative protein abundance data for nanoparticle-protein corona interactions across 500+ unique plasma proteins.',
  },
  {
    icon: '⚗️', iconBg: 'var(--accent-light)', iconColor: 'var(--accent)',
    title: 'NP Characterization',
    body: 'Records span Inorganic, Organic, and Carbon-Based nanoparticles with full physicochemical metadata: size, zeta potential, modification type and charge.',
  },
  {
    icon: '🔬', iconBg: '#EEF8F2', iconColor: '#2E7D5C',
    title: 'Experimental Conditions',
    body: 'Incubation time, protein source (human plasma/serum), plasma concentration, solvent, shaking conditions, and washing steps all recorded.',
  },
  {
    icon: '📊', iconBg: '#FFF7EC', iconColor: '#9A6020',
    title: 'AI-Ready Format',
    body: 'Both datasets (Cleaned_Proteins_Regression and NP-PC_Database_Part_) are structured for direct ML model training and regression analysis.',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const { user, signInWithGoogle } = useAuth()

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.tag}>Nanoparticle Protein Corona</div>
        <h1 style={s.h1}>NP-PC Protein Corona Database</h1>
        <p style={s.sub}>
          Quantitative protein corona data for nanoparticles incubated with human plasma and serum —
          built to enable AI-driven prediction of bio-nano interactions.
        </p>
        <div style={s.btnRow}>
          <button style={s.btnPrimary} onClick={() => navigate('/dashboard')}>Explore Data</button>
          {!user && (
            <button style={s.btnAccent} onClick={signInWithGoogle}>Sign in with Google</button>
          )}
          <button style={s.btnSecondary} onClick={() => navigate('/tutorial')}>View Tutorial</button>
        </div>
      </div>

      <div style={s.statsRow}>
        {STATS.map((st, i) => (
          <div key={i} style={{ ...s.stat, ...(i === STATS.length - 1 ? { borderRight: 'none' } : {}) }}>
            <div style={s.statNum}>{st.num}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>What's in the database</div>
        <div style={s.grid}>
          {FEATURES.map((f, i) => (
            <div key={i} style={s.card}>
              <div style={{ ...s.cardIcon, background: f.iconBg, color: f.iconColor }}>{f.icon}</div>
              <div style={s.cardTitle}>{f.title}</div>
              <div style={s.cardBody}>{f.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
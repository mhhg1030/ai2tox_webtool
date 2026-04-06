const s = {
  page: { maxWidth: '760px', margin: '0 auto', padding: '40px 24px' },
  h1: { fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.01em' },
  intro: { color: 'var(--text-2)', marginBottom: '36px', lineHeight: 1.7 },
  section: { marginBottom: '32px' },
  sectionNum: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '28px', height: '28px', borderRadius: '50%',
    background: 'var(--brand)', color: '#fff',
    fontSize: '0.8rem', fontWeight: 600, marginRight: '10px', flexShrink: 0,
  },
  sectionTitle: { fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', marginBottom: '10px' },
  card: {
    background: '#fff', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '18px 20px',
    fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.7,
  },
  li: { marginBottom: '6px' },
}

const STEPS = [
  {
    title: 'Log in to the platform',
    body: 'Click the Login button in the top-right corner. You can sign in with your Google account or Microsoft account. New users will be prompted to register first.',
  },
  {
    title: 'Navigate to the Dashboard',
    body: 'After logging in, click the Dashboard tab in the navigation bar. This is your main view of the nanoparticle dataset.',
  },
  {
    title: 'Browse and search data',
    body: 'Use the search bar to search across all fields. The data table shows all nanoparticle datasets with key properties including particle type, core material, targeting strategy, size, and tumor model.',
  },
  {
    title: 'Filter the data',
    body: 'Click the Filter button (top right of the table) to open the filter panel. Toggle fields to filter by: Particle Type, Targeting Strategy, Size range, Zeta Potential range. Use Intersection mode to require all conditions, or OR mode to match any.',
  },
  {
    title: 'View details and graphs',
    body: 'Click the ⓘ Details button on any row to see full annotations, tissue concentration data table, and blood concentration data table for that data point. Click 📈 Graph to see concentration-over-time charts.',
  },
  {
    title: 'Download data',
    body: 'Use the Save button (top right of the table) to download the current filtered dataset as a CSV file.',
  },
  {
    title: 'Explore delivery efficiency charts',
    body: 'Navigate to the Charts section in the sidebar to explore delivery efficiency broken down by: Surface Charge, Tumor Model, Organ Cancer Type, Inorganic Material, and Organic Material.',
  },
]

export default function Tutorial() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>Tutorial</h1>
      <p style={s.intro}>
        Step-by-step guide to navigating and retrieving nanoparticle data from the Nano-Tumor Database.
      </p>

      {STEPS.map((step, i) => (
        <div key={i} style={s.section}>
          <div style={s.sectionTitle}>
            <span style={s.sectionNum}>{i + 1}</span>
            {step.title}
          </div>
          <div style={s.card}>{step.body}</div>
        </div>
      ))}

      <div style={{ ...s.card, background: 'var(--brand-light)', border: '1px solid var(--brand)', borderRadius: 'var(--radius-lg)', marginTop: '8px' }}>
        <strong style={{ color: 'var(--brand)' }}>About the database:</strong>{' '}
        <span style={{ color: 'var(--text-2)' }}>
          The Nano-Tumor Database contains time vs. concentration data for different types of nanoparticles
          in plasma, tissues, and tumors in tumor-bearing mice after intravenous injection.
          It currently houses 535 tumor datasets with 2,349 data points from 298 published studies.
        </span>
      </div>
    </div>
  )
}

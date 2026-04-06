const s = {
  page: { maxWidth: '640px', margin: '0 auto', padding: '40px 24px' },
  h1: { fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.01em' },
  intro: { color: 'var(--text-2)', marginBottom: '32px', lineHeight: 1.7 },
  card: {
    background: '#fff', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '24px',
    marginBottom: '16px',
  },
  label: { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' },
  input: {
    width: '100%', padding: '9px 12px', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', outline: 'none',
    background: 'var(--surface-2)', marginBottom: '16px', display: 'block',
    fontFamily: 'var(--font-sans)',
  },
  textarea: {
    width: '100%', padding: '9px 12px', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', outline: 'none',
    background: 'var(--surface-2)', marginBottom: '16px', display: 'block',
    fontFamily: 'var(--font-sans)', resize: 'vertical', minHeight: '120px',
  },
  submitBtn: {
    background: 'var(--brand)', color: '#fff',
    padding: '10px 28px', borderRadius: 'var(--radius-sm)',
    fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', border: 'none',
  },
  infoRow: { display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '14px' },
  infoIcon: { fontSize: '1rem', marginTop: '2px' },
  infoText: { fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6 },
}

export default function Contact() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>Contact Us</h1>
      <p style={s.intro}>
        Have questions about the database, data submissions, or research collaborations?
        Reach out to our team.
      </p>

      <div style={s.card}>
        <div style={s.infoRow}>
          <span style={s.infoIcon}>🏛</span>
          <div style={s.infoText}>
            <strong>University of California, Riverside</strong><br />
            College of Public Health and Health Professions<br />
            Department of Environmental and Global Health
          </div>
        </div>
        <div style={s.infoRow}>
          <span style={s.infoIcon}>📧</span>
          <div style={s.infoText}>
            For inquiries: <a href="mailto:huonglm010@gmail.com" style={{ color: 'var(--accent)' }}>huonglm010@gmail.com</a>
          </div>
        </div>
        <div style={s.infoRow}>
          <span style={s.infoIcon}>🔬</span>
          <div style={s.infoText}>
            To submit new datasets or report data errors, please include your study DOI and particle characterization data.
          </div>
        </div>
      </div>

      <div style={s.card}>
        <div style={{ fontWeight: 600, marginBottom: '16px', fontSize: '0.95rem' }}>Send a message</div>
        <div style={s.label}>Name</div>
        <input style={s.input} placeholder="Your name" />
        <div style={s.label}>Email</div>
        <input style={s.input} placeholder="your@email.com" type="email" />
        <div style={s.label}>Subject</div>
        <input style={s.input} placeholder="e.g. Data submission, collaboration inquiry" />
        <div style={s.label}>Message</div>
        <textarea style={s.textarea} placeholder="Your message..." />
        <button style={s.submitBtn} onClick={() => alert('Message form — wire up to your email service or Supabase edge function')}>
          Send message
        </button>
      </div>
    </div>
  )
}

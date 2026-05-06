import { useState } from 'react'

const API_URL = 'http://localhost:8000'

const s = {
  page: { maxWidth: '820px', margin: '0 auto', padding: '40px 24px' },
  h1: { fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.01em' },
  intro: { color: 'var(--text-2)', marginBottom: '32px', lineHeight: 1.7 },
  card: {
    background: '#fff', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '20px',
  },
  sectionTitle: { fontWeight: 600, fontSize: '0.95rem', marginBottom: '14px', color: 'var(--text-1)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  label: {
    fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-3)',
    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px',
  },
  select: {
    width: '100%', padding: '8px 10px', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', outline: 'none',
    background: 'var(--surface-2)', color: 'var(--text-1)',
  },
  submitBtn: (loading) => ({
    background: loading ? 'var(--border-2)' : 'var(--brand)',
    color: '#fff', padding: '11px 32px',
    borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 500,
    cursor: loading ? 'not-allowed' : 'pointer',
    border: 'none', width: '100%', marginTop: '8px',
    transition: 'background 0.15s',
  }),
  errorBox: {
    marginTop: '16px', padding: '14px',
    background: 'var(--accent-light)', border: '1px solid var(--accent)',
    borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--accent-dark)',
  },
  rocGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px',
  },
  rocImg: {
    width: '100%', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
  },
}

const PROTEIN_LABELS = {
  APOE: { name: 'Apolipoprotein E', short: 'APOE' },
  APOB: { name: 'Apolipoprotein B-100', short: 'APOB' },
  CO3:  { name: 'Complement C3', short: 'CO3' },
  CLUS: { name: 'Clusterin', short: 'CLUS' },
}

const FIELD_OPTIONS = {
  Type:       ['Inorganic', 'Organic', 'Carbon-Based'],
  Subtype:    ['Silica', 'Metal', 'Metal Oxide', 'Lipid', 'Polystyrene', 'Carbon', 'DNA', 'Latex', 'Niosome'],
  Size_Group: ['<50', '50~100', '100~150', '>150'],
  ZP_Group:   ['<-50', '-50~-10', '-10~+10', '+10~+50', '>+50'],
  ZP_Charge:  ['Negative', 'Neutral', 'Positive'],
  Mod_Charge: ['No Modification', 'Positive', 'Neutral', 'Negative'],
  In_Time:    ['<30', '30~60', '>60'],
  Shaking:    ['Y', 'N'],
  model_name: ['KNN', 'LGBM', 'RF', 'SVM', 'XGBoost'],
}

const FIELD_LABELS = {
  Type:       'NP Type',
  Subtype:    'NP Sub-Type',
  Size_Group: 'Size Group (nm)',
  ZP_Group:   'Zeta Potential Group (mV)',
  ZP_Charge:  'ZP Charge',
  Mod_Charge: 'Modification Charge',
  In_Time:    'Incubation Time',
  Shaking:    'Shaking / Agitation',
  model_name: 'ML Model',
}

export default function Webtool() {
  const [form, setForm] = useState({
    Size_Group: '100~150',
    ZP_Group:   '-50~-10',
    In_Time:    '30~60',
    Type:       'Inorganic',
    Subtype:    'Silica',
    ZP_Charge:  'Negative',
    Mod_Charge: 'No Modification',
    Shaking:    'Y',
    model_name: 'XGBoost',
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showRoc, setShowRoc] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    setResults(null)
    setShowRoc(false)
    try {
      const payload = {
        Size_Group: form.Size_Group,
        ZP_Group:   form.ZP_Group,
        In_Time:    form.In_Time,
        model_name: form.model_name,
        Type_Inorganic:    form.Type === 'Inorganic'    ? 1 : 0,
        Type_Organic:      form.Type === 'Organic'      ? 1 : 0,
        Type_Carbon_Based: form.Type === 'Carbon-Based' ? 1 : 0,
        Subtype_Silica:      form.Subtype === 'Silica'      ? 1 : 0,
        Subtype_Metal:       form.Subtype === 'Metal'        ? 1 : 0,
        Subtype_Metal_Oxide: form.Subtype === 'Metal Oxide'  ? 1 : 0,
        Subtype_Lipid:       form.Subtype === 'Lipid'        ? 1 : 0,
        Subtype_Polystyrene: form.Subtype === 'Polystyrene'  ? 1 : 0,
        Subtype_Carbon:      form.Subtype === 'Carbon'       ? 1 : 0,
        Subtype_DNA:         form.Subtype === 'DNA'          ? 1 : 0,
        Subtype_Latex:       form.Subtype === 'Latex'        ? 1 : 0,
        Subtype_Niosome:     form.Subtype === 'Niosome'      ? 1 : 0,
        ZP_Charge_Negative: form.ZP_Charge === 'Negative' ? 1 : 0,
        ZP_Charge_Neutral:  form.ZP_Charge === 'Neutral'  ? 1 : 0,
        ZP_Charge_Positive: form.ZP_Charge === 'Positive' ? 1 : 0,
        Mod_Charge_No_Modification: form.Mod_Charge === 'No Modification' ? 1 : 0,
        Mod_Charge_Positive:        form.Mod_Charge === 'Positive'        ? 1 : 0,
        Mod_Charge_Neutral:         form.Mod_Charge === 'Neutral'         ? 1 : 0,
        Mod_Charge_Negative:        form.Mod_Charge === 'Negative'        ? 1 : 0,
      }

      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      setResults(data)
    } catch (e) {
      setError('Could not connect to prediction API. Make sure the Python server is running with: uvicorn api:app --reload')
    }
    setLoading(false)
  }

  const Field = ({ fieldKey }) => (
    <div>
      <div style={s.label}>{FIELD_LABELS[fieldKey]}</div>
      <select style={s.select} value={form[fieldKey]} onChange={e => set(fieldKey, e.target.value)}>
        {FIELD_OPTIONS[fieldKey].map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Protein Corona Prediction Tool</h1>
      <p style={s.intro}>
        Enter your nanoparticle physicochemical properties to predict whether key proteins
        will be present or absent in the protein corona using trained ML classifiers.
      </p>

      {/* Input form */}
      <div style={s.card}>
        <div style={s.sectionTitle}>Nanoparticle Properties</div>
        <div style={s.grid}>
          {Object.keys(FIELD_LABELS).map(k => <Field key={k} fieldKey={k} />)}
        </div>
      </div>

      <button style={s.submitBtn(loading)} onClick={handlePredict} disabled={loading}>
        {loading ? 'Running prediction...' : '→ Predict Protein Corona'}
      </button>

      {error && <div style={s.errorBox}>{error}</div>}

      {/* Results */}
      {results && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '6px' }}>
            Prediction Results
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-3)', marginBottom: '16px' }}>
            Predicted presence/absence of 4 key proteins using {form.model_name} classifier.
          </div>

          {/* Result cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {Object.entries(results).map(([protein, result]) => {
              const isPresent = result.prediction === 'Present'
              return (
                <div key={protein} style={{
                  background: '#fff',
                  border: `1px solid ${isPresent ? '#3A6B3A' : 'var(--accent)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                }}>
                  <div style={{
                    width: '72px', flexShrink: 0,
                    background: isPresent ? '#3A6B3A' : 'var(--accent)',
                    color: '#fff', borderRadius: 'var(--radius-sm)',
                    padding: '6px 0', textAlign: 'center',
                    fontSize: '0.75rem', fontWeight: 600,
                  }}>
                    {result.prediction}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {PROTEIN_LABELS[protein].name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                      {PROTEIN_LABELS[protein].short}
                    </div>
                  </div>
                  <div style={{ width: '160px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Confidence</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isPresent ? '#3A6B3A' : 'var(--accent)' }}>
                        {result.confidence}%
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${result.confidence}%`, height: '100%',
                        background: isPresent ? '#3A6B3A' : 'var(--accent)',
                        borderRadius: '3px', transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Confidence overview chart */}
          <div style={s.card}>
            <div style={s.sectionTitle}>Confidence Overview</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(results).map(([protein, result]) => {
                const isPresent = result.prediction === 'Present'
                return (
                  <div key={protein} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                      {protein}
                    </div>
                    <div style={{ flex: 1, height: '22px', background: 'var(--surface-3)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${result.confidence}%`, height: '100%',
                        background: isPresent ? '#EEF8EE' : 'var(--accent-light)',
                        borderRight: `3px solid ${isPresent ? '#3A6B3A' : 'var(--accent)'}`,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                    <div style={{ width: '100px', fontSize: '0.78rem', textAlign: 'right', color: 'var(--text-2)' }}>
                      {result.confidence}% {isPresent ? '✓ Present' : '✗ Absent'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ROC Curves toggle */}
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={s.sectionTitle}>Model Performance — ROC Curves</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-3)', marginTop: '-8px' }}>
                  All 5 models compared on held-out test data for each protein target.
                </div>
              </div>
              <button
                onClick={() => setShowRoc(r => !r)}
                style={{
                  background: 'var(--brand-light)', color: 'var(--brand)',
                  border: '1px solid var(--brand)', borderRadius: 'var(--radius-sm)',
                  padding: '6px 16px', fontSize: '0.85rem', fontWeight: 500,
                  cursor: 'pointer', flexShrink: 0,
                }}>
                {showRoc ? 'Hide' : 'Show'} ROC Curves
              </button>
            </div>

            {showRoc && (
              <div style={s.rocGrid}>
                {['APOE', 'APOB', 'CO3', 'CLUS'].map(protein => (
                  <div key={protein}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '6px' }}>
                      {PROTEIN_LABELS[protein].name}
                    </div>
                    <img
                      src={`${API_URL}/roc/${protein}?t=${Date.now()}`}
                      alt={`ROC curve for ${protein}`}
                      style={s.rocImg}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-3)', lineHeight: 1.6 }}>
            Models trained with nested cross-validation + Bayesian hyperparameter optimization + SMOTE oversampling on human plasma protein corona data. For research use only.
          </div>
        </div>
      )}
    </div>
  )
}
import { useState, useMemo } from 'react'
import { MOCK_NP_DATA, NP_TYPES, NP_SUB_TYPES, ZP_CHARGES, SIZE_GROUPS, INCU_TIME_GROUPS, TOP_PROTEINS } from '../lib/mockData'

const DATASETS = [
  {
    id: 'cleaned_proteins',
    name: 'Cleaned Proteins Regression',
    description: 'Human plasma protein corona data — cleaned and regression-ready',
    records: 381,
    proteins: 500,
    source: 'Cleaned_Proteins_Regression',
    available: true,
  },
  {
    id: 'np_pc_part',
    name: 'NP-PC Database Part',
    description: 'Extended NP-PC database with additional experimental conditions',
    records: 199,
    proteins: 500,
    source: 'NP-PC_Database_Part_',
    available: true,
  },
  // {
  //   id: 'dataset_3',
  //   name: 'Dataset 3',
  //   description: 'Coming soon',
  //   records: null,
  //   proteins: null,
  //   source: null,
  //   available: false,
  // },
]

const pill = (active) => ({
  display: 'inline-flex', alignItems: 'center', gap: '4px',
  padding: '3px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 500,
  background: active ? 'var(--brand-light)' : 'var(--surface-2)',
  color: active ? 'var(--brand)' : 'var(--text-2)',
  border: `1px solid ${active ? 'var(--brand)' : 'var(--border)'}`,
  cursor: 'pointer', transition: 'all 0.12s', userSelect: 'none',
})

const pillPink = (active) => ({
  ...pill(active),
  background: active ? 'var(--accent-light)' : 'var(--surface-2)',
  color: active ? 'var(--accent)' : 'var(--text-2)',
  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
})

const btn = (variant = 'ghost') => ({
  padding: '7px 14px', borderRadius: 'var(--radius-sm)',
  fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'background 0.12s',
  background: variant === 'primary' ? 'var(--brand)' : variant === 'outline' ? '#fff' : 'transparent',
  color: variant === 'primary' ? '#fff' : 'var(--text-1)',
  border: variant === 'ghost' ? 'none' : `1px solid ${variant === 'primary' ? 'var(--brand)' : 'var(--border)'}`,
})

const cell = { padding: '10px 14px', fontSize: '0.85rem', whiteSpace: 'nowrap', color: 'var(--text-1)' }
const hcell = { ...cell, color: 'var(--text-3)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', background: 'var(--surface-3)' }

const META_COLS = [
  { key: 'source', label: 'Source', w: 200 },
  { key: 'np_type', label: 'NP Type', w: 110 },
  { key: 'np_sub_type', label: 'Sub Type', w: 100 },
  { key: 'size_group', label: 'Size Group', w: 90 },
  { key: 'zp_charge', label: 'ZP Charge', w: 90 },
  { key: 'zp_group', label: 'ZP Group', w: 90 },
  { key: 'incu_time_group', label: 'Incu Time', w: 90 },
  { key: 'shaking', label: 'Shaking', w: 70 },
]

const ZP_CHARGE_COLORS = {
  Negative: { bg: '#FCEEF5', color: '#A84B7A' },
  Neutral:  { bg: '#EBF2FB', color: '#3A6BAF' },
  Positive: { bg: '#EEF8F2', color: '#2E7D5C' },
}

export default function Dashboard() {
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [detail, setDetail] = useState(null)
  const [activeTab, setActiveTab] = useState('annotations')
  const [activeDataset, setActiveDataset] = useState('cleaned_proteins')

  const [filterNpType, setFilterNpType] = useState([])
  const [filterSubType, setFilterSubType] = useState([])
  const [filterCharge, setFilterCharge] = useState([])
  const [filterSize, setFilterSize] = useState([])
  const [filterTime, setFilterTime] = useState([])

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])

  // Filter data by active dataset source
  const datasetSource = DATASETS.find(d => d.id === activeDataset)?.source

  const filtered = useMemo(() => {
    return MOCK_NP_DATA.filter(p => {
      if (datasetSource && p.source !== datasetSource) return false
      if (search) {
        const q = search.trim().toLowerCase()
        const searchable = Object.values(p).map(v => (v == null ? '' : String(v)).toLowerCase()).join(' ')
        if (!searchable.includes(q)) return false
      }
      if (filterNpType.length && !filterNpType.includes(p.np_type)) return false
      if (filterSubType.length && !filterSubType.includes(p.np_sub_type)) return false
      if (filterCharge.length && !filterCharge.includes(p.zp_charge)) return false
      if (filterSize.length && !filterSize.includes(p.size_group)) return false
      if (filterTime.length && !filterTime.includes(p.incu_time_group)) return false
      return true
    })
  }, [search, datasetSource, filterNpType, filterSubType, filterCharge, filterSize, filterTime])

  const activeFilters = filterNpType.length + filterSubType.length + filterCharge.length + filterSize.length + filterTime.length

  const clearFilters = () => {
    setFilterNpType([]); setFilterSubType([])
    setFilterCharge([]); setFilterSize([]); setFilterTime([])
  }

  const FilterSection = ({ title, options, active, toggle, usePink }) => (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {options.map(t => (
          <span key={t} style={usePink ? pillPink(active.includes(t)) : pill(active.includes(t))}
            onClick={() => toggle(t)}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>

      {/* ── Dataset sidebar ── */}
      <aside style={{
        width: '220px', minWidth: '220px', background: '#fff',
        borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Datasets
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
          {DATASETS.map(ds => (
            <div
              key={ds.id}
              onClick={() => ds.available && setActiveDataset(ds.id)}
              style={{
                padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: '4px',
                background: activeDataset === ds.id ? 'var(--brand-light)' : 'transparent',
                border: `1px solid ${activeDataset === ds.id ? 'var(--brand)' : 'transparent'}`,
                cursor: ds.available ? 'pointer' : 'not-allowed',
                opacity: ds.available ? 1 : 0.45,
                transition: 'all 0.15s',
              }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: activeDataset === ds.id ? 'var(--brand)' : 'var(--text-1)', marginBottom: '3px' }}>
                {ds.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.4 }}>
                {ds.available ? (
                  <>{ds.records} records · {ds.proteins}+ proteins</>
                ) : (
                  'Coming soon'
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Filter sidebar ── */}
      <aside style={{
        width: filterOpen ? '240px' : '0', minWidth: filterOpen ? '240px' : '0',
        overflow: 'hidden', transition: 'all 0.2s ease',
        background: '#fff', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Filter Data</span>
            {activeFilters > 0 && (
              <button style={{ ...btn('ghost'), fontSize: '0.78rem', color: 'var(--accent)', padding: '2px 6px' }} onClick={clearFilters}>
                Clear all
              </button>
            )}
          </div>
          <FilterSection title="NP Type" options={NP_TYPES} active={filterNpType} toggle={v => toggleArr(filterNpType, setFilterNpType, v)} />
          <FilterSection title="Sub Type" options={NP_SUB_TYPES} active={filterSubType} toggle={v => toggleArr(filterSubType, setFilterSubType, v)} />
          <FilterSection title="ZP Charge" options={ZP_CHARGES} active={filterCharge} toggle={v => toggleArr(filterCharge, setFilterCharge, v)} usePink />
          <FilterSection title="Size Group" options={SIZE_GROUPS} active={filterSize} toggle={v => toggleArr(filterSize, setFilterSize, v)} />
          <FilterSection title="Incubation Time" options={INCU_TIME_GROUPS} active={filterTime} toggle={v => toggleArr(filterTime, setFilterTime, v)} usePink />
          <div style={{ marginTop: '8px', padding: '12px', background: 'var(--brand-light)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
            💡 Full data available after Supabase connection.
          </div>
        </div>
      </aside>

      {/* ── Main panel ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{ padding: '12px 20px', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {DATASETS.find(d => d.id === activeDataset)?.name}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginLeft: '10px' }}>
              {filtered.length} records
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontSize: '0.85rem' }}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search records..."
              style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 12px 7px 28px', width: '200px', outline: 'none', background: 'var(--surface-2)' }} />
          </div>
          <button style={{ ...btn('outline'), display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setFilterOpen(o => !o)}>
            ⊟ Filter
            {activeFilters > 0 && (
              <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: '99px', fontSize: '0.7rem', padding: '1px 6px' }}>{activeFilters}</span>
            )}
          </button>
          <button style={btn('outline')} title="Download CSV (available with Supabase)">↓ Save</button>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th style={{ ...hcell, width: 40 }}></th>
                {META_COLS.map(c => <th key={c.key} style={{ ...hcell, width: c.w, textAlign: 'left' }}>{c.label}</th>)}
                {TOP_PROTEINS.slice(0, 4).map(p => (
                  <th key={p} style={{ ...hcell, width: 130, textAlign: 'right' }}>{p.split(' ').slice(0, 2).join(' ')}</th>
                ))}
                <th style={{ ...hcell, width: 80 }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={META_COLS.length + TOP_PROTEINS.slice(0, 4).length + 2}
                    style={{ ...cell, textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>
                    No records found for this dataset.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => {
                  const chargeStyle = ZP_CHARGE_COLORS[row.zp_charge] || {}
                  return (
                    <tr key={row.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--surface-2)' }}>
                      <td style={cell}><input type="checkbox" style={{ accentColor: 'var(--brand)' }} /></td>
                      {META_COLS.map(c => (
                        <td key={c.key} style={cell}>
                          {c.key === 'zp_charge' && row[c.key] ? (
                            <span style={{ background: chargeStyle.bg, color: chargeStyle.color, padding: '2px 8px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 500 }}>
                              {row[c.key]}
                            </span>
                          ) : c.key === 'source' ? (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{row[c.key]}</span>
                          ) : (
                            row[c.key] ?? <span style={{ color: 'var(--text-3)' }}>—</span>
                          )}
                        </td>
                      ))}
                      {TOP_PROTEINS.slice(0, 4).map(p => (
                        <td key={p} style={{ ...cell, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                          {row[p] != null ? row[p].toFixed(2) : <span style={{ color: 'var(--text-3)' }}>—</span>}
                        </td>
                      ))}
                      <td style={cell}>
                        <button style={{ ...btn('primary'), padding: '4px 10px', fontSize: '0.8rem' }}
                          onClick={() => { setDetail(row); setActiveTab('annotations') }}>
                          ⓘ
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Detail Modal */}
      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,34,53,0.3)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setDetail(null)}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '600px', maxHeight: '82vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Record #{detail.id} — {detail.np_type} / {detail.np_sub_type}</span>
              <button style={{ ...btn('ghost'), fontSize: '1.1rem', color: 'var(--text-3)' }} onClick={() => setDetail(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              {[['annotations', 'Metadata'], ['proteins', 'Protein Abundances']].map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id)} style={{
                  padding: '10px 18px', fontSize: '0.875rem', fontWeight: 500, background: 'none', border: 'none',
                  borderBottom: activeTab === id ? '2px solid var(--brand)' : '2px solid transparent',
                  color: activeTab === id ? 'var(--brand)' : 'var(--text-2)', cursor: 'pointer',
                }}>{label}</button>
              ))}
            </div>
            <div style={{ padding: '16px 20px' }}>
              {activeTab === 'annotations' && (
                <>
                  {[
                    ['Source File', detail.source],
                    ['NP Type', detail.np_type],
                    ['NP Sub-Type', detail.np_sub_type],
                    ['Modification Type', detail.mod_type],
                    ['Modification Charge', detail.mod_charge],
                    ['Size Group', detail.size_group],
                    ['ZP Solvent', detail.zp_solvent],
                    ['ZP Group', detail.zp_group],
                    ['ZP Charge', detail.zp_charge],
                    ['Incubation Time Group', detail.incu_time_group],
                    ['Incubation Protein Source', detail.incu_protein_source],
                    ['Plasma Conc Group', detail.plasma_conc_group],
                    ['Shaking/Agitation', detail.shaking],
                    ['Washing Step Count', detail.washing_step_count],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--text-3)' }}>{label}</span>
                      <span style={{ fontWeight: 500 }}>{val ?? '—'}</span>
                    </div>
                  ))}
                </>
              )}
              {activeTab === 'proteins' && (
                <>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', marginBottom: '12px' }}>
                    Top protein abundances for this record.
                  </p>
                  {TOP_PROTEINS.map(p => (
                    <div key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--text-2)' }}>{p}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '80px', height: '6px', borderRadius: '3px', background: 'var(--border)', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, ((detail[p] ?? 0) / 20) * 100)}%`, height: '100%', background: 'var(--brand)', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', minWidth: '40px', textAlign: 'right' }}>
                          {detail[p] != null ? detail[p].toFixed(3) : '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
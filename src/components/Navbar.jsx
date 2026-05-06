import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const styles = {
  nav: {
    background: '#fff', borderBottom: '1px solid var(--border)',
    height: '56px', display: 'flex', alignItems: 'center',
    padding: '0 24px', position: 'sticky', top: 0, zIndex: 100,
  },
  logo: { display: 'flex', flexDirection: 'column', lineHeight: 1.1, marginRight: '32px' },
  logoTop: { fontWeight: 600, fontSize: '0.95rem', color: 'var(--brand)', letterSpacing: '-0.01em' },
  logoBottom: { fontWeight: 400, fontSize: '0.75rem', color: 'var(--text-3)' },
  links: { display: 'flex', gap: '4px', flex: 1 },
  link: {
    padding: '6px 14px', borderRadius: 'var(--radius-sm)',
    fontSize: '0.875rem', color: 'var(--text-2)', fontWeight: 500,
    transition: 'background 0.15s, color 0.15s',
  },
  activeLink: { background: 'var(--brand-light)', color: 'var(--brand)' },
  right: { display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' },
  avatar: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'var(--brand-light)', color: 'var(--brand)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
    border: '1.5px solid var(--brand)',
  },
  loginBtn: {
    background: 'var(--brand)', color: '#fff', padding: '7px 18px',
    borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 500,
    cursor: 'pointer', border: 'none', transition: 'background 0.15s',
  },
  dropdown: {
    position: 'absolute', top: '48px', right: '24px',
    background: '#fff', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '8px', minWidth: '180px',
    boxShadow: '0 4px 16px rgba(91,143,212,0.12)', zIndex: 200,
  },
  dropdownEmail: {
    fontSize: '0.75rem', color: 'var(--text-3)',
    padding: '4px 8px 8px', borderBottom: '1px solid var(--border)', marginBottom: '4px',
  },
  dropdownItem: {
    display: 'block', width: '100%', textAlign: 'left',
    padding: '7px 10px', borderRadius: 'var(--radius-sm)',
    fontSize: '0.875rem', color: 'var(--text-1)',
    background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.12s',
  },
}

export default function Navbar() {
  const { user, signInWithGoogle, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? '?'

  const navItems = [
    { to: '/', label: 'Home', end: true },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/webtool', label: 'Webtool' },
    { to: '/tutorial', label: 'Tutorial' },
    { to: '/contact', label: 'Contact Us' },
  ]

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span style={styles.logoTop}>NP-PC</span>
        <span style={styles.logoBottom}>Protein Corona Database</span>
      </div>
      <div style={styles.links}>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>
            {item.label}
          </NavLink>
        ))}
      </div>
      <div style={styles.right}>
        {user ? (
          <div style={{ position: 'relative' }}>
            <div style={styles.avatar} onClick={() => setOpen(o => !o)}>
              {user.user_metadata?.avatar_url
                ? <img src={user.user_metadata.avatar_url} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="" />
                : initials}
            </div>
            {open && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownEmail}>{user.email}</div>
                <button style={styles.dropdownItem}
                  onMouseOver={e => e.target.style.background = 'var(--surface-2)'}
                  onMouseOut={e => e.target.style.background = 'none'}
                  onClick={() => { navigate('/dashboard'); setOpen(false) }}>
                  Dashboard
                </button>
                <button style={{ ...styles.dropdownItem, color: 'var(--brand)' }}
                  onMouseOver={e => e.target.style.background = 'var(--brand-light)'}
                  onMouseOut={e => e.target.style.background = 'none'}
                  onClick={() => { signOut(); setOpen(false) }}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button style={styles.loginBtn} onClick={signInWithGoogle}>Login</button>
        )}
      </div>
    </nav>
  )
}
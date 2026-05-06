import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Webtool from './pages/Webtool'
import Tutorial from './pages/Tutorial'
import Contact from './pages/Contact'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/webtool" element={
          <ProtectedRoute>
            <Webtool />
          </ProtectedRoute>
        } />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AuthProvider>
  )
}
import { Routes, Route, Navigate } from 'react-router-dom'
import SplashPage from '@/pages/SplashPage'
import DashboardPage from '@/pages/DashboardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

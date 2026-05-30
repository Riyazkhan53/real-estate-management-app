import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROLES } from './constants/auth'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
import { DataProvider } from './context/DataContext'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Properties from './pages/Properties'
import Customers from './pages/Customers'
import Members from './pages/Members'
import Partners from './pages/Partners'
import Attendance from './pages/Attendance'
import Settings from './pages/Settings'

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="settings" element={<Settings />} />

                  <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
                    <Route path="projects" element={<Projects />} />
                    <Route path="properties" element={<Properties />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="members" element={<Members />} />
                    <Route path="partners" element={<Partners />} />
                  </Route>

                  <Route element={<RoleRoute allowedRoles={[ROLES.PARTNER]} />}>
                    <Route path="site-sales-manager" element={<Partners partnerView />} />
                    <Route path="attendance" element={<Attendance />} />
                  </Route>
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </SettingsProvider>
  )
}

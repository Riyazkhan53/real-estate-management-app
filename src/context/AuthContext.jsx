import { createContext, useContext, useState } from 'react'
import { findUser, ROLES } from '../constants/auth'

const STORAGE_KEY = 'rem-auth'

const AuthContext = createContext(null)

function loadSession() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (!parsed.role) {
        return { ...parsed, role: 'admin', name: parsed.name || parsed.username }
      }
      return parsed
    }
  } catch {
    /* ignore */
  }
  return null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession)

  const login = (username, password) => {
    const account = findUser(username, password)
    if (account) {
      const session = {
        username: account.username,
        role: account.role,
        name: account.name,
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
      setUser(session)
      return { success: true }
    }
    return { success: false, error: 'Invalid username or password' }
  }

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const isAdmin = user?.role === ROLES.ADMIN
  const isPartner = user?.role === ROLES.PARTNER

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, isAdmin, isPartner }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

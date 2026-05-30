import { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'rem-auth'

const VALID_USERNAME = 'alex.mp@realestate'
const VALID_PASSWORD = 'Sample'

const AuthContext = createContext(null)

function loadSession() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    /* ignore */
  }
  return null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession)

  const login = (username, password) => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      const session = { username }
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

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

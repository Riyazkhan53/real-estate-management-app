const STORAGE_KEY = 'rem-settings'

export const defaultSettings = {
  theme: 'system',
  companyName: 'Real Estate Management',
  currency: 'USD',
  emailNotifications: true,
}

export function getStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return defaultSettings
}

export function applyTheme(theme) {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (theme === 'dark' || (theme === 'system' && prefersDark)) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function initTheme() {
  applyTheme(getStoredSettings().theme)
}

export { STORAGE_KEY }

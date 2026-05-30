import { useState } from 'react'
import {
  Bell,
  Building2,
  Coins,
  Download,
  Monitor,
  Moon,
  RotateCcw,
  Sun,
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { inputClass } from '../components/FormField'

function SettingsSection({ title, description, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-brand-50 p-2 dark:bg-brand-900/30">
            <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  )
}

function ThemeOption({ value, label, icon: Icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 text-sm font-medium transition ${
        active
          ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-300'
          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-700/50'
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  )
}

function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

export default function Settings() {
  const { settings, updateSetting } = useSettings()
  const { data, resetData } = useData()
  const { isPartner } = useAuth()
  const [resetConfirm, setResetConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `real-estate-data-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    resetData()
    setResetConfirm(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Customize your app appearance and preferences
        </p>
      </div>

      {saved && (
        <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
          Settings saved successfully.
        </div>
      )}

      <SettingsSection
        title="Appearance"
        description="Choose how the app looks on your device"
        icon={Sun}
      >
        <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">Theme</p>
        <div className="flex gap-3">
          <ThemeOption
            value="light"
            label="Light"
            icon={Sun}
            active={settings.theme === 'light'}
            onClick={() => updateSetting('theme', 'light')}
          />
          <ThemeOption
            value="dark"
            label="Dark"
            icon={Moon}
            active={settings.theme === 'dark'}
            onClick={() => updateSetting('theme', 'dark')}
          />
          <ThemeOption
            value="system"
            label="System"
            icon={Monitor}
            active={settings.theme === 'system'}
            onClick={() => updateSetting('theme', 'system')}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Notifications"
        description="Manage how you receive updates"
        icon={Bell}
      >
        <Toggle
          label="Email notifications"
          description="Receive alerts for new leads, property updates, and team activity"
          enabled={settings.emailNotifications}
          onChange={(v) => updateSetting('emailNotifications', v)}
        />
      </SettingsSection>

      {!isPartner && (
        <>
          <SettingsSection
            title="General"
            description="Office branding and display preferences"
            icon={Building2}
          >
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Company / Office Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => updateSetting('companyName', e.target.value)}
                  className={inputClass}
                  placeholder="Real Estate Management"
                />
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  Shown in the sidebar and portal header
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSetting('currency', e.target.value)}
                  className={inputClass}
                >
                  <option value="USD">USD — US Dollar ($)</option>
                  <option value="EUR">EUR — Euro (€)</option>
                  <option value="GBP">GBP — British Pound (£)</option>
                  <option value="INR">INR — Indian Rupee (₹)</option>
                  <option value="AED">AED — UAE Dirham (د.إ)</option>
                </select>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  Used for property prices and project budgets
                </p>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title="Data Management"
            description="Export or reset your local data"
            icon={Coins}
          >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">Export data</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Download all projects, properties, customers, and members as JSON
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
          </div>

          <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
            {!resetConfirm ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    Reset to sample data
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Restore the default demo dataset. This cannot be undone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setResetConfirm(true)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Data
                </button>
              </div>
            ) : (
              <div className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Are you sure? All your current data will be replaced with sample data.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setResetConfirm(false)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Yes, reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SettingsSection>
        </>
      )}
    </div>
  )
}

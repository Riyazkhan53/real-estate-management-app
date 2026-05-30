import { Building2 } from 'lucide-react'

export default function StatCard({ label, value, icon: Icon, trend, color = 'brand' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </p>
          {trend && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{trend}</p>}
        </div>
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          {Icon ? <Icon className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
        </div>
      </div>
    </div>
  )
}

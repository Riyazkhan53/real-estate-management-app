import { Building2 } from 'lucide-react'

export default function StatCard({ label, value, icon: Icon, trend, color = 'brand' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          {trend && (
            <p className="mt-2 text-xs text-slate-500">{trend}</p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          {Icon ? <Icon className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
        </div>
      </div>
    </div>
  )
}

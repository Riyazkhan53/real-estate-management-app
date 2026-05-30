export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    violet: 'bg-violet-100 text-violet-700',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${variants[variant]}`}
    >
      {children}
    </span>
  )
}

export function statusVariant(status) {
  const map = {
    active: 'success',
    available: 'success',
    completed: 'info',
    planning: 'violet',
    'on-hold': 'warning',
    pending: 'warning',
    sold: 'danger',
    rented: 'info',
    inactive: 'default',
    buyer: 'info',
    seller: 'violet',
    tenant: 'success',
    landlord: 'warning',
    residential: 'info',
    commercial: 'violet',
    land: 'success',
    industrial: 'warning',
    agent: 'info',
    manager: 'violet',
    admin: 'danger',
    support: 'default',
  }
  return map[status] || 'default'
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export function formatDate(date) {
  if (!date) return '—'
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

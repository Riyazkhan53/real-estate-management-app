export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
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

export function formatDate(date) {
  if (!date) return '—'
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

export function formatTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDuration(minutes) {
  if (minutes == null || minutes < 0) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

export function calcDurationMinutes(checkInAt, checkOutAt) {
  if (!checkInAt || !checkOutAt) return null
  return Math.round((new Date(checkOutAt) - new Date(checkInAt)) / 60000)
}

export function getActiveRecord(records, partnerUsername) {
  const today = todayDate()
  return records.find(
    (r) =>
      r.partnerUsername === partnerUsername &&
      r.date === today &&
      r.status === 'checked-in',
  )
}

export function getTodayRecord(records, partnerUsername) {
  const today = todayDate()
  return records
    .filter((r) => r.partnerUsername === partnerUsername && r.date === today)
    .sort((a, b) => new Date(b.checkInAt) - new Date(a.checkInAt))[0] || null
}

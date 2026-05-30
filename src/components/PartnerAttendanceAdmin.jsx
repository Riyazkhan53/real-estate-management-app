import { useMemo, useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import ConfirmDialog from '../components/ConfirmDialog'
import { formatDate } from '../components/Badge'
import { inputClass } from '../components/FormField'
import { formatTime, formatDuration } from '../utils/attendance'

export default function PartnerAttendanceAdmin() {
  const { data, deleteItem } = useData()
  const attendance = data.attendance || []
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const filtered = useMemo(() => {
    return attendance
      .filter((r) => {
        if (dateFilter && r.date !== dateFilter) return false
        const q = search.toLowerCase()
        if (!q) return true
        return (
          r.partnerName?.toLowerCase().includes(q) ||
          r.partnerUsername?.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => new Date(b.checkInAt) - new Date(a.checkInAt))
  }, [attendance, search, dateFilter])

  const summary = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const todayRecords = attendance.filter((r) => r.date === today)
    return {
      total: attendance.length,
      today: todayRecords.length,
      checkedIn: todayRecords.filter((r) => r.status === 'checked-in').length,
    }
  }, [attendance])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Records</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{summary.total}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Today&apos;s Logs</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{summary.today}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Currently Checked In</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{summary.checkedIn}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search partner name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-10`}
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className={`${inputClass} sm:w-44`}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/50">
                <th className="px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-400">Partner</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-400">Date</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-400">Check In</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-400">Check Out</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-400">Duration</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{record.partnerName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{record.partnerUsername}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {formatTime(record.checkInAt)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {formatTime(record.checkOutAt)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      {record.status === 'checked-in'
                        ? formatDuration(
                            Math.round((Date.now() - new Date(record.checkInAt)) / 60000),
                          )
                        : formatDuration(record.durationMinutes)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          record.status === 'checked-in'
                            ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {record.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setDeleteId(record.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteItem('attendance', deleteId)}
        message="Delete this attendance record?"
      />
    </div>
  )
}

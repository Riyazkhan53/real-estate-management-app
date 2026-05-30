import AttendancePanel from '../components/AttendancePanel'

export default function Attendance() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Attendance</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Check in when you arrive and check out when you leave — time is calculated automatically
        </p>
      </div>
      <AttendancePanel />
    </div>
  )
}

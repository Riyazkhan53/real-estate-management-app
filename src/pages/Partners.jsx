import { useMemo, useState } from 'react'
import {
  Calendar,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  Handshake,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { useSettings } from '../context/SettingsContext'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import DateCalendar from '../components/DateCalendar'
import PartnerAttendanceAdmin from '../components/PartnerAttendanceAdmin'
import { formatDate } from '../components/Badge'
import { FormField, FormActions, inputClass, selectClass, textareaClass } from '../components/FormField'
import {
  PARTNER_STAGES,
  stageMap,
  stageColors,
  emptyPartner,
  getTomorrowDate,
  toDateString,
  isSameDay,
} from '../constants/partnerStages'

export default function Partners({ partnerView = false }) {
  const { data, addItem, updateItem, deleteItem } = useData()
  const { formatCurrency } = useSettings()
  const { user, isPartner } = useAuth()
  const allPartners = data.partners || []

  const partners = useMemo(() => {
    if (partnerView || isPartner) {
      return allPartners.filter((p) => p.partnerName === user?.name)
    }
    return allPartners
  }, [allPartners, partnerView, isPartner, user?.name])

  const [activeStage, setActiveStage] = useState('new-prospect')
  const [mainTab, setMainTab] = useState('pipeline')
  const [selectedDate, setSelectedDate] = useState('')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyPartner, stage: 'new-prospect' })

  const stageConfig = stageMap[activeStage]
  const tomorrow = getTomorrowDate()

  const stageCounts = useMemo(() => {
    const counts = {}
    PARTNER_STAGES.forEach((s) => {
      counts[s.id] = partners.filter((p) => p.stage === s.id).length
    })
    return counts
  }, [partners])

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (p.stage !== activeStage) return false

      if (activeStage === 'tomorrow-site-visit' && !selectedDate && p.eventDate !== tomorrow) {
        return false
      }

      if (selectedDate && !isSameDay(p.eventDate, selectedDate)) return false

      const q = search.toLowerCase()
      if (!q) return true
      return (
        p.prospectName?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.propertyName?.toLowerCase().includes(q) ||
        p.partnerName?.toLowerCase().includes(q)
      )
    })
  }, [partners, activeStage, selectedDate, search, tomorrow])

  const markedDates = useMemo(
    () => partners.filter((p) => p.stage === activeStage && p.eventDate).map((p) => p.eventDate),
    [partners, activeStage],
  )

  const openCreate = () => {
    setEditing(null)
    const defaultDate =
      activeStage === 'tomorrow-site-visit' ? tomorrow : toDateString(new Date())
    setForm({
      ...emptyPartner,
      stage: activeStage,
      eventDate: defaultDate,
      partnerName: isPartner ? user?.name || '' : '',
      partnerPhone: isPartner ? '' : '',
    })
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditing(record.id)
    setForm({
      ...record,
      bookingAmount: record.bookingAmount ?? '',
      paymentAmount: record.paymentAmount ?? '',
    })
    setModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      partnerName: isPartner ? user?.name : form.partnerName,
      bookingAmount: Number(form.bookingAmount) || 0,
      paymentAmount: Number(form.paymentAmount) || 0,
    }
    if (editing) {
      updateItem('partners', editing, payload)
    } else {
      addItem('partners', payload)
    }
    setModalOpen(false)
  }

  const moveToStage = (id, newStage) => {
    updateItem('partners', id, { stage: newStage })
  }

  const showBookingFields = ['booking-done', 'booking-cancelled'].includes(form.stage)
  const showRegistrationFields = form.stage === 'registration-completed'
  const showCancellationFields = form.stage === 'booking-cancelled'
  const showPaymentFields = form.stage === 'payment-received'
  const showVisitFields = ['tomorrow-site-visit', 'site-visit-done'].includes(form.stage)

  const isAdminView = !partnerView && !isPartner

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {partnerView ? 'Site/Sales Manager' : 'Partners Management'}
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {partnerView
              ? 'Manage your prospects, site visits, bookings, and sales pipeline'
              : 'Track partner pipeline, site visits, bookings, and attendance'}
          </p>
        </div>
        {(mainTab === 'pipeline' || !isAdminView) && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> Add Record
          </button>
        )}
      </div>

      {isAdminView && (
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setMainTab('pipeline')}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              mainTab === 'pipeline'
                ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Pipeline
          </button>
          <button
            type="button"
            onClick={() => setMainTab('attendance')}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              mainTab === 'attendance'
                ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Attendance
          </button>
        </div>
      )}

      {isAdminView && mainTab === 'attendance' ? (
        <PartnerAttendanceAdmin />
      ) : (
        <>

      {/* Stage tabs */}
      <div className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {PARTNER_STAGES.map((stage) => {
          const Icon = stage.icon
          const active = activeStage === stage.id
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => {
                setActiveStage(stage.id)
                setSelectedDate('')
                setSearch('')
              }}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{stage.shortLabel}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  active ? 'bg-brand-200/60 dark:bg-brand-800/60' : 'bg-slate-100 dark:bg-slate-700'
                }`}
              >
                {stageCounts[stage.id]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Stage header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          {stageConfig && (
            <>
              <div className={`rounded-xl p-2.5 ${stageColors[stageConfig.color]}`}>
                <stageConfig.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  {stageConfig.label} Details
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stageConfig.description}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Calendar */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Calendar className="h-4 w-4" />
            Date Calendar
          </div>
          <DateCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            markedDates={markedDates}
          />
          {activeStage === 'tomorrow-site-visit' && (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              Showing visits scheduled for tomorrow ({formatDate(tomorrow)}). Select a date on the
              calendar to browse other days.
            </p>
          )}
        </div>

        {/* List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, property, or partner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Handshake}
              title={`No ${stageConfig?.label.toLowerCase()} records`}
              description="Add a new record or adjust your date filter."
              action={
                <button
                  type="button"
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  <Plus className="h-4 w-4" /> Add Record
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((record) => (
                <div
                  key={record.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {record.prospectName}
                        </h3>
                        {record.eventDate && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            <Calendar className="h-3 w-3" />
                            {formatDate(record.eventDate)}
                            {record.visitTime && ` · ${record.visitTime}`}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 grid gap-1 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2">
                        {record.phone && <p>Phone: {record.phone}</p>}
                        {record.email && <p>Email: {record.email}</p>}
                        {record.propertyName && (
                          <p>
                            Property: {record.propertyName}
                            {record.unitNumber && ` · ${record.unitNumber}`}
                          </p>
                        )}
                        {record.partnerName && <p>Partner: {record.partnerName}</p>}
                        {record.siteAddress && <p>Site: {record.siteAddress}</p>}
                        {record.bookingAmount > 0 && (
                          <p>Booking: {formatCurrency(record.bookingAmount)}</p>
                        )}
                        {record.paymentAmount > 0 && (
                          <p>Payment: {formatCurrency(record.paymentAmount)}</p>
                        )}
                        {record.registrationNumber && (
                          <p>Reg. No: {record.registrationNumber}</p>
                        )}
                        {record.cancellationReason && (
                          <p className="text-red-600 dark:text-red-400">
                            Reason: {record.cancellationReason}
                          </p>
                        )}
                      </div>
                      {record.notes && (
                        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
                          {record.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-1">
                      <select
                        value={record.stage}
                        onChange={(e) => moveToStage(record.id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                        title="Move to stage"
                      >
                        {PARTNER_STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.shortLabel}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => openEdit(record)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(record.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick advance */}
                  {record.stage !== 'registration-completed' && record.stage !== 'payment-received' && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                      <span className="text-xs text-slate-400">Move to:</span>
                      {PARTNER_STAGES.filter((s) => s.id !== record.stage).slice(0, 4).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => moveToStage(record.id, s.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                          {s.shortLabel}
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Partner Record' : 'Add Partner Record'}
        wide
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Stage">
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
                className={selectClass}
              >
                {PARTNER_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label={stageMap[form.stage]?.dateLabel || 'Date'} required>
              <input
                type="date"
                required
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                className={inputClass}
              />
            </FormField>

            <FormField label="Prospect Name" required className="sm:col-span-2">
              <input
                required
                value={form.prospectName}
                onChange={(e) => setForm({ ...form, prospectName: e.target.value })}
                className={inputClass}
                placeholder="Customer / prospect full name"
              />
            </FormField>

            <FormField label="Phone">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
              />
            </FormField>

            <FormField label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </FormField>

            <FormField label="Property Name">
              <input
                value={form.propertyName}
                onChange={(e) => setForm({ ...form, propertyName: e.target.value })}
                className={inputClass}
                placeholder="Project or property name"
              />
            </FormField>

            <FormField label="Unit / Plot No.">
              <input
                value={form.unitNumber}
                onChange={(e) => setForm({ ...form, unitNumber: e.target.value })}
                className={inputClass}
              />
            </FormField>

            <FormField label="Partner / Agent Name">
              <input
                value={form.partnerName}
                onChange={(e) => setForm({ ...form, partnerName: e.target.value })}
                className={inputClass}
                readOnly={isPartner}
                disabled={isPartner}
              />
            </FormField>

            <FormField label="Partner Phone">
              <input
                value={form.partnerPhone}
                onChange={(e) => setForm({ ...form, partnerPhone: e.target.value })}
                className={inputClass}
              />
            </FormField>

            {showVisitFields && (
              <>
                <FormField label="Site Address" className="sm:col-span-2">
                  <input
                    value={form.siteAddress}
                    onChange={(e) => setForm({ ...form, siteAddress: e.target.value })}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Visit Time">
                  <input
                    type="time"
                    value={form.visitTime}
                    onChange={(e) => setForm({ ...form, visitTime: e.target.value })}
                    className={inputClass}
                  />
                </FormField>
              </>
            )}

            {showBookingFields && (
              <FormField label="Booking Amount">
                <input
                  type="number"
                  min="0"
                  value={form.bookingAmount}
                  onChange={(e) => setForm({ ...form, bookingAmount: e.target.value })}
                  className={inputClass}
                />
              </FormField>
            )}

            {showPaymentFields && (
              <FormField label="Payment Amount">
                <input
                  type="number"
                  min="0"
                  value={form.paymentAmount}
                  onChange={(e) => setForm({ ...form, paymentAmount: e.target.value })}
                  className={inputClass}
                />
              </FormField>
            )}

            {showRegistrationFields && (
              <FormField label="Registration Number">
                <input
                  value={form.registrationNumber}
                  onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                  className={inputClass}
                />
              </FormField>
            )}

            {showCancellationFields && (
              <FormField label="Cancellation Reason" className="sm:col-span-2">
                <input
                  value={form.cancellationReason}
                  onChange={(e) => setForm({ ...form, cancellationReason: e.target.value })}
                  className={inputClass}
                />
              </FormField>
            )}

            <FormField label="Notes" className="sm:col-span-2">
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className={textareaClass}
              />
            </FormField>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteItem('partners', deleteId)}
        message="Are you sure you want to delete this partner record?"
      />
        </>
      )}
    </div>
  )
}

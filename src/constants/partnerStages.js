import {
  Ban,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileCheck,
  MapPin,
  UserPlus,
  Wallet,
} from 'lucide-react'

export const PARTNER_STAGES = [
  {
    id: 'new-prospect',
    label: 'New Prospect',
    shortLabel: 'Prospect',
    description: 'New leads and inquiry details',
    icon: UserPlus,
    color: 'blue',
    dateLabel: 'Inquiry Date',
  },
  {
    id: 'tomorrow-site-visit',
    label: 'Tomorrow Site Visit',
    shortLabel: 'Tomorrow Visit',
    description: 'Site visits scheduled for tomorrow',
    icon: CalendarClock,
    color: 'amber',
    dateLabel: 'Visit Date',
  },
  {
    id: 'site-visit-done',
    label: 'Site Visit Done',
    shortLabel: 'Visit Done',
    description: 'Completed site visit records',
    icon: MapPin,
    color: 'violet',
    dateLabel: 'Visit Completed Date',
  },
  {
    id: 'booking-done',
    label: 'Booking Done',
    shortLabel: 'Booked',
    description: 'Confirmed bookings and token details',
    icon: CheckCircle2,
    color: 'brand',
    dateLabel: 'Booking Date',
  },
  {
    id: 'booking-cancelled',
    label: 'Booking Cancelled',
    shortLabel: 'Cancelled',
    description: 'Cancelled booking records',
    icon: Ban,
    color: 'red',
    dateLabel: 'Cancellation Date',
  },
  {
    id: 'registration-completed',
    label: 'Registration Completed',
    shortLabel: 'Registered',
    description: 'Property registration completed',
    icon: FileCheck,
    color: 'emerald',
    dateLabel: 'Registration Date',
  },
  {
    id: 'follow-up',
    label: 'Follow Up',
    shortLabel: 'Follow Up',
    description: 'Pending follow-ups with prospects',
    icon: ClipboardList,
    color: 'slate',
    dateLabel: 'Follow Up Date',
  },
  {
    id: 'payment-received',
    label: 'Payment Received',
    shortLabel: 'Payment',
    description: 'Payment received from partners',
    icon: Wallet,
    color: 'teal',
    dateLabel: 'Payment Date',
  },
]

export const stageMap = Object.fromEntries(PARTNER_STAGES.map((s) => [s.id, s]))

export const stageColors = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
}

export const emptyPartner = {
  stage: 'new-prospect',
  prospectName: '',
  phone: '',
  email: '',
  propertyName: '',
  unitNumber: '',
  partnerName: '',
  partnerPhone: '',
  siteAddress: '',
  eventDate: '',
  visitTime: '',
  bookingAmount: '',
  registrationNumber: '',
  cancellationReason: '',
  paymentAmount: '',
  notes: '',
}

export function getTomorrowDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export function toDateString(date) {
  if (!date) return ''
  if (typeof date === 'string') return date.slice(0, 10)
  return date.toISOString().slice(0, 10)
}

export function isSameDay(a, b) {
  return toDateString(a) === toDateString(b)
}

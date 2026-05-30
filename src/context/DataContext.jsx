import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'rem-data'

const seedData = {
  projects: [
    {
      id: '1',
      name: 'Green Valley Residences',
      description: 'Luxury residential complex with 120 units',
      location: 'Austin, TX',
      status: 'active',
      startDate: '2025-01-15',
      endDate: '2026-06-30',
      budget: 4500000,
    },
    {
      id: '2',
      name: 'Downtown Commerce Hub',
      description: 'Mixed-use commercial development',
      location: 'Denver, CO',
      status: 'planning',
      startDate: '2025-09-01',
      endDate: '2027-12-31',
      budget: 8200000,
    },
  ],
  customers: [
    {
      id: '1',
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@email.com',
      phone: '+1 (512) 555-0142',
      address: '742 Oak Street, Austin, TX',
      type: 'buyer',
      notes: 'Interested in 3-bedroom units',
    },
    {
      id: '2',
      name: 'James Chen',
      email: 'james.chen@email.com',
      phone: '+1 (303) 555-0198',
      address: '1580 Market Ave, Denver, CO',
      type: 'seller',
      notes: 'Commercial property owner',
    },
  ],
  properties: [
    {
      id: '1',
      title: 'Modern Villa — Unit 12A',
      address: '120 Green Valley Blvd',
      city: 'Austin, TX',
      type: 'residential',
      status: 'available',
      price: 485000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1850,
      customerId: '',
    },
    {
      id: '2',
      title: 'Retail Space — Block C',
      address: '450 Main Street',
      city: 'Denver, CO',
      type: 'commercial',
      status: 'pending',
      price: 1200000,
      bedrooms: 0,
      bathrooms: 2,
      sqft: 3200,
      customerId: '2',
    },
  ],
  members: [
    {
      id: '1',
      name: 'Emily Rodriguez',
      email: 'emily.r@company.com',
      phone: '+1 (512) 555-0100',
      role: 'manager',
      department: 'Sales',
      joinDate: '2023-03-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Michael Thompson',
      email: 'michael.t@company.com',
      phone: '+1 (512) 555-0101',
      role: 'agent',
      department: 'Sales',
      joinDate: '2024-01-10',
      status: 'active',
    },
  ],
  partners: [
    {
      id: '1',
      stage: 'new-prospect',
      prospectName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh.k@email.com',
      propertyName: 'Green Valley Residences',
      unitNumber: 'A-1204',
      partnerName: 'Michael Thompson',
      partnerPhone: '+1 (512) 555-0101',
      siteAddress: '',
      eventDate: '2026-05-28',
      visitTime: '',
      bookingAmount: 0,
      registrationNumber: '',
      cancellationReason: '',
      paymentAmount: 0,
      notes: 'Referred by existing customer. Interested in 3BHK.',
    },
    {
      id: '2',
      stage: 'tomorrow-site-visit',
      prospectName: 'Priya Sharma',
      phone: '+91 91234 56789',
      email: 'priya.s@email.com',
      propertyName: 'Green Valley Residences',
      unitNumber: 'B-0802',
      partnerName: 'Emily Rodriguez',
      partnerPhone: '+1 (512) 555-0100',
      siteAddress: '120 Green Valley Blvd, Austin, TX',
      eventDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      visitTime: '10:30',
      bookingAmount: 0,
      registrationNumber: '',
      cancellationReason: '',
      paymentAmount: 0,
      notes: 'Family of 4, prefers east-facing unit.',
    },
    {
      id: '3',
      stage: 'booking-done',
      prospectName: 'David Wilson',
      phone: '+1 (512) 555-0188',
      email: 'david.w@email.com',
      propertyName: 'Downtown Commerce Hub',
      unitNumber: 'C-15',
      partnerName: 'Michael Thompson',
      partnerPhone: '+1 (512) 555-0101',
      siteAddress: '',
      eventDate: '2026-05-20',
      visitTime: '',
      bookingAmount: 50000,
      registrationNumber: '',
      cancellationReason: '',
      paymentAmount: 0,
      notes: 'Token amount received. Registration pending.',
    },
    {
      id: '4',
      stage: 'registration-completed',
      prospectName: 'Anita Desai',
      phone: '+91 99887 76655',
      email: 'anita.d@email.com',
      propertyName: 'Green Valley Residences',
      unitNumber: 'A-0501',
      partnerName: 'Emily Rodriguez',
      partnerPhone: '+1 (512) 555-0100',
      siteAddress: '',
      eventDate: '2026-05-15',
      visitTime: '',
      bookingAmount: 485000,
      registrationNumber: 'REG-2026-004521',
      cancellationReason: '',
      paymentAmount: 0,
      notes: 'Full registration completed at sub-registrar office.',
    },
  ],
  attendance: [
    {
      id: '1',
      partnerUsername: 'partner@realestate',
      partnerName: 'Michael Thompson',
      date: new Date().toISOString().slice(0, 10),
      checkInAt: new Date(new Date().setHours(9, 15, 0, 0)).toISOString(),
      checkOutAt: null,
      durationMinutes: null,
      status: 'checked-in',
    },
    {
      id: '2',
      partnerUsername: 'partner@realestate',
      partnerName: 'Michael Thompson',
      date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      checkInAt: new Date(Date.now() - 86400000 + 9 * 3600000).toISOString(),
      checkOutAt: new Date(Date.now() - 86400000 + 18 * 3600000).toISOString(),
      durationMinutes: 540,
      status: 'checked-out',
    },
  ],
}

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...seedData,
        ...parsed,
        partners: parsed.partners ?? seedData.partners,
        attendance: parsed.attendance ?? seedData.attendance,
      }
    }
  } catch {
    /* use seed */
  }
  return seedData
}

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const generateId = () => crypto.randomUUID()

  const addItem = (collection, item) => {
    setData((prev) => ({
      ...prev,
      [collection]: [...(prev[collection] || []), { ...item, id: generateId() }],
    }))
  }

  const updateItem = (collection, id, updates) => {
    setData((prev) => ({
      ...prev,
      [collection]: (prev[collection] || []).map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    }))
  }

  const deleteItem = (collection, id) => {
    setData((prev) => ({
      ...prev,
      [collection]: (prev[collection] || []).filter((item) => item.id !== id),
    }))
  }

  const resetData = () => setData(seedData)

  const stats = {
    projects: data.projects.length,
    customers: data.customers.length,
    properties: data.properties.length,
    members: data.members.length,
    partners: (data.partners || []).length,
    activeProjects: data.projects.filter((p) => p.status === 'active').length,
    availableProperties: data.properties.filter((p) => p.status === 'available').length,
    newProspects: (data.partners || []).filter((p) => p.stage === 'new-prospect').length,
    bookingsDone: (data.partners || []).filter((p) => p.stage === 'booking-done').length,
  }

  return (
    <DataContext.Provider
      value={{ data, addItem, updateItem, deleteItem, resetData, stats }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

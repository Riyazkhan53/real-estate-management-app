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
}

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
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
      [collection]: [...prev[collection], { ...item, id: generateId() }],
    }))
  }

  const updateItem = (collection, id, updates) => {
    setData((prev) => ({
      ...prev,
      [collection]: prev[collection].map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    }))
  }

  const deleteItem = (collection, id) => {
    setData((prev) => ({
      ...prev,
      [collection]: prev[collection].filter((item) => item.id !== id),
    }))
  }

  const resetData = () => setData(seedData)

  const stats = {
    projects: data.projects.length,
    customers: data.customers.length,
    properties: data.properties.length,
    members: data.members.length,
    activeProjects: data.projects.filter((p) => p.status === 'active').length,
    availableProperties: data.properties.filter((p) => p.status === 'available').length,
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

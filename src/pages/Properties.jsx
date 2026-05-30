import { useState } from 'react'
import { Bed, Home, MapPin, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { Badge, formatCurrency, statusVariant } from '../components/Badge'
import { FormField, FormActions, inputClass, selectClass } from '../components/FormField'

const emptyProperty = {
  title: '',
  address: '',
  city: '',
  type: 'residential',
  status: 'available',
  price: '',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  customerId: '',
}

export default function Properties() {
  const { data, addItem, updateItem, deleteItem } = useData()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProperty)

  const getCustomerName = (id) =>
    data.customers.find((c) => c.id === id)?.name || null

  const filtered = data.properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()),
  )

  const openCreate = () => {
    setEditing(null)
    setForm(emptyProperty)
    setModalOpen(true)
  }

  const openEdit = (property) => {
    setEditing(property.id)
    setForm({
      ...property,
      price: property.price || '',
      bedrooms: property.bedrooms ?? '',
      bathrooms: property.bathrooms ?? '',
      sqft: property.sqft || '',
    })
    setModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      sqft: Number(form.sqft) || 0,
    }
    if (editing) {
      updateItem('properties', editing, payload)
    } else {
      addItem('properties', payload)
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
          <p className="mt-1 text-slate-500">Manage listings, sales, and rental inventory</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> Add Property
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} pl-10`}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Home}
          title="No properties found"
          description="Add your first property listing to the portfolio."
          action={
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" /> Add Property
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((property) => (
            <div
              key={property.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-5 py-6 text-white">
                <div className="flex items-start justify-between">
                  <Badge variant={statusVariant(property.status)}>
                    {property.status}
                  </Badge>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(property)}
                      className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(property.id)}
                      className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-xl font-bold">{formatCurrency(property.price)}</p>
                <p className="mt-1 font-medium">{property.title}</p>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {property.address}, {property.city}
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                  <Badge variant={statusVariant(property.type)}>{property.type}</Badge>
                  {property.bedrooms > 0 && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" /> {property.bedrooms} bed
                    </span>
                  )}
                  {property.bathrooms > 0 && (
                    <span>{property.bathrooms} bath</span>
                  )}
                  {property.sqft > 0 && <span>{property.sqft.toLocaleString()} sqft</span>}
                </div>
                {property.customerId && getCustomerName(property.customerId) && (
                  <p className="mt-3 text-xs text-slate-500">
                    Linked customer:{' '}
                    <span className="font-medium text-slate-700">
                      {getCustomerName(property.customerId)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Property' : 'Add Property'}
        wide
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Title" required className="sm:col-span-2">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
                placeholder="Modern Villa — Unit 12A"
              />
            </FormField>
            <FormField label="Address" required>
              <input
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="City / Region" required>
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Property Type">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={selectClass}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
                <option value="industrial">Industrial</option>
              </select>
            </FormField>
            <FormField label="Status">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={selectClass}
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </FormField>
            <FormField label="Price ($)" required>
              <input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Linked Customer">
              <select
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                className={selectClass}
              >
                <option value="">None</option>
                {data.customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Bedrooms">
              <input
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Bathrooms">
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Square Feet">
              <input
                type="number"
                min="0"
                value={form.sqft}
                onChange={(e) => setForm({ ...form, sqft: e.target.value })}
                className={inputClass}
              />
            </FormField>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteItem('properties', deleteId)}
        message="Are you sure you want to delete this property?"
      />
    </div>
  )
}

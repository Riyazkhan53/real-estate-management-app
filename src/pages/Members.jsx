import { useState } from 'react'
import { Pencil, Plus, Search, Trash2, Users } from 'lucide-react'
import { useData } from '../context/DataContext'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { Badge, formatDate, statusVariant } from '../components/Badge'
import { FormField, FormActions, inputClass, selectClass } from '../components/FormField'

const emptyMember = {
  name: '',
  email: '',
  phone: '',
  role: 'agent',
  department: '',
  joinDate: '',
  status: 'active',
}

export default function Members() {
  const { data, addItem, updateItem, deleteItem } = useData()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyMember)

  const filtered = data.members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase()),
  )

  const openCreate = () => {
    setEditing(null)
    setForm(emptyMember)
    setModalOpen(true)
  }

  const openEdit = (member) => {
    setEditing(member.id)
    setForm(member)
    setModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editing) {
      updateItem('members', editing, form)
    } else {
      addItem('members', form)
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Members</h1>
          <p className="mt-1 text-slate-500">Manage office staff, agents, and partners</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> Add Member
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search team members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} pl-10`}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members found"
          description="Add office members to manage your real estate team."
          action={
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" /> Add Member
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Member</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Role</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Department</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Contact</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Joined</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((member) => (
                  <tr key={member.id} className="transition hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant(member.role)}>{member.role}</Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{member.department || '—'}</td>
                    <td className="px-6 py-4 text-slate-600">{member.phone || '—'}</td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(member.joinDate)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant(member.status)}>{member.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(member)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(member.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Team Member' : 'Add Team Member'}
        wide
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full Name" required className="sm:col-span-2">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Email" required>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Phone">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Role">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={selectClass}
              >
                <option value="agent">Agent</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="support">Support</option>
              </select>
            </FormField>
            <FormField label="Department">
              <input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={inputClass}
                placeholder="Sales, Operations, etc."
              />
            </FormField>
            <FormField label="Join Date">
              <input
                type="date"
                value={form.joinDate}
                onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Status">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={selectClass}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FormField>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteItem('members', deleteId)}
        message="Are you sure you want to remove this team member?"
      />
    </div>
  )
}

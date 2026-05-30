import { useState } from 'react'
import { FolderKanban, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { Badge, formatCurrency, formatDate, statusVariant } from '../components/Badge'
import { FormField, FormActions, inputClass, selectClass, textareaClass } from '../components/FormField'

const emptyProject = {
  name: '',
  description: '',
  location: '',
  status: 'planning',
  startDate: '',
  endDate: '',
  budget: '',
}

export default function Projects() {
  const { data, addItem, updateItem, deleteItem } = useData()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProject)

  const filtered = data.projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()),
  )

  const openCreate = () => {
    setEditing(null)
    setForm(emptyProject)
    setModalOpen(true)
  }

  const openEdit = (project) => {
    setEditing(project.id)
    setForm({ ...project, budget: project.budget || '' })
    setModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...form, budget: Number(form.budget) || 0 }
    if (editing) {
      updateItem('projects', editing, payload)
    } else {
      addItem('projects', payload)
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="mt-1 text-slate-500">Manage development and sales projects</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} pl-10`}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Get started by adding your first real estate project."
          action={
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" /> Add Project
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Project</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Location</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Timeline</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Budget</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((project) => (
                  <tr key={project.id} className="transition hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{project.name}</p>
                      <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                        {project.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{project.location}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant(project.status)}>
                        {project.status.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(project.startDate)} — {formatDate(project.endDate)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {formatCurrency(project.budget)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(project)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(project.id)}
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
        title={editing ? 'Edit Project' : 'Add Project'}
        wide
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Project Name" required className="sm:col-span-2">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="Green Valley Residences"
              />
            </FormField>
            <FormField label="Location" required>
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClass}
                placeholder="City, State"
              />
            </FormField>
            <FormField label="Status">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={selectClass}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </FormField>
            <FormField label="Start Date">
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="End Date">
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Budget ($)">
              <input
                type="number"
                min="0"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className={inputClass}
                placeholder="1000000"
              />
            </FormField>
            <FormField label="Description" className="sm:col-span-2">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={textareaClass}
                placeholder="Brief project description..."
              />
            </FormField>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteItem('projects', deleteId)}
        message="Are you sure you want to delete this project?"
      />
    </div>
  )
}

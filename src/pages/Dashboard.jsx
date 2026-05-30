import { Link } from 'react-router-dom'
import {
  ArrowRight,
  FolderKanban,
  Home,
  TrendingUp,
  UserCircle,
  Users,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import StatCard from '../components/StatCard'
import { Badge, formatCurrency, formatDate, statusVariant } from '../components/Badge'

export default function Dashboard() {
  const { data, stats } = useData()

  const recentProjects = [...data.projects]
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 5)

  const recentProperties = [...data.properties]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)

  const totalPortfolioValue = data.properties.reduce((sum, p) => sum + (p.price || 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-slate-500">
          Overview of your real estate portfolio and team activity
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Projects"
          value={stats.projects}
          icon={FolderKanban}
          trend={`${stats.activeProjects} currently active`}
          color="brand"
        />
        <StatCard
          label="Properties"
          value={stats.properties}
          icon={Home}
          trend={`${stats.availableProperties} available for sale/rent`}
          color="blue"
        />
        <StatCard
          label="Customers"
          value={stats.customers}
          icon={UserCircle}
          trend="Buyers, sellers & tenants"
          color="amber"
        />
        <StatCard
          label="Team Members"
          value={stats.members}
          icon={Users}
          trend="Office staff & agents"
          color="violet"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Projects</h2>
            <Link
              to="/projects"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No projects yet</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentProjects.map((project) => (
                <li key={project.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-900">{project.name}</p>
                    <p className="text-xs text-slate-500">{project.location}</p>
                  </div>
                  <Badge variant={statusVariant(project.status)}>
                    {project.status.replace('-', ' ')}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Top Properties</h2>
            <Link
              to="/properties"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentProperties.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No properties yet</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentProperties.map((property) => (
                <li key={property.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-900">{property.title}</p>
                    <p className="text-xs text-slate-500">{property.city}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(property.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-brand-100 p-3">
              <TrendingUp className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(totalPortfolioValue)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            <div>
              <p className="text-xs text-slate-500">Active Projects</p>
              <p className="text-lg font-semibold text-slate-900">{stats.activeProjects}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Latest Project Start</p>
              <p className="text-lg font-semibold text-slate-900">
                {recentProjects[0] ? formatDate(recentProjects[0].startDate) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

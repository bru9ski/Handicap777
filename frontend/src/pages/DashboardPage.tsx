import DashboardLayout from '@/components/DashboardLayout'
import MetricsCards from '@/components/MetricsCards'
import ParametersForm from '@/components/ParametersForm'
import OperationNodesTable from '@/components/OperationNodesTable'
import ApiIntegrationCard from '@/components/ApiIntegrationCard'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="animate-slide-up">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Dashboard{' '}
            <span className="text-yellow-500">Operacional</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerenciamento de banca por composição progressiva
          </p>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
          <MetricsCards />
        </div>

        <div
          className="grid grid-cols-1 xl:grid-cols-5 gap-6 animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="xl:col-span-2">
            <ParametersForm />
          </div>
          <div className="xl:col-span-3">
            <ApiIntegrationCard />
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
          <OperationNodesTable />
        </div>
      </div>
    </DashboardLayout>
  )
}

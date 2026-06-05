import { useEffect, useState } from 'react'
import { TrendingUp, Wallet, DollarSign, Target, RefreshCw } from 'lucide-react'
import clsx from 'clsx'
import { apiClient } from '@/services/apiClient'
import { SummaryResponse } from '@/types'
import { useStore } from '@/store/useStore'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

interface MetricCardProps {
  title: string
  subtitle: string
  value: string
  icon: React.ElementType
  accent?: boolean
  positive?: boolean | null
  children?: React.ReactNode
}

function MetricCard({
  title,
  subtitle,
  value,
  icon: Icon,
  accent = false,
  positive = null,
  children,
}: MetricCardProps) {
  return (
    <div
      className={clsx(
        'card-premium flex flex-col gap-4 transition-all duration-200 hover:border-dark-300 group',
        accent && 'border-yellow-500/30 hover:border-yellow-500/50'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="label-premium">{title}</p>
          <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>
        </div>
        <div
          className={clsx(
            'w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150',
            accent
              ? 'bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500/15'
              : 'bg-dark-500 text-gray-400 group-hover:bg-dark-400'
          )}
        >
          <Icon size={18} />
        </div>
      </div>
      <div>
        <p
          className={clsx(
            'text-2xl font-bold tracking-tight',
            positive === true && 'text-green-400',
            positive === false && 'text-red-400',
            positive === null && accent && 'text-yellow-400',
            positive === null && !accent && 'text-white'
          )}
        >
          {value}
        </p>
      </div>
      {children}
    </div>
  )
}

const MOCK_SUMMARY: SummaryResponse = {
  ultimate_goal: 4045.56,
  current_balance: 1095.0,
  net_gain_active: 95.0,
  cycles_completed: 1,
  cycles_total: 10,
  progress_pct: 10,
}

export default function MetricsCards() {
  const { summary, setSummary } = useStore((s) => ({
    summary: s.summary,
    setSummary: s.setSummary,
  }))
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchSummary = async () => {
    setIsRefreshing(true)
    try {
      const data = await apiClient.getSummary()
      setSummary(data)
    } catch {
      setSummary(MOCK_SUMMARY)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSummary()
    const interval = setInterval(fetchSummary, 30_000)
    return () => clearInterval(interval)
  }, [])

  const data = summary ?? MOCK_SUMMARY

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Métricas do Sistema
        </h2>
        <button
          onClick={fetchSummary}
          className={clsx(
            'p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-dark-600 transition-all duration-150',
            isRefreshing && 'animate-spin text-yellow-500'
          )}
          title="Atualizar métricas"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Ultimate Goal"
          subtitle="Projeção final do ciclo"
          value={formatCurrency(data.ultimate_goal)}
          icon={Target}
          accent
        />
        <MetricCard
          title="Current Balance"
          subtitle="Saldo em operação"
          value={formatCurrency(data.current_balance)}
          icon={Wallet}
        />
        <MetricCard
          title="Net Gain Active"
          subtitle="Lucro líquido acumulado"
          value={formatCurrency(data.net_gain_active)}
          icon={DollarSign}
          positive={data.net_gain_active >= 0}
        />
        <MetricCard
          title="System Progress"
          subtitle="Ciclos concluídos"
          value={`${data.cycles_completed} / ${data.cycles_total}`}
          icon={TrendingUp}
        >
          <div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
              <span>Progresso total</span>
              <span className="text-yellow-500 font-semibold">{data.progress_pct}%</span>
            </div>
            <div className="h-1.5 bg-dark-500 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${data.progress_pct}%` }}
              />
            </div>
          </div>
        </MetricCard>
      </div>
    </section>
  )
}

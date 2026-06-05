import { useState, useEffect } from 'react'
import { Save, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { apiClient } from '@/services/apiClient'
import { useStore } from '@/store/useStore'
import { Parameters } from '@/types'

const DEFAULT_PARAMS: Parameters = {
  bankroll: 1000,
  stake_unit: 50,
  cycles: 10,
  target_return_pct: 15,
}

function parseMoney(value: string): number {
  return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0
}

type FormState = {
  bankroll: string
  stake_unit: string
  cycles: string
  target_return_pct: string
}

function toFormState(p: Parameters): FormState {
  return {
    bankroll: p.bankroll.toFixed(2).replace('.', ','),
    stake_unit: p.stake_unit.toFixed(2).replace('.', ','),
    cycles: p.cycles.toString(),
    target_return_pct: p.target_return_pct.toString(),
  }
}

export default function ParametersForm() {
  const { parameters, setParameters } = useStore((s) => ({
    parameters: s.parameters,
    setParameters: s.setParameters,
  }))

  const [form, setForm] = useState<FormState>(toFormState(parameters))
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(toFormState(parameters))
  }, [parameters])

  const handleMoneyInput =
    (field: 'bankroll' | 'stake_unit') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '')
      if (!raw) {
        setForm((f) => ({ ...f, [field]: '' }))
        return
      }
      const number = parseInt(raw, 10) / 100
      setForm((f) => ({
        ...f,
        [field]: number.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const payload: Parameters = {
        bankroll: parseMoney(form.bankroll),
        stake_unit: parseMoney(form.stake_unit),
        cycles: parseInt(form.cycles, 10),
        target_return_pct: parseFloat(form.target_return_pct),
      }
      const updated = await apiClient.updateParameters(payload)
      setParameters(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      console.error('Failed to save parameters')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => setForm(toFormState(DEFAULT_PARAMS))

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal size={16} className="text-yellow-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Parameters
        </h2>
      </div>

      <div className="card-premium">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label-premium">Bankroll Inicial</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.bankroll}
                  onChange={handleMoneyInput('bankroll')}
                  placeholder="1.000,00"
                  className="input-premium w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label-premium">Unidade de Stake</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.stake_unit}
                  onChange={handleMoneyInput('stake_unit')}
                  placeholder="50,00"
                  className="input-premium w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label-premium">Número de Ciclos</label>
              <input
                type="number"
                min={1}
                max={100}
                value={form.cycles}
                onChange={(e) => setForm((f) => ({ ...f, cycles: e.target.value }))}
                placeholder="10"
                className="input-premium w-full"
              />
            </div>

            <div>
              <label className="label-premium">Retorno Alvo (%)</label>
              <div className="relative">
                <input
                  type="number"
                  min={0.1}
                  max={200}
                  step={0.1}
                  value={form.target_return_pct}
                  onChange={(e) => setForm((f) => ({ ...f, target_return_pct: e.target.value }))}
                  placeholder="15"
                  className="input-premium w-full pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-dark-500">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Save size={15} />
              {isSaving ? 'Salvando...' : saved ? '✓ Salvo!' : 'Salvar Parâmetros'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <RotateCcw size={14} />
              Restaurar
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

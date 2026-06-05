import { useEffect, useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, Network } from 'lucide-react'
import clsx from 'clsx'
import { apiClient } from '@/services/apiClient'
import { useStore } from '@/store/useStore'
import { OperationNode, MarketType } from '@/types'

const MARKET_TYPES: MarketType[] = [
  'Handicap',
  'Over/Under',
  'Both Teams Score',
  'Moneyline',
  'Double Chance',
]

const EMPTY_NODE: Omit<OperationNode, 'id'> = {
  day: '',
  operation_node: '',
  market_type: 'Handicap',
  invest_cap: 0,
  exp_return: 0,
  completed: false,
}

export default function OperationNodesTable() {
  const { operationNodes, setOperationNodes } = useStore((s) => ({
    operationNodes: s.operationNodes,
    setOperationNodes: s.setOperationNodes,
  }))
  const [isAdding, setIsAdding] = useState(false)
  const [newNode, setNewNode] = useState<Omit<OperationNode, 'id'>>(EMPTY_NODE)

  useEffect(() => {
    apiClient.getOperationNodes().then(setOperationNodes).catch(console.error)
  }, [])

  const toggleCompleted = async (node: OperationNode) => {
    try {
      const updated = await apiClient.updateOperationNode(node.id, {
        ...node,
        completed: !node.completed,
      })
      setOperationNodes(operationNodes.map((n) => (n.id === updated.id ? updated : n)))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteOperationNode(id)
      setOperationNodes(operationNodes.filter((n) => n.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleAdd = async () => {
    if (!newNode.day || !newNode.operation_node) return
    try {
      const created = await apiClient.createOperationNode(newNode)
      setOperationNodes([...operationNodes, created])
      setNewNode(EMPTY_NODE)
      setIsAdding(false)
    } catch (err) {
      console.error(err)
    }
  }

  const completedCount = operationNodes.filter((n) => n.completed).length
  const totalReturn = operationNodes.reduce((acc, n) => acc + n.exp_return, 0)

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network size={16} className="text-yellow-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Operation Nodes
          </h2>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-dark-500 text-xs text-gray-500 font-medium">
            {operationNodes.length}
          </span>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={clsx(
            'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150',
            isAdding
              ? 'bg-dark-500 text-gray-400 hover:bg-dark-400'
              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/15'
          )}
        >
          <Plus size={13} />
          {isAdding ? 'Cancelar' : 'Adicionar Nó'}
        </button>
      </div>

      <div className="card-premium p-0 overflow-hidden">
        {isAdding && (
          <div className="border-b border-dark-400 p-4 bg-dark-600/50 animate-slide-up">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
              Novo Nó de Operação
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <input
                placeholder="Dia (ex: Mon)"
                value={newNode.day}
                onChange={(e) => setNewNode((n) => ({ ...n, day: e.target.value }))}
                className="input-premium text-sm"
              />
              <input
                placeholder="Nome do nó"
                value={newNode.operation_node}
                onChange={(e) => setNewNode((n) => ({ ...n, operation_node: e.target.value }))}
                className="input-premium text-sm"
              />
              <select
                value={newNode.market_type}
                onChange={(e) =>
                  setNewNode((n) => ({ ...n, market_type: e.target.value as MarketType }))
                }
                className="input-premium text-sm"
              >
                {MARKET_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Invest Cap"
                value={newNode.invest_cap || ''}
                onChange={(e) =>
                  setNewNode((n) => ({ ...n, invest_cap: parseFloat(e.target.value) || 0 }))
                }
                className="input-premium text-sm"
              />
              <input
                type="number"
                placeholder="Exp. Return"
                value={newNode.exp_return || ''}
                onChange={(e) =>
                  setNewNode((n) => ({ ...n, exp_return: parseFloat(e.target.value) || 0 }))
                }
                className="input-premium text-sm"
              />
              <button onClick={handleAdd} className="btn-primary text-sm">
                Adicionar
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-400">
                {['OK', 'Day', 'Operation Node', 'Market Type', 'Invest Cap', 'Exp. Return', ''].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {operationNodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-700">
                      <Network size={24} className="opacity-30" />
                      <p className="text-sm">Nenhum nó de operação cadastrado</p>
                      <p className="text-xs">Clique em &quot;Adicionar Nó&quot; para começar</p>
                    </div>
                  </td>
                </tr>
              ) : (
                operationNodes.map((node) => (
                  <tr
                    key={node.id}
                    className={clsx(
                      'border-b border-dark-700 transition-colors duration-100 hover:bg-dark-600/40',
                      node.completed && 'opacity-60'
                    )}
                  >
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => toggleCompleted(node)}
                        className="transition-transform duration-150 hover:scale-110 active:scale-95"
                      >
                        {node.completed ? (
                          <CheckCircle2 size={18} className="text-green-400" />
                        ) : (
                          <Circle size={18} className="text-gray-600 hover:text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono font-semibold text-gray-400 bg-dark-500 px-2 py-0.5 rounded">
                        {node.day}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-medium text-white">
                      {node.operation_node}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="badge-pending">{node.market_type}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-mono text-gray-300">
                      R$ {node.invest_cap.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-mono text-green-400 font-semibold">
                      R$ {node.exp_return.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleDelete(node.id)}
                        className="p-1.5 rounded text-gray-700 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {operationNodes.length > 0 && (
          <div className="px-4 py-3 border-t border-dark-700 flex items-center justify-between text-xs text-gray-600">
            <span>{completedCount} de {operationNodes.length} concluídos</span>
            <span className="text-green-500/70">
              Retorno esperado total: R$ {totalReturn.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

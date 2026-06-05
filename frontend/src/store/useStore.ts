import { create } from 'zustand'
import { Parameters, SummaryResponse, OperationNode, ApiIntegrationConfig } from '@/types'

interface AppState {
  parameters: Parameters
  summary: SummaryResponse | null
  operationNodes: OperationNode[]
  apiConfig: ApiIntegrationConfig
  isLoading: boolean
  error: string | null

  setParameters: (params: Parameters) => void
  setSummary: (summary: SummaryResponse) => void
  setOperationNodes: (nodes: OperationNode[]) => void
  setApiConfig: (config: Partial<ApiIntegrationConfig>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useStore = create<AppState>((set) => ({
  parameters: {
    bankroll: 1000,
    stake_unit: 50,
    cycles: 10,
    target_return_pct: 15,
  },
  summary: null,
  operationNodes: [],
  apiConfig: {
    endpoint: '',
    apiKey: '',
    isConnected: false,
  },
  isLoading: false,
  error: null,

  setParameters: (params) => set({ parameters: params }),
  setSummary: (summary) => set({ summary }),
  setOperationNodes: (nodes) => set({ operationNodes: nodes }),
  setApiConfig: (config) =>
    set((state) => ({ apiConfig: { ...state.apiConfig, ...config } })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

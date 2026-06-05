export interface Parameters {
  bankroll: number
  stake_unit: number
  cycles: number
  target_return_pct: number
}

export interface SummaryResponse {
  ultimate_goal: number
  current_balance: number
  net_gain_active: number
  cycles_completed: number
  cycles_total: number
  progress_pct: number
}

export type MarketType =
  | 'Handicap'
  | 'Over/Under'
  | 'Both Teams Score'
  | 'Moneyline'
  | 'Double Chance'

export interface OperationNode {
  id: string
  day: string
  operation_node: string
  market_type: MarketType
  invest_cap: number
  exp_return: number
  completed: boolean
}

export interface PayloadExample {
  endpoint: string
  method: string
  headers: Record<string, string>
  body: Record<string, unknown>
}

export interface ApiIntegrationConfig {
  endpoint: string
  apiKey: string
  isConnected: boolean
}

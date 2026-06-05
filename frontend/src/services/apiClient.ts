import axios from 'axios'
import {
  Parameters,
  SummaryResponse,
  OperationNode,
  PayloadExample,
} from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error?.response?.data ?? error.message)
    return Promise.reject(error)
  }
)

export const apiClient = {
  async getSummary(): Promise<SummaryResponse> {
    const { data } = await api.get<SummaryResponse>('/summary')
    return data
  },

  async getParameters(): Promise<Parameters> {
    const { data } = await api.get<Parameters>('/parameters')
    return data
  },

  async updateParameters(params: Parameters): Promise<Parameters> {
    const { data } = await api.post<Parameters>('/parameters', params)
    return data
  },

  async getOperationNodes(): Promise<OperationNode[]> {
    const { data } = await api.get<OperationNode[]>('/operation-nodes')
    return data
  },

  async createOperationNode(
    node: Omit<OperationNode, 'id'>
  ): Promise<OperationNode> {
    const { data } = await api.post<OperationNode>('/operation-nodes', node)
    return data
  },

  async updateOperationNode(
    id: string,
    node: Omit<OperationNode, 'id'>
  ): Promise<OperationNode> {
    const { data } = await api.put<OperationNode>(`/operation-nodes/${id}`, node)
    return data
  },

  async deleteOperationNode(id: string): Promise<void> {
    await api.delete(`/operation-nodes/${id}`)
  },

  async getPayloadExample(): Promise<PayloadExample> {
    const { data } = await api.get<PayloadExample>('/payload-example')
    return data
  },
}

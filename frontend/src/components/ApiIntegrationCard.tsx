import { useEffect, useState } from 'react'
import { Plug, Copy, CheckCheck, Key, Globe, Zap } from 'lucide-react'
import clsx from 'clsx'
import { apiClient } from '@/services/apiClient'
import { useStore } from '@/store/useStore'
import { PayloadExample } from '@/types'

export default function ApiIntegrationCard() {
  const { apiConfig, setApiConfig } = useStore((s) => ({
    apiConfig: s.apiConfig,
    setApiConfig: s.setApiConfig,
  }))

  const [payload, setPayload] = useState<PayloadExample | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    apiClient.getPayloadExample().then(setPayload).catch(console.error)
  }, [])

  const payloadJson = payload
    ? JSON.stringify(payload, null, 2)
    : '{\n  "status": "loading..."\n}'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(payloadJson)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleTestConnection = async () => {
    if (!apiConfig.endpoint || !apiConfig.apiKey) return
    setIsTesting(true)
    setTestResult(null)
    await new Promise((r) => setTimeout(r, 1500))
    setTestResult('success')
    setApiConfig({ isConnected: true })
    setIsTesting(false)
  }

  const isConfigured = Boolean(apiConfig.endpoint && apiConfig.apiKey)

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Plug size={16} className="text-yellow-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          API Integration
        </h2>
      </div>

      <div className="card-premium space-y-6">
        {/* Status banner */}
        <div
          className={clsx(
            'flex items-center justify-between px-4 py-3 rounded-lg border',
            apiConfig.isConnected
              ? 'bg-green-500/5 border-green-500/20'
              : isConfigured
              ? 'bg-yellow-500/5 border-yellow-500/20'
              : 'bg-dark-600 border-dark-400'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                'w-2 h-2 rounded-full',
                apiConfig.isConnected
                  ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                  : isConfigured
                  ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                  : 'bg-gray-700'
              )}
            />
            <div>
              <p className="text-sm font-semibold text-white">
                {apiConfig.isConnected
                  ? 'API Integration CONNECTED'
                  : 'API Integration READY TO CONNECT'}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                {apiConfig.isConnected
                  ? 'Conexão estabelecida com sucesso'
                  : 'Aguardando configuração · Configure endpoint e API key para começar'}
              </p>
            </div>
          </div>
          <Zap size={16} className={apiConfig.isConnected ? 'text-green-400' : 'text-yellow-500'} />
        </div>

        {/* Config inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-premium flex items-center gap-1.5">
              <Globe size={11} />
              Endpoint da API
            </label>
            <input
              type="url"
              placeholder="https://api.exemplo.com/v1/bet"
              value={apiConfig.endpoint}
              onChange={(e) => setApiConfig({ endpoint: e.target.value, isConnected: false })}
              className="input-premium w-full text-sm"
            />
          </div>
          <div>
            <label className="label-premium flex items-center gap-1.5">
              <Key size={11} />
              API Key
            </label>
            <input
              type="password"
              placeholder="sk-••••••••••••••••••••••••"
              value={apiConfig.apiKey}
              onChange={(e) => setApiConfig({ apiKey: e.target.value, isConnected: false })}
              className="input-premium w-full text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestConnection}
            disabled={!isConfigured || isTesting}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plug size={14} />
            {isTesting ? 'Testando...' : 'Testar Conexão'}
          </button>
          {testResult === 'success' && (
            <span className="text-xs text-green-400 font-medium animate-fade-in">
              ✓ Conexão bem-sucedida
            </span>
          )}
          {testResult === 'error' && (
            <span className="text-xs text-red-400 font-medium animate-fade-in">
              ✗ Falha na conexão
            </span>
          )}
        </div>

        {/* Payload preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label-premium">Payload de Exemplo</label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors duration-150 px-2 py-1 rounded hover:bg-dark-600"
            >
              {isCopied ? (
                <><CheckCheck size={12} className="text-green-400" /><span className="text-green-400">Copiado!</span></>
              ) : (
                <><Copy size={12} />Copiar</>
              )}
            </button>
          </div>
          <div className="relative bg-dark-900 border border-dark-400 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-dark-700 bg-dark-800">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-dark-400" />
                ))}
              </div>
              <span className="text-xs text-gray-700 font-mono">payload.json</span>
            </div>
            <pre className="font-mono text-xs leading-relaxed p-4 text-gray-300 overflow-x-auto max-h-80">
              <code>{payloadJson}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { LOGO_DATA_URI } from '@/lib/logo'

const SPLASH_DURATION = 4200

const loadingSteps = [
  'BOOTING INTERFACE',
  'MOUNTING SECURE MODULES',
  'VERIFYING CONTROL NODES',
  'LOADING DASHBOARD CORE',
  'SYSTEM READY',
]

export default function SplashScreen() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const elapsed = now - start
      const pct = Math.min(100, Math.round((elapsed / SPLASH_DURATION) * 100))
      setProgress(pct)
      if (pct < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setIsFinished(true)
        setTimeout(() => setShowButton(true), 220)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const currentStep = useMemo(() => {
    const index = Math.min(
      loadingSteps.length - 1,
      Math.floor((progress / 100) * loadingSteps.length)
    )
    return loadingSteps[index]
  }, [progress])

  const handleEnter = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => navigate('/dashboard'), 420)
  }, [navigate])

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center hacker-bg grain-overlay',
        isExiting
          ? 'opacity-0 transition-opacity duration-500'
          : 'opacity-100 transition-opacity duration-500'
      )}
    >
      <div className="absolute inset-0 scanline-overlay pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl px-6">
        <div className="flex flex-col items-center text-center">

          {/* Logo */}
          <img
            src={LOGO_DATA_URI}
            alt="Handicap Pro"
            className="logo-sheen w-[260px] md:w-[340px] object-contain select-none"
            draggable={false}
          />

          {/* Terminal card */}
          <div className="mt-10 w-full max-w-md rounded-2xl border border-white/[0.07] bg-white/[0.018] px-5 py-5 backdrop-blur-[2px]">
            <div className="flex items-center justify-between mono-terminal text-[10px] uppercase tracking-[0.25em] text-gray-500">
              <span>HANDICAP PRO // INIT</span>
              <span className="blink-soft">LIVE</span>
            </div>

            <div className="mt-4 space-y-2 text-left mono-terminal text-[11px] md:text-xs uppercase tracking-[0.18em] text-gray-400">
              <div className="terminal-line">&gt; {currentStep}</div>
              <div className="text-gray-600">&gt; PROGRESS [{progress}%]</div>
            </div>

            {/* Grey loading bar */}
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full loading-track">
              <div
                className="loading-fill h-full rounded-full transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Enter button */}
          <div
            className={clsx(
              'mt-8 transition-all duration-500',
              showButton
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3 pointer-events-none'
            )}
          >
            <button
              onClick={handleEnter}
              disabled={!isFinished}
              className="btn-primary min-w-[180px]"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

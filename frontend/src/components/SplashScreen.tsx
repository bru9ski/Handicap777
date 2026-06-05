import { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

const SPLASH_DURATION = 4200
const LOGO_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAABiJklEQVR4nO3deXxU5f3/8dc5M5M9k0lmNqSQkJAtC7IioKALiGUXxQVFcMUr1LXg1+Veq66iVqtrtYJaRFBEpC4gCuIqW0A2QhZCSJYZssm8ybzvH5N5JpPJnJkzM5P5fDzP4+E8M3Nyzjnf8z3P+5wz55w5Q0RERERERERERET0M3L5nQAiIiIiIiIiIiKiW6MDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGdYQMWERERERERERER0Z1hAxYRERERERERERHRnWEDFhEREREREREREdGd8f8A7dNwXz4u5T0AAAAASUVORK5CYII="

const loadingSteps = [
  'BOOTING INTERFACE',
  'MOUNTING SECURE MODULES',
  'VERIFYING CONTROL NODES',
  'LOADING DASHBOARD CORE',
  'SYSTEM READY'
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
        isExiting ? 'opacity-0 transition-opacity duration-500' : 'opacity-100 transition-opacity duration-500'
      )}
    >
      <div className="absolute inset-0 scanline-overlay pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl px-6">
        <div className="flex flex-col items-center text-center">
          <img
            src={LOGO_DATA_URI}
            alt="Handicap Pro"
            className="logo-sheen w-[250px] md:w-[320px] object-contain select-none"
            draggable={false}
          />

          <div className="mt-10 w-full max-w-md rounded-2xl border border-white/6 bg-white/[0.015] px-5 py-5 backdrop-blur-[2px]">
            <div className="flex items-center justify-between mono-terminal text-[10px] uppercase tracking-[0.25em] text-gray-500">
              <span>HANDICAP PRO // INIT</span>
              <span className="blink-soft">LIVE</span>
            </div>

            <div className="mt-4 space-y-2 text-left mono-terminal text-[11px] md:text-xs uppercase tracking-[0.18em] text-gray-400">
              <div className="terminal-line">&gt; {currentStep}</div>
              <div className="text-gray-600">&gt; PROGRESS [{progress}%]</div>
            </div>

            <div className="mt-5 h-2 w-full overflow-hidden rounded-full loading-track">
              <div
                className="loading-fill h-full rounded-full transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div
            className={clsx(
              'mt-8 transition-all duration-500',
              showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
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

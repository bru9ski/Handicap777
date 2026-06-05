import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

const SPLASH_DURATION = 4000
const COUNTDOWN_FROM = 3

function SevenSegmentDigit({ char, dim = false }: { char: string; dim?: boolean }) {
  return (
    <span
      className={clsx(
        'seven-segment text-6xl md:text-8xl font-bold tabular-nums transition-all duration-300',
        dim ? 'segment-off' : 'segment-digit'
      )}
      style={{ minWidth: '1ch', display: 'inline-block', textAlign: 'center' }}
    >
      {char}
    </span>
  )
}

function SevenSegmentDisplay({ value, isOff }: { value: number; isOff: boolean }) {
  const str = value.toString()
  return (
    <div className="flex items-center justify-center gap-2 my-8">
      <span
        className={clsx(
          'seven-segment text-xs uppercase tracking-[0.4em] font-medium transition-all duration-300',
          isOff ? 'text-yellow-500/10' : 'text-yellow-500/60'
        )}
      >
        LOADING
      </span>
      <div className="flex items-center gap-1 mx-4">
        {str.split('').map((ch, i) => (
          <SevenSegmentDigit key={i} char={ch} dim={isOff} />
        ))}
      </div>
      <span
        className={clsx(
          'seven-segment text-xs uppercase tracking-[0.4em] font-medium transition-all duration-300',
          isOff ? 'text-yellow-500/10' : 'text-yellow-500/60'
        )}
      >
        SEC
      </span>
    </div>
  )
}

function LogoDisplay() {
  const [imgFailed, setImgFailed] = useState(false)

  if (imgFailed) {
    return (
      <div className="flex items-center gap-3">
        <svg width="52" height="68" viewBox="0 0 48 64" fill="none">
          <polygon
            points="24,0 36,28 28,28 34,64 12,32 22,32"
            fill="#FFD700"
            style={{ filter: 'drop-shadow(0 0 14px rgba(255,215,0,0.8))' }}
          />
        </svg>
        <div className="flex flex-col leading-none">
          <span className="text-white text-3xl font-extrabold tracking-widest uppercase">
            HANDICAP
          </span>
          <span className="text-yellow-400 text-sm font-semibold tracking-[0.35em] uppercase mt-0.5">
            PRO
          </span>
        </div>
      </div>
    )
  }

  return (
    <img
      src="/logo.png"
      alt="Handicap Pro"
      className="max-h-24 max-w-[280px] object-contain"
      onError={() => setImgFailed(true)}
    />
  )
}

export default function SplashScreen() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM)
  const [isSegOff, setIsSegOff] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const intervalMs = SPLASH_DURATION / COUNTDOWN_FROM
    const timer = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(timer)
          setTimeout(() => {
            setIsSegOff(true)
            setTimeout(() => {
              setIsFinished(true)
              setShowButton(true)
            }, 400)
          }, 300)
          return 0
        }
        return next
      })
    }, intervalMs)
    return () => clearInterval(timer)
  }, [])

  const handleEnter = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => navigate('/dashboard'), 450)
  }, [navigate])

  return (
    <div
      className={clsx(
        'grain-overlay fixed inset-0 z-50 flex flex-col items-center justify-center',
        'transition-opacity duration-500',
        isExiting ? 'opacity-0' : 'opacity-100'
      )}
      style={{
        background: 'radial-gradient(ellipse at center, #14140F 0%, #0A0A0B 70%)',
      }}
    >
      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,215,0,0.3) 60px, rgba(255,215,0,0.3) 61px)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with glow animation */}
        <div
          className={clsx(!isFinished && 'animate-pulse-glow')}
        >
          <LogoDisplay />
        </div>

        {/* 7-Segment countdown */}
        <div
          className={clsx(
            'transition-all duration-400',
            isSegOff ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          )}
        >
          <SevenSegmentDisplay value={countdown} isOff={isSegOff} />
        </div>

        {/* Progress bar */}
        {!isFinished && (
          <div className="w-48 h-0.5 bg-dark-400 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-yellow-500 rounded-full"
              style={{
                width: `${((COUNTDOWN_FROM - countdown) / COUNTDOWN_FROM) * 100}%`,
                transition: `width ${SPLASH_DURATION / COUNTDOWN_FROM}ms linear`,
              }}
            />
          </div>
        )}

        {/* Enter button */}
        <div
          className={clsx(
            'mt-10 flex flex-col items-center gap-2 transition-all duration-500',
            showButton
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          )}
        >
          <button
            className="btn-primary min-w-[180px] text-base tracking-widest uppercase"
            onClick={handleEnter}
            disabled={!showButton}
          >
            Entrar
          </button>
          <p className="text-xs text-gray-700 tracking-[0.3em] uppercase">
            Sistema pronto
          </p>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOGO_DATA_URI } from '@/lib/logo'

// ─── Particle type ───────────────────────────────────────────────────────────
interface Particle {
  id: number
  x: number
  y: number
  size: number
  dur: number
  delay: number
  dx: number
  dy: number
}

function makeParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 30 + Math.random() * 50,
    size: 1 + Math.random() * 2.5,
    dur: 4 + Math.random() * 7,
    delay: Math.random() * 6,
    dx: -20 + Math.random() * 40,
    dy: -60 - Math.random() * 80,
  }))
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SplashScreen() {
  const navigate = useNavigate()
  const [showBtn, setShowBtn] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const particles = useRef<Particle[]>(makeParticles(22))

  // Show Enter button at 5 s
  useEffect(() => {
    const t = setTimeout(() => setShowBtn(true), 5000)
    return () => clearTimeout(t)
  }, [])

  const handleEnter = useCallback(() => {
    if (!showBtn) return
    setIsExiting(true)
    setTimeout(() => navigate('/dashboard'), 700)
  }, [navigate, showBtn])

  // Keyboard Enter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleEnter()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleEnter])

  return (
    <>
      {/* ── Injected keyframe styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600&display=swap');

        .hp-screen {
          position: fixed; inset: 0; z-index: 9999;
          background: #000;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 48px;
          transition: opacity 0.7s cubic-bezier(0.7,0,1,1);
        }
        .hp-screen.hp-exit { opacity: 0; pointer-events: none; }

        /* vignette */
        .hp-vignette {
          position: fixed; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%);
        }

        /* logo container */
        .hp-logo-wrap {
          position: relative;
          display: flex; flex-direction: column; align-items: center;
          animation: hpLogoReveal 1.1s cubic-bezier(0.16,1,0.3,1) 0.3s both;
        }
        @keyframes hpLogoReveal {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* gleam clip wrapper */
        .hp-gleam-host {
          position: relative; overflow: hidden; border-radius: 4px;
        }

        /* logo image glow */
        .hp-logo-img {
          display: block; width: clamp(260px, 38vw, 440px); height: auto;
          user-select: none; pointer-events: none;
          animation: hpLogoGlow 3.5s ease-in-out 1.4s infinite alternate;
        }
        @keyframes hpLogoGlow {
          0%   { filter: drop-shadow(0 0 6px rgba(245,197,24,.25)) drop-shadow(0 0 20px rgba(245,197,24,.08)); }
          100% { filter: drop-shadow(0 0 18px rgba(245,197,24,.55)) drop-shadow(0 0 48px rgba(245,197,24,.22)); }
        }

        /* metallic gleam overlay on logo */
        .hp-gleam {
          position: absolute; inset: 0; pointer-events: none;
          border-radius: 4px;
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255,255,255,0) 35%,
            rgba(255,255,255,.28) 47%,
            rgba(255,255,255,.55) 50%,
            rgba(255,255,255,.28) 53%,
            rgba(255,255,255,0) 65%,
            transparent 80%
          );
          background-size: 300% 100%;
          animation: hpGleamSlide 3.8s ease-in-out 2.2s infinite;
        }
        @keyframes hpGleamSlide {
          0%   { background-position: -100% 0; opacity: 0; }
          8%   { opacity: 1; }
          50%  { background-position: 200% 0; opacity: 1; }
          65%  { opacity: 0; }
          100% { background-position: 200% 0; opacity: 0; }
        }

        /* enter button */
        .hp-btn {
          position: relative; overflow: hidden;
          font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif;
          font-weight: 700;
          font-size: clamp(13px, 1.4vw, 15px);
          letter-spacing: .22em;
          text-transform: uppercase;
          color: #F5C518;
          background: transparent;
          border: 1px solid rgba(245,197,24,.55);
          border-radius: 3px;
          padding: 14px 52px;
          cursor: pointer;
          transition: background 200ms ease, border-color 200ms ease,
                      color 200ms ease, box-shadow 200ms ease,
                      opacity 0.9s cubic-bezier(0.16,1,0.3,1),
                      transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .hp-btn.hp-btn-hidden { opacity: 0; transform: translateY(16px); pointer-events: none; }
        .hp-btn.hp-btn-visible { opacity: 1; transform: translateY(0); }

        .hp-btn::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(
            105deg,
            transparent 25%,
            rgba(255,255,255,0) 38%,
            rgba(255,255,255,.18) 48%,
            rgba(255,255,255,.35) 50%,
            rgba(255,255,255,.18) 52%,
            rgba(255,255,255,0) 62%,
            transparent 75%
          );
          background-size: 300% 100%;
          animation: hpBtnGleam 3.8s ease-in-out 5.8s infinite;
        }
        @keyframes hpBtnGleam {
          0%   { background-position: -100% 0; opacity: 0; }
          8%   { opacity: 1; }
          50%  { background-position: 200% 0; opacity: 1; }
          65%  { opacity: 0; }
          100% { background-position: 200% 0; opacity: 0; }
        }
        .hp-btn:hover {
          background: rgba(245,197,24,.08);
          border-color: #F5C518;
          color: #fff;
          box-shadow: 0 0 24px rgba(245,197,24,.22), 0 0 6px rgba(245,197,24,.12);
        }
        .hp-btn:active {
          background: rgba(245,197,24,.15);
          box-shadow: 0 0 32px rgba(245,197,24,.3);
        }

        /* particles */
        .hp-particle {
          position: fixed;
          width: var(--sz); height: var(--sz);
          background: #F5C518;
          border-radius: 50%;
          pointer-events: none;
          animation: hpParticleDrift var(--dur) ease-in var(--delay) infinite;
        }
        @keyframes hpParticleDrift {
          0%   { opacity: 0;    transform: translate(0,0) scale(1); }
          15%  { opacity: .55; }
          70%  { opacity: .3; }
          100% { opacity: 0;   transform: translate(var(--dx), var(--dy)) scale(.4); }
        }

        /* tagline */
        .hp-tagline {
          position: fixed; bottom: clamp(24px, 4vh, 48px);
          left: 50%; transform: translateX(-50%);
          font-family: 'Barlow', Arial, sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: .28em; text-transform: uppercase;
          color: rgba(255,255,255,.18); white-space: nowrap;
          animation: hpTagReveal 1.2s ease 1.8s both;
        }
        @keyframes hpTagReveal { from { opacity:0 } to { opacity:1 } }

        @media (prefers-reduced-motion: reduce) {
          .hp-logo-wrap, .hp-logo-img, .hp-gleam, .hp-btn, .hp-particle, .hp-tagline {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* ── Particles ── */}
      {particles.current.map(p => (
        <div
          key={p.id}
          className="hp-particle"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            ['--sz' as string]: `${p.size}px`,
            ['--dur' as string]: `${p.dur}s`,
            ['--delay' as string]: `${p.delay}s`,
            ['--dx' as string]: `${p.dx}px`,
            ['--dy' as string]: `${p.dy}px`,
          }}
        />
      ))}

      {/* ── Vignette ── */}
      <div className="hp-vignette" />

      {/* ── Main screen ── */}
      <div className={`hp-screen${isExiting ? ' hp-exit' : ''}`}>

        {/* Logo */}
        <div className="hp-logo-wrap">
          <div className="hp-gleam-host">
            <img
              src={LOGO_DATA_URI}
              alt="Handicap Pro"
              className="hp-logo-img"
              draggable={false}
            />
            <div className="hp-gleam" />
          </div>
        </div>

        {/* Enter button — appears at 5 s */}
        <button
          className={`hp-btn ${showBtn ? 'hp-btn-visible' : 'hp-btn-hidden'}`}
          onClick={handleEnter}
          disabled={!showBtn}
          aria-label="Entrar na plataforma"
        >
          Entrar
        </button>
      </div>

      {/* ── Tagline ── */}
      <div className="hp-tagline">© 2025 Handicap Pro — Plataforma Premium de Apostas</div>
    </>
  )
}

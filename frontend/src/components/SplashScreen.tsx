import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

interface Particle {
  id: number; x: number; y: number; size: number
  dur: number; delay: number; dx: number; dy: number
}

function makeParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 25 + Math.random() * 55,
    size: 1 + Math.random() * 2.5,
    dur: 4 + Math.random() * 7,
    delay: Math.random() * 6,
    dx: -20 + Math.random() * 40,
    dy: -60 - Math.random() * 80,
  }))
}

// ── Inline SVG logo (HANDICAP PRO) ───────────────────────────────────────────
function HandicapProLogo() {
  return (
    <svg
      viewBox="0 0 500 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Handicap Pro"
      style={{ width: 'clamp(280px, 42vw, 480px)', height: 'auto', display: 'block' }}
    >
      <defs>
        <linearGradient id="boltG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="50%" stopColor="#F5C518" />
          <stop offset="100%" stopColor="#C8960C" />
        </linearGradient>
        <filter id="boltGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ⚡ Lightning bolt */}
      <g className="hp-bolt" filter="url(#boltGlow)">
        <polygon
          points="66,10 40,84 62,84 36,156 98,70 72,70 96,10"
          fill="url(#boltG)"
        />
        <polygon
          points="69,20 49,78 65,78 47,136 86,76 68,76 88,20"
          fill="rgba(255,240,150,0.2)"
        />
      </g>

      {/* HANDICAP */}
      <text
        x="120" y="96"
        fontFamily="'Barlow Condensed','Arial Narrow',sans-serif"
        fontWeight="900"
        fontSize="90"
        letterSpacing="-1"
        fill="#FFFFFF"
      >HANDICAP</text>

      {/* PRO badge */}
      <rect x="120" y="112" width="72" height="30" rx="2" fill="#F5C518" />
      <text
        x="156" y="133"
        fontFamily="'Barlow Condensed','Arial Narrow',sans-serif"
        fontWeight="800"
        fontSize="18"
        letterSpacing="3"
        fill="#000"
        textAnchor="middle"
      >PRO</text>

      {/* separator */}
      <line x1="204" y1="118" x2="478" y2="118" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* tagline */}
      <text
        x="206" y="135"
        fontFamily="'Barlow',Arial,sans-serif"
        fontWeight="500"
        fontSize="11"
        letterSpacing="3.5"
        fill="rgba(255,255,255,0.35)"
      >ANÁLISE · APOSTAS · RESULTADOS</text>
    </svg>
  )
}

// ── Main SplashScreen ─────────────────────────────────────────────────────
export default function SplashScreen() {
  const navigate = useNavigate()
  const [showBtn, setShowBtn] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const particles = useRef<Particle[]>(makeParticles(22))

  useEffect(() => {
    const t = setTimeout(() => setShowBtn(true), 5000)
    return () => clearTimeout(t)
  }, [])

  const handleEnter = useCallback(() => {
    if (!showBtn) return
    setIsExiting(true)
    setTimeout(() => navigate('/dashboard'), 700)
  }, [navigate, showBtn])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter') handleEnter() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleEnter])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600&display=swap');

        .hp-screen {
          position: fixed; inset: 0; z-index: 9999;
          background: #000;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 52px;
          transition: opacity 0.7s cubic-bezier(0.7,0,1,1);
        }
        .hp-exit { opacity: 0 !important; pointer-events: none; }

        .hp-vignette {
          position: fixed; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 90% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.6) 100%);
        }

        /* ── Logo ── */
        .hp-logo-wrap {
          position: relative;
          animation: hpReveal 1.1s cubic-bezier(0.16,1,0.3,1) 0.3s both;
        }
        @keyframes hpReveal {
          from { opacity: 0; transform: scale(0.88) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .hp-gleam-host { position: relative; overflow: hidden; }

        /* bolt pulse */
        .hp-bolt {
          animation: hpBolt 2.2s ease-in-out 1.2s infinite;
        }
        @keyframes hpBolt {
          0%   { opacity: 1; }
          40%  { opacity: 0.5; }
          60%  { opacity: 1; }
          80%  { opacity: 0.72; }
          100% { opacity: 1; }
        }

        /* logo glow */
        .hp-logo-svg {
          animation: hpGlow 3.5s ease-in-out 1.4s infinite alternate;
        }
        @keyframes hpGlow {
          0%   { filter: drop-shadow(0 0 6px rgba(245,197,24,.2)) drop-shadow(0 0 18px rgba(245,197,24,.06)); }
          100% { filter: drop-shadow(0 0 20px rgba(245,197,24,.6)) drop-shadow(0 0 50px rgba(245,197,24,.22)); }
        }

        /* metallic gleam */
        .hp-gleam {
          position: absolute; inset: 0; pointer-events: none;
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
          animation: hpGleam 3.8s ease-in-out 2.2s infinite;
        }
        @keyframes hpGleam {
          0%   { background-position: -100% 0; opacity: 0; }
          8%   { opacity: 1; }
          50%  { background-position: 200% 0; opacity: 1; }
          65%  { opacity: 0; }
          100% { background-position: 200% 0; opacity: 0; }
        }

        /* ── Button ── */
        .hp-btn {
          position: relative; overflow: hidden;
          font-family: 'Barlow Condensed','Arial Narrow',sans-serif;
          font-weight: 700;
          font-size: clamp(13px, 1.3vw, 15px);
          letter-spacing: .22em;
          text-transform: uppercase;
          color: #F5C518;
          background: transparent;
          border: 1px solid rgba(245,197,24,.5);
          border-radius: 3px;
          padding: 14px 56px;
          cursor: pointer;
          opacity: 0;
          transform: translateY(18px);
          transition:
            background 200ms ease,
            border-color 200ms ease,
            color 200ms ease,
            box-shadow 200ms ease;
        }
        .hp-btn-show {
          animation: hpBtnReveal 0.9s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes hpBtnReveal {
          to { opacity: 1; transform: translateY(0); }
        }
        .hp-btn::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(
            105deg,
            transparent 25%, rgba(255,255,255,0) 38%,
            rgba(255,255,255,.18) 48%, rgba(255,255,255,.35) 50%,
            rgba(255,255,255,.18) 52%, rgba(255,255,255,0) 62%,
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

        /* ── Particles ── */
        .hp-p {
          position: fixed;
          width: var(--sz); height: var(--sz);
          background: #F5C518;
          border-radius: 50%;
          pointer-events: none;
          animation: hpPDrift var(--dur) ease-in var(--delay) infinite;
        }
        @keyframes hpPDrift {
          0%   { opacity: 0;   transform: translate(0,0) scale(1); }
          15%  { opacity: .5; }
          70%  { opacity: .25; }
          100% { opacity: 0;   transform: translate(var(--dx),var(--dy)) scale(.4); }
        }

        /* ── Tagline ── */
        .hp-tag {
          position: fixed;
          bottom: clamp(20px,4vh,44px);
          left: 50%; transform: translateX(-50%);
          font-family: 'Barlow',Arial,sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: .28em; text-transform: uppercase;
          color: rgba(255,255,255,.16); white-space: nowrap;
          animation: hpTagIn 1.2s ease 1.8s both;
        }
        @keyframes hpTagIn { from { opacity:0 } to { opacity:1 } }

        @media (prefers-reduced-motion: reduce) {
          .hp-logo-wrap { animation: none; opacity: 1; transform: none; }
          .hp-bolt        { animation: none; opacity: 1; }
          .hp-logo-svg    { animation: none; filter: none; }
          .hp-gleam       { animation: none; opacity: 0; }
          .hp-btn         { animation: none !important; opacity: 1 !important; transform: none !important; }
          .hp-btn::before { animation: none; }
          .hp-p           { animation: none; opacity: 0; }
          .hp-tag         { animation: none; opacity: 1; }
        }
      `}</style>

      {/* Particles */}
      {particles.current.map(p => (
        <div key={p.id} className="hp-p" style={{
          left: `${p.x}vw`, top: `${p.y}vh`,
          ['--sz' as string]: `${p.size}px`,
          ['--dur' as string]: `${p.dur}s`,
          ['--delay' as string]: `${p.delay}s`,
          ['--dx' as string]: `${p.dx}px`,
          ['--dy' as string]: `${p.dy}px`,
        }} />
      ))}

      <div className="hp-vignette" />

      <div className={`hp-screen${isExiting ? ' hp-exit' : ''}`}>

        {/* Logo */}
        <div className="hp-logo-wrap">
          <div className="hp-gleam-host">
            <span className="hp-logo-svg">
              <HandicapProLogo />
            </span>
            <div className="hp-gleam" />
          </div>
        </div>

        {/* Enter button */}
        <button
          className={`hp-btn${showBtn ? ' hp-btn-show' : ''}`}
          onClick={handleEnter}
          disabled={!showBtn}
          aria-label="Entrar na plataforma"
        >
          Entrar
        </button>
      </div>

      <div className="hp-tag">&copy; 2025 Handicap Pro — Plataforma Premium de Apostas</div>
    </>
  )
}

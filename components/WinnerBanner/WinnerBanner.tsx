'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Car } from '@/types/cars'
import CarIcon from '@/components/CarIcon/CarIcon'

const CONFETTI_COLORS = ['#fbbf24', '#f87171', '#34d399', '#60a5fa', '#a78bfa', '#f472b6']

const PIECES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  left: `${(i / 20) * 100}%`,
  delay: `${(i * 0.05).toFixed(2)}s`,
  size: [8, 6, 5, 7][i % 4],
}))

export default function WinnerBanner({ car, onClose }: { car: Car; onClose: () => void }) {
  const [exiting, setExiting] = useState(false)

  function handleClose() {
    setExiting(true)
  }

  function handleAnimEnd(e: React.AnimationEvent<HTMLDivElement>) {
    // only react to the banner's own animation, not bubbled child events
    if (e.target === e.currentTarget && exiting) onClose()
  }

  useEffect(() => {
    const t = setTimeout(() => setExiting(true), 6500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50"
      style={{
        animation: exiting
          ? 'winner-exit 0.3s ease-in forwards'
          : 'winner-drop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}
      onAnimationEnd={handleAnimEnd}
    >
      {/* confetti burst */}
      <div className="absolute inset-x-0 top-0 h-0 pointer-events-none overflow-visible">
        {PIECES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animation: `confetti-fall 1.1s ease-in ${p.delay} both`,
            }}
          />
        ))}
      </div>

      {/* card */}
      <div
        className="relative flex flex-col items-center gap-3 px-8 py-5 rounded-3xl border border-yellow-400/40 overflow-hidden min-w-56"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
          boxShadow:
            '0 0 0 1px rgba(251,191,36,0.3), 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(251,191,36,0.15)',
        }}
      >
        {/* top glow */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% -10%, rgba(251,191,36,0.2) 0%, transparent 65%)',
          }}
        />

        <p className="relative text-xs font-semibold tracking-[0.2em] text-yellow-400/70 uppercase leading-none">
          Race Winner
        </p>

        {/* trophy */}
        <span
          className="relative text-5xl leading-none select-none"
          style={{ animation: 'trophy-bounce 1s ease-in-out infinite' }}
        >
          🏆
        </span>

        {/* car name with shimmer */}
        <h2
          className="relative text-2xl font-black tracking-tight leading-none"
          style={{
            background:
              'linear-gradient(90deg, #fbbf24 0%, #fffbeb 35%, #fbbf24 55%, #f59e0b 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 2s linear infinite',
          }}
        >
          {car.name}
        </h2>

        {/* car preview */}
        <div
          className="relative px-5 py-2 rounded-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          <CarIcon color={car.color} width={84} height={38} />
        </div>

        <p className="relative text-yellow-300/70 text-xs font-semibold tracking-widest uppercase">
          Finish line first!
        </p>

        {/* close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-transparent border-none"
        >
          <FontAwesomeIcon icon={faXmark} className="text-xs" />
        </button>
      </div>
    </div>
  )
}

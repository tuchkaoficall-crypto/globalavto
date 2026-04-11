import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M5 17H3a1 1 0 01-1-1v-5l2.5-5h15L22 11v5a1 1 0 01-1 1h-2" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="16.5" cy="17.5" r="2.5" />
    <path d="M5 11h14" />
  </svg>
)

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M12 2L3 7v6c0 5 4 9 9 9s9-4 9-9V7L12 2z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
)

// Хук для анимации числа
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])

  return count
}

function StatItem({ value, label, Icon, suffix = '', delay = 0, started }) {
  const numericValue = parseInt(value.replace(/\D/g, '')) || 0
  const count = useCountUp(numericValue, 1800, started)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center text-center"
    >
      <div className="w-8 h-8 flex items-center justify-center text-white/40 mb-3 mx-auto">
        <Icon />
      </div>
      <div className="font-heading text-4xl md:text-5xl text-brand-red mb-1 leading-none tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-white/50 text-xs font-medium tracking-wide uppercase mt-1">
        {label}
      </div>
    </motion.div>
  )
}

const stats = [
  { value: '500', suffix: '+', label: 'Авто отремонтировано', Icon: CarIcon },
  { value: '2024', suffix: '',  label: 'Год основания',        Icon: CalendarIcon },
  { value: '100', suffix: '%', label: 'Гарантия качества',    Icon: ShieldIcon },
  { value: '8',   suffix: '',  label: 'Видов кузовных работ', Icon: WrenchIcon },
]

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-16 bg-[#111] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, i) => (
            <StatItem
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              Icon={s.Icon}
              delay={i * 0.1}
              started={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

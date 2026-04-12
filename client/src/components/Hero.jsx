import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' }
  })
}

const carSlide = {
  hidden: { x: 160, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 1, ease: 'easeOut', delay: 0.3 } }
}

export default function Hero({ onRequestClick }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '', website: '' })
  const [status, setStatus] = useState(null) // null | 'loading' | 'ok' | 'error'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.website) return // honeypot
    if (!form.name.trim() || !form.phone.trim()) return
    setStatus('loading')
    try {
      await Promise.all([
        axios.post('/api/requests', {
          name: form.name,
          phone: form.phone,
          message: form.message,
        }),
        new Promise(r => setTimeout(r, 2500))
      ])
      setStatus('ok')
      setForm({ name: '', phone: '', message: '', website: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-bg pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-brand-red/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-bg to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — text */}
          <div className="order-2 lg:order-1">
            <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
              <span className="inline-block text-brand-red text-sm font-semibold tracking-widest uppercase mb-4">
                Кузовной сервис
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp} custom={1} initial="hidden" animate="visible"
              className="font-heading text-6xl sm:text-7xl md:text-8xl text-white leading-none tracking-wide mb-4"
            >
              GLOBAL<br />
              <span className="text-brand-red">AUTO</span>
            </motion.h1>

            <motion.p
              variants={fadeUp} custom={2} initial="hidden" animate="visible"
              className="text-white/70 text-lg md:text-xl mb-8 max-w-md"
            >
              Кузовной ремонт в Петрозаводске.<br />
              Профессионально. Быстро. С гарантией.
            </motion.p>

            <motion.div
              variants={fadeUp} custom={3} initial="hidden" animate="visible"
              className="flex flex-wrap gap-4"
            >
              <button onClick={onRequestClick} className="btn-primary text-base px-8 py-3.5">
                Оставить заявку
              </button>
              <a href="tel:631218" className="btn-secondary text-base px-8 py-3.5">
                Позвонить
              </a>
            </motion.div>

            {/* Stats mini */}
            <motion.div
              variants={fadeUp} custom={4} initial="hidden" animate="visible"
              className="flex gap-8 mt-10"
            >
              <div>
                <div className="font-heading text-3xl text-brand-red">500+</div>
                <div className="text-white/50 text-sm">авто отремонтировано</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="font-heading text-3xl text-white">2024</div>
                <div className="text-white/50 text-sm">год основания</div>
              </div>
            </motion.div>
          </div>

          {/* Right — form + car */}
          <div className="order-1 lg:order-2 relative">
            {/* Car silhouette */}
            <motion.div
              variants={carSlide} initial="hidden" animate="visible"
              className="absolute -top-8 -right-4 w-full opacity-10 pointer-events-none select-none hidden lg:block"
            >
              <svg viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <path d="M50 220 L120 180 L200 120 L350 100 L500 110 L620 130 L700 160 L740 200 L750 220 L50 220Z"
                  fill="#E60023" />
                <circle cx="180" cy="230" r="40" fill="#333" />
                <circle cx="600" cy="230" r="40" fill="#333" />
                <circle cx="180" cy="230" r="25" fill="#555" />
                <circle cx="600" cy="230" r="25" fill="#555" />
              </svg>
            </motion.div>

            {/* Form card */}
            <motion.div
              variants={fadeUp} custom={2} initial="hidden" animate="visible"
              className="glass p-6 md:p-8 relative z-10"
            >
              <h2 className="font-heading text-2xl text-white mb-1 tracking-wide">Оставить заявку</h2>
              <p className="text-white/50 text-sm mb-6">Перезвоним в течение 15 минут</p>

              {status === 'ok' ? (
                <div className="text-center py-8">
                  <motion.svg
                    viewBox="0 0 80 80"
                    className="w-16 h-16 mx-auto mb-4"
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.circle cx="40" cy="40" r="36" fill="none" stroke="#E60023" strokeWidth="3"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6 }} />
                    <motion.path d="M24 40 L35 52 L56 28" fill="none" stroke="#E60023" strokeWidth="4"
                      strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }} />
                  </motion.svg>
                  <p className="text-white font-semibold text-lg">Заявка принята!</p>
                  <p className="text-white/50 text-sm mt-1">Мы свяжемся с вами в ближайшее время</p>
                  <button onClick={() => setStatus(null)} className="btn-secondary mt-4 text-sm py-2 px-4">
                    Отправить ещё
                  </button>
                </div>
              ) : status === 'loading' ? (
                <div className="text-center py-8">
                  <div className="relative w-12 h-12 mx-auto mb-4">
                    <motion.div className="absolute inset-0 rounded-full border-2 border-brand-red/20" />
                    <motion.div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-red"
                      animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                  </div>
                  <p className="text-white/70 text-sm">Отправляем заявку...</p>
                  <div className="mt-4 h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-brand-red rounded-full"
                      initial={{ width: '0%' }} animate={{ width: '100%' }}
                      transition={{ duration: 2.5, ease: 'easeInOut' }} />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Honeypot */}
                  <input type="text" name="website" value={form.website} onChange={handleChange}
                    className="hidden" tabIndex={-1} autoComplete="off" />

                  <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Ваше имя *" required
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors"
                  />
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="Телефон *" required
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors"
                  />
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    placeholder="Комментарий (опционально)" rows={3}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors resize-none"
                  />
                  {status === 'error' && (
                    <p className="text-brand-red text-sm">Ошибка отправки. Попробуйте ещё раз.</p>
                  )}
                  <button
                    type="submit"
                    className="btn-primary justify-center py-3.5"
                  >
                    Отправить заявку
                  </button>
                  <p className="text-white/30 text-xs text-center">
                    Нажимая кнопку, вы соглашаетесь с обработкой данных
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

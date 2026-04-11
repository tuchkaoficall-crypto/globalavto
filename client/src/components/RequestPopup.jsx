import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

// Анимированная галочка SVG
function CheckIcon() {
  return (
    <motion.svg
      viewBox="0 0 80 80"
      className="w-20 h-20 mx-auto"
      initial="hidden"
      animate="visible"
    >
      {/* Круг */}
      <motion.circle
        cx="40" cy="40" r="36"
        fill="none"
        stroke="#E60023"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      {/* Галочка */}
      <motion.path
        d="M24 40 L35 52 L56 28"
        fill="none"
        stroke="#E60023"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
      />
    </motion.svg>
  )
}

// Экран загрузки
function LoadingScreen() {
  return (
    <div className="text-center py-10">
      <div className="relative w-16 h-16 mx-auto mb-6">
        {/* Внешнее кольцо */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-red/20"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-red"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {/* Внутреннее кольцо */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-white/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Центральная точка */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-brand-red" />
        </motion.div>
      </div>

      <motion.p
        className="text-white font-semibold text-lg mb-1"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Отправляем заявку...
      </motion.p>
      <p className="text-white/40 text-sm">Пожалуйста, подождите</p>

      {/* Прогресс-бар */}
      <div className="mt-6 h-0.5 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto">
        <motion.div
          className="h-full bg-brand-red rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

// Экран успеха
function SuccessScreen({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="text-center py-8"
    >
      <CheckIcon />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <h3 className="font-heading text-3xl text-white mt-5 mb-2 tracking-wide">
          Заявка принята
        </h3>
        <p className="text-white/50 text-sm mb-1">Мы свяжемся с вами в ближайшее время</p>
        <p className="text-brand-red text-xs font-medium">+7 (8142) 63-12-18</p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        onClick={onClose}
        className="btn-secondary mt-6 text-sm py-2.5 px-6"
      >
        Закрыть
      </motion.button>
    </motion.div>
  )
}

export default function RequestPopup({ isOpen, onClose, brand = '', model = '' }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '', website: '' })
  const [status, setStatus] = useState(null) // null | 'loading' | 'ok' | 'error'

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setTimeout(() => {
        setStatus(null)
        setForm({ name: '', phone: '', message: '', website: '' })
      }, 300)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.website) return
    if (!form.name.trim() || !form.phone.trim()) return
    setStatus('loading')
    try {
      // Минимальная задержка 2.5 сек для красивой анимации загрузки
      const [res] = await Promise.all([
        axios.post('/api/requests', {
          name: form.name,
          phone: form.phone,
          message: form.message,
          brand,
          model,
        }),
        new Promise(r => setTimeout(r, 2500))
      ])
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
            onClick={status === 'loading' ? undefined : onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass w-full max-w-md pointer-events-auto p-6 md:p-8 relative overflow-hidden">
              {/* Декоративная линия сверху */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent" />

              {status !== 'loading' && status !== 'ok' && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/30 hover:text-white text-2xl leading-none transition-colors z-10"
                >
                  ×
                </button>
              )}

              <AnimatePresence mode="wait">
                {status === 'loading' && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LoadingScreen />
                  </motion.div>
                )}

                {status === 'ok' && (
                  <motion.div key="success">
                    <SuccessScreen onClose={onClose} />
                  </motion.div>
                )}

                {(status === null || status === 'error') && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="font-heading text-2xl text-white mb-1 tracking-wide">Оставить заявку</h3>
                    {(brand || model) && (
                      <p className="text-brand-red text-sm mb-4 font-medium">{brand} {model}</p>
                    )}
                    <p className="text-white/50 text-sm mb-6">Перезвоним в течение 15 минут</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                      {brand && (
                        <input type="text" value={brand} readOnly
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/50 cursor-default" />
                      )}
                      {model && (
                        <input type="text" value={model} readOnly
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/50 cursor-default" />
                      )}
                      <textarea
                        name="message" value={form.message} onChange={handleChange}
                        placeholder="Комментарий" rows={3}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors resize-none"
                      />
                      {status === 'error' && (
                        <p className="text-brand-red text-sm">Ошибка отправки. Попробуйте ещё раз.</p>
                      )}
                      <button type="submit" className="btn-primary justify-center py-3.5">
                        Отправить заявку
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

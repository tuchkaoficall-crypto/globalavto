import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const contacts = [
  {
    label: 'Telegram канал',
    sub: '@globalauto_ptz',
    href: 'https://t.me/globalauto_ptz',
    color: '#229ED9',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.95-.924c-.64-.203-.658-.64.136-.954l11.57-4.461c.537-.194 1.006.131.968.893z" />
      </svg>
    ),
  },
  {
    label: 'Telegram консультант',
    sub: '@globalautoptz',
    href: 'https://t.me/globalautoptz',
    color: '#229ED9',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.95-.924c-.64-.203-.658-.64.136-.954l11.57-4.461c.537-.194 1.006.131.968.893z" />
      </svg>
    ),
  },
  {
    label: 'ВКонтакте',
    sub: 'globalauto_ptz',
    href: 'https://vk.link/globalauto_ptz',
    color: '#0077FF',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.491-.085.745-.576.745z" />
      </svg>
    ),
  },
  {
    label: 'Телефон',
    sub: '+7 (8142) 63-12-18',
    href: 'tel:+78142631218',
    color: '#E60023',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
]

export default function FloatContact() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 6000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">

          {/* Контакты — появляются при открытии */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2"
              >
                {/* Заголовок */}
                <div className="glass px-4 py-2 text-right mb-1 w-56">
                  <p className="text-white text-sm font-semibold">Бесплатная консультация</p>
                  <p className="text-white/40 text-xs">Выберите удобный способ связи</p>
                </div>

                {contacts.map((c, i) => (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.15, delay: i * 0.05 }}
                    className="glass flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors duration-150 w-56"
                  >
                    <div className="flex-shrink-0" style={{ color: c.color }}>{c.icon}</div>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-medium truncate">{c.label}</p>
                      <p className="text-white/50 text-xs truncate">{c.sub}</p>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Кнопка-пузырь */}
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={() => setOpen(!open)}
            className="relative w-14 h-14 rounded-full bg-brand-red shadow-lg shadow-brand-red/30 flex items-center justify-center hover:bg-brand-red-hover transition-colors duration-150"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-white text-2xl leading-none"
                >
                  ×
                </motion.span>
              ) : (
                <motion.span
                  key="chat"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </motion.span>
              )}
            </AnimatePresence>

            {/* Пульс когда закрыто */}
            {!open && (
              <span className="absolute inset-0 rounded-full bg-brand-red animate-ping opacity-20" />
            )}
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  )
}

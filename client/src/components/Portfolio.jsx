import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const works = [
  {
    id: 1,
    title: 'Ремонт после ДТП',
    desc: 'Автобус до ремонта — серьёзные повреждения кузова после аварии',
    tag: 'До',
    img: '/assets/raboti/bus1.png',
  },
  {
    id: 2,
    title: 'Ремонт после ДТП',
    desc: 'Автобус после ремонта — полное восстановление кузова',
    tag: 'После',
    img: '/assets/raboti/bus2.png',
  },
  {
    id: 3,
    title: 'Покраска автомобиля',
    desc: 'Профессиональная покраска в камере с подбором цвета',
    tag: 'Покраска',
    img: '/assets/raboti/pokraska.png',
  },
  {
    id: 4,
    title: 'Покраска автомобиля',
    desc: 'Результат покраски — идеальное лакокрасочное покрытие',
    tag: 'Покраска',
    img: '/assets/raboti/pokraska2.png',
  },
]

const tagColors = {
  'До':       'bg-white/10 text-white/60',
  'После':    'bg-green-500/20 text-green-400',
  'Покраска': 'bg-brand-red/20 text-brand-red',
  'Результат':'bg-blue-500/20 text-blue-400',
}

export default function Portfolio() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="portfolio" ref={ref} className="py-20 md:py-28 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-brand-red text-sm font-semibold tracking-widest uppercase">Наши работы</span>
          <h2 className="section-title mt-2">Портфолио</h2>
          <p className="section-subtitle">Примеры выполненных кузовных работ</p>
        </motion.div>

        {/* Сетка */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {works.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={() => setLightbox(item)}
              className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group border border-white/8 hover:border-brand-red/40 transition-colors duration-150"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Tag */}
              <div className="absolute top-3 left-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${tagColors[item.tag]}`}>
                  {item.tag}
                </span>
              </div>

              {/* Info on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
                <p className="text-white font-semibold text-sm">{item.title}</p>
                <p className="text-white/60 text-xs mt-0.5">{item.desc}</p>
              </div>

              {/* Zoom icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Плейсхолдер для будущих фото */}
          {[...Array(Math.max(0, 6 - works.length))].map((_, i) => (
            <motion.div
              key={`placeholder-${i}`}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: (works.length + i) * 0.08 }}
              className="aspect-[4/3] rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2"
            >
              <div className="text-white/15 text-3xl">+</div>
              <p className="text-white/15 text-xs">Фото будет добавлено</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-3xl w-full"
                onClick={e => e.stopPropagation()}
              >
                <img
                  src={lightbox.img}
                  alt={lightbox.title}
                  className="w-full rounded-xl object-contain max-h-[75vh]"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mr-2 ${tagColors[lightbox.tag]}`}>
                      {lightbox.tag}
                    </span>
                    <span className="text-white font-semibold">{lightbox.title}</span>
                    <p className="text-white/50 text-sm mt-1">{lightbox.desc}</p>
                  </div>
                  <button
                    onClick={() => setLightbox(null)}
                    className="text-white/40 hover:text-white text-3xl leading-none ml-4 flex-shrink-0"
                  >
                    ×
                  </button>
                </div>

                {/* Навигация */}
                <div className="flex gap-2 mt-3 justify-center">
                  {works.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setLightbox(w)}
                      className={`w-12 h-8 rounded overflow-hidden border-2 transition-colors ${lightbox.id === w.id ? 'border-brand-red' : 'border-transparent opacity-50 hover:opacity-80'}`}
                    >
                      <img src={w.img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}

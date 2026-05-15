import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const categories = ['Все', 'Ремонт кузова', 'Покраска', 'Полировка', 'Замена деталей', 'Сервис']

const works = [
  // Шкода
  { id: 1,  title: 'Ремонт кузова Skoda',     desc: 'Восстановление кузова после ДТП — рихтовка и покраска',         tag: 'Ремонт кузова',    img: '/assets/portfolio/shkoda/photo_5201935746514754043_w.jpg' },
  { id: 2,  title: 'Ремонт кузова Skoda',     desc: 'Устранение деформации кузовных панелей',                         tag: 'Ремонт кузова',    img: '/assets/portfolio/shkoda/photo_5201935746514754044_w.jpg' },
  { id: 3,  title: 'Ремонт кузова Skoda',     desc: 'Восстановление геометрии кузова на стапеле',                     tag: 'Ремонт кузова',    img: '/assets/portfolio/shkoda/photo_5201935746514754045_w.jpg' },
  { id: 4,  title: 'Ремонт кузова Skoda',     desc: 'Финальный результат — кузов как новый',                          tag: 'Ремонт кузова',    img: '/assets/portfolio/shkoda/photo_5201935746514754046_w.jpg' },
  { id: 5,  title: 'Покраска Skoda',          desc: 'Профессиональная покраска в камере с подбором цвета',            tag: 'Покраска',         img: '/assets/portfolio/shkoda/photo_5204233360744583625_w.jpg' },
  { id: 6,  title: 'Покраска Skoda',          desc: 'Идеальное лакокрасочное покрытие после покраски',                tag: 'Покраска',         img: '/assets/portfolio/shkoda/photo_5204233360744583626_w.jpg' },
  { id: 7,  title: 'Покраска Skoda',          desc: 'Результат покраски — глянцевый блеск',                           tag: 'Покраска',         img: '/assets/portfolio/shkoda/photo_5204233360744583627_w.jpg' },
  // Lancer
  { id: 8,  title: 'Ремонт Mitsubishi Lancer', desc: 'Кузовной ремонт Lancer после аварии',                           tag: 'Ремонт кузова',    img: '/assets/portfolio/lancer/photo_5204233360744583632_w.jpg' },
  { id: 9,  title: 'Ремонт Mitsubishi Lancer', desc: 'Рихтовка и восстановление кузовных элементов',                  tag: 'Ремонт кузова',    img: '/assets/portfolio/lancer/photo_5204233360744583633_w.jpg' },
  { id: 10, title: 'Ремонт Mitsubishi Lancer', desc: 'Замена и восстановление повреждённых панелей',                  tag: 'Ремонт кузова',    img: '/assets/portfolio/lancer/photo_5204233360744583634_w.jpg' },
  { id: 11, title: 'Ремонт Mitsubishi Lancer', desc: 'Подготовка к покраске после рихтовки',                          tag: 'Ремонт кузова',    img: '/assets/portfolio/lancer/photo_5204233360744583635_w.jpg' },
  { id: 12, title: 'Покраска Mitsubishi Lancer','desc': 'Покраска кузова в оригинальный цвет',                        tag: 'Покраска',         img: '/assets/portfolio/lancer/photo_5204233360744583636_w.jpg' },
  { id: 13, title: 'Покраска Mitsubishi Lancer','desc': 'Финальный результат — идеальная покраска',                   tag: 'Покраска',         img: '/assets/portfolio/lancer/photo_5204233360744583637_w.jpg' },
  // Покраска
  { id: 14, title: 'Покраска автомобиля',     desc: 'Профессиональная покраска в покрасочной камере',                 tag: 'Покраска',         img: '/assets/portfolio/pokraska/photo_5204233360744583638_w.jpg' },
  { id: 15, title: 'Покраска автомобиля',     desc: 'Подбор цвета по коду — точное совпадение оттенка',              tag: 'Покраска',         img: '/assets/portfolio/pokraska/photo_5204233360744583639_w.jpg' },
  { id: 16, title: 'Покраска автомобиля',     desc: 'Результат покраски — ровное глянцевое покрытие',                 tag: 'Покраска',         img: '/assets/portfolio/pokraska/photo_5204233360744583641_w.jpg' },
  // Полировка
  { id: 17, title: 'Полировка кузова',        desc: 'Абразивная полировка — устранение царапин и потёртостей',        tag: 'Полировка',        img: '/assets/portfolio/polirovka/photo_5201935746514754045_w.jpg' },
  { id: 18, title: 'Полировка кузова',        desc: 'Защитная полировка — блеск и защита лакокрасочного покрытия',   tag: 'Полировка',        img: '/assets/portfolio/polirovka/photo_5204233360744583627_w.jpg' },
  // Ремонт кузова
  { id: 19, title: 'Ремонт кузова',           desc: 'Восстановление кузовных элементов после повреждений',            tag: 'Ремонт кузова',    img: '/assets/portfolio/remontkuzova/photo_5204233360744583628_w.jpg' },
  { id: 20, title: 'Ремонт кузова',           desc: 'Рихтовка вмятин без покраски',                                   tag: 'Ремонт кузова',    img: '/assets/portfolio/remontkuzova/photo_5204233360744583631_w.jpg' },
  { id: 21, title: 'Ремонт кузова',           desc: 'Восстановление геометрии после ДТП',                             tag: 'Ремонт кузова',    img: '/assets/portfolio/remontkuzova/photo_5204233360744583633_w.jpg' },
  { id: 22, title: 'Ремонт кузова',           desc: 'Сварочные работы и восстановление порогов',                      tag: 'Ремонт кузова',    img: '/assets/portfolio/remontkuzova/photo_5204233360744583636_w.jpg' },
  // Замена деталей
  { id: 23, title: 'Замена деталей',          desc: 'Замена кузовных элементов с подгонкой и покраской',              tag: 'Замена деталей',   img: '/assets/portfolio/zamena/photo_5204233360744583628_w.jpg' },
  { id: 24, title: 'Замена деталей',          desc: 'Установка новых кузовных панелей',                               tag: 'Замена деталей',   img: '/assets/portfolio/zamena/photo_5204233360744583630_w.jpg' },
  { id: 25, title: 'Замена деталей',          desc: 'Замена бампера с покраской в цвет кузова',                       tag: 'Замена деталей',   img: '/assets/portfolio/zamena/photo_5204233360744583639_w.jpg' },
  // Сервис (интерьер)
  { id: 26, title: 'Наш сервис',              desc: 'Современное оборудование и просторный бокс',                     tag: 'Сервис',           img: '/assets/portfolio/333/photo_5204233360744583620_y.jpg' },
  { id: 27, title: 'Наш сервис',              desc: 'Профессиональный инструмент и оснащение',                        tag: 'Сервис',           img: '/assets/portfolio/333/photo_5204233360744583621_y.jpg' },
  { id: 28, title: 'Наш сервис',              desc: 'Покрасочная камера — идеальные условия для покраски',            tag: 'Сервис',           img: '/assets/portfolio/333/photo_5204233360744583622_y.jpg' },
  { id: 29, title: 'Наш сервис',              desc: 'Рабочее место мастера кузовного ремонта',                        tag: 'Сервис',           img: '/assets/portfolio/333/photo_5204233360744583623_y.jpg' },
  { id: 30, title: 'Наш сервис',              desc: 'Зона приёмки и диагностики автомобилей',                         tag: 'Сервис',           img: '/assets/portfolio/333/photo_5204233360744583624_y.jpg' },
]

const tagColors = {
  'Ремонт кузова':  'bg-brand-red/20 text-brand-red',
  'Покраска':       'bg-blue-500/20 text-blue-400',
  'Полировка':      'bg-purple-500/20 text-purple-400',
  'Замена деталей': 'bg-yellow-500/20 text-yellow-400',
  'Сервис':         'bg-green-500/20 text-green-400',
}

export default function Portfolio() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [lightbox, setLightbox] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Все')

  const filtered = activeCategory === 'Все' ? works : works.filter(w => w.tag === activeCategory)
  const lightboxList = activeCategory === 'Все' ? works : filtered

  const lightboxPrev = () => {
    const idx = lightboxList.findIndex(w => w.id === lightbox.id)
    setLightbox(lightboxList[(idx - 1 + lightboxList.length) % lightboxList.length])
  }
  const lightboxNext = () => {
    const idx = lightboxList.findIndex(w => w.id === lightbox.id)
    setLightbox(lightboxList[(idx + 1) % lightboxList.length])
  }

  return (
    <section id="portfolio" ref={ref} className="py-20 md:py-28 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-brand-red text-sm font-semibold tracking-widest uppercase">Наши работы</span>
          <h2 className="section-title mt-2">Портфолио</h2>
          <p className="section-subtitle">Примеры выполненных кузовных работ</p>
        </motion.div>

        {/* Фильтр по категориям */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brand-red text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Сетка */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
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
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightbox.img}
                alt={lightbox.title}
                className="w-full rounded-xl object-contain max-h-[75vh]"
              />

              {/* Prev / Next */}
              <button
                onClick={lightboxPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                ‹
              </button>
              <button
                onClick={lightboxNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                ›
              </button>

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

              {/* Счётчик */}
              <p className="text-white/30 text-xs text-center mt-2">
                {lightboxList.findIndex(w => w.id === lightbox.id) + 1} / {lightboxList.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

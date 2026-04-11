import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const services = [
  {
    title: 'Рихтовка кузова',
    desc: 'Устранение вмятин, деформаций и повреждений кузова любой сложности',
    details: 'Рихтовка — восстановление формы кузовных панелей после механических повреждений. Используем PDR-технологию (беспокрасочное удаление вмятин) и традиционную рихтовку с последующей покраской. Работаем с капотами, крыльями, дверями, крышами и порогами.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: 'Покраска автомобиля',
    desc: 'Профессиональная покраска в камере с подбором цвета по коду',
    details: 'Покраска выполняется в профессиональной покрасочной камере. Подбор цвета по VIN-коду или коду краски. Используем материалы ведущих производителей. Доступна локальная покраска элемента, частичная и полная покраска автомобиля. Гарантия на лакокрасочное покрытие.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
  },
  {
    title: 'Замена порогов',
    desc: 'Замена и восстановление порогов, сварочные работы с гарантией',
    details: 'Пороги — одна из наиболее уязвимых частей кузова. Выполняем частичную и полную замену порогов с применением сварки. После замены — антикоррозийная обработка и покраска в цвет кузова. Используем оригинальные и качественные аналоги.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: 'Ремонт кузова',
    desc: 'Комплексный ремонт кузова после ДТП, восстановление геометрии',
    details: 'Комплексный ремонт после ДТП включает: оценку повреждений, восстановление геометрии кузова на стапеле, замену или ремонт повреждённых элементов, рихтовку и покраску. Работаем со страховыми компаниями, предоставляем все необходимые документы.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    title: 'Полировка',
    desc: 'Абразивная и защитная полировка, устранение царапин и потёртостей',
    details: 'Полировка восстанавливает блеск лакокрасочного покрытия и устраняет мелкие царапины, потёртости, разводы. Выполняем абразивную полировку (удаление дефектов) и защитную (нанесение воска или керамики). Результат — как с завода.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    title: 'Антикоррозийная обработка',
    desc: 'Защита кузова от коррозии, обработка арок и днища',
    details: 'Антикоррозийная обработка защищает металл кузова от ржавчины и преждевременного разрушения. Обрабатываем днище, арки колёс, пороги и скрытые полости. Используем профессиональные материалы на битумной и восковой основе. Продлевает срок службы кузова на годы.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 2L3 7v6c0 5 4 9 9 9s9-4 9-9V7L12 2z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Замена стёкол',
    desc: 'Замена лобового, заднего и боковых стёкол с гарантией',
    details: 'Замена автомобильных стёкол с использованием профессионального клея и оборудования. Работаем с лобовыми, задними и боковыми стёклами всех марок. После замены — проверка герметичности. Стёкла оригинальные или сертифицированные аналоги.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: 'Сварочные работы',
    desc: 'Сварка кузовных элементов, усиление конструкции, ремонт рамы',
    details: 'Профессиональная сварка кузовных элементов: замена порогов, ремонт лонжеронов, усиление несущих конструкций. Используем полуавтоматическую сварку. Все сварные швы зачищаются, грунтуются и обрабатываются антикором для долговечного результата.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
]

export default function Services({ onRequestClick }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [selected, setSelected] = useState(null)

  return (
    <section id="services" ref={ref} className="py-20 md:py-28 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-brand-red text-sm font-semibold tracking-widest uppercase">Что мы делаем</span>
          <h2 className="section-title mt-2">Наши услуги</h2>
          <p className="section-subtitle">Полный спектр кузовных работ в одном месте</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <motion.button
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              onClick={() => setSelected(s)}
              className="glass p-6 text-left group cursor-pointer flex flex-col
                border border-white/8 hover:border-brand-red/50
                hover:-translate-y-1 hover:bg-white/[0.06]
                transition-all duration-150 ease-out"
              style={{ minHeight: '200px' }}
            >
              <div className="h-10 flex items-center mb-4">
                <div className="text-white/40 group-hover:text-brand-red transition-colors duration-150">
                  {s.icon}
                </div>
              </div>
              <h3 className="font-semibold text-white text-base mb-2 leading-snug">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed flex-1">{s.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-brand-red/50 text-xs font-medium group-hover:text-brand-red group-hover:gap-2 transition-all duration-150">
                <span>Подробнее</span>
                <span>→</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Service detail popup */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="glass w-full max-w-lg pointer-events-auto p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent" />

                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 text-white/30 hover:text-white text-2xl leading-none transition-colors"
                >
                  ×
                </button>

                <div className="text-brand-red mb-4">{selected.icon}</div>
                <h3 className="font-heading text-2xl text-white mb-3 tracking-wide uppercase">
                  {selected.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {selected.details}
                </p>

                {/* Placeholder для фото */}
                <div className="rounded-lg overflow-hidden mb-6">
                  {selected.title === 'Покраска автомобиля' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <img src="/assets/raboti/pokraska.png" alt="Покраска" className="w-full h-32 object-cover rounded-lg" />
                      <img src="/assets/raboti/pokraska2.png" alt="Покраска 2" className="w-full h-32 object-cover rounded-lg" />
                    </div>
                  ) : (
                    <div className="border border-white/10 bg-white/5 h-32 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white/20 text-sm">Фото работ</div>
                        <div className="text-white/10 text-xs mt-1">Будет добавлено</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setSelected(null) }}
                    className="btn-secondary text-sm py-2.5 px-5 flex-1 justify-center"
                  >
                    Закрыть
                  </button>
                  <button
                    onClick={() => { setSelected(null); onRequestClick && onRequestClick() }}
                    className="btn-primary text-sm py-2.5 px-5 flex-1 justify-center"
                  >
                    Записаться
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const schedule = [
  { day: 'Понедельник — Пятница', time: '10:00 – 19:00', note: 'перерыв 13:00 – 14:00' },
  { day: 'Суббота', time: 'Выходной', note: '' },
  { day: 'Воскресенье', time: 'Выходной', note: '' },
]

export default function Contacts() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contacts" ref={ref} className="py-20 md:py-28 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-brand-red text-sm font-semibold tracking-widest uppercase">Как нас найти</span>
          <h2 className="section-title mt-2">Контакты</h2>
          <p className="section-subtitle">Приезжайте или позвоните — поможем</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Contact cards */}
            <div className="glass p-6 flex flex-col gap-5">
              <a
                href="tel:631218"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-brand-red/20 transition-colors">
                  📞
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Телефон</p>
                  <p className="text-white font-semibold text-lg group-hover:text-brand-red transition-colors">
                    +7 (8142) 63-12-18
                  </p>
                </div>
              </a>

              <div className="w-full h-px bg-white/5" />

              <a
                href="https://vk.link/globalauto_ptz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0077FF]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0077FF]/20 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#0077FF]">
                    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.491-.085.745-.576.745z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5">ВКонтакте</p>
                  <p className="text-white font-semibold group-hover:text-[#0077FF] transition-colors">
                    globalauto_ptz
                  </p>
                </div>
              </a>

              <div className="w-full h-px bg-white/5" />

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center text-2xl flex-shrink-0">
                  📍
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Адрес</p>
                  <p className="text-white font-semibold">Шуйское Шоссе, 20Б</p>
                  <p className="text-white/50 text-sm">Петрозаводск, Республика Карелия</p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="glass p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>🕐</span> Режим работы
              </h3>
              <div className="flex flex-col gap-3">
                {schedule.map((s) => (
                  <div key={s.day} className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">{s.day}</span>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${s.time === 'Выходной' ? 'text-white/30' : 'text-white'}`}>
                        {s.time}
                      </span>
                      {s.note && <p className="text-white/30 text-xs">{s.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl overflow-hidden border border-white/10 min-h-[400px]"
          >
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=34.3636%2C61.7849&z=16&pt=34.3636%2C61.7849%2Cpm2rdm&text=%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B7%D0%B0%D0%B2%D0%BE%D0%B4%D1%81%D0%BA%2C%20%D0%A8%D1%83%D0%B9%D1%81%D0%BA%D0%BE%D0%B5%20%D1%88%D0%BE%D1%81%D1%81%D0%B5%2C%2020%D0%91"
              width="100%"
              height="100%"
              style={{ minHeight: '400px', border: 'none' }}
              allowFullScreen
              title="Global Avto на карте"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import axios from 'axios'
import { brands } from '../data/brands'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RequestPopup from '../components/RequestPopup'
import FloatContact from '../components/FloatContact'

// SEO-тексты для каждой марки
const brandSeoText = {
  toyota:     'Toyota — одна из самых надёжных марок в мире, но кузов требует профессионального ухода. Мы специализируемся на ремонте Toyota Camry, Corolla, RAV4 и Land Cruiser. Знаем особенности лакокрасочного покрытия и геометрии кузова каждой модели.',
  bmw:        'BMW — автомобиль с характером, требующий особого подхода. Наши мастера имеют опыт работы с кузовами BMW 3, 5, 7 серий и кроссоверов X3, X5, X6. Используем оригинальные технологии восстановления и подбора цвета.',
  mercedes:   'Mercedes-Benz — эталон качества и престижа. Ремонт кузова Mercedes требует точности и профессионализма. Работаем с C-Class, E-Class, S-Class, GLC и GLE. Гарантируем идеальное совпадение цвета и качество покраски.',
  audi:       'Audi отличается сложной геометрией кузова и высококачественным лакокрасочным покрытием. Мы восстанавливаем Audi A3, A4, A6, Q5 и Q7 до заводского состояния. Опыт работы с алюминиевыми элементами кузова.',
  volkswagen: 'Volkswagen — народный автомобиль с немецким качеством. Ремонтируем Polo, Golf, Passat, Tiguan и Touareg. Знаем все особенности кузовов VW и используем правильные технологии восстановления.',
  skoda:      'Skoda — чешское качество на российских дорогах. Специализируемся на ремонте Octavia, Superb, Kodiaq и Karoq. Восстанавливаем кузов после ДТП, рихтуем и красим в цвет оригинала.',
  kia:        'Kia — корейское качество по доступной цене. Ремонтируем Rio, Ceed, Sportage и Sorento. Знаем особенности кузовов Kia и обеспечиваем качественное восстановление после любых повреждений.',
  hyundai:    'Hyundai — популярная марка в Петрозаводске. Работаем с Solaris, Elantra, Tucson, Santa Fe и Creta. Быстро и качественно восстанавливаем кузов после ДТП, рихтуем вмятины и красим.',
  nissan:     'Nissan — японская надёжность и современный дизайн. Ремонтируем Qashqai, X-Trail, Juke и Murano. Профессиональная рихтовка и покраска с подбором цвета по коду.',
  mazda:      'Mazda — автомобиль с душой и особым дизайном. Кузов Mazda требует аккуратного подхода. Работаем с Mazda3, Mazda6, CX-5 и CX-9. Восстанавливаем фирменный цвет Soul Red и другие оттенки.',
  mitsubishi: 'Mitsubishi — японский внедорожник с характером. Ремонтируем Outlander, Pajero, L200 и Eclipse Cross. Опыт работы с усиленными кузовами внедорожников и пикапов.',
  honda:      'Honda — японское качество и надёжность. Специализируемся на ремонте Civic, Accord, CR-V и HR-V. Профессиональная покраска и рихтовка с гарантией качества.',
  lexus:      'Lexus — японская роскошь требует особого внимания. Работаем с IS, ES, NX, RX и LX. Используем премиальные материалы и технологии для восстановления кузова до идеального состояния.',
  infiniti:   'Infiniti — премиальный японский бренд. Ремонтируем Q50, QX50, QX60 и QX80. Знаем особенности кузовов Infiniti и обеспечиваем качество, соответствующее уровню марки.',
  subaru:     'Subaru — легендарная надёжность и полный привод. Работаем с Impreza, Legacy, Outback, Forester и XV. Восстанавливаем кузов после ДТП и коррозии с гарантией.',
  suzuki:     'Suzuki — компактные и надёжные автомобили. Ремонтируем Swift, Vitara, SX4 и Jimny. Качественная рихтовка и покраска по доступным ценам.',
  renault:    'Renault — французский стиль на российских дорогах. Специализируемся на ремонте Logan, Sandero, Duster, Kaptur и Arkana. Знаем особенности кузовов Renault.',
  peugeot:    'Peugeot — французский характер и стиль. Работаем с 208, 308, 408, 2008 и 3008. Профессиональная покраска и восстановление кузова с подбором цвета.',
  citroen:    'Citroen — французская инженерия и дизайн. Ремонтируем C3, C4, C5 и Berlingo. Качественное восстановление кузова после ДТП и механических повреждений.',
  opel:       'Opel — немецкое качество по доступной цене. Работаем с Astra, Insignia, Mokka и Zafira. Профессиональная рихтовка и покраска с гарантией.',
  ford:       'Ford — американский характер и надёжность. Ремонтируем Focus, Mondeo, Kuga, Explorer и Mustang. Восстанавливаем кузов до заводского состояния.',
  chevrolet:  'Chevrolet — американская классика. Работаем с Cruze, Aveo, Captiva, Tahoe и Camaro. Профессиональный кузовной ремонт с гарантией качества.',
  'range-rover': 'Range Rover — британская роскошь и внедорожные возможности. Ремонтируем Range Rover Sport, Vogue, Evoque и Defender. Используем премиальные материалы для восстановления.',
  jeep:       'Jeep — легенда бездорожья. Работаем с Wrangler, Cherokee, Grand Cherokee и Compass. Восстанавливаем кузов после ДТП и внедорожных приключений.',
  dodge:      'Dodge — американская мощь и стиль. Ремонтируем Charger, Challenger и Durango. Профессиональная покраска и восстановление кузова.',
  tesla:      'Tesla — электромобиль будущего требует современного подхода. Работаем с Model 3, Model S, Model X и Model Y. Знаем особенности алюминиевых кузовов Tesla.',
  geely:      'Geely — китайское качество нового поколения. Ремонтируем Atlas, Coolray, Tugella и Monjaro. Профессиональный кузовной ремонт по доступным ценам.',
  haval:      'Haval — китайский кроссовер с хорошим оснащением. Работаем с F7, Jolion, H6 и Dargo. Качественная рихтовка и покраска с подбором цвета.',
  chery:      'Chery — доступный китайский автомобиль. Ремонтируем Tiggo 4, Tiggo 7, Tiggo 8 и Arrizo. Профессиональное восстановление кузова после ДТП.',
  uaz:        'УАЗ — легендарный российский внедорожник. Работаем с Patriot, Hunter и Буханкой. Знаем все особенности кузовов УАЗ и обеспечиваем качественный ремонт.',
  lada:       'Lada — народный российский автомобиль. Ремонтируем Vesta, Granta, Niva, XRAY и Largus. Быстро и качественно восстанавливаем кузов по доступным ценам.',
}

// Фото авто — локальные файлы + Unsplash для остальных
const carImages = {
  // Локальные файлы (загружены)
  skoda:        '/assets/cars/shkoda.jpg',
  kia:          '/assets/cars/kia.jpg',
  hyundai:      '/assets/cars/hyundai.jpg',
  mazda:        '/assets/cars/mazda.jpg',
  mitsubishi:   '/assets/cars/mitsubishi.jpg',
  honda:        '/assets/cars/honda.jpg',
  lexus:        '/assets/cars/lexus.jpg',
  infiniti:     '/assets/cars/infiniti.jpeg',
  subaru:       '/assets/cars/subaru.jpg',
  suzuki:       '/assets/cars/suzuki.jpg',
  renault:      '/assets/cars/renault.png',
  peugeot:      '/assets/cars/peugeot.jpg',
  citroen:      '/assets/cars/citroen.png',
  opel:         '/assets/cars/opel.png',
  jeep:         '/assets/cars/jeep.jpg',
  haval:        '/assets/cars/haval.png',
  chery:        '/assets/cars/chery.jpg',
  uaz:          '/assets/cars/uaz.jpg',
  lada:         '/assets/cars/lada.jpg',
  // Range Rover
  'range-rover': '/assets/cars/rangerover.jpg',
  // Unsplash для остальных
  toyota:       'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=900&q=85',
  bmw:          'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=85',
  mercedes:     'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&q=85',
  audi:         'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&q=85',
  volkswagen:   'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&q=85',
  nissan:       'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=900&q=85',
  ford:         'https://images.unsplash.com/photo-1551830820-330a71b99659?w=900&q=85',
  chevrolet:    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=85',
  dodge:        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=85',
  tesla:        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&q=85',
  geely:        'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=900&q=85',
  faw:          'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=900&q=85',
}

const defaultCarImg = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=85'

const services = [
  { title: 'Рихтовка кузова',           desc: 'Устранение вмятин и деформаций любой сложности' },
  { title: 'Покраска',                   desc: 'Профессиональная покраска в камере, подбор цвета по коду' },
  { title: 'Замена порогов',             desc: 'Замена и восстановление порогов со сваркой' },
  { title: 'Ремонт после ДТП',           desc: 'Восстановление геометрии кузова на стапеле' },
  { title: 'Полировка',                  desc: 'Абразивная и защитная полировка, устранение царапин' },
  { title: 'Антикоррозийная обработка',  desc: 'Защита днища, арок и скрытых полостей' },
  { title: 'Замена стёкол',              desc: 'Замена лобового, заднего и боковых стёкол' },
  { title: 'Сварочные работы',           desc: 'Сварка кузовных элементов, ремонт лонжеронов' },
]

function InlineForm({ brand }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '', website: '' })
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.website) return
    setStatus('loading')
    try {
      await Promise.all([
        axios.post('/api/requests', { name: form.name, phone: form.phone, message: form.message, brand }),
        new Promise(r => setTimeout(r, 2000))
      ])
      setStatus('ok')
    } catch { setStatus('error') }
  }

  if (status === 'ok') return (
    <div className="text-center py-8">
      <motion.svg viewBox="0 0 80 80" className="w-16 h-16 mx-auto mb-4" initial="hidden" animate="visible">
        <motion.circle cx="40" cy="40" r="36" fill="none" stroke="#E60023" strokeWidth="3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
        <motion.path d="M24 40 L35 52 L56 28" fill="none" stroke="#E60023" strokeWidth="4"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} />
      </motion.svg>
      <p className="text-white font-semibold text-lg">Заявка принята!</p>
      <p className="text-white/50 text-sm mt-1">Перезвоним в течение 15 минут</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" name="website" value={form.website}
        onChange={e => setForm({...form, website: e.target.value})}
        className="hidden" tabIndex={-1} autoComplete="off" />
      <input type="text" placeholder="Ваше имя *" required value={form.name}
        onChange={e => setForm({...form, name: e.target.value})}
        className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors font-body" />
      <input type="tel" placeholder="Телефон *" required value={form.phone}
        onChange={e => setForm({...form, phone: e.target.value})}
        className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors font-body" />
      <textarea placeholder="Комментарий" rows={3} value={form.message}
        onChange={e => setForm({...form, message: e.target.value})}
        className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors resize-none font-body" />
      {status === 'error' && <p className="text-brand-red text-sm">Ошибка. Попробуйте ещё раз.</p>}
      <button type="submit" disabled={status === 'loading'}
        className="btn-primary justify-center py-3.5 disabled:opacity-60">
        {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
      </button>
      <p className="text-white/30 text-xs text-center font-body">Нажимая кнопку, вы соглашаетесь с обработкой данных</p>
    </form>
  )
}

export default function BrandPage() {
  const { slug } = useParams()
  const [popupOpen, setPopupOpen] = useState(false)

  const brand = brands.find(b => b.slug === slug)
  const brandName = brand?.name || slug?.toUpperCase()
  const carImg = carImages[slug] || defaultCarImg
  const seoText = brandSeoText[slug] || `Профессиональный кузовной ремонт ${brandName} в Петрозаводске. Рихтовка, покраска, ремонт после ДТП. Опытные мастера, современное оборудование, гарантия на все работы.`

  return (
    <>
      <Helmet>
        <title>Кузовной ремонт {brandName} в Петрозаводске | Global Auto</title>
        <meta name="description"
          content={`Профессиональный кузовной ремонт ${brandName} в Петрозаводске. Рихтовка, покраска, ремонт после ДТП. Гарантия. Тел: +7 (8142) 63-12-18`} />
      </Helmet>

      <Navbar onRequestClick={() => setPopupOpen(true)} />

      <main className="bg-brand-bg min-h-screen">

        {/* HERO — текст слева, фото справа, форма снизу */}
        <section className="relative overflow-hidden pt-24 pb-0">
          <div className="absolute inset-0 bg-gradient-radial from-brand-red/8 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Верхняя часть: текст + фото */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">

              {/* Левая колонка — текст */}
              <div className="pt-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                  <Link to="/remont-avto"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6 font-body">
                    ← Все марки
                  </Link>
                </motion.div>

                <motion.span
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                  className="block text-brand-red text-sm font-semibold tracking-widest uppercase mb-3 font-body">
                  Кузовной ремонт
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                  className="font-heading text-5xl sm:text-6xl text-white leading-tight uppercase mb-4">
                  {brandName}
                  <br />
                  <span className="text-brand-red text-4xl sm:text-5xl">в Петрозаводске</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-white/60 text-base mb-8 max-w-md font-body leading-relaxed">
                  Профессиональный кузовной ремонт автомобилей {brandName}.
                  Современное оборудование, опытные мастера, гарантия на все работы.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap gap-4 mb-10">
                  <button onClick={() => setPopupOpen(true)} className="btn-primary text-base px-8 py-3.5">
                    Оставить заявку
                  </button>
                  <a href="tel:+78142631218" className="btn-secondary text-base px-8 py-3.5">
                    Позвонить
                  </a>
                </motion.div>

                {/* Mini stats */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex gap-8">
                  <div>
                    <div className="font-heading text-3xl text-brand-red">500+</div>
                    <div className="text-white/40 text-xs font-body">авто отремонтировано</div>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <div className="font-heading text-3xl text-white">100%</div>
                    <div className="text-white/40 text-xs font-body">гарантия качества</div>
                  </div>
                </motion.div>
              </div>

              {/* Правая колонка — фото авто */}
              <motion.div
                initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="flex items-center justify-center lg:justify-end"
              >
                <img
                  src={carImg}
                  alt={`${brandName} кузовной ремонт`}
                  className="w-full max-w-xl rounded-2xl object-cover shadow-2xl shadow-black/60"
                  style={{ maxHeight: '360px', marginTop: '20px' }}
                  onError={e => { e.target.src = defaultCarImg }}
                />
              </motion.div>
            </div>

            {/* Форма — полная ширина снизу */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass p-6 md:p-8 mb-0 relative"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent rounded-t-xl" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                  <h2 className="font-heading text-2xl text-white tracking-wide mb-1">Оставить заявку</h2>
                  <p className="text-brand-red text-sm font-medium font-body mb-2">{brandName} — кузовной ремонт</p>
                  <p className="text-white/40 text-sm font-body">Перезвоним в течение 15 минут и рассчитаем стоимость</p>
                </div>
                <div className="lg:col-span-2">
                  <InlineForm brand={brandName} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-20 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="mb-12">
              <span className="text-brand-red text-sm font-semibold tracking-widest uppercase font-body">Что мы делаем</span>
              <h2 className="font-heading text-4xl md:text-5xl text-white uppercase tracking-wide mt-2">
                Услуги для {brandName}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((s, i) => (
                <motion.div key={s.title}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="glass p-5 hover:border-brand-red/40 hover:-translate-y-1 transition-all duration-150">
                  <div className="w-2 h-2 rounded-full bg-brand-red mb-4" />
                  <h3 className="font-semibold text-white text-sm mb-1 font-body">{s.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed font-body">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ADVANTAGES */}
        <section className="py-20 bg-brand-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-center mb-12">
              <span className="text-brand-red text-sm font-semibold tracking-widest uppercase font-body">Почему мы</span>
              <h2 className="font-heading text-4xl md:text-5xl text-white uppercase tracking-wide mt-2">Наши преимущества</h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: '500+', label: 'Авто отремонтировано' },
                { value: '100%', label: 'Гарантия качества' },
                { value: '2024', label: 'Год основания' },
                { value: '8',    label: 'Видов кузовных работ' },
              ].map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass p-6 text-center">
                  <div className="font-heading text-4xl text-brand-red mb-2">{item.value}</div>
                  <div className="text-white/50 text-xs font-body uppercase tracking-wide">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO TEXT */}
        <section className="py-16 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="glass p-8">
              <h2 className="font-heading text-2xl text-white uppercase tracking-wide mb-4">
                Кузовной ремонт {brandName} в Петрозаводске
              </h2>
              <p className="text-white/60 font-body leading-relaxed mb-4">{seoText}</p>
              <p className="text-white/60 font-body leading-relaxed">
                Сервис Global Auto находится по адресу: <span className="text-white">Шуйское Шоссе, 20Б, Петрозаводск</span>.
                Работаем с 2024 года. Записаться на ремонт можно по телефону{' '}
                <a href="tel:+78142631218" className="text-brand-red hover:underline">+7 (8142) 63-12-18</a>{' '}
                или оставив заявку на сайте.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="font-heading text-4xl md:text-5xl text-white uppercase tracking-wide mb-4">
                Нужен ремонт <span className="text-brand-red">{brandName}?</span>
              </h2>
              <p className="text-white/50 mb-8 font-body">
                Оставьте заявку — перезвоним в течение 15 минут и рассчитаем стоимость
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={() => setPopupOpen(true)} className="btn-primary text-base px-10 py-4">
                  Оставить заявку
                </button>
                <a href="tel:+78142631218" className="btn-secondary text-base px-10 py-4">
                  +7 (8142) 63-12-18
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CONTACTS */}
        <section className="py-16 bg-brand-bg border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { href: 'tel:+78142631218', icon: '📞', label: 'Телефон', value: '+7 (8142) 63-12-18', sub: null },
                { href: null, icon: '📍', label: 'Адрес', value: 'Шуйское Шоссе, 20Б', sub: 'Петрозаводск' },
                { href: null, icon: '🕐', label: 'Режим работы', value: 'Пн–Пт: 10:00–19:00', sub: 'Сб–Вс: выходной' },
              ].map((c, i) => (
                <motion.div key={c.label}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="glass p-6 flex items-center gap-4 hover:border-brand-red/30 transition-colors duration-150"
                  {...(c.href ? { as: 'a', href: c.href } : {})}>
                  <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-body mb-0.5">{c.label}</p>
                    <p className="text-white font-semibold font-body">{c.value}</p>
                    {c.sub && <p className="text-white/50 text-sm font-body">{c.sub}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <RequestPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} brand={brandName} />
      <FloatContact />
    </>
  )
}

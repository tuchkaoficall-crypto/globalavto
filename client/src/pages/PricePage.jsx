import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RequestPopup from '../components/RequestPopup'
import FloatContact from '../components/FloatContact'

const priceCategories = [
  {
    id: 'pokraska',
    title: 'Покраска',
    icon: '🎨',
    color: 'from-blue-500/20 to-blue-500/5',
    borderColor: 'border-blue-500/30',
    accentColor: 'text-blue-400',
    services: [
      { name: 'Покраска крыши',                price: 'от 15 000 ₽',  note: 'с подготовкой поверхности' },
      { name: 'Покраска капота',               price: 'от 12 000 ₽',  note: 'с подготовкой и лакировкой' },
      { name: 'Покраска бампера',              price: 'от 9 000 ₽',   note: 'передний или задний' },
      { name: 'Покраска крыла',                price: 'от 9 000 ₽',   note: 'переднее или заднее' },
      { name: 'Покраска двери (лицевая часть)', price: 'от 9 500 ₽',  note: 'без снятия стекла' },
      { name: 'Покраска зеркал',               price: 'от 5 000 ₽',   note: 'пара зеркал' },
      { name: 'Покраска порога',               price: 'от 6 000 ₽',   note: 'один порог' },
      { name: 'Покраска стойки кузова',        price: 'от 7 000 ₽',   note: 'A, B или C стойка' },
      { name: 'Полная покраска автомобиля',    price: 'от 80 000 ₽',  note: 'все кузовные элементы' },
    ],
  },
  {
    id: 'rihtovka',
    title: 'Рихтовка и ремонт',
    icon: '🔧',
    color: 'from-brand-red/20 to-brand-red/5',
    borderColor: 'border-brand-red/30',
    accentColor: 'text-brand-red',
    services: [
      { name: 'Рихтовка вмятины (небольшая)',  price: 'от 3 000 ₽',   note: 'без покраски, PDR-метод' },
      { name: 'Рихтовка вмятины (средняя)',    price: 'от 6 000 ₽',   note: 'с частичной покраской' },
      { name: 'Рихтовка крыла',                price: 'от 5 000 ₽',   note: 'восстановление формы' },
      { name: 'Рихтовка двери',                price: 'от 6 000 ₽',   note: 'восстановление геометрии' },
      { name: 'Рихтовка капота',               price: 'от 7 000 ₽',   note: 'устранение деформаций' },
      { name: 'Ремонт бампера',                price: 'от 5 000 ₽',   note: 'трещины, сколы, деформации' },
      { name: 'Ремонт порога',                 price: 'от 8 000 ₽',   note: 'восстановление или замена' },
      { name: 'Сварочные работы',              price: 'от 5 000 ₽',   note: 'сварка кузовных элементов' },
    ],
  },
  {
    id: 'geometriya',
    title: 'Геометрия и стапель',
    icon: '📐',
    color: 'from-yellow-500/20 to-yellow-500/5',
    borderColor: 'border-yellow-500/30',
    accentColor: 'text-yellow-400',
    services: [
      { name: 'Диагностика геометрии кузова',  price: 'Бесплатно',    note: 'замер на стапеле' },
      { name: 'Исправление геометрии кузова',  price: 'от 15 000 ₽',  note: 'вытяжка на стапеле' },
      { name: 'Ремонт лонжерона',              price: 'от 12 000 ₽',  note: 'восстановление или замена' },
      { name: 'Ремонт после ДТП (лёгкий)',     price: 'от 20 000 ₽',  note: 'без замены элементов' },
      { name: 'Ремонт после ДТП (средний)',    price: 'от 40 000 ₽',  note: 'с заменой элементов' },
      { name: 'Ремонт после ДТП (тяжёлый)',   price: 'от 80 000 ₽',  note: 'полное восстановление' },
    ],
  },
  {
    id: 'dopolnitelno',
    title: 'Дополнительные услуги',
    icon: '✨',
    color: 'from-purple-500/20 to-purple-500/5',
    borderColor: 'border-purple-500/30',
    accentColor: 'text-purple-400',
    services: [
      { name: 'Полировка кузова',              price: 'от 8 000 ₽',   note: 'абразивная + защитная' },
      { name: 'Полировка одного элемента',     price: 'от 2 000 ₽',   note: 'устранение царапин' },
      { name: 'Антикоррозийная обработка',     price: 'от 9 000 ₽',   note: 'днище, арки, полости' },
      { name: 'Замена лобового стекла',        price: 'от 5 000 ₽',   note: 'без стоимости стекла' },
      { name: 'Замена бокового стекла',        price: 'от 3 000 ₽',   note: 'без стоимости стекла' },
      { name: 'Дефектовка автомобиля',         price: 'Бесплатно',    note: 'оценка повреждений' },
      { name: 'Подбор цвета по коду',          price: 'Бесплатно',    note: 'точное совпадение оттенка' },
    ],
  },
]

const faq = [
  {
    q: 'Как узнать точную стоимость ремонта?',
    a: 'Точная стоимость определяется после бесплатной дефектовки автомобиля. Привезите машину — мастер осмотрит повреждения и назовёт точную цену. Это занимает 15–30 минут.',
  },
  {
    q: 'Даёте ли гарантию на работы?',
    a: 'Да, на все виды кузовных работ предоставляем гарантию. На покраску — 12 месяцев, на рихтовку и сварку — 6 месяцев.',
  },
  {
    q: 'Сколько времени занимает ремонт?',
    a: 'Зависит от объёма работ. Покраска одного элемента — 1–2 дня. Ремонт после ДТП — от 3 до 14 дней. Точные сроки называем после осмотра.',
  },
  {
    q: 'Работаете ли со страховыми компаниями?',
    a: 'Да, работаем по ОСАГО и КАСКО. Помогаем с оформлением документов и взаимодействием со страховой компанией.',
  },
]

export default function PricePage() {
  const [popupOpen, setPopupOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <>
      <Helmet>
        <title>Цены на кузовной ремонт в Петрозаводске | Global Auto</title>
        <meta
          name="description"
          content="Цены на кузовной ремонт в Петрозаводске. Покраска бампера от 9000₽, покраска капота от 12000₽, рихтовка от 3000₽, ремонт после ДТП от 20000₽. Бесплатная оценка. Global Auto."
        />
        <meta name="keywords" content="ремонт бампера петрозаводск цена, покраска авто петрозаводск цены, рихтовка петрозаводск, кузовной ремонт цены петрозаводск, ремонт после дтп петрозаводск" />
        <link rel="canonical" href="https://globalauto.space/uslugi-i-tseny" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Кузовной ремонт автомобилей",
          "provider": {
            "@type": "AutoRepair",
            "name": "Global Auto",
            "url": "https://globalauto.space",
            "telephone": "+78142631218",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Шуйское Шоссе, 20Б",
              "addressLocality": "Петрозаводск",
              "addressRegion": "Республика Карелия",
              "addressCountry": "RU"
            }
          },
          "areaServed": "Петрозаводск",
          "offers": [
            { "@type": "Offer", "name": "Покраска бампера",  "price": "9000",  "priceCurrency": "RUB" },
            { "@type": "Offer", "name": "Покраска капота",   "price": "12000", "priceCurrency": "RUB" },
            { "@type": "Offer", "name": "Покраска крыши",    "price": "15000", "priceCurrency": "RUB" },
            { "@type": "Offer", "name": "Рихтовка вмятины",  "price": "3000",  "priceCurrency": "RUB" },
            { "@type": "Offer", "name": "Ремонт после ДТП",  "price": "20000", "priceCurrency": "RUB" },
          ]
        })}</script>
      </Helmet>

      <Navbar onRequestClick={() => setPopupOpen(true)} />

      <main className="min-h-screen bg-brand-bg pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/30 text-sm mb-10">
            <Link to="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-white/60">Услуги и цены</span>
          </div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <span className="text-brand-red text-sm font-semibold tracking-widest uppercase font-body">Прозрачное ценообразование</span>
            <h1 className="font-heading text-5xl md:text-6xl text-white mb-4 uppercase tracking-wide mt-2">
              Услуги<br />
              <span className="text-brand-red">и цены</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl font-body">
              Указаны ориентировочные цены. Точная стоимость определяется после бесплатного осмотра автомобиля.
              Цена зависит от марки, модели и степени повреждений.
            </p>

            {/* Бесплатная оценка */}
            <div className="mt-6 inline-flex items-center gap-3 bg-brand-red/10 border border-brand-red/30 rounded-xl px-5 py-3">
              <span className="text-2xl">🔍</span>
              <div>
                <p className="text-white font-semibold font-body">Бесплатная оценка и дефектовка</p>
                <p className="text-white/50 text-sm font-body">Привезите авто — осмотрим и назовём точную цену за 15 минут</p>
              </div>
            </div>
          </motion.div>

          {/* Категории цен */}
          <div className="space-y-8 mb-16">
            {priceCategories.map((cat, catIdx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                className={`rounded-2xl border ${cat.borderColor} bg-gradient-to-br ${cat.color} overflow-hidden`}
              >
                {/* Заголовок категории */}
                <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <h2 className={`font-heading text-2xl uppercase tracking-wide ${cat.accentColor}`}>
                    {cat.title}
                  </h2>
                </div>

                {/* Таблица услуг */}
                <div className="divide-y divide-white/5">
                  {cat.services.map((service, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-6 py-4 hover:bg-white/3 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium font-body">{service.name}</p>
                        {service.note && (
                          <p className="text-white/40 text-xs font-body mt-0.5">{service.note}</p>
                        )}
                      </div>
                      <div className="ml-4 text-right flex-shrink-0">
                        <span className={`font-heading text-lg ${
                          service.price === 'Бесплатно' ? 'text-green-400' : cat.accentColor
                        }`}>
                          {service.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Важная заметка */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass p-6 mb-16 flex gap-4"
          >
            <span className="text-2xl flex-shrink-0">ℹ️</span>
            <div>
              <p className="text-white font-semibold font-body mb-1">Важно знать</p>
              <p className="text-white/60 text-sm font-body leading-relaxed">
                Все цены являются ориентировочными и указаны без учёта стоимости материалов и запчастей.
                Итоговая сумма формируется после осмотра автомобиля мастером. Мы работаем честно —
                никаких скрытых доплат после согласования сметы.
              </p>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-heading text-3xl text-white uppercase tracking-wide mb-6">
              Частые вопросы
            </h2>
            <div className="space-y-3">
              {faq.map((item, i) => (
                <div
                  key={i}
                  className="glass overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="text-white font-medium font-body pr-4">{item.q}</span>
                    <span className={`text-brand-red text-xl flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4">
                      <p className="text-white/60 font-body text-sm leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent" />
            <h2 className="font-heading text-3xl text-white uppercase tracking-wide mb-3">
              Узнать точную стоимость
            </h2>
            <p className="text-white/50 font-body mb-6">
              Оставьте заявку — перезвоним, обсудим повреждения и назовём цену
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => setPopupOpen(true)} className="btn-primary text-base px-8 py-3.5">
                Оставить заявку
              </button>
              <a href="tel:631218" className="btn-secondary text-base px-8 py-3.5">
                +7 (8142) 63-12-18
              </a>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
      <RequestPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} />
      <FloatContact />
    </>
  )
}

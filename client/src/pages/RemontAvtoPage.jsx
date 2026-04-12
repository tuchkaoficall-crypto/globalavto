import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { brands } from '../data/brands'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RequestPopup from '../components/RequestPopup'

export default function RemontAvtoPage() {
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <>
      <Helmet>
        <title>Кузовной ремонт автомобилей в Петрозаводске | Global Auto</title>
        <meta
          name="description"
          content="Кузовной ремонт любых автомобилей в Петрозаводске. Рихтовка, покраска, ремонт кузова после ДТП. Шуйское Шоссе 20Б. Тел: +7 (8142) 63-12-18"
        />
      </Helmet>

      <Navbar onRequestClick={() => setPopupOpen(true)} />

      <main className="min-h-screen bg-brand-bg pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/30 text-sm mb-10">
            <Link to="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-white/60">Кузовной ремонт</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <h1 className="font-heading text-5xl md:text-6xl text-white mb-4 uppercase tracking-wide">
              Кузовной ремонт<br />
              <span className="text-brand-red">в Петрозаводске</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Профессиональный кузовной ремонт любых марок и моделей автомобилей.
              Современное оборудование, опытные мастера, гарантия на все работы.
            </p>
          </motion.div>

          {/* Brands grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-14"
          >
            <h2 className="font-heading text-3xl text-white mb-6 uppercase tracking-wide">
              Работаем со всеми марками
            </h2>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/remont/${brand.slug}`}
                  className="px-4 py-2 rounded-full border border-white/15 text-white/60 text-sm hover:border-brand-red hover:text-white hover:bg-brand-red/10 transition-all duration-200"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass p-8 text-center"
          >
            <h2 className="font-heading text-3xl text-white mb-3 uppercase tracking-wide">
              Нужен ремонт?
            </h2>
            <p className="text-white/50 mb-6">Оставьте заявку — перезвоним в течение 15 минут</p>
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
    </>
  )
}

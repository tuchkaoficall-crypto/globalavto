import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { brands as staticBrands, modelsByBrand } from '../data/brands'
import RequestPopup from './RequestPopup'
import axios from 'axios'

function BrandLogo({ brand }) {
  const [err, setErr] = useState(false)
  if (!brand.logo || err) {
    return (
      <div className="w-9 h-9 rounded-full bg-brand-red/20 text-brand-red font-bold text-sm flex items-center justify-center">
        {brand.name[0]}
      </div>
    )
  }
  return (
    <img
      src={brand.logo}
      alt={brand.name}
      className="w-9 h-9 object-contain"
      onError={() => setErr(true)}
    />
  )
}

export default function CarSelector() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [step, setStep] = useState(1)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedModel, setSelectedModel] = useState(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const [brands, setBrands] = useState(staticBrands)

  // Грузим марки из БД, fallback на статику
  useEffect(() => {
    axios.get('/api/brands')
      .then(res => {
        if (res.data?.length > 0) {
          // Обогащаем данными из статики (логотипы, slug)
          const merged = res.data.map(dbBrand => {
            const local = staticBrands.find(b => b.slug === dbBrand.slug)
            return { ...dbBrand, logo: dbBrand.logo || local?.logo || null }
          })
          setBrands(merged)
        }
      })
      .catch(() => {}) // fallback — staticBrands уже установлены
  }, [])

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand)
    setSelectedModel(null)
    setStep(2)
  }

  const handleModelSelect = (model) => {
    setSelectedModel(model)
    setStep(3)
    setPopupOpen(true)
  }

  const handleBack = () => {
    if (step === 2) { setStep(1); setSelectedBrand(null) }
    if (step === 3) { setStep(2); setPopupOpen(false) }
  }

  const models = selectedBrand ? (modelsByBrand[selectedBrand.slug] || []) : []

  return (
    <section id="car-selector" ref={ref} className="py-20 md:py-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-brand-red text-sm font-semibold tracking-widest uppercase">Быстрая заявка</span>
          <h2 className="section-title mt-2">Выберите ваш автомобиль</h2>
          <p className="section-subtitle">3 шага — и мы перезвоним с расчётом стоимости</p>
        </motion.div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step >= s ? 'bg-brand-red text-white' : 'bg-white/10 text-white/40'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 transition-all duration-300 ${step > s ? 'bg-brand-red' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-16 mb-10 text-xs text-white/40">
          <span className={step >= 1 ? 'text-white/70' : ''}>Марка</span>
          <span className={step >= 2 ? 'text-white/70' : ''}>Модель</span>
          <span className={step >= 3 ? 'text-white/70' : ''}>Заявка</span>
        </div>

        {/* Step 1 — Brand grid */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandSelect(brand)}
                    className="glass p-3 flex flex-col items-center gap-2 hover:border-brand-red/50 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <BrandLogo brand={brand} />
                    </div>
                    <span className="text-white/70 text-xs font-medium group-hover:text-white transition-colors leading-tight text-center">
                      {brand.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2 — Models */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <button onClick={handleBack} className="text-white/40 hover:text-white text-sm transition-colors mr-4">
                  ← Назад
                </button>
                <span className="text-white font-semibold">{selectedBrand?.name}</span>
              </div>
              <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
                {models.map((model) => (
                  <button
                    key={model}
                    onClick={() => handleModelSelect(model)}
                    className="px-4 py-2 rounded-full border border-white/20 text-white/70 text-sm hover:border-brand-red hover:text-white hover:bg-brand-red/10 transition-all duration-200"
                  >
                    {model}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popup form */}
      <RequestPopup
        isOpen={popupOpen}
        onClose={() => { setPopupOpen(false); setStep(1); setSelectedBrand(null); setSelectedModel(null) }}
        brand={selectedBrand?.name}
        model={selectedModel}
      />
    </section>
  )
}

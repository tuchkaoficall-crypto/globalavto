import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import axios from 'axios'

// Статические отзывы (реальные с Яндекс.Карт)
const staticReviews = [
  {
    id: 's1',
    name: 'Татьяна Филина',
    text: 'Ребята супер профессионалы, огромное им спасибо! Терпеливо ожидали пока мы дважды меняли запчасти тк не подходили. Работу свою выполнили на отлично! Однозначно буду советовать друзьям и знакомым.',
    rating: 5,
    date: '2 февраля 2025',
    photos: ['/assets/raboti/im1.png', '/assets/raboti/im2.png'],
    source: 'Яндекс.Карты',
  },
  {
    id: 's2',
    name: 'Евгений Ш.',
    text: 'Красили гольф, все сделали чётко, как и договаривались, даже быстрее запланированного срока. Изначально очень хороший подход, всем рекомендую, все виды кузовного ремонта.',
    rating: 5,
    date: '10 февраля 2025',
    photo: null,
    source: 'Яндекс.Карты',
  },
  {
    id: 's3',
    name: 'Мария М.',
    text: 'Однозначно рекомендую данный автосервис кузовного ремонта всем! Машине подарили вторую жизнь! Объём работы был большой. Всё сделано на отлично! Индивидуальный подход, ответственность, оперативность, честность, коммуникабельность — это характеризует мастеров.',
    rating: 5,
    date: '13 марта 2025',
    photo: null,
    source: 'Яндекс.Карты',
  },
  {
    id: 's4',
    name: 'Илья Кузнецов',
    text: 'Быстрая диагностика, грамотный подбор запчастей, профессиональный ремонт, комфортные сроки. Результат на пять баллов! Рекомендую!',
    rating: 5,
    date: '19 февраля 2025',
    photo: null,
    source: 'Яндекс.Карты',
  },
  {
    id: 's5',
    name: 'Михаил Курлыкин',
    text: 'Ребят однозначного рекомендую! Обратился с просьбой отремонтировать пороги, убрать коррозию с задних арок с последующим окрасом, обновить передний бампер Лексус рх330. Все сделали просто замечательно!!! Цена адекватная. Общение приятное. Одним словом, рекомендую обращаться!!',
    rating: 5,
    date: '23 мая 2024',
    photo: '/assets/raboti/im3.jpeg',
    source: 'Яндекс.Карты',
  },
  {
    id: 's6',
    name: 'Karelsteklo p.',
    text: 'Очень качественно отремонтировали и покрасили бампер. Рекомендую, хорошие мастера, хорошая камера для покраски, я доволен.',
    rating: 5,
    date: '29 ноября 2024',
    photo: null,
    source: 'Яндекс.Карты',
  },
]

function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? 'button' : 'button'}
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`text-2xl transition-all duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <span className={(hover || value) >= star ? 'text-yellow-400' : 'text-white/20'}>★</span>
        </button>
      ))}
    </div>
  )
}

export default function Reviews() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ name: '', text: '', rating: 5, photo: null })
  const [status, setStatus] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [page, setPage] = useState(0)
  const PER_PAGE = 6

  useEffect(() => {
    axios.get('/api/reviews')
      .then(r => setReviews(r.data))
      .catch(() => {})
  }, [])

  const allReviews = [...staticReviews, ...reviews]
  const totalPages = Math.ceil(allReviews.length / PER_PAGE)
  const pageReviews = allReviews.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleFile = (e) => setForm({ ...form, photo: e.target.files[0] })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) return
    setStatus('loading')
    try {
      const data = new FormData()
      data.append('name', form.name)
      data.append('text', form.text)
      data.append('rating', form.rating)
      if (form.photo) data.append('photo', form.photo)
      await axios.post('/api/reviews', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setStatus('ok')
      setForm({ name: '', text: '', rating: 5, photo: null })
    } catch (err) {
      if (err.response?.status === 429) {
        setStatus('duplicate')
      } else {
        setStatus('error')
      }
    }
  }

  return (
    <section id="reviews" ref={ref} className="py-20 md:py-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-brand-red text-sm font-semibold tracking-widest uppercase">Мнения клиентов</span>
          <h2 className="section-title mt-2">Отзывы</h2>
          <p className="section-subtitle">Что говорят наши клиенты</p>
        </motion.div>

        {/* Reviews grid */}
        {allReviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {pageReviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="glass p-6 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{r.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-white/30 text-xs">{r.date || new Date(r.created_at).toLocaleDateString('ru-RU')}</p>
                        {r.source && <span className="text-white/20 text-xs">· {r.source}</span>}
                      </div>
                    </div>
                    <StarRating value={r.rating} readonly />
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed flex-1">{r.text}</p>
                  {r.photo && (
                    <img src={r.photo.startsWith('/') ? r.photo : `/uploads/${r.photo}`}
                      alt="Фото" className="mt-2 rounded-lg w-full object-cover max-h-48" loading="lazy" />
                  )}
                  {r.photos && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {r.photos.map((p, pi) => (
                        <img key={pi} src={p} alt={pi === 0 ? 'До' : 'После'}
                          className="rounded-lg w-full object-cover h-32" loading="lazy" />
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Пагинация — только если больше 6 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mb-10">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-brand-red hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                >
                  ←
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-150 ${
                      page === i
                        ? 'bg-brand-red text-white'
                        : 'border border-white/20 text-white/50 hover:border-brand-red hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-brand-red hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                >
                  →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-white/30 py-12 mb-12">
            <p>Пока нет отзывов. Будьте первым!</p>
          </div>
        )}

        {/* Add review */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl mx-auto"
        >
          {!showForm ? (
            <div className="text-center">
              <button onClick={() => setShowForm(true)} className="btn-secondary">
                Оставить отзыв
              </button>
            </div>
          ) : (
            <div className="glass p-6 md:p-8">
              <h3 className="font-heading text-xl text-white mb-6 tracking-wide">Ваш отзыв</h3>

              {status === 'ok' ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🙏</div>
                  <p className="text-white font-semibold">Спасибо за отзыв!</p>
                  <p className="text-white/50 text-sm mt-1">Он появится после проверки модератором</p>
                </div>
              ) : status === 'duplicate' ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">⚠️</div>
                  <p className="text-white font-semibold">Вы уже оставляли отзыв</p>
                  <p className="text-white/50 text-sm mt-1">С вашего IP уже был отправлен отзыв</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Ваше имя *" required
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors"
                  />
                  <div>
                    <p className="text-white/50 text-sm mb-2">Оценка *</p>
                    <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                  </div>
                  <textarea
                    name="text" value={form.text} onChange={handleChange}
                    placeholder="Ваш отзыв *" rows={4} required
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors resize-none"
                  />
                  <div>
                    <p className="text-white/50 text-sm mb-2">Фото (опционально)</p>
                    <input
                      type="file" accept="image/*" onChange={handleFile}
                      className="text-white/50 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-white/10 file:text-white/70 file:text-sm hover:file:bg-white/20 file:cursor-pointer"
                    />
                  </div>
                  {status === 'error' && (
                    <p className="text-brand-red text-sm">Ошибка. Попробуйте ещё раз.</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary justify-center py-3.5 disabled:opacity-60"
                  >
                    {status === 'loading' ? 'Отправка...' : 'Отправить отзыв'}
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

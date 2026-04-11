import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const API = '/api/ga-auth'

function getToken() { return localStorage.getItem('ga_token') }
function setToken(t) { localStorage.setItem('ga_token', t) }
function clearToken() { localStorage.removeItem('ga_token') }

function authHeaders() {
  return { headers: { Authorization: `Bearer ${getToken()}` } }
}

// Разлогиниваем только при явном 401, не при сетевых ошибках
function isUnauthorized(err) {
  return err?.response?.status === 401
}

// ── Login ──────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ login: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API}/login`, form)
      setToken(res.data.token)
      onLogin()
    } catch {
      setError('Неверный логин или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <img src="/assets/LOGO4.png" alt="Global Auto" className="h-12 mx-auto mb-4 object-contain" />
          <h1 className="text-white font-heading text-2xl tracking-widest">GLOBAL AUTO</h1>
          <p className="text-white/30 text-sm mt-1">Панель управления</p>
        </div>

        <div className="glass p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent rounded-t-xl" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text" placeholder="Логин" value={form.login} autoComplete="off"
              onChange={e => setForm({ ...form, login: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors"
            />
            <input
              type="password" placeholder="Пароль" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors"
            />
            {error && <p className="text-brand-red text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="btn-primary justify-center py-3 disabled:opacity-60">
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

// ── Stat Card ──────────────────────────────────────────
function StatCard({ label, value, color = 'text-brand-red' }) {
  return (
    <div className="glass p-5 text-center">
      <div className={`font-heading text-4xl ${color} mb-1`}>{value}</div>
      <div className="text-white/50 text-xs uppercase tracking-wide">{label}</div>
    </div>
  )
}

// ── Requests Tab ───────────────────────────────────────
function RequestsTab({ onUnauthorized }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/requests`, authHeaders())
      setData(res.data)
    } catch (err) {
      if (isUnauthorized(err)) onUnauthorized()
    } finally {
      setLoading(false)
    }
  }, [onUnauthorized])

  useEffect(() => { load() }, [load])

  const del = async (id) => {
    if (!confirm('Удалить заявку?')) return
    try {
      await axios.delete(`${API}/requests/${id}`, authHeaders())
      setData(d => d.filter(r => r.id !== id))
    } catch (err) {
      if (isUnauthorized(err)) onUnauthorized()
    }
  }

  if (loading) return <div className="text-white/40 text-center py-12">Загрузка...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-heading text-2xl tracking-wide">Заявки ({data.length})</h2>
        <button onClick={load} className="btn-secondary text-sm py-2 px-4">Обновить</button>
      </div>
      {data.length === 0 ? (
        <div className="text-white/30 text-center py-12">Заявок пока нет</div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map(r => (
            <motion.div key={r.id} layout
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white font-semibold">{r.name}</span>
                  <span className="text-white/30 text-xs">#{r.id}</span>
                  {r.brand && <span className="text-brand-red text-xs px-2 py-0.5 rounded-full border border-brand-red/30">{r.brand} {r.model}</span>}
                </div>
                <a href={`tel:${r.phone}`} className="text-white/70 text-sm hover:text-white transition-colors">{r.phone}</a>
                {r.message && <p className="text-white/50 text-sm mt-1">{r.message}</p>}
                <p className="text-white/20 text-xs mt-2">{new Date(r.created_at).toLocaleString('ru-RU')}</p>
              </div>
              <button onClick={() => del(r.id)}
                className="text-white/30 hover:text-brand-red transition-colors text-sm flex-shrink-0">
                Удалить
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Reviews Tab ────────────────────────────────────────
function ReviewsTab({ onUnauthorized }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/reviews`, authHeaders())
      setData(res.data)
    } catch (err) {
      if (isUnauthorized(err)) onUnauthorized()
    } finally {
      setLoading(false)
    }
  }, [onUnauthorized])

  useEffect(() => { load() }, [load])

  const approve = async (id) => {
    try {
      await axios.patch(`${API}/reviews/${id}/approve`, {}, authHeaders())
      setData(d => d.map(r => r.id === id ? { ...r, approved: true } : r))
    } catch (err) {
      if (isUnauthorized(err)) onUnauthorized()
    }
  }

  const reject = async (id) => {
    try {
      await axios.patch(`${API}/reviews/${id}/reject`, {}, authHeaders())
      setData(d => d.map(r => r.id === id ? { ...r, approved: false } : r))
    } catch (err) {
      if (isUnauthorized(err)) onUnauthorized()
    }
  }

  const del = async (id) => {
    if (!confirm('Удалить отзыв?')) return
    try {
      await axios.delete(`${API}/reviews/${id}`, authHeaders())
      setData(d => d.filter(r => r.id !== id))
    } catch (err) {
      if (isUnauthorized(err)) onUnauthorized()
    }
  }

  const filtered = data.filter(r => {
    if (filter === 'pending') return !r.approved
    if (filter === 'approved') return r.approved
    return true
  })

  const pending = data.filter(r => !r.approved).length

  if (loading) return <div className="text-white/40 text-center py-12">Загрузка...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-heading text-2xl tracking-wide">
          Отзывы {pending > 0 && <span className="text-brand-red text-lg">({pending} на модерации)</span>}
        </h2>
        <button onClick={load} className="btn-secondary text-sm py-2 px-4">Обновить</button>
      </div>

      <div className="flex gap-2 mb-6">
        {[['pending','На модерации'],['approved','Одобренные'],['all','Все']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all duration-150 ${filter === val ? 'bg-brand-red text-white' : 'border border-white/20 text-white/50 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-white/30 text-center py-12">Нет отзывов</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(r => (
            <motion.div key={r.id} layout
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`glass p-5 border ${r.approved ? 'border-green-500/20' : 'border-yellow-500/20'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-white font-semibold">{r.name}</span>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {r.approved ? 'Одобрен' : 'На модерации'}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{r.text}</p>
                  {r.photo && (
                    <img src={`/uploads/${r.photo}`} alt="" className="mt-3 h-24 rounded-lg object-cover" />
                  )}
                  <p className="text-white/20 text-xs mt-2">{new Date(r.created_at).toLocaleString('ru-RU')} · IP: {r.ip_address}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!r.approved && (
                    <button onClick={() => approve(r.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                      Одобрить
                    </button>
                  )}
                  {r.approved && (
                    <button onClick={() => reject(r.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors">
                      Скрыть
                    </button>
                  )}
                  <button onClick={() => del(r.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-brand-red/20 text-brand-red hover:bg-brand-red/30 transition-colors">
                    Удалить
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────
export default function AdminPage() {
  // null = проверяем токен, true = авторизован, false = не авторизован
  const [authed, setAuthed] = useState(null)
  const [tab, setTab] = useState('requests')
  const [stats, setStats] = useState(null)

  // При монтировании — верифицируем токен через API
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setAuthed(false)
      return
    }
    axios.get(`${API}/verify`, authHeaders())
      .then(() => setAuthed(true))
      .catch(err => {
        if (isUnauthorized(err)) {
          clearToken()
          setAuthed(false)
        } else {
          // Сетевая ошибка — всё равно пускаем, токен может быть валидным
          setAuthed(true)
        }
      })
  }, [])

  // Загружаем статистику только после подтверждения авторизации
  useEffect(() => {
    if (authed !== true) return
    axios.get(`${API}/stats`, authHeaders())
      .then(r => setStats(r.data))
      .catch(err => {
        if (isUnauthorized(err)) handleUnauthorized()
      })
  }, [authed])

  // Обновляем title вкладки с количеством заявок
  useEffect(() => {
    if (stats?.totalRequests > 0) {
      document.title = `(${stats.totalRequests}) Global Auto — Админ`
    } else {
      document.title = 'Global Auto — Админ'
    }
    return () => { document.title = 'Global Auto' }
  }, [stats])

  const handleUnauthorized = () => {
    clearToken()
    setAuthed(false)
  }

  const logout = () => {
    clearToken()
    setAuthed(false)
  }

  // Пока проверяем токен — показываем загрузку
  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white/30 text-sm">Проверка сессии...</div>
      </div>
    )
  }

  if (authed === false) return <LoginScreen onLogin={() => setAuthed(true)} />

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="bg-[#111] border-b border-white/5 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/LOGO4.png" alt="" className="h-8 object-contain" />
          <span className="font-heading text-white tracking-widest text-lg">GLOBAL AUTO</span>
          <span className="text-white/20 text-sm hidden sm:block">/ Панель управления</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-white/40 hover:text-white text-sm transition-colors">
            Сайт ↗
          </a>
          <button onClick={logout} className="text-white/40 hover:text-brand-red text-sm transition-colors">
            Выйти
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Всего заявок" value={stats.totalRequests} />
            <StatCard label="Одобрено отзывов" value={stats.approvedReviews} color="text-green-400" />
            <StatCard label="На модерации" value={stats.pendingReviews} color="text-yellow-400" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[['requests','Заявки'],['reviews','Отзывы']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${tab === val ? 'bg-brand-red text-white' : 'glass text-white/60 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}>
            {tab === 'requests' && <RequestsTab onUnauthorized={handleUnauthorized} />}
            {tab === 'reviews' && <ReviewsTab onUnauthorized={handleUnauthorized} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

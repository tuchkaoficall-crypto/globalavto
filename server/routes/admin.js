const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const pool = require('../db')
const cache = require('../utils/cache')
const { loginLimiter } = require('../middleware/rateLimit')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES = '8h'

// Middleware: проверяет JWT из заголовка Authorization: Bearer <token>
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.slice(7)

  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    req.admin = jwt.verify(token, JWT_SECRET)
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// POST /api/ga-auth/login
router.post('/login', loginLimiter, (req, res) => {
  const { login, password } = req.body
  if (
    login === process.env.ADMIN_LOGIN &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ login }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
    return res.json({ token })
  }
  return res.status(401).json({ error: 'Неверный логин или пароль' })
})

// GET /api/ga-auth/verify — проверка токена (используется при загрузке страницы)
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ ok: true, login: req.admin.login })
})

// GET /api/ga-auth/requests
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM requests ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// DELETE /api/ga-auth/requests/:id
router.delete('/requests/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM requests WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// GET /api/ga-auth/reviews
router.get('/reviews', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// PATCH /api/ga-auth/reviews/:id/approve
router.patch('/reviews/:id/approve', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE reviews SET approved = true WHERE id = $1', [req.params.id])
    cache.del('reviews')
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// PATCH /api/ga-auth/reviews/:id/reject
router.patch('/reviews/:id/reject', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE reviews SET approved = false WHERE id = $1', [req.params.id])
    cache.del('reviews')
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// DELETE /api/ga-auth/reviews/:id
router.delete('/reviews/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = $1', [req.params.id])
    cache.del('reviews')
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// GET /api/ga-auth/stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [requests, reviews, pendingReviews] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM requests'),
      pool.query('SELECT COUNT(*) FROM reviews WHERE approved = true'),
      pool.query('SELECT COUNT(*) FROM reviews WHERE approved = false'),
    ])
    res.json({
      totalRequests: parseInt(requests.rows[0].count),
      approvedReviews: parseInt(reviews.rows[0].count),
      pendingReviews: parseInt(pendingReviews.rows[0].count),
    })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router

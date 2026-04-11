const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const pool = require('../db')
const { reviewsLimiter } = require('../middleware/rateLimit')
const { sendTelegram } = require('../utils/telegram')
const cache = require('../utils/cache')
const { fromFile } = require('file-type')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../client/public/uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `review_${Date.now()}${ext}`)
  }
})

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_MAGIC = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Только изображения'))
  }
})

// GET /api/reviews — только одобренные
router.get('/', async (req, res) => {
  try {
    const cached = cache.get('reviews')
    if (cached) return res.json(cached)

    const result = await pool.query(
      'SELECT id, name, text, photo, rating, created_at FROM reviews WHERE approved = true ORDER BY created_at DESC'
    )
    cache.set('reviews', result.rows, 120) // 2 минуты
    res.json(result.rows)
  } catch (err) {
    console.error('GET /api/reviews error:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// POST /api/reviews
router.post('/', reviewsLimiter, upload.single('photo'), async (req, res) => {
  try {
    const { name, text, rating } = req.body
    const ip = req.ip || req.connection.remoteAddress

    if (!name?.trim() || !text?.trim()) {
      return res.status(400).json({ error: 'Имя и текст обязательны' })
    }

    const ratingNum = parseInt(rating)
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Рейтинг от 1 до 5' })
    }

    // Check IP duplicate
    const existing = await pool.query(
      'SELECT id FROM reviews WHERE ip_address = $1',
      [ip]
    )
    if (existing.rows.length > 0) {
      return res.status(429).json({ error: 'Вы уже оставляли отзыв' })
    }

    const safeName = name.trim().substring(0, 100)
    const safeText = text.trim().substring(0, 2000)
    let photoName = null

    if (req.file) {
      // Проверяем реальный тип файла по magic bytes
      const fileType = await fromFile(req.file.path)
      if (!fileType || !ALLOWED_MAGIC.includes(fileType.mime)) {
        fs.unlinkSync(req.file.path) // удаляем подозрительный файл
        return res.status(400).json({ error: 'Недопустимый тип файла' })
      }
      photoName = req.file.filename
    }

    await pool.query(
      `INSERT INTO reviews (name, text, photo, rating, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [safeName, safeText, photoName, ratingNum, ip]
    )

    // Уведомление в Telegram
    const stars = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum)
    sendTelegram(`💬 <b>Новый отзыв на модерации!</b>\n👤 <b>${safeName}</b> ${stars}\n📝 ${safeText.substring(0, 200)}${safeText.length > 200 ? '...' : ''}`)

    res.status(201).json({ success: true, message: 'Отзыв отправлен на модерацию' })
  } catch (err) {
    console.error('POST /api/reviews error:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router

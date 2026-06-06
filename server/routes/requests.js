const express = require('express')
const router = express.Router()
const pool = require('../db')
const { requestsLimiter } = require('../middleware/rateLimit')
const { bot } = require('../utils/telegramBot')

// POST /api/requests
router.post('/', requestsLimiter, async (req, res) => {
  try {
    const { name, phone, message, brand, model, website } = req.body

    // Honeypot check
    if (website) return res.status(400).json({ error: 'Bad request' })

    // Validation
    if (!name?.trim() || !phone?.trim()) {
      return res.status(400).json({ error: 'Имя и телефон обязательны' })
    }

    // Sanitize
    const safeName = name.trim().substring(0, 100)
    const safePhone = phone.trim().substring(0, 20)
    const safeMessage = (message || '').trim().substring(0, 1000)
    const safeBrand = (brand || '').trim().substring(0, 100)
    const safeModel = (model || '').trim().substring(0, 100)

    const result = await pool.query(
      `INSERT INTO requests (name, phone, message, brand, model)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
      [safeName, safePhone, safeMessage, safeBrand, safeModel]
    )

    // Уведомление в Telegram
    bot.notifyNewRequest({
      id: result.rows[0].id,
      name: safeName,
      phone: safePhone,
      message: safeMessage,
      brand: safeBrand,
      model: safeModel,
      created_at: result.rows[0].created_at
    })

    res.status(201).json({ success: true, id: result.rows[0].id })
  } catch (err) {
    console.error('POST /api/requests error:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router

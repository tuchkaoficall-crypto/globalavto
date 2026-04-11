const express = require('express')
const router = express.Router()
const pool = require('../db')
const { requestsLimiter } = require('../middleware/rateLimit')
const { sendTelegram } = require('../utils/telegram')

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
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [safeName, safePhone, safeMessage, safeBrand, safeModel]
    )

    // Уведомление в Telegram
    const lines = [
      '🔔 <b>Новая заявка!</b>',
      `👤 <b>Имя:</b> ${safeName}`,
      `📞 <b>Телефон:</b> ${safePhone}`,
    ]
    if (safeBrand) lines.push(`🚗 <b>Авто:</b> ${safeBrand}${safeModel ? ' ' + safeModel : ''}`)
    if (safeMessage) lines.push(`💬 <b>Комментарий:</b> ${safeMessage}`)
    lines.push(`🆔 <b>ID заявки:</b> #${result.rows[0].id}`)
    sendTelegram(lines.join('\n'))

    res.status(201).json({ success: true, id: result.rows[0].id })
  } catch (err) {
    console.error('POST /api/requests error:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router

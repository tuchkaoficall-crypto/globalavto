const express = require('express')
const router = express.Router()
const pool = require('../db')
const cache = require('../utils/cache')

// GET /api/brands
router.get('/', async (req, res) => {
  try {
    const cached = cache.get('brands')
    if (cached) return res.json(cached)

    const result = await pool.query('SELECT * FROM brands ORDER BY name')
    cache.set('brands', result.rows, 600) // 10 минут
    res.json(result.rows)
  } catch (err) {
    console.error('GET /api/brands error:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// GET /api/brands/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const cacheKey = `brand_${slug}`
    const cached = cache.get(cacheKey)
    if (cached) return res.json(cached)

    const result = await pool.query('SELECT * FROM brands WHERE slug = $1', [slug])
    if (!result.rows.length) return res.status(404).json({ error: 'Марка не найдена' })
    cache.set(cacheKey, result.rows[0], 600) // 10 минут
    res.json(result.rows[0])
  } catch (err) {
    console.error('GET /api/brands/:slug error:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router

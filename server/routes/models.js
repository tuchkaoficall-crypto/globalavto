const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET /api/models/:brandId
router.get('/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params
    const id = parseInt(brandId)
    if (isNaN(id)) return res.status(400).json({ error: 'Неверный ID марки' })

    const result = await pool.query(
      'SELECT * FROM models WHERE brand_id = $1 ORDER BY name',
      [id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error('GET /api/models/:brandId error:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router

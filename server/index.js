require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// Body parsing
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Trust proxy (for correct IP behind Plesk/nginx)
app.set('trust proxy', 1)

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../client/public/uploads')))

// Routes
app.use('/api/requests', require('./routes/requests'))
app.use('/api/brands', require('./routes/brands'))
app.use('/api/models', require('./routes/models'))
app.use('/api/reviews', require('./routes/reviews'))
app.use('/api/ga-auth', require('./routes/admin'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})

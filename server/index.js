require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')
const { requestLogger, rateLimitHandler, sendDailyStats } = require('./middleware/logger')
const { commandBot } = require('./utils/telegramCommands')

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

// Logging middleware
app.use(requestLogger)
app.use(rateLimitHandler)

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
  
  // Запускаем Telegram бота для приема команд
  if (process.env.TELEGRAM_BOT_TOKEN) {
    commandBot.startPolling()
  } else {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN not set, bot commands disabled')
  }
  
  // Отправка дневной статистики в 9:00 каждый день
  scheduleDailyStats()
})

// Планировщик дневной статистики
function scheduleDailyStats() {
  const now = new Date()
  const targetHour = 9 // 9:00 утра
  
  // Вычисляем время до следующей отправки
  let nextRun = new Date(now)
  nextRun.setHours(targetHour, 0, 0, 0)
  
  if (nextRun <= now) {
    // Если 9:00 уже прошло сегодня, планируем на завтра
    nextRun.setDate(nextRun.getDate() + 1)
  }
  
  const msUntilNextRun = nextRun - now
  
  console.log(`📊 Daily stats scheduled for ${nextRun.toLocaleString('ru-RU')}`)
  
  setTimeout(() => {
    sendDailyStats()
    // После первой отправки, планируем каждые 24 часа
    setInterval(sendDailyStats, 24 * 60 * 60 * 1000)
  }, msUntilNextRun)
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  commandBot.stopPolling()
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully')
  commandBot.stopPolling()
  process.exit(0)
})

const { bot } = require('../utils/telegramBot')
const pool = require('../db')

// Таблица для хранения логов событий
async function createLogsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        details JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON activity_logs(event_type);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
    `)
    console.log('✅ Activity logs table ready')
  } catch (err) {
    console.error('❌ Error creating activity_logs table:', err)
  }
}

// Инициализируем таблицу при запуске
createLogsTable()

// Парсинг User-Agent для определения устройства и браузера
function parseUserAgent(ua) {
  if (!ua) return { device: 'Unknown', browser: 'Unknown' }
  
  let device = 'Desktop'
  let browser = 'Unknown'
  
  // Определение устройства
  if (/mobile/i.test(ua)) device = 'Mobile'
  else if (/tablet|ipad/i.test(ua)) device = 'Tablet'
  
  // Определение браузера
  if (/edg/i.test(ua)) browser = 'Edge'
  else if (/chrome/i.test(ua)) browser = 'Chrome'
  else if (/firefox/i.test(ua)) browser = 'Firefox'
  else if (/safari/i.test(ua)) browser = 'Safari'
  else if (/opera|opr/i.test(ua)) browser = 'Opera'
  
  return { device, browser }
}

// Логирование события
async function logEvent(eventType, req, details = {}) {
  const ip = req.ip || req.connection?.remoteAddress || 'Unknown'
  const userAgent = req.get('user-agent') || null
  
  try {
    await pool.query(
      'INSERT INTO activity_logs (event_type, ip_address, user_agent, details) VALUES ($1, $2, $3, $4)',
      [eventType, ip, userAgent, JSON.stringify(details)]
    )
  } catch (err) {
    console.error('❌ Error logging event:', err)
  }
}

// Middleware для логирования входов администратора
function logAdminLogin(req, res, next) {
  const originalJson = res.json.bind(res)
  
  res.json = function(data) {
    // Если успешный логин (есть токен)
    if (data && data.token) {
      const ip = req.ip || req.connection?.remoteAddress || 'Unknown'
      const userAgent = req.get('user-agent')
      const { device, browser } = parseUserAgent(userAgent)
      
      // Логируем в БД
      logEvent('admin_login', req, {
        login: req.body?.login,
        device,
        browser,
        success: true
      })
      
      // Отправляем уведомление в Telegram
      bot.notifyAdminLogin({
        login: req.body?.login || 'Unknown',
        ip,
        userAgent,
        device,
        browser
      })
    } else if (res.statusCode === 401) {
      // Неудачная попытка входа
      logEvent('admin_login_failed', req, {
        login: req.body?.login,
        success: false
      })
      
      // Подозрительная активность при множественных неудачных попытках
      checkFailedLogins(req)
    }
    
    return originalJson(data)
  }
  
  next()
}

// Проверка на множественные неудачные попытки входа
async function checkFailedLogins(req) {
  const ip = req.ip || req.connection?.remoteAddress
  if (!ip) return
  
  try {
    // Проверяем количество неудачных попыток за последние 15 минут
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM activity_logs 
       WHERE event_type = 'admin_login_failed' 
       AND ip_address = $1 
       AND created_at > NOW() - INTERVAL '15 minutes'`,
      [ip]
    )
    
    const failedCount = parseInt(result.rows[0]?.count || 0)
    
    if (failedCount >= 5) {
      bot.notifySuspiciousActivity('Множественные неудачные попытки входа', {
        ip,
        details: `${failedCount} неудачных попыток за последние 15 минут`
      })
    }
  } catch (err) {
    console.error('❌ Error checking failed logins:', err)
  }
}

// Middleware для общего логирования запросов
function requestLogger(req, res, next) {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const ip = req.ip || req.connection?.remoteAddress
    
    // Логируем только важные эндпоинты или ошибки
    if (res.statusCode >= 400 || req.path.includes('/api/ga-auth/')) {
      logEvent('request', req, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        ip
      })
      
      // Уведомление об ошибках сервера
      if (res.statusCode >= 500) {
        bot.notifyError(new Error(`Server error: ${res.statusCode}`), {
          endpoint: `${req.method} ${req.path}`,
          ip
        })
      }
    }
  })
  
  next()
}

// Middleware для отслеживания Rate Limit превышений
function rateLimitHandler(req, res, next) {
  const originalJson = res.json.bind(res)
  
  res.json = function(data) {
    if (res.statusCode === 429) {
      const ip = req.ip || req.connection?.remoteAddress
      
      logEvent('rate_limit_exceeded', req, {
        path: req.path,
        ip
      })
      
      bot.notifySuspiciousActivity('Превышен лимит запросов', {
        ip,
        details: `Endpoint: ${req.method} ${req.path}`
      })
    }
    
    return originalJson(data)
  }
  
  next()
}

// Получение статистики за период
async function getStats(hours = 24) {
  try {
    const [requests, reviews, uniqueIPs, adminLogins, suspicious] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) FROM requests WHERE created_at > NOW() - INTERVAL '${hours} hours'`
      ),
      pool.query(
        `SELECT COUNT(*) FROM reviews WHERE created_at > NOW() - INTERVAL '${hours} hours'`
      ),
      pool.query(
        `SELECT COUNT(DISTINCT ip_address) FROM activity_logs WHERE created_at > NOW() - INTERVAL '${hours} hours'`
      ),
      pool.query(
        `SELECT COUNT(*) FROM activity_logs WHERE event_type = 'admin_login' AND created_at > NOW() - INTERVAL '${hours} hours'`
      ),
      pool.query(
        `SELECT COUNT(*) FROM activity_logs WHERE event_type IN ('rate_limit_exceeded', 'admin_login_failed') AND created_at > NOW() - INTERVAL '${hours} hours'`
      )
    ])
    
    return {
      requests: parseInt(requests.rows[0].count),
      reviews: parseInt(reviews.rows[0].count),
      uniqueIPs: parseInt(uniqueIPs.rows[0].count),
      adminLogins: parseInt(adminLogins.rows[0].count),
      suspiciousActivity: parseInt(suspicious.rows[0].count)
    }
  } catch (err) {
    console.error('❌ Error getting stats:', err)
    return null
  }
}

// Отправка дневной статистики (можно вызывать по расписанию)
async function sendDailyStats() {
  const stats = await getStats(24)
  if (stats) {
    await bot.notifyDailyStats(stats)
  }
}

module.exports = {
  logAdminLogin,
  requestLogger,
  rateLimitHandler,
  logEvent,
  getStats,
  sendDailyStats,
  parseUserAgent
}

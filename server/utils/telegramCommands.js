const https = require('https')
const { getStats } = require('../middleware/logger')
const pool = require('../db')

class TelegramCommandBot {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN
    this.chatId = process.env.TELEGRAM_CHAT_ID
    this.apiHost = '149.154.166.110' // api.telegram.org IPv4
    this.lastUpdateId = 0
    this.isPolling = false
  }

  // Базовый метод отправки запросов к API Telegram
  _request(method, body) {
    return new Promise((resolve, reject) => {
      if (!this.token) {
        return reject(new Error('Telegram token not configured'))
      }

      const payload = JSON.stringify(body)
      const options = {
        hostname: this.apiHost,
        path: `/bot${this.token}/${method}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'Host': 'api.telegram.org',
        },
        timeout: 15000,
      }

      const req = https.request(options, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data)
            resolve(parsed)
          } catch (e) {
            reject(new Error(`Parse error: ${e.message}`))
          }
        })
      })

      req.on('error', (e) => reject(e))
      req.on('timeout', () => {
        req.destroy()
        reject(new Error('Request timeout'))
      })

      req.write(payload)
      req.end()
    })
  }

  // Отправка сообщения
  async sendMessage(chatId, text, options = {}) {
    try {
      return await this._request('sendMessage', {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        ...options
      })
    } catch (err) {
      console.error('❌ Error sending message:', err.message)
      return null
    }
  }

  // Получение обновлений (long polling)
  async getUpdates() {
    try {
      const result = await this._request('getUpdates', {
        offset: this.lastUpdateId + 1,
        timeout: 30,
        allowed_updates: ['message']
      })

      if (result.ok && result.result.length > 0) {
        return result.result
      }
      return []
    } catch (err) {
      console.error('❌ Error getting updates:', err.message)
      return []
    }
  }

  // Обработка команд
  async handleCommand(message) {
    const chatId = message.chat.id
    const text = message.text?.trim() || ''

    // Проверяем, что это команда
    if (!text.startsWith('/')) return

    // Проверяем, что сообщение от разрешенного чата
    if (this.chatId && String(chatId) !== String(this.chatId)) {
      await this.sendMessage(chatId, '⛔ Доступ запрещен')
      return
    }

    const [command, ...args] = text.split(' ')

    switch (command) {
      case '/start':
        await this.cmdStart(chatId)
        break
      case '/help':
        await this.cmdHelp(chatId)
        break
      case '/stats':
        await this.cmdStats(chatId, args)
        break
      case '/requests':
        await this.cmdRequests(chatId, args)
        break
      case '/reviews':
        await this.cmdReviews(chatId, args)
        break
      case '/logs':
        await this.cmdLogs(chatId, args)
        break
      case '/ping':
        await this.sendMessage(chatId, '🏓 Pong!')
        break
      default:
        await this.sendMessage(chatId, `❓ Неизвестная команда: ${command}\n\nИспользуйте /help для списка команд`)
    }
  }

  // Команда /start
  async cmdStart(chatId) {
    const text = [
      '🤖 <b>GlobalAuto Monitoring Bot</b>',
      '',
      'Привет! Я буду уведомлять вас о важных событиях на сайте:',
      '',
      '• 🔔 Новые заявки',
      '• 💬 Новые отзывы',
      '• 🔐 Входы в админ-панель',
      '• ⚠️ Подозрительная активность',
      '• ❌ Ошибки сервера',
      '',
      'Используйте /help для списка доступных команд.'
    ].join('\n')
    
    await this.sendMessage(chatId, text)
  }

  // Команда /help
  async cmdHelp(chatId) {
    const text = [
      '📖 <b>Доступные команды:</b>',
      '',
      '/start - Приветствие',
      '/help - Список команд',
      '/stats [hours] - Статистика за период (по умолчанию 24 часа)',
      '/requests [limit] - Последние заявки (по умолчанию 5)',
      '/reviews [limit] - Последние отзывы (по умолчанию 5)',
      '/logs [limit] - Последние события (по умолчанию 10)',
      '/ping - Проверка связи',
      '',
      '<i>Примеры:</i>',
      '/stats 48 - статистика за 48 часов',
      '/requests 10 - последние 10 заявок',
    ].join('\n')
    
    await this.sendMessage(chatId, text)
  }

  // Команда /stats
  async cmdStats(chatId, args) {
    const hours = parseInt(args[0]) || 24
    if (hours < 1 || hours > 720) {
      await this.sendMessage(chatId, '❌ Период должен быть от 1 до 720 часов')
      return
    }

    try {
      const stats = await getStats(hours)
      if (!stats) {
        await this.sendMessage(chatId, '❌ Ошибка получения статистики')
        return
      }

      const text = [
        `📊 <b>Статистика за ${hours}ч</b>`,
        '',
        `📝 Новых заявок: <b>${stats.requests}</b>`,
        `💬 Новых отзывов: <b>${stats.reviews}</b>`,
        `👥 Уникальных IP: <b>${stats.uniqueIPs}</b>`,
        `🔐 Входов в админку: <b>${stats.adminLogins}</b>`,
      ]

      if (stats.suspiciousActivity > 0) {
        text.push(`⚠️ Подозрительных событий: <b>${stats.suspiciousActivity}</b>`)
      }

      await this.sendMessage(chatId, text.join('\n'))
    } catch (err) {
      await this.sendMessage(chatId, '❌ Ошибка: ' + err.message)
    }
  }

  // Команда /requests
  async cmdRequests(chatId, args) {
    const limit = Math.min(parseInt(args[0]) || 5, 20)

    try {
      const result = await pool.query(
        'SELECT * FROM requests ORDER BY created_at DESC LIMIT $1',
        [limit]
      )

      if (result.rows.length === 0) {
        await this.sendMessage(chatId, '📝 Заявок пока нет')
        return
      }

      const text = [
        `📝 <b>Последние ${result.rows.length} заявок:</b>`,
        ''
      ]

      result.rows.forEach((req, idx) => {
        text.push(`${idx + 1}. <b>${this._escape(req.name)}</b> | ${this._escape(req.phone)}`)
        if (req.brand) {
          text.push(`   🚗 ${this._escape(req.brand)}${req.model ? ' ' + this._escape(req.model) : ''}`)
        }
        if (req.message) {
          text.push(`   💬 ${this._escape(req.message.substring(0, 50))}${req.message.length > 50 ? '...' : ''}`)
        }
        text.push(`   🆔 #${req.id} | ${this._formatDate(req.created_at)}`)
        text.push('')
      })

      await this.sendMessage(chatId, text.join('\n'))
    } catch (err) {
      await this.sendMessage(chatId, '❌ Ошибка: ' + err.message)
    }
  }

  // Команда /reviews
  async cmdReviews(chatId, args) {
    const limit = Math.min(parseInt(args[0]) || 5, 20)

    try {
      const result = await pool.query(
        'SELECT * FROM reviews ORDER BY created_at DESC LIMIT $1',
        [limit]
      )

      if (result.rows.length === 0) {
        await this.sendMessage(chatId, '💬 Отзывов пока нет')
        return
      }

      const text = [
        `💬 <b>Последние ${result.rows.length} отзывов:</b>`,
        ''
      ]

      result.rows.forEach((review, idx) => {
        const stars = '⭐'.repeat(review.rating)
        const status = review.approved ? '✅' : '⏳'
        text.push(`${idx + 1}. ${status} <b>${this._escape(review.name)}</b> ${stars}`)
        text.push(`   📝 ${this._escape(review.text.substring(0, 60))}${review.text.length > 60 ? '...' : ''}`)
        text.push(`   🆔 #${review.id} | ${this._formatDate(review.created_at)}`)
        text.push('')
      })

      await this.sendMessage(chatId, text.join('\n'))
    } catch (err) {
      await this.sendMessage(chatId, '❌ Ошибка: ' + err.message)
    }
  }

  // Команда /logs
  async cmdLogs(chatId, args) {
    const limit = Math.min(parseInt(args[0]) || 10, 30)

    try {
      const result = await pool.query(
        'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT $1',
        [limit]
      )

      if (result.rows.length === 0) {
        await this.sendMessage(chatId, '📋 Логов пока нет')
        return
      }

      const text = [
        `📋 <b>Последние ${result.rows.length} событий:</b>`,
        ''
      ]

      const eventIcons = {
        admin_login: '🔐',
        admin_login_failed: '🔒',
        rate_limit_exceeded: '⚠️',
        request: '📡',
        suspicious: '🚨'
      }

      result.rows.forEach((log, idx) => {
        const icon = eventIcons[log.event_type] || '📌'
        text.push(`${idx + 1}. ${icon} <b>${log.event_type}</b>`)
        text.push(`   🌐 ${log.ip_address || 'N/A'}`)
        text.push(`   🕐 ${this._formatDate(log.created_at)}`)
        text.push('')
      })

      await this.sendMessage(chatId, text.join('\n'))
    } catch (err) {
      await this.sendMessage(chatId, '❌ Ошибка: ' + err.message)
    }
  }

  // Escape HTML-символов
  _escape(text) {
    if (!text) return ''
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  // Форматирование даты
  _formatDate(date) {
    const d = new Date(date)
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  // Запуск polling для получения команд
  startPolling() {
    if (this.isPolling) {
      console.log('⚠️ Bot is already polling')
      return
    }

    if (!this.token) {
      console.error('❌ TELEGRAM_BOT_TOKEN not configured')
      return
    }

    this.isPolling = true
    console.log('🤖 Telegram command bot started')

    const poll = async () => {
      if (!this.isPolling) return

      try {
        const updates = await this.getUpdates()
        
        for (const update of updates) {
          this.lastUpdateId = update.update_id

          if (update.message) {
            await this.handleCommand(update.message)
          }
        }
      } catch (err) {
        console.error('❌ Polling error:', err.message)
      }

      // Следующий запрос через 1 секунду
      if (this.isPolling) {
        setTimeout(poll, 1000)
      }
    }

    poll()
  }

  // Остановка polling
  stopPolling() {
    this.isPolling = false
    console.log('🛑 Telegram command bot stopped')
  }
}

// Singleton instance
const commandBot = new TelegramCommandBot()

module.exports = {
  commandBot,
  TelegramCommandBot
}

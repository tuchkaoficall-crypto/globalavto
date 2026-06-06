const https = require('https')

class TelegramBot {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN
    this.chatId = process.env.TELEGRAM_CHAT_ID
    this.apiHost = '149.154.166.110' // api.telegram.org IPv4
  }

  // Базовый метод отправки запросов к API Telegram
  _request(method, body) {
    return new Promise((resolve, reject) => {
      if (!this.token || !this.chatId) {
        return reject(new Error('Telegram credentials not configured'))
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
            if (res.statusCode === 200) {
              resolve(parsed)
            } else {
              reject(new Error(`Telegram API error: ${res.statusCode} ${data}`))
            }
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

  // Отправка текстового сообщения
  async sendMessage(text, options = {}) {
    try {
      await this._request('sendMessage', {
        chat_id: this.chatId,
        text,
        parse_mode: options.parse_mode || 'HTML',
        disable_web_page_preview: options.disable_web_page_preview || true,
        ...options
      })
      console.log('✅ Telegram message sent')
    } catch (err) {
      console.error('❌ Telegram send error:', err.message)
    }
  }

  // Уведомление о новой заявке
  notifyNewRequest(data) {
    const lines = [
      '🔔 <b>Новая заявка!</b>',
      '',
      `👤 <b>Имя:</b> ${this._escape(data.name)}`,
      `📞 <b>Телефон:</b> ${this._escape(data.phone)}`,
    ]
    
    if (data.brand) {
      lines.push(`🚗 <b>Авто:</b> ${this._escape(data.brand)}${data.model ? ' ' + this._escape(data.model) : ''}`)
    }
    
    if (data.message) {
      lines.push(`💬 <b>Комментарий:</b> ${this._escape(data.message)}`)
    }
    
    lines.push('')
    lines.push(`🆔 <b>ID:</b> #${data.id}`)
    lines.push(`🕐 <b>Время:</b> ${this._formatDate(data.created_at)}`)
    
    return this.sendMessage(lines.join('\n'))
  }

  // Уведомление о новом отзыве
  notifyNewReview(data) {
    const stars = '⭐'.repeat(data.rating) + '☆'.repeat(5 - data.rating)
    const lines = [
      '💬 <b>Новый отзыв на модерации!</b>',
      '',
      `👤 <b>Автор:</b> ${this._escape(data.name)}`,
      `${stars} (${data.rating}/5)`,
      '',
      `📝 <b>Текст:</b>`,
      this._escape(data.text.substring(0, 300)) + (data.text.length > 300 ? '...' : ''),
    ]
    
    if (data.photo) {
      lines.push('')
      lines.push(`📷 <b>Фото:</b> приложено`)
    }
    
    if (data.ip_address) {
      lines.push('')
      lines.push(`🌐 <b>IP:</b> ${data.ip_address}`)
    }
    
    lines.push('')
    lines.push(`🆔 <b>ID:</b> #${data.id}`)
    lines.push(`🕐 <b>Время:</b> ${this._formatDate(data.created_at)}`)
    
    return this.sendMessage(lines.join('\n'))
  }

  // Уведомление о входе администратора
  notifyAdminLogin(data) {
    const lines = [
      '🔐 <b>Вход в админ-панель</b>',
      '',
      `👤 <b>Логин:</b> ${this._escape(data.login)}`,
      `🌐 <b>IP:</b> ${data.ip}`,
      `🖥️ <b>User-Agent:</b>`,
      this._escape(data.userAgent?.substring(0, 150) || 'Неизвестно'),
    ]
    
    if (data.device) {
      lines.push('')
      lines.push(`📱 <b>Устройство:</b> ${this._escape(data.device)}`)
    }
    
    if (data.browser) {
      lines.push(`🌐 <b>Браузер:</b> ${this._escape(data.browser)}`)
    }
    
    lines.push('')
    lines.push(`🕐 <b>Время:</b> ${this._formatDate(new Date())}`)
    
    return this.sendMessage(lines.join('\n'))
  }

  // Уведомление о подозрительной активности
  notifySuspiciousActivity(type, data) {
    const lines = [
      '⚠️ <b>Подозрительная активность!</b>',
      '',
      `📋 <b>Тип:</b> ${this._escape(type)}`,
    ]
    
    if (data.ip) {
      lines.push(`🌐 <b>IP:</b> ${data.ip}`)
    }
    
    if (data.details) {
      lines.push('')
      lines.push(`📝 <b>Детали:</b>`)
      lines.push(this._escape(data.details))
    }
    
    lines.push('')
    lines.push(`🕐 <b>Время:</b> ${this._formatDate(new Date())}`)
    
    return this.sendMessage(lines.join('\n'))
  }

  // Уведомление об ошибке сервера
  notifyError(error, context = {}) {
    const lines = [
      '❌ <b>Ошибка сервера</b>',
      '',
      `📝 <b>Сообщение:</b>`,
      this._escape(error.message || String(error)),
    ]
    
    if (error.stack) {
      lines.push('')
      lines.push(`📚 <b>Stack:</b>`)
      lines.push(`<code>${this._escape(error.stack.substring(0, 500))}</code>`)
    }
    
    if (context.endpoint) {
      lines.push('')
      lines.push(`🔗 <b>Endpoint:</b> ${this._escape(context.endpoint)}`)
    }
    
    if (context.ip) {
      lines.push(`🌐 <b>IP:</b> ${context.ip}`)
    }
    
    lines.push('')
    lines.push(`🕐 <b>Время:</b> ${this._formatDate(new Date())}`)
    
    return this.sendMessage(lines.join('\n'))
  }

  // Дневная статистика
  notifyDailyStats(stats) {
    const lines = [
      '📊 <b>Статистика за день</b>',
      '',
      `📝 <b>Новых заявок:</b> ${stats.requests || 0}`,
      `💬 <b>Новых отзывов:</b> ${stats.reviews || 0}`,
      `👥 <b>Уникальных IP:</b> ${stats.uniqueIPs || 0}`,
      `🔐 <b>Входов в админку:</b> ${stats.adminLogins || 0}`,
    ]
    
    if (stats.suspiciousActivity > 0) {
      lines.push(`⚠️ <b>Подозрительных событий:</b> ${stats.suspiciousActivity}`)
    }
    
    lines.push('')
    lines.push(`🕐 ${this._formatDate(new Date())}`)
    
    return this.sendMessage(lines.join('\n'))
  }

  // Escape HTML-символов для безопасного отображения
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
}

// Singleton instance
const bot = new TelegramBot()

// Обратная совместимость с существующим кодом
function sendTelegram(message) {
  return bot.sendMessage(message)
}

module.exports = {
  bot,
  sendTelegram, // для обратной совместимости
  TelegramBot
}

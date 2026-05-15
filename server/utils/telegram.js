const https = require('https')

function sendTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  const body = JSON.stringify({
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML',
  })

  // Используем прямой IPv4 адрес api.telegram.org чтобы избежать IPv6
  const options = {
    hostname: '149.154.166.110',
    path: `/bot${token}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'Host': 'api.telegram.org',
    },
    timeout: 15000,
  }

  const req = https.request(options, (res) => {
    let data = ''
    res.on('data', chunk => data += chunk)
    res.on('end', () => {
      if (res.statusCode !== 200) {
        console.error('Telegram API error:', res.statusCode, data)
      } else {
        console.log('✅ Telegram notification sent')
      }
    })
  })
  req.on('error', (e) => console.error('Telegram send error:', e.message))
  req.on('timeout', () => { console.error('Telegram timeout'); req.destroy() })
  req.write(body)
  req.end()
}

module.exports = { sendTelegram }

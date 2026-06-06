/**
 * Скрипт для тестирования Telegram бота
 * Отправляет тестовые уведомления для проверки работоспособности
 */

require('dotenv').config()
const { bot } = require('./utils/telegramBot')

async function testTelegram() {
  console.log('🧪 Тестирование Telegram бота...\n')

  // Проверка конфигурации
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN не установлен в .env')
    process.exit(1)
  }
  if (!process.env.TELEGRAM_CHAT_ID) {
    console.error('❌ TELEGRAM_CHAT_ID не установлен в .env')
    process.exit(1)
  }

  console.log('✅ Конфигурация найдена')
  console.log(`📱 Chat ID: ${process.env.TELEGRAM_CHAT_ID}\n`)

  // Тест 1: Простое сообщение
  console.log('📤 Тест 1: Отправка простого сообщения...')
  await bot.sendMessage('🧪 <b>Тестовое сообщение</b>\n\nЕсли вы видите это, значит бот работает!')
  await sleep(2000)

  // Тест 2: Уведомление о новой заявке
  console.log('📤 Тест 2: Уведомление о новой заявке...')
  await bot.notifyNewRequest({
    id: 9999,
    name: 'Тестовый Клиент',
    phone: '+7 999 123-45-67',
    brand: 'Toyota',
    model: 'Camry',
    message: 'Тестовая заявка для проверки системы уведомлений',
    created_at: new Date()
  })
  await sleep(2000)

  // Тест 3: Уведомление о новом отзыве
  console.log('📤 Тест 3: Уведомление о новом отзыве...')
  await bot.notifyNewReview({
    id: 9999,
    name: 'Довольный Клиент',
    text: 'Отличный сервис! Быстро покрасили капот, качество на высоте. Рекомендую всем!',
    rating: 5,
    photo: 'test.jpg',
    ip_address: '192.168.1.100',
    created_at: new Date()
  })
  await sleep(2000)

  // Тест 4: Уведомление о входе администратора
  console.log('📤 Тест 4: Уведомление о входе в админку...')
  await bot.notifyAdminLogin({
    login: 'test_admin',
    ip: '192.168.1.50',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    device: 'Desktop',
    browser: 'Chrome'
  })
  await sleep(2000)

  // Тест 5: Уведомление о подозрительной активности
  console.log('📤 Тест 5: Уведомление о подозрительной активности...')
  await bot.notifySuspiciousActivity('Множественные неудачные попытки входа', {
    ip: '185.220.101.50',
    details: '5 неудачных попыток за последние 15 минут'
  })
  await sleep(2000)

  // Тест 6: Уведомление об ошибке
  console.log('📤 Тест 6: Уведомление об ошибке сервера...')
  await bot.notifyError(new Error('Test error: Database connection failed'), {
    endpoint: 'POST /api/requests',
    ip: '192.168.1.100'
  })
  await sleep(2000)

  // Тест 7: Дневная статистика
  console.log('📤 Тест 7: Дневная статистика...')
  await bot.notifyDailyStats({
    requests: 42,
    reviews: 8,
    uniqueIPs: 234,
    adminLogins: 3,
    suspiciousActivity: 1
  })
  await sleep(2000)

  console.log('\n✅ Все тесты завершены!')
  console.log('📱 Проверьте Telegram - вы должны получить 7 тестовых сообщений')
  console.log('\n💡 Теперь протестируйте команды бота:')
  console.log('   Отправьте боту: /start')
  console.log('   Отправьте боту: /help')
  console.log('   Отправьте боту: /ping')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Запуск
testTelegram()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Ошибка тестирования:', err)
    process.exit(1)
  })

/**
 * Скрипт для настройки системы мониторинга
 * Создает таблицу activity_logs и устанавливает необходимые индексы
 */

require('dotenv').config()
const pool = require('./db')

async function setupMonitoring() {
  console.log('🔧 Настройка системы мониторинга...\n')

  try {
    // Создаем таблицу логов активности
    console.log('📋 Создание таблицы activity_logs...')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        details JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)
    console.log('✅ Таблица activity_logs создана\n')

    // Создаем индексы для быстрого поиска
    console.log('🔍 Создание индексов...')
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type 
      ON activity_logs(event_type);
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at 
      ON activity_logs(created_at DESC);
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_activity_logs_ip 
      ON activity_logs(ip_address);
    `)
    console.log('✅ Индексы созданы\n')

    // Проверяем статистику
    console.log('📊 Проверка существующих данных...')
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM requests) as requests_count,
        (SELECT COUNT(*) FROM reviews) as reviews_count,
        (SELECT COUNT(*) FROM activity_logs) as logs_count
    `)
    
    console.log(`📝 Заявок в БД: ${stats.rows[0].requests_count}`)
    console.log(`💬 Отзывов в БД: ${stats.rows[0].reviews_count}`)
    console.log(`📋 Записей в логах: ${stats.rows[0].logs_count}\n`)

    console.log('✅ Система мониторинга настроена успешно!')
    console.log('\n📱 Не забудьте проверить настройки Telegram:')
    console.log(`   TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ установлен' : '❌ не установлен'}`)
    console.log(`   TELEGRAM_CHAT_ID: ${process.env.TELEGRAM_CHAT_ID ? '✅ установлен' : '❌ не установлен'}`)
    
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.log('\n⚠️  Для работы уведомлений установите в .env:')
      console.log('   TELEGRAM_BOT_TOKEN=ваш_токен_бота')
      console.log('   TELEGRAM_CHAT_ID=ваш_chat_id')
    } else {
      console.log('\n🤖 Telegram бот готов к работе!')
      console.log('   Отправьте боту команду /start для проверки')
    }

  } catch (err) {
    console.error('❌ Ошибка настройки:', err.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Запуск
setupMonitoring()

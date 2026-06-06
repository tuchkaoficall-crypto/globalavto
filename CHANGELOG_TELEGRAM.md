# 📋 Changelog - Telegram Monitoring System

## 🆕 Добавлено (06.06.2026)

### Новые файлы

1. **server/middleware/logger.js**
   - Middleware для логирования всех важных событий
   - Автоматическое создание таблицы `activity_logs`
   - Парсинг User-Agent (определение устройства и браузера)
   - Отслеживание подозрительной активности
   - Функции для получения статистики

2. **server/utils/telegramBot.js**
   - Класс TelegramBot с улучшенными методами
   - Форматированные уведомления для всех типов событий
   - Безопасное экранирование HTML
   - Форматирование дат
   - Обратная совместимость через `sendTelegram()`

3. **server/utils/telegramCommands.js**
   - Telegram бот с командным интерфейсом
   - Long polling для получения команд
   - 8 команд: /start, /help, /stats, /requests, /reviews, /logs, /ping
   - Ограничение доступа по CHAT_ID

4. **server/setup-monitoring.js**
   - Скрипт установки системы мониторинга
   - Создание таблиц и индексов
   - Проверка конфигурации

5. **server/test-telegram.js**
   - Автоматическое тестирование всех типов уведомлений
   - Проверка конфигурации

6. **Документация**
   - MONITORING.md - полная документация
   - QUICK_START.md - быстрый старт
   - CHANGELOG_TELEGRAM.md - список изменений

### Обновлены файлы

1. **server/index.js**
   - Подключены middleware логирования
   - Автозапуск Telegram command bot
   - Планировщик дневной статистики (9:00)
   - Graceful shutdown

2. **server/routes/admin.js**
   - Middleware `logAdminLogin` для логирования входов
   - Новый эндпоинт: `GET /api/ga-auth/activity-stats`
   - Новый эндпоинт: `GET /api/ga-auth/activity-logs`

3. **server/routes/requests.js**
   - Использует новый `bot.notifyNewRequest()`
   - Возвращает `created_at` для уведомлений

4. **server/routes/reviews.js**
   - Использует новый `bot.notifyNewReview()`
   - Возвращает `created_at` для уведомлений

5. **server/utils/telegram.js**
   - Помечен как deprecated
   - Оставлен для обратной совместимости

6. **server/package.json**
   - Добавлены скрипты:
     - `npm run setup-monitoring`
     - `npm run test-telegram`

### База данных

**Новая таблица: activity_logs**
```sql
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Индексы:**
- `idx_activity_logs_event_type` - быстрый поиск по типу события
- `idx_activity_logs_created_at` - быстрая сортировка по дате
- `idx_activity_logs_ip` - поиск по IP

### Новые возможности

#### 1. Уведомления в Telegram

**Автоматические:**
- 🔔 Новая заявка (имя, телефон, авто, комментарий)
- 💬 Новый отзыв (автор, рейтинг, текст)
- 🔐 Вход в админку (логин, IP, устройство, браузер)
- ⚠️ Подозрительная активность (множественные неудачные входы, rate limit)
- ❌ Ошибки сервера (500+)
- 📊 Дневная статистика (каждый день в 9:00)

#### 2. Команды бота

- `/start` - приветствие
- `/help` - список команд
- `/stats [hours]` - статистика за период
- `/requests [limit]` - последние заявки
- `/reviews [limit]` - последние отзывы
- `/logs [limit]` - последние события
- `/ping` - проверка связи

#### 3. Логирование событий

**Типы событий:**
- `admin_login` - успешный вход
- `admin_login_failed` - неудачная попытка
- `rate_limit_exceeded` - превышен лимит
- `request` - HTTP запросы (ошибки, админ эндпоинты)

**Детали события (JSONB):**
- Устройство и браузер
- Статус код
- Путь запроса
- Логин
- И другое

#### 4. API эндпоинты

**GET /api/ga-auth/activity-stats?hours=24**
```json
{
  "requests": 45,
  "reviews": 8,
  "uniqueIPs": 234,
  "adminLogins": 3,
  "suspiciousActivity": 1
}
```

**GET /api/ga-auth/activity-logs?limit=50**
```json
[
  {
    "id": 123,
    "event_type": "admin_login",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "details": {"device": "Desktop", "browser": "Chrome"},
    "created_at": "2026-06-06T09:15:00Z"
  }
]
```

## 🔒 Безопасность

- ✅ Проверка CHAT_ID для команд бота
- ✅ Отслеживание множественных неудачных входов
- ✅ Логирование подозрительной активности
- ✅ Rate limiting с уведомлениями
- ✅ Безопасное экранирование данных в уведомлениях

## 📊 Производительность

- Индексы на часто запрашиваемые поля
- JSONB для гибкого хранения деталей
- Кеширование не затронуто
- Минимальная нагрузка на БД

## 🔄 Обратная совместимость

- ✅ Старый `sendTelegram()` работает
- ✅ Все существующие эндпоинты без изменений
- ✅ Структура БД расширена (не изменена)

## 📝 Установка

```bash
# 1. Настройки уже в .env
TELEGRAM_BOT_TOKEN=8778757759:AAH_icx1aWNCDZEmKSNAQ_un6BSudlIGDN8
TELEGRAM_CHAT_ID=8038634019

# 2. Установка таблиц
cd server
npm run setup-monitoring

# 3. Тест
npm run test-telegram

# 4. Запуск
npm start
```

## 🐛 Известные ограничения

- Long polling вместо webhook (проще для настройки)
- Дневная статистика в фиксированное время (9:00)
- Один CHAT_ID для всех уведомлений

## 🎯 Будущие улучшения

- [ ] Webhook вместо polling
- [ ] Множественные получатели
- [ ] Настраиваемое расписание
- [ ] Графики статистики
- [ ] Экспорт логов

## 👨‍💻 Автор

GlobalAuto Development Team

## 📅 Дата

06 июня 2026

---

**Версия:** 1.0.0  
**Статус:** ✅ Готово к использованию

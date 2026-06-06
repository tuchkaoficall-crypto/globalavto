# 🤖 GlobalAuto Telegram Monitoring Bot

## 📖 Описание

Система автоматического мониторинга и уведомлений для сайта GlobalAuto через Telegram бота.

## ✨ Основные возможности

### Автоматические уведомления

| Событие | Описание | Информация |
|---------|----------|-----------|
| 🔔 **Новая заявка** | При заполнении формы на сайте | Имя, телефон, авто, комментарий, ID |
| 💬 **Новый отзыв** | При добавлении отзыва | Автор, рейтинг, текст, фото, IP |
| 🔐 **Вход в админку** | При успешной авторизации | Логин, IP, устройство, браузер |
| ⚠️ **Подозрительная активность** | 5+ неудачных попыток входа за 15 мин | IP, детали |
| ⚠️ **Rate limit** | Превышение лимита запросов | IP, эндпоинт |
| ❌ **Ошибка сервера** | 500+ ошибки | Сообщение, stack trace, endpoint |
| 📊 **Дневная статистика** | Каждый день в 9:00 | Заявки, отзывы, IP, входы, события |

### Команды бота

```
/start              - Приветствие и описание
/help               - Список всех команд
/stats [hours]      - Статистика за период (по умолчанию 24ч)
/requests [limit]   - Последние заявки (по умолчанию 5, макс 20)
/reviews [limit]    - Последние отзывы (по умолчанию 5, макс 20)
/logs [limit]       - Последние события (по умолчанию 10, макс 30)
/ping               - Проверка связи
```

**Примеры:**
```
/stats 48           - Статистика за последние 48 часов
/requests 10        - Показать последние 10 заявок
/reviews 15         - Показать последние 15 отзывов
/logs 20            - Последние 20 событий из логов
```

## 🚀 Быстрая установка

### Шаг 1: Проверка конфигурации

Убедитесь, что в `server/.env` есть:
```env
TELEGRAM_BOT_TOKEN=8778757759:AAH_icx1aWNCDZEmKSNAQ_un6BSudlIGDN8
TELEGRAM_CHAT_ID=8038634019
```

✅ **Готово!** Токены уже настроены.

### Шаг 2: Установка таблиц БД

```bash
cd server
npm run setup-monitoring
```

**Ожидаемый вывод:**
```
🔧 Настройка системы мониторинга...
✅ Таблица activity_logs создана
✅ Индексы созданы
📊 Проверка существующих данных...
✅ Система мониторинга настроена успешно!
🤖 Telegram бот готов к работе!
```

### Шаг 3: Тестирование

```bash
npm run test-telegram
```

Проверьте Telegram - вы получите 7 тестовых уведомлений разных типов.

### Шаг 4: Запуск сервера

```bash
npm start
```

**Ожидаемый вывод:**
```
✅ Server running on http://localhost:5000
✅ Activity logs table ready
🤖 Telegram command bot started
📊 Daily stats scheduled for 07.06.2026 09:00
```

### Шаг 5: Проверка команд

Откройте Telegram, найдите своего бота и отправьте:
```
/start
```

Вы получите приветствие. Затем попробуйте:
```
/help
/stats
/ping
```

## 📁 Структура файлов

### Новые файлы

```
server/
├── middleware/
│   └── logger.js                  # Логирование событий
├── utils/
│   ├── telegramBot.js             # Отправка уведомлений
│   └── telegramCommands.js        # Обработка команд
├── setup-monitoring.js            # Установка системы
└── test-telegram.js               # Тестирование
```

### Обновленные файлы

```
server/
├── index.js                       # Запуск бота + планировщик
├── routes/
│   ├── admin.js                   # Новые эндпоинты
│   ├── requests.js                # Обновленные уведомления
│   └── reviews.js                 # Обновленные уведомления
└── package.json                   # Новые скрипты
```

## 🗄️ База данных

### Новая таблица: activity_logs

```sql
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,      -- Тип события
  ip_address VARCHAR(45),               -- IP адрес
  user_agent TEXT,                      -- User-Agent
  details JSONB,                        -- Дополнительные данные
  created_at TIMESTAMP DEFAULT NOW()    -- Время события
);
```

### Типы событий (event_type)

- `admin_login` - Успешный вход в админку
- `admin_login_failed` - Неудачная попытка входа
- `rate_limit_exceeded` - Превышен лимит запросов
- `request` - HTTP запросы (ошибки, админ эндпоинты)

### Структура details (JSONB)

```json
{
  "login": "kirill",
  "device": "Desktop",
  "browser": "Chrome",
  "success": true,
  "statusCode": 200,
  "path": "/api/ga-auth/login",
  "duration": 45
}
```

## 🔌 API эндпоинты

### GET /api/ga-auth/activity-stats

Получить статистику активности за период.

**Query параметры:**
- `hours` - количество часов (по умолчанию 24)

**Пример запроса:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:5000/api/ga-auth/activity-stats?hours=48"
```

**Ответ:**
```json
{
  "requests": 45,
  "reviews": 8,
  "uniqueIPs": 234,
  "adminLogins": 3,
  "suspiciousActivity": 1
}
```

### GET /api/ga-auth/activity-logs

Получить последние события из логов.

**Query параметры:**
- `limit` - количество записей (по умолчанию 50)

**Пример запроса:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:5000/api/ga-auth/activity-logs?limit=100"
```

**Ответ:**
```json
[
  {
    "id": 123,
    "event_type": "admin_login",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "details": {
      "login": "kirill",
      "device": "Desktop",
      "browser": "Chrome",
      "success": true
    },
    "created_at": "2026-06-06T09:15:00.000Z"
  }
]
```

## 📱 Примеры уведомлений

### Новая заявка
```
🔔 Новая заявка!

👤 Имя: Иван Петров
📞 Телефон: +7 999 123-45-67
🚗 Авто: Toyota Camry
💬 Комментарий: Нужна покраска капота

🆔 ID: #42
🕐 Время: 06.06.2026 14:30
```

### Вход в админку
```
🔐 Вход в админ-панель

👤 Логин: kirill
🌐 IP: 192.168.1.100
🖥️ User-Agent: Mozilla/5.0...

📱 Устройство: Desktop
🌐 Браузер: Chrome

🕐 Время: 06.06.2026 09:15
```

### Подозрительная активность
```
⚠️ Подозрительная активность!

📋 Тип: Множественные неудачные попытки входа
🌐 IP: 185.220.101.50

📝 Детали:
5 неудачных попыток за последние 15 минут

🕐 Время: 06.06.2026 03:45
```

## 🛠️ Скрипты NPM

```bash
npm start                # Запуск сервера
npm run dev              # Запуск с nodemon (авто-перезагрузка)
npm run setup-monitoring # Установка таблиц мониторинга
npm run test-telegram    # Тест уведомлений
```

## 🐛 Troubleshooting

### Бот не отвечает на команды

**Проблема:** Отправили `/start`, но нет ответа.

**Решение:**
1. Проверьте настройки в `.env`:
   ```bash
   cat .env | findstr TELEGRAM
   ```
2. Убедитесь, что сервер запущен и видна строка:
   ```
   🤖 Telegram command bot started
   ```
3. Проверьте, что вы написали правильному боту
4. Попробуйте остановить и запустить сервер снова

### Уведомления не приходят

**Проблема:** Заявки создаются, но уведомления не приходят.

**Решение:**
1. Проверьте, что бот не заблокирован в Telegram
2. Отправьте боту `/start` хотя бы один раз
3. Проверьте логи сервера на ошибки:
   ```
   ❌ Telegram send error:
   ```
4. Проверьте firewall - нужен доступ к `api.telegram.org`

### Ошибка создания таблицы

**Проблема:** `❌ Error creating activity_logs table`

**Решение:**
1. Проверьте подключение к PostgreSQL:
   ```bash
   psql -U postgres -d globalavto
   ```
2. Проверьте настройки БД в `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=globalavto
   DB_USER=postgres
   DB_PASSWORD=lolgame228232
   ```
3. Запустите установку вручную:
   ```bash
   npm run setup-monitoring
   ```

### Сервер не запускается

**Проблема:** Ошибка при `npm start`

**Решение:**
1. Проверьте, что установлены зависимости:
   ```bash
   npm install
   ```
2. Проверьте порт 5000 не занят:
   ```bash
   netstat -ano | findstr :5000
   ```
3. Проверьте все настройки в `.env`

## 📊 Мониторинг работы

### Проверка логов в реальном времени

```bash
# Запустите сервер в dev режиме
npm run dev

# В другом терминале создайте тестовую заявку или войдите в админку
# Вы увидите в логах:
# ✅ Telegram notification sent
# 🔐 Admin login detected
```

### Проверка БД

```bash
# Подключитесь к БД
psql -U postgres -d globalavto

# Проверьте логи
SELECT event_type, COUNT(*) 
FROM activity_logs 
GROUP BY event_type;

# Последние события
SELECT * FROM activity_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

### Статистика через API

```bash
# Получите JWT токен (войдите в админку)
# Затем:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/ga-auth/activity-stats"
```

## 🔒 Безопасность

- ✅ Только указанный CHAT_ID может использовать команды бота
- ✅ Все данные экранируются перед отправкой в Telegram
- ✅ Логи хранятся в защищенной БД PostgreSQL
- ✅ JWT токен требуется для доступа к API логов
- ✅ Rate limiting защищает от флуда
- ✅ Автоматическое отслеживание подозрительной активности

## 📚 Дополнительные ресурсы

- [📖 MONITORING.md](./MONITORING.md) - Полная документация
- [🚀 QUICK_START.md](./QUICK_START.md) - Быстрый старт
- [📋 CHANGELOG_TELEGRAM.md](./CHANGELOG_TELEGRAM.md) - История изменений

## 💡 Идеи для расширения

- [ ] Webhook вместо long polling
- [ ] Несколько получателей уведомлений
- [ ] Настраиваемые шаблоны уведомлений
- [ ] Графики и визуализация в Telegram
- [ ] Экспорт логов в CSV/Excel
- [ ] Интеграция с другими мессенджерами
- [ ] Кнопки inline для быстрых действий
- [ ] Подтверждение заявок через бота

## 👨‍💻 Поддержка

При возникновении проблем:
1. Проверьте [Troubleshooting](#-troubleshooting)
2. Проверьте логи сервера
3. Запустите `npm run test-telegram`

---

**Версия:** 1.0.0  
**Дата:** 06.06.2026  
**Статус:** ✅ Production Ready

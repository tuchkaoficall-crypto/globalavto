# 🏗️ Архитектура системы мониторинга

## 📊 Схема работы

```
┌─────────────────────────────────────────────────────────────────┐
│                        ПОЛЬЗОВАТЕЛИ                              │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ├─── Создание заявки
                           ├─── Добавление отзыва
                           └─── Вход в админку
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXPRESS СЕРВЕР                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ MIDDLEWARE PIPELINE                                      │   │
│  │                                                           │   │
│  │  1. helmet         → Безопасность                        │   │
│  │  2. cors           → CORS политика                       │   │
│  │  3. requestLogger  → Логирование запросов               │   │
│  │  4. rateLimitHandler → Отслеживание лимитов             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ROUTES                                                   │   │
│  │                                                           │   │
│  │  /api/requests     → POST (новая заявка)                │   │
│  │  /api/reviews      → POST (новый отзыв)                 │   │
│  │  /api/ga-auth/login → POST + logAdminLogin middleware   │   │
│  │  /api/ga-auth/activity-stats → GET (статистика)         │   │
│  │  /api/ga-auth/activity-logs  → GET (логи)               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
         ▼                                   ▼
┌──────────────────┐              ┌────────────────────┐
│   POSTGRESQL     │              │  TELEGRAM BOT API  │
│                  │              │                    │
│  • requests      │              │  • sendMessage     │
│  • reviews       │              │  • getUpdates      │
│  • activity_logs │              │                    │
└──────────────────┘              └────────────────────┘
         │                                   │
         │                                   │
         └─────────────┬─────────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │   TELEGRAM     │
              │   CHAT         │
              │  (Администратор)│
              └────────────────┘
```

## 🔄 Поток событий

### 1. Новая заявка

```
Пользователь → POST /api/requests
    │
    ├─> Валидация данных
    ├─> Сохранение в БД (таблица requests)
    ├─> bot.notifyNewRequest()
    │       │
    │       └─> Telegram API → Администратор получает уведомление
    │
    └─> Ответ пользователю (201 Created)
```

### 2. Вход в админку

```
Администратор → POST /api/ga-auth/login
    │
    ├─> Проверка логина/пароля
    ├─> logAdminLogin middleware
    │       │
    │       ├─> Логирование в activity_logs
    │       │       │
    │       │       └─> event_type: admin_login
    │       │           ip_address: 192.168.1.100
    │       │           details: {device, browser, success}
    │       │
    │       └─> bot.notifyAdminLogin()
    │               │
    │               └─> Telegram API → Уведомление о входе
    │
    └─> Ответ с JWT токеном
```

### 3. Подозрительная активность

```
Злоумышленник → 5+ неудачных попыток входа за 15 минут
    │
    ├─> Каждая попытка логируется (admin_login_failed)
    ├─> checkFailedLogins() проверяет количество
    │       │
    │       └─> Если >= 5 попыток:
    │           bot.notifySuspiciousActivity()
    │               │
    │               └─> Telegram API → Предупреждение администратору
    │
    └─> Ответ 401 Unauthorized
```

### 4. Команды бота

```
Администратор → /stats 48 (в Telegram)
    │
    ├─> commandBot.getUpdates() (long polling)
    ├─> commandBot.handleCommand()
    │       │
    │       ├─> Проверка CHAT_ID
    │       ├─> Парсинг команды
    │       └─> cmdStats(chatId, [48])
    │               │
    │               ├─> getStats(48) → Запрос к БД
    │               └─> sendMessage() → Ответ с форматированной статистикой
    │
    └─> Telegram API → Администратор получает ответ
```

## 📦 Компоненты системы

### Middleware

```javascript
// logger.js
┌─────────────────────────────────────┐
│ logAdminLogin                       │
│ - Перехватывает успешные входы      │
│ - Логирует в БД                     │
│ - Отправляет уведомление            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ requestLogger                       │
│ - Логирует все запросы              │
│ - Отслеживает время выполнения      │
│ - Фильтрует важные события          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ rateLimitHandler                    │
│ - Перехватывает 429 ответы          │
│ - Логирует превышение лимита        │
│ - Уведомляет о подозрительной активности │
└─────────────────────────────────────┘
```

### Utils

```javascript
// telegramBot.js
┌─────────────────────────────────────┐
│ TelegramBot class                   │
│ - sendMessage()                     │
│ - notifyNewRequest()                │
│ - notifyNewReview()                 │
│ - notifyAdminLogin()                │
│ - notifySuspiciousActivity()        │
│ - notifyError()                     │
│ - notifyDailyStats()                │
└─────────────────────────────────────┘

// telegramCommands.js
┌─────────────────────────────────────┐
│ TelegramCommandBot class            │
│ - startPolling()                    │
│ - getUpdates()                      │
│ - handleCommand()                   │
│ - cmdStart(), cmdHelp()             │
│ - cmdStats(), cmdRequests()         │
│ - cmdReviews(), cmdLogs()           │
└─────────────────────────────────────┘
```

## 🗄️ Структура БД

```sql
┌────────────────────────────────────────────┐
│ activity_logs                              │
├────────────────────────────────────────────┤
│ id              SERIAL PRIMARY KEY         │
│ event_type      VARCHAR(50) NOT NULL       │
│ ip_address      VARCHAR(45)                │
│ user_agent      TEXT                       │
│ details         JSONB                      │
│ created_at      TIMESTAMP DEFAULT NOW()    │
├────────────────────────────────────────────┤
│ INDEX: idx_activity_logs_event_type       │
│ INDEX: idx_activity_logs_created_at       │
│ INDEX: idx_activity_logs_ip               │
└────────────────────────────────────────────┘
```

### Примеры записей

```json
// Успешный вход
{
  "event_type": "admin_login",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "details": {
    "login": "kirill",
    "device": "Desktop",
    "browser": "Chrome",
    "success": true
  }
}

// Неудачная попытка
{
  "event_type": "admin_login_failed",
  "ip_address": "185.220.101.50",
  "details": {
    "login": "hacker",
    "success": false
  }
}

// Превышение rate limit
{
  "event_type": "rate_limit_exceeded",
  "ip_address": "10.0.0.1",
  "details": {
    "path": "/api/requests",
    "ip": "10.0.0.1"
  }
}
```

## 🕐 Планировщик (Scheduler)

```javascript
┌────────────────────────────────────────────┐
│ scheduleDailyStats()                       │
│                                            │
│ 1. Вычисляет время до 9:00                │
│ 2. setTimeout() до следующей отправки     │
│ 3. sendDailyStats()                        │
│    ├─> getStats(24)                        │
│    └─> bot.notifyDailyStats()              │
│ 4. setInterval(24h) для повторов           │
└────────────────────────────────────────────┘

Timeline:
├─ Сервер запущен: 14:30
├─ Первая отправка: завтра в 9:00
└─ Далее каждый день: 9:00
```

## 🔐 Безопасность

### Уровни защиты

```
┌─────────────────────────────────────────┐
│ 1. Network Layer                        │
│    - HTTPS                              │
│    - Helmet middleware                  │
│    - CORS policy                        │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 2. Application Layer                    │
│    - Rate limiting                      │
│    - Input validation                   │
│    - JWT authentication                 │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 3. Monitoring Layer                     │
│    - Activity logging                   │
│    - Failed login tracking              │
│    - Suspicious activity detection      │
│    - Telegram notifications             │
└─────────────────────────────────────────┘
```

### Проверка CHAT_ID

```javascript
if (String(chatId) !== String(this.chatId)) {
  await this.sendMessage(chatId, '⛔ Доступ запрещен')
  return
}
// Только разрешенный администратор может использовать команды
```

## 🚀 Масштабирование

### Текущая архитектура
- Single server instance
- Long polling для команд
- Синхронная отправка уведомлений

### Возможные улучшения

```
┌────────────────────────────────────────┐
│ Улучшение 1: Webhook                   │
│ Long polling → Webhook                 │
│ + Меньше нагрузка на сервер           │
│ + Быстрее обработка команд            │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Улучшение 2: Message Queue             │
│ Синхронная отправка → Redis Queue     │
│ + Не блокирует основной поток         │
│ + Retry механизм                       │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Улучшение 3: Микросервисы              │
│ Монолит → Отдельный сервис мониторинга│
│ + Независимое масштабирование         │
│ + Изоляция отказов                    │
└────────────────────────────────────────┘
```

## 📈 Производительность

### Индексы БД

```sql
-- Быстрый поиск по типу события
CREATE INDEX idx_activity_logs_event_type 
ON activity_logs(event_type);

-- Быстрая сортировка по дате
CREATE INDEX idx_activity_logs_created_at 
ON activity_logs(created_at DESC);

-- Поиск по IP
CREATE INDEX idx_activity_logs_ip 
ON activity_logs(ip_address);
```

### Сложность запросов

```
getStats(hours):        O(n) где n = логи за период
cmdRequests(limit):     O(log n) с индексом на created_at
cmdLogs(limit):         O(log n) с индексом на created_at
checkFailedLogins():    O(n) где n = попытки за 15 минут
```

## 🧪 Тестирование

```
test-telegram.js
    │
    ├─> Проверка конфигурации
    ├─> 7 типов уведомлений
    │   ├─> Простое сообщение
    │   ├─> Новая заявка
    │   ├─> Новый отзыв
    │   ├─> Вход в админку
    │   ├─> Подозрительная активность
    │   ├─> Ошибка сервера
    │   └─> Дневная статистика
    │
    └─> Проверка в Telegram (ручная)
```

---

**Версия:** 1.0.0  
**Дата:** 06.06.2026

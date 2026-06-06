# 📱 Система мониторинга GlobalAuto

Telegram бот для получения уведомлений и мониторинга активности на сайте.

## 🚀 Возможности

### Автоматические уведомления

Бот отправляет уведомления о:

- 🔔 **Новые заявки** - мгновенное уведомление с контактами клиента
- 💬 **Новые отзывы** - уведомление о новых отзывах на модерации
- 🔐 **Входы в админ-панель** - с информацией об IP, устройстве и браузере
- ⚠️ **Подозрительная активность** - множественные неудачные попытки входа, превышение rate limit
- ❌ **Ошибки сервера** - уведомления о сбоях (500+ ошибки)
- 📊 **Дневная статистика** - ежедневно в 9:00

### Команды бота

Отправьте боту команды для получения информации:

- `/start` - приветствие и описание бота
- `/help` - список всех команд
- `/stats [hours]` - статистика за период (по умолчанию 24ч)
  - Пример: `/stats 48` - статистика за 48 часов
- `/requests [limit]` - последние заявки (по умолчанию 5, макс 20)
  - Пример: `/requests 10` - последние 10 заявок
- `/reviews [limit]` - последние отзывы (по умолчанию 5, макс 20)
- `/logs [limit]` - последние события из логов (по умолчанию 10, макс 30)
- `/ping` - проверка связи с ботом

## ⚙️ Установка

### 1. Настройка Telegram бота

1. Создайте бота через [@BotFather](https://t.me/BotFather):
   - Отправьте `/newbot`
   - Укажите имя и username бота
   - Скопируйте токен (например: `8778757759:AAH_icx1aWNCDZEmKSNAQ_un6BSudlIGDN8`)

2. Получите ваш Chat ID:
   - Напишите боту [@userinfobot](https://t.me/userinfobot)
   - Скопируйте ваш ID (например: `8038634019`)

### 2. Конфигурация .env

Убедитесь, что в файле `server/.env` указаны:

```env
TELEGRAM_BOT_TOKEN=8778757759:AAH_icx1aWNCDZEmKSNAQ_un6BSudlIGDN8
TELEGRAM_CHAT_ID=8038634019
```

### 3. Установка таблиц БД

Выполните скрипт настройки:

```bash
cd server
node setup-monitoring.js
```

Скрипт создаст:
- Таблицу `activity_logs` для хранения логов событий
- Необходимые индексы для быстрого поиска
- Проверит настройки Telegram

### 4. Запуск сервера

```bash
npm start
# или для разработки
npm run dev
```

При запуске вы увидите:
```
✅ Server running on http://localhost:5000
🤖 Telegram command bot started
📊 Daily stats scheduled for ...
```

### 5. Проверка работы

1. Найдите вашего бота в Telegram
2. Отправьте команду `/start`
3. Вы должны получить приветственное сообщение

## 📋 Что логируется

### События в БД (таблица activity_logs)

| Событие | Описание |
|---------|----------|
| `admin_login` | Успешный вход в админ-панель |
| `admin_login_failed` | Неудачная попытка входа |
| `rate_limit_exceeded` | Превышен лимит запросов |
| `request` | Важные HTTP запросы (ошибки 4xx/5xx, админ эндпоинты) |

### Структура таблицы activity_logs

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

Поле `details` хранит дополнительную информацию в формате JSON:
- Устройство и браузер
- Статус код
- Путь запроса
- И другие детали

## 🔔 Примеры уведомлений

### Новая заявка
```
🔔 Новая заявка!

👤 Имя: Иван Петров
📞 Телефон: +7 999 123-45-67
🚗 Авто: Toyota Camry
💬 Комментарий: Нужна покраска капота

🆔 ID: #123
🕐 Время: 06.06.2026 14:30
```

### Вход в админку
```
🔐 Вход в админ-панель

👤 Логин: kirill
🌐 IP: 192.168.1.100
🖥️ User-Agent: Mozilla/5.0 ...

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

### Дневная статистика
```
📊 Статистика за день

📝 Новых заявок: 12
💬 Новых отзывов: 3
👥 Уникальных IP: 156
🔐 Входов в админку: 4

🕐 06.06.2026 09:00
```

## 🛠️ API эндпоинты для логов

Новые эндпоинты в админ-панели (требуется JWT токен):

### GET /api/ga-auth/activity-stats
Статистика активности за период

**Query параметры:**
- `hours` - количество часов (по умолчанию 24)

**Пример:**
```bash
GET /api/ga-auth/activity-stats?hours=48
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
Последние события из логов

**Query параметры:**
- `limit` - количество записей (по умолчанию 50)

**Пример:**
```bash
GET /api/ga-auth/activity-logs?limit=100
```

## 🔒 Безопасность

1. **Приватность токена** - никогда не публикуйте `.env` файл
2. **Ограничение доступа** - бот отвечает только на команды от указанного `TELEGRAM_CHAT_ID`
3. **Rate limiting** - защита от флуда запросов
4. **Логирование** - все подозрительные действия записываются

## 📝 Расширение функционала

### Добавление новых команд

Редактируйте `server/utils/telegramCommands.js`:

```javascript
case '/mycommand':
  await this.cmdMyCommand(chatId, args)
  break
```

### Добавление новых типов уведомлений

В `server/utils/telegramBot.js`:

```javascript
notifyMyEvent(data) {
  const lines = [
    '🔔 <b>Мое событие</b>',
    `📝 ${this._escape(data.description)}`
  ]
  return this.sendMessage(lines.join('\n'))
}
```

### Логирование новых событий

В любом месте кода:

```javascript
const { logEvent } = require('./middleware/logger')

logEvent('my_event', req, {
  customField: 'value',
  details: 'some details'
})
```

## 🐛 Troubleshooting

### Бот не отвечает на команды

1. Проверьте токен в `.env`
2. Убедитесь, что сервер запущен
3. Проверьте логи сервера: `❌ Telegram send error:`
4. Проверьте, что ваш `TELEGRAM_CHAT_ID` указан правильно

### Уведомления не приходят

1. Проверьте настройки в `.env`
2. Убедитесь, что бот не заблокирован
3. Проверьте firewall - нужен доступ к `api.telegram.org` (149.154.166.110)

### Таблица activity_logs не создается

Запустите:
```bash
node setup-monitoring.js
```

### Ошибка подключения к БД

Проверьте настройки PostgreSQL в `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=globalavto
DB_USER=postgres
DB_PASSWORD=your_password
```

## 📚 Дополнительные ресурсы

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Express Rate Limiting](https://www.npmjs.com/package/express-rate-limit)

## 🎯 TODO / Идеи для улучшения

- [ ] Webhook вместо long polling для команд
- [ ] Графики и визуализация статистики
- [ ] Экспорт логов в CSV
- [ ] Настраиваемое расписание дневной статистики
- [ ] Интеграция с другими мессенджерами (WhatsApp, Discord)
- [ ] Мобильное приложение для администратора
- [ ] Push уведомления через PWA

---

**Версия:** 1.0.0  
**Дата:** 06.06.2026  
**Автор:** GlobalAuto Team

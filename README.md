# Global Avto — Запуск проекта

## Требования
- Node.js 18+
- PostgreSQL

## 1. База данных

Создай БД в PostgreSQL:
```sql
CREATE DATABASE globalavto;
```

Применить схему:
```
psql -U postgres -d globalavto -f server/db/schema.sql
```

Заполнить марки:
```
cd server && node db/seed.js
```

## 2. Настройка сервера

Отредактируй `server/.env`:
```
DB_PASSWORD=твой_пароль_postgres
```

## 3. Запуск

Терминал 1 — сервер:
```
cd server
npm run dev
```

Терминал 2 — клиент:
```
cd client
npm run dev
```

Открыть: http://localhost:5173

## Структура
- `client/` — React фронтенд
- `server/` — Node.js/Express бэкенд
- `assets/` — исходные файлы (логотип)

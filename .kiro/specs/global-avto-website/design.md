# Дизайн и архитектура — Global Avto Website

## 1. Структура проекта

```
global-avto/
├── client/                  # React (Vite)
│   ├── src/
│   │   ├── components/      # UI компоненты
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Stats.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── CarSelector.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Reviews.jsx
│   │   │   ├── Contacts.jsx
│   │   │   └── RequestPopup.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── BrandPage.jsx   # /remont-{slug}
│   │   ├── data/
│   │   │   └── brands.js       # список марок со slug
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── assets/
│   │       └── LOGO.jpg
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                  # Node.js (Express)
│   ├── routes/
│   │   ├── requests.js
│   │   ├── brands.js
│   │   ├── models.js
│   │   └── reviews.js
│   ├── db/
│   │   ├── index.js         # pg pool
│   │   └── schema.sql
│   ├── middleware/
│   │   └── rateLimit.js
│   └── index.js
│
└── package.json
```

---

## 2. Frontend архитектура

### Технологии
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router v6
- Axios

### Роутинг
```
/                    → Home (лендинг)
/remont-avto         → общая SEO страница
/remont/:slug        → SEO страница марки
```

### Компоненты

**Navbar**
- Sticky, прозрачный → `bg-black/80 backdrop-blur` при скролле
- Логотип + навигация + кнопка "Записаться"
- Мобильный: бургер → drawer справа (Framer Motion)

**Hero**
- Двухколоночный layout (desktop), стек (mobile)
- Левая колонка: заголовок + подзаголовок + CTA кнопка
- Правая колонка: форма в glass-карточке
- Анимация машины: `x: 200 → 0` при загрузке

**CarSelector**
- Шаг 1: CSS Grid, карточки марок (логотип + название)
- Шаг 2: flex-wrap pill кнопки моделей
- Шаг 3: Modal/Popup с формой
- Состояние: `selectedBrand`, `selectedModel`, `step`

**Reviews**
- Карусель или grid карточек
- Форма добавления отзыва внизу секции
- Звёзды: интерактивный рейтинг (hover + click)

---

## 3. Backend архитектура

### Технологии
- Node.js + Express
- pg (node-postgres)
- express-rate-limit
- helmet (XSS защита)
- cors

### API эндпоинты

```
POST /api/requests          # создать заявку
GET  /api/brands            # список марок
GET  /api/brands/:slug      # марка по slug
GET  /api/models/:brandId   # модели марки
POST /api/reviews           # создать отзыв
GET  /api/reviews           # одобренные отзывы
```

### Безопасность
- `helmet()` — HTTP заголовки
- `express-rate-limit` — 5 req/15min на POST /api/requests
- Honeypot: поле `website` в форме, если заполнено — отклонить
- Параметризованные SQL запросы (pg)
- IP проверка для отзывов

---

## 4. Дизайн-система

### Цвета (Tailwind custom)
```js
colors: {
  bg: '#0D0D0D',
  red: '#E60023',
  'red-hover': '#CC001F',
  'gray-secondary': '#6B7280',
  'glass': 'rgba(255,255,255,0.05)',
}
```

### Типографика
```css
/* Заголовки */
font-family: 'Bebas Neue', 'Montserrat', sans-serif;

/* Текст */
font-family: 'Inter', sans-serif;
```

### Glass-эффект
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 12px;
```

### Кнопки
- Primary: `bg-red-600 hover:bg-red-700 text-white`
- Secondary: `border border-white/20 hover:bg-white/10`

---

## 5. Анимации (Framer Motion)

```js
// Появление при скролле
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

// Выезд машины
const carSlide = {
  hidden: { x: 200, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } }
}

// Popup
const popupVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
}
```

---

## 6. SEO страницы

Каждая страница `/remont/:slug` генерирует:
- `<title>Кузовной ремонт {Марка} в Петрозаводске | Global Avto</title>`
- `<meta name="description" content="...">`
- H1, H2 с ключевыми словами
- Форма заявки

---

## 7. База данных

Используется PostgreSQL через `pg` pool.
Seed данные: все 36 марок с slug и путём к логотипу.
Модели загружаются динамически из БД.

---

## 8. Деплой

**Dev:**
```bash
# client
cd client && npm run dev

# server
cd server && npm run dev
```

**Prod (Plesk):**
- Client: `npm run build` → статика
- Server: Node.js app через Plesk
- SSL: Let's Encrypt через Plesk

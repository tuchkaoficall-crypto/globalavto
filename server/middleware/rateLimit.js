const rateLimit = require('express-rate-limit')

const requestsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 5,
  message: { error: 'Слишком много заявок. Попробуйте позже.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const reviewsLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 часа
  max: 1,
  message: { error: 'Вы уже оставляли отзыв сегодня.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5,
  message: { error: 'Слишком много попыток входа. Попробуйте через 15 минут.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
})

module.exports = { requestsLimiter, reviewsLimiter, loginLimiter }

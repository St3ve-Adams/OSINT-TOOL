import rateLimit from 'express-rate-limit'

// Global rate limiter
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
})

// IP lookup specific limiter
export const ipLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many IP lookup requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
})

// MAC lookup specific limiter
export const macLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many MAC lookup requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
})

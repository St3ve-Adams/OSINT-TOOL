import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initDatabase } from './database/db.js'
import { globalLimiter } from './middleware/rateLimiter.js'
import ipRoutes from './routes/ip.js'
import macRoutes from './routes/mac.js'
import historyRoutes from './routes/history.js'
import whoisRoutes from './routes/whois.js'
import emailRoutes from './routes/email.js'
import usernameRoutes from './routes/username.js'
import dnsRoutes from './routes/dns.js'
import hashRoutes from './routes/hash.js'
import headersRoutes from './routes/headers.js'
import sslRoutes from './routes/ssl.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Initialize database
initDatabase()

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}))
app.use(express.json())
app.use(globalLimiter)

// API Routes
app.use('/api/ip', ipRoutes)
app.use('/api/mac', macRoutes)
app.use('/api/whois', whoisRoutes)
app.use('/api/email', emailRoutes)
app.use('/api/username', usernameRoutes)
app.use('/api/dns', dnsRoutes)
app.use('/api/hash', hashRoutes)
app.use('/api/headers', headersRoutes)
app.use('/api/ssl', sslRoutes)
app.use('/api/history', historyRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = join(__dirname, '../../client/dist')
  app.use(express.static(clientDist))
  app.get('*', (req, res) => {
    res.sendFile(join(clientDist, 'index.html'))
  })
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`OSINT API server running on port ${PORT}`)
})

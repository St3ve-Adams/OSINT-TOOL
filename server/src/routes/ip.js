import { Router } from 'express'
import { validateIp, lookupIp } from '../services/ipLookup.js'
import { addHistory } from '../database/db.js'
import { ipLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.get('/:ip', ipLimiter, async (req, res) => {
  try {
    const { ip } = req.params

    if (!ip || !validateIp(ip)) {
      return res.status(400).json({ error: 'Invalid IP address format' })
    }

    const result = await lookupIp(ip)

    // Save to history
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    addHistory('ip', ip, result, clientIp)

    res.json(result)
  } catch (err) {
    console.error('IP lookup error:', err.message)
    res.status(500).json({ error: err.message || 'Failed to lookup IP address' })
  }
})

export default router

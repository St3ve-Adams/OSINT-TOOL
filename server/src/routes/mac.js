import { Router } from 'express'
import { validateMac, lookupMac } from '../services/macLookup.js'
import { addHistory } from '../database/db.js'
import { macLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.get('/:mac', macLimiter, async (req, res) => {
  try {
    const { mac } = req.params

    if (!mac || !validateMac(mac)) {
      return res.status(400).json({ error: 'Invalid MAC address format' })
    }

    const result = lookupMac(mac)

    // Save to history
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    addHistory('mac', mac, result, clientIp)

    res.json(result)
  } catch (err) {
    console.error('MAC lookup error:', err.message)
    res.status(500).json({ error: err.message || 'Failed to lookup MAC address' })
  }
})

export default router

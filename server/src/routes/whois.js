import { Router } from 'express'
import { lookupWhois } from '../services/whoisLookup.js'
import { addHistory } from '../database/db.js'

const router = Router()

router.get('/:domain', async (req, res) => {
  try {
    const { domain } = req.params

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' })
    }

    const result = await lookupWhois(domain)

    // Save to history
    const clientIp = req.ip || req.connection.remoteAddress
    addHistory('whois', domain, result, clientIp)

    res.json(result)
  } catch (err) {
    console.error('WHOIS lookup error:', err.message)

    if (err.message.includes('Invalid domain')) {
      return res.status(400).json({ error: err.message })
    }

    res.status(500).json({ error: err.message || 'WHOIS lookup failed' })
  }
})

export default router

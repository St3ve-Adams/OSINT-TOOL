import express from 'express'
import { checkSsl } from '../services/sslChecker.js'
import { addHistory } from '../database/db.js'

const router = express.Router()

router.get('/:domain', async (req, res) => {
  try {
    const { domain } = req.params

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' })
    }

    const result = await checkSsl(domain)

    // Log to history
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    addHistory('ssl', domain, result, clientIp)

    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router

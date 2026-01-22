import express from 'express'
import { fetchHeaders } from '../services/httpHeaders.js'
import { addHistory } from '../database/db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { url } = req.query

    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    const result = await fetchHeaders(url)

    // Log to history
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    addHistory('headers', url, result, clientIp)

    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router

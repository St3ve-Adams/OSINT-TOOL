import express from 'express'
import { generateHashes, verifyHash } from '../services/hashGenerator.js'
import { addHistory } from '../database/db.js'

const router = express.Router()

// Generate hashes for text
router.post('/generate', async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    const result = generateHashes(text)

    // Log to history (truncate text for privacy)
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    addHistory('hash', text.substring(0, 50) + (text.length > 50 ? '...' : ''), result, clientIp)

    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Verify a hash
router.post('/verify', async (req, res) => {
  try {
    const { text, hash, algorithm } = req.body

    if (!text || !hash || !algorithm) {
      return res.status(400).json({ error: 'Text, hash, and algorithm are required' })
    }

    const result = verifyHash(text, hash, algorithm)
    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router

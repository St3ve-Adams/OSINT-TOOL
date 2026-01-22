import { Router } from 'express'
import { searchUsername, getPlatforms } from '../services/usernameSearch.js'
import { addHistory } from '../database/db.js'

const router = Router()

// Get list of supported platforms
router.get('/platforms', (req, res) => {
  res.json({ platforms: getPlatforms() })
})

// Search username across platforms
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params

    if (!username) {
      return res.status(400).json({ error: 'Username is required' })
    }

    const result = await searchUsername(username)

    // Save to history
    const clientIp = req.ip || req.connection.remoteAddress
    addHistory('username', username, result, clientIp)

    res.json(result)
  } catch (err) {
    console.error('Username search error:', err.message)

    if (err.message.includes('Invalid username')) {
      return res.status(400).json({ error: err.message })
    }

    res.status(500).json({ error: err.message || 'Username search failed' })
  }
})

export default router

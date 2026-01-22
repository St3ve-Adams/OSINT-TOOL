import { Router } from 'express'
import { validateEmail } from '../services/emailValidator.js'
import { addHistory } from '../database/db.js'

const router = Router()

router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' })
    }

    const result = await validateEmail(email)

    // Save to history
    const clientIp = req.ip || req.connection.remoteAddress
    addHistory('email', email, result, clientIp)

    res.json(result)
  } catch (err) {
    console.error('Email validation error:', err.message)
    res.status(500).json({ error: err.message || 'Email validation failed' })
  }
})

export default router

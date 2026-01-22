import { Router } from 'express'
import { getHistory, getHistoryCount, deleteHistoryItem, clearHistory } from '../database/db.js'

const router = Router()

// Get history with optional filtering
router.get('/', (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query

    const validTypes = ['ip', 'mac']
    const filterType = validTypes.includes(type) ? type : null
    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20))

    const history = getHistory(filterType, pageNum, limitNum)
    const total = getHistoryCount(filterType)

    res.json({
      history,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (err) {
    console.error('Get history error:', err.message)
    res.status(500).json({ error: 'Failed to retrieve history' })
  }
})

// Delete single history item
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params
    const idNum = parseInt(id)

    if (isNaN(idNum)) {
      return res.status(400).json({ error: 'Invalid ID' })
    }

    const result = deleteHistoryItem(idNum)

    if (result.changes === 0) {
      return res.status(404).json({ error: 'History item not found' })
    }

    res.json({ success: true, message: 'History item deleted' })
  } catch (err) {
    console.error('Delete history error:', err.message)
    res.status(500).json({ error: 'Failed to delete history item' })
  }
})

// Clear all history
router.delete('/', (req, res) => {
  try {
    clearHistory()
    res.json({ success: true, message: 'History cleared' })
  } catch (err) {
    console.error('Clear history error:', err.message)
    res.status(500).json({ error: 'Failed to clear history' })
  }
})

export default router

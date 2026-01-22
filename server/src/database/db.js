import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Use environment variable or default path
const dbPath = process.env.DATABASE_PATH || join(__dirname, '../../data/osint.db')

// Ensure directory exists
const dbDir = dirname(dbPath)
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
}

const db = new Database(dbPath)

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      query TEXT NOT NULL,
      result TEXT NOT NULL,
      client_ip TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_history_type ON search_history(type);
    CREATE INDEX IF NOT EXISTS idx_history_created ON search_history(created_at DESC);
  `)
  console.log('Database initialized')
}

export function addHistory(type, query, result, clientIp) {
  const stmt = db.prepare(`
    INSERT INTO search_history (type, query, result, client_ip)
    VALUES (?, ?, ?, ?)
  `)
  return stmt.run(type, query, JSON.stringify(result), clientIp)
}

export function getHistory(type = null, page = 1, limit = 20) {
  const offset = (page - 1) * limit

  let query = 'SELECT id, type, query, created_at FROM search_history'
  const params = []

  if (type) {
    query += ' WHERE type = ?'
    params.push(type)
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)

  const stmt = db.prepare(query)
  return stmt.all(...params)
}

export function getHistoryCount(type = null) {
  let query = 'SELECT COUNT(*) as count FROM search_history'
  const params = []

  if (type) {
    query += ' WHERE type = ?'
    params.push(type)
  }

  const stmt = db.prepare(query)
  return stmt.get(...params).count
}

export function deleteHistoryItem(id) {
  const stmt = db.prepare('DELETE FROM search_history WHERE id = ?')
  return stmt.run(id)
}

export function clearHistory() {
  const stmt = db.prepare('DELETE FROM search_history')
  return stmt.run()
}

export default db

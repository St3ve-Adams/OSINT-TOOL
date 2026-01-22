import { useState, useEffect } from 'react'
import { getHistory, deleteHistoryItem, clearHistory } from '../../services/api'

function History() {
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const type = filter === 'all' ? null : filter
      const data = await getHistory(type)
      setHistory(data.history || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load history')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [filter])

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id)
      setHistory(history.filter(item => item.id !== id))
    } catch (err) {
      setError('Failed to delete item')
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return
    try {
      await clearHistory()
      setHistory([])
    } catch (err) {
      setError('Failed to clear history')
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-500/20 rounded-lg">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Search History</h1>
              <p className="text-slate-400">View your past lookups</p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {['all', 'ip', 'mac'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-dark-700 text-slate-300 hover:bg-dark-600'
              }`}
            >
              {type === 'all' ? 'All' : type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="card flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : history.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-slate-400">No search history yet</p>
          <p className="text-slate-500 text-sm mt-1">Your lookups will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  item.type === 'ip' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {item.type.toUpperCase()}
                </span>
                <div>
                  <p className="text-white font-medium">{item.query}</p>
                  <p className="text-slate-500 text-sm">{formatDate(item.created_at)}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History

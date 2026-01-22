import { useState } from 'react'
import SearchInput from '../common/SearchInput'
import HeadersResult from './HeadersResult'

function HttpHeaders() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (url) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/headers?url=${encodeURIComponent(url)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Headers fetch failed')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">HTTP Headers Analyzer</h1>
            <p className="text-slate-400">Analyze HTTP response headers and security configuration</p>
          </div>
        </div>

        <SearchInput
          onSearch={handleSearch}
          placeholder="Enter URL (e.g., example.com)"
          isLoading={isLoading}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {['google.com', 'github.com', 'cloudflare.com'].map((url) => (
            <button
              key={url}
              onClick={() => handleSearch(url)}
              className="text-xs px-3 py-1 bg-dark-700 text-slate-400 rounded-full hover:bg-dark-600 hover:text-white transition-colors"
            >
              {url}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="card flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-purple-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}

      {result && <HeadersResult data={result} />}
    </div>
  )
}

export default HttpHeaders

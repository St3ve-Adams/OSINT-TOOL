import { useState } from 'react'
import SearchInput from '../common/SearchInput'
import WhoisResult from './WhoisResult'

function WhoisLookup() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (domain) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/whois/${encodeURIComponent(domain)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'WHOIS lookup failed')
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
          <div className="p-2 bg-green-500/20 rounded-lg">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">WHOIS Lookup</h1>
            <p className="text-slate-400">Get domain registration information</p>
          </div>
        </div>

        <SearchInput
          onSearch={handleSearch}
          placeholder="Enter domain (e.g., example.com)"
          isLoading={isLoading}
          pattern="^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {['google.com', 'github.com', 'cloudflare.com'].map((domain) => (
            <button
              key={domain}
              onClick={() => handleSearch(domain)}
              className="text-xs px-3 py-1 bg-dark-700 text-slate-400 rounded-full hover:bg-dark-600 hover:text-white transition-colors"
            >
              {domain}
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
          <svg className="animate-spin h-8 w-8 text-green-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}

      {result && <WhoisResult data={result} />}
    </div>
  )
}

export default WhoisLookup

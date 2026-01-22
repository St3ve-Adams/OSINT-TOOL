import { useState } from 'react'
import SearchInput from '../common/SearchInput'
import IpResult from './IpResult'
import { ipLookup } from '../../services/api'

function IpLookup() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (ip) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await ipLookup(ip)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to lookup IP address')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">IP Address Lookup</h1>
            <p className="text-slate-400">Get geolocation, ISP, and network information for any IP address</p>
          </div>
        </div>

        <SearchInput
          placeholder="Enter IP address (e.g., 8.8.8.8)"
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {result && <IpResult data={result} />}
    </div>
  )
}

export default IpLookup

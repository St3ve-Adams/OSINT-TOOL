import { useState } from 'react'
import SearchInput from '../common/SearchInput'
import MacResult from './MacResult'
import { macLookup } from '../../services/api'

function MacLookup() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (mac) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await macLookup(mac)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to lookup MAC address')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">MAC Address Lookup</h1>
            <p className="text-slate-400">Identify the manufacturer and vendor from any MAC address</p>
          </div>
        </div>

        <SearchInput
          placeholder="Enter MAC address (e.g., 00:1A:2B:3C:4D:5E)"
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        <p className="mt-3 text-sm text-slate-500">
          Supported formats: 00:1A:2B:3C:4D:5E, 00-1A-2B-3C-4D-5E, 001A2B3C4D5E
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {result && <MacResult data={result} />}
    </div>
  )
}

export default MacLookup

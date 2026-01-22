import { useState } from 'react'
import SearchInput from '../common/SearchInput'
import EmailResult from './EmailResult'

function EmailValidator() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (email) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/email/${encodeURIComponent(email)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Email validation failed')
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
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Email Validator</h1>
            <p className="text-slate-400">Verify email addresses and check deliverability</p>
          </div>
        </div>

        <SearchInput
          onSearch={handleSearch}
          placeholder="Enter email address (e.g., user@example.com)"
          isLoading={isLoading}
          type="email"
        />

        <div className="mt-4 text-sm text-slate-500">
          <p>Checks: Format validation, MX records, disposable email detection</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="card flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-yellow-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}

      {result && <EmailResult data={result} />}
    </div>
  )
}

export default EmailValidator

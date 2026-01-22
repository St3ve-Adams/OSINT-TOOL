import { ResultCard, ResultRow, ResultBadge } from '../common/ResultCard'

function HeadersResult({ data }) {
  const { url, statusCode, statusText, headers, security, timing } = data

  const getStatusType = (code) => {
    if (code >= 200 && code < 300) return 'success'
    if (code >= 300 && code < 400) return 'info'
    if (code >= 400 && code < 500) return 'warning'
    return 'danger'
  }

  const securityHeaders = [
    'content-security-policy',
    'strict-transport-security',
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection',
    'referrer-policy',
    'permissions-policy'
  ]

  const presentSecurityHeaders = Object.keys(headers).filter(h =>
    securityHeaders.includes(h.toLowerCase())
  )

  const missingSecurityHeaders = securityHeaders.filter(h =>
    !Object.keys(headers).some(key => key.toLowerCase() === h)
  )

  return (
    <div className="space-y-4">
      {/* Response Info */}
      <ResultCard
        title="Response Information"
        icon={
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <ResultRow label="URL" value={url} highlight />
        <ResultRow
          label="Status"
          value={<ResultBadge value={`${statusCode} ${statusText}`} type={getStatusType(statusCode)} />}
        />
        {timing?.totalMs && <ResultRow label="Response Time" value={`${timing.totalMs}ms`} />}
        <ResultRow label="Server" value={headers['server'] || headers['Server'] || 'Not disclosed'} />
        <ResultRow label="Content-Type" value={headers['content-type'] || headers['Content-Type'] || 'N/A'} />
      </ResultCard>

      {/* Security Analysis */}
      <ResultCard
        title="Security Headers Analysis"
        icon={
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
      >
        <ResultRow
          label="Security Score"
          value={<ResultBadge
            value={`${presentSecurityHeaders.length}/${securityHeaders.length}`}
            type={presentSecurityHeaders.length >= 5 ? 'success' : presentSecurityHeaders.length >= 3 ? 'warning' : 'danger'}
          />}
        />
        {presentSecurityHeaders.length > 0 && (
          <div className="mt-2">
            <span className="text-sm text-green-400">Present:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {presentSecurityHeaders.map(h => (
                <span key={h} className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">{h}</span>
              ))}
            </div>
          </div>
        )}
        {missingSecurityHeaders.length > 0 && (
          <div className="mt-2">
            <span className="text-sm text-red-400">Missing:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {missingSecurityHeaders.map(h => (
                <span key={h} className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded">{h}</span>
              ))}
            </div>
          </div>
        )}
      </ResultCard>

      {/* All Headers */}
      <ResultCard
        title="All Response Headers"
        icon={
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        }
      >
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(headers).map(([key, value]) => (
            <div key={key} className="flex flex-col py-2 border-b border-dark-700 last:border-0">
              <span className="text-blue-400 text-sm font-medium">{key}</span>
              <span className="text-slate-200 text-sm font-mono break-all">{value}</span>
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  )
}

export default HeadersResult

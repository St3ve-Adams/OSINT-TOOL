import { ResultCard, ResultRow, ResultBadge } from '../common/ResultCard'

function WhoisResult({ data }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-4">
      {/* Domain Status */}
      <ResultCard
        title="Domain Information"
        icon={
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        }
      >
        <ResultRow label="Domain" value={data.domain || data.domainName} highlight />
        <ResultRow
          label="Status"
          value={
            data.available ? (
              <ResultBadge value="Available" type="success" />
            ) : (
              <ResultBadge value="Registered" type="info" />
            )
          }
        />
        <ResultRow label="Registrar" value={data.registrar} />
        {data.registrarUrl && (
          <ResultRow
            label="Registrar URL"
            value={
              <a href={data.registrarUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {data.registrarUrl}
              </a>
            }
          />
        )}
      </ResultCard>

      {/* Dates */}
      <ResultCard
        title="Important Dates"
        icon={
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      >
        <ResultRow label="Created" value={formatDate(data.creationDate)} />
        <ResultRow label="Updated" value={formatDate(data.updatedDate)} />
        <ResultRow label="Expires" value={formatDate(data.expiryDate)} highlight />
      </ResultCard>

      {/* Name Servers */}
      {data.nameServers && data.nameServers.length > 0 && (
        <ResultCard
          title="Name Servers"
          icon={
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          }
        >
          {data.nameServers.map((ns, idx) => (
            <div key={idx} className="flex items-center gap-2 py-1 border-b border-dark-700 last:border-0">
              <span className="text-slate-500 text-sm">{idx + 1}.</span>
              <span className="text-slate-200 font-mono text-sm">{ns}</span>
            </div>
          ))}
        </ResultCard>
      )}

      {/* Domain Status Codes */}
      {data.status && data.status.length > 0 && (
        <ResultCard
          title="Domain Status"
          icon={
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        >
          <div className="flex flex-wrap gap-2">
            {data.status.map((status, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                {status}
              </span>
            ))}
          </div>
        </ResultCard>
      )}

      {/* Contact Info */}
      {(data.registrantOrg || data.registrantCountry || data.abuseEmail) && (
        <ResultCard
          title="Contact Information"
          icon={
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        >
          {data.registrantName && <ResultRow label="Registrant" value={data.registrantName} />}
          {data.registrantOrg && <ResultRow label="Organization" value={data.registrantOrg} />}
          {data.registrantCountry && <ResultRow label="Country" value={data.registrantCountry} />}
          {data.abuseEmail && <ResultRow label="Abuse Email" value={data.abuseEmail} />}
        </ResultCard>
      )}

      {/* Raw WHOIS */}
      {data.raw && (
        <div className="card">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="font-semibold text-white">Raw WHOIS Data</span>
              </div>
              <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <pre className="mt-4 p-4 bg-dark-700 rounded-lg text-xs text-slate-300 overflow-x-auto max-h-96 overflow-y-auto">
              {data.raw}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}

export default WhoisResult

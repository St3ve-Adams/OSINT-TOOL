import { ResultCard, ResultRow, ResultBadge } from '../common/ResultCard'

function DnsResult({ data }) {
  const { records, summary } = data

  return (
    <div className="space-y-4">
      {/* Summary */}
      <ResultCard
        title="DNS Summary"
        icon={
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      >
        <ResultRow label="Domain" value={data.domain} highlight />
        <ResultRow
          label="IPv4"
          value={<ResultBadge value={summary.hasIPv4 ? 'Yes' : 'No'} type={summary.hasIPv4 ? 'success' : 'default'} />}
        />
        <ResultRow
          label="IPv6"
          value={<ResultBadge value={summary.hasIPv6 ? 'Yes' : 'No'} type={summary.hasIPv6 ? 'success' : 'default'} />}
        />
        <ResultRow
          label="Mail Server"
          value={<ResultBadge value={summary.hasMail ? 'Yes' : 'No'} type={summary.hasMail ? 'success' : 'default'} />}
        />
        <ResultRow label="Record Types Found" value={summary.recordCount} />
      </ResultCard>

      {/* A Records */}
      {records.A && records.A.length > 0 && (
        <ResultCard
          title="A Records (IPv4)"
          icon={
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          }
        >
          {records.A.map((ip, idx) => (
            <div key={idx} className="flex items-center gap-2 py-1 border-b border-dark-700 last:border-0">
              <span className="text-slate-200 font-mono">{ip}</span>
            </div>
          ))}
        </ResultCard>
      )}

      {/* AAAA Records */}
      {records.AAAA && records.AAAA.length > 0 && (
        <ResultCard
          title="AAAA Records (IPv6)"
          icon={
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          }
        >
          {records.AAAA.map((ip, idx) => (
            <div key={idx} className="flex items-center gap-2 py-1 border-b border-dark-700 last:border-0">
              <span className="text-slate-200 font-mono text-sm break-all">{ip}</span>
            </div>
          ))}
        </ResultCard>
      )}

      {/* MX Records */}
      {records.MX && records.MX.length > 0 && (
        <ResultCard
          title="MX Records (Mail)"
          icon={
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        >
          {records.MX.map((mx, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 border-b border-dark-700 last:border-0">
              <span className="text-slate-200 font-mono text-sm">{mx.exchange}</span>
              <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">Priority: {mx.priority}</span>
            </div>
          ))}
        </ResultCard>
      )}

      {/* NS Records */}
      {records.NS && records.NS.length > 0 && (
        <ResultCard
          title="NS Records (Name Servers)"
          icon={
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          }
        >
          {records.NS.map((ns, idx) => (
            <div key={idx} className="flex items-center gap-2 py-1 border-b border-dark-700 last:border-0">
              <span className="text-slate-500 text-sm">{idx + 1}.</span>
              <span className="text-slate-200 font-mono text-sm">{ns}</span>
            </div>
          ))}
        </ResultCard>
      )}

      {/* TXT Records */}
      {records.TXT && records.TXT.length > 0 && (
        <ResultCard
          title="TXT Records"
          icon={
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        >
          {records.TXT.map((txt, idx) => (
            <div key={idx} className="py-2 border-b border-dark-700 last:border-0">
              <p className="text-slate-200 text-sm font-mono break-all">{txt}</p>
            </div>
          ))}
        </ResultCard>
      )}

      {/* CNAME Records */}
      {records.CNAME && records.CNAME.length > 0 && (
        <ResultCard
          title="CNAME Records"
          icon={
            <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          }
        >
          {records.CNAME.map((cname, idx) => (
            <div key={idx} className="flex items-center gap-2 py-1 border-b border-dark-700 last:border-0">
              <span className="text-slate-200 font-mono text-sm">{cname}</span>
            </div>
          ))}
        </ResultCard>
      )}

      {/* SOA Record */}
      {records.SOA && (
        <ResultCard
          title="SOA Record"
          icon={
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        >
          <ResultRow label="Primary NS" value={records.SOA.nsname} />
          <ResultRow label="Hostmaster" value={records.SOA.hostmaster} />
          <ResultRow label="Serial" value={records.SOA.serial} />
          <ResultRow label="Refresh" value={`${records.SOA.refresh}s`} />
          <ResultRow label="Retry" value={`${records.SOA.retry}s`} />
          <ResultRow label="Expire" value={`${records.SOA.expire}s`} />
          <ResultRow label="Min TTL" value={`${records.SOA.minttl}s`} />
        </ResultCard>
      )}
    </div>
  )
}

export default DnsResult

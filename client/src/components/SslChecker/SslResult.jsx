import { ResultCard, ResultRow, ResultBadge } from '../common/ResultCard'

function SslResult({ data }) {
  const { domain, status, statusMessage, certificate } = data

  const getStatusType = () => {
    switch (status) {
      case 'valid': return 'success'
      case 'expiring': return 'warning'
      case 'expired': case 'invalid': return 'danger'
      default: return 'warning'
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      {/* Status Overview */}
      <ResultCard
        title="Certificate Status"
        icon={
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
      >
        <ResultRow label="Domain" value={domain} highlight />
        <ResultRow
          label="Status"
          value={<ResultBadge value={status.toUpperCase()} type={getStatusType()} />}
        />
        <ResultRow label="Message" value={statusMessage} />
        <ResultRow
          label="Trusted"
          value={<ResultBadge value={certificate.authorized ? 'Yes' : 'No'} type={certificate.authorized ? 'success' : 'danger'} />}
        />
        {certificate.authorizationError && (
          <ResultRow label="Trust Issue" value={certificate.authorizationError} />
        )}
      </ResultCard>

      {/* Validity Period */}
      <ResultCard
        title="Validity Period"
        icon={
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      >
        <ResultRow label="Valid From" value={formatDate(certificate.validity.validFrom)} />
        <ResultRow label="Valid Until" value={formatDate(certificate.validity.validTo)} />
        <ResultRow
          label="Days Remaining"
          value={
            <ResultBadge
              value={`${certificate.validity.daysRemaining} days`}
              type={certificate.validity.daysRemaining > 30 ? 'success' : certificate.validity.daysRemaining > 7 ? 'warning' : 'danger'}
            />
          }
        />
      </ResultCard>

      {/* Subject Info */}
      <ResultCard
        title="Certificate Subject"
        icon={
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      >
        <ResultRow label="Common Name" value={certificate.subject.commonName} highlight />
        <ResultRow label="Organization" value={certificate.subject.organization} />
        <ResultRow label="Country" value={certificate.subject.country} />
        {certificate.subject.state && <ResultRow label="State" value={certificate.subject.state} />}
        {certificate.subject.locality && <ResultRow label="Locality" value={certificate.subject.locality} />}
      </ResultCard>

      {/* Issuer Info */}
      <ResultCard
        title="Certificate Issuer"
        icon={
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
      >
        <ResultRow label="Common Name" value={certificate.issuer.commonName} highlight />
        <ResultRow label="Organization" value={certificate.issuer.organization} />
        <ResultRow label="Country" value={certificate.issuer.country} />
      </ResultCard>

      {/* Technical Details */}
      <ResultCard
        title="Technical Details"
        icon={
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        }
      >
        <ResultRow label="Serial Number" value={certificate.serialNumber} />
        <ResultRow label="Version" value={`v${certificate.version}`} />
        {certificate.bits && <ResultRow label="Key Size" value={`${certificate.bits} bits`} />}
        {certificate.signatureAlgorithm && <ResultRow label="Signature Algorithm" value={certificate.signatureAlgorithm} />}
      </ResultCard>

      {/* Fingerprints */}
      <ResultCard
        title="Fingerprints"
        icon={
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        }
      >
        <div className="py-2 border-b border-dark-700">
          <span className="text-slate-400 text-sm">SHA-1</span>
          <p className="text-slate-200 font-mono text-xs mt-1 break-all">{certificate.fingerprint}</p>
        </div>
        <div className="py-2">
          <span className="text-slate-400 text-sm">SHA-256</span>
          <p className="text-slate-200 font-mono text-xs mt-1 break-all">{certificate.fingerprint256}</p>
        </div>
      </ResultCard>

      {/* Subject Alternative Names */}
      {certificate.altNames && certificate.altNames.length > 0 && (
        <ResultCard
          title="Subject Alternative Names (SANs)"
          icon={
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          }
        >
          <div className="flex flex-wrap gap-2">
            {certificate.altNames.map((name, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded font-mono">
                {name}
              </span>
            ))}
          </div>
        </ResultCard>
      )}
    </div>
  )
}

export default SslResult

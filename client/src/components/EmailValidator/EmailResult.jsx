import { ResultCard, ResultRow, ResultBadge } from '../common/ResultCard'

function EmailResult({ data }) {
  const getValidityBadge = () => {
    if (data.valid) {
      return <ResultBadge value="Valid" type="success" />
    } else if (data.checks?.format === false) {
      return <ResultBadge value="Invalid Format" type="danger" />
    } else if (data.checks?.disposable) {
      return <ResultBadge value="Disposable" type="warning" />
    } else {
      return <ResultBadge value="Invalid" type="danger" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Overall Result */}
      <div className={`card border-2 ${data.valid ? 'border-green-500/50' : 'border-red-500/50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{data.email}</h3>
            <p className="text-slate-400 text-sm">{data.reason}</p>
          </div>
          <div className="text-right">
            {getValidityBadge()}
          </div>
        </div>

        {data.suggestion && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm">
              Did you mean: <span className="font-semibold">{data.suggestion}</span>?
            </p>
          </div>
        )}
      </div>

      {/* Validation Checks */}
      <ResultCard
        title="Validation Checks"
        icon={
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <CheckItem label="Format" passed={data.checks?.format} />
          <CheckItem label="MX Records" passed={data.checks?.mx} />
          <CheckItem label="Not Disposable" passed={!data.checks?.disposable} />
          <CheckItem label="Free Provider" passed={data.checks?.free} neutral />
        </div>
      </ResultCard>

      {/* Email Details */}
      <ResultCard
        title="Email Details"
        icon={
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <ResultRow label="Local Part" value={data.localPart} />
        <ResultRow label="Domain" value={data.domain} highlight />
        <ResultRow
          label="Deliverable"
          value={data.deliverable ? 'Yes' : 'No'}
        />
        <ResultRow
          label="Provider Type"
          value={data.checks?.free ? 'Free Email Provider' : 'Custom/Business Domain'}
        />
      </ResultCard>

      {/* MX Records */}
      {data.mxRecords && data.mxRecords.length > 0 && (
        <ResultCard
          title="MX Records"
          icon={
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          }
        >
          <div className="space-y-2">
            {data.mxRecords.map((mx, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-dark-700 last:border-0">
                <span className="text-slate-200 font-mono text-sm">{mx.host}</span>
                <span className="text-slate-500 text-xs">Priority: {mx.priority}</span>
              </div>
            ))}
          </div>
        </ResultCard>
      )}
    </div>
  )
}

function CheckItem({ label, passed, neutral = false }) {
  const getIcon = () => {
    if (neutral && passed) {
      return (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    if (passed) {
      return (
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
    return (
      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {getIcon()}
      <span className={`text-sm ${passed ? 'text-slate-200' : 'text-slate-400'}`}>{label}</span>
    </div>
  )
}

export default EmailResult

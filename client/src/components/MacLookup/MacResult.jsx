import { ResultCard, ResultRow, ResultBadge } from '../common/ResultCard'

function MacResult({ data }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ResultCard
        title="MAC Address"
        icon={
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        }
      >
        <ResultRow label="MAC Address" value={data.mac} highlight />
        <ResultRow label="Normalized" value={data.normalized} />
        <ResultRow label="OUI Prefix" value={data.vendor?.oui} />
        <div className="flex justify-between items-center py-1 border-b border-dark-700">
          <span className="text-slate-400">Valid</span>
          <ResultBadge
            value={data.valid ? 'Yes' : 'No'}
            type={data.valid ? 'success' : 'danger'}
          />
        </div>
      </ResultCard>

      <ResultCard
        title="Vendor Information"
        icon={
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
      >
        <ResultRow label="Vendor" value={data.vendor?.name || 'Unknown'} highlight />
        <ResultRow label="Address" value={data.vendor?.address} />
      </ResultCard>

      <ResultCard
        title="Address Type"
        icon={
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
      >
        <div className="flex justify-between items-center py-1 border-b border-dark-700">
          <span className="text-slate-400">Type</span>
          <ResultBadge
            value={data.type === 'unicast' ? 'Unicast' : 'Multicast'}
            type={data.type === 'unicast' ? 'success' : 'info'}
          />
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Administration</span>
          <ResultBadge
            value={data.local ? 'Locally Administered' : 'Universally Administered'}
            type={data.local ? 'warning' : 'default'}
          />
        </div>
      </ResultCard>
    </div>
  )
}

export default MacResult

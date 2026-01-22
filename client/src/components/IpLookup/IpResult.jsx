import { ResultCard, ResultRow, ResultBadge } from '../common/ResultCard'

function IpResult({ data }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ResultCard
        title="Location"
        icon={
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      >
        <ResultRow label="City" value={data.city} />
        <ResultRow label="Region" value={data.region} />
        <ResultRow label="Country" value={data.country} />
        <ResultRow label="Country Code" value={data.countryCode} />
        <ResultRow label="Timezone" value={data.timezone} />
        {data.location && (
          <ResultRow
            label="Coordinates"
            value={`${data.location.lat}, ${data.location.lng}`}
            highlight
          />
        )}
      </ResultCard>

      <ResultCard
        title="Network"
        icon={
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        }
      >
        <ResultRow label="IP Address" value={data.ip} highlight />
        <ResultRow label="Hostname" value={data.hostname} />
        <ResultRow label="ISP" value={data.isp} />
        <ResultRow label="Organization" value={data.org} />
        <ResultRow label="ASN" value={data.asn} />
      </ResultCard>

      <ResultCard
        title="Risk Assessment"
        icon={
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      >
        <div className="flex justify-between items-center py-1 border-b border-dark-700">
          <span className="text-slate-400">Proxy/VPN</span>
          <ResultBadge
            value={data.proxy ? 'Yes' : 'No'}
            type={data.proxy ? 'danger' : 'success'}
          />
        </div>
        <div className="flex justify-between items-center py-1 border-b border-dark-700">
          <span className="text-slate-400">Mobile</span>
          <ResultBadge
            value={data.mobile ? 'Yes' : 'No'}
            type={data.mobile ? 'info' : 'default'}
          />
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Hosting/Datacenter</span>
          <ResultBadge
            value={data.hosting ? 'Yes' : 'No'}
            type={data.hosting ? 'warning' : 'default'}
          />
        </div>
      </ResultCard>

      <ResultCard
        title="Query Info"
        icon={
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <ResultRow label="Query" value={data.query || data.ip} />
        <ResultRow label="Status" value={data.status || 'Success'} />
      </ResultCard>
    </div>
  )
}

export default IpResult

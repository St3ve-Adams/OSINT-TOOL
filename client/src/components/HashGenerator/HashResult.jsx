import { useState } from 'react'
import { ResultCard, ResultRow } from '../common/ResultCard'

function HashResult({ data }) {
  const [copied, setCopied] = useState(null)

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const HashRow = ({ label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0 gap-4">
      <span className="text-slate-400 shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-slate-200 font-mono text-xs truncate">{value}</span>
        <button
          onClick={() => copyToClipboard(value, label)}
          className="shrink-0 p-1 hover:bg-dark-600 rounded transition-colors"
          title="Copy to clipboard"
        >
          {copied === label ? (
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Input Info */}
      <ResultCard
        title="Input Information"
        icon={
          <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <ResultRow label="Text" value={data.input.text} />
        <ResultRow label="Length" value={`${data.input.length.toLocaleString()} characters`} />
        <ResultRow label="Size" value={`${data.input.bytes.toLocaleString()} bytes`} />
      </ResultCard>

      {/* Hash Values */}
      <ResultCard
        title="Hash Values"
        icon={
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      >
        {Object.entries(data.hashes).map(([algo, hash]) => (
          <HashRow key={algo} label={algo} value={hash} />
        ))}
      </ResultCard>

      {/* Encodings */}
      <ResultCard
        title="Encodings"
        icon={
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        }
      >
        <HashRow label="Base64" value={data.encodings.base64} />
        <HashRow label="URL Encoded" value={data.encodings.urlEncoded} />
      </ResultCard>

      {/* Quick Reference */}
      <div className="card">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-white">Hash Algorithm Info</span>
            </div>
            <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="mt-4 space-y-2 text-sm text-slate-400">
            <p><span className="text-slate-200">MD5:</span> 128-bit hash, fast but not secure for cryptographic purposes</p>
            <p><span className="text-slate-200">SHA1:</span> 160-bit hash, deprecated for security use</p>
            <p><span className="text-slate-200">SHA256:</span> 256-bit hash, widely used and secure</p>
            <p><span className="text-slate-200">SHA384:</span> 384-bit hash, stronger variant of SHA-2</p>
            <p><span className="text-slate-200">SHA512:</span> 512-bit hash, strongest SHA-2 variant</p>
          </div>
        </details>
      </div>
    </div>
  )
}

export default HashResult

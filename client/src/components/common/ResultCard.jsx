function ResultCard({ title, icon, children }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}

function ResultRow({ label, value, highlight = false }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-dark-700 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className={`font-medium ${highlight ? 'text-blue-400' : 'text-slate-200'}`}>
        {value || 'N/A'}
      </span>
    </div>
  )
}

function ResultBadge({ value, type = 'default' }) {
  const colors = {
    default: 'bg-slate-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500'
  }

  return (
    <span className={`${colors[type]} text-white text-xs font-medium px-2 py-1 rounded`}>
      {value}
    </span>
  )
}

export { ResultCard, ResultRow, ResultBadge }

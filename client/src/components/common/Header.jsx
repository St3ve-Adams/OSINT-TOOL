import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-dark-800 border-b border-dark-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xl font-bold text-white">OSINT Tools</span>
          </div>

          <nav className="flex items-center space-x-2">
            <NavLink
              to="/ip"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              IP Lookup
            </NavLink>
            <NavLink
              to="/mac"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              MAC Lookup
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              History
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

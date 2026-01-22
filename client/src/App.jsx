import { Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import IpLookup from './components/IpLookup/IpLookup'
import MacLookup from './components/MacLookup/MacLookup'
import History from './components/History/History'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<IpLookup />} />
          <Route path="/ip" element={<IpLookup />} />
          <Route path="/mac" element={<MacLookup />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

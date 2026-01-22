import { Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import IpLookup from './components/IpLookup/IpLookup'
import MacLookup from './components/MacLookup/MacLookup'
import WhoisLookup from './components/WhoisLookup/WhoisLookup'
import EmailValidator from './components/EmailValidator/EmailValidator'
import UsernameSearch from './components/UsernameSearch/UsernameSearch'
import DnsLookup from './components/DnsLookup/DnsLookup'
import HashGenerator from './components/HashGenerator/HashGenerator'
import HttpHeaders from './components/HttpHeaders/HttpHeaders'
import SslChecker from './components/SslChecker/SslChecker'
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
          <Route path="/whois" element={<WhoisLookup />} />
          <Route path="/email" element={<EmailValidator />} />
          <Route path="/username" element={<UsernameSearch />} />
          <Route path="/dns" element={<DnsLookup />} />
          <Route path="/hash" element={<HashGenerator />} />
          <Route path="/headers" element={<HttpHeaders />} />
          <Route path="/ssl" element={<SslChecker />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

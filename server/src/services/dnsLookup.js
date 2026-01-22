import dns from 'dns'
import { promisify } from 'util'

const resolve4 = promisify(dns.resolve4)
const resolve6 = promisify(dns.resolve6)
const resolveMx = promisify(dns.resolveMx)
const resolveTxt = promisify(dns.resolveTxt)
const resolveNs = promisify(dns.resolveNs)
const resolveCname = promisify(dns.resolveCname)
const resolveSoa = promisify(dns.resolveSoa)

// Validate domain format
function isValidDomain(domain) {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
  return domainRegex.test(domain)
}

async function safeResolve(resolver, domain) {
  try {
    return await resolver(domain)
  } catch {
    return null
  }
}

export async function lookupDns(domain) {
  // Clean and validate domain
  const cleanDomain = domain.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]

  if (!isValidDomain(cleanDomain)) {
    throw new Error('Invalid domain format')
  }

  // Resolve all record types in parallel
  const [aRecords, aaaaRecords, mxRecords, txtRecords, nsRecords, cnameRecords, soaRecord] = await Promise.all([
    safeResolve(resolve4, cleanDomain),
    safeResolve(resolve6, cleanDomain),
    safeResolve(resolveMx, cleanDomain),
    safeResolve(resolveTxt, cleanDomain),
    safeResolve(resolveNs, cleanDomain),
    safeResolve(resolveCname, cleanDomain),
    safeResolve(resolveSoa, cleanDomain)
  ])

  // Sort MX records by priority
  const sortedMx = mxRecords ? mxRecords.sort((a, b) => a.priority - b.priority) : null

  // Flatten TXT records (they come as arrays of arrays)
  const flatTxt = txtRecords ? txtRecords.map(arr => arr.join('')) : null

  return {
    domain: cleanDomain,
    records: {
      A: aRecords,
      AAAA: aaaaRecords,
      MX: sortedMx,
      TXT: flatTxt,
      NS: nsRecords,
      CNAME: cnameRecords,
      SOA: soaRecord
    },
    summary: {
      hasIPv4: !!(aRecords && aRecords.length > 0),
      hasIPv6: !!(aaaaRecords && aaaaRecords.length > 0),
      hasMail: !!(mxRecords && mxRecords.length > 0),
      recordCount: [aRecords, aaaaRecords, mxRecords, flatTxt, nsRecords, cnameRecords]
        .filter(r => r && r.length > 0).length
    },
    queriedAt: new Date().toISOString()
  }
}

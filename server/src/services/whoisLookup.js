import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Parse raw WHOIS text into structured data
function parseWhoisData(raw) {
  const lines = raw.split('\n')
  const data = {}

  const fieldMappings = {
    'domain name': 'domainName',
    'registrar': 'registrar',
    'registrar whois server': 'whoisServer',
    'registrar url': 'registrarUrl',
    'updated date': 'updatedDate',
    'creation date': 'creationDate',
    'registry expiry date': 'expiryDate',
    'registrar expiry date': 'expiryDate',
    'expiration date': 'expiryDate',
    'name server': 'nameServers',
    'nserver': 'nameServers',
    'dnssec': 'dnssec',
    'registrant name': 'registrantName',
    'registrant organization': 'registrantOrg',
    'registrant country': 'registrantCountry',
    'admin email': 'adminEmail',
    'tech email': 'techEmail',
    'registrar abuse contact email': 'abuseEmail',
    'registrar abuse contact phone': 'abusePhone',
    'status': 'status',
    'domain status': 'status'
  }

  const arrayFields = ['nameServers', 'status']

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.substring(0, colonIndex).trim().toLowerCase()
    const value = line.substring(colonIndex + 1).trim()

    if (!value) continue

    const mappedKey = fieldMappings[key]
    if (mappedKey) {
      if (arrayFields.includes(mappedKey)) {
        if (!data[mappedKey]) data[mappedKey] = []
        // For status, extract just the status code
        const cleanValue = mappedKey === 'status' ? value.split(' ')[0] : value
        if (!data[mappedKey].includes(cleanValue)) {
          data[mappedKey].push(cleanValue)
        }
      } else {
        data[mappedKey] = value
      }
    }
  }

  return data
}

// Validate domain format
function isValidDomain(domain) {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
  return domainRegex.test(domain)
}

export async function lookupWhois(domain) {
  // Clean and validate domain
  const cleanDomain = domain.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]

  if (!isValidDomain(cleanDomain)) {
    throw new Error('Invalid domain format')
  }

  try {
    // Use system whois command
    const { stdout } = await execAsync(`whois ${cleanDomain}`, {
      timeout: 15000,
      maxBuffer: 1024 * 1024
    })

    const parsed = parseWhoisData(stdout)

    return {
      domain: cleanDomain,
      available: stdout.toLowerCase().includes('no match') || stdout.toLowerCase().includes('not found'),
      raw: stdout.substring(0, 5000), // Limit raw output
      ...parsed,
      queriedAt: new Date().toISOString()
    }
  } catch (err) {
    if (err.killed) {
      throw new Error('WHOIS query timed out')
    }
    throw new Error(`WHOIS lookup failed: ${err.message}`)
  }
}

import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load OUI database
let ouiDatabase = {}
const ouiPath = join(__dirname, '../data/oui.json')

if (existsSync(ouiPath)) {
  try {
    ouiDatabase = JSON.parse(readFileSync(ouiPath, 'utf8'))
  } catch (err) {
    console.error('Failed to load OUI database:', err.message)
  }
}

// MAC address regex patterns
const MAC_PATTERNS = [
  /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,  // 00:1A:2B:3C:4D:5E or 00-1A-2B-3C-4D-5E
  /^([0-9A-Fa-f]{4}\.){2}([0-9A-Fa-f]{4})$/,     // 001A.2B3C.4D5E (Cisco format)
  /^[0-9A-Fa-f]{12}$/                             // 001A2B3C4D5E
]

export function validateMac(mac) {
  return MAC_PATTERNS.some(pattern => pattern.test(mac))
}

export function normalizeMac(mac) {
  // Remove all separators and convert to uppercase
  return mac.replace(/[:.\-]/g, '').toUpperCase()
}

export function formatMac(mac, separator = ':') {
  const normalized = normalizeMac(mac)
  return normalized.match(/.{1,2}/g)?.join(separator) || mac
}

export function lookupMac(mac) {
  if (!validateMac(mac)) {
    throw new Error('Invalid MAC address format')
  }

  const normalized = normalizeMac(mac)
  const oui = normalized.substring(0, 6)

  // Check if unicast or multicast (LSB of first byte)
  const firstByte = parseInt(normalized.substring(0, 2), 16)
  const isMulticast = (firstByte & 0x01) === 1
  const isLocal = (firstByte & 0x02) === 2

  // Lookup vendor
  const vendor = ouiDatabase[oui] || null

  return {
    mac: formatMac(mac),
    valid: true,
    normalized: normalized,
    vendor: vendor ? {
      name: vendor.name,
      address: vendor.address || null,
      oui: oui
    } : {
      name: 'Unknown',
      address: null,
      oui: oui
    },
    type: isMulticast ? 'multicast' : 'unicast',
    local: isLocal
  }
}

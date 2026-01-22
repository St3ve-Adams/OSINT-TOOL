import dns from 'dns'
import { promisify } from 'util'

const resolveMx = promisify(dns.resolveMx)

// Common disposable email domains
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', 'tempmail.com', 'throwaway.email', 'guerrillamail.com',
  'mailinator.com', 'temp-mail.org', 'fakeinbox.com', 'getnada.com',
  'dispostable.com', 'maildrop.cc', 'yopmail.com', 'trashmail.com',
  'sharklasers.com', 'guerrillamail.info', 'grr.la', 'spam4.me',
  'tempail.com', 'mohmal.com', 'tempinbox.com', 'emailondeck.com',
  'mintemail.com', 'tempr.email', 'discard.email', 'spamgourmet.com',
  'mytemp.email', 'throwawaymail.com', 'mailnesia.com', 'tempmailaddress.com',
  'burnermail.io', 'inboxalias.com', 'mailcatch.com', 'meltmail.com'
])

// Common free email providers
const FREE_PROVIDERS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
  'gmx.com', 'live.com', 'msn.com', 'me.com', 'inbox.com',
  'fastmail.com', 'tutanota.com', 'hey.com', 'pm.me', 'proton.me'
])

// Validate email format using RFC 5322 simplified regex
function isValidFormat(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email) && email.length <= 254
}

// Check for common typos in popular domains
function detectTypo(domain) {
  const typoMap = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'hotmal.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'outloo.com': 'outlook.com',
    'outlok.com': 'outlook.com'
  }
  return typoMap[domain.toLowerCase()] || null
}

export async function validateEmail(email) {
  const cleanEmail = email.toLowerCase().trim()

  // Basic format validation
  if (!isValidFormat(cleanEmail)) {
    return {
      email: cleanEmail,
      valid: false,
      reason: 'Invalid email format',
      checks: {
        format: false,
        mx: false,
        disposable: false,
        free: false
      }
    }
  }

  const [localPart, domain] = cleanEmail.split('@')

  // Check for typos
  const suggestedDomain = detectTypo(domain)

  // Check if disposable
  const isDisposable = DISPOSABLE_DOMAINS.has(domain)

  // Check if free provider
  const isFreeProvider = FREE_PROVIDERS.has(domain)

  // MX record check
  let hasMx = false
  let mxRecords = []

  try {
    const records = await resolveMx(domain)
    if (records && records.length > 0) {
      hasMx = true
      mxRecords = records
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 5)
        .map(r => ({ host: r.exchange, priority: r.priority }))
    }
  } catch (err) {
    // MX lookup failed - domain might not exist
    hasMx = false
  }

  const isValid = hasMx && !isDisposable

  return {
    email: cleanEmail,
    valid: isValid,
    deliverable: hasMx,
    reason: !hasMx ? 'No MX records found' : (isDisposable ? 'Disposable email detected' : 'Valid email'),
    localPart,
    domain,
    checks: {
      format: true,
      mx: hasMx,
      disposable: isDisposable,
      free: isFreeProvider
    },
    mxRecords,
    suggestion: suggestedDomain ? `${localPart}@${suggestedDomain}` : null,
    queriedAt: new Date().toISOString()
  }
}

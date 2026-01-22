import https from 'https'
import tls from 'tls'

// Validate domain format
function isValidDomain(domain) {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
  return domainRegex.test(domain)
}

function getCertificateInfo(host, port = 443) {
  return new Promise((resolve, reject) => {
    const options = {
      host,
      port,
      servername: host,
      rejectUnauthorized: false // Allow inspection of invalid certs
    }

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate(true)
      const authorized = socket.authorized
      const authError = socket.authorizationError

      socket.end()

      if (!cert || Object.keys(cert).length === 0) {
        reject(new Error('No certificate found'))
        return
      }

      resolve({ cert, authorized, authError })
    })

    socket.setTimeout(10000)
    socket.on('timeout', () => {
      socket.destroy()
      reject(new Error('Connection timed out'))
    })

    socket.on('error', (err) => {
      reject(err)
    })
  })
}

function parseCertificate(cert, authorized, authError) {
  const now = new Date()
  const validFrom = new Date(cert.valid_from)
  const validTo = new Date(cert.valid_to)
  const daysRemaining = Math.floor((validTo - now) / (1000 * 60 * 60 * 24))

  // Parse subject and issuer
  const parseFields = (obj) => {
    if (!obj) return {}
    return {
      commonName: obj.CN || null,
      organization: obj.O || null,
      organizationalUnit: obj.OU || null,
      country: obj.C || null,
      state: obj.ST || null,
      locality: obj.L || null
    }
  }

  // Get SAN (Subject Alternative Names)
  const altNames = cert.subjectaltname
    ? cert.subjectaltname.split(', ').map(name => name.replace('DNS:', ''))
    : []

  return {
    subject: parseFields(cert.subject),
    issuer: parseFields(cert.issuer),
    validity: {
      validFrom: validFrom.toISOString(),
      validTo: validTo.toISOString(),
      daysRemaining,
      isExpired: now > validTo,
      isNotYetValid: now < validFrom,
      isValid: now >= validFrom && now <= validTo
    },
    serialNumber: cert.serialNumber,
    fingerprint: cert.fingerprint,
    fingerprint256: cert.fingerprint256,
    altNames,
    bits: cert.bits || null,
    publicKeyAlgorithm: cert.asn1Curve || 'RSA',
    signatureAlgorithm: cert.sigalg || null,
    version: cert.version,
    authorized,
    authorizationError: authError || null
  }
}

export async function checkSsl(domain) {
  // Clean domain
  const cleanDomain = domain.toLowerCase().trim()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .split('/')[0]
    .split(':')[0]

  if (!isValidDomain(cleanDomain)) {
    throw new Error('Invalid domain format')
  }

  try {
    const { cert, authorized, authError } = await getCertificateInfo(cleanDomain)
    const certInfo = parseCertificate(cert, authorized, authError)

    // Determine overall status
    let status = 'valid'
    let statusMessage = 'Certificate is valid and trusted'

    if (!authorized) {
      status = 'warning'
      statusMessage = authError || 'Certificate not trusted'
    }
    if (certInfo.validity.isExpired) {
      status = 'expired'
      statusMessage = 'Certificate has expired'
    }
    if (certInfo.validity.isNotYetValid) {
      status = 'invalid'
      statusMessage = 'Certificate is not yet valid'
    }
    if (certInfo.validity.daysRemaining <= 30 && certInfo.validity.daysRemaining > 0) {
      status = 'expiring'
      statusMessage = `Certificate expires in ${certInfo.validity.daysRemaining} days`
    }

    return {
      domain: cleanDomain,
      status,
      statusMessage,
      certificate: certInfo,
      chain: cert.issuerCertificate ? {
        hasChain: true,
        issuer: parseFields(cert.issuerCertificate.subject)
      } : { hasChain: false },
      queriedAt: new Date().toISOString()
    }
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      throw new Error('Domain not found')
    }
    if (err.code === 'ECONNREFUSED') {
      throw new Error('Connection refused - SSL might not be enabled')
    }
    throw new Error(`SSL check failed: ${err.message}`)
  }
}

function parseFields(obj) {
  if (!obj) return null
  return {
    commonName: obj.CN || null,
    organization: obj.O || null,
    country: obj.C || null
  }
}

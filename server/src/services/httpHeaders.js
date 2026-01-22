import axios from 'axios'

// Validate URL format
function isValidUrl(string) {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// Categorize security headers
function analyzeSecurityHeaders(headers) {
  const securityHeaders = {
    'strict-transport-security': {
      name: 'Strict-Transport-Security (HSTS)',
      description: 'Enforces secure HTTPS connections',
      importance: 'high'
    },
    'content-security-policy': {
      name: 'Content-Security-Policy',
      description: 'Prevents XSS and injection attacks',
      importance: 'high'
    },
    'x-frame-options': {
      name: 'X-Frame-Options',
      description: 'Prevents clickjacking attacks',
      importance: 'medium'
    },
    'x-content-type-options': {
      name: 'X-Content-Type-Options',
      description: 'Prevents MIME type sniffing',
      importance: 'medium'
    },
    'x-xss-protection': {
      name: 'X-XSS-Protection',
      description: 'Legacy XSS filter (deprecated but still used)',
      importance: 'low'
    },
    'referrer-policy': {
      name: 'Referrer-Policy',
      description: 'Controls referrer information',
      importance: 'medium'
    },
    'permissions-policy': {
      name: 'Permissions-Policy',
      description: 'Controls browser features',
      importance: 'medium'
    },
    'x-permitted-cross-domain-policies': {
      name: 'X-Permitted-Cross-Domain-Policies',
      description: 'Controls Flash/PDF cross-domain access',
      importance: 'low'
    }
  }

  const present = []
  const missing = []

  for (const [header, info] of Object.entries(securityHeaders)) {
    const value = headers[header]
    if (value) {
      present.push({ ...info, header, value })
    } else {
      missing.push({ ...info, header })
    }
  }

  return { present, missing }
}

export async function fetchHeaders(url) {
  // Add protocol if missing
  let targetUrl = url.trim()
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl
  }

  if (!isValidUrl(targetUrl)) {
    throw new Error('Invalid URL format')
  }

  try {
    const response = await axios({
      method: 'HEAD',
      url: targetUrl,
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true, // Accept any status
      headers: {
        'User-Agent': 'OSINT-Tool/1.0 (Header Analyzer)'
      }
    })

    const headers = response.headers
    const security = analyzeSecurityHeaders(headers)

    // Calculate security score
    const maxScore = security.present.length + security.missing.length
    const score = Math.round((security.present.length / maxScore) * 100)

    return {
      url: targetUrl,
      finalUrl: response.request?.res?.responseUrl || targetUrl,
      statusCode: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(
        Object.entries(headers).map(([k, v]) => [k, v])
      ),
      security: {
        score,
        grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F',
        present: security.present,
        missing: security.missing
      },
      server: {
        software: headers['server'] || 'Not disclosed',
        poweredBy: headers['x-powered-by'] || 'Not disclosed'
      },
      caching: {
        cacheControl: headers['cache-control'] || null,
        expires: headers['expires'] || null,
        etag: headers['etag'] || null,
        lastModified: headers['last-modified'] || null
      },
      queriedAt: new Date().toISOString()
    }
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      throw new Error('Domain not found')
    }
    if (err.code === 'ECONNREFUSED') {
      throw new Error('Connection refused')
    }
    if (err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
      throw new Error('Request timed out')
    }
    throw new Error(`Failed to fetch headers: ${err.message}`)
  }
}

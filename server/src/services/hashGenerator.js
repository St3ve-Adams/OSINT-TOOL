import crypto from 'crypto'

const SUPPORTED_ALGORITHMS = ['md5', 'sha1', 'sha256', 'sha384', 'sha512']

function generateHash(text, algorithm) {
  return crypto.createHash(algorithm).update(text, 'utf8').digest('hex')
}

export function generateHashes(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input: text is required')
  }

  if (text.length > 100000) {
    throw new Error('Input too large: maximum 100,000 characters')
  }

  const hashes = {}
  for (const algo of SUPPORTED_ALGORITHMS) {
    hashes[algo.toUpperCase()] = generateHash(text, algo)
  }

  // Also generate some common encoding variations
  const base64 = Buffer.from(text).toString('base64')
  const urlEncoded = encodeURIComponent(text)

  return {
    input: {
      text: text.length > 100 ? text.substring(0, 100) + '...' : text,
      length: text.length,
      bytes: Buffer.byteLength(text, 'utf8')
    },
    hashes,
    encodings: {
      base64,
      urlEncoded: urlEncoded.length > 200 ? urlEncoded.substring(0, 200) + '...' : urlEncoded
    },
    generatedAt: new Date().toISOString()
  }
}

export function verifyHash(text, hash, algorithm) {
  const algo = algorithm.toLowerCase()
  if (!SUPPORTED_ALGORITHMS.includes(algo)) {
    throw new Error(`Unsupported algorithm: ${algorithm}. Supported: ${SUPPORTED_ALGORITHMS.join(', ')}`)
  }

  const computed = generateHash(text, algo)
  return {
    algorithm: algo.toUpperCase(),
    inputHash: hash.toLowerCase(),
    computedHash: computed,
    match: hash.toLowerCase() === computed
  }
}

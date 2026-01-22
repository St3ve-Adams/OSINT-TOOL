import axios from 'axios'

// Platform configurations for username checking
const PLATFORMS = [
  {
    name: 'GitHub',
    category: 'development',
    url: 'https://github.com/{username}',
    checkUrl: 'https://api.github.com/users/{username}',
    method: 'api',
    icon: 'github'
  },
  {
    name: 'Twitter/X',
    category: 'social',
    url: 'https://twitter.com/{username}',
    checkUrl: 'https://twitter.com/{username}',
    method: 'http',
    icon: 'twitter'
  },
  {
    name: 'Instagram',
    category: 'social',
    url: 'https://instagram.com/{username}',
    checkUrl: 'https://www.instagram.com/{username}/',
    method: 'http',
    icon: 'instagram'
  },
  {
    name: 'Reddit',
    category: 'social',
    url: 'https://reddit.com/user/{username}',
    checkUrl: 'https://www.reddit.com/user/{username}/about.json',
    method: 'api',
    icon: 'reddit'
  },
  {
    name: 'TikTok',
    category: 'social',
    url: 'https://tiktok.com/@{username}',
    checkUrl: 'https://www.tiktok.com/@{username}',
    method: 'http',
    icon: 'tiktok'
  },
  {
    name: 'YouTube',
    category: 'social',
    url: 'https://youtube.com/@{username}',
    checkUrl: 'https://www.youtube.com/@{username}',
    method: 'http',
    icon: 'youtube'
  },
  {
    name: 'LinkedIn',
    category: 'professional',
    url: 'https://linkedin.com/in/{username}',
    checkUrl: 'https://www.linkedin.com/in/{username}',
    method: 'http',
    icon: 'linkedin'
  },
  {
    name: 'Pinterest',
    category: 'social',
    url: 'https://pinterest.com/{username}',
    checkUrl: 'https://www.pinterest.com/{username}/',
    method: 'http',
    icon: 'pinterest'
  },
  {
    name: 'Twitch',
    category: 'gaming',
    url: 'https://twitch.tv/{username}',
    checkUrl: 'https://www.twitch.tv/{username}',
    method: 'http',
    icon: 'twitch'
  },
  {
    name: 'Steam',
    category: 'gaming',
    url: 'https://steamcommunity.com/id/{username}',
    checkUrl: 'https://steamcommunity.com/id/{username}',
    method: 'http',
    icon: 'steam'
  },
  {
    name: 'Medium',
    category: 'blogging',
    url: 'https://medium.com/@{username}',
    checkUrl: 'https://medium.com/@{username}',
    method: 'http',
    icon: 'medium'
  },
  {
    name: 'GitLab',
    category: 'development',
    url: 'https://gitlab.com/{username}',
    checkUrl: 'https://gitlab.com/{username}',
    method: 'http',
    icon: 'gitlab'
  },
  {
    name: 'Dribbble',
    category: 'design',
    url: 'https://dribbble.com/{username}',
    checkUrl: 'https://dribbble.com/{username}',
    method: 'http',
    icon: 'dribbble'
  },
  {
    name: 'Behance',
    category: 'design',
    url: 'https://behance.net/{username}',
    checkUrl: 'https://www.behance.net/{username}',
    method: 'http',
    icon: 'behance'
  },
  {
    name: 'Spotify',
    category: 'music',
    url: 'https://open.spotify.com/user/{username}',
    checkUrl: 'https://open.spotify.com/user/{username}',
    method: 'http',
    icon: 'spotify'
  },
  {
    name: 'SoundCloud',
    category: 'music',
    url: 'https://soundcloud.com/{username}',
    checkUrl: 'https://soundcloud.com/{username}',
    method: 'http',
    icon: 'soundcloud'
  }
]

// Validate username format
function isValidUsername(username) {
  // Most platforms allow alphanumeric, underscore, and sometimes hyphen/dot
  const usernameRegex = /^[a-zA-Z0-9._-]{1,39}$/
  return usernameRegex.test(username)
}

// Check a single platform
async function checkPlatform(platform, username) {
  const url = platform.checkUrl.replace('{username}', username)

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      maxRedirects: 3,
      validateStatus: (status) => status < 500,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    })

    // 200 = found, 404 = not found
    const found = response.status === 200

    return {
      platform: platform.name,
      category: platform.category,
      found,
      url: found ? platform.url.replace('{username}', username) : null,
      icon: platform.icon
    }
  } catch (err) {
    // Timeout or network error - mark as unknown
    return {
      platform: platform.name,
      category: platform.category,
      found: null,
      url: null,
      icon: platform.icon,
      error: 'Check failed'
    }
  }
}

export async function searchUsername(username) {
  const cleanUsername = username.trim()

  if (!isValidUsername(cleanUsername)) {
    throw new Error('Invalid username format. Use only letters, numbers, dots, underscores, or hyphens (1-39 chars)')
  }

  // Check all platforms concurrently
  const results = await Promise.all(
    PLATFORMS.map(platform => checkPlatform(platform, cleanUsername))
  )

  // Organize results
  const found = results.filter(r => r.found === true)
  const notFound = results.filter(r => r.found === false)
  const errors = results.filter(r => r.found === null)

  // Group by category
  const byCategory = {}
  for (const result of results) {
    if (!byCategory[result.category]) {
      byCategory[result.category] = []
    }
    byCategory[result.category].push(result)
  }

  return {
    username: cleanUsername,
    summary: {
      found: found.length,
      notFound: notFound.length,
      errors: errors.length,
      total: results.length
    },
    results,
    byCategory,
    queriedAt: new Date().toISOString()
  }
}

export function getPlatforms() {
  return PLATFORMS.map(p => ({
    name: p.name,
    category: p.category,
    icon: p.icon
  }))
}

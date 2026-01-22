import axios from 'axios'

const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
const IPV6_REGEX = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^([0-9a-fA-F]{1,4}:){1,7}:$|^:([0-9a-fA-F]{1,4}:){1,7}$/

export function validateIp(ip) {
  return IP_REGEX.test(ip) || IPV6_REGEX.test(ip)
}

export async function lookupIp(ip) {
  // Use ip-api.com (free, no API key required)
  const response = await axios.get(`http://ip-api.com/json/${ip}`, {
    params: {
      fields: 'status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,mobile,hosting,query'
    },
    timeout: 5000
  })

  const data = response.data

  if (data.status === 'fail') {
    throw new Error(data.message || 'Invalid IP address')
  }

  return {
    ip: data.query,
    hostname: null, // ip-api doesn't provide hostname
    city: data.city,
    region: data.regionName,
    country: data.country,
    countryCode: data.countryCode,
    location: {
      lat: data.lat,
      lng: data.lon
    },
    timezone: data.timezone,
    isp: data.isp,
    org: data.org,
    asn: data.as,
    proxy: data.proxy,
    mobile: data.mobile,
    hosting: data.hosting,
    status: 'success'
  }
}

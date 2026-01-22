# OSINT Web Application - Project Plan

## Overview

A web-based OSINT (Open Source Intelligence) tool providing IP Address Lookup and MAC Address Search functionality with a clean, user-friendly interface.

---

## Features

### 1. IP Address Lookup
- **Geolocation**: Country, region, city, coordinates
- **Network Info**: ISP, ASN, organization
- **Timezone**: Local time at IP location
- **Risk Assessment**: Proxy/VPN/Tor detection, abuse reports
- **Reverse DNS**: Hostname resolution

### 2. MAC Address Lookup
- **Vendor Identification**: Manufacturer name and details
- **OUI Database**: IEEE OUI registry lookup
- **Device Type**: Estimated device category
- **MAC Validation**: Format verification (EUI-48/EUI-64)

### 3. Search History
- Store all lookups locally in SQLite
- View past searches with timestamps
- Clear history option
- No user authentication required

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 | UI components and state management |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Backend** | Node.js + Express | REST API server |
| **Database** | SQLite (better-sqlite3) | Search history storage |
| **Rate Limiting** | express-rate-limit | API abuse protection |
| **HTTP Client** | Axios | External API calls |
| **Build Tool** | Vite | Frontend bundling |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                   React + Tailwind CSS                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  IP Lookup  │  │ MAC Lookup  │  │   Search History    │  │
│  │    Page     │  │    Page     │  │       Page          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/REST
┌─────────────────────────▼───────────────────────────────────┐
│                        Backend                               │
│                   Node.js + Express                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  Rate Limiter                            ││
│  │            (100 requests/15 min per IP)                  ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ /api/ip     │  │ /api/mac    │  │   /api/history      │  │
│  │  lookup     │  │  lookup     │  │      CRUD           │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  External APIs  │ │  Local OUI DB   │ │     SQLite      │
│  - ip-api.com   │ │  (MAC vendors)  │ │    Database     │
│  - ipinfo.io    │ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## Project Structure

```
OSINT-TOOL/
├── client/                    # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── SearchInput.jsx
│   │   │   │   └── ResultCard.jsx
│   │   │   ├── IpLookup/
│   │   │   │   ├── IpLookup.jsx
│   │   │   │   └── IpResult.jsx
│   │   │   ├── MacLookup/
│   │   │   │   ├── MacLookup.jsx
│   │   │   │   └── MacResult.jsx
│   │   │   └── History/
│   │   │       └── History.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── ip.js
│   │   │   ├── mac.js
│   │   │   └── history.js
│   │   ├── services/
│   │   │   ├── ipLookup.js
│   │   │   └── macLookup.js
│   │   ├── middleware/
│   │   │   └── rateLimiter.js
│   │   ├── database/
│   │   │   ├── db.js
│   │   │   └── schema.sql
│   │   ├── data/
│   │   │   └── oui.json       # MAC vendor database
│   │   └── index.js
│   └── package.json
│
├── render.yaml                # Render.com deployment config
├── package.json               # Root package.json (monorepo scripts)
├── plan.md
└── README.md
```

---

## API Endpoints

### IP Lookup
```
GET /api/ip/:address
```
**Response:**
```json
{
  "ip": "8.8.8.8",
  "hostname": "dns.google",
  "city": "Mountain View",
  "region": "California",
  "country": "United States",
  "countryCode": "US",
  "location": {
    "lat": 37.4056,
    "lng": -122.0775
  },
  "timezone": "America/Los_Angeles",
  "isp": "Google LLC",
  "org": "Google Public DNS",
  "asn": "AS15169",
  "proxy": false,
  "mobile": false,
  "hosting": true
}
```

### MAC Lookup
```
GET /api/mac/:address
```
**Response:**
```json
{
  "mac": "00:1A:2B:3C:4D:5E",
  "valid": true,
  "normalized": "001A2B3C4D5E",
  "vendor": {
    "name": "Cisco Systems, Inc",
    "address": "San Jose, CA, US",
    "oui": "001A2B"
  },
  "type": "unicast",
  "local": false
}
```

### History
```
GET    /api/history              # Get all history (paginated)
GET    /api/history?type=ip      # Filter by lookup type
DELETE /api/history              # Clear all history
DELETE /api/history/:id          # Delete single entry
```

---

## Database Schema

```sql
CREATE TABLE search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,           -- 'ip' or 'mac'
    query TEXT NOT NULL,          -- The searched value
    result TEXT NOT NULL,         -- JSON result
    client_ip TEXT,               -- Requester's IP (for analytics)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_history_type ON search_history(type);
CREATE INDEX idx_history_created ON search_history(created_at DESC);
```

---

## External APIs & Data Sources

### IP Address Lookup
| Service | Free Tier | Fields |
|---------|-----------|--------|
| **ip-api.com** | 45 req/min | Geo, ISP, proxy detection |
| **ipinfo.io** | 50k/month | Geo, ASN, company |
| **ipapi.co** | 30k/month | Geo, currency, languages |

**Primary**: ip-api.com (no API key needed, generous limits)
**Fallback**: ipapi.co

### MAC Address Lookup
- **IEEE OUI Database**: Official vendor registry (downloaded locally)
- Source: https://standards-oui.ieee.org/oui/oui.csv
- Updated monthly via scheduled job

---

## Rate Limiting Strategy

```javascript
// Global rate limit
{
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: { error: "Too many requests, please try again later" }
}

// Per-endpoint limits
/api/ip/*   : 30 requests / 15 min
/api/mac/*  : 50 requests / 15 min
/api/history: 100 requests / 15 min
```

---

## Render.com Deployment

### render.yaml
```yaml
services:
  # Backend API
  - type: web
    name: osint-api
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000

  # Frontend (Static Site)
  - type: web
    name: osint-frontend
    env: static
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: client/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### Environment Variables
```
NODE_ENV=production
PORT=10000
DATABASE_PATH=/var/data/osint.db
CORS_ORIGIN=https://osint-frontend.onrender.com
```

---

## UI/UX Design

### Color Scheme (Dark Theme)
- Background: `#0f172a` (slate-900)
- Cards: `#1e293b` (slate-800)
- Primary: `#3b82f6` (blue-500)
- Success: `#22c55e` (green-500)
- Error: `#ef4444` (red-500)
- Text: `#f8fafc` (slate-50)

### Layout
```
┌──────────────────────────────────────────────────────┐
│  🔍 OSINT Tools            [IP] [MAC] [History]      │  <- Header/Nav
├──────────────────────────────────────────────────────┤
│                                                      │
│    ┌────────────────────────────────────────────┐   │
│    │  🌐 IP Address Lookup                       │   │
│    │  ┌────────────────────────┐  ┌──────────┐  │   │
│    │  │ Enter IP address...    │  │  Search  │  │   │
│    │  └────────────────────────┘  └──────────┘  │   │
│    └────────────────────────────────────────────┘   │
│                                                      │
│    ┌────────────────────────────────────────────┐   │
│    │  Results                                    │   │
│    │  ┌─────────────┐  ┌─────────────────────┐  │   │
│    │  │  Location   │  │       Map           │  │   │
│    │  │  City: ...  │  │     [Leaflet]       │  │   │
│    │  │  Country:   │  │                     │  │   │
│    │  └─────────────┘  └─────────────────────┘  │   │
│    │  ┌─────────────┐  ┌─────────────────────┐  │   │
│    │  │  Network    │  │    Risk Info        │  │   │
│    │  │  ISP: ...   │  │    Proxy: No        │  │   │
│    │  │  ASN: ...   │  │    VPN: No          │  │   │
│    │  └─────────────┘  └─────────────────────┘  │   │
│    └────────────────────────────────────────────┘   │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Built with ❤️  |  Rate Limited  |  Open Source      │  <- Footer
└──────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Project Setup
- [ ] Initialize project structure
- [ ] Set up React + Vite frontend
- [ ] Set up Express backend
- [ ] Configure Tailwind CSS
- [ ] Set up SQLite database

### Phase 2: Backend API
- [ ] Implement IP lookup service
- [ ] Implement MAC lookup service
- [ ] Create API routes
- [ ] Add rate limiting middleware
- [ ] Set up history endpoints

### Phase 3: Frontend UI
- [ ] Create layout components (Header, Footer)
- [ ] Build IP Lookup page
- [ ] Build MAC Lookup page
- [ ] Build History page
- [ ] Add responsive design

### Phase 4: Integration & Polish
- [ ] Connect frontend to backend
- [ ] Add loading states & error handling
- [ ] Add input validation
- [ ] Implement map visualization (optional)
- [ ] Write README documentation

### Phase 5: Deployment
- [ ] Configure render.yaml
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Render
- [ ] Test production environment
- [ ] Set up monitoring

---

## Security Considerations

1. **Input Validation**: Sanitize all IP/MAC inputs
2. **Rate Limiting**: Prevent API abuse
3. **CORS**: Restrict origins in production
4. **No Sensitive Data**: No auth = no user data to protect
5. **Dependency Auditing**: Regular `npm audit`

---

## Future Enhancements (v2)

- [ ] DNS Lookup tool
- [ ] WHOIS Lookup tool
- [ ] Email validation tool
- [ ] Username search tool
- [ ] Export results (JSON/CSV)
- [ ] API key system for higher limits
- [ ] Dark/Light theme toggle

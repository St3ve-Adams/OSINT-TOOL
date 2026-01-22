# OSINT Tools

A web-based OSINT (Open Source Intelligence) application for IP address and MAC address lookups.

## Features

- **IP Address Lookup**: Geolocation, ISP, ASN, proxy/VPN detection
- **MAC Address Lookup**: Vendor identification via IEEE OUI database
- **Search History**: Track and review past lookups
- **Rate Limiting**: API abuse protection

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install all dependencies
npm run install:all
```

### Development

```bash
# Run both frontend and backend in development mode
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Deployment

This project is configured for deployment on Render.com.

1. Connect your GitHub repository to Render
2. Select "Blueprint" deployment
3. Render will use the `render.yaml` configuration

## API Endpoints

### IP Lookup
```
GET /api/ip/:address
```

### MAC Lookup
```
GET /api/mac/:address
```

### History
```
GET    /api/history          # Get all history
GET    /api/history?type=ip  # Filter by type
DELETE /api/history/:id      # Delete single entry
DELETE /api/history          # Clear all history
```

## License

MIT

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install dependencies
RUN npm install --prefix server
RUN npm install --prefix client

# Copy source code
COPY server ./server
COPY client ./client

# Build frontend
RUN npm run build --prefix client

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000
ENV DATABASE_PATH=./server/data/osint.db

# Expose port
EXPOSE 10000

# Start server
WORKDIR /app/server
CMD ["npm", "start"]

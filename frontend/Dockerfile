FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY astro.config.mjs ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose Astro dev server port
EXPOSE 4321

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4321 || exit 1

# Start Astro dev server with host binding for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

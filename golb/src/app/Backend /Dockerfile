# Stage 1: install dependencies
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy all backend code
COPY . ./

# (Uncomment if you have a build step)
# RUN npm run build

# Stage 2: runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 5000

# Adjust this path if your server main is elsewhere
CMD ["node", "Server_Apis_DB/server.js"]

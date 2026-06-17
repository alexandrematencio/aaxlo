# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine AS production
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy built output
COPY --from=build /app/.output ./.output
COPY --from=build /app/package*.json ./

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

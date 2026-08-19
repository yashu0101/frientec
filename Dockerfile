# ---------------------------------------------------------------------------
#  Frientec — two stages: build the React app, then ship the server with it.
#
#  The JSON store is NOT in the image. Mount a volume and point DATA_DIR at it,
#  or every redeploy starts the catalogue over and loses the leads and orders.
# ---------------------------------------------------------------------------

# ---- build ----------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# the workspace manifests first, so a dependency-free code change reuses the layer
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN npm ci

COPY . .
RUN npm run build

# ---- runtime --------------------------------------------------------------
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV DATA_DIR=/data

COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
# --omit=dev drops vite and friends; the optional AI SDK still comes along, so
# setting ANTHROPIC_API_KEY is all it takes to turn drafting on
RUN npm ci --omit=dev && npm cache clean --force

COPY server ./server
COPY shared ./shared
COPY --from=build /app/client/dist ./client/dist

RUN mkdir -p /data
VOLUME ["/data"]
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||4000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/index.js"]

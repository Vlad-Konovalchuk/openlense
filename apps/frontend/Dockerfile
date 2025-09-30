# OpenLense Frontend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "preview", "--port", "3000"]

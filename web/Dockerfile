# Build stage
FROM node:20 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
# Update npm to latest version
RUN npm install -g npm@latest
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
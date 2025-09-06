# Chordik Deployment Guide

## Prerequisites
- Linux server with Docker and Docker Compose installed
- Domain name pointing to your server's IP

## Step 1: Prepare the server
```bash
# Create deployment directory
mkdir -p ~/chordik-deploy && cd ~/chordik-deploy

# Create directory for PostgreSQL data
mkdir pgdata
```

## Step 2: Create configuration files
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  web:
    image: ghcr.io/supercakecrumb/chordik/web:latest
    restart: always
    environment:
      - API_BASE_URL=http://api:8080
    networks:
      - chordik-net

  api:
    image: ghcr.io/supercakecrumb/chordik/server:latest
    restart: always
    environment:
      - DB_HOST=db
      - DB_USER=postgres
      - DB_PASSWORD=your_secure_password
      - DB_NAME=chordik
      - DB_PORT=5432
      - JWT_SECRET=your_jwt_secret
    networks:
      - chordik-net
    command: sh -c "/app/migrate && /app/api"

  db:
    image: postgres:15
    restart: always
    volumes:
      - ./pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=your_secure_password
      - POSTGRES_DB=chordik
    networks:
      - chordik-net

networks:
  chordik-net:
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://web:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://api:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Step 3: Deploy the application
```bash
# Log in to GitHub Container Registry
echo $GHCR_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Start the services
docker compose up -d

# If migrations weren't applied automatically, run them manually:
docker compose exec api /app/migrate
```

## Step 4: Set up Nginx reverse proxy
1. Install Nginx on your server
2. Copy `nginx.conf` to `/etc/nginx/sites-available/chordik`
3. Create symlink:
   ```bash
   sudo ln -s /etc/nginx/sites-available/chordik /etc/nginx/sites-enabled/
   ```
4. Test and reload Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Step 5: Set up SSL (optional but recommended)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Step 6: Configure environment variables
- Replace `your_secure_password` with a strong password
- Replace `your_jwt_secret` with a strong secret
- Replace `your-domain.com` with your actual domain
- Set `GHCR_TOKEN` as an environment variable with your GitHub Personal Access Token (with `read:packages` scope)

## Maintenance
- Update images: `docker compose pull && docker compose up -d --force-recreate`
- View logs: `docker compose logs -f`
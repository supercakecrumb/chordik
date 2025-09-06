# Docker Best Practices Implementation Plan

## Overview

This document outlines the implementation of Docker best practices for the Chordik application, focusing on clean separation of concerns between runtime and setup tasks.

## Architecture Changes

### 1. Dockerfile Improvements

**Before:** Complex startup script that handles seeding inside the container
**After:** Clean, minimal container that only runs the API

Key improvements:
- Updated Go version from non-existent 1.25 to 1.23.1
- Removed complex shell script logic
- Added non-root user (app) for security
- Optimized build with `-trimpath` and `-ldflags="-s -w"`
- Single responsibility: container only runs the API

### 2. Docker Compose Structure

The new structure separates concerns into distinct services:

```yaml
services:
  db:        # PostgreSQL database
  migrate:   # One-off container for migrations/seeding
  api:       # API server (depends on migrate completion)
  web:       # Frontend server
```

**Key Features:**
- `migrate` service runs once and exits after completion
- `api` service waits for `migrate` to complete successfully
- Proper health checks and dependencies
- Restart policies for production readiness

### 3. Migration Strategy

We need to separate migrations from the API startup. Here's the recommended approach:

#### Option A: Simple Approach (Current)
- Keep migrations in `seed.go` 
- Run as a one-off container
- Already idempotent (checks before creating)

#### Option B: Production Approach (Recommended)
Create separate binaries:
1. `cmd/migrate/main.go` - Handles schema migrations only
2. `scripts/seed.go` - Handles data seeding only
3. `cmd/api/main.go` - Remove migration logic, only run API

### 4. Deployment Workflows

#### Local Development
```bash
# Start everything
docker-compose up

# Run migrations/seeds manually if needed
docker-compose run --rm migrate

# Rebuild after changes
docker-compose build
docker-compose up --force-recreate
```

#### Production Deployment
```bash
# Build image
docker build -t myapp:latest ./server

# Run migrations (one-off)
docker run --rm \
  -e DB_HOST=prod-db \
  -e DB_USER=prod-user \
  -e DB_PASSWORD=prod-pass \
  myapp:latest /app/seed

# Deploy API (multiple instances)
docker run -d \
  -e DB_HOST=prod-db \
  -e DB_USER=prod-user \
  -e DB_PASSWORD=prod-pass \
  -p 8080:8080 \
  myapp:latest /app/api
```

#### Kubernetes Example
```yaml
# Migration Job
apiVersion: batch/v1
kind: Job
metadata:
  name: chordik-migrate
spec:
  template:
    spec:
      restartPolicy: OnFailure
      containers:
      - name: migrate
        image: chordik:latest
        command: ["/app/seed"]
        env:
        - name: DB_HOST
          value: postgres-service
        # ... other env vars

# API Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chordik-api
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: chordik:latest
        command: ["/app/api"]
        env:
        - name: DB_HOST
          value: postgres-service
        # ... other env vars
```

## Implementation Steps

### Step 1: Update API Code (Requires Code Mode)
Remove migration logic from `cmd/api/main.go`:
```go
// Remove these lines:
// if err := db.Migrate(database.DB); err != nil {
//     log.Fatalf("Failed to run migrations: %v", err)
// }
```

### Step 2: Create Migration Tool (Optional, Requires Code Mode)
Create `cmd/migrate/main.go` for dedicated migration handling:
```go
package main

import (
    "log"
    "os"
    "github.com/supercakecrumb/chordik/internal/db"
)

func main() {
    database, err := db.NewPostgresConnection(
        os.Getenv("DB_HOST"),
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_NAME"),
        os.Getenv("DB_PORT"),
    )
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }

    if err := db.Migrate(database.DB); err != nil {
        log.Fatalf("Failed to run migrations: %v", err)
    }

    log.Println("Migrations completed successfully")
}
```

### Step 3: Update Dockerfile to Build Migration Tool (Optional)
Add to Dockerfile:
```dockerfile
RUN go build -trimpath -ldflags="-s -w" -o /out/migrate ./cmd/migrate
COPY --from=builder /out/migrate /app/migrate
```

## Benefits of This Approach

1. **Scalability**: API containers can scale without re-running migrations
2. **Safety**: Migrations run once, controlled and predictable
3. **Flexibility**: Easy to run migrations separately in CI/CD
4. **Debugging**: Clear separation makes issues easier to diagnose
5. **Production-ready**: Follows industry best practices

## Testing the New Setup

1. Clean up old containers and volumes:
   ```bash
   docker-compose down -v
   ```

2. Build and start:
   ```bash
   docker-compose build
   docker-compose up
   ```

3. Verify migration ran:
   - Check logs: `docker-compose logs migrate`
   - Should see "Database seeded successfully"

4. Verify API is running:
   - Check health: `curl http://localhost:8080/api/health`
   - Login with admin/admin

## Next Steps

1. Switch to Code mode to implement the code changes
2. Consider adding golang-migrate for versioned migrations
3. Add environment-specific compose files (docker-compose.prod.yml)
4. Implement proper secrets management for production
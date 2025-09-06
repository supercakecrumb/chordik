# Build stage
FROM golang:1.23.1-alpine AS builder

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

COPY . .
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64
RUN go build -trimpath -ldflags="-s -w" -o /out/api ./cmd/api
RUN go build -trimpath -ldflags="-s -w" -o /out/seed ./scripts/seed.go
RUN go build -trimpath -ldflags="-s -w" -o /out/migrate ./cmd/migrate

# Runtime stage
FROM alpine:3.20
RUN apk --no-cache add ca-certificates && adduser -D -u 10001 app
WORKDIR /app

COPY --from=builder /out/api /app/api
COPY --from=builder /out/seed /app/seed
COPY --from=builder /out/migrate /app/migrate
RUN chown app:app /app/api /app/seed /app/migrate
RUN chmod +x /app/api /app/seed /app/migrate

USER app
EXPOSE 8080

# Default command runs the API only
CMD ["/app/api"]
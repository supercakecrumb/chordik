# Chordik

A modern chord sheet viewer with a trans flag theme, built with React, TypeScript, and Go.

## Features

- Dark mode interface with trans flag color scheme
- Chord sheet rendering with tight line spacing
- Modern UI components (buttons, cards, inputs)
- Song creation and editing
- User authentication
- Responsive design

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Go (Gin framework)
- **Database**: SQLite
- **Deployment**: Docker

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Go (for local development)

### Running with Docker

```bash
# Clone the repository
git clone <repository-url>
cd chordik

# Start the application
docker-compose up
```

The application will be available at http://localhost:3000

### Local Development

#### Backend

```bash
cd server
go run cmd/api/main.go
```

#### Frontend

```bash
cd web
npm install
npm run dev
```

## Project Structure

```
.
├── server/          # Go backend
│   ├── cmd/         # Application entry points
│   ├── internal/    # Internal packages
│   └── db/          # Database files
├── web/             # React frontend
│   ├── src/         # Source code
│   └── public/      # Static assets
└── docker-compose.yml
```

## Design System

Chordik uses a custom design system with:

- **Color Palette**: Dark theme with trans flag accents
- **Typography**: Inter for UI, JetBrains Mono for chord sheets
- **Components**: Reusable UI components in `web/src/components/ui`

## API Base URL Configuration

The application supports multiple ways to configure the API base URL:

### Build-time Configuration
Set the `VITE_API_BASE_URL` environment variable when building the frontend:
```bash
VITE_API_BASE_URL=https://api.example.com npm run build
```

In Docker builds, use the build argument:
```bash
docker build --build-arg VITE_API_BASE_URL=https://api.example.com -t my-chordik .
```

### Runtime Configuration
The application loads configuration from `/env.js` at runtime. To override the API base URL:
1. Create a file at `web/public/env.js`:
```javascript
window.__ENV = {
  API_BASE_URL: 'https://api.example.com'
};
```
2. Rebuild the application or replace the file in the deployed version

### Configuration Precedence
1. Runtime override (`window.__ENV.API_BASE_URL`)
2. Build-time environment variable (`VITE_API_BASE_URL`)
3. Default value (`/api`)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.
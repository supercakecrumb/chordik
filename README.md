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

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.
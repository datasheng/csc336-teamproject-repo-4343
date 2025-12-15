# Ticketr Docker Setup Guide

## Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Set up environment variables

Create a `.env` file in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Start all services

```bash
docker-compose up
```

This will:
- Start MySQL database on port 3306
- Start Flask backend on port 5000
- Start React frontend on port 3000
- Initialize the database with TicketR_data.sql

### 3. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Database**: localhost:3306

## Common Docker Commands

### View running containers
```bash
docker-compose ps
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Stop services
```bash
docker-compose stop
```

### Stop and remove containers
```bash
docker-compose down
```

### Remove all data (including database)
```bash
docker-compose down -v
```

### Rebuild images
```bash
docker-compose up --build
```

### Rebuild specific service
```bash
docker-compose up --build backend
docker-compose up --build frontend
```

## Database Access

### Connect to MySQL from host
```bash
mysql -h localhost -u ticketr_user -p ticketr
# Password: ticketr_password
```

### Connect to MySQL from inside container
```bash
docker-compose exec mysql mysql -u ticketr_user -p ticketr
```

## Troubleshooting

### Port already in use
If ports 3000, 5000, or 3306 are already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change 3000 to another port
  - "5001:5000"  # Change 5000 to another port
  - "3307:3306"  # Change 3306 to another port
```

### Database connection issues
Ensure MySQL service is healthy:
```bash
docker-compose logs mysql
```

### Frontend can't connect to backend
Check if backend is running:
```bash
docker-compose logs backend
```

The frontend uses `http://localhost:5000/api` by default. If running on a different machine, update `REACT_APP_API_URL` in docker-compose.yml.

## Production Deployment

For production, consider:

1. Using separate Dockerfiles for production builds
2. Adding environment-specific configuration
3. Using a reverse proxy (nginx)
4. Adding SSL/TLS certificates
5. Using environment variables for sensitive data
6. Setting up proper logging and monitoring

## File Structure

```
Ticketr/
├── docker-compose.yml          # Orchestration file
├── Frontend/
│   ├── Dockerfile              # Frontend image definition
│   ├── .dockerignore           # Files to exclude from image
│   └── ... (React app files)
├── backend/
│   ├── Dockerfile              # Backend image definition
│   ├── .dockerignore           # Files to exclude from image
│   └── ... (Flask app files)
└── TicketR_data.sql            # Database initialization script
```

## Notes

- The database is automatically initialized with `TicketR_data.sql` on first run
- Volumes are used for data persistence and development file syncing
- Services communicate through a custom bridge network (`ticketr_network`)
- The `depends_on` directive ensures proper startup order

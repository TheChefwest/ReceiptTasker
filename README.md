# ReceiptTasker

A web-based task scheduler and thermal printer system for automated receipt printing. Manage recurring tasks and events with automatic thermal printer output.

## Features

- **Task Management**: Create, edit, and delete tasks with rich descriptions
- **Recurring Events**: Support for RFC 5545 RRULE recurrence patterns (daily, weekly, monthly, etc.)
- **Thermal Printing**: Automatic printing to ESC/POS thermal printers via network
- **Calendar View**: Visual calendar interface using FullCalendar
- **Web Interface**: Modern React frontend with Tailwind CSS
- **API**: RESTful FastAPI backend with OpenAPI documentation
- **Containerized**: Docker deployment with docker-compose

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Thermal printer with network connectivity (ESC/POS compatible)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ReceiptTasker
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Environment Variables**
   ```env
   TZ=Europe/Amsterdam
   PRINTER_IP=192.168.2.34
   PRINTER_PORT=9100
   API_BASE=/api
   ```

4. **Start the application**
   ```bash
   docker-compose up -d
   ```

5. **Access the application**
   - Web Interface: http://localhost:5173
   - API Documentation: http://localhost:8000/docs

## Development

### Development Scripts

The `scripts/` directory contains helper scripts:

- `dev-up.sh` - Start development environment
- `dev-down.sh` - Stop development environment  
- `dev-build.sh` - Rebuild development containers
- `release.sh <tag>` - Build and push release images

### Local Development

**Backend (FastAPI + Python)**
```bash
cd backend/app
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend (React + TypeScript)**
```bash
cd frontend
npm install
npm run dev
```

## Architecture

### Backend Stack
- **FastAPI**: Modern Python web framework
- **SQLModel**: SQL database ORM with Pydantic integration
- **APScheduler**: Advanced Python Scheduler for recurring tasks
- **python-escpos**: ESC/POS thermal printer library
- **SQLite**: Embedded database (data persisted in Docker volumes)

### Frontend Stack
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **FullCalendar**: Calendar component for event visualization
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API communication

### Key Components

**Task Model** (`backend/app/models.py`)
```python
class Task:
    title: str              # Task title
    description: str        # Task description
    start_at: datetime      # When to first run/print
    until: datetime         # Optional end to recurrence
    rrule: str             # RFC 5545 RRULE string
    auto_print: bool       # Whether to auto-print when due
    is_active: bool        # Whether task is active
    last_fired_at: datetime # Last execution time
```

**Scheduling System** (`backend/app/scheduling.py`)
- Uses APScheduler with background jobs
- Processes RRULE recurrence patterns
- Handles timezone-aware scheduling
- Prevents duplicate job scheduling

**Printing System** (`backend/app/printing.py`)
- Network-based ESC/POS thermal printing
- Formatted receipts with title, timestamp, description
- Configurable printer IP and port

## API Endpoints

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PATCH /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `POST /api/tasks/{id}/print` - Manually print task

### Utilities
- `GET /api/health` - Health check and system info
- `GET /api/print-test` - Test printer connectivity
- `POST /api/import` - Bulk import tasks

## Recurrence Patterns

ReceiptTasker supports RFC 5545 RRULE patterns:

```
FREQ=DAILY;INTERVAL=1          # Every day
FREQ=WEEKLY;BYDAY=MO,WE,FR     # Monday, Wednesday, Friday
FREQ=MONTHLY;BYMONTHDAY=1      # First day of each month
FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25  # Christmas Day
```

## Deployment

### Docker Compose (Recommended)

```yaml
services:
  receipttasker:
    image: chefwest/receipttasker:latest
    ports:
      - "8000:8000"
    environment:
      - TZ=Europe/Amsterdam
      - PRINTER_IP=192.168.2.34
      - PRINTER_PORT=9100
    volumes:
      - receipttasker_data:/data
    restart: unless-stopped

volumes:
  receipttasker_data:
```

### Single Container

```bash
docker run -d \
  --name receipttasker \
  -p 8000:8000 \
  -e TZ=Europe/Amsterdam \
  -e PRINTER_IP=192.168.2.34 \
  -e PRINTER_PORT=9100 \
  -v receipttasker_data:/data \
  chefwest/receipttasker:latest
```

## Printer Setup

### Supported Printers
- Any ESC/POS compatible thermal printer with network connectivity
- Tested with common 58mm and 80mm thermal receipt printers

### Network Configuration
1. Configure printer for network printing (usually via printer settings)
2. Set static IP address for reliable connectivity
3. Ensure printer is accessible on port 9100 (or configure custom port)
4. Test connectivity: `telnet <printer-ip> 9100`

### Troubleshooting
- Use `/api/print-test` endpoint to verify printer connectivity
- Check printer IP and port configuration
- Ensure printer is powered on and connected to network
- Verify firewall settings allow connection to printer port

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TZ` | `Europe/Amsterdam` | Timezone for scheduling |
| `PRINTER_IP` | `192.168.2.34` | Thermal printer IP address |
| `PRINTER_PORT` | `9100` | Thermal printer port |
| `API_BASE` | `/api` | API base path for frontend |

### Database

- SQLite database stored in `/data/` directory
- Automatically created on first run
- Persisted via Docker volumes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions:
1. Check the API documentation at `/docs`
2. Use `/api/health` for system diagnostics
3. Check Docker logs for error details
4. Verify printer connectivity with `/api/print-test`
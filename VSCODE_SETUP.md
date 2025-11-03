# TaleTrail - VS Code Development Setup

## Quick Start Guide

### Prerequisites
- Node.js installed
- Python 3.x installed
- MySQL database running (or use SKIP_DB_TEST=true for frontend-only testing)

### 1. Start Backend Server

Open a new PowerShell terminal in VS Code and run:

```powershell
cd backend
$Env:SKIP_DB_TEST='true'
$Env:PORT='3000'
npm start
```

Backend will be available at: **http://localhost:3000**

### 2. Start ML Service

#### Option A: Full ML Service (requires database)
Open another PowerShell terminal and run:

```powershell
cd ml-service
.\.venv\Scripts\python.exe app.py
```

#### Option B: Mock ML Service (for frontend testing without database)
```powershell
cd ml-service
.\.venv\Scripts\python.exe mock_server.py
```

ML Service will be available at: **http://localhost:5000**

### 3. Open Frontend

- Open `frontend/index.html` in your browser
- Or use VS Code Live Server extension

## Verify Services

Run this in PowerShell to check both services:

```powershell
# Check backend
Invoke-RestMethod -Uri 'http://localhost:3000/api/health' -UseBasicParsing

# Check ML service
Invoke-RestMethod -Uri 'http://localhost:5000/health' -UseBasicParsing
```

## VS Code Tasks (Recommended)

Use the integrated tasks in `.vscode/tasks.json` to start both services with one click.

### Run Both Services at Once

Press `Ctrl+Shift+P` → Type "Run Task" → Select "Start All Services"

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use: `netstat -ano | findstr :3000`
- Make sure you're in the `backend` directory
- Run `npm install` if dependencies are missing

### ML Service won't start
- Verify Python venv exists: `ml-service\.venv`
- If not, create it: `python -m venv .venv`
- Install dependencies: `.\.venv\Scripts\pip.exe install -r requirements.txt`
- Use mock server for frontend testing: `python mock_server.py`

### Frontend not connecting
- Check `frontend/js/config.js` - ensure URLs match:
  - `API_BASE_URL: 'http://localhost:3000/api'`
  - `ML_API_URL: 'http://localhost:5000'`
- Verify both backend and ML service are running
- Check browser console for CORS errors

## Environment Variables

### Backend (.env file in backend/)
```env
PORT=3000
SKIP_DB_TEST=true
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=taletrail_db
JWT_SECRET=your_secret_key
```

### ML Service (.env file in ml-service/)
```env
FLASK_PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=taletrail_db
```

## API Endpoints

### Backend (http://localhost:3000/api)
- `GET /health` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /books` - Get all books
- `GET /countries` - Get all countries
- `GET /recommendations` - Get recommendations

### ML Service (http://localhost:5000)
- `GET /health` - Health check
- `GET /recommendations/user/<user_id>` - User recommendations
- `GET /recommendations/similar/<book_id>` - Similar books
- `GET /recommendations/trending` - Trending books
- `GET /recommendations/genre/<genre>` - Genre-based recommendations

## Development Tips

1. **Keep terminals open**: Each service needs its own terminal
2. **Use VS Code tasks**: Configure tasks.json for one-click startup
3. **Database optional**: Use SKIP_DB_TEST=true and mock ML service for frontend work
4. **Hot reload**: Backend uses nodemon in dev mode for auto-restart
5. **Frontend refresh**: Browser auto-refresh with Live Server extension

## Migration from Windsurf

All your previous work is preserved. The setup is identical - just use VS Code terminals instead of Windsurf terminals. Your code, database, and configuration remain unchanged.

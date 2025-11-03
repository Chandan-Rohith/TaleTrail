# ML Service Setup Guide

## Quick Setup (Using Existing Backend Database)

The ML service uses the **same database** as your backend (`taletrail_db`).

### Step 1: Copy Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cd ml-service
copy .env.example .env
```

### Step 2: Update `.env` File

Make sure the database credentials in `ml-service/.env` **match** your `backend/.env`:

```env
# ML Service Environment Variables
FLASK_PORT=5001
FLASK_ENV=development

# Database Configuration (MUST match backend/.env)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=panduorange
DB_NAME=taletrail_db

# Main API URL (Backend API)
API_BASE_URL=http://localhost:5000
```

### Step 3: Install Python Dependencies

```bash
cd ml-service
pip install -r requirements.txt
```

### Step 4: Start the ML Service

```bash
python app.py
```

The service will start on `http://localhost:5001`

### Step 5: Test the Endpoints

Run the test script:

```bash
python test_recommendations.py
```

Or test manually:

```bash
# Health check
curl http://localhost:5001/health

# Get recommendations for user 1
curl http://localhost:5001/recommendations/user/1?limit=10

# Get trending books
curl http://localhost:5001/recommendations/trending?limit=10
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                  │
│                  localhost:3000                     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              Backend API (Node.js)                  │
│                  localhost:5000                     │
│                                                     │
│  Routes:                                            │
│  - /api/books                                       │
│  - /api/auth                                        │
│  - /api/recommendations ──────────┐                │
└──────────────────────┬─────────────┼────────────────┘
                       │             │
                       │             │ (proxies to ML)
                       │             │
                       ▼             ▼
┌─────────────────────────────────────────────────────┐
│           MySQL Database (taletrail_db)             │
│                                                     │
│  Tables:                                            │
│  - books, users, ratings                            │
│  - user_interactions, countries                     │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ (reads data)
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│         ML Service (Python/Flask)                   │
│              localhost:5001                         │
│                                                     │
│  Endpoints:                                         │
│  - /recommendations/user/<id>                       │
│  - /recommendations/trending                        │
│  - /recommendations/similar/<id>                    │
│  - /recommendations/genre/<genre>                   │
└─────────────────────────────────────────────────────┘
```

## Integration with Backend

The backend can call the ML service endpoints to get recommendations:

```javascript
// In backend/routes/recommendations.js
const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

router.get('/user/:userId', async (req, res) => {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/recommendations/user/${req.params.userId}?limit=10`
    );
    res.json(response.data);
  } catch (error) {
    console.error('ML Service error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});
```

## Troubleshooting

### "Database connection failed"
- Verify MySQL is running
- Check credentials in `.env` match `backend/.env`
- Ensure `taletrail_db` database exists

### "Empty recommendations"
- Database needs sample data
- Run `database/sample_data.sql` to add books and ratings
- Check if users have rated books

### "Port 5001 already in use"
- Change `FLASK_PORT` in `.env`
- Or stop the existing process using port 5001

## What's Next?

1. ✅ ML service is running and connected to your database
2. ✅ Test endpoints are available for verification
3. 🔄 Integrate with backend API (see `backend/routes/recommendations.js`)
4. 🔄 Test with real user data
5. 🔄 Deploy both services together

## Files Overview

- `app.py` - Flask application with API endpoints
- `recommendation_engine.py` - Core ML algorithms
- `test_recommendations.py` - Automated testing script
- `requirements.txt` - Python dependencies
- `.env` - Environment configuration (create from `.env.example`)

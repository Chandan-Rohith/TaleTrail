# ML Service Production Deployment Guide

## Overview
The ML service must be deployed separately and the backend needs to know its URL.

## Render Deployment Steps

### 1. Deploy ML Service on Render

1. **Create New Web Service:**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `TaleTrail` repository

2. **Configure Service:**
   ```
   Name: taletrail-ml-service
   Region: Same as backend (for low latency)
   Branch: main
   Root Directory: ml-service
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn --bind 0.0.0.0:$PORT app:app
   ```

3. **Add Environment Variables:**
   ```
   DB_HOST=<your-mysql-host>
   DB_PORT=3306
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   DB_NAME=taletrail_db
   FLASK_PORT=10000
   PORT=10000
   ```

4. **Install Gunicorn:**
   Add to `ml-service/requirements.txt`:
   ```
   gunicorn==21.2.0
   ```

### 2. Update Backend Environment

Once ML service is deployed (e.g., `https://taletrail-ml.onrender.com`):

1. **Go to Backend Service Settings on Render**
2. **Add Environment Variable:**
   ```
   ML_SERVICE_URL=https://taletrail-ml.onrender.com
   ```
3. **Redeploy Backend** (or it will auto-deploy)

### 3. Verify Integration

Test that backend can reach ML service:
```bash
# From backend logs, you should see:
🤖 Attempting ML recommendations for user 1
✅ ML Service returned 10 recommendations
```

If ML service is unavailable, backend will fallback to:
- Favorite-based recommendations
- Country/author similarity
- Popular books

## Local Development

For local development, both services should run:

```bash
# Terminal 1: Backend
cd backend
npm start
# Runs on http://localhost:3000

# Terminal 2: ML Service
cd ml-service
.\.venv\Scripts\python.exe app.py
# Runs on http://localhost:5001
```

Backend will automatically use `http://localhost:5001` if `ML_SERVICE_URL` is not set.

## Architecture

```
┌─────────────┐
│   Frontend  │
│  (Static)   │
└──────┬──────┘
       │ API calls
       ↓
┌─────────────┐
│   Backend   │──────┐
│  (Node.js)  │      │ Reads/Writes
└──────┬──────┘      │
       │             ↓
       │      ┌─────────────┐
       │      │   MySQL     │
       │      │  Database   │
       │      └─────────────┘
       │ HTTP request          ↑
       │ (recommendations)     │ Reads
       ↓                       │
┌─────────────┐                │
│ ML Service  │────────────────┘
│  (Python)   │
└─────────────┘
```

## Troubleshooting

### ML Service Returns Empty Recommendations

**Cause:** User has no ratings yet (4-5 stars needed)

**Fix:** System automatically falls back to popular books

**Solution:** Rate some books first!

### Backend Can't Reach ML Service

**Symptoms:**
```
ML Service unavailable, trying favorite-based fallback: connect ECONNREFUSED
```

**Fixes:**
1. Check `ML_SERVICE_URL` environment variable is set correctly
2. Verify ML service is running and healthy: `curl <ML_SERVICE_URL>/health`
3. Check firewall/network settings allow backend → ML communication
4. Ensure both services are in same region (lower latency)

### ML Service Crashes on Startup

**Common Issues:**
1. **Database connection failed**
   - Check DB credentials in environment variables
   - Verify database is accessible from ML service

2. **Missing dependencies**
   - Run: `pip install -r requirements.txt`

3. **Port already in use**
   - Change `FLASK_PORT` environment variable

## Performance Optimization

### Cold Start Issues
ML service may take 30-60 seconds to start on Render free tier.

**Solution:**
- Upgrade to paid plan for instant startup
- Backend handles this gracefully with fallbacks

### Database Query Performance
ML service loads book data on startup (one-time cost).

**Current:** ~2-3 seconds startup time
**Optimization:** Add database indexes on commonly queried fields

### Recommendation Speed
After startup, recommendations are fast:
- Content-based: ~50-100ms
- Collaborative: ~100-200ms
- Combined: ~150-250ms

## Monitoring

### Health Checks

**Backend:**
```bash
curl http://localhost:3000/api/health
```

**ML Service:**
```bash
curl http://localhost:5001/health
```

### Logs to Watch

**Backend logs:**
```
🤖 Attempting ML recommendations for user 1
✅ ML Service returned 10 recommendations
```

**ML Service logs:**
```
✅ Content-based features prepared with genre emphasis
✅ Collaborative filtering model trained
✅ Data loaded successfully for ML recommendations
📚 User 1 likes these genres: Fiction, Fantasy, Romance
  ✨ Recommending 'Book Title' (genres: Fiction, Fantasy)
```

## Cost Considerations

### Render Free Tier
- ✅ Both services can run on free tier
- ⚠️ Services spin down after 15 min inactivity
- ⚠️ Cold start: 30-60 seconds

### Recommended Setup
- Backend: Starter plan ($7/mo) - Always on
- ML Service: Free tier - OK with fallbacks
- Database: Separate MySQL service

## Security

### Environment Variables (Never Commit!)
- ❌ `DB_PASSWORD`
- ❌ `JWT_SECRET`
- ✅ Use Render's environment variable feature

### API Security
- Backend uses JWT authentication
- ML service only accessible via backend
- No direct public access needed for ML service

## Future Enhancements

1. **Cache Recommendations**
   - Redis cache for frequently requested recommendations
   - Reduce database queries

2. **Batch Processing**
   - Pre-compute recommendations for active users
   - Store in database, serve instantly

3. **A/B Testing**
   - Test different weight combinations
   - Measure user engagement metrics

4. **Real-time Updates**
   - Retrain model periodically
   - Update when new ratings added

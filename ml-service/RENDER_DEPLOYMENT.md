# ML Service Deployment on Render

## Quick Deploy

### 1. Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `TaleTrail`
4. Configure:

```yaml
Name: taletrail-ml-service
Region: Choose nearest to your backend
Branch: main
Root Directory: ml-service
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: bash start.sh
```

### 2. Set Environment Variables

Add these in Render's Environment section:

```bash
# Flask Configuration
FLASK_PORT=5001
FLASK_DEBUG=false

# Database Configuration (same as backend)
DB_HOST=<your-mysql-host>
DB_PORT=3306
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_NAME=taletrail_db

# Optional
PYTHONUNBUFFERED=1
```

### 3. Update Backend Environment Variable

After ML service deploys, copy its URL (e.g., `https://taletrail-ml-service.onrender.com`)

Add to your **backend** service environment variables:

```bash
ML_SERVICE_URL=https://taletrail-ml-service.onrender.com
```

### 4. Verify Deployment

Test the ML service health endpoint:

```bash
curl https://taletrail-ml-service.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "🤖 TaleTrail ML Service is running!",
  "service": "recommendation-engine"
}
```

## Important Notes

### Cold Start
- Render free tier services spin down after inactivity
- First request after idle may take 30-60 seconds
- Backend handles this gracefully with fallback to trending books

### Database Connection
- ML service needs READ access to the same database as backend
- Ensure DB allows connections from Render's IP range
- Or use the same database connection string as backend

### Memory Requirements
- ML service loads models into memory
- Recommended: At least 512MB RAM
- Render's free tier provides 512MB (should be sufficient)

## Testing Content-Based Filtering

Once deployed, test the recommendations:

```bash
# Get user recommendations
curl https://taletrail-ml-service.onrender.com/recommendations/user/1?limit=5

# Get genre-based recommendations
curl https://taletrail-ml-service.onrender.com/recommendations/genre/Fantasy?limit=5

# Get trending books
curl https://taletrail-ml-service.onrender.com/recommendations/trending?limit=10
```

## Monitoring

Check ML service logs in Render dashboard to see:
- Content-based features loaded with genre emphasis ✅
- Collaborative filtering model trained ✅
- User genre preferences being analyzed
- Recommendation scores and genre overlaps

## Troubleshooting

### "ML service returned empty recommendations"

**Causes:**
1. User has no ratings yet → System shows trending books (expected)
2. ML service connection timeout → Backend falls back to SQL-based recommendations
3. Database connection issue → Check DB credentials in ML service env vars

**Solutions:**
1. Users need to rate at least 1 book with 4-5 stars
2. Increase backend timeout in `routes/recommendations.js` (currently 5000ms)
3. Verify ML service can connect to database

### Genre-Based Recommendations Not Working

**Check:**
1. `book_genre_relations` table has data
2. Books have genres assigned via SQL joins
3. ML service logs show "Content-based features prepared with genre emphasis ✅"

**Fix:**
```sql
-- Verify genre data exists
SELECT COUNT(*) FROM book_genre_relations;
SELECT COUNT(*) FROM book_genres;

-- If empty, run sample_data.sql
```

## Production Optimization

### For Better Performance:

1. **Use Paid Tier**: Prevents cold starts
2. **Increase Workers**: Change `start.sh`:
   ```bash
   --workers 4 \
   --threads 4 \
   ```
3. **Enable Persistent Storage**: Cache models (optional)
4. **Use Redis**: Cache frequent recommendations (advanced)

## Cost Estimate

- **Free Tier**: $0/month (with cold starts)
- **Starter**: $7/month (512MB RAM, no cold starts)
- **Standard**: $25/month (2GB RAM, recommended for production)

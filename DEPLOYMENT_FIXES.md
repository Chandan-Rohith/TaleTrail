# TaleTrail Deployment Fixes

## Issue: ERR_BLOCKED_BY_CLIENT on Render

**Problem:** Frontend was trying to connect to `localhost:3000` when deployed on Render, causing all API calls to fail.

## Solution Applied

### 1. ✅ Updated `frontend/js/config.js`

Changed from hardcoded localhost URLs to environment-aware configuration:

```javascript
// Before (broken on Render)
API_BASE_URL: 'http://localhost:3000/api',
ML_API_URL: 'http://localhost:5000',

// After (works everywhere)
API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://taletrail-backend-z2xb.onrender.com/api',
```

**How it works:**
- Detects if running locally (localhost/127.0.0.1)
- Uses `http://localhost:3000/api` for local development
- Uses `https://taletrail-backend-z2xb.onrender.com/api` for production (Render)

### 2. ✅ Backend CORS Already Configured

The backend (`backend/server.js`) already allows:
- `https://taletrail-frontend.onrender.com` ✅
- `http://localhost:3000` for development ✅

## Deployment Steps

### Deploy to Render (Frontend)

1. **Push changes to GitHub:**
   ```bash
   git add frontend/js/config.js
   git commit -m "Fix: Auto-detect API URLs for production deployment"
   git push origin main
   ```

2. **Render will auto-deploy** (if connected to GitHub)
   - Or manually trigger a redeploy in Render dashboard

3. **Clear browser cache and test:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private window

### Verify Backend is Running

Check your backend health:
```bash
curl https://taletrail-backend-z2xb.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "📚 TaleTrail API is running!"
}
```

## Testing After Deployment

1. **Open DevTools (F12)**
2. **Go to Console tab**
3. **Check Network tab** - API calls should now go to:
   - ✅ `https://taletrail-backend-z2xb.onrender.com/api/...`
   - ❌ NOT `http://localhost:3000/...`

## Common Issues & Solutions

### Issue: "CORS blocked"
**Solution:** Backend already allows your frontend domain. If you changed frontend URL, update `allowedOrigins` in `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://taletrail-frontend.onrender.com',
  'https://your-new-frontend-url.com'  // Add here
];
```

### Issue: "Backend not responding"
**Checklist:**
- [ ] Backend service is running on Render
- [ ] Backend environment variables are set (`DB_HOST`, `DB_PASSWORD`, etc.)
- [ ] Database is accessible from Render
- [ ] Backend health check passes: `https://your-backend.onrender.com/api/health`

### Issue: "Database connection failed"
**Solution:** Update backend environment variables on Render:
```bash
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=taletrail_db
JWT_SECRET=your-secret-key
```

### Issue: Still seeing localhost in Network tab
**Solution:**
1. Clear browser cache completely
2. Open incognito/private window
3. Force redeploy on Render
4. Check config.js was updated correctly

## Local Development Still Works

No changes needed for local development:
- Frontend detects `localhost` and uses `http://localhost:3000/api`
- Start backend: `cd backend && npm start`
- Open frontend: `http://localhost:5500` or with Live Server

## ML Service (Future)

When you deploy the ML service to Render:
1. Get the ML service URL (e.g., `https://taletrail-ml.onrender.com`)
2. Update `frontend/js/config.js`:
   ```javascript
   ML_API_URL: window.location.hostname === 'localhost' 
     ? 'http://localhost:5000'
     : 'https://your-ml-service.onrender.com',
   ```

## Summary

✅ Frontend auto-detects environment  
✅ Uses correct API URLs automatically  
✅ Works locally and on Render  
✅ No manual URL changes needed  
✅ Backend CORS already configured  

**Next:** Commit and push to trigger Render redeploy!

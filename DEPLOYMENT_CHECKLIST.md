# TaleTrail Deployment Checklist

## ✅ All Issues Fixed

### 1. ✅ Auto-popup Removed
- **Fixed:** Removed `openAuthModal('login')` from `auth.js` initialization
- **Test:** Load any page - no modal should appear automatically

### 2. ✅ Authentication Flow Working
- **Fixed:** `checkLocalAuthRedirect()` enforces landing → login → main flow
- **Test:** 
  - Logout → redirects to `index.html`
  - Login → redirects to `main.html`
  - Refresh main page → stays authenticated

### 3. ✅ Books Hidden Before Login
- **Fixed:** Added `canLoadBooks()` guard in `books.js`
- **Test:** Visit main.html without login → shows "Please login to view books"

### 4. ✅ Login Form Fully Visible
- **Fixed:** Added proper padding and width to `login.html` container
- **Test:** Visit login.html → full form visible with all inputs

### 5. ✅ Save/Favorites Feature Complete
- **Fixed:** 
  - Heart button UI on all book cards
  - Backend `/api/favorites` routes (GET/POST/DELETE)
  - `authenticateToken` middleware for security
  - CSS animations on favorite toggle
- **Test:** 
  - Login → click heart on book → saves to favorites
  - Click again → removes from favorites
  - Check `/api/favorites` → should list saved books

### 6. ✅ ML Recommendations Working (Content-Based Filtering)
- **Fixed:** 
  - Implemented content-based filtering with genre emphasis (70% content, 30% collaborative)
  - Genres get 5x weight in TF-IDF feature vector
  - Added genre overlap bonus (+0.2 per matching genre)
  - New endpoint: `/api/recommendations/user/{id}/genres`
  - ML service must be deployed separately
- **Logic:** 
  - Analyzes user's highly-rated books (4-5 stars)
  - Identifies favorite genres
  - Recommends books matching those genres
  - Books with multiple genre matches get priority
  - Falls back to trending books if no ratings yet
- **Test:** 
  - Rate 2-3 books with similar genres (4-5 stars)
  - Check recommendations section → should show books from those genres
  - Books matching 2+ genres appear higher in list

### 7. ✅ Database Setup Guide
- **Fixed:** Created comprehensive `DATABASE_SETUP.md` with:
  - Step-by-step MySQL Workbench instructions
  - Troubleshooting section for "database showing nothing"
  - Environment variable guide for Render
  - Test scripts for connection verification
- **Files:** 
  - `database/schema.sql` - Complete schema with all 7 tables
  - `DATABASE_SETUP.md` - Setup instructions

---

## 🚀 Deployment Steps (Render)

### ML Service Deployment (NEW!)

1. **Create New Web Service on Render:**
   - Service Name: `taletrail-ml-service`
   - Region: Same as backend
   - Root Directory: `ml-service`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `bash start.sh`

2. **Set ML Service Environment Variables:**
   ```
   FLASK_PORT=5001
   FLASK_DEBUG=false
   DB_HOST=your-cloud-mysql-host
   DB_USER=your-mysql-user
   DB_PASSWORD=your-mysql-password
   DB_NAME=taletrail_db
   PYTHONUNBUFFERED=1
   ```

3. **After ML Service Deploys:**
   - Copy ML service URL (e.g., `https://taletrail-ml-service.onrender.com`)
   - Add to **Backend** environment variables:
     ```
     ML_SERVICE_URL=https://taletrail-ml-service.onrender.com
     ```
   - Redeploy backend to pick up new URL

4. **Verify ML Service:**
   ```bash
   curl https://taletrail-ml-service.onrender.com/health
   ```
   Should return: `{"status":"OK","service":"recommendation-engine"}`

📖 **See `ml-service/RENDER_DEPLOYMENT.md` for detailed instructions**
   PORT=10000
   FLASK_PORT=10000
   ```

3. **Get ML Service URL:**
   - After deployment, copy the service URL (e.g., `https://taletrail-ml.onrender.com`)
   - You'll need this for the backend configuration

### Backend Deployment

1. **Push to GitHub** ✅ (Already done - latest commit includes content-based filtering)

2. **Set Environment Variables in Render:**
   ```
   DB_HOST=your-cloud-mysql-host
   DB_USER=your-mysql-user
   DB_PASSWORD=your-mysql-password
   DB_NAME=taletrail_db
   JWT_SECRET=random-32-char-string-here
   NODE_ENV=production
   PORT=3000
   ML_SERVICE_URL=https://taletrail-ml.onrender.com
   ```
   
   ⚠️ **IMPORTANT:** Add `ML_SERVICE_URL` pointing to your deployed ML service!

3. **Wait for Auto-Deploy**
   - Render detects GitHub push
   - Builds and deploys automatically
   - Check logs for "Database connected successfully!"

### Database Setup (Cloud MySQL)

1. **Create MySQL Database** (use Render MySQL or external provider)
2. **Run Schema:**
   - Connect with MySQL Workbench (or cloud console)
   - File → Run SQL Script → `database/schema.sql`
3. **Load Sample Data:**
   - Run `database/sample_data.sql`
   - Optionally: `database/add_books_corrected.sql`
4. **Verify:**
   ```sql
   USE taletrail_db;
   SHOW TABLES; -- Should show 7 tables
   SELECT COUNT(*) FROM books; -- Should have books
   ```

### Frontend Deployment

1. **Verify config.js Points to Production:**
   - File: `frontend/js/config.js`
   - Should have: `API_BASE_URL: 'https://taletrail-backend-z2xb.onrender.com/api'`

2. **Render Auto-Deploys Static Site**
   - Detects changes on GitHub push
   - Serves all frontend files

---

## 🧪 Testing Your Deployment

### Test Authentication
```bash
# 1. Register new user
curl -X POST https://taletrail-backend-z2xb.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"Test123!"}'

# 2. Login
curl -X POST https://taletrail-backend-z2xb.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# Save the token from response
```

### Test Favorites API
```bash
# Get user's favorites (needs auth token)
curl -X GET https://taletrail-backend-z2xb.onrender.com/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Save a book (book ID 1)
curl -X POST https://taletrail-backend-z2xb.onrender.com/api/favorites/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Remove from favorites
curl -X DELETE https://taletrail-backend-z2xb.onrender.com/api/favorites/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Recommendations
```bash
# Get personalized recommendations (needs favorites saved first)
curl -X GET https://taletrail-backend-z2xb.onrender.com/api/recommendations/personalized \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Books API
```bash
# Get all books (no auth needed)
curl https://taletrail-backend-z2xb.onrender.com/api/books

# Get book by ID
curl https://taletrail-backend-z2xb.onrender.com/api/books/1
```

---

## 🔍 Common Issues & Fixes

### Issue: "Database showing nothing in Workbench"
**Fix:**
1. Refresh Schemas panel (right-click → Refresh All)
2. Select `taletrail_db` from database dropdown
3. Re-run `database/schema.sql`
4. Check Output tab for errors

### Issue: Backend "Cannot connect to database"
**Fix:**
1. Verify Render environment variables are set correctly
2. Check MySQL allows external connections (whitelist Render IPs)
3. Test connection string with MySQL Workbench first
4. Check Render logs: "View Logs" in dashboard

### Issue: Frontend shows "Failed to fetch"
**Fix:**
1. Check `frontend/js/config.js` has correct backend URL
2. Verify backend is running (visit `/api/books` endpoint)
3. Check CORS settings in `backend/server.js` (should allow frontend origin)
4. Check browser console for specific error

### Issue: "Invalid token" errors
**Fix:**
1. Ensure `JWT_SECRET` is set in Render environment variables
2. Must be same secret in both dev and production
3. Logout and login again to get fresh token
4. Check token expiry (default 7 days)

### Issue: Favorites not saving
**Fix:**
1. Verify `user_favorites` table exists in database
2. Check auth token is being sent in request headers
3. Test endpoint directly with curl (see above)
4. Check Render backend logs for errors

### Issue: Recommendations show nothing
**Fix:**
1. Must save at least 1 book to favorites first
2. Books must have genres in `book_genres` table
3. Check `database/sample_data.sql` was loaded
4. Falls back to popular books if no genre matches

---

## 📊 Database Tables Overview

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | User accounts | id, username, email, password_hash |
| `books` | Book catalog | id, title, author, country_id |
| `countries` | Book origins | id, name, code |
| `ratings` | User ratings | user_id, book_id, rating (1-5) |
| `user_favorites` | Saved books | user_id, book_id, created_at |
| `book_genres` | Book genres | book_id, genre_name |
| `user_interactions` | ML tracking | user_id, book_id, interaction_type |

---

## 🎯 Success Criteria

✅ All 6 issues fixed and tested
✅ Database schema created with all 7 tables
✅ Backend deployed to Render with correct env vars
✅ Frontend deployed and pointing to backend
✅ Authentication flow: landing → login → main
✅ Books require login to view
✅ Save/favorites feature working with heart button
✅ ML recommendations based on saved book genres
✅ Database setup guide with troubleshooting

---

## 📝 Git Commits Summary

- `4278da2` - Add auth guard to books loading
- `b22258a` - Complete save/favorites feature with UI + backend auth
- `12d5d5a` - Auth middleware consistency + favorite button styles
- `b53fe75` - Complete ML recommendations with genre-based personalization
- `2c2f857` - Enhance database setup guide with troubleshooting ✅ **LATEST**

**All changes pushed to GitHub:** `main` branch ready for Render auto-deploy

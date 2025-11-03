# TaleTrail Recommendation Algorithm Improvements

## Summary of Changes

### 1. **Fixed Recommendation Algorithm** (`recommendation_engine.py`)

#### Improved Hybrid Recommendation System
- **Before**: Simple concatenation of content-based and collaborative filtering results
- **After**: Weighted hybrid approach that combines scores from both methods

#### Key Improvements:
- Added `content_weight` and `collab_weight` parameters (default: 0.6 and 0.4)
- Implemented score normalization and combination
- Better deduplication to avoid recommending books the user has already rated
- Improved fallback to trending books when insufficient recommendations

#### New Function: `get_recommendations_by_genre()`
- Get top-rated books filtered by genre
- Useful for genre-specific browsing and testing

### 2. **Enhanced API Endpoints** (`app.py`)

#### Updated Endpoint: `/recommendations/user/<user_id>`
**Query Parameters:**
- `limit` (int, default: 10) - Number of recommendations to return
- `content_weight` (float, default: 0.6) - Weight for content-based recommendations
- `collab_weight` (float, default: 0.4) - Weight for collaborative filtering

**Example:**
```bash
GET http://localhost:5001/recommendations/user/1?limit=10&content_weight=0.7&collab_weight=0.3
```

#### New Endpoint: `/recommendations/genre/<genre>`
**Query Parameters:**
- `limit` (int, default: 10) - Number of books to return

**Example:**
```bash
GET http://localhost:5001/recommendations/genre/fiction?limit=5
```

## Testing the Improvements

### Prerequisites
1. Ensure MySQL database is running with sample data
2. Configure `.env` file in `ml-service/` directory:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=taletrail_db
   FLASK_PORT=5001
   FLASK_ENV=development
   ```

### Start the ML Service
```bash
cd ml-service
python app.py
```

The service will start on `http://localhost:5001`

### Run Automated Tests
```bash
cd ml-service
python test_recommendations.py
```

This will test all endpoints and display results.

### Manual Testing with cURL

#### 1. Health Check
```bash
curl http://localhost:5001/health
```

#### 2. Get User Recommendations (Default Weights)
```bash
curl http://localhost:5001/recommendations/user/1?limit=10
```

#### 3. Get User Recommendations (Custom Weights)
```bash
curl "http://localhost:5001/recommendations/user/1?limit=10&content_weight=0.7&collab_weight=0.3"
```

#### 4. Get Trending Books
```bash
curl http://localhost:5001/recommendations/trending?limit=10&days=7
```

#### 5. Get Similar Books
```bash
curl http://localhost:5001/recommendations/similar/1?limit=5
```

#### 6. Get Genre Recommendations (NEW)
```bash
curl http://localhost:5001/recommendations/genre/fiction?limit=10
```

#### 7. Get Country Recommendations
```bash
curl http://localhost:5001/recommendations/country/US?limit=10
```

### Testing with Postman or Browser
Simply paste the URLs above into Postman or your browser to see JSON responses.

## Expected Response Format

### User Recommendations
```json
{
  "user_id": 1,
  "recommendations": [
    {
      "book_id": 42,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "country": "United States",
      "rating": 4.5,
      "final_score": 0.85,
      "recommendation_type": "content_based"
    }
  ],
  "total": 10
}
```

### Genre Recommendations
```json
{
  "genre": "fiction",
  "top_books": [
    {
      "book_id": 15,
      "title": "1984",
      "author": "George Orwell",
      "genre": "Fiction, Dystopian",
      "rating": 4.8,
      "description": "A dystopian social science fiction novel..."
    }
  ],
  "total": 5
}
```

## Algorithm Details

### Weighted Hybrid Approach

The improved algorithm combines two recommendation methods:

1. **Content-Based Filtering** (60% weight by default)
   - Uses TF-IDF vectorization on book titles, authors, descriptions, and countries
   - Calculates cosine similarity between books
   - Recommends books similar to those the user rated highly (≥4 stars)

2. **Collaborative Filtering** (40% weight by default)
   - Uses Non-negative Matrix Factorization (NMF) on user-book rating matrix
   - Predicts ratings for unrated books based on similar users' preferences
   - Recommends books with highest predicted ratings

3. **Score Combination**
   ```
   final_score = (similarity_score × content_weight) + (predicted_rating × collab_weight)
   ```

4. **Fallback Strategy**
   - If insufficient recommendations, fills with trending books
   - Trending books are based on recent interactions and ratings

## Database Requirements

The recommendation engine requires these tables:
- `books` - Book information with average_rating
- `ratings` - User ratings for books
- `user_interactions` - User engagement data
- `countries` - Country information for books

If you're getting empty results, ensure:
1. Database connection is configured correctly in `.env`
2. Sample data has been loaded (`database/sample_data.sql`)
3. There are ratings and interactions in the database

## Next Steps

1. **Test with Real Data**: Add sample users, books, and ratings to verify recommendations
2. **Tune Weights**: Experiment with different `content_weight` and `collab_weight` values
3. **Monitor Performance**: Check logs for any errors or warnings
4. **Integration**: Once satisfied, integrate with the main backend API

## Troubleshooting

### Empty Recommendations
- Check database connection
- Verify sample data is loaded
- Ensure user has rated some books
- Check Flask logs for errors

### Server Won't Start
- Verify Python dependencies: `pip install -r requirements.txt`
- Check port 5001 is not in use
- Verify `.env` file exists with correct values

### Database Connection Errors
- Verify MySQL is running
- Check credentials in `.env`
- Ensure `taletrail_db` database exists

## Files Modified

1. `ml-service/recommendation_engine.py` - Core algorithm improvements
2. `ml-service/app.py` - New and updated API endpoints
3. `ml-service/test_recommendations.py` - Automated testing script (NEW)
4. `ml-service/RECOMMENDATION_IMPROVEMENTS.md` - This documentation (NEW)

---

**Status**: ✅ Algorithm fixed and tested. All endpoints returning 200 OK.
**Ready for**: Integration testing with real data.

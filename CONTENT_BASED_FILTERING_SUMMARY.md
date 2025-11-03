# Content-Based Filtering Implementation Summary

## ✅ What Was Implemented

### 1. Genre-Based Content Filtering
The recommendation system has been upgraded to use **content-based filtering with heavy emphasis on book genres**.

### 2. Key Changes Made

#### A. `ml-service/recommendation_engine.py`

**Enhanced Data Loading:**
- Now loads book genres via SQL JOIN with `book_genres` and `book_genre_relations` tables
- Genres are concatenated as comma-separated strings (e.g., "Fiction, Romance, Historical Fiction")
- Added `genre_relations_df` for fast genre lookups

**Content Features with Genre Emphasis:**
```python
# Genres get 5x weight in the feature vector
self.books_df['combined_features'] = (
    self.books_df['genres'].fillna('').apply(lambda x: ' '.join([x] * 5)) + ' ' +
    self.books_df['title'].fillna('') + ' ' +
    self.books_df['author'].fillna('') + ' ' +
    self.books_df['description'].fillna('') + ' ' +
    self.books_df['country_name'].fillna('')
)
```

**Genre-Focused Recommendation Algorithm:**
```python
def get_content_based_recommendations(self, user_id, limit=10):
    # 1. Gets user's highly-rated books (4-5 stars)
    # 2. Identifies user's favorite genres
    # 3. Finds similar books using TF-IDF cosine similarity
    # 4. Adds genre overlap bonus (+0.2 per matching genre)
    # 5. Returns books sorted by similarity + genre bonus
```

**New Methods Added:**
- `get_books_by_genres(user_id, limit)` - Recommends books from user's favorite genres
- Enhanced `get_recommendations_by_genre(genre, limit, exclude_book_ids)` - Get top books in a genre
- Updated `get_user_recommendations()` - Now uses 70% content weight (up from 60%)

#### B. `ml-service/app.py`

**New API Endpoint:**
```python
GET /recommendations/user/{user_id}/genres
```
Returns recommendations based purely on the user's favorite genres.

**Updated Defaults:**
- Content weight: 0.7 (70%) - UP from 0.6
- Collaborative weight: 0.3 (30%) - DOWN from 0.4
- This prioritizes genre matching over collaborative filtering

**Fixed Debug Mode:**
- Disabled Flask auto-reloader (`use_reloader=False`)
- Fixed FLASK_DEBUG environment variable handling

#### C. Documentation

Created `ml-service/CONTENT_BASED_FILTERING.md` with:
- Complete explanation of the algorithm
- API endpoint documentation
- Example workflows
- Testing instructions
- Performance optimization details

Created `ml-service/test_content_based.py`:
- Test script to validate content-based filtering
- Shows recommendations for users
- Tests genre-based book retrieval

## 🎯 How It Works

### Algorithm Flow

1. **User Ratings Analysis**
   - System identifies books user rated 4-5 stars
   - Extracts genres from those books
   - Creates user's genre preference profile

2. **Similarity Calculation**
   - Uses TF-IDF vectorization with genre emphasis (5x weight)
   - Calculates cosine similarity between books
   - Adds genre overlap bonus: +0.2 per matching genre

3. **Recommendation Scoring**
   ```
   Final Score = (Content Similarity × 0.7) + (Genre Overlap × 0.15) + (Collaborative Rating × 0.3)
   ```

4. **Result Ranking**
   - Books sorted by final score
   - Duplicates removed
   - User's already-rated books excluded

### Example Scenario

**User's Ratings:**
- Harry Potter (Fantasy, Young Adult) → 5 stars
- Pride and Prejudice (Fiction, Romance) → 5 stars

**System's Analysis:**
- User likes: Fantasy, Young Adult, Fiction, Romance

**Recommendations (High to Low Priority):**
1. **"Twilight"** (Fantasy, Young Adult, Romance) → 3 genre matches = HIGH SCORE
2. **"The Lord of the Rings"** (Fantasy, Adventure) → 1 genre match = MEDIUM SCORE
3. **"Emma"** (Fiction, Romance) → 2 genre matches = MEDIUM-HIGH SCORE
4. **"The Chronicles of Narnia"** (Fantasy, Young Adult) → 2 genre matches = MEDIUM-HIGH SCORE

## 📊 Algorithm Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| **Content Weight** | 70% | How much genres/content matter |
| **Collaborative Weight** | 30% | How much similar users matter |
| **Genre Feature Weight** | 5x | Genres repeated 5 times in TF-IDF |
| **Genre Overlap Bonus** | +0.2 per genre | Extra score per matching genre |
| **Min Rating for Analysis** | 4 stars | Only considers liked books |

## 🚀 API Endpoints

### 1. Personalized Recommendations
```http
GET /recommendations/user/{user_id}?limit=10&content_weight=0.7&collab_weight=0.3
```

**Response:**
```json
{
  "user_id": 1,
  "recommendations": [
    {
      "book_id": 6,
      "title": "Harry Potter and the Philosopher's Stone",
      "author": "J.K. Rowling",
      "genres": "Fantasy, Young Adult",
      "rating": 4.4,
      "similarity_score": 0.85,
      "genre_overlap": 2,
      "recommendation_type": "content_based_genre"
    }
  ],
  "total": 10
}
```

### 2. Genre-Based Recommendations
```http
GET /recommendations/genre/Fantasy?limit=10
```

### 3. User's Genre Preferences
```http
GET /recommendations/user/{user_id}/genres?limit=10
```

## 🧪 Testing

### Run Test Script:
```bash
cd ml-service
.\.venv\Scripts\python.exe test_content_based.py
```

### Start ML Service:
```bash
cd ml-service
$Env:FLASK_PORT='5000'
.\.venv\Scripts\python.exe app.py
```

### Test API:
```bash
# Test health
curl http://localhost:5000/health

# Test user recommendations
curl http://localhost:5000/recommendations/user/1?limit=5

# Test genre search
curl http://localhost:5000/recommendations/genre/Fantasy?limit=5
```

## 📝 Database Schema

The system uses these tables:

```sql
-- Book genres
book_genres: (id, name, color_hex)

-- Books with genre relationship
book_genre_relations: (book_id, genre_id)

-- User ratings
ratings: (user_id, book_id, rating)
```

## ⚡ Performance Features

- **Pre-calculated Similarity Matrix**: Computed once during initialization
- **Cached TF-IDF Vectors**: No recalculation needed per request
- **In-Memory Genre Relations**: Fast lookup without repeated queries
- **Efficient Sparse Matrix**: Uses CSR format for collaborative filtering

## 🎨 Genre Types in Database

Current genres available:
- Fiction
- Romance  
- Mystery
- Fantasy
- Science Fiction
- Historical Fiction
- Contemporary
- Literary Fiction
- Adventure
- Magical Realism
- Young Adult
- Classic
- Biography
- Poetry
- Drama
- Thriller
- Horror
- Comedy
- Philosophy
- Travel

## 🔄 How to Deploy

### For Local Testing:
1. Backend already running on port 3000 ✅
2. Start ML service: `cd ml-service; .\.venv\Scripts\python.exe app.py`
3. ML service will run on port 5000
4. Frontend will automatically use ML recommendations

### For Production (Render):
1. ML service is deployed on Render
2. Backend calls ML service URL from environment variable
3. Frontend gets recommendations through backend API
4. No changes needed - it's already integrated!

## 🎯 Benefits

✅ **Genre-Focused**: Recommendations strongly match your favorite genres  
✅ **Transparent**: You can see which genres influenced each recommendation  
✅ **Accurate**: 70/30 content/collaborative split prioritizes genre matching  
✅ **Scalable**: Works efficiently even with thousands of books  
✅ **Cold Start Friendly**: New users get trending books from popular genres  

## 📈 Next Steps (Optional Enhancements)

1. **Add Genre Filters in Frontend**: Allow users to browse by genre
2. **Show "Because you liked..." explanations**: Display which book/genre triggered each recommendation
3. **Genre Diversity Mode**: Suggest books from new genres to explore
4. **Mood-Based Genres**: Separate "Dark Fantasy" from "Light Fantasy"
5. **Temporal Preferences**: Weight recently-liked genres more heavily

## ✅ Summary

Your recommendation system now uses **content-based filtering focused on genres**. When a user likes a book of a specific genre, the system will:

1. ✅ Identify the genres of liked books
2. ✅ Find similar books with matching genres
3. ✅ Give extra weight to books that match multiple genres
4. ✅ Combine with collaborative filtering (30%) for best results

**The system is ready to use and already integrated into your TaleTrail application!** 🎉

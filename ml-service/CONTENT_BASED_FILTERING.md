# Content-Based Filtering Implementation

## Overview
The TaleTrail recommendation system now uses **content-based filtering** with a strong emphasis on **genre matching**. When you like a book of a specific genre, the system will recommend other books from the same or similar genres.

## How It Works

### 1. Genre-Focused Recommendations
- The system analyzes the genres of books you've rated highly (4-5 stars)
- It identifies your favorite genres based on your rating history
- Recommendations are heavily weighted toward books that match your preferred genres

### 2. Content Features
The recommendation algorithm uses the following features (in order of importance):

1. **Genres** (5x weight) - The most important factor
2. **Title** - Book title matching
3. **Author** - Same or similar authors
4. **Description** - Plot and theme similarity
5. **Country** - Books from similar regions

### 3. Similarity Calculation
- Uses TF-IDF (Term Frequency-Inverse Document Frequency) vectorization
- Calculates cosine similarity between books
- Adds genre overlap bonus (+0.2 per matching genre)
- Combines content similarity (70%) with collaborative filtering (30%)

## API Endpoints

### Get Personalized Recommendations
```
GET /recommendations/user/{user_id}
```
Returns personalized recommendations based on user's liked genres.

**Parameters:**
- `limit` (optional): Number of recommendations (default: 10)
- `content_weight` (optional): Weight for content-based filtering (default: 0.7)
- `collab_weight` (optional): Weight for collaborative filtering (default: 0.3)

**Response:**
```json
{
  "user_id": 1,
  "recommendations": [
    {
      "book_id": 5,
      "title": "Book Title",
      "author": "Author Name",
      "genres": "Fiction, Science Fiction",
      "rating": 4.2,
      "similarity_score": 0.85,
      "genre_overlap": 2,
      "recommendation_type": "content_based_genre"
    }
  ],
  "total": 10
}
```

### Get Genre-Based Recommendations
```
GET /recommendations/genre/{genre_name}
```
Returns top-rated books from a specific genre.

**Example:** `/recommendations/genre/Fantasy`

### Get User's Genre Preferences
```
GET /recommendations/user/{user_id}/genres
```
Returns recommendations based on the user's favorite genres (determined by their rating history).

## Example Workflow

1. **User rates "Harry Potter" (Fantasy, Young Adult) with 5 stars**
   - System identifies user likes Fantasy and Young Adult genres

2. **User rates "Pride and Prejudice" (Fiction, Romance) with 5 stars**
   - System identifies user also likes Romance

3. **System generates recommendations:**
   - Prioritizes books with Fantasy, Young Adult, Romance, or Fiction genres
   - "The Lord of the Rings" (Fantasy) - High recommendation
   - "Twilight" (Fantasy, Young Adult, Romance) - Very high recommendation
   - "Emma" (Fiction, Romance) - High recommendation

4. **Genre Overlap Bonus:**
   - Books matching multiple favorite genres get extra boost
   - "Twilight" matches 3 genres → higher in recommendations

## Algorithm Parameters

### Content Weight: 70% (default)
- Content-based filtering using TF-IDF and genre matching
- Focuses on what the book *is* (genres, themes, style)

### Collaborative Weight: 30% (default)
- Collaborative filtering based on similar users
- Focuses on what *similar users* liked

### Genre Weight Multiplier: 5x
- Genres are repeated 5 times in the feature vector
- Ensures genre matching has highest impact

### Genre Overlap Bonus: +0.2 per genre
- Each matching genre adds 0.2 to similarity score
- Books matching 2-3 genres get significant boost

## Benefits

✅ **Genre-Focused**: Recommendations strongly match your favorite genres
✅ **Transparent**: You can see which genres influenced recommendations
✅ **Diverse**: Still considers other factors (author, country, description)
✅ **Scalable**: Works well even with limited user data
✅ **Cold Start**: New users get genre-based trending books

## Database Schema

The system uses the following tables:
- `books` - Book information with genres (comma-separated)
- `book_genres` - Available genre categories
- `book_genre_relations` - Many-to-many relationship between books and genres
- `ratings` - User ratings (1-5 stars)
- `user_interactions` - User behavior tracking

## Testing the System

1. **Start the ML Service:**
   ```bash
   cd ml-service
   .\.venv\Scripts\python.exe app.py
   ```

2. **Test genre recommendations:**
   ```bash
   curl http://localhost:5000/recommendations/genre/Fantasy?limit=5
   ```

3. **Test personalized recommendations:**
   ```bash
   curl http://localhost:5000/recommendations/user/1?limit=10
   ```

4. **Test user genre preferences:**
   ```bash
   curl http://localhost:5000/recommendations/user/1/genres?limit=10
   ```

## Performance Optimization

- Content similarity matrix is pre-calculated during initialization
- Genre relations are loaded into memory for fast lookups
- TF-IDF vectorization is cached
- Collaborative model is trained once and reused

## Future Enhancements

- [ ] Add genre sub-categories (e.g., "Urban Fantasy", "Epic Fantasy")
- [ ] Implement genre mood matching (e.g., "Dark Fantasy" vs "Light Fantasy")
- [ ] Add temporal genre preferences (genres liked recently vs historically)
- [ ] Implement genre diversity recommendations (explore new genres)
- [ ] Add genre-based filtering in frontend UI

# Content-Based Recommendation System

## Overview

This implementation uses **proper content-based filtering** with feature vectors and cosine similarity, as described in recommendation system theory.

## How It Works

### 1. Feature Engineering

Each book is represented as a **feature vector** combining multiple attributes:

#### **Feature 1: Genre (One-Hot Encoded)** - Weight: 3.0x ⭐ MOST IMPORTANT
- Extracts all unique genres from the database
- Creates binary (0/1) encoding for each genre
- A book can have multiple genres set to 1
- **Example**: A "Fantasy, Adventure" book has [1, 1, 0, 0, ...] for fantasy and adventure positions

#### **Feature 2: Text (TF-IDF)** - Weight: 1.0x
- Uses TF-IDF vectorization on title + description
- Captures semantic meaning of book content
- Creates 300 features using unigrams and bigrams
- **Example**: Words like "magic", "wizard", "castle" get high TF-IDF scores for fantasy books

#### **Feature 3: Author (One-Hot Encoded)** - Weight: 0.5x
- Top 100 most frequent authors get individual encoding
- Rare authors grouped as "other_author"
- Helps recommend books by same author
- **Example**: All "J.K. Rowling" books share the same author feature

#### **Feature 4: Rating (Normalized)** - Weight: 0.3x
- Average rating normalized to 0-1 scale
- Log-scaled rating count (to handle outliers)
- Helps recommend highly-rated books
- **Example**: 4.5-star book with 1000 ratings gets [0.9, 0.7] approx

#### **Feature 5: Country (One-Hot Encoded)** - Weight: 0.4x
- One-hot encoding for book's origin country
- Helps find books from similar literary traditions
- **Example**: All "United Kingdom" books share country feature

### 2. Feature Matrix Construction

All features are combined into a **sparse matrix**:

```
Final Matrix Shape: (num_books, total_features)
- Genre features: ~50-100 (weighted 3.0x)
- Text features: 300 (weighted 1.0x)
- Author features: 101 (weighted 0.5x)
- Country features: ~50-80 (weighted 0.4x)
- Rating features: 2 (weighted 0.3x)
```

**Total: ~500-600 features per book**

### 3. Cosine Similarity

To find similar books, we use **cosine similarity** between feature vectors:

```python
similarity = cosine_similarity(book_vector, all_book_vectors)
```

**Cosine similarity formula**:
$$
\text{similarity}(A, B) = \frac{A \cdot B}{||A|| \times ||B||}
$$

- Returns value between 0 (completely different) and 1 (identical)
- Higher score = more similar books
- Genre matches get highest weight (3.0x)

### 4. Generating Recommendations

#### For a Single Book:
1. Get the book's feature vector
2. Calculate cosine similarity with all other books
3. Sort by similarity score (descending)
4. Return top K most similar books

#### For a User (with multiple favorites):
1. Get user's favorite books
2. For each favorite, find similar books
3. **Aggregate scores**: Books similar to multiple favorites get higher scores
4. Sort by total similarity score
5. Return top K recommendations

## Example Flow

### User has 2 favorite books:
- **Book A**: "Harry Potter" (Fantasy, Adventure, Magic)
- **Book B**: "Lord of the Rings" (Fantasy, Adventure, Epic)

### System finds similar books:

1. **For "Harry Potter"**:
   - Genre overlap: Fantasy books (high score)
   - Text similarity: Books with "magic", "wizard" keywords
   - Result: "Percy Jackson" gets 0.85 similarity

2. **For "Lord of the Rings"**:
   - Genre overlap: Fantasy, Adventure, Epic
   - Text similarity: Books with "quest", "epic" keywords
   - Result: "Percy Jackson" gets 0.78 similarity

3. **Aggregate**:
   - "Percy Jackson" total score: 0.85 + 0.78 = **1.63**
   - Books similar to BOTH favorites get highest scores!

## API Endpoints

### 1. Get User Recommendations
```http
GET /recommendations/user/{user_id}?limit=10
```

**Response**:
```json
{
  "user_id": 1,
  "recommendations": [
    {
      "id": 42,
      "title": "Percy Jackson",
      "genres": "Fantasy, Adventure",
      "similarity_score": 1.63,
      ...
    }
  ],
  "count": 10,
  "method": "content_based_cosine_similarity"
}
```

### 2. Find Similar Books
```http
GET /recommendations/similar/{book_id}?limit=5
```

**Response**:
```json
{
  "book_id": 1,
  "similar_books": [
    {
      "id": 5,
      "title": "Similar Book",
      "similarity_score": 0.87,
      ...
    }
  ],
  "count": 5,
  "method": "cosine_similarity"
}
```

### 3. Explain Similarity
```http
GET /recommendations/explain/{book_id1}/{book_id2}
```

**Response**:
```json
{
  "book1": {"id": 1, "title": "Harry Potter"},
  "book2": {"id": 5, "title": "Percy Jackson"},
  "common_genres": ["Fantasy", "Adventure"],
  "same_author": false,
  "same_country": false,
  "rating_diff": 0.2
}
```

## Why Genre Gets Highest Weight (3.0x)?

**User's original request**: *"if i like a book of specific genre, the recommendation system should display books related to that book genre"*

By giving genres **3x weight**:
- Genre matches dominate the similarity score
- A book with matching genres will rank higher even if text/author differ
- Ensures **genre-based content filtering** as requested

## Mathematical Example

**Book A** (Harry Potter):
- Genre vector: [1, 1, 0, 0] × 3.0 = [3, 3, 0, 0] (Fantasy, Adventure)
- Text vector: [0.5, 0.3, ...] × 1.0
- Author vector: [0, 1, ...] × 0.5 (J.K. Rowling)

**Book B** (Percy Jackson):
- Genre vector: [1, 1, 0, 0] × 3.0 = [3, 3, 0, 0] (Fantasy, Adventure)
- Text vector: [0.4, 0.2, ...] × 1.0
- Author vector: [0, 0, 1, ...] × 0.5 (Rick Riordan)

**Cosine Similarity**:
- Genre contribution: Very high (both have [3, 3])
- Text contribution: Moderate
- Author contribution: Zero (different authors)
- **Total**: ~0.85 (very similar!)

## Advantages of This Approach

1. ✅ **Genre-focused**: Matches user's requirement for genre-based recommendations
2. ✅ **Multi-dimensional**: Considers multiple book attributes, not just genres
3. ✅ **Scalable**: Cosine similarity is computationally efficient
4. ✅ **Explainable**: Can show WHY books are similar (common genres, authors, etc.)
5. ✅ **Handles cold start**: Works even for users with just 1 favorite book
6. ✅ **No training required**: Pure content-based, no need for user rating data

## Testing

Run the test script to see it in action:

```bash
cd ml-service
source .venv/bin/activate  # or .\.venv\Scripts\activate on Windows
python test_content_recommender.py
```

This will:
- Load all books and build feature vectors
- Test finding similar books
- Test generating user recommendations
- Explain why books are similar

## Integration with Backend

The backend can optionally use this ML service:

1. **With ML service** (recommended):
   ```
   Backend → ML Service (http://localhost:5000) → Content-based recommendations
   ```

2. **Without ML service** (fallback):
   ```
   Backend → SQL genre-based queries → Simple recommendations
   ```

Both work, but ML service provides much better quality recommendations!

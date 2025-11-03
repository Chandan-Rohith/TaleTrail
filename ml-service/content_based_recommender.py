"""
Content-Based Recommender System
Uses proper feature engineering with:
- Genre (one-hot encoded)
- Author (categorical feature)
- Description/Title (TF-IDF or embeddings)
- Rating score (numeric)
- Cosine similarity for finding similar books
"""

import mysql.connector
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import hstack, csr_matrix
import os
import logging

logger = logging.getLogger(__name__)

class ContentBasedRecommender:
    def __init__(self):
        self.db_config = {
            'host': os.environ.get('DB_HOST', 'localhost'),
            'user': os.environ.get('DB_USER', 'root'),
            'password': os.environ.get('DB_PASSWORD', ''),
            'database': os.environ.get('DB_NAME', 'taletrail_db'),
            'autocommit': True
        }
        
        self.books_df = None
        self.feature_matrix = None
        self.genre_encoder = None
        self.author_encoder = None
        self.text_vectorizer = None
        
        # Load and prepare data
        self.load_data()
        self.build_feature_vectors()
        
    def get_db_connection(self):
        """Get database connection"""
        return mysql.connector.connect(**self.db_config)
    
    def load_data(self):
        """Load books data with all necessary features"""
        try:
            conn = self.get_db_connection()
            
            # Load books with genres
            self.books_df = pd.read_sql("""
                SELECT b.*, c.name as country_name,
                       GROUP_CONCAT(DISTINCT bg.name ORDER BY bg.name SEPARATOR ', ') as genres
                FROM books b
                LEFT JOIN countries c ON b.country_id = c.id
                LEFT JOIN book_genre_relations bgr ON b.id = bgr.book_id
                LEFT JOIN book_genres bg ON bgr.genre_id = bg.id
                GROUP BY b.id
            """, conn)
            
            conn.close()
            
            logger.info(f"✅ Loaded {len(self.books_df)} books")
            
        except Exception as e:
            logger.error(f"❌ Error loading data: {str(e)}")
            raise
    
    def build_feature_vectors(self):
        """
        Build comprehensive feature vectors for each book using:
        1. Genre (one-hot encoded) - MOST IMPORTANT
        2. Author (categorical)
        3. Text features (TF-IDF on title + description)
        4. Rating score (normalized)
        5. Country (one-hot encoded)
        """
        print("\n🔧 Building Content-Based Feature Vectors...")
        print("=" * 60)
        
        df = self.books_df.copy()
        
        # =================================================================
        # FEATURE 1: GENRE (One-Hot Encoded) - HIGHEST WEIGHT
        # =================================================================
        print("\n1️⃣ GENRE FEATURES (One-Hot Encoded)")
        print("-" * 60)
        
        # Split genres and create binary matrix
        all_genres = set()
        for genres in df['genres'].fillna('unknown'):
            all_genres.update([g.strip() for g in genres.split(',')])
        
        genre_cols = sorted(list(all_genres))
        print(f"   Found {len(genre_cols)} unique genres")
        
        # Create one-hot encoding for genres
        genre_matrix = np.zeros((len(df), len(genre_cols)))
        for idx, genres in enumerate(df['genres'].fillna('unknown')):
            for genre in genres.split(','):
                genre = genre.strip()
                if genre in genre_cols:
                    col_idx = genre_cols.index(genre)
                    genre_matrix[idx, col_idx] = 1
        
        # WEIGHT: 3.0 (genres are MOST important!)
        genre_sparse = csr_matrix(genre_matrix * 3.0)
        print(f"   ✅ Genre matrix: {genre_sparse.shape} (weighted 3.0x)")
        
        # =================================================================
        # FEATURE 2: TEXT FEATURES (TF-IDF)
        # =================================================================
        print("\n2️⃣ TEXT FEATURES (TF-IDF on title + description)")
        print("-" * 60)
        
        df['text_content'] = (
            df['title'].fillna('') + ' ' +
            df['description'].fillna('')
        )
        
        self.text_vectorizer = TfidfVectorizer(
            max_features=300,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=2
        )
        
        text_matrix = self.text_vectorizer.fit_transform(df['text_content'])
        
        # WEIGHT: 1.0 (standard weight)
        text_sparse = text_matrix * 1.0
        print(f"   ✅ Text matrix: {text_sparse.shape} (weighted 1.0x)")
        
        # =================================================================
        # FEATURE 3: AUTHOR (One-Hot Encoded for Top Authors)
        # =================================================================
        print("\n3️⃣ AUTHOR FEATURES (One-Hot Encoded)")
        print("-" * 60)
        
        # Get top 100 authors, rest become "other"
        top_authors = df['author'].value_counts().head(100).index.tolist()
        df['author_category'] = df['author'].apply(
            lambda x: x if x in top_authors else 'other_author'
        )
        
        self.author_encoder = LabelEncoder()
        author_encoded = self.author_encoder.fit_transform(df['author_category'])
        
        # One-hot encode
        n_authors = len(self.author_encoder.classes_)
        author_matrix = np.zeros((len(df), n_authors))
        author_matrix[np.arange(len(df)), author_encoded] = 1
        
        # WEIGHT: 0.5 (moderate weight)
        author_sparse = csr_matrix(author_matrix * 0.5)
        print(f"   ✅ Author matrix: {author_sparse.shape} (weighted 0.5x)")
        print(f"   Top authors: {', '.join(top_authors[:5])}...")
        
        # =================================================================
        # FEATURE 4: RATING (Normalized Numeric)
        # =================================================================
        print("\n4️⃣ RATING FEATURES (Normalized)")
        print("-" * 60)
        
        # Normalize ratings to 0-1 scale
        scaler = MinMaxScaler()
        df['rating_normalized'] = scaler.fit_transform(
            df[['average_rating']].fillna(df['average_rating'].median())
        )
        
        # Log-scale for rating count
        df['rating_count_log'] = np.log1p(df['rating_count'].fillna(0))
        df['rating_count_normalized'] = scaler.fit_transform(
            df[['rating_count_log']]
        )
        
        rating_matrix = df[['rating_normalized', 'rating_count_normalized']].values
        
        # WEIGHT: 0.3 (lower weight)
        rating_sparse = csr_matrix(rating_matrix * 0.3)
        print(f"   ✅ Rating matrix: {rating_sparse.shape} (weighted 0.3x)")
        print(f"   Avg rating: {df['average_rating'].mean():.2f}")
        
        # =================================================================
        # FEATURE 5: COUNTRY (One-Hot Encoded)
        # =================================================================
        print("\n5️⃣ COUNTRY FEATURES (One-Hot Encoded)")
        print("-" * 60)
        
        df['country_filled'] = df['country_name'].fillna('unknown')
        
        self.country_encoder = LabelEncoder()
        country_encoded = self.country_encoder.fit_transform(df['country_filled'])
        
        n_countries = len(self.country_encoder.classes_)
        country_matrix = np.zeros((len(df), n_countries))
        country_matrix[np.arange(len(df)), country_encoded] = 1
        
        # WEIGHT: 0.4 (moderate weight)
        country_sparse = csr_matrix(country_matrix * 0.4)
        print(f"   ✅ Country matrix: {country_sparse.shape} (weighted 0.4x)")
        print(f"   Countries: {len(self.country_encoder.classes_)}")
        
        # =================================================================
        # COMBINE ALL FEATURES
        # =================================================================
        print("\n🔗 COMBINING ALL FEATURES")
        print("=" * 60)
        
        self.feature_matrix = hstack([
            genre_sparse,      # Weight: 3.0 (MOST IMPORTANT!)
            text_sparse,       # Weight: 1.0
            author_sparse,     # Weight: 0.5
            country_sparse,    # Weight: 0.4
            rating_sparse      # Weight: 0.3
        ])
        
        print(f"✅ Final feature matrix: {self.feature_matrix.shape}")
        print(f"   Total features: {self.feature_matrix.shape[1]}")
        print(f"   - Genre features: {genre_sparse.shape[1]} (weight: 3.0)")
        print(f"   - Text features: {text_sparse.shape[1]} (weight: 1.0)")
        print(f"   - Author features: {author_sparse.shape[1]} (weight: 0.5)")
        print(f"   - Country features: {country_sparse.shape[1]} (weight: 0.4)")
        print(f"   - Rating features: {rating_sparse.shape[1]} (weight: 0.3)")
        print("=" * 60)
    
    def get_similar_books(self, book_id, top_k=10, exclude_ids=None):
        """
        Find top k most similar books using cosine similarity
        
        Args:
            book_id: ID of the book to find similar books for
            top_k: Number of recommendations to return
            exclude_ids: List of book IDs to exclude from recommendations
            
        Returns:
            List of (book_id, similarity_score) tuples
        """
        if exclude_ids is None:
            exclude_ids = []
        
        # Find index of the book
        try:
            book_idx = self.books_df[self.books_df['id'] == book_id].index[0]
        except IndexError:
            logger.warning(f"Book {book_id} not found")
            return []
        
        # Get feature vector for this book
        book_vector = self.feature_matrix[book_idx]
        
        # Calculate cosine similarity with ALL books
        similarities = cosine_similarity(book_vector, self.feature_matrix)[0]
        
        # Get indices sorted by similarity (descending)
        similar_indices = np.argsort(similarities)[::-1]
        
        # Filter out the book itself and excluded books
        recommendations = []
        for idx in similar_indices:
            candidate_id = int(self.books_df.iloc[idx]['id'])
            
            # Skip the book itself and excluded books
            if candidate_id == book_id or candidate_id in exclude_ids:
                continue
            
            similarity_score = float(similarities[idx])
            recommendations.append((candidate_id, similarity_score))
            
            if len(recommendations) >= top_k:
                break
        
        return recommendations
    
    def get_recommendations_for_user(self, user_id, top_k=10):
        """
        Get personalized recommendations for a user based on their favorite books
        
        Args:
            user_id: ID of the user
            top_k: Number of recommendations to return
            
        Returns:
            List of recommended books with scores
        """
        try:
            conn = self.get_db_connection()
            
            # Get user's favorite books
            favorites_df = pd.read_sql("""
                SELECT book_id FROM user_favorites WHERE user_id = %s
            """, conn, params=(user_id,))
            
            conn.close()
            
            if favorites_df.empty:
                logger.info(f"User {user_id} has no favorites yet")
                return []
            
            favorite_ids = favorites_df['book_id'].tolist()
            logger.info(f"📚 User {user_id} has {len(favorite_ids)} favorite books")
            
            # Get similar books for each favorite
            all_recommendations = {}
            
            for fav_id in favorite_ids:
                similar_books = self.get_similar_books(
                    fav_id, 
                    top_k=top_k * 3,  # Get more candidates
                    exclude_ids=favorite_ids
                )
                
                # Aggregate scores (books similar to multiple favorites get higher scores)
                for book_id, score in similar_books:
                    if book_id not in all_recommendations:
                        all_recommendations[book_id] = 0
                    all_recommendations[book_id] += score
            
            # Sort by aggregated score
            sorted_recommendations = sorted(
                all_recommendations.items(),
                key=lambda x: x[1],
                reverse=True
            )[:top_k]
            
            # Get book details
            result = []
            for book_id, score in sorted_recommendations:
                book_data = self.books_df[self.books_df['id'] == book_id].iloc[0].to_dict()
                book_data['similarity_score'] = float(score)
                result.append(book_data)
            
            logger.info(f"✅ Generated {len(result)} recommendations for user {user_id}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Error getting recommendations for user {user_id}: {str(e)}")
            return []
    
    def explain_similarity(self, book_id1, book_id2):
        """
        Explain why two books are similar
        """
        try:
            book1 = self.books_df[self.books_df['id'] == book_id1].iloc[0]
            book2 = self.books_df[self.books_df['id'] == book_id2].iloc[0]
            
            # Genre overlap
            genres1 = set(book1['genres'].split(',')) if pd.notna(book1['genres']) else set()
            genres2 = set(book2['genres'].split(',')) if pd.notna(book2['genres']) else set()
            common_genres = genres1.intersection(genres2)
            
            explanation = {
                'book1': {'id': book_id1, 'title': book1['title']},
                'book2': {'id': book_id2, 'title': book2['title']},
                'common_genres': list(common_genres),
                'same_author': book1['author'] == book2['author'],
                'same_country': book1['country_name'] == book2['country_name'],
                'rating_diff': abs(book1['average_rating'] - book2['average_rating'])
            }
            
            return explanation
            
        except Exception as e:
            logger.error(f"Error explaining similarity: {str(e)}")
            return None

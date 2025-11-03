import mysql.connector
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF
from scipy.sparse import csr_matrix
import os
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class RecommendationEngine:
    def __init__(self):
        self.db_config = {
            'host': os.environ.get('DB_HOST', 'localhost'),
            'user': os.environ.get('DB_USER', 'root'),
            'password': os.environ.get('DB_PASSWORD', ''),
            'database': os.environ.get('DB_NAME', 'taletrail_db'),
            'autocommit': True
        }
        
        # Initialize models
        self.content_vectorizer = None
        self.content_similarity_matrix = None
        self.collaborative_model = None
        self.user_book_matrix = None
        self.book_features = None
        
        # Load initial data
        self.load_data()
    
    def get_db_connection(self):
        """Get database connection"""
        return mysql.connector.connect(**self.db_config)
    
    def load_data(self):
        """Load and prepare data for recommendations"""
        try:
            conn = self.get_db_connection()
            
            # Load books data with genres
            self.books_df = pd.read_sql("""
                SELECT b.*, c.name as country_name, c.code as country_code,
                       GROUP_CONCAT(DISTINCT bg.name ORDER BY bg.name SEPARATOR ', ') as genres
                FROM books b
                LEFT JOIN countries c ON b.country_id = c.id
                LEFT JOIN book_genre_relations bgr ON b.id = bgr.book_id
                LEFT JOIN book_genres bg ON bgr.genre_id = bg.id
                GROUP BY b.id
            """, conn)
            
            # Load ratings data
            self.ratings_df = pd.read_sql("""
                SELECT user_id, book_id, rating, created_at
                FROM ratings
            """, conn)
            
            # Load user interactions
            self.interactions_df = pd.read_sql("""
                SELECT user_id, book_id, interaction_type, created_at
                FROM user_interactions
            """, conn)
            
            # Load genre relationships for faster lookups
            self.genre_relations_df = pd.read_sql("""
                SELECT bgr.book_id, bg.id as genre_id, bg.name as genre_name
                FROM book_genre_relations bgr
                JOIN book_genres bg ON bgr.genre_id = bg.id
            """, conn)
            
            conn.close()
            
            # Prepare content-based features
            self.prepare_content_features()
            
            # Prepare collaborative filtering data
            self.prepare_collaborative_data()
            
            logger.info("✅ Data loaded successfully for ML recommendations")
            
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
    
    def prepare_content_features(self):
        """Prepare content-based recommendation features with heavy emphasis on genres"""
        if self.books_df.empty:
            return
        
        # Give genres much higher weight in content-based filtering
        # Repeat genres multiple times to increase their importance
        self.books_df['combined_features'] = (
            self.books_df['genres'].fillna('').apply(lambda x: ' '.join([x] * 5)) + ' ' +  # 5x weight for genres
            self.books_df['title'].fillna('') + ' ' +
            self.books_df['author'].fillna('') + ' ' +
            self.books_df['description'].fillna('') + ' ' +
            self.books_df['country_name'].fillna('')
        )
        
        # Create TF-IDF matrix with genre emphasis
        self.content_vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=1  # Allow single occurrences for genre matching
        )
        
        tfidf_matrix = self.content_vectorizer.fit_transform(self.books_df['combined_features'])
        
        # Calculate similarity matrix
        self.content_similarity_matrix = cosine_similarity(tfidf_matrix)
        
        logger.info("✅ Content-based features prepared with genre emphasis")
    
    def prepare_collaborative_data(self):
        """Prepare collaborative filtering data"""
        if self.ratings_df.empty:
            return
        
        # Create user-book rating matrix
        self.user_book_matrix = self.ratings_df.pivot_table(
            index='user_id',
            columns='book_id', 
            values='rating',
            fill_value=0
        )
        
        # Convert to sparse matrix for efficiency
        sparse_matrix = csr_matrix(self.user_book_matrix.values)
        
        # Train NMF model for collaborative filtering
        self.collaborative_model = NMF(
            n_components=50,
            init='random',
            random_state=42,
            max_iter=200
        )
        
        try:
            self.collaborative_model.fit(sparse_matrix)
            logger.info("✅ Collaborative filtering model trained")
        except Exception as e:
            logger.warning(f"Could not train collaborative model: {str(e)}")
    
    def get_user_recommendations(self, user_id, limit=10, content_weight=0.7, collab_weight=0.3):
        """Get personalized recommendations for a user with emphasis on genre matching"""
        try:
            # Get user's rating history
            user_ratings = self.ratings_df[self.ratings_df['user_id'] == user_id]
            
            if user_ratings.empty:
                # New user - return trending books
                return self.get_trending_books(limit)
            
            # Content-based recommendations (genre-focused)
            content_recs = self.get_content_based_recommendations(user_id, limit * 2)
            
            # Collaborative recommendations (if possible)
            collab_recs = []
            if self.collaborative_model is not None and user_id in self.user_book_matrix.index:
                collab_recs = self.get_collaborative_recommendations(user_id, limit * 2)
            
            # Combine recommendations with weighting
            combined_recs = {}

            for rec in content_recs:
                book_id = rec['book_id']
                if book_id not in combined_recs:
                    combined_recs[book_id] = rec
                    combined_recs[book_id]['final_score'] = 0
                # Give extra weight to genre overlap
                genre_overlap_bonus = rec.get('genre_overlap', 0) * 0.15
                combined_recs[book_id]['final_score'] += (rec.get('similarity_score', 0) * content_weight) + genre_overlap_bonus

            for rec in collab_recs:
                book_id = rec['book_id']
                if book_id not in combined_recs:
                    combined_recs[book_id] = rec
                    combined_recs[book_id]['final_score'] = 0
                combined_recs[book_id]['final_score'] += rec.get('predicted_rating', 0) * collab_weight

            # Sort by the combined score
            sorted_recs = sorted(combined_recs.values(), key=lambda x: x['final_score'], reverse=True)

            # Deduplicate and limit
            seen_books = set(rating['book_id'] for _, rating in user_ratings.iterrows())
            final_recs = []
            for rec in sorted_recs:
                if rec['book_id'] not in seen_books and len(final_recs) < limit:
                    final_recs.append(rec)
                    seen_books.add(rec['book_id'])
            
            # Fill with trending if not enough recommendations
            if len(final_recs) < limit:
                trending = self.get_trending_books(limit)
                for book in trending:
                    if len(final_recs) >= limit:
                        break
                    if book['book_id'] not in seen_books:
                        final_recs.append(book)

            return final_recs[:limit]
            
        except Exception as e:
            logger.error(f"Error getting user recommendations: {str(e)}")
            return self.get_trending_books(limit)
    
    def get_content_based_recommendations(self, user_id, limit=10):
        """Get content-based recommendations focused on genre matching"""
        try:
            # Get books the user has rated highly (4-5 stars) or favorited
            user_ratings = self.ratings_df[
                (self.ratings_df['user_id'] == user_id) & 
                (self.ratings_df['rating'] >= 4)
            ]
            
            if user_ratings.empty:
                return []
            
            # Get genres from user's liked books
            liked_book_ids = user_ratings['book_id'].tolist()
            user_genres = self.genre_relations_df[
                self.genre_relations_df['book_id'].isin(liked_book_ids)
            ]['genre_name'].unique().tolist()
            
            logger.info(f"📚 User {user_id} likes these genres: {', '.join(user_genres)}")
            
            recommendations = []
            genre_scores = {}  # Track books by genre match
            
            for _, rating in user_ratings.iterrows():
                book_id = rating['book_id']
                
                # Find book index in our dataframe
                book_idx = self.books_df[self.books_df['id'] == book_id].index
                if len(book_idx) == 0:
                    continue
                
                book_idx = book_idx[0]
                
                # Get similarity scores
                sim_scores = list(enumerate(self.content_similarity_matrix[book_idx]))
                sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
                
                # Get top similar books
                for idx, score in sim_scores[1:11]:  # Skip the book itself, get top 10
                    book_data = self.books_df.iloc[idx]
                    book_id_rec = int(book_data['id'])
                    
                    # Calculate genre overlap bonus
                    book_genres = book_data['genres'].split(', ') if pd.notna(book_data['genres']) else []
                    genre_overlap = len(set(book_genres) & set(user_genres))
                    genre_bonus = genre_overlap * 0.2  # Add 0.2 per matching genre
                    
                    final_score = float(score) + genre_bonus
                    
                    if book_id_rec not in genre_scores or genre_scores[book_id_rec] < final_score:
                        genre_scores[book_id_rec] = final_score
                        
                        recommendations.append({
                            'book_id': book_id_rec,
                            'title': book_data['title'],
                            'author': book_data['author'],
                            'country': book_data['country_name'],
                            'genres': book_data['genres'],
                            'rating': float(book_data['average_rating']) if book_data['average_rating'] else 0.0,
                            'similarity_score': final_score,
                            'genre_overlap': genre_overlap,
                            'recommendation_type': 'content_based_genre'
                        })
            
            # Sort by similarity score (which includes genre bonus) and remove duplicates
            recommendations = sorted(recommendations, key=lambda x: x['similarity_score'], reverse=True)
            seen = set()
            unique_recs = []
            
            for rec in recommendations:
                if rec['book_id'] not in seen:
                    seen.add(rec['book_id'])
                    unique_recs.append(rec)
                    logger.info(f"  ✨ Recommending '{rec['title']}' (genres: {rec['genres']}, overlap: {rec['genre_overlap']})")
                    if len(unique_recs) >= limit:
                        break
            
            return unique_recs
            
        except Exception as e:
            logger.error(f"Error in content-based recommendations: {str(e)}")
            return []
    
    def get_collaborative_recommendations(self, user_id, limit=10):
        """Get collaborative filtering recommendations"""
        try:
            if self.collaborative_model is None or user_id not in self.user_book_matrix.index:
                return []
            
            # Get user index
            user_idx = self.user_book_matrix.index.get_loc(user_id)
            
            # Get user's feature vector
            user_features = self.collaborative_model.transform(
                self.user_book_matrix.iloc[user_idx:user_idx+1]
            )
            
            # Reconstruct ratings for all books
            predicted_ratings = self.collaborative_model.inverse_transform(user_features)[0]
            
            # Get books user hasn't rated
            user_rated_books = set(self.ratings_df[self.ratings_df['user_id'] == user_id]['book_id'])
            
            recommendations = []
            book_ids = self.user_book_matrix.columns
            
            for i, predicted_rating in enumerate(predicted_ratings):
                book_id = book_ids[i]
                
                if book_id not in user_rated_books:
                    book_data = self.books_df[self.books_df['id'] == book_id]
                    if len(book_data) > 0:
                        book_info = book_data.iloc[0]
                        recommendations.append({
                            'book_id': int(book_id),
                            'title': book_info['title'],
                            'author': book_info['author'],
                            'country': book_info['country_name'],
                            'rating': float(book_info['average_rating']) if book_info['average_rating'] else 0.0,
                            'predicted_rating': float(predicted_rating),
                            'recommendation_type': 'collaborative'
                        })
            
            # Sort by predicted rating
            recommendations = sorted(recommendations, key=lambda x: x['predicted_rating'], reverse=True)
            return recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Error in collaborative recommendations: {str(e)}")
            return []
    
    def get_similar_books(self, book_id, limit=5):
        """Get books similar to a given book"""
        try:
            # Find book index
            book_idx = self.books_df[self.books_df['id'] == book_id].index
            if len(book_idx) == 0:
                return []
            
            book_idx = book_idx[0]
            
            # Get similarity scores
            sim_scores = list(enumerate(self.content_similarity_matrix[book_idx]))
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            
            similar_books = []
            for idx, score in sim_scores[1:limit+1]:  # Skip the book itself
                book_data = self.books_df.iloc[idx]
                similar_books.append({
                    'book_id': int(book_data['id']),
                    'title': book_data['title'],
                    'author': book_data['author'],
                    'country': book_data['country_name'],
                    'rating': float(book_data['average_rating']) if book_data['average_rating'] else 0.0,
                    'similarity_score': float(score)
                })
            
            return similar_books
            
        except Exception as e:
            logger.error(f"Error getting similar books: {str(e)}")
            return []
    
    def get_trending_books(self, limit=10, days=7):
        """Get trending books based on recent interactions"""
        try:
            conn = self.get_db_connection()
            
            # Get recent interactions
            cutoff_date = datetime.now() - timedelta(days=days)
            
            trending_query = """
                SELECT b.*, COUNT(*) as interaction_count,
                       AVG(r.rating) as recent_avg_rating
                FROM books b
                LEFT JOIN user_interactions ui ON b.id = ui.book_id
                LEFT JOIN ratings r ON b.id = r.book_id 
                WHERE ui.created_at >= %s OR r.created_at >= %s
                GROUP BY b.id
                ORDER BY interaction_count DESC, recent_avg_rating DESC
                LIMIT %s
            """
            
            trending_df = pd.read_sql(trending_query, conn, params=[cutoff_date, cutoff_date, limit])
            conn.close()
            
            trending_books = []
            for _, book in trending_df.iterrows():
                trending_books.append({
                    'book_id': int(book['id']),
                    'title': book['title'],
                    'author': book['author'],
                    'rating': float(book['average_rating']) if book['average_rating'] else 0.0,
                    'interaction_count': int(book['interaction_count']),
                    'recommendation_type': 'trending'
                })
            
            return trending_books
            
        except Exception as e:
            logger.error(f"Error getting trending books: {str(e)}")
            return []
    
    def get_recommendations_by_genre(self, genre, limit=10, exclude_book_ids=None):
        """Get top-rated books from a specific genre"""
        try:
            exclude_book_ids = exclude_book_ids or []
            
            # Filter books by genre (case-insensitive partial match)
            genre_books = self.books_df[
                self.books_df['genres'].str.contains(genre, case=False, na=False) &
                ~self.books_df['id'].isin(exclude_book_ids)
            ].sort_values('average_rating', ascending=False).head(limit)
            
            top_books = []
            for _, book in genre_books.iterrows():
                top_books.append({
                    'book_id': int(book['id']),
                    'title': book['title'],
                    'author': book['author'],
                    'genres': book['genres'],
                    'country': book['country_name'],
                    'rating': float(book['average_rating']) if book['average_rating'] else 0.0,
                    'description': book['description'],
                    'recommendation_type': 'genre_based'
                })
            
            logger.info(f"📚 Found {len(top_books)} books for genre: {genre}")
            return top_books
            
        except Exception as e:
            logger.error(f"Error getting genre books: {str(e)}")
            return []

    def get_books_by_genres(self, user_id, limit=10):
        """Get recommendations based on user's favorite genres"""
        try:
            # Get user's highly rated books
            user_ratings = self.ratings_df[
                (self.ratings_df['user_id'] == user_id) & 
                (self.ratings_df['rating'] >= 4)
            ]
            
            if user_ratings.empty:
                return []
            
            # Get genres from liked books
            liked_book_ids = user_ratings['book_id'].tolist()
            user_genres = self.genre_relations_df[
                self.genre_relations_df['book_id'].isin(liked_book_ids)
            ]['genre_name'].value_counts()
            
            logger.info(f"📊 User {user_id} genre preferences: {user_genres.to_dict()}")
            
            # Get books from each favorite genre
            recommendations = []
            books_per_genre = max(3, limit // len(user_genres))
            
            for genre, count in user_genres.items():
                genre_books = self.get_recommendations_by_genre(
                    genre, 
                    limit=books_per_genre,
                    exclude_book_ids=liked_book_ids
                )
                for book in genre_books:
                    book['genre_match'] = genre
                    book['genre_frequency'] = int(count)
                recommendations.extend(genre_books)
            
            # Sort by rating and genre frequency, remove duplicates
            recommendations = sorted(
                recommendations, 
                key=lambda x: (x['genre_frequency'], x['rating']), 
                reverse=True
            )
            
            seen = set()
            unique_recs = []
            for rec in recommendations:
                if rec['book_id'] not in seen and rec['book_id'] not in liked_book_ids:
                    seen.add(rec['book_id'])
                    unique_recs.append(rec)
                    if len(unique_recs) >= limit:
                        break
            
            return unique_recs[:limit]
            
        except Exception as e:
            logger.error(f"Error getting genre-based recommendations: {str(e)}")
            return []

    def get_country_top_books(self, country_code, limit=10):
        """Get top-rated books from a specific country"""
        try:
            country_books = self.books_df[
                self.books_df['country_code'] == country_code.upper()
            ].sort_values('average_rating', ascending=False).head(limit)
            
            top_books = []
            for _, book in country_books.iterrows():
                top_books.append({
                    'book_id': int(book['id']),
                    'title': book['title'],
                    'author': book['author'],
                    'country': book['country_name'],
                    'rating': float(book['average_rating']) if book['average_rating'] else 0.0,
                    'description': book['description']
                })
            
            return top_books
            
        except Exception as e:
            logger.error(f"Error getting country books: {str(e)}")
            return []
    
    def train_models(self):
        """Retrain all models with fresh data"""
        try:
            self.load_data()
            return {
                'status': 'success',
                'content_model': 'trained' if self.content_similarity_matrix is not None else 'failed',
                'collaborative_model': 'trained' if self.collaborative_model is not None else 'failed',
                'books_count': len(self.books_df),
                'ratings_count': len(self.ratings_df)
            }
        except Exception as e:
            logger.error(f"Error training models: {str(e)}")
            raise e
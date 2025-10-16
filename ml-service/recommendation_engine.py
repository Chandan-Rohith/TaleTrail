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
            
            # Load books data
            self.books_df = pd.read_sql("""
                SELECT b.*, c.name as country_name, c.code as country_code
                FROM books b
                LEFT JOIN countries c ON b.country_id = c.id
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
            
            conn.close()
            
            # Prepare content-based features
            self.prepare_content_features()
            
            # Prepare collaborative filtering data
            self.prepare_collaborative_data()
            
            logger.info("✅ Data loaded successfully for ML recommendations")
            
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
    
    def prepare_content_features(self):
        """Prepare content-based recommendation features"""
        if self.books_df.empty:
            return
        
        # Combine text features for content-based filtering
        self.books_df['combined_features'] = (
            self.books_df['title'].fillna('') + ' ' +
            self.books_df['author'].fillna('') + ' ' +
            self.books_df['description'].fillna('') + ' ' +
            self.books_df['country_name'].fillna('')
        )
        
        # Create TF-IDF matrix
        self.content_vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        
        tfidf_matrix = self.content_vectorizer.fit_transform(self.books_df['combined_features'])
        
        # Calculate similarity matrix
        self.content_similarity_matrix = cosine_similarity(tfidf_matrix)
        
        logger.info("✅ Content-based features prepared")
    
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
    
    def get_user_recommendations(self, user_id, limit=10):
        """Get personalized recommendations for a user"""
        try:
            # Get user's rating history
            user_ratings = self.ratings_df[self.ratings_df['user_id'] == user_id]
            
            if user_ratings.empty:
                # New user - return trending books
                return self.get_trending_books(limit)
            
            # Content-based recommendations
            content_recs = self.get_content_based_recommendations(user_id, limit * 2)
            
            # Collaborative recommendations (if possible)
            collab_recs = []
            if self.collaborative_model is not None and user_id in self.user_book_matrix.index:
                collab_recs = self.get_collaborative_recommendations(user_id, limit * 2)
            
            # Combine and deduplicate recommendations
            all_recs = content_recs + collab_recs
            seen_books = set()
            final_recs = []
            
            for rec in all_recs:
                if rec['book_id'] not in seen_books and len(final_recs) < limit:
                    seen_books.add(rec['book_id'])
                    final_recs.append(rec)
            
            # Fill with trending if needed
            if len(final_recs) < limit:
                trending = self.get_trending_books(limit - len(final_recs))
                for book in trending:
                    if book['book_id'] not in seen_books:
                        final_recs.append(book)
                        if len(final_recs) >= limit:
                            break
            
            return final_recs[:limit]
            
        except Exception as e:
            logger.error(f"Error getting user recommendations: {str(e)}")
            return self.get_trending_books(limit)
    
    def get_content_based_recommendations(self, user_id, limit=10):
        """Get content-based recommendations"""
        try:
            # Get books the user has rated highly
            user_ratings = self.ratings_df[
                (self.ratings_df['user_id'] == user_id) & 
                (self.ratings_df['rating'] >= 4)
            ]
            
            if user_ratings.empty:
                return []
            
            recommendations = []
            
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
                for idx, score in sim_scores[1:6]:  # Skip the book itself
                    book_data = self.books_df.iloc[idx]
                    recommendations.append({
                        'book_id': int(book_data['id']),
                        'title': book_data['title'],
                        'author': book_data['author'],
                        'country': book_data['country_name'],
                        'rating': float(book_data['average_rating']) if book_data['average_rating'] else 0.0,
                        'similarity_score': float(score),
                        'recommendation_type': 'content_based'
                    })
            
            # Sort by similarity score and remove duplicates
            recommendations = sorted(recommendations, key=lambda x: x['similarity_score'], reverse=True)
            seen = set()
            unique_recs = []
            
            for rec in recommendations:
                if rec['book_id'] not in seen:
                    seen.add(rec['book_id'])
                    unique_recs.append(rec)
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
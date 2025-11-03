from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging

from recommendation_engine import RecommendationEngine

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize recommendation engine
rec_engine = RecommendationEngine()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': '🤖 TaleTrail ML Service is running!',
        'service': 'recommendation-engine'
    })

@app.route('/recommendations/user/<int:user_id>', methods=['GET'])
def get_user_recommendations(user_id):
    """Get personalized recommendations for a user"""
    try:
        limit = request.args.get('limit', 10, type=int)
        content_weight = request.args.get('content_weight', 0.7, type=float)  # Higher weight for content/genre
        collab_weight = request.args.get('collab_weight', 0.3, type=float)

        recommendations = rec_engine.get_user_recommendations(
            user_id, limit, content_weight, collab_weight
        )
        
        return jsonify({
            'user_id': user_id,
            'recommendations': recommendations,
            'total': len(recommendations)
        })
    except Exception as e:
        logger.error(f"Error getting recommendations for user {user_id}: {str(e)}")
        return jsonify({'error': 'Failed to get recommendations'}), 500

@app.route('/recommendations/similar/<int:book_id>', methods=['GET'])
def get_similar_books(book_id):
    """Get books similar to a given book"""
    try:
        limit = request.args.get('limit', 5, type=int)
        
        similar_books = rec_engine.get_similar_books(book_id, limit)
        
        return jsonify({
            'book_id': book_id,
            'similar_books': similar_books,
            'total': len(similar_books)
        })
    except Exception as e:
        logger.error(f"Error getting similar books for {book_id}: {str(e)}")
        return jsonify({'error': 'Failed to get similar books'}), 500

@app.route('/recommendations/trending', methods=['GET'])
def get_trending_books():
    """Get trending books based on recent interactions"""
    try:
        limit = request.args.get('limit', 10, type=int)
        days = request.args.get('days', 7, type=int)
        
        trending = rec_engine.get_trending_books(limit, days)
        
        return jsonify({
            'trending_books': trending,
            'period_days': days,
            'total': len(trending)
        })
    except Exception as e:
        logger.error(f"Error getting trending books: {str(e)}")
        return jsonify({'error': 'Failed to get trending books'}), 500

@app.route('/recommendations/genre/<genre>', methods=['GET'])
def get_genre_recommendations(genre):
    """Get top books from a specific genre"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        books = rec_engine.get_recommendations_by_genre(genre, limit)
        
        return jsonify({
            'genre': genre,
            'top_books': books,
            'total': len(books)
        })
    except Exception as e:
        logger.error(f"Error getting books for genre {genre}: {str(e)}")
        return jsonify({'error': 'Failed to get genre books'}), 500

@app.route('/recommendations/user/<int:user_id>/genres', methods=['GET'])
def get_user_genre_recommendations(user_id):
    """Get recommendations based on user's favorite genres"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        books = rec_engine.get_books_by_genres(user_id, limit)
        
        return jsonify({
            'user_id': user_id,
            'genre_based_recommendations': books,
            'total': len(books)
        })
    except Exception as e:
        logger.error(f"Error getting genre recommendations for user {user_id}: {str(e)}")
        return jsonify({'error': 'Failed to get genre recommendations'}), 500

@app.route('/recommendations/country/<country_code>', methods=['GET'])
def get_country_recommendations(country_code):
    """Get top books from a specific country"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        books = rec_engine.get_country_top_books(country_code, limit)
        
        return jsonify({
            'country_code': country_code,
            'top_books': books,
            'total': len(books)
        })
    except Exception as e:
        logger.error(f"Error getting books for country {country_code}: {str(e)}")
        return jsonify({'error': 'Failed to get country books'}), 500

@app.route('/train', methods=['POST'])
def train_models():
    """Retrain recommendation models with latest data"""
    try:
        result = rec_engine.train_models()
        return jsonify({
            'message': 'Models trained successfully',
            'details': result
        })
    except Exception as e:
        logger.error(f"Error training models: {str(e)}")
        return jsonify({'error': 'Failed to train models'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('FLASK_PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', '').lower() in ['true', '1', 'yes']
    
    logger.info(f"🚀 Starting TaleTrail ML Service on port {port}")
    logger.info("📚 Ready to generate book recommendations!")
    
    app.run(host='0.0.0.0', port=port, debug=debug, use_reloader=False)

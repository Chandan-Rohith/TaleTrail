from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging

from content_based_recommender import ContentBasedRecommender

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize content-based recommendation engine
print("=" * 60)
print("🚀 STARTING CONTENT-BASED RECOMMENDATION ENGINE")
print("=" * 60)
rec_engine = ContentBasedRecommender()
print("=" * 60)
print("✅ ENGINE READY!")
print("=" * 60)

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
    """
    Get personalized content-based recommendations for a user
    Based on their favorite books using cosine similarity
    """
    try:
        limit = request.args.get('limit', 10, type=int)
        
        logger.info(f"📊 Getting recommendations for user {user_id} (limit={limit})")
        
        recommendations = rec_engine.get_recommendations_for_user(user_id, top_k=limit)
        
        return jsonify({
            'user_id': user_id,
            'recommendations': recommendations,
            'count': len(recommendations),
            'method': 'content_based_cosine_similarity'
        })
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/recommendations/similar/<int:book_id>', methods=['GET'])
def get_similar_books(book_id):
    """
    Get books similar to a given book using cosine similarity
    """
    try:
        limit = request.args.get('limit', 5, type=int)
        
        logger.info(f"🔍 Finding similar books to {book_id} (limit={limit})")
        
        similar = rec_engine.get_similar_books(book_id, top_k=limit)
        
        # Format response
        similar_books = []
        for book_id, score in similar:
            book_data = rec_engine.books_df[rec_engine.books_df['id'] == book_id].iloc[0].to_dict()
            book_data['similarity_score'] = score
            similar_books.append(book_data)
        
        return jsonify({
            'book_id': book_id,
            'similar_books': similar_books,
            'count': len(similar_books),
            'method': 'cosine_similarity'
        })
    except Exception as e:
        logger.error(f"Error getting similar books: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/recommendations/explain/<int:book_id1>/<int:book_id2>', methods=['GET'])
def explain_similarity(book_id1, book_id2):
    """
    Explain why two books are similar
    """
    try:
        explanation = rec_engine.explain_similarity(book_id1, book_id2)
        
        if explanation:
            return jsonify(explanation)
        else:
            return jsonify({'error': 'Could not explain similarity'}), 404
            
    except Exception as e:
        logger.error(f"Error explaining similarity: {str(e)}")
        return jsonify({'error': str(e)}), 500

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

"""
Test script for content-based filtering
"""
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

from recommendation_engine import RecommendationEngine
import json

def test_content_based_filtering():
    print("🧪 Testing Content-Based Filtering\n")
    print("=" * 70)
    
    # Initialize engine
    print("\n1️⃣ Initializing Recommendation Engine...")
    engine = RecommendationEngine()
    print("   ✅ Engine initialized successfully")
    
    # Test user 1 recommendations
    print("\n2️⃣ Getting recommendations for User 1...")
    user_1_recs = engine.get_user_recommendations(user_id=1, limit=5)
    
    print(f"\n📚 Recommended {len(user_1_recs)} books for User 1:")
    print("-" * 70)
    for i, rec in enumerate(user_1_recs, 1):
        print(f"\n{i}. {rec.get('title', 'N/A')}")
        print(f"   Author: {rec.get('author', 'N/A')}")
        print(f"   Genres: {rec.get('genres', 'N/A')}")
        print(f"   Rating: {rec.get('rating', 0):.2f}")
        print(f"   Similarity Score: {rec.get('similarity_score', 0):.3f}")
        print(f"   Genre Overlap: {rec.get('genre_overlap', 0)}")
        print(f"   Type: {rec.get('recommendation_type', 'N/A')}")
    
    # Test genre-based recommendations
    print("\n\n3️⃣ Testing Genre-Based Recommendations...")
    print("-" * 70)
    
    # Get Fantasy books
    fantasy_books = engine.get_recommendations_by_genre('Fantasy', limit=3)
    print(f"\n🧙 Top Fantasy Books ({len(fantasy_books)}):")
    for book in fantasy_books:
        print(f"  • {book['title']} by {book['author']} ({book['rating']:.2f}⭐)")
    
    # Get Romance books
    romance_books = engine.get_recommendations_by_genre('Romance', limit=3)
    print(f"\n❤️ Top Romance Books ({len(romance_books)}):")
    for book in romance_books:
        print(f"  • {book['title']} by {book['author']} ({book['rating']:.2f}⭐)")
    
    # Get Science Fiction books
    scifi_books = engine.get_recommendations_by_genre('Science Fiction', limit=3)
    print(f"\n🚀 Top Science Fiction Books ({len(scifi_books)}):")
    for book in scifi_books:
        print(f"  • {book['title']} by {book['author']} ({book['rating']:.2f}⭐)")
    
    print("\n" + "=" * 70)
    print("✅ All tests completed successfully!")
    print("=" * 70)

if __name__ == '__main__':
    try:
        test_content_based_filtering()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

"""
Test the new Content-Based Recommender with proper feature vectors
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from content_based_recommender import ContentBasedRecommender

def main():
    print("\n" + "=" * 70)
    print("🧪 TESTING CONTENT-BASED RECOMMENDER")
    print("=" * 70)
    
    # Initialize recommender
    print("\n📦 Initializing recommender...")
    recommender = ContentBasedRecommender()
    
    print(f"\n📊 Loaded {len(recommender.books_df)} books")
    print(f"📐 Feature matrix shape: {recommender.feature_matrix.shape}")
    
    # Test 1: Find similar books to a specific book
    print("\n" + "=" * 70)
    print("TEST 1: Find Similar Books")
    print("=" * 70)
    
    test_book_id = recommender.books_df.iloc[0]['id']
    test_book_title = recommender.books_df.iloc[0]['title']
    test_book_genre = recommender.books_df.iloc[0]['genres']
    
    print(f"\n📖 Test Book:")
    print(f"   ID: {test_book_id}")
    print(f"   Title: {test_book_title}")
    print(f"   Genres: {test_book_genre}")
    
    similar_books = recommender.get_similar_books(test_book_id, top_k=5)
    
    print(f"\n🎯 Top 5 Similar Books (using cosine similarity):")
    for idx, (book_id, score) in enumerate(similar_books, 1):
        book = recommender.books_df[recommender.books_df['id'] == book_id].iloc[0]
        print(f"\n   {idx}. {book['title']}")
        print(f"      Similarity: {score:.4f}")
        print(f"      Genres: {book['genres']}")
        print(f"      Author: {book['author']}")
    
    # Test 2: Get recommendations for a user (simulate with favorites)
    print("\n" + "=" * 70)
    print("TEST 2: User Recommendations")
    print("=" * 70)
    
    try:
        test_user_id = 1
        recommendations = recommender.get_recommendations_for_user(test_user_id, top_k=5)
        
        if recommendations:
            print(f"\n✅ Found {len(recommendations)} recommendations for user {test_user_id}")
            for idx, rec in enumerate(recommendations, 1):
                print(f"\n   {idx}. {rec['title']}")
                print(f"      Score: {rec['similarity_score']:.4f}")
                print(f"      Genres: {rec['genres']}")
                print(f"      Rating: {rec['average_rating']:.2f}")
        else:
            print(f"\n⚠️ No recommendations found (user may have no favorites)")
            
    except Exception as e:
        print(f"\n⚠️ Could not test user recommendations: {str(e)}")
    
    # Test 3: Explain similarity
    print("\n" + "=" * 70)
    print("TEST 3: Explain Similarity")
    print("=" * 70)
    
    if len(similar_books) >= 2:
        book1_id = test_book_id
        book2_id = similar_books[0][0]
        
        explanation = recommender.explain_similarity(book1_id, book2_id)
        
        if explanation:
            print(f"\n📋 Why these books are similar:")
            print(f"   Book 1: {explanation['book1']['title']}")
            print(f"   Book 2: {explanation['book2']['title']}")
            print(f"\n   Common genres: {', '.join(explanation['common_genres']) if explanation['common_genres'] else 'None'}")
            print(f"   Same author: {explanation['same_author']}")
            print(f"   Same country: {explanation['same_country']}")
            print(f"   Rating difference: {explanation['rating_diff']:.2f}")
    
    print("\n" + "=" * 70)
    print("✅ ALL TESTS COMPLETED!")
    print("=" * 70)

if __name__ == '__main__':
    main()

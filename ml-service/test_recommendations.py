import requests
import json

# Base URL for the ML service
BASE_URL = "http://localhost:5001"

def test_health():
    """Test health check endpoint"""
    print("=" * 60)
    print("Testing Health Check Endpoint")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print()
    except Exception as e:
        print(f"Error: {str(e)}")
        print()

def test_trending_books():
    """Test trending books endpoint"""
    print("=" * 60)
    print("Testing Trending Books Endpoint")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/recommendations/trending?limit=5")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print()
    except Exception as e:
        print(f"Error: {str(e)}")
        print()

def test_user_recommendations(user_id=1):
    """Test user recommendations endpoint"""
    print("=" * 60)
    print(f"Testing User Recommendations Endpoint (User ID: {user_id})")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/recommendations/user/{user_id}?limit=5")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print()
    except Exception as e:
        print(f"Error: {str(e)}")
        print()

def test_similar_books(book_id=1):
    """Test similar books endpoint"""
    print("=" * 60)
    print(f"Testing Similar Books Endpoint (Book ID: {book_id})")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/recommendations/similar/{book_id}?limit=5")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print()
    except Exception as e:
        print(f"Error: {str(e)}")
        print()

def test_genre_recommendations(genre="fiction"):
    """Test genre recommendations endpoint"""
    print("=" * 60)
    print(f"Testing Genre Recommendations Endpoint (Genre: {genre})")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/recommendations/genre/{genre}?limit=5")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print()
    except Exception as e:
        print(f"Error: {str(e)}")
        print()

def test_country_recommendations(country_code="US"):
    """Test country recommendations endpoint"""
    print("=" * 60)
    print(f"Testing Country Recommendations Endpoint (Country: {country_code})")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/recommendations/country/{country_code}?limit=5")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print()
    except Exception as e:
        print(f"Error: {str(e)}")
        print()

if __name__ == "__main__":
    print("\n🧪 Starting ML Service API Tests\n")
    
    # Run all tests
    test_health()
    test_trending_books()
    test_user_recommendations(user_id=1)
    test_similar_books(book_id=1)
    test_genre_recommendations(genre="fiction")
    test_country_recommendations(country_code="US")
    
    print("=" * 60)
    print("✅ All tests completed!")
    print("=" * 60)

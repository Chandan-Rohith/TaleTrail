from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'message': 'Mock ML service running'})


@app.route('/recommendations/user/<int:user_id>', methods=['GET'])
def user_recs(user_id):
    # Return a small static payload so frontend can test integration
    sample = [
        {'book_id': 1, 'title': 'Pride and Prejudice'},
        {'book_id': 2, 'title': '1984'},
        {'book_id': 3, 'title': 'To Kill a Mockingbird'}
    ]
    return jsonify({'user_id': user_id, 'recommendations': sample, 'total': len(sample)})


if __name__ == '__main__':
    # SECURITY: Bind to localhost only for local development
    # Use 0.0.0.0 only for temporary integration tests, never in production
    # Override via MOCK_HOST env var if needed
    import os
    host = os.environ.get('MOCK_HOST', '127.0.0.1')
    port = int(os.environ.get('MOCK_PORT', 5001))
    app.run(host=host, port=port)

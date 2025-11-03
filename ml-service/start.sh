#!/bin/bash

# Start script for ML Service on Render
echo "🚀 Starting TaleTrail ML Service..."

# Use gunicorn for production
exec gunicorn --bind 0.0.0.0:${FLASK_PORT:-5001} \
    --workers 2 \
    --threads 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    app:app

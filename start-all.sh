#!/bin/bash

# Combined startup script for Backend + ML Service
echo "🚀 Starting TaleTrail Backend and ML Service..."

# Start ML Service in background
cd ml-service
pip install -r requirements.txt
python app.py &
ML_PID=$!
echo "✅ ML Service started (PID: $ML_PID)"

# Go back and start backend
cd ..
cd backend
npm start

# If backend exits, kill ML service
kill $ML_PID

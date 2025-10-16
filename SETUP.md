# 📚 TaleTrail Setup Guide

## Prerequisites

Before setting up TaleTrail, make sure you have the following installed:

### Required Software
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)

### Check Your Installation
```bash
node --version
python --version
mysql --version
```

## 🚀 Quick Start Guide

### Step 1: Database Setup

1. **Start MySQL Server**
   ```bash
   # Windows (if installed as service)
   net start mysql
   
   # Or start MySQL Workbench/Command Line Client
   ```

2. **Create Database and Import Schema**
   ```bash
   mysql -u root -p
   ```
   
   In MySQL prompt:
   ```sql
   CREATE DATABASE taletrail_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE taletrail_db;
   SOURCE database/schema.sql;
   SOURCE database/sample_data.sql;
   ```

3. **Verify Database Setup**
   ```sql
   SHOW TABLES;
   SELECT COUNT(*) FROM books;
   SELECT COUNT(*) FROM countries;
   ```

### Step 2: Backend API Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   # Copy example environment file
   copy .env.example .env
   
   # Edit .env file with your MySQL credentials
   ```
   
   Update `.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=taletrail_db
   
   # JWT Secret (change this!)
   JWT_SECRET=your-super-secret-jwt-key-change-this
   
   # CORS Origin
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start Backend Server**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   🚀 TaleTrail Backend running on port 5000
   📚 Ready to serve book recommendations!
   ✅ Database connected successfully!
   ```

### Step 3: Python ML Service Setup

1. **Navigate to ML Service Directory**
   ```bash
   cd ml-service
   ```

2. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**
   ```bash
   # Copy example environment file
   copy .env.example .env
   ```
   
   Update `.env` file:
   ```env
   FLASK_PORT=5001
   FLASK_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=taletrail_db
   
   # Main API URL
   API_BASE_URL=http://localhost:5000
   ```

4. **Start ML Service**
   ```bash
   python app.py
   ```
   
   You should see:
   ```
   🚀 Starting TaleTrail ML Service on port 5001
   📚 Ready to generate book recommendations!
   ✅ Data loaded successfully for ML recommendations
   ```

### Step 4: Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend-html
   ```

2. **Option A: Simple File Opening**
   - Double-click `index.html` to open in your default browser
   - **Note**: Some features may not work due to CORS restrictions

3. **Option B: Local Server (Recommended)**
   
   Using Python:
   ```bash
   python -m http.server 3000
   ```
   
   Using Node.js:
   ```bash
   npx serve -s . -l 3000
   ```
   
   Using Live Server (VS Code Extension):
   - Install "Live Server" extension in VS Code
   - Right-click `index.html` and select "Open with Live Server"

4. **Access the Application**
   - Open your browser and go to `http://localhost:3000`
   - You should see the colorful TaleTrail homepage!

## 🎨 Features Overview

### ✨ What You Can Do

1. **🗺️ Interactive World Map**
   - Click on any country to see top-rated books
   - Hover for quick stats (book count, average rating)
   - Beautiful color-coded visualization

2. **📚 Book Discovery**
   - Browse trending books worldwide
   - Detailed book information with covers
   - User reviews and ratings
   - Rich descriptions and metadata

3. **👤 User Account Features**
   - Sign up/Login with secure authentication
   - Rate and review books (1-5 stars)
   - Personal reading history
   - Activity tracking

4. **🤖 AI-Powered Recommendations**
   - Personalized book suggestions
   - Based on your ratings and activity
   - Content-based and collaborative filtering
   - Trending books analysis

5. **🔍 Search Functionality**
   - Search by title, author, or country
   - Real-time search results
   - Advanced filtering options

## 🎨 Design Features

The UI features a warm, book-themed color palette:
- **Primary**: Burgundy (#8b1538) - Classic book binding
- **Secondary**: Golden (#f4a261) - Warm page colors  
- **Accent**: Forest Green (#2a9d8f) - Nature/growth
- **Background**: Cream (#f8f5f0) - Aged paper feel
- **Text**: Dark Brown (#3e2723) - Rich reading experience

## 🛠️ Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <process_id> /F
```

#### Database Connection Failed
```bash
# Check MySQL service
net start mysql

# Verify credentials in .env file
# Make sure database exists and has data
```

#### ML Service Python Errors
```bash
# Update pip and reinstall dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt --upgrade
```

#### Frontend CORS Issues
- Make sure you're using a local server (not file://)
- Check that backend CORS_ORIGIN matches frontend URL
- Verify backend is running on port 5000

### Performance Tips

1. **Database Optimization**
   - Ensure MySQL has adequate memory allocation
   - Consider indexing for large datasets

2. **ML Service**
   - Initial model training may take time
   - Recommendations improve with more user data

3. **Frontend Performance**
   - Use a proper local server for best experience
   - Clear browser cache if experiencing issues

## 🔧 Development Mode

### Making Changes

1. **Backend Changes**
   - Files auto-reload with nodemon
   - Check console for errors

2. **ML Service Changes**
   - Restart Python service after changes
   - Use Flask debug mode for development

3. **Frontend Changes**
   - Refresh browser to see changes
   - Use browser dev tools for debugging

### API Testing

Test your API endpoints:
```bash
# Health check
curl http://localhost:5000/api/health

# Get books
curl http://localhost:5000/api/books

# Get countries
curl http://localhost:5000/api/countries

# ML service health
curl http://localhost:5001/health
```

## 📊 Sample Data

The database comes with:
- **20 countries** with coordinates for map display
- **22 books** from various countries and genres
- **5 sample users** (password: "password123")
- **Sample ratings and reviews**
- **User interaction data** for ML training

### Test User Accounts
- bookworm_alice@example.com
- literature_lover@example.com  
- global_reader@example.com
- adventure_seeker@example.com
- story_explorer@example.com

All test accounts use password: `password123`

## 🚀 Production Deployment

For production deployment:

1. **Update Environment Variables**
   - Change JWT_SECRET to a secure random string
   - Update database credentials
   - Set NODE_ENV=production

2. **Database Security**
   - Create dedicated database user
   - Limit database permissions
   - Enable SSL connections

3. **API Security**
   - Use HTTPS
   - Implement rate limiting
   - Add API key authentication

4. **Frontend Optimization**
   - Minify CSS/JS files
   - Optimize images
   - Use CDN for static assets

## 🤝 Contributing

To contribute to TaleTrail:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Reading! 📚✨**

Enjoy exploring books from around the world with TaleTrail!
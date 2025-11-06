# 📚 TaleTrail - Discover Books Around the World

A colorful, interactive book discovery platform that takes you on a literary journey across the globe.

## 🌈 Design Philosophy
- **Warm & Inviting**: Rich earth tones, burgundy, golden yellows, and deep forest greens
- **Book-Themed**: Typography inspired by classic literature and cozy libraries
- **Colorful UI**: Vibrant gradients and warm color palettes that evoke the joy of reading

## ✨ Features
- 🗺️ Interactive world map showing top books by country
- 📖 Beautiful book cards with hover effects and tooltips
- 📚 Browse complete collection with search and filtering
- 🔥 Trending books and popular titles
- ⭐ User ratings and reviews
- 👤 User authentication and personalized experience
- ❤️ Favorite books collection
- 📱 Fully responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL
- npm or yarn

### Installation

1. **Clone and navigate to project**
```bash
cd taletrail
```

2. **Set up Backend**
```bash
cd backend
npm install
cp .env.example .env  # Create .env file and configure your database
npm start
```

3. **Set up Frontend**
```bash
cd frontend
# Open index.html in your browser or use a local server
# For local server (recommended):
python -m http.server 3000
# OR
npx serve -s . -l 3000
```

4. **Set up Database**
```bash
cd database
# Import the schema and sample data
mysql -u root -p < schema.sql
mysql -u root -p < sample_data.sql
```

## 📁 Project Structure
```
taletrail/
├── frontend/          # HTML/CSS/JS frontend with colorful UI
├── backend/           # Express.js API server with SQL-based recommendations
├── database/          # MySQL schema and sample data
└── README.md          # This file
```

## 🎨 Color Palette
- Primary: Warm burgundy (#8B1538)
- Secondary: Golden yellow (#F4A261)
- Accent: Forest green (#2A9D8F)
- Background: Cream (#F8F5F0)
- Text: Dark brown (#3E2723)

Built with ❤️ for book lovers everywhere.
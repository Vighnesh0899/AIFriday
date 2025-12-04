# 🚀 Quick Start - Frontend

Get the frontend running in 5 minutes!

## ⚡ Super Quick Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies (one-time, ~3 minutes)
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to: http://localhost:3000
```

That's it! 🎉

## 📋 Prerequisites

✅ Node.js 18+ installed
✅ Backend running on http://localhost:8000

**Check Node.js version:**
```bash
node --version  # Should show v18.x or higher
```

**Don't have Node.js?** Download from: https://nodejs.org/

## 🎯 What You'll See

1. **Upload Section** - Drag & drop CSV/JSON files
2. **Constraints Form** - Configure delivery parameters
3. **Generate Button** - Let AI optimize routes
4. **Map View** - Visualize routes with pins and paths
5. **Route Table** - View detailed stop sequences
6. **Export Button** - Download route plans

## 🧪 Try It Without Files

Click **"Load Sample Data"** button to try with demo delivery points!

## 📁 Required File Format

**CSV Example:**
```csv
id,customer_name,lat,lng,address
1,Customer A,40.7128,-74.0060,123 Main St
2,Customer B,40.7589,-73.9851,456 Park Ave
```

**JSON Example:**
```json
[
  {
    "id": 1,
    "customer_name": "Customer A",
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Main St"
  }
]
```

## 🔧 Common Issues

### Port Already in Use?
```bash
# Use different port
npm run dev -- --port 3001
```

### Backend Not Responding?
1. Make sure backend is running: `http://localhost:8000`
2. Check backend status indicator (top-right corner)

### Dependencies Not Installing?
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📚 More Help

- **Detailed Setup**: See `SETUP_GUIDE.md`
- **Full Documentation**: See `README.md`
- **Code Overview**: See `FRONTEND_SUMMARY.md`

## 🎨 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run test     # Run tests
npm run lint     # Check code quality
```

## ✨ Key Features

- 📤 File upload with drag & drop
- 🗺️ Interactive map visualization
- 🤖 AI-powered route optimization
- 📊 Detailed route tables
- 💾 Export to JSON/CSV
- 📱 Responsive design
- ⚡ Fast performance

## 🎯 Next Steps

1. ✅ Start frontend (you're here!)
2. ⏭️ Set up backend (next step)
3. 🚀 Generate optimized routes
4. 💾 Export and use route plans

---

**Need help?** Check the detailed guides in the documentation!

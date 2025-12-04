# AI Route Optimization Frontend

A modern, production-ready React application for AI-powered distribution route optimization.

## 🚀 Features

- **File Upload**: Support for CSV and JSON delivery data files
- **Interactive Map**: Real-time visualization of delivery points and optimized routes using Leaflet
- **Constraint Configuration**: Flexible form to set delivery constraints (max stops, time windows, vehicle capacity)
- **AI-Powered Optimization**: Uses OpenAI GPT models for intelligent route planning
- **Route Visualization**: Color-coded routes with detailed stop information
- **Export Functionality**: Download route plans as JSON or CSV
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Production-Ready**: Built with best practices and enterprise-level code quality

## 📋 Tech Stack

- **React 18.2** - Modern React with hooks
- **Vite 5.0** - Fast build tool and dev server
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **React Leaflet 4.2** - Interactive maps
- **Axios 1.6** - HTTP client
- **Lucide React** - Beautiful icon library
- **Papa Parse** - CSV parsing
- **ESLint** - Code linting

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── FileUpload.jsx      # File upload with drag & drop
│   │   ├── ConstraintsForm.jsx # Delivery constraints form
│   │   ├── MapView.jsx         # Interactive map component
│   │   ├── RouteTable.jsx      # Route details table
│   │   └── ExportButton.jsx    # Export functionality
│   ├── services/           # API services
│   │   └── api.js              # Backend API client
│   ├── utils/              # Utility functions
│   │   └── helpers.js          # Helper functions
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8000`

### Steps

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file** (optional):
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` to configure API URL if different from default:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**:
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Step 1: Upload Delivery Data

1. Click the upload area or drag & drop a CSV/JSON file
2. Or click "Load Sample Data" to use demo data

**Required File Format**:
- **CSV/JSON fields**: `id`, `customer_name`, `lat`, `lng`, `address`
- **Optional fields**: `delivery_window`, `priority`, `notes`

**Example CSV**:
```csv
id,customer_name,lat,lng,address,delivery_window
1,Customer A,40.7128,-74.0060,123 Main St,09:00-12:00
2,Customer B,40.7589,-73.9851,456 Park Ave,13:00-16:00
```

**Example JSON**:
```json
[
  {
    "id": 1,
    "customer_name": "Customer A",
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Main St",
    "delivery_window": "09:00-12:00"
  }
]
```

### Step 2: Configure Constraints

Set your operational constraints:
- **Max Stops Per Route**: Maximum deliveries per route (1-50)
- **Vehicle Capacity**: Total vehicle capacity in units
- **Delivery Window**: Start and end times for deliveries
- **Start Location**: Warehouse/depot address

### Step 3: Generate Routes

Click "Generate Routes" to let AI optimize your delivery plan. The system will:
- Analyze delivery locations and constraints
- Group deliveries into efficient routes
- Calculate optimal sequences
- Estimate distances and times

### Step 4: Review Results

- **Map View**: See routes visualized with color-coded paths
- **Route Table**: Review detailed stop sequences and metrics
- **Export**: Download route plans as JSON or CSV

## 🎨 Components Overview

### FileUpload Component
- Drag & drop interface
- CSV/JSON parsing
- Data validation
- Real-time feedback

### ConstraintsForm Component
- Form validation
- Real-time updates
- Helpful tooltips
- Error handling

### MapView Component
- Interactive Leaflet map
- Color-coded route visualization
- Clickable markers with details
- Auto-fit bounds
- Route legend

### RouteTable Component
- Expandable route details
- Summary metrics
- Stop sequences
- Distance/time estimates

### ExportButton Component
- JSON export (complete data)
- CSV export (flattened table)
- Success feedback
- Format selection menu

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

## 🌐 API Integration

The frontend communicates with the FastAPI backend through the following endpoints:

### Health Check
```
GET /api/health
```

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data
```

### Generate Routes
```
POST /api/generate-routes
Content-Type: application/json

Body:
{
  "delivery_points": [...],
  "constraints": {...}
}
```

### Get Sample Data
```
GET /api/get-sample-data
```

## 🎯 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000/api` |

## 🧪 Testing

Run tests with:
```bash
npm run test
```

Tests cover:
- Component rendering
- User interactions
- API integration
- Data validation
- Error handling

## 🚀 Production Build

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Preview build**:
   ```bash
   npm run preview
   ```

3. **Deploy**: 
   Upload the `dist/` folder to your hosting service (Vercel, Netlify, AWS S3, etc.)

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in backend
- Verify API endpoints match configuration

### Map Not Displaying
- Check browser console for errors
- Ensure Leaflet CSS is loaded
- Verify coordinates are valid

### File Upload Fails
- Check file format (CSV/JSON only)
- Verify required fields are present
- Ensure coordinates are within valid ranges

### Routes Not Generating
- Verify OpenAI API key is configured in backend
- Check backend logs for errors
- Ensure delivery data is valid

## 📦 Dependencies

### Production
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-leaflet`: ^4.2.1
- `leaflet`: ^1.9.4
- `axios`: ^1.6.2
- `lucide-react`: ^0.294.0
- `papaparse`: ^5.4.1

### Development
- `vite`: ^5.0.8
- `@vitejs/plugin-react`: ^4.2.1
- `tailwindcss`: ^3.3.6
- `autoprefixer`: ^10.4.16
- `postcss`: ^8.4.32
- `eslint`: ^8.55.0

## 🤝 Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed

## 📄 License

This project is part of the AI Route Optimization System.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review backend logs
3. Verify API configuration
4. Check browser console for errors

## 🔄 Updates

### Version 1.0.0
- Initial release
- Full feature implementation
- Production-ready code
- Comprehensive documentation

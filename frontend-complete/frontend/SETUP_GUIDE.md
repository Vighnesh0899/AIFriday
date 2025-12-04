# Frontend Setup Guide

Complete step-by-step guide to set up and run the AI Route Optimization frontend.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Testing](#testing)
6. [Building for Production](#building-for-production)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Node.js** (v18.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version  # Should show v18.x or higher
     npm --version   # Should show 9.x or higher
     ```

2. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

### System Requirements

- **OS**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 500MB free space
- **Internet**: Required for initial setup and map tiles

---

## Installation

### Step 1: Navigate to Frontend Directory

```bash
cd route-optimization-app/frontend
```

### Step 2: Install Dependencies

Using npm (recommended):
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

This will install all required dependencies listed in `package.json`:
- React 18 and React DOM
- Vite build tool
- Tailwind CSS
- React Leaflet (for maps)
- Axios (for API calls)
- And more...

**Installation Time**: 2-5 minutes depending on internet speed

### Step 3: Verify Installation

Check if all dependencies are installed:
```bash
npm list --depth=0
```

You should see a list of installed packages without errors.

---

## Configuration

### Environment Variables (Optional)

1. **Create .env file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit .env file** (if needed):
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:8000/api
   ```

   **Note**: The default configuration works if your backend runs on `http://localhost:8000`

### Backend Connection

Ensure the backend API is running before starting the frontend:
- Backend should be accessible at: `http://localhost:8000`
- Test backend health: `curl http://localhost:8000/api/health`

---

## Running the Application

### Development Mode

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Expected output**:
   ```
   VITE v5.0.8  ready in XXX ms

   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ➜  press h to show help
   ```

3. **Open browser**:
   Navigate to `http://localhost:3000`

### Development Features

- **Hot Module Replacement (HMR)**: Changes reflect instantly
- **Fast Refresh**: Component state preserved on updates
- **Source Maps**: Easy debugging in browser DevTools
- **Error Overlay**: Build errors shown in browser

### Port Configuration

If port 3000 is already in use, Vite will automatically try the next available port. You can specify a custom port:

```bash
npm run dev -- --port 3001
```

Or edit `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3001
  }
})
```

---

## Testing

### Run All Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test -- --watch
```

### Run Tests with Coverage

```bash
npm run test -- --coverage
```

### Test Structure

```
src/
└── __tests__/
    ├── FileUpload.test.jsx      # Component tests
    ├── helpers.test.js          # Utility tests
    └── ...
```

### Writing New Tests

Example test file:
```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

---

## Building for Production

### Step 1: Create Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory:
- Minified JavaScript and CSS
- Optimized assets
- Source maps (optional)

**Build Time**: 30-60 seconds

### Step 2: Preview Production Build

```bash
npm run preview
```

Opens production build at `http://localhost:4173`

### Step 3: Deploy

Upload the `dist/` folder to your hosting service:

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### AWS S3
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

---

## Troubleshooting

### Issue: Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
1. Kill the process using port 3000:
   ```bash
   # On macOS/Linux
   lsof -ti:3000 | xargs kill -9
   
   # On Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Or use a different port:
   ```bash
   npm run dev -- --port 3001
   ```

### Issue: Dependencies Not Installing

**Error**: `npm install` fails

**Solutions**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Use npm v9 or higher:
   ```bash
   npm install -g npm@latest
   ```

### Issue: Backend Connection Failed

**Error**: "Backend server is not responding"

**Solutions**:
1. Verify backend is running:
   ```bash
   curl http://localhost:8000/api/health
   ```

2. Check CORS settings in backend

3. Verify API URL in `.env` file

4. Check browser console for CORS errors

### Issue: Map Not Displaying

**Error**: Map container shows blank

**Solutions**:
1. Check browser console for Leaflet errors

2. Verify Leaflet CSS is loaded in `index.html`

3. Check if coordinates are valid

4. Clear browser cache and reload

### Issue: File Upload Fails

**Error**: File upload returns validation error

**Solutions**:
1. Verify file format (CSV or JSON)

2. Check required fields: `id`, `customer_name`, `lat`, `lng`, `address`

3. Validate coordinate ranges:
   - Latitude: -90 to 90
   - Longitude: -180 to 180

4. Check file encoding (should be UTF-8)

### Issue: Build Fails

**Error**: Build process fails with errors

**Solutions**:
1. Clear build cache:
   ```bash
   rm -rf dist node_modules/.vite
   ```

2. Fix any TypeScript/ESLint errors:
   ```bash
   npm run lint
   ```

3. Update dependencies:
   ```bash
   npm update
   ```

### Issue: Slow Performance

**Symptoms**: Application feels sluggish

**Solutions**:
1. Check browser DevTools Performance tab

2. Reduce number of delivery points (< 100 for best performance)

3. Close unnecessary browser tabs

4. Use production build for testing:
   ```bash
   npm run build && npm run preview
   ```

---

## Additional Commands

### Code Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint -- --fix
```

### Dependency Updates

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update to latest major versions (careful!)
npm install <package>@latest
```

### Clear Cache

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear npm cache
npm cache clean --force
```

---

## Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Backend API running on port 8000
- [ ] Development server started (`npm run dev`)
- [ ] Browser opened to `http://localhost:3000`
- [ ] Backend status shows "online"
- [ ] Sample data loads successfully

---

## Getting Help

1. **Check Documentation**: Review README.md
2. **Check Logs**: Browser console and terminal output
3. **Backend Logs**: Check backend server logs
4. **Dependencies**: Ensure all packages are installed
5. **Network**: Verify backend connectivity

---

## Development Tips

### Hot Reload
- Save files to see changes instantly
- Component state is preserved
- Errors shown in browser overlay

### Browser DevTools
- **Console**: View logs and errors
- **Network**: Monitor API calls
- **React DevTools**: Inspect component tree
- **Performance**: Profile application

### Code Quality
- Run linter before committing: `npm run lint`
- Write tests for new features
- Follow existing code patterns
- Add comments for complex logic

---

## Next Steps

After successful setup:

1. **Upload Sample Data**: Click "Load Sample Data" button
2. **Configure Constraints**: Set delivery parameters
3. **Generate Routes**: Click "Generate Routes" button
4. **View Results**: Explore map and route tables
5. **Export Data**: Download route plans

---

## Support

For issues not covered here:
1. Review main README.md
2. Check backend documentation
3. Verify system requirements
4. Test with sample data first

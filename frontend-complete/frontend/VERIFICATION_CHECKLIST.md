# ✅ Frontend Verification Checklist

Use this checklist to verify your frontend is set up correctly.

## 📋 Pre-Installation Checks

### 1. Node.js Installation
```bash
node --version
# Expected: v18.0.0 or higher
```
- [ ] Node.js version is 18 or higher
- [ ] npm is available

### 2. Directory Structure
```bash
cd frontend
ls
# Expected: package.json, src/, index.html, etc.
```
- [ ] All files are present
- [ ] No missing directories

---

## 🔧 Installation Verification

### 1. Install Dependencies
```bash
npm install
```

**Check for:**
- [ ] No error messages
- [ ] `node_modules/` directory created
- [ ] All packages installed successfully

**Common Issues:**
- If errors occur, try: `npm cache clean --force`
- Then reinstall: `rm -rf node_modules && npm install`

### 2. Verify Package Installation
```bash
npm list --depth=0
```

**Expected packages:**
- [ ] react@18.2.0
- [ ] react-dom@18.2.0
- [ ] vite@5.0.8
- [ ] tailwindcss@3.3.6
- [ ] react-leaflet@4.2.1
- [ ] axios@1.6.2

---

## 🚀 Development Server

### 1. Start Dev Server
```bash
npm run dev
```

**Expected output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**Checks:**
- [ ] Server starts without errors
- [ ] Port 3000 is available (or uses next available)
- [ ] No compilation errors

### 2. Open in Browser
Navigate to: `http://localhost:3000`

**Visual Checks:**
- [ ] Page loads successfully
- [ ] Header shows "AI Route Optimizer"
- [ ] Three main sections visible:
  1. Upload Delivery Data
  2. Configure Constraints
  3. Generate Optimized Routes
- [ ] Backend status indicator in top right
- [ ] No console errors in browser DevTools

### 3. UI Elements
- [ ] File upload area is visible
- [ ] "Load Sample Data" button present
- [ ] Constraints form has all fields
- [ ] "Generate Routes" button visible

---

## 🎯 Feature Testing

### 1. File Upload (Without Backend)
**Test drag & drop zone:**
- [ ] Hover shows blue highlight
- [ ] Click opens file picker
- [ ] Help text is visible

**Expected behavior (without backend):**
- Files can be selected
- Backend offline warning may appear

### 2. Constraints Form
**Test all form fields:**
- [ ] Max Stops Per Route (number input)
- [ ] Vehicle Capacity (number input)
- [ ] Delivery Window Start (time input)
- [ ] Delivery Window End (time input)
- [ ] Start Location (text input)
- [ ] Optional coordinates (number inputs)

**Interaction checks:**
- [ ] All fields accept input
- [ ] No console errors on typing
- [ ] Form updates properly

### 3. Map Container
**Visual check:**
- [ ] Empty state shows "No delivery points"
- [ ] Map icon visible
- [ ] Help text displayed

### 4. Backend Status Indicator
**Check status display:**
- [ ] Shows "Backend checking..." initially
- [ ] Changes to "Backend offline" if no backend
- [ ] Status dot color matches state (red/yellow/green)

---

## 🧪 Test Execution

### 1. Run Tests
```bash
npm run test
```

**Expected:**
- [ ] All tests pass
- [ ] No test failures
- [ ] Coverage report generated

**Test files:**
- [ ] FileUpload.test.jsx runs
- [ ] helpers.test.js runs

### 2. Linting
```bash
npm run lint
```

**Expected:**
- [ ] No linting errors
- [ ] Code follows ESLint rules
- [ ] All files pass validation

---

## 🏗️ Build Process

### 1. Production Build
```bash
npm run build
```

**Expected:**
- [ ] Build completes successfully
- [ ] `dist/` directory created
- [ ] No build errors

**Check dist/ contents:**
- [ ] index.html exists
- [ ] assets/ directory with JS/CSS
- [ ] Optimized and minified files

### 2. Preview Production
```bash
npm run preview
```

**Expected:**
- [ ] Server starts on port 4173
- [ ] Production build works
- [ ] No console errors

---

## 🔗 Backend Integration (Optional)

If backend is running on port 8000:

### 1. Backend Connection
**Check status indicator:**
- [ ] Shows "Backend online"
- [ ] Green status dot
- [ ] No connection errors

### 2. Sample Data
**Click "Load Sample Data" button:**
- [ ] Data loads successfully
- [ ] Success message appears
- [ ] Console shows API call

### 3. Full Flow Test
1. **Load Sample Data**
   - [ ] 10-20 delivery points loaded
   
2. **Configure Constraints**
   - [ ] Fill in all required fields
   - [ ] No validation errors
   
3. **Generate Routes**
   - [ ] Click "Generate Routes"
   - [ ] Loading spinner appears
   - [ ] Routes generated successfully
   
4. **View Results**
   - [ ] Map displays with markers
   - [ ] Routes shown as polylines
   - [ ] Table shows route details
   
5. **Export Data**
   - [ ] Click "Export Route Plan"
   - [ ] Choose JSON or CSV
   - [ ] File downloads successfully

---

## 📱 Responsive Design

### Desktop (> 1024px)
- [ ] Three-column layout where appropriate
- [ ] Full map view
- [ ] All features visible

### Tablet (640px - 1024px)
- [ ] Two-column layout
- [ ] Forms stack properly
- [ ] Map responsive

### Mobile (< 640px)
- [ ] Single column layout
- [ ] Buttons stack vertically
- [ ] Map adjusts to width
- [ ] Text readable

---

## 🌐 Browser Compatibility

### Test in Multiple Browsers:
- [ ] Chrome/Edge 90+ works
- [ ] Firefox 88+ works
- [ ] Safari 14+ works
- [ ] No browser-specific errors

---

## 📊 Performance Checks

### Development
- [ ] Hot reload works
- [ ] Changes reflect instantly
- [ ] No lag in UI

### Production Build
```bash
npm run build
```

**Check bundle sizes:**
- [ ] Total size < 500KB gzipped
- [ ] Main JS < 200KB
- [ ] Vendor JS < 150KB
- [ ] CSS < 20KB

### Lighthouse Audit
Run in Chrome DevTools:
- [ ] Performance: 90+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 90+

---

## 🐛 Common Issues & Solutions

### Issue: Port 3000 in use
**Solution:**
```bash
npm run dev -- --port 3001
```
- [ ] Server starts on alternate port

### Issue: Dependencies won't install
**Solution:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```
- [ ] Clean install succeeds

### Issue: Map not displaying
**Check:**
- [ ] Leaflet CSS loaded in index.html
- [ ] No 404 errors for map tiles
- [ ] Browser console clear

### Issue: Build fails
**Solution:**
```bash
rm -rf dist node_modules/.vite
npm run build
```
- [ ] Clean build succeeds

---

## ✅ Final Verification

### Complete Checklist
- [ ] All dependencies installed
- [ ] Dev server runs without errors
- [ ] All UI components visible
- [ ] Tests pass
- [ ] Linting passes
- [ ] Production build works
- [ ] Backend integration ready
- [ ] Responsive design verified
- [ ] No console errors
- [ ] Documentation reviewed

---

## 🎉 Success Criteria

Your frontend is ready when:
1. ✅ `npm run dev` starts without errors
2. ✅ Page loads at http://localhost:3000
3. ✅ All UI elements are visible
4. ✅ Tests pass (`npm run test`)
5. ✅ Production build succeeds (`npm run build`)

---

## 📝 Notes for Backend Integration

When backend is ready:
1. Ensure backend runs on port 8000
2. CORS must be configured
3. All API endpoints implemented:
   - GET /api/health
   - POST /api/upload
   - POST /api/generate-routes
   - GET /api/get-sample-data

---

## 🆘 Need Help?

If any checks fail:
1. Review error messages carefully
2. Check SETUP_GUIDE.md for detailed steps
3. Verify Node.js version
4. Ensure all files are present
5. Check browser console for errors

---

**Frontend Status**: 
- Installation: ⬜
- Development: ⬜
- Testing: ⬜
- Production Build: ⬜
- Integration Ready: ⬜

Mark each as ✅ when verified!

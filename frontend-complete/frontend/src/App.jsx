import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, Loader2, Database } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ConstraintsForm from './components/ConstraintsForm';
import MapView from './components/MapView';
import RouteTable from './components/RouteTable';
import ExportButton from './components/ExportButton';
import { generateRoutes, getSampleData, healthCheck } from './services/api';

/**
 * Main App Component
 * Orchestrates the entire route optimization workflow
 */
function App() {
  // State management
  const [deliveryData, setDeliveryData] = useState(null);
  const [constraints, setConstraints] = useState({
    maxStopsPerRoute: 10,
    deliveryWindowStart: '08:00',
    deliveryWindowEnd: '18:00',
    vehicleCapacity: 100,
    startLocation: 'Main Warehouse',
    startLat: '',
    startLng: '',
  });
  const [routes, setRoutes] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'

  /**
   * Check backend health on mount
   */
  useEffect(() => {
    checkBackendHealth();
  }, []);

  /**
   * Check if backend is reachable
   */
  const checkBackendHealth = async () => {
    try {
      await healthCheck();
      setBackendStatus('online');
    } catch (err) {
      setBackendStatus('offline');
      console.error('Backend health check failed:', err);
    }
  };

  /**
   * Handle file data load
   */
  const handleDataLoaded = (data) => {
    setDeliveryData(data);
    setRoutes(null); // Clear previous routes
    setError(null);
    console.log('Delivery data loaded:', data.length, 'points');
  };

  /**
   * Handle file upload error
   */
  const handleFileError = (errorMsg) => {
    setError(errorMsg);
    console.error('File error:', errorMsg);
  };

  /**
   * Handle constraints change
   */
  const handleConstraintsChange = (newConstraints) => {
    setConstraints(newConstraints);
  };

  /**
   * Load sample data
   */
  const handleLoadSample = async () => {
    try {
      setError(null);
      const response = await getSampleData();
      setDeliveryData(response.data);
      setRoutes(null);
      console.log('Sample data loaded');
    } catch (err) {
      setError('Failed to load sample data. Please check if backend is running.');
      console.error('Sample data error:', err);
    }
  };

  /**
   * Generate optimized routes using AI
   */
  const handleGenerateRoutes = async () => {
    if (!deliveryData || deliveryData.length === 0) {
      setError('Please upload delivery data first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setRoutes(null);

    try {
      console.log('Generating routes with constraints:', constraints);
      
      const payload = {
        delivery_points: deliveryData,
        constraints: constraints,
      };

      const response = await generateRoutes(payload);
      
      console.log('Routes generated:', response);
      setRoutes(response.routes);

    } catch (err) {
      const errorMessage = err.message || 'Failed to generate routes. Please try again.';
      setError(errorMessage);
      console.error('Route generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Prepare export data
   */
  const getExportData = () => {
    return {
      routes: routes,
      delivery_points: deliveryData,
      constraints: constraints,
    };
  };

  /**
   * Get start location for map
   */
  const getStartLocation = () => {
    if (constraints.startLat && constraints.startLng) {
      return {
        lat: parseFloat(constraints.startLat),
        lng: parseFloat(constraints.startLng),
      };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 rounded-lg p-2">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Route Optimizer
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Intelligent Distribution Planning for CPG Companies
                </p>
              </div>
            </div>
            
            {/* Backend status indicator */}
            <div className="flex items-center space-x-2">
              <div className={`
                w-3 h-3 rounded-full
                ${backendStatus === 'online' ? 'bg-green-500' : 
                  backendStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}
              `}></div>
              <span className="text-sm text-gray-600">
                Backend {backendStatus === 'checking' ? 'checking...' : backendStatus}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Backend Offline Warning */}
        {backendStatus === 'offline' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
              <p className="text-sm font-medium text-yellow-800">Backend Not Available</p>
              <p className="text-sm text-yellow-700 mt-1">
                The backend server is not responding. Please ensure it's running on http://localhost:8000
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Data Upload */}
        <section className="mb-8 fade-in">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span>Upload Delivery Data</span>
              </h2>
              <button
                onClick={handleLoadSample}
                disabled={backendStatus !== 'online'}
                className="btn-secondary flex items-center space-x-2"
              >
                <Database className="w-4 h-4" />
                <span>Load Sample Data</span>
              </button>
            </div>
            <FileUpload
              onDataLoaded={handleDataLoaded}
              onError={handleFileError}
            />
            {deliveryData && (
              <div className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                ✓ Loaded {deliveryData.length} delivery points
              </div>
            )}
          </div>
        </section>

        {/* Step 2: Configure Constraints */}
        <section className="mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2 mb-6">
              <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>Configure Constraints</span>
            </h2>
            <ConstraintsForm
              initialConstraints={constraints}
              onConstraintsChange={handleConstraintsChange}
            />
          </div>
        </section>

        {/* Step 3: Generate Routes */}
        <section className="mb-8 fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2 mb-6">
              <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>Generate Optimized Routes</span>
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Click the button to let AI optimize your delivery routes based on the constraints above.
              </p>
              <button
                onClick={handleGenerateRoutes}
                disabled={!deliveryData || isGenerating || backendStatus !== 'online'}
                className={`
                  btn-primary flex items-center space-x-2 px-8 py-3
                  ${isGenerating ? 'opacity-75 cursor-wait' : ''}
                `}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Routes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {routes && routes.length > 0 && (
          <section className="space-y-8 fade-in" style={{ animationDelay: '0.3s' }}>
            {/* Export Button */}
            <div className="flex justify-end">
              <ExportButton
                routeData={getExportData()}
                disabled={!routes || routes.length === 0}
              />
            </div>

            {/* Map View */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Route Visualization</h2>
              </div>
              <div className="h-[500px] rounded-lg overflow-hidden">
                <MapView
                  deliveryPoints={deliveryData}
                  routes={routes}
                  startLocation={getStartLocation()}
                />
              </div>
            </div>

            {/* Route Details Table */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Route Details</h2>
              </div>
              <RouteTable
                routes={routes}
                deliveryPoints={deliveryData}
              />
            </div>
          </section>
        )}

        {/* Empty state when no routes generated yet */}
        {!routes && !isGenerating && deliveryData && (
          <div className="card text-center py-12 fade-in">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Optimize Routes
            </h3>
            <p className="text-gray-600">
              Click "Generate Routes" to let AI create optimized delivery routes for your data
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            AI-Powered Route Optimization System | Built with React 18, FastAPI & OpenAI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

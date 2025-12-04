import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Map as MapIcon, Navigation } from 'lucide-react';
import L from 'leaflet';
import { getRouteColor, calculateMapBounds } from '../utils/helpers';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Component to fit map bounds to show all markers
 */
const FitBounds = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = calculateMapBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);

  return null;
};

/**
 * Create custom colored icon for route markers
 */
const createColoredIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 12px;
      ">
        ${label}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

/**
 * MapView Component
 * Displays delivery locations and optimized routes on an interactive map
 * 
 * @param {Array} deliveryPoints - Array of delivery locations
 * @param {Array} routes - Array of optimized routes
 * @param {Object} startLocation - Starting location coordinates
 */
const MapView = ({ deliveryPoints = [], routes = [], startLocation = null }) => {
  const mapRef = useRef(null);

  // Default center (will be overridden by FitBounds)
  const defaultCenter = [40.7128, -74.0060]; // New York City
  const defaultZoom = 12;

  /**
   * Get all points for map bounds calculation
   */
  const getAllPoints = () => {
    const points = [...deliveryPoints];
    if (startLocation && startLocation.lat && startLocation.lng) {
      points.unshift(startLocation);
    }
    return points;
  };

  /**
   * Render route polylines
   */
  const renderRoutes = () => {
    if (!routes || routes.length === 0) return null;

    return routes.map((route, routeIndex) => {
      const color = getRouteColor(routeIndex);
      const positions = [];

      // Add start location if available
      if (startLocation && startLocation.lat && startLocation.lng) {
        positions.push([startLocation.lat, startLocation.lng]);
      }

      // Add all stops in the route
      route.stops.forEach(stop => {
        const point = deliveryPoints.find(p => p.id === stop.id);
        if (point) {
          positions.push([point.lat, point.lng]);
        }
      });

      // Return to start location
      if (startLocation && startLocation.lat && startLocation.lng) {
        positions.push([startLocation.lat, startLocation.lng]);
      }

      return (
        <Polyline
          key={`route-${routeIndex}`}
          positions={positions}
          color={color}
          weight={4}
          opacity={0.7}
        />
      );
    });
  };

  /**
   * Render delivery point markers
   */
  const renderMarkers = () => {
    return deliveryPoints.map((point, index) => {
      // Find which route this point belongs to
      let routeIndex = -1;
      let stopNumber = -1;

      routes.forEach((route, rIndex) => {
        const stopIndex = route.stops.findIndex(s => s.id === point.id);
        if (stopIndex !== -1) {
          routeIndex = rIndex;
          stopNumber = stopIndex + 1;
        }
      });

      const color = routeIndex >= 0 ? getRouteColor(routeIndex) : '#6B7280';
      const label = stopNumber > 0 ? stopNumber : '?';

      return (
        <Marker
          key={`marker-${point.id}`}
          position={[point.lat, point.lng]}
          icon={createColoredIcon(color, label)}
        >
          <Popup>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">{point.customer_name}</h4>
              <p className="text-sm text-gray-600">{point.address}</p>
              {routeIndex >= 0 && (
                <div className="text-xs text-gray-500">
                  <p>Route: {routeIndex + 1}</p>
                  <p>Stop: {stopNumber}</p>
                </div>
              )}
              {point.delivery_window && (
                <p className="text-xs text-gray-500">
                  Window: {point.delivery_window}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      );
    });
  };

  /**
   * Render start location marker
   */
  const renderStartMarker = () => {
    if (!startLocation || !startLocation.lat || !startLocation.lng) return null;

    const startIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: #10B981;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 3px 8px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        ">
          🏢
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });

    return (
      <Marker
        position={[startLocation.lat, startLocation.lng]}
        icon={startIcon}
      >
        <Popup>
          <div className="space-y-2">
            <h4 className="font-semibold text-green-800">Start Location</h4>
            <p className="text-sm text-gray-600">Depot/Warehouse</p>
          </div>
        </Popup>
      </Marker>
    );
  };

  // If no data, show empty state
  if (!deliveryPoints || deliveryPoints.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center space-y-3">
          <MapIcon className="w-16 h-16 text-gray-400 mx-auto" />
          <p className="text-gray-600 font-medium">No delivery points to display</p>
          <p className="text-sm text-gray-500">Upload a file to see delivery locations on the map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-md border border-gray-200">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Fit bounds to show all points */}
        <FitBounds points={getAllPoints()} />
        
        {/* Render route polylines */}
        {renderRoutes()}
        
        {/* Render start location marker */}
        {renderStartMarker()}
        
        {/* Render delivery markers */}
        {renderMarkers()}
      </MapContainer>

      {/* Map legend */}
      {routes && routes.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] max-w-xs">
          <div className="flex items-center space-x-2 mb-2">
            <Navigation className="w-4 h-4 text-gray-600" />
            <h4 className="font-semibold text-sm text-gray-800">Routes</h4>
          </div>
          <div className="space-y-1">
            {routes.map((route, index) => (
              <div key={`legend-${index}`} className="flex items-center space-x-2 text-xs">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: getRouteColor(index) }}
                ></div>
                <span className="text-gray-700">
                  Route {index + 1} ({route.stops.length} stops)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;

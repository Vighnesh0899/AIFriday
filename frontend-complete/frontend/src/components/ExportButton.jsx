import React, { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, Check } from 'lucide-react';
import { exportToJSON, exportToCSV } from '../utils/helpers';

/**
 * ExportButton Component
 * Provides options to export route data in different formats
 * 
 * @param {Object} routeData - Complete route data to export
 * @param {Boolean} disabled - Whether export is disabled
 */
const ExportButton = ({ routeData, disabled = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [exported, setExported] = useState(false);

  /**
   * Handle JSON export
   */
  const handleExportJSON = () => {
    try {
      const exportData = {
        generated_at: new Date().toISOString(),
        summary: {
          total_routes: routeData.routes?.length || 0,
          total_stops: routeData.routes?.reduce((acc, route) => acc + route.stops.length, 0) || 0,
          total_distance: routeData.routes?.reduce((acc, route) => acc + (route.total_distance || 0), 0) || 0,
        },
        constraints: routeData.constraints,
        routes: routeData.routes,
        delivery_points: routeData.delivery_points,
      };

      exportToJSON(exportData, `route-plan-${Date.now()}.json`);
      
      // Show success feedback
      setExported(true);
      setTimeout(() => setExported(false), 2000);
      setShowMenu(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  /**
   * Handle CSV export (flattened route data)
   */
  const handleExportCSV = () => {
    try {
      // Flatten routes data for CSV export
      const flattenedData = [];

      routeData.routes?.forEach((route, routeIndex) => {
        route.stops.forEach((stop, stopIndex) => {
          const point = routeData.delivery_points?.find(p => p.id === stop.id) || {};
          flattenedData.push({
            route_id: routeIndex + 1,
            stop_sequence: stopIndex + 1,
            customer_id: stop.id,
            customer_name: point.customer_name || '',
            address: point.address || '',
            latitude: point.lat || '',
            longitude: point.lng || '',
            delivery_window: point.delivery_window || '',
            distance_from_previous: stop.distance || '',
            route_total_distance: route.total_distance || '',
            route_estimated_time: route.estimated_time || '',
          });
        });
      });

      exportToCSV(flattenedData, `route-plan-${Date.now()}.csv`);
      
      // Show success feedback
      setExported(true);
      setTimeout(() => setExported(false), 2000);
      setShowMenu(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  return (
    <div className="relative">
      {/* Main export button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled}
        className={`
          flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold
          transition-all duration-200 shadow-md
          ${disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : exported 
              ? 'bg-green-600 text-white' 
              : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg'
          }
        `}
      >
        {exported ? (
          <>
            <Check className="w-5 h-5" />
            <span>Exported!</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Export Route Plan</span>
          </>
        )}
      </button>

      {/* Export format menu */}
      {showMenu && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
            <div className="py-2">
              {/* JSON option */}
              <button
                onClick={handleExportJSON}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
              >
                <FileJson className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Export as JSON</p>
                  <p className="text-xs text-gray-500">Complete route data</p>
                </div>
              </button>

              {/* CSV option */}
              <button
                onClick={handleExportCSV}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
              >
                <FileSpreadsheet className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Export as CSV</p>
                  <p className="text-xs text-gray-500">Flattened route table</p>
                </div>
              </button>
            </div>

            {/* Info footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Export includes all routes, stops, and metrics
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;

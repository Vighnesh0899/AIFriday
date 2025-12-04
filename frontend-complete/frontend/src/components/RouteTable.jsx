import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Navigation, MapPin, Clock, TrendingUp } from 'lucide-react';
import { formatDistance, formatTime, getRouteColor } from '../utils/helpers';

/**
 * RouteTable Component
 * Displays optimized routes in a collapsible table format
 * 
 * @param {Array} routes - Array of route objects with stops and metrics
 * @param {Array} deliveryPoints - Array of all delivery points for reference
 */
const RouteTable = ({ routes = [], deliveryPoints = [] }) => {
  const [expandedRoutes, setExpandedRoutes] = useState(new Set([0])); // First route expanded by default

  /**
   * Toggle route expansion
   */
  const toggleRoute = (routeIndex) => {
    const newExpanded = new Set(expandedRoutes);
    if (newExpanded.has(routeIndex)) {
      newExpanded.delete(routeIndex);
    } else {
      newExpanded.add(routeIndex);
    }
    setExpandedRoutes(newExpanded);
  };

  /**
   * Get delivery point details by ID
   */
  const getPointDetails = (pointId) => {
    return deliveryPoints.find(p => p.id === pointId) || {};
  };

  /**
   * Calculate total metrics across all routes
   */
  const getTotalMetrics = () => {
    return routes.reduce((acc, route) => ({
      stops: acc.stops + route.stops.length,
      distance: acc.distance + (route.total_distance || 0),
      time: acc.time + (route.estimated_time || 0),
    }), { stops: 0, distance: 0, time: 0 });
  };

  // If no routes, show empty state
  if (!routes || routes.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-8 text-center">
        <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">No routes generated yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Upload delivery data and click "Generate Routes" to see optimized route plans
        </p>
      </div>
    );
  }

  const totals = getTotalMetrics();

  return (
    <div className="w-full space-y-4">
      {/* Summary header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Navigation className="w-4 h-4 text-primary-600" />
              <p className="text-sm font-medium text-gray-600">Total Routes</p>
            </div>
            <p className="text-2xl font-bold text-primary-700">{routes.length}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <MapPin className="w-4 h-4 text-primary-600" />
              <p className="text-sm font-medium text-gray-600">Total Stops</p>
            </div>
            <p className="text-2xl font-bold text-primary-700">{totals.stops}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <p className="text-sm font-medium text-gray-600">Total Distance</p>
            </div>
            <p className="text-2xl font-bold text-primary-700">
              {formatDistance(totals.distance)}
            </p>
          </div>
        </div>
      </div>

      {/* Routes table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stops
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Est. Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routes.map((route, routeIndex) => (
                <React.Fragment key={`route-${routeIndex}`}>
                  {/* Route summary row */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow"
                          style={{ backgroundColor: getRouteColor(routeIndex) }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          Route {routeIndex + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{route.stops.length}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatDistance(route.total_distance || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatTime(route.estimated_time || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleRoute(routeIndex)}
                        className="text-primary-600 hover:text-primary-800 transition-colors flex items-center space-x-1"
                      >
                        {expandedRoutes.has(routeIndex) ? (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            <span className="text-sm font-medium">Hide</span>
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-sm font-medium">Show</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded route details */}
                  {expandedRoutes.has(routeIndex) && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-3">
                          {/* Route summary */}
                          {route.summary && (
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-sm text-gray-700">{route.summary}</p>
                            </div>
                          )}

                          {/* Stops list */}
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-700">
                                Stop Sequence
                              </h4>
                            </div>
                            <div className="divide-y divide-gray-200">
                              {route.stops.map((stop, stopIndex) => {
                                const pointDetails = getPointDetails(stop.id);
                                return (
                                  <div
                                    key={`stop-${routeIndex}-${stopIndex}`}
                                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="flex items-start space-x-3">
                                      {/* Stop number */}
                                      <div
                                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow"
                                        style={{ backgroundColor: getRouteColor(routeIndex) }}
                                      >
                                        {stopIndex + 1}
                                      </div>

                                      {/* Stop details */}
                                      <div className="flex-grow">
                                        <p className="text-sm font-medium text-gray-900">
                                          {pointDetails.customer_name || 'Unknown Customer'}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                          {pointDetails.address || 'No address'}
                                        </p>
                                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                          {pointDetails.delivery_window && (
                                            <div className="flex items-center space-x-1">
                                              <Clock className="w-3 h-3" />
                                              <span>{pointDetails.delivery_window}</span>
                                            </div>
                                          )}
                                          {stop.distance && (
                                            <div className="flex items-center space-x-1">
                                              <MapPin className="w-3 h-3" />
                                              <span>{formatDistance(stop.distance)} from previous</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RouteTable;

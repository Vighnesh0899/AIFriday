import Papa from 'papaparse';

/**
 * Utility functions for data processing, validation, and formatting
 */

/**
 * Parse CSV file and return JSON data
 * @param {File} file - CSV file to parse
 * @returns {Promise<Array>} Parsed data as array of objects
 */
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    });
  });
};

/**
 * Parse JSON file and return data
 * @param {File} file - JSON file to parse
 * @returns {Promise<Array>} Parsed JSON data
 */
export const parseJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(Array.isArray(data) ? data : [data]);
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Validate delivery data structure
 * @param {Array} data - Delivery data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateDeliveryData = (data) => {
  const errors = [];
  const requiredFields = ['id', 'customer_name', 'lat', 'lng', 'address'];

  if (!Array.isArray(data) || data.length === 0) {
    return { isValid: false, errors: ['Data must be a non-empty array'] };
  }

  data.forEach((item, index) => {
    requiredFields.forEach(field => {
      if (!(field in item) || item[field] === null || item[field] === undefined || item[field] === '') {
        errors.push(`Row ${index + 1}: Missing or empty field '${field}'`);
      }
    });

    // Validate coordinates
    if (item.lat && (item.lat < -90 || item.lat > 90)) {
      errors.push(`Row ${index + 1}: Invalid latitude value (${item.lat})`);
    }
    if (item.lng && (item.lng < -180 || item.lng > 180)) {
      errors.push(`Row ${index + 1}: Invalid longitude value (${item.lng})`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors.slice(0, 10) // Limit to first 10 errors
  };
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(2)} km`;
};

/**
 * Format time for display
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time string
 */
export const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${mins} min`;
  }
  return `${hours}h ${mins}m`;
};

/**
 * Generate random color for route visualization
 * @param {number} index - Route index
 * @returns {string} Hex color code
 */
export const getRouteColor = (index) => {
  const colors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Orange
  ];
  return colors[index % colors.length];
};

/**
 * Export data to JSON file
 * @param {Object} data - Data to export
 * @param {string} filename - Name of the file
 */
export const exportToJSON = (data, filename = 'route-plan.json') => {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data to CSV file
 * @param {Array} data - Data to export
 * @param {string} filename - Name of the file
 */
export const exportToCSV = (data, filename = 'route-plan.csv') => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Calculate bounds for map view from delivery points
 * @param {Array} points - Array of delivery points with lat/lng
 * @returns {Array} Bounds [[minLat, minLng], [maxLat, maxLng]]
 */
export const calculateMapBounds = (points) => {
  if (!points || points.length === 0) {
    return [[0, 0], [0, 0]];
  }

  const lats = points.map(p => p.lat);
  const lngs = points.map(p => p.lng);

  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)]
  ];
};

/**
 * Debounce function to limit function execution rate
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Format date/time string for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date/time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Validate constraints form data
 * @param {Object} constraints - Constraints object
 * @returns {Object} Validation result
 */
export const validateConstraints = (constraints) => {
  const errors = {};

  if (!constraints.maxStopsPerRoute || constraints.maxStopsPerRoute < 1) {
    errors.maxStopsPerRoute = 'Must be at least 1';
  }

  if (!constraints.vehicleCapacity || constraints.vehicleCapacity < 1) {
    errors.vehicleCapacity = 'Must be at least 1';
  }

  if (!constraints.startLocation || constraints.startLocation.trim() === '') {
    errors.startLocation = 'Start location is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

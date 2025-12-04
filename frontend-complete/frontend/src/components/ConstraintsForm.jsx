import React, { useState } from 'react';
import { Settings, MapPin, Clock, Truck } from 'lucide-react';
import { validateConstraints } from '../utils/helpers';

/**
 * ConstraintsForm Component
 * Form for entering delivery route constraints
 * 
 * @param {Object} initialConstraints - Initial constraint values
 * @param {Function} onConstraintsChange - Callback when constraints change
 */
const ConstraintsForm = ({ initialConstraints, onConstraintsChange }) => {
  const [constraints, setConstraints] = useState(initialConstraints || {
    maxStopsPerRoute: 10,
    deliveryWindowStart: '08:00',
    deliveryWindowEnd: '18:00',
    vehicleCapacity: 100,
    startLocation: '',
    startLat: '',
    startLng: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newConstraints = {
      ...constraints,
      [name]: name === 'maxStopsPerRoute' || name === 'vehicleCapacity' 
        ? parseInt(value) || '' 
        : value
    };

    setConstraints(newConstraints);

    // Validate on change
    if (touched[name]) {
      const validation = validateConstraints(newConstraints);
      setErrors(validation.errors);
    }

    // Notify parent component
    if (onConstraintsChange) {
      onConstraintsChange(newConstraints);
    }
  };

  /**
   * Handle blur event to mark field as touched
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });

    // Validate on blur
    const validation = validateConstraints(constraints);
    setErrors(validation.errors);
  };

  return (
    <div className="w-full space-y-6">
      {/* Form header */}
      <div className="flex items-center space-x-2">
        <Settings className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-800">Route Constraints</h3>
      </div>

      {/* Form grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Max Stops Per Route */}
        <div className="space-y-2">
          <label htmlFor="maxStopsPerRoute" className="label flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>Max Stops Per Route</span>
          </label>
          <input
            type="number"
            id="maxStopsPerRoute"
            name="maxStopsPerRoute"
            value={constraints.maxStopsPerRoute}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1"
            max="50"
            className={`input-field ${errors.maxStopsPerRoute ? 'border-red-500' : ''}`}
            placeholder="e.g., 10"
          />
          {errors.maxStopsPerRoute && (
            <p className="text-xs text-red-600">{errors.maxStopsPerRoute}</p>
          )}
          <p className="text-xs text-gray-500">Maximum number of delivery stops per route</p>
        </div>

        {/* Vehicle Capacity */}
        <div className="space-y-2">
          <label htmlFor="vehicleCapacity" className="label flex items-center space-x-2">
            <Truck className="w-4 h-4 text-gray-500" />
            <span>Vehicle Capacity</span>
          </label>
          <input
            type="number"
            id="vehicleCapacity"
            name="vehicleCapacity"
            value={constraints.vehicleCapacity}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1"
            className={`input-field ${errors.vehicleCapacity ? 'border-red-500' : ''}`}
            placeholder="e.g., 100"
          />
          {errors.vehicleCapacity && (
            <p className="text-xs text-red-600">{errors.vehicleCapacity}</p>
          )}
          <p className="text-xs text-gray-500">Total vehicle capacity (units/weight)</p>
        </div>

        {/* Delivery Window Start */}
        <div className="space-y-2">
          <label htmlFor="deliveryWindowStart" className="label flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>Delivery Window Start</span>
          </label>
          <input
            type="time"
            id="deliveryWindowStart"
            name="deliveryWindowStart"
            value={constraints.deliveryWindowStart}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input-field"
          />
          <p className="text-xs text-gray-500">Start time for deliveries</p>
        </div>

        {/* Delivery Window End */}
        <div className="space-y-2">
          <label htmlFor="deliveryWindowEnd" className="label flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>Delivery Window End</span>
          </label>
          <input
            type="time"
            id="deliveryWindowEnd"
            name="deliveryWindowEnd"
            value={constraints.deliveryWindowEnd}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input-field"
          />
          <p className="text-xs text-gray-500">End time for deliveries</p>
        </div>

        {/* Start Location */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="startLocation" className="label flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>Start Location (Depot/Warehouse)</span>
          </label>
          <input
            type="text"
            id="startLocation"
            name="startLocation"
            value={constraints.startLocation}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input-field ${errors.startLocation ? 'border-red-500' : ''}`}
            placeholder="e.g., Main Warehouse, 123 Business Park, City"
          />
          {errors.startLocation && (
            <p className="text-xs text-red-600">{errors.startLocation}</p>
          )}
          <p className="text-xs text-gray-500">Starting point for all routes (warehouse/depot address)</p>
        </div>

        {/* Optional: Start Coordinates */}
        <div className="space-y-2">
          <label htmlFor="startLat" className="label">
            Start Latitude (Optional)
          </label>
          <input
            type="number"
            id="startLat"
            name="startLat"
            value={constraints.startLat}
            onChange={handleChange}
            step="0.000001"
            min="-90"
            max="90"
            className="input-field"
            placeholder="e.g., 40.7128"
          />
          <p className="text-xs text-gray-500">Latitude of start location</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="startLng" className="label">
            Start Longitude (Optional)
          </label>
          <input
            type="number"
            id="startLng"
            name="startLng"
            value={constraints.startLng}
            onChange={handleChange}
            step="0.000001"
            min="-180"
            max="180"
            className="input-field"
            placeholder="e.g., -74.0060"
          />
          <p className="text-xs text-gray-500">Longitude of start location</p>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> These constraints will be used by the AI to optimize your delivery routes. 
          Adjust them based on your operational requirements.
        </p>
      </div>
    </div>
  );
};

export default ConstraintsForm;

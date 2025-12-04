import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  formatDistance,
  formatTime,
  validateDeliveryData,
  validateConstraints,
  getRouteColor,
} from '../utils/helpers';

describe('Helper Functions', () => {
  describe('calculateDistance', () => {
    it('calculates distance between two coordinates', () => {
      // New York to Los Angeles (approx 3944 km)
      const distance = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);
      expect(distance).toBeGreaterThan(3900);
      expect(distance).toBeLessThan(4000);
    });

    it('returns 0 for same coordinates', () => {
      const distance = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060);
      expect(distance).toBe(0);
    });
  });

  describe('formatDistance', () => {
    it('formats distance less than 1km in meters', () => {
      expect(formatDistance(0.5)).toBe('500 m');
      expect(formatDistance(0.123)).toBe('123 m');
    });

    it('formats distance greater than 1km', () => {
      expect(formatDistance(1.5)).toBe('1.50 km');
      expect(formatDistance(100)).toBe('100.00 km');
    });
  });

  describe('formatTime', () => {
    it('formats time less than 1 hour', () => {
      expect(formatTime(30)).toBe('30 min');
      expect(formatTime(45)).toBe('45 min');
    });

    it('formats time greater than 1 hour', () => {
      expect(formatTime(90)).toBe('1h 30m');
      expect(formatTime(125)).toBe('2h 5m');
    });

    it('formats exact hours', () => {
      expect(formatTime(60)).toBe('1h 0m');
      expect(formatTime(120)).toBe('2h 0m');
    });
  });

  describe('validateDeliveryData', () => {
    it('validates correct data structure', () => {
      const data = [
        {
          id: 1,
          customer_name: 'Test',
          lat: 40.7128,
          lng: -74.0060,
          address: '123 Main St',
        },
      ];
      const result = validateDeliveryData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects missing required fields', () => {
      const data = [
        {
          id: 1,
          customer_name: 'Test',
          // Missing lat, lng, address
        },
      ];
      const result = validateDeliveryData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('validates coordinate ranges', () => {
      const data = [
        {
          id: 1,
          customer_name: 'Test',
          lat: 100, // Invalid
          lng: -74.0060,
          address: '123 Main St',
        },
      ];
      const result = validateDeliveryData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('latitude'))).toBe(true);
    });

    it('rejects empty array', () => {
      const result = validateDeliveryData([]);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateConstraints', () => {
    it('validates correct constraints', () => {
      const constraints = {
        maxStopsPerRoute: 10,
        vehicleCapacity: 100,
        startLocation: 'Warehouse',
      };
      const result = validateConstraints(constraints);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('detects invalid max stops', () => {
      const constraints = {
        maxStopsPerRoute: 0,
        vehicleCapacity: 100,
        startLocation: 'Warehouse',
      };
      const result = validateConstraints(constraints);
      expect(result.isValid).toBe(false);
      expect(result.errors.maxStopsPerRoute).toBeDefined();
    });

    it('detects missing start location', () => {
      const constraints = {
        maxStopsPerRoute: 10,
        vehicleCapacity: 100,
        startLocation: '',
      };
      const result = validateConstraints(constraints);
      expect(result.isValid).toBe(false);
      expect(result.errors.startLocation).toBeDefined();
    });
  });

  describe('getRouteColor', () => {
    it('returns consistent colors for route indices', () => {
      const color1 = getRouteColor(0);
      const color2 = getRouteColor(1);
      expect(color1).toBeTruthy();
      expect(color2).toBeTruthy();
      expect(color1).not.toBe(color2);
    });

    it('cycles through colors for large indices', () => {
      const color1 = getRouteColor(0);
      const color2 = getRouteColor(8); // Should cycle back
      expect(color1).toBe(color2);
    });
  });
});

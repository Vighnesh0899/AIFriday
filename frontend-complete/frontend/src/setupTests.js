import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Leaflet for tests
vi.mock('leaflet', () => ({
  default: {
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn(),
      },
    },
    divIcon: vi.fn(),
    icon: vi.fn(),
  },
}));

// Mock react-leaflet components
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  Polyline: () => <div data-testid="polyline" />,
  useMap: () => ({
    fitBounds: vi.fn(),
  }),
}));

// Setup global test utilities
global.beforeEach = () => {
  // Clear all mocks before each test
  vi.clearAllMocks();
};

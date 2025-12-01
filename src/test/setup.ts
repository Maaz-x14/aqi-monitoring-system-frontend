import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// --- FIX 1: Mock react-leaflet components ---
// Instead of mocking the underlying 'leaflet' library, we mock the React components.
// This prevents the heavy map logic from running during tests.
vi.mock('react-leaflet', () => {
  return {
    MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />
    Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="marker">{children}</div>,
    Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
    useMap: () => ({
        flyTo: vi.fn(),
        setView: vi.fn(),
    }),
  };
});

// Mock ResizeObserver (Recharts needs this)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Window.scrollTo
window.scrollTo = vi.fn();
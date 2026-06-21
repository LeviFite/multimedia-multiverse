import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    // Mock localStorage.getItem to return invalid JSON
    const getItemSpy = vi.spyOn(window.localStorage.__proto__, 'getItem');
    getItemSpy.mockImplementation((key) => {
      if (key === 'demo_user') {
        return '{invalid json}';
      }
      return null;
    });

    // Mock matchMedia to prevent errors from react-bootstrap or others, if needed
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock IntersectionObserver
    class IntersectionObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: IntersectionObserverMock,
    });

    // Render the App component
    render(<App />);

    // Since the JSON parse fails, it should fallback to the initial value (null)
    // The "Log in / Sign up" button should be visible when the user is not logged in.
    expect(screen.getByText('Log in / Sign up')).toBeInTheDocument();

    getItemSpy.mockRestore();
  });
});

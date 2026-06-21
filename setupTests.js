import '@testing-library/jest-dom';

// Create a mock for IntersectionObserver
const mockIntersectionObserver = class {
  constructor(callback, options) {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.IntersectionObserver = mockIntersectionObserver;

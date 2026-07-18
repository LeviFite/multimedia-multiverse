import { vi } from 'vitest';
import '@testing-library/jest-dom';

class IntersectionObserverMock {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

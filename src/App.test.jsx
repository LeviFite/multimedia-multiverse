import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLocalStorage, fakeHash } from './App';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Restore mocks
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value when no value is in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should return parsed value when value exists in localStorage', () => {
    localStorage.setItem('testKey', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    expect(result.current[0]).toBe('stored');
  });

  it('should update localStorage when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('testKey'))).toBe('updated');
  });

  it('should return initial value and handle error when localStorage.getItem throws', () => {
    // Mock getItem to throw an error
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage is disabled');
    });

    const { result } = renderHook(() => useLocalStorage('errorKey', 'fallback'));
    expect(result.current[0]).toBe('fallback');
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('errorKey');
  });

  it('should handle error when localStorage.setItem throws', () => {
    // Mock setItem to throw an error
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage quota exceeded');
    });

    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    // The state should still update in memory even if localStorage fails
    expect(result.current[0]).toBe('new-value');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('testKey', '"new-value"');
  });
});

describe('fakeHash', () => {
  it('should generate a string hash of max length 10', () => {
    const hash = fakeHash('test@example.com');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeLessThanOrEqual(10);
  });

  it('should generate consistent hashes for the same input', () => {
    const hash1 = fakeHash('test@example.com');
    const hash2 = fakeHash('test@example.com');
    expect(hash1).toBe(hash2);
  });

  it('should generate different hashes for different inputs', () => {
    const hash1 = fakeHash('test1@example.com');
    const hash2 = fakeHash('test2@example.com');
    expect(hash1).not.toBe(hash2);
  });

  it('should handle empty strings correctly', () => {
    const hash = fakeHash('');
    expect(typeof hash).toBe('string');
    expect(hash).toBe('');
  });

  it('should handle special characters', () => {
    const hash = fakeHash('test+1@example.com');
    expect(typeof hash).toBe('string');
  });

  it('should properly encode special chars to avoid btoa errors', () => {
    const hash = fakeHash('test_unicode_✨');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });
});

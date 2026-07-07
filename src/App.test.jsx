import { describe, it, expect } from 'vitest';
import { fakeHash } from './App';

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

import { describe, it, expect } from 'vitest';
import { fakeHash } from './App.jsx';

describe('fakeHash', () => {
  it('should generate a base64 encoded string', () => {
    const input = 'test@example.com';
    const hash = fakeHash(input);
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    // Ensure it contains only valid base64 characters
    expect(/^[A-Za-z0-9+/=]+$/.test(hash)).toBe(true);
  });

  it('should slice the result to a maximum of 10 characters', () => {
    const input = 'this is a very long string that should be hashed and sliced';
    const hash = fakeHash(input);
    expect(hash.length).toBeLessThanOrEqual(10);
  });

  it('should generate deterministic hashes for the same input', () => {
    const input = 'consistent-input';
    const hash1 = fakeHash(input);
    const hash2 = fakeHash(input);
    expect(hash1).toBe(hash2);
  });

  it('should generate different hashes for different inputs', () => {
    const hash1 = fakeHash('input-A');
    const hash2 = fakeHash('input-B');
    expect(hash1).not.toBe(hash2);
  });

  it('should handle empty strings', () => {
    const hash = fakeHash('');
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
  });

  it('should handle Unicode and special characters correctly', () => {
    const input = 'hello 👋 world 🌍; !@#$%^&*()_+';
    const hash = fakeHash(input);
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeLessThanOrEqual(10);
    // Should be deterministic even with unicode
    expect(hash).toBe(fakeHash(input));
  });
});

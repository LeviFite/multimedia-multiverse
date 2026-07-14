import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Stub ENV before import
vi.stubEnv('VITE_SUPABASE_URL', 'http://localhost:54321');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'fake-key');

import Root, { fakeHash, supabase } from './App';

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

describe('AuthModals Error Path', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('displays error when signInWithPassword throws or returns error', async () => {
    expect(supabase).not.toBeNull();

    // Using mocked method via spy
    const spySignIn = vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({ data: null, error: { message: 'Fake Error Message' } });

    render(<Root />);

    // Open auth modal
    const loginBtn = screen.getByRole('button', { name: /Log in \/ Sign up/i });
    fireEvent.click(loginBtn);

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });

    const emailInput = screen.getAllByRole('textbox').find(el => el.type === 'email');
    const passwordInput = document.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: 'Log in' });
    const form = submitButton.closest('form');

    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Fake Error Message')).toBeInTheDocument();
    });

    spySignIn.mockRestore();
  });

  it('displays error when signUp throws or returns error', async () => {
    expect(supabase).not.toBeNull();

    const spySignUp = vi.spyOn(supabase.auth, 'signUp').mockResolvedValue({ data: null, error: { message: 'Email already exists mock' } });
    const spySignIn = vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({ data: { user: {} }, error: null });

    render(<Root />);

    // Open auth modal
    const loginBtn = screen.getByRole('button', { name: /Log in \/ Sign up/i });
    fireEvent.click(loginBtn);

    // Wait for modal
    await waitFor(() => {
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });

    // Switch to sign up mode
    fireEvent.click(screen.getByRole('button', { name: /New here\? Create an account/i }));

    const textboxes = screen.getAllByRole('textbox');
    const displayNameInput = textboxes.find(el => el.placeholder === 'Levi F.');
    const emailInput = textboxes.find(el => el.type === 'email');
    const passwordInput = document.querySelector('input[type="password"]');

    fireEvent.change(displayNameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: 'Sign up' });
    const form = submitButton.closest('form');

    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Email already exists mock')).toBeInTheDocument();
    });

    spySignUp.mockRestore();
    spySignIn.mockRestore();
  });
});

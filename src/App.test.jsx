import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    const elements = screen.getAllByText(/CuteForum/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('opens auth modal when clicking "Log in / Sign up" button', async () => {
    render(<App />);
    const loginButton = screen.getByRole('button', { name: /Log in \/ Sign up/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('New here? Create an account')).toBeInTheDocument();
    });
  });

  it('opens category modal when a category is clicked', async () => {
    render(<App />);

    // Find the Movies category
    const moviesCategory = screen.getByText('Movies');
    fireEvent.click(moviesCategory);

    await waitFor(() => {
      expect(screen.getByText('Movies — Top Threads')).toBeInTheDocument();
    });
  });

  it('displays forum threads title', () => {
    render(<App />);
    expect(screen.getByText(/Forum Threads/i)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Root from './App';

describe('App component', () => {
  it('renders initial Navbar Brand', () => {
    render(<Root />);

    // Check if CuteForum navbar brand is present
    const brands = screen.getAllByText(/CuteForum/i);
    expect(brands.length).toBeGreaterThan(0);
    expect(brands[0]).toBeInTheDocument();
  });

  it('renders standard navigation links', () => {
    render(<Root />);

    // Check for Home and Downloads navigation links
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Downloads/i })).toBeInTheDocument();
  });
});

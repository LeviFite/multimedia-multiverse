import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders the main app title in the navbar', () => {
    render(<App />);
    const navbarTitle = screen.getByText('CuteForum');
    expect(navbarTitle).toBeInTheDocument();
  });

  it('renders the hero section heading', () => {
    render(<App />);
    const heroHeading = screen.getByText('A cute, stylish media forum ✨');
    expect(heroHeading).toBeInTheDocument();
  });

  it('renders footer text', () => {
    render(<App />);
    const footerText = screen.getByText(/CuteForum — demo build/i);
    expect(footerText).toBeInTheDocument();
  });
});

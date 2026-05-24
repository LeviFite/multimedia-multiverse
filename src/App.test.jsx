import React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar } from './App';

describe('Avatar component', () => {
  it('renders default U when no src and no name are provided', () => {
    render(<Avatar />);
    const fallbackText = screen.getByText('U');
    expect(fallbackText).toBeInTheDocument();

    // ensure image is not rendered
    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();
  });

  it('renders the first letter of name when no src is provided', () => {
    render(<Avatar name="John Doe" />);
    const fallbackText = screen.getByText('J');
    expect(fallbackText).toBeInTheDocument();

    // ensure image is not rendered
    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();
  });

  it('renders image when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.jpg" name="Jane Doe" />);
    const img = screen.getByRole('img', { name: 'Jane Doe' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');

    // ensure fallback is not rendered
    const fallbackText = screen.queryByText('J');
    expect(fallbackText).not.toBeInTheDocument();
  });
});

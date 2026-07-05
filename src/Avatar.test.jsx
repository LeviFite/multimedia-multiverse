import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { Avatar } from './App';

describe('Avatar', () => {
  it('renders an image when src is provided', () => {
    render(<Avatar src="test-image.jpg" name="Test User" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Test User');
  });

  it('renders the first letter of the name when src is not provided', () => {
    render(<Avatar name="Test User" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('renders a default "U" when neither src nor name is provided', () => {
    render(<Avatar />);
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('applies a custom size', () => {
    const { container } = render(<Avatar size={100} />);
    const div = container.firstChild;
    expect(div).toHaveStyle({ width: '100px', height: '100px' });
  });

  it('handles empty string name when src is not provided', () => {
    render(<Avatar name="" />);
    expect(screen.getByText('U')).toBeInTheDocument();
  });
});

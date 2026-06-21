import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from './App';

describe('Avatar', () => {
  it('renders an image when src is provided', () => {
    const src = 'https://example.com/avatar.jpg';
    const name = 'John Doe';
    render(<Avatar src={src} name={name} />);

    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', src);
    expect(imgElement).toHaveAttribute('alt', name);
  });

  it('renders the first letter of the name when src is not provided', () => {
    const name = 'Jane Doe';
    render(<Avatar name={name} />);

    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders "U" when neither src nor name is provided', () => {
    render(<Avatar />);

    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('renders correctly with default size', () => {
    const { container } = render(<Avatar />);

    const avatarContainer = container.firstChild;
    expect(avatarContainer).toHaveStyle({ width: '56px', height: '56px' });
  });

  it('renders correctly with custom size', () => {
    const size = 100;
    const { container } = render(<Avatar size={size} />);

    const avatarContainer = container.firstChild;
    expect(avatarContainer).toHaveStyle({ width: '100px', height: '100px' });
  });
});

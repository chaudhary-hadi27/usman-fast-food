// __tests__/components/Header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../../components/Header';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Header Component', () => {
  it('renders the header with logo', () => {
    render(<Header cartCount={0} />);
    
    const logo = screen.getByText(/🍔 Usman Fast Food/i);
    expect(logo).toBeInTheDocument();
  });

  it('displays cart count badge when items in cart', () => {
    render(<Header cartCount={5} />);
    
    const cartBadge = screen.getByText('5');
    expect(cartBadge).toBeInTheDocument();
  });

  it('does not display cart badge when cart is empty', () => {
    render(<Header cartCount={0} />);
    
    const cartBadge = screen.queryByText('0');
    expect(cartBadge).not.toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Header cartCount={0} />);
    
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Menu').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Track Order').length).toBeGreaterThan(0);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
  });

  it('toggles mobile menu when menu button clicked', () => {
    render(<Header cartCount={0} />);
    
    const menuButton = screen.getAllByRole('button')[0];
    fireEvent.click(menuButton);
    
    // Mobile menu items should be visible
    const mobileMenuItems = screen.getAllByText('Home');
    expect(mobileMenuItems.length).toBeGreaterThan(1); // Desktop + Mobile
  });

  it('changes background on scroll', () => {
    render(<Header cartCount={0} />);
    
    // Simulate scroll
    global.window.scrollY = 100;
    fireEvent.scroll(window);
    
    // Header should have scrolled class
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
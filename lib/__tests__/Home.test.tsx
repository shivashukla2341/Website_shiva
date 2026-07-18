import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the main hero section', () => {
    // Mock Next.js router if needed for components within page
    jest.mock('next/navigation', () => ({
      useRouter() {
        return {
          push: jest.fn(),
          replace: jest.fn(),
          prefetch: jest.fn(),
        };
      },
    }));

    render(<Home />);
    
    // Check if hero heading exists (from our Phase 7 build)
    const heading = screen.getByText(/Next Generation of Shopping/i);
    expect(heading).toBeInTheDocument();
  });
});

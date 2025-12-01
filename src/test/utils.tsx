import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importing named export
import { vi } from 'vitest';

// Create a fresh QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

interface WrapperProps {
  children: React.ReactNode;
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    route?: string;
    authState?: any;
  }
) => {
  const { route = '/', authState, ...renderOptions } = options || {};

  const Wrapper = ({ children }: WrapperProps) => {
    const queryClient = createTestQueryClient();

    // Default Auth Mock
    const defaultAuth = {
      isAuthenticated: false,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
      ...authState,
    };

    return (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={defaultAuth}>
          <MemoryRouter initialEntries={[route]}>
            {children}
          </MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };
export { default as userEvent } from '@testing-library/user-event';
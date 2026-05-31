import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router'

export function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })
}

interface WrapperOptions {
    initialEntries?: string[]
    children?: ReactNode
}

export function renderWithProviders(ui: ReactElement, options?: WrapperOptions & Omit<RenderOptions, 'wrapper'>) {
    const { initialEntries = ['/'], ...renderOptions } = options ?? {}
    const queryClient = createTestQueryClient()

    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
            </QueryClientProvider>
        )
    }

    return render(ui, { wrapper: Wrapper, ...renderOptions })
}

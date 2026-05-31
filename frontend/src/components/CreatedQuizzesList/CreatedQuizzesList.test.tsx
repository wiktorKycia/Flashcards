import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import CreatedQuizzesList from './CreatedQuizzesList'
import { useCreatedQuizzes } from '@/hooks/useCreatedQuizzes.ts'

vi.mock('@/context/AuthContext.tsx', () => ({
    useAuth: () => ({ user: { id: 1, name: 'Jan' }, token: 'token', login: vi.fn(), logout: vi.fn() }),
}))

vi.mock('@/hooks/useCreatedQuizzes.ts', () => ({
    useCreatedQuizzes: vi.fn(),
}))

describe('CreatedQuizzesList', () => {
    it('displays created quizzes when data is loaded', () => {
        vi.mocked(useCreatedQuizzes).mockReturnValue({
            data: [{ id: 3, name: 'My quiz', description: 'Własny zestaw' }],
            isLoading: false,
            isError: false,
        } as ReturnType<typeof useCreatedQuizzes>)

        renderWithProviders(<CreatedQuizzesList userId={1} />)

        expect(screen.getByRole('heading', { name: 'Utworzone zestawy' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'My quiz' })).toBeInTheDocument()
    })

    it('displays empty state when user has not created any quiz', () => {
        vi.mocked(useCreatedQuizzes).mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
        } as ReturnType<typeof useCreatedQuizzes>)

        renderWithProviders(<CreatedQuizzesList userId={1} />)

        expect(screen.getByText('Nie utworzyłeś żadnego zestawu')).toBeInTheDocument()
    })
})

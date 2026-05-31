import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import SavedQuizzesList from './SavedQuizzesList'
import { useSavedQuizzes } from '@/hooks/useSavedQuizzes.ts'

vi.mock('@/hooks/useSavedQuizzes.ts', () => ({
    useSavedQuizzes: vi.fn(),
}))

describe('SavedQuizzesList', () => {
    it('displays saved quizzes when data is loaded', () => {
        vi.mocked(useSavedQuizzes).mockReturnValue({
            data: [{ id: 1, name: 'Saved quiz', description: 'Opis' }],
            isLoading: false,
            isError: false,
        } as ReturnType<typeof useSavedQuizzes>)

        renderWithProviders(<SavedQuizzesList userId={1} />)

        expect(screen.getByRole('heading', { name: 'Zapisane zestawy' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Saved quiz' })).toBeInTheDocument()
    })

    it('displays empty state when there are no saved quizzes', () => {
        vi.mocked(useSavedQuizzes).mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
        } as ReturnType<typeof useSavedQuizzes>)

        renderWithProviders(<SavedQuizzesList userId={1} />)

        expect(screen.getByText('Nie masz jeszcze zapisanych zestawów')).toBeInTheDocument()
    })
})

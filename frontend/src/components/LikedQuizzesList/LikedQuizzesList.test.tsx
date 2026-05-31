import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import LikedQuizzesList from './LikedQuizzesList'
import { useUserLikedQuizzes } from '@/hooks/useQuizLikes.ts'

vi.mock('@/hooks/useQuizLikes.ts', () => ({
    useUserLikedQuizzes: vi.fn(),
}))

describe('LikedQuizzesList', () => {
    it('displays liked quizzes when data is loaded', () => {
        vi.mocked(useUserLikedQuizzes).mockReturnValue({
            data: [{ id: 2, name: 'Liked quiz', description: 'Opis polubionego' }],
            isLoading: false,
            isError: false,
        } as ReturnType<typeof useUserLikedQuizzes>)

        renderWithProviders(<LikedQuizzesList userId={1} isSmallVersion={false} />)

        expect(screen.getByRole('heading', { name: 'Polubione zestawy' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Liked quiz' })).toBeInTheDocument()
    })

    it('displays empty state when there are no liked quizzes', () => {
        vi.mocked(useUserLikedQuizzes).mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
        } as ReturnType<typeof useUserLikedQuizzes>)

        renderWithProviders(<LikedQuizzesList userId={1} isSmallVersion={true} />)

        expect(screen.getByText('Nie masz jeszcze żadnych polubionych zestawów')).toBeInTheDocument()
    })
})

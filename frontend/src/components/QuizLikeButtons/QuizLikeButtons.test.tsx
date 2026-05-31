import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import QuizLikeButtons from './QuizLikeButtons'

vi.mock('@/context/AuthContext.tsx', () => ({
    useAuth: () => ({ user: { id: 1, name: 'Test' }, token: 'token', login: vi.fn(), logout: vi.fn() }),
}))

vi.mock('@/hooks/useQuizLikes.ts', () => ({
    useQuizLikeCounts: () => ({ data: { likes: 3, dislikes: 1 } }),
    useUserQuizLike: () => ({ data: { isLiked: null } }),
    useSetUserQuizLike: () => ({ mutateAsync: vi.fn(), isPending: false }),
    useClearUserQuizLike: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

describe('QuizLikeButtons', () => {
    it('displays like and dislike buttons with counts', () => {
        render(<QuizLikeButtons quizId={5} />)

        expect(screen.getAllByRole('button')).toHaveLength(2)
        expect(screen.getByText('3')).toBeInTheDocument()
        expect(screen.getByText('1')).toBeInTheDocument()
    })
})

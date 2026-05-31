import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import AttachedFlashcardsMode from './AttachedFlashcardsMode'

vi.mock('@/context/AuthContext.tsx', () => ({
    useAuth: () => ({ user: null, token: null, login: vi.fn(), logout: vi.fn() }),
}))

vi.mock('@/hooks/useUpdateFlashcardKnowledge.ts', () => ({
    useUpdateFlashcardKnowledge: () => ({ mutate: vi.fn() }),
}))

vi.mock('@/hooks/useResetQuizProgress.ts', () => ({
    useResetQuizProgress: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

const sampleFlashcards = [
    { database_id: 1, front: 'apple', back: 'jabłko', isKnown: false },
    { database_id: 2, front: 'pear', back: 'gruszka', isKnown: true },
]

describe('AttachedFlashcardsMode', () => {
    it('displays flashcard content when flashcards are provided', () => {
        renderWithProviders(<AttachedFlashcardsMode quizId={1} flashcards={sampleFlashcards} />)

        expect(screen.getByText('apple')).toBeInTheDocument()
        expect(screen.getByText('jabłko')).toBeInTheDocument()
        expect(screen.getByText('1 / 2')).toBeInTheDocument()
    })

    it('displays a message when there are no flashcards', () => {
        renderWithProviders(<AttachedFlashcardsMode quizId={1} flashcards={[]} />)

        expect(screen.getByText('Ten quiz jeszcze nie ma fiszek')).toBeInTheDocument()
    })
})

import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import QuizPreview from './QuizPreview'

vi.mock('@/hooks/useCheckIfLoggedIn.ts', () => ({
    useCheckIfLoggedIn: () => false,
}))

vi.mock('@/context/AuthContext.tsx', () => ({
    useAuth: () => ({ user: null, token: null, login: vi.fn(), logout: vi.fn() }),
}))

vi.mock('@/hooks/useQuizLikes.ts', () => ({
    useUserQuizLike: () => ({ data: undefined, isLoading: false, error: null }),
}))

describe('QuizPreview', () => {
    it('displays the quiz preview information', () => {
        renderWithProviders(
            <QuizPreview
                quizId={1}
                quizName="Podstawy angielskiego"
                quizDescription="Słownictwo na start"
                likes={10}
                dislikes={2}
            />
        )

        expect(screen.getByRole('heading', { name: 'Podstawy angielskiego' })).toBeInTheDocument()
        expect(screen.getByText('Słownictwo na start')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Otwórz zestaw' })).toBeInTheDocument()
        expect(screen.getByText('10')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
    })
})

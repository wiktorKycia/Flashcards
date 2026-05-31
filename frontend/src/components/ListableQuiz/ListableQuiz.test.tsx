import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import ListableQuiz from './ListableQuiz'

describe('ListableQuiz', () => {
    it('displays the quiz name and description', () => {
        renderWithProviders(<ListableQuiz id={1} name="Animals" description="Basic vocabulary" />)

        expect(screen.getByRole('heading', { name: 'Animals' })).toBeInTheDocument()
        expect(screen.getByText('Basic vocabulary')).toBeInTheDocument()
    })

    it('links to the quiz page', () => {
        renderWithProviders(<ListableQuiz id={42} name="Travel" description="" />)

        expect(screen.getByRole('link', { name: /travel/i })).toHaveAttribute('href', '/quiz/42')
    })
})

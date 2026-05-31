import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import ListedFlashcards from './ListedFlashcards'

describe('ListedFlashcards', () => {
    it('displays the flashcards heading and cards', () => {
        renderWithProviders(
            <ListedFlashcards
                flashcards={[
                    { database_id: 1, front: 'cat', back: 'kot' },
                    { database_id: 2, front: 'dog', back: 'pies' },
                ]}
            />
        )

        expect(screen.getByRole('heading', { name: 'Fiszki' })).toBeInTheDocument()
        expect(screen.getByText('cat')).toBeInTheDocument()
        expect(screen.getByText('pies')).toBeInTheDocument()
    })
})

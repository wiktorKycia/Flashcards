import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ListableFlashcard from './ListableFlashcard'

describe('ListableFlashcard', () => {
    it('displays the front and back text', () => {
        render(<ListableFlashcard front="dog" back="pies" />)

        expect(screen.getByText('dog')).toBeInTheDocument()
        expect(screen.getByText('pies')).toBeInTheDocument()
    })
})

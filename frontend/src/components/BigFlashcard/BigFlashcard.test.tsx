import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BigFlashcard from './BigFlashcard'

describe('BigFlashcard', () => {
    it('displays the front and back of the flashcard', () => {
        render(<BigFlashcard front="hello" back="cześć" isFront={true} handleOnClick={vi.fn()} />)

        expect(screen.getByText('hello')).toBeInTheDocument()
        expect(screen.getByText('cześć')).toBeInTheDocument()
    })
})

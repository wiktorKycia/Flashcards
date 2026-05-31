import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Container from './Container'

describe('Container', () => {
    it('displays its children', () => {
        render(<Container>Flashcards content</Container>)

        expect(screen.getByText('Flashcards content')).toBeInTheDocument()
    })

    it('applies a custom class name when provided', () => {
        render(<Container cssClassName="custom-wrapper">Nested</Container>)

        const wrapper = screen.getByText('Nested').parentElement
        expect(wrapper).toHaveClass('custom-wrapper')
    })
})

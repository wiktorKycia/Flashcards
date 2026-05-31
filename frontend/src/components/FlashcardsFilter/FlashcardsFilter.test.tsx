import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FlashcardsFilter from './FlashcardsFilter'

describe('FlashcardsFilter', () => {
    it('displays the filter button text', () => {
        render(<FlashcardsFilter buttonText="Wszystkie" isSelected={true} toggleFn={vi.fn()} />)

        expect(screen.getByRole('button', { name: 'Wszystkie' })).toBeInTheDocument()
    })

    it('calls toggleFn when the button is clicked', async () => {
        const user = userEvent.setup()
        const toggleFn = vi.fn()

        render(<FlashcardsFilter buttonText="Nieznane" isSelected={false} toggleFn={toggleFn} />)
        await user.click(screen.getByRole('button', { name: 'Nieznane' }))

        expect(toggleFn).toHaveBeenCalledOnce()
    })
})

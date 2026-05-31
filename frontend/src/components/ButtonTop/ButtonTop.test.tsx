import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ButtonTop from './ButtonTop'

describe('ButtonTop', () => {
    it('displays the scroll to top button', () => {
        render(<ButtonTop />)

        expect(screen.getByRole('button', { name: 'Scroll to top' })).toBeInTheDocument()
    })

    it('scrolls to the top when clicked', async () => {
        const user = userEvent.setup()
        const scrollTo = vi.fn()
        vi.spyOn(window, 'scrollTo').mockImplementation(scrollTo)

        render(<ButtonTop />)
        await user.click(screen.getByRole('button', { name: 'Scroll to top' }))

        expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })
})

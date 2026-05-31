import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ButtonToggle from './ButtonToggle'

describe('ButtonToggle', () => {
    it('displays the toggle label', () => {
        render(<ButtonToggle isOn={false} setIsOn={vi.fn()} content="Show answers" />)

        expect(screen.getByRole('button', { name: 'Show answers' })).toBeInTheDocument()
    })

    it('calls setIsOn when clicked', async () => {
        const user = userEvent.setup()
        const setIsOn = vi.fn()

        render(<ButtonToggle isOn={false} setIsOn={setIsOn} content="Flip card" />)

        await user.click(screen.getByRole('button', { name: 'Flip card' }))

        expect(setIsOn).toHaveBeenCalledOnce()
    })
})

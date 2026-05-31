import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ThemeToggler from './ThemeToggler'

describe('ThemeToggler', () => {
    it('displays the theme toggle button', () => {
        render(<ThemeToggler toggleFn={vi.fn()} isLight={true} />)

        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('calls toggleFn when clicked', async () => {
        const user = userEvent.setup()
        const toggleFn = vi.fn()

        render(<ThemeToggler toggleFn={toggleFn} isLight={false} />)
        await user.click(screen.getByRole('button'))

        expect(toggleFn).toHaveBeenCalledOnce()
    })
})

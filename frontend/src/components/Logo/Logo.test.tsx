import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import Logo from './Logo'

describe('Logo', () => {
    it('displays the application logo', () => {
        renderWithProviders(<Logo />)

        expect(screen.getByRole('link')).toHaveAttribute('href', '/')
        expect(screen.getByAltText('logo')).toBeInTheDocument()
    })
})

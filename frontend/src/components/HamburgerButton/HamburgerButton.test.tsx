import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HamburgerButton from './HamburgerButton'

describe('HamburgerButton', () => {
    it('displays the hamburger placeholder', () => {
        const { container } = render(<HamburgerButton />)

        expect(container.firstElementChild).toBeInTheDocument()
    })
})

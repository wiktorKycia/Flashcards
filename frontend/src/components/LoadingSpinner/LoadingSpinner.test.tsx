import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LoadingSpinner from './LoadingSpinner'

describe('LoadingSpinner', () => {
    it('displays the loading spinner', () => {
        const { container } = render(<LoadingSpinner />)

        expect(container).not.toBeEmptyDOMElement()
        expect(container.firstElementChild?.childElementCount).toBe(1)
    })
})

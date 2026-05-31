import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import MatchCard from './MatchCard'

describe('MatchCard', () => {
    it('displays the card content', () => {
        render(<MatchCard content="kot" status="idle" onClick={vi.fn()} />)

        expect(screen.getByText('kot')).toBeInTheDocument()
    })

    it('calls onClick when idle card is clicked', async () => {
        const user = userEvent.setup()
        const onClick = vi.fn()

        render(<MatchCard content="pies" status="idle" onClick={onClick} />)
        await user.click(screen.getByText('pies'))

        expect(onClick).toHaveBeenCalledOnce()
    })
})

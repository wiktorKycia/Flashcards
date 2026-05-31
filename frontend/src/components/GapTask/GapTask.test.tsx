import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import GapTask from './GapTask'

describe('GapTask', () => {
    it('displays the gap input for the task', () => {
        render(
            <GapTask
                task={{ sentence: 'The cat sat on the ___.', phrase: 'mat' }}
                taskId="gap-1"
                value=""
                isFirstLetter={false}
                onChange={vi.fn()}
                isFinished={false}
            />
        )

        expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
})

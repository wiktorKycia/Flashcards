import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SingleChoiceTask from './SingleChoiceTask'

describe('SingleChoiceTask', () => {
    it('displays all answer options', () => {
        render(
            <SingleChoiceTask
                task={{
                    sentence: 'She ___ to school.',
                    phrase1: 'goes',
                    phrase2: 'go',
                    phrase3: 'going',
                    correctAnswer: 'goes',
                }}
                taskId="sc-1"
                selectedValue=""
                onChange={vi.fn()}
                isFinished={false}
            />
        )

        expect(screen.getByLabelText('goes')).toBeInTheDocument()
        expect(screen.getByLabelText('go')).toBeInTheDocument()
        expect(screen.getByLabelText('going')).toBeInTheDocument()
    })
})

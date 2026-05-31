import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import KnowledgeTestSetup from './KnowledgeTestSetup'

describe('KnowledgeTestSetup', () => {
    it('displays the test configuration form', () => {
        render(<KnowledgeTestSetup onSubmitSettings={vi.fn()} />)

        expect(screen.getByText(/Wybierz liczbę pytań z luką/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Rozpocznij' })).toBeInTheDocument()
        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('submits the selected settings', async () => {
        const user = userEvent.setup()
        const onSubmitSettings = vi.fn()

        render(<KnowledgeTestSetup onSubmitSettings={onSubmitSettings} />)
        await user.click(screen.getByRole('button', { name: 'Rozpocznij' }))

        expect(onSubmitSettings).toHaveBeenCalledWith({
            fillGapCount: 5,
            firstLetterCount: 5,
            singleChoiceCount: 5,
            flashcardsSide: 'FRONT',
        })
    })
})

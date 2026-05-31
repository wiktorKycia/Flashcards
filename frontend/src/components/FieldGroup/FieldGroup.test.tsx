import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FieldGroup from './FieldGroup'

describe('FieldGroup', () => {
    it('displays the label and input', () => {
        render(
            <FieldGroup
                labelText="Term"
                inputHTMLId="term"
                inputType="text"
                inputValue="hello"
                onInputChange={vi.fn()}
                isVertical={true}
            />
        )

        expect(screen.getByLabelText('Term')).toBeInTheDocument()
        expect(screen.getByDisplayValue('hello')).toBeInTheDocument()
    })

    it('notifies parent when the input changes', async () => {
        const user = userEvent.setup()
        const onInputChange = vi.fn()

        render(
            <FieldGroup
                labelText="Definition"
                inputHTMLId="definition"
                inputType="text"
                inputValue=""
                onInputChange={onInputChange}
                isVertical={false}
            />
        )

        await user.type(screen.getByLabelText('Definition'), 'world')

        expect(onInputChange).toHaveBeenCalled()
    })
})

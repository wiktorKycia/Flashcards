import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import KnowledgeTestView from './KnowledgeTestView'

describe('KnowledgeTestView', () => {
    it('displays the knowledge test sections and check button', () => {
        renderWithProviders(
            <KnowledgeTestView
                data={{
                    fillGap: {
                        data: [{ sentence: 'I ___ tea.', phrase: 'like' }],
                    },
                    firstLetterGap: null,
                    singleChoice: {
                        data: [
                            {
                                sentence: 'They ___ happy.',
                                phrase1: 'are',
                                phrase2: 'is',
                                phrase3: 'am',
                                correctAnswer: 'are',
                            },
                        ],
                    },
                    status: null,
                    errorMessage: null,
                    warning: null,
                }}
            />
        )

        expect(screen.getByRole('heading', { name: 'Wypełnij luki' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Wybierz poprawne uzupełnienie luki' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Sprawdź' })).toBeInTheDocument()
    })
})

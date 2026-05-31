import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import ToolBar from './ToolBar'

describe('ToolBar', () => {
    it('displays the sidebar navigation and sections', () => {
        renderWithProviders(<ToolBar />)

        expect(screen.getByRole('link', { name: 'Strona główna' })).toBeInTheDocument()
        expect(screen.getByText('Zasoby')).toBeInTheDocument()
        expect(screen.getByText('Ostatnie quizy')).toBeInTheDocument()
        expect(screen.getByText('quiz1')).toBeInTheDocument()
    })
})

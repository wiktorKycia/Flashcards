import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import Person from './Person'

vi.mock('@/hooks/useUserProfilePicture', () => ({
    useUserProfilePicture: () => ({ data: undefined }),
}))

describe('Person', () => {
    it('displays the person name and title', () => {
        renderWithProviders(<Person id={7} name="Anna Kowalska" title="Nauczyciel" />)

        expect(screen.getByRole('link', { name: 'Anna Kowalska' })).toBeInTheDocument()
        expect(screen.getByText('Nauczyciel')).toBeInTheDocument()
        expect(screen.getByAltText('profile picture')).toBeInTheDocument()
    })
})

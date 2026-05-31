import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import SearchBar from './SearchBar'

const navigateMock = vi.fn()

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router')
    return {
        ...actual,
        useNavigate: () => navigateMock,
    }
})

function renderSearchBar(initialEntries = ['/']) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <SearchBar />
        </MemoryRouter>
    )
}

describe('SearchBar', () => {
    it('displays the search input', () => {
        renderSearchBar()

        expect(screen.getByRole('searchbox')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Wyszukaj zestaw fiszek...')).toBeInTheDocument()
    })

    it('navigates with the query when the form is submitted', async () => {
        const user = userEvent.setup()
        navigateMock.mockClear()

        renderSearchBar()

        const searchbox = screen.getByRole('searchbox')
        await user.type(searchbox, 'animals{Enter}')

        expect(navigateMock).toHaveBeenCalledWith('/?search=animals')
    })
})

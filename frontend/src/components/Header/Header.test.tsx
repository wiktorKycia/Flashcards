import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import Header from './Header'

vi.mock('@/hooks/useTheme.ts', () => ({
    default: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}))

vi.mock('@/hooks/useCheckIfLoggedIn.ts', () => ({
    useCheckIfLoggedIn: () => false,
}))

vi.mock('@/context/AuthContext.tsx', () => ({
    useAuth: () => ({ user: null, token: null, login: vi.fn(), logout: vi.fn() }),
}))

vi.mock('@/hooks/useUserProfilePicture.ts', () => ({
    useUserProfilePicture: () => ({ data: undefined }),
}))

vi.mock('@/hooks/useCreateQuiz.ts', () => ({
    default: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('Header', () => {
    it('displays the main header with search and logo', () => {
        renderWithProviders(<Header />)

        expect(screen.getByRole('banner')).toBeInTheDocument()
        expect(screen.getByAltText('logo')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Wyszukaj zestaw fiszek...')).toBeInTheDocument()
    })
})

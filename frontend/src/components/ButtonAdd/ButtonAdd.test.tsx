import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import ButtonAdd from './ButtonAdd'

const navigateMock = vi.fn()

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
    return {
        ...actual,
        useNavigate: () => navigateMock,
    }
})

vi.mock('@/context/AuthContext.tsx', () => ({
    useAuth: () => ({ user: null, token: null, login: vi.fn(), logout: vi.fn() }),
}))

vi.mock('@/hooks/useCreateQuiz.ts', () => ({
    default: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('ButtonAdd', () => {
    beforeEach(() => {
        navigateMock.mockClear()
    })

    it('displays the create quiz button', () => {
        renderWithProviders(<ButtonAdd />)

        expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
        expect(screen.getByText('Stwórz quiz')).toBeInTheDocument()
    })

    it('redirects to login when user is not authenticated', async () => {
        const user = userEvent.setup()
        renderWithProviders(<ButtonAdd />)

        await user.click(screen.getByRole('button', { name: '+' }))

        expect(navigateMock).toHaveBeenCalledWith('/login')
    })
})

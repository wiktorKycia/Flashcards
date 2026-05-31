import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AvatarUpload from './AvatarUpload'

vi.mock('@/hooks/useUploadAvatar', () => ({
    useUploadAvatar: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/hooks/useUserProfilePicture', () => ({
    useUserProfilePicture: () => ({ data: undefined }),
}))

describe('AvatarUpload', () => {
    it('displays the avatar upload section', () => {
        render(<AvatarUpload userId={1} />)

        expect(screen.getByRole('heading', { name: 'Zdjęcie profilowe' })).toBeInTheDocument()
        expect(screen.getByAltText('Profile avatar')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Wybierz plik' })).toBeInTheDocument()
    })
})

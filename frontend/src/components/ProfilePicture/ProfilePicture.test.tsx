import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ProfilePicture from './ProfilePicture'

vi.mock('@/hooks/useUserProfilePicture', () => ({
    useUserProfilePicture: () => ({ data: undefined }),
}))

describe('ProfilePicture', () => {
    it('displays the profile picture image', () => {
        render(<ProfilePicture userId={1} />)

        expect(screen.getByAltText('profile picture')).toBeInTheDocument()
    })
})

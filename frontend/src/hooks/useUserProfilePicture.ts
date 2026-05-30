import { useQuery } from '@tanstack/react-query'

export function useUserProfilePicture(userId?: number | null) {
    return useQuery({
        queryKey: ['userAvatar', userId],
        queryFn: async () => {
            if (!userId) return null
            const response = await fetch(`/api/users/${userId}/avatar`)
            if (!response.ok) {
                if (response.status === 404) {
                    return null // User has no avatar, use default
                }
                throw new Error('Failed to fetch avatar')
            }
            const blob = await response.blob()
            return URL.createObjectURL(blob)
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000 // 5 minutes cache
    })
}


import { useQuery } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/api'
import resolvePromise from '@/lib/resolvePromise'

interface UserName {
    id: number
    name: string
    email: string
    path_to_img?: string
}

const getUserName = async (userId: number): Promise<UserName> => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`)
    return resolvePromise<UserName>(response)
}

export const useUserName = (userId: number) => {
    return useQuery({
        queryKey: ['userName', userId],
        queryFn: () => getUserName(userId),
        enabled: !!userId
    })
}

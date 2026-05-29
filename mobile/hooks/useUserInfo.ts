import { useQuery } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/auth'
import resolvePromise from '@/lib/resolvePromise'

export interface UserInfo {
    id: number
    name: string
    email: string
    path_to_img: string
}

const getUserInfo = async (userId: number): Promise<UserInfo> => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`)
    return resolvePromise<UserInfo>(response)
}

export const useUserInfo = (id?: number | null) => {
    return useQuery({
        queryKey: ['userInfo', id],
        queryFn: () => getUserInfo(id as number),
        enabled: typeof id === 'number'
    })
}

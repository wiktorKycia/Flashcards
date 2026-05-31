import { useQuery } from '@tanstack/react-query'
import resolvePromise from '@/helpers/resolvePromise'

interface User {
    id: number
    name: string
    email: string
    path_to_img?: string
}

const getUserName = async (userId: number): Promise<User> => {
    const response = await fetch(`/api/users/${userId}`)
    return resolvePromise<User>(response)
}

export const useUserName = (userId: number) => {
    return useQuery({
        queryKey: ['userName', userId],
        queryFn: () => getUserName(userId),
        enabled: !!userId
    })
}

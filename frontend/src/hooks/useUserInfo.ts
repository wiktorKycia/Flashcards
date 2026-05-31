import { useQuery } from '@tanstack/react-query'
import resolvePromise from '@/helpers/resolvePromise.ts'

const getData = async (userId: number): Promise<UserInfo> => {
    const user = await fetch(`/api/users/${userId}`)

    return resolvePromise(user)
}

export const useUserInfo = (id?: number | null) => {
    return useQuery({
        queryKey: ['userInfo', id],
        queryFn: () => getData(id as number),
        enabled: typeof id === 'number'
    })
}

interface UserInfo {
    id: number
    name: string
    email: string
    path_to_img: string
}

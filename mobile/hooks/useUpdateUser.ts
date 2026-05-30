import { useMutation, useQueryClient } from '@tanstack/react-query'

import { API_BASE_URL } from '@/lib/auth'

interface UpdateUserVariables {
    id: number
    name: string
    email: string
}

interface UpdatedUser {
    id: number
    name: string
    email: string
    path_to_img: string | null
}

const updateUser = async ({
    id,
    name,
    email
}: UpdateUserVariables): Promise<UpdatedUser> => {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, email }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateUser,
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({
                queryKey: ['userInfo', variables.id]
            })
            void queryClient.invalidateQueries({
                queryKey: ['userName', variables.id]
            })
        }
    })
}

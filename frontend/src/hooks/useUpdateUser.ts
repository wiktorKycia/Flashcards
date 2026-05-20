import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UpdateUserVariables {
    id: number
    name: string
    email: string
}

const updateUser = async ({ id, name, email }: UpdateUserVariables): Promise<UpdatedUser> => {
    const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            name,
            email
        }),
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
            return queryClient.invalidateQueries({ queryKey: ['userInfo', variables.id] })
        }
    })
}

interface UpdatedUser {
    id: number
    name: string
    email: string
    path_to_img: string | null
}

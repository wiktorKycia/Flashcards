import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'

interface ChangePasswordVariables {
    id: number
    currentPassword: string
    newPassword: string
}

interface ChangePasswordResponse {
    message: string
}

const changePassword = async ({ id, currentPassword, newPassword, token }: ChangePasswordVariables & { token: string | null }): Promise<ChangePasswordResponse> => {
    if (!token) {
        throw new Error('Missing token')
    }

    const response = await fetch(`/api/users/${id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useChangePassword = () => {
    const { token } = useAuth()

    return useMutation({
        mutationFn: (variables: ChangePasswordVariables) => changePassword({ ...variables, token })
    })
}


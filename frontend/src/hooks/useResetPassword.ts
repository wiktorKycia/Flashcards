import { useMutation } from '@tanstack/react-query'

interface ResetPasswordVariables {
    token: string
    password: string
}

interface ResetPasswordResponse {
    message: string
}

const resetPassword = async ({ token, password }: ResetPasswordVariables): Promise<ResetPasswordResponse> => {
    const response = await fetch('/api/users/password/reset', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword
    })
}


import { useMutation } from '@tanstack/react-query'

interface RequestPasswordResetVariables {
    email: string
}

interface RequestPasswordResetResponse {
    message: string
}

const requestPasswordReset = async ({ email }: RequestPasswordResetVariables): Promise<RequestPasswordResetResponse> => {
    const response = await fetch('/api/users/password/forgot', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useRequestPasswordReset = () => {
    return useMutation({
        mutationFn: requestPasswordReset
    })
}

